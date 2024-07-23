import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PropertyTypes, propertyTypes } from './propertyTypes.model';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-email-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.css']
})
export class EmailFormComponent {
  propertyTypes: PropertyTypes[] = propertyTypes;

  priceAssessmentForm: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    emailAddress: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
    valuationDate: ['', Validators.required],
    propertyType: ['', Validators.required],
    propertyLocation: ['', Validators.required],
    solar: ['']
  });

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService) {}

  onSubmit() {
    this.toastrService.success('Your form has been submitted successfully. An agent will be in touch shortly!');
    this.resetForm();
  }

  resetForm(): void {
  this.priceAssessmentForm.reset();
}

}