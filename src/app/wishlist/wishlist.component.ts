import { Component, OnInit } from '@angular/core';
import { Property } from '../properties-for-sale/propertiesModel';
import { PropertyService } from '../services/properties.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.fetchWishlistProperties();
  }

  fetchWishlistProperties(): void {
    this.propertyService.fetchProperties().subscribe(
      data => {
        this.wishlistProperties = data.filter(property => property.wishlist);
      },
      error => console.error('Error fetching wishlist properties:', error)
    );
  }

  toggleWishlist(property: Property): void {
    property.wishlist = !property.wishlist;
    this.propertyService.updateWishlistStatus(property.property_name, property.wishlist).subscribe(
      response => {
        console.log('Wishlist updated:', response);
        this.fetchWishlistProperties(); // Refresh the wishlist after update
      },
      error => console.error('Error updating wishlist:', error)
    );
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