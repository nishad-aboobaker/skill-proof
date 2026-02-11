import { Component } from '@angular/core';

@Component({
    selector: 'app-jobs',
    templateUrl: './jobs.component.html',
    styleUrls: ['./jobs.component.css'],
    standalone: false
})
export class JobsComponent {
    jobs = [
        { title: 'Frontend Developer', company: 'Google', location: 'Remote', salary: '$120k - $150k', tags: ['Angular', 'TypeScript', 'CSS'] },
        { title: 'Backend Engineer', company: 'Amazon', location: 'Seattle, WA', salary: '$130k - $160k', tags: ['Node.js', 'Express', 'MongoDB'] },
        { title: 'Fullstack Developer', company: 'Meta', location: 'Menlo Park, CA', salary: '$140k - $180k', tags: ['React', 'Node.js', 'PostgreSQL'] },
        { title: 'UX Designer', company: 'Apple', location: 'Cupertino, CA', salary: '$110k - $140k', tags: ['Figma', 'UI/UX', 'Research'] }
    ];
}
