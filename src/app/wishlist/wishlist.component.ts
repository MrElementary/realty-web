import { Component, OnInit } from '@angular/core';
import { Property } from '../properties-for-sale/propertiesModel';
import { PropertyService } from '../services/properties.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/AuthService.service';
import { NavigationButtonsComponent } from '../homepage/navigation-buttons/navigation-buttons.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, NavigationButtonsComponent],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistProperties: Property[] = [];
  currentPropertyImages: HTMLImageElement[] = [];
  currentImageIndex = 0;
  username: string | null = null;

  constructor(
    private propertyService: PropertyService,
    private toastrService: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.fetchWishlistProperties();
    this.propertyService.wishlist$.subscribe(wishlist => {
      this.wishlistProperties = wishlist;
    });
  }

  fetchWishlistProperties(): void {
    if (this.username) {
      this.propertyService.fetchFavorites(this.username).subscribe(
        data => {
          console.log('Wishlist Data:', data);
          this.propertyService.wishlist.next(data);
        },
        error => this.toastrService.warning('Error fetching wishlist properties.')
      );
    }
  }

  removeFromWishlist(property: Property): void {
    console.log('Attempting to remove property:', property);
    if (this.username && property.property_name && property.property_name.trim() !== '') {
      this.propertyService.removeFromWishlist(this.username, property.property_name).subscribe(
        response => {
          this.toastrService.success('Removed from wishlist.');
          property.wishlist = false;
          this.fetchWishlistProperties(); // Refresh the wishlist after removal
        },
        error => this.toastrService.warning('Error removing from wishlist.')
      );
    } else {
      this.toastrService.warning('Invalid property name. Cannot remove from wishlist.');
    }
  }

  openLightbox(event: Event, property: Property): void {
    event.preventDefault();
    const target = event.target as HTMLImageElement;
    this.currentPropertyImages = Array.from(document.querySelectorAll(`img[data-property-id="${target.dataset['propertyId']}"]`));
    this.currentImageIndex = parseInt(target.dataset['index'] as string);

    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.style.display = 'block';
      this.showImage(this.currentImageIndex);
    }
  }

  closeLightbox(): void {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.style.display = 'none';
    }
  }

  navigateLightbox(direction: number): void {
    this.currentImageIndex = (this.currentImageIndex + direction + this.currentPropertyImages.length) % this.currentPropertyImages.length;
    this.showImage(this.currentImageIndex);
  }

  showImage(index: number): void {
    const lightboxImg = document.getElementById('lightbox-image') as HTMLImageElement;
    const captionText = document.getElementById('caption');
    if (lightboxImg && this.currentPropertyImages[index]) {
      lightboxImg.src = this.currentPropertyImages[index].src;
      if (captionText) {
        captionText.innerHTML = this.currentPropertyImages[index].alt;
      }
    }
  }
}