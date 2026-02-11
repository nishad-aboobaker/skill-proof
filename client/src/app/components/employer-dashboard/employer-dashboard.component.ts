import { Component } from '@angular/core';

@Component({
    selector: 'app-employer-dashboard',
    templateUrl: './employer-dashboard.component.html',
    styleUrls: ['./employer-dashboard.component.css'],
    standalone: false
})
export class EmployerDashboardComponent {
    stats = [
        { label: 'Active Postings', value: '12', icon: '📝' },
        { label: 'Total Applications', value: '148', icon: '👥' },
        { label: 'Interviews Scheduled', value: '24', icon: '📅' },
        { label: 'Hires Made', value: '5', icon: '✅' }
    ];

    recentPostings = [
        { title: 'Senior Frontend Architect', applicants: 45, date: '2 days ago' },
        { title: 'Project Manager', applicants: 12, date: '5 days ago' },
        { title: 'DevOps Specialist', applicants: 28, date: '1 week ago' }
    ];
}
