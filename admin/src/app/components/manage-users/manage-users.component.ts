import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

declare var lucide: any;

@Component({
    selector: 'app-manage-users',
    templateUrl: './manage-users.component.html',
    styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit, AfterViewInit {
    users: User[] = [];
    filteredUsers: User[] = [];
    loading: boolean = true;
    searchQuery: string = '';

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    ngAfterViewInit() {
        this.initIcons();
    }

    initIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    loadUsers() {
        this.loading = true;
        this.userService.getAllUsers(this.searchQuery).subscribe({
            next: (res: any) => {
                this.users = res.data;
                this.filteredUsers = this.users;
                this.loading = false;
                setTimeout(() => this.initIcons(), 0);
            },
            error: (err) => {
                console.error('Error fetching users:', err);
                this.loading = false;
            }
        });
    }

    onSearch() {
        this.loadUsers();
    }

    viewUserDetails(id: string) {
        this.router.navigate(['/manage-users', id]);
    }

    blockUser(id: string) {
        if (confirm('Are you sure you want to block this user? The user will no longer be able to log in.')) {
            this.userService.blockUser(id).subscribe({
                next: () => {
                    this.loadUsers(); // Refresh the list to show updated status
                },
                error: (err) => console.error('Error blocking user:', err)
            });
        }
    }

    logout() {
        this.authService.logout();
    }
}
