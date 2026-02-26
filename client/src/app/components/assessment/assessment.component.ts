import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService, Job } from '../../services/job.service';

interface Question {
  text: string;
  answer: string;
}

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css'],
  standalone: false
})
export class AssessmentComponent implements OnInit {
  jobId = '';
  job: Job | null = null;
  loading = true;
  submitting = false;
  submitted = false;
  error = '';

  coverLetter = '';

  questions: Question[] = [
    { text: 'Why are you interested in this role?', answer: '' },
    { text: 'Describe a relevant project or experience that makes you a strong candidate.', answer: '' },
    { text: 'What is your expected availability / start date?', answer: '' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService
  ) { }

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
      }
    });
  }

  get allAnswered(): boolean {
    return this.questions.every(q => q.answer.trim().length > 0) && this.coverLetter.trim().length > 0;
  }

  submit() {
    if (!this.allAnswered || this.submitting) return;
    this.submitting = true;

    const payload = {
      coverLetter: this.coverLetter,
      assessmentAnswers: this.questions.map(q => ({ question: q.text, answer: q.answer }))
    };

    this.jobService.applyToJob(this.jobId, payload).subscribe({
      next: () => {
        this.submitting = false;
        this.submitted = true;
      },
      error: (err: any) => {
        this.submitting = false;
        this.error = err?.error?.message || 'Submission failed. Please try again.';
      }
    });
  }

  goBack() {
    this.router.navigate(['/jobs']);
  }
}
