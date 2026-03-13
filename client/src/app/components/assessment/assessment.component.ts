import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JobService, Job } from '../../services/job.service';
import { ProctorService, Violation } from '../../services/proctor.service';
import { AssessmentAiService } from 'src/app/services/assessment-ai.service';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css'],
  standalone: false,
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
  assessmentQuestion: any = null;
  questionLoading = false;

  // Form fields
  coverLetter = '';
  monacoEditor: any;

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
    private proctor: ProctorService,
    private assessmentAiService: AssessmentAiService,
  ) {}

  ngOnInit() {
    this.jobId = this.route.snapshot.paramMap.get('jobId') || '';
    if (!this.jobId) {
      this.router.navigate(['/jobs']);
      return;
    }
    this.jobService.getJobById(this.jobId).subscribe({
      next: (res: any) => {
        this.job = res.data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load job details.';
        this.loading = false;
      },
    });
  }

  initMonaco() {
    if ((window as any).monaco) {
      this.createEditor();
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js';
    script.onload = () => {
      (window as any).require.config({
        paths: {
          vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs',
        },
      });
      (window as any).require(['vs/editor/editor.main'], () => {
        this.createEditor();
      });
    };
    document.body.appendChild(script);
  }

  createEditor() {
    const container = document.getElementById('monaco-editor-container');
    if (!container) return;

    this.monacoEditor = (window as any).monaco.editor.create(container, {
      value: '',
      language: 'javascript',
      theme: 'vs-dark',
      fontSize: 14,
      fontFamily: 'Consolas, "Courier New", monospace',
      wordWrap: 'on',
      minimap: { enabled: false },
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      automaticLayout: true,
      renderLineHighlight: 'all',
      padding: { top: 12, bottom: 12 },
      overviewRulerLanes: 0,
    });

    this.monacoEditor.onDidPaste(() => {
      this.monacoEditor.trigger('keyboard', 'undo', null);
      this.showToast('Pasting is not allowed during the assessment!');
    });

    this.monacoEditor.onKeyDown((e: any) => {
      const isCopy = (e.ctrlKey || e.metaKey) && e.keyCode === 33;
      const isPaste = (e.ctrlKey || e.metaKey) && e.keyCode === 52;
      const isCut = (e.ctrlKey || e.metaKey) && e.keyCode === 54;

      if (isCopy || isPaste || isCut) {
        e.preventDefault();
        e.stopPropagation();
        if (isPaste || isCut) {
          this.showToast('Copy/paste is not allowed during the assessment!');
        }
      }
    });
  }

  // ── Consent ──────────────────────────────────────────────────────────────
  async giveConsent() {
    this.consentGiven = true;
    await this.startWebcam();
    this.startProctoring();
    this.loadAssessmentQuestion();
    setTimeout(() => this.initMonaco(), 100);
  }

  //assessment question request
  loadAssessmentQuestion() {
    this.questionLoading = true;
    this.assessmentAiService.generateQuestion(this.jobId).subscribe({
      next: (res: any) => {
        this.assessmentQuestion = res.question;
        this.questionLoading = false;
        // Set function signature as starter code in Monaco
        if (res.question?.functionSignature) {
          setTimeout(() => {
            this.monacoEditor?.setValue(res.question.functionSignature);
          }, 200);
        }
      },
      error: () => {
        this.assessmentQuestion = null;
        this.questionLoading = false;
      },
    });
  }

  // ── Webcam ───────────────────────────────────────────────────────────────
  private async startWebcam() {
    try {
      this.webcamStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
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
    this.webcamStream?.getTracks().forEach((t) => t.stop());
    this.webcamStream = null;
  }

  // ── Proctoring ───────────────────────────────────────────────────────────
  private startProctoring() {
    this.proctor.startProctoring();
    this.proctoSub = this.proctor.violations$.subscribe((v: Violation) =>
      this.onViolation(v),
    );
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
    this.toastTimer = setTimeout(() => {
      this.activeToast = null;
    }, 3500);
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  get allAnswered(): boolean {
    if (!this.monacoEditor) return false;
    const value = this.monacoEditor.getValue().trim();
    const starter = this.assessmentQuestion?.functionSignature?.trim() || '';
    // Must have content AND must be different from the starter code
    return value.length > 0 && value !== starter;
  }

 submit() {
    if (!this.allAnswered || this.submitting) return;
    this.submitting = true;

    const answer = this.monacoEditor ? this.monacoEditor.getValue() : '';

    const payload = {
        coverLetter: this.coverLetter,
        violationCount: this.violationCount,
        flagged: this.flagged,
        assessmentAnswers: [
            {
                question: this.assessmentQuestion
                    ? `${this.assessmentQuestion.title}: ${this.assessmentQuestion.description}`
                    : '',
                answer: answer
            }
        ]
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
    this.monacoEditor?.dispose();
    this.proctor.stopProctoring();
    this.proctoSub?.unsubscribe();
    this.stopWebcam();
    clearTimeout(this.toastTimer);
  }

  ngOnDestroy() {
    this.cleanup();
  }

  getCurrencySymbol(code: string): string {
    const map: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      JPY: '¥',
    };
    return map[code] || code;
  }
}
