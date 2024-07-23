import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginFormComponent } from '../../login-form/login-form.component';
import { AuthService } from '../../services/AuthService.service';

@Component({
  selector: 'app-navigation-buttons',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    LoginFormComponent
  ],
  templateUrl: './navigation-buttons.component.html',
  styleUrls: ['./navigation-buttons.component.css']
})
export class NavigationButtonsComponent {

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
  ) {}

  onHomeClick() {
    this.router.navigate(['/home']);
  }

  onSalesClick() {
    this.router.navigate(['/properties-for-sale']);
  }

  onListAPropertyClick() {
    this.router.navigate(['/list-a-property']);
  }

  onWishlistClick() {
    this.router.navigate(['/wishlist']);
  }

  onAboutUsClick() {
    this.router.navigate(['/about-us']);
  }

  onContactUsClick() {
    this.router.navigate(['/contact-us']);
  }

  showLoginForm() {
    const dialogRef = this.dialog.open(LoginFormComponent, {
      width: '500px',
      height: '390px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  logout() {
    this.authService.clearUsername();
    alert('User logged out.');
  }

  isLoggedIn() {
    return this.authService.getUsername() !== null;
  }

}