import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';

declare var lucide: any;

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, AfterViewInit {
    activeTab: 'profile' | 'security' | 'notifications' = 'profile';

    profileForm!: FormGroup;
    passwordForm!: FormGroup;

    profileLoading = false;
    passwordLoading = false;
    pageLoading = true;

    toast: { type: 'success' | 'error'; message: string } | null = null;

    notifications = {
        newUsers: true,
        newJobs: false,
        systemAlerts: true,
        weeklyReport: true,
        loginAlerts: true,
        maintenanceMode: false,
        announcement: {
            enabled: false,
            message: 'Important: Scheduled maintenance is coming up soon. Please save your work.'
        }
    };

    constructor(
        private fb: FormBuilder,
        private adminService: AdminService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.profileForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['']
        });

        this.passwordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });

        this.loadProfile();
        this.loadPlatformSettings();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 50);
    }

    passwordMatchValidator(group: FormGroup) {
        const newPwd = group.get('newPassword')?.value;
        const confirmPwd = group.get('confirmPassword')?.value;
        return newPwd === confirmPwd ? null : { mismatch: true };
    }

    loadProfile(): void {
        this.adminService.getSettings().subscribe({
            next: (data) => {
                this.profileForm.patchValue({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || ''
                });
                this.pageLoading = false;
                setTimeout(() => {
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }, 100);
            },
            error: () => {
                this.pageLoading = false;
                this.showToast('error', 'Failed to load profile');
            }
        });
    }

    loadPlatformSettings(): void {
        this.adminService.getPlatformSettings().subscribe({
            next: (data) => {
                this.notifications.maintenanceMode = data.maintenanceMode;
                if (data.announcement) {
                    this.notifications.announcement = data.announcement;
                }
            },
            error: () => {
                console.error('Failed to load platform settings');
            }
        });
    }

    setTab(tab: 'profile' | 'security' | 'notifications'): void {
        this.activeTab = tab;
        setTimeout(() => {
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 50);
    }

    saveProfile(): void {
        if (this.profileForm.invalid) return;
        this.profileLoading = true;
        this.adminService.updateProfile(this.profileForm.value).subscribe({
            next: () => {
                this.profileLoading = false;
                this.showToast('success', 'Profile updated successfully');
            },
            error: (err) => {
                this.profileLoading = false;
                this.showToast('error', err?.error?.message || 'Failed to update profile');
            }
        });
    }

    changePassword(): void {
        if (this.passwordForm.invalid) return;
        const { currentPassword, newPassword } = this.passwordForm.value;
        this.passwordLoading = true;
        this.adminService.updatePassword({ currentPassword, newPassword }).subscribe({
            next: () => {
                this.passwordLoading = false;
                this.passwordForm.reset();
                this.showToast('success', 'Password changed successfully');
            },
            error: (err) => {
                this.passwordLoading = false;
                this.showToast('error', err?.error?.message || 'Failed to change password');
            }
        });
    }

    toggleMaintenanceMode(event: any): void {
        const isEnabled = event.target.checked;
        this.adminService.updatePlatformSettings({ maintenanceMode: isEnabled }).subscribe({
            next: () => {
                this.showToast('success', `Maintenance mode ${isEnabled ? 'enabled' : 'disabled'}`);
            },
            error: (err) => {
                // Revert on error
                this.notifications.maintenanceMode = !isEnabled;
                this.showToast('error', err?.error?.message || 'Failed to update maintenance mode');
            }
        });
    }

    toggleAnnouncement(event: any): void {
        const isEnabled = event.target.checked;
        this.adminService.updatePlatformSettings({
            announcement: {
                enabled: isEnabled,
                message: this.notifications.announcement.message
            }
        }).subscribe({
            next: () => {
                this.showToast('success', `Announcement ${isEnabled ? 'enabled' : 'disabled'}`);
            },
            error: (err) => {
                this.notifications.announcement.enabled = !isEnabled;
                this.showToast('error', 'Failed to update announcement');
            }
        });
    }

    updateAnnouncementMessage(): void {
        this.adminService.updatePlatformSettings({
            announcement: {
                enabled: this.notifications.announcement.enabled,
                message: this.notifications.announcement.message
            }
        }).subscribe({
            next: () => {
                this.showToast('success', 'Announcement message updated');
            },
            error: (err) => {
                this.showToast('error', 'Failed to update message');
            }
        });
    }

    showToast(type: 'success' | 'error', message: string): void {
        this.toast = { type, message };
        setTimeout(() => (this.toast = null), 4000);
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
