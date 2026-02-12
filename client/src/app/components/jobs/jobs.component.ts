import { Component } from '@angular/core';

@Component({
    selector: 'app-jobs',
    templateUrl: './jobs.component.html',
    styleUrls: ['./jobs.component.css'],
    standalone: false
})
export class JobsComponent {
    jobs = [
        {
            title: 'UX UI Designer',
            company: 'MAGIC UNICORN',
            location: 'ESTONIA, TALLINN',
            salary: '$10520 PA',
            tags: ['Design', 'UX', 'UI'],
            seniority: 'Student-Entry',
            type: 'Remote Job',
            postedDate: '24 March 2024',
            description: 'In this position, you will work closely with cross-functional peers, including Product Managers, Data Analysts, and Engineers to make offers, bundles, and messaging efficient and seamless.',
            icon: '🎨'
        },
        {
            title: 'UI Artist',
            company: 'BUSINESS CORPORATE GROUP',
            location: 'DENMARK, COPENHAGEN',
            salary: '$62100 PA',
            tags: ['Design', 'Senior', 'Remote'],
            seniority: 'Mid-Senior',
            type: 'Remote Job',
            postedDate: '24 March 2024',
            description: 'With design ingrained at all levels of our organization, including senior leadership, your impact will be valued and recognized. Join a well-established design organization.',
            icon: '🎨'
        },
        {
            title: 'Senior Product Designer',
            company: 'QUY',
            location: 'CZECH REPUBLIC, PRAGUE',
            salary: '$100000 PA',
            tags: ['Design', 'Product', 'Remote'],
            seniority: 'Senior',
            type: 'Full-Time',
            postedDate: '23 March 2024',
            description: "We've adopted a hybrid workplace model where 2 days in office are recommended but not enforced. It's up to you and your team to decide on the exact days you'll spend working together.",
            icon: '💎'
        },
        {
            title: 'UI Designer',
            company: 'MOON ACTIVE',
            location: 'ARGENTINA, BUENOS AIRES',
            salary: '$84800 PA',
            tags: ['Design', 'Senior', 'Full-Time'],
            seniority: 'Senior',
            type: 'Full-Time',
            postedDate: '28 March 2024',
            description: "We're a growing, ambitious HealthTech business building the essential digital health partner of tomorrow to empower women, girls with the knowledge and support they need to live better.",
            icon: '📱'
        }
    ];
}
