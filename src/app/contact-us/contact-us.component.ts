import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NavigationButtonsComponent } from '../homepage/navigation-buttons/navigation-buttons.component';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NavigationButtonsComponent
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent implements OnInit {
  contactForm: FormGroup;
  images: string[] = [
    'assets/images/aboutImages/House_1.webp',
    'assets/images/aboutImages/House_2.jpg',
    'assets/images/aboutImages/House_3.jpeg',
    'assets/images/aboutImages/House_4.webp',
    'assets/images/aboutImages/House_5.jpg',
    'assets/images/aboutImages/House_6.webp',
    'assets/images/aboutImages/House_7.jpg',
    'assets/images/aboutImages/House_8.webp',
  ];
  currentIndex: number = 0;
  intervalId: any;

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService
    ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.changeBackgroundImage();
    this.intervalId = setInterval(() => this.changeBackgroundImage(), 5000); // Change image every 5 seconds
  }

  changeBackgroundImage(): void {
    const container = document.getElementById('contact-us-container');
    if (container) {
      container.style.backgroundImage = 'url(' + this.images[this.currentIndex] + ')';
    }
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.toastrService.success('Thank you! We will be in touch!');
      this.resetForm();
    }
  }

  resetForm(){
    this.contactForm.reset();
  }
}
