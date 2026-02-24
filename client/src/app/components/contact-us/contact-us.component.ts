import { Component } from '@angular/core';

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
    // Model for the contact form
    contactData = this.getInitialFormData();

    onSubmit() {
        console.log('Form submission:', this.contactData);

        // In a real application, this would send data to a backend service
        alert('Thank you! We have received your message and will get back to you soon.');

        // Reset form after submission
        this.contactData = this.getInitialFormData();
    }

    // Helper to maintain a clean initial state
    private getInitialFormData() {
        return {
            name: '',
            email: '',
            subject: '',
            message: ''
        };
    }
}
