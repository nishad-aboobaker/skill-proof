import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../services/job.service';

@Component({
    selector: 'app-post-job',
    templateUrl: './post-job.component.html',
    styleUrls: ['./post-job.component.css'],
    standalone: false
})
export class PostJobComponent implements OnInit {
    jobForm: FormGroup;
    loading = false;
    error = '';
    success = '';

    jobTypes = [
        { value: 'full-time', label: 'Full Time' },
        { value: 'part-time', label: 'Part Time' },
        { value: 'contract', label: 'Contract' },
        { value: 'internship', label: 'Internship' }
    ];

    currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY'];

    constructor(
        private fb: FormBuilder,
        private jobService: JobService,
        private router: Router
    ) {
        this.jobForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(5)]],
            type: ['full-time', Validators.required],
            location: ['', Validators.required],
            remote: [false],
            salary: this.fb.group({
                min: [null],
                max: [null],
                currency: ['USD']
            }),
            skills: [''],
            requirements: ['', Validators.required],
            description: ['', [Validators.required, Validators.minLength(20)]],
            companyName: [''] // Optional, will use profile if empty in backend
        });
    }

    ngOnInit(): void { }

    onSubmit(): void {
        if (this.jobForm.invalid) {
            this.error = 'Please fill in all required fields correctly.';
            return;
        }

        this.loading = true;
        this.error = '';
        this.success = '';

        const formData = {
            ...this.jobForm.value,
            remote: !!this.jobForm.value.remote
        };

        // Process skills string to array
        if (formData.skills) {
            formData.skills = formData.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
        } else {
            formData.skills = [];
        }

        this.jobService.createJob(formData).subscribe({
            next: (res) => {
                this.success = 'Job posted successfully! Redirecting...';
                setTimeout(() => {
                    this.router.navigate(['/dashboard']);
                }, 2000);
            },
            error: (err) => {
                this.error = err.error?.message || 'Failed to post job. Please try again.';
                this.loading = false;
            }
        });
    }

    getCurrencySymbol(code: string): string {
        const symbols: { [key: string]: string } = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'INR': '₹',
            'JPY': '¥'
        };
        return symbols[code] || code;
    }
}
