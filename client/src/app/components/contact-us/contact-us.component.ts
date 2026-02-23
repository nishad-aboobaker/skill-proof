import { Component } from '@angular/core';

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
    contactData = {
        name: '',
        email: '',
        subject: '',
        message: ''
    };

    onSubmit() {
        console.log('Form submitted:', this.contactData);
        // In a real app, this would call a service to send the data
        alert('Thank you for contacting us! We will get back to you soon.');
        this.contactData = {
            name: '',
            email: '',
            subject: '',
            message: ''
        };
    }
}
