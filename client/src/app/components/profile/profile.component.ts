import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    standalone: false
})
export class ProfileComponent implements OnInit {

    profile: any = null;
    loading = true;
    saving = false;
    successMsg = '';
    error = '';

    form = {
        name: '',
        phone: '',
        bio: '',
        skills: '',
        experience: '',
        portfolio: '',
        githubUsername: '',
        githubUrl: '',
        companyName: '',
        companyWebsite: '',
        companySize: '',
        industry: '',
        companyDescription: ''
    };

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.userService.getProfile().subscribe({
            next: (res: any) => {
                const data = res.data || res;
                this.profile = data;

                // Account & Personal
                this.form.name = data.name || '';
                this.form.phone = data.phone || '';

                // Professional Profile (Job Seeker)
                const p = data.profile || {};
                this.form.bio = p.bio || '';
                this.form.skills = Array.isArray(p.skills)
                    ? p.skills.join(', ')
                    : (p.skills || '');
                this.form.experience = p.experience || '';
                this.form.portfolio = p.portfolio || '';

                // GitHub info
                if (p.github) {
                    this.form.githubUsername = p.github.username || '';
                    this.form.githubUrl = p.github.profileUrl || '';
                }

                // Company Information (Employer)
                this.form.companyName = p.companyName || '';
                this.form.companyWebsite = p.companyWebsite || '';
                this.form.companySize = p.companySize || '';
                this.form.industry = p.industry || '';
                this.form.companyDescription = p.companyDescription || '';

                this.loading = false;
            },
            error: () => {
                this.error = 'Failed to load profile.';
                this.loading = false;
            }
        });
    }

    get parsedSkills(): string[] {
        return this.form.skills
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);
    }

    onSave() {
        this.saving = true;
        this.successMsg = '';
        this.error = '';

        // Helper to remove empty strings from objects
        const clean = (obj: any) => {
            const newObj: any = {};
            Object.keys(obj).forEach(key => {
                if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                    const nested = clean(obj[key]);
                    if (Object.keys(nested).length > 0) newObj[key] = nested;
                } else if (obj[key] !== '' && obj[key] !== null && obj[key] !== undefined) {
                    newObj[key] = obj[key];
                }
            });
            return newObj;
        };

        const rawPayload = {
            name: this.form.name,
            phone: this.form.phone,
            profile: {
                bio: this.form.bio,
                skills: this.parsedSkills,
                experience: this.form.experience,
                portfolio: this.form.portfolio,
                github: {
                    username: this.form.githubUsername,
                    profileUrl: this.form.githubUrl
                },
                companyName: this.form.companyName,
                companyWebsite: this.form.companyWebsite,
                companySize: this.form.companySize,
                industry: this.form.industry,
                companyDescription: this.form.companyDescription
            }
        };

        const payload = clean(rawPayload);

        this.userService.updateProfile(payload).subscribe({
            next: (res: any) => {
                this.profile = { ...this.profile, ...payload };
                this.successMsg = 'Profile updated successfully!';
                this.saving = false;
                setTimeout(() => this.successMsg = '', 3500);
            },
            error: (err) => {
                console.error('Save Error:', err);
                this.error = err.error?.message || 'Failed to save. Please try again.';
                this.saving = false;
            }
        });
    }
}
