import { Component, OnInit } from '@angular/core';
import { Property } from '../properties-for-sale/propertiesModel';
import { PropertyService } from '../services/properties.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/AuthService.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
  }

  fetchWishlistProperties(): void {
    if (this.username) {
      this.propertyService.fetchFavorites(this.username).subscribe(
        data => {
          console.log('Wishlist Data:', data);
          if (Array.isArray(data)) {
            this.wishlistProperties = data.filter(property => property.wishlist);
          } else {
            this.toastrService.warning('Received data is not an array.');
          }
        },
        error => this.toastrService.warning('Error fetching wishlist properties.')
      );
    }
  }

  toggleWishlist(property: Property): void {
    if (this.username) { // Ensure username is available before toggling wishlist
      property.wishlist = !property.wishlist;
      this.propertyService.updateWishlistStatus(this.username, property.property_name, property.wishlist).subscribe(
        response => {
          this.toastrService.success('Wishlist updated.');
          this.fetchWishlistProperties();
        },
        error => this.toastrService.warning('Error updating wishlist.')
      );
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
