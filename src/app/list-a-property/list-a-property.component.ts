import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PropertyService } from '../services/properties.service';
import { ImageService } from '../services/image.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationButtonsComponent } from '../homepage/navigation-buttons/navigation-buttons.component';

@Component({
  selector: 'app-list-a-property',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NavigationButtonsComponent
    ],
  templateUrl: './list-a-property.component.html',
  styleUrl: './list-a-property.component.css'
})
export class ListAPropertyComponent implements OnInit {
  propertyForm: FormGroup;
  selectedFiles: File[] = [];
  backgroundImages: string[] = [];
  currentIndex: number = 0;
  intervalId: any;

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private imageService: ImageService,
    private router: Router,
    private toastrService: ToastrService

  ) {
    this.propertyForm = this.fb.group({
      person_name: [''],
      property_name: ['', [Validators.required]],
      address: [''],
      price: [''],
      type: [''],
      bedroom: [''],
      bathroom: [''],
      total_floors: [''],
      garden: [false],
      power: [false],
      description: ['']
    });
  }
  ngOnInit(): void {
    this.backgroundImages = this.imageService.getBackgroundImages().map(image => image.src);
    this.changeBackgroundImage();
    this.intervalId = setInterval(() => this.changeBackgroundImage(), 5000);;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  onSubmit(): void {
    if (this.propertyForm.valid) {
  const formData = new FormData();

  const formObject: any = {};
  for (const key in this.propertyForm.controls) {
    if (this.propertyForm.controls.hasOwnProperty(key)) {
      formObject[key] = this.propertyForm.get(key)?.value;

      if (key === 'garden' || key === 'power') {
        formObject[key] = this.propertyForm.get(key)?.value? 'yes' : 'no'
      } else {
        formObject[key] = this.propertyForm.get(key)?.value;
      }
    }
  }


  formData.append('data', JSON.stringify(formObject));

  for (const file of this.selectedFiles) {
    formData.append('images', file);
  }

  this.propertyService.storeProperty(formData).subscribe(
    (response: any) => {
      this.toastrService.success('Your property has been listed successfully!');
      this.resetForm();
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3500)
    },
    (error: any) => {
      this.toastrService.warning('Failed to list your property.', error)
  }
  );
}
  }

resetForm(): void {
  this.propertyForm.reset();
  this.selectedFiles = [];
}

  changeBackgroundImage(): void {
    const container = document.getElementById('about-us-container');
    if (container) {
      container.style.backgroundImage = 'url(' + this.backgroundImages[this.currentIndex] + ')';
    }
    this.currentIndex = (this.currentIndex + 1) % this.backgroundImages.length;
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
