import { Component } from '@angular/core';

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
    contactData = this.getInitialFormData();

    onSubmit() {
        console.log('Form submission:', this.contactData);

        alert('Thank you! We have received your message and will get back to you soon.');
        this.contactData = this.getInitialFormData();
    }

    private getInitialFormData() {
        return {
            name: '',
            email: '',
            subject: '',
            message: ''
        };
    }
}
