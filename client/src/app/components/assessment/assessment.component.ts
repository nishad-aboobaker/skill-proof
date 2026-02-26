import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JobService, Job } from '../../services/job.service';
import { ProctorService, Violation } from '../../services/proctor.service';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css'],
  standalone: false
})
export class AssessmentComponent implements OnInit, OnDestroy {
  @ViewChild('webcamVideo') webcamVideoRef!: ElementRef<HTMLVideoElement>;

  // Route / job state
  jobId = '';
  job: Job | null = null;
  loading = true;
  error = '';

  // Assessment flow state
  consentGiven = false;
  submitting = false;
  submitted = false;

  // Form fields
  coverLetter = '';

  // Proctoring state
  violationCount = 0;
  flagged = false;
  readonly MAX_VIOLATIONS = 3;
  activeToast: string | null = null;
  private toastTimer: any;

  webcamStream: MediaStream | null = null;
  webcamDenied = false;

  private proctoSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private proctor: ProctorService
  ) { }

  ngOnInit() {
    this.jobId = this.route.snapshot.paramMap.get('jobId') || '';
    if (!this.jobId) {
      this.router.navigate(['/jobs']);
      return;
    }
    this.jobService.getJobById(this.jobId).subscribe({
      next: (res: any) => { this.job = res.data; this.loading = false; },
      error: () => { this.error = 'Could not load job details.'; this.loading = false; }
    });
  }

  // ── Consent ──────────────────────────────────────────────────────────────
  async giveConsent() {
    this.consentGiven = true;
    await this.startWebcam();
    this.startProctoring();
  }

  // ── Webcam ───────────────────────────────────────────────────────────────
  private async startWebcam() {
    try {
      this.webcamStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      // Attach stream after view renders
      setTimeout(() => {
        if (this.webcamVideoRef?.nativeElement && this.webcamStream) {
          this.webcamVideoRef.nativeElement.srcObject = this.webcamStream;
        }
      }, 100);
    } catch {
      this.webcamDenied = true;
      // Still allow assessment but note refusal
      this.violationCount++;
    }
  }

  private stopWebcam() {
    this.webcamStream?.getTracks().forEach(t => t.stop());
    this.webcamStream = null;
  }

  // ── Proctoring ───────────────────────────────────────────────────────────
  private startProctoring() {
    this.proctor.startProctoring();
    this.proctoSub = this.proctor.violations$.subscribe((v: Violation) => this.onViolation(v));
  }

  private onViolation(v: Violation) {
    this.violationCount++;
    this.showToast(v.message);
    if (this.violationCount >= this.MAX_VIOLATIONS) {
      this.flagged = true;
    }
  }

  showToast(message: string) {
    clearTimeout(this.toastTimer);
    this.activeToast = message;
    this.toastTimer = setTimeout(() => { this.activeToast = null; }, 3500);
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  get allAnswered(): boolean {
    return this.coverLetter.trim().length > 0;
  }

  submit() {
    if (!this.allAnswered || this.submitting) return;
    this.submitting = true;

    const payload = {
      coverLetter: this.coverLetter,
      violationCount: this.violationCount,
      flagged: this.flagged,
    };

    this.jobService.applyToJob(this.jobId, payload).subscribe({
      next: () => {
        this.submitting = false;
        this.submitted = true;
        this.cleanup();
      },
      error: (err: any) => {
        this.submitting = false;
        this.error = err?.error?.message || 'Submission failed. Please try again.';
      }
    });
  }

  goBack() {
    this.cleanup();
    this.router.navigate(['/jobs']);
  }

  private cleanup() {
    this.proctor.stopProctoring();
    this.proctoSub?.unsubscribe();
    this.stopWebcam();
    clearTimeout(this.toastTimer);
  }

  ngOnDestroy() {
    this.cleanup();
  }

  getCurrencySymbol(code: string): string {
    const map: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥' };
    return map[code] || code;
  }
}
