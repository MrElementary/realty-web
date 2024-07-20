import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PropertyService } from '../services/properties.service';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-list-a-property',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
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

  ) {
    this.propertyForm = this.fb.group({
      person_name: [''],
      property_name: [''],
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
    const formData = new FormData();
    for (const key in this.propertyForm.controls) {
      if (this.propertyForm.controls.hasOwnProperty(key)) {
        formData.append(key, this.propertyForm.get(key)?.value);
      }
    }

    for (const file of this.selectedFiles) {
      formData.append('images', file);
    }

    this.propertyService.storeProperty(formData).subscribe(
      (response: any) => console.log(response),
      (error: any) => console.error('Error', error)
    )
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
