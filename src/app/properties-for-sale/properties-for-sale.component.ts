import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Property } from './propertiesModel';
import { AuthService } from '../services/AuthService.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PropertyService } from '../services/properties.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-properties-for-sale',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './properties-for-sale.component.html',
  styleUrls: ['./properties-for-sale.component.css']
})
export class PropertiesForSaleComponent implements OnInit {
  properties: Property[] = [];
  currentPropertyImages: HTMLImageElement[] = [];
  currentImageIndex = 0;
  username: string | null = null;

  constructor(
    private authService: AuthService,
    private propertyService: PropertyService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.fetchProperties();
    this.propertyService.wishlist$.subscribe(() => {
      this.updatePropertiesWishlistStatus()
    })
  }

  fetchProperties(): void {
    this.propertyService.fetchProperties().subscribe(
      data => {
        console.log('Data: ', data)
        if (Array.isArray(data)) {
          this.properties = data.map(property => ({
            ...property,
            wishlist: property.wishlist || false
          }));
        } else {
          this.toastrService.warning('Data is not an array: ', data)
        }
      },
      error => this.toastrService.warning('Error fetching properties:', error)
    );
  }

  updatePropertiesWishlistStatus(): void {
    this.properties.forEach(property => {
      property.wishlist = this.propertyService.isInWishlist(property.property_name)
    });
  }

  fetchWishlistProperties(): void {
    if (this.username) {
      this.propertyService.fetchFavorites(this.username).subscribe(
        data => {
          if (Array.isArray(data)) {
            this.properties = data.filter(property => property.wishlist);
          } else {
            this.toastrService.warning('Data is not an array: ', data)
          }
        },
        error => this.toastrService.warning('Error fetching wishlisted properties:', error)
      );
    }
  }

  applyFilters(typeFilter: string, priceFilter: number, roomsFilter: number, areaFilter: string): void {
    this.properties = this.properties.filter(property => {
      return (typeFilter === 'all' || property.type === typeFilter) &&
             (property.price <= priceFilter) &&
             (property.nrBedrooms >= roomsFilter) &&
             (property.address.toLowerCase().includes(areaFilter));
    });
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

  toggleWishlist(property: Property): void {
    if (this.username && !property.wishlist) {
      this.propertyService.addToWishlist(this.username, property).subscribe(
        response => {
          this.toastrService.success('Added to wishlist.');
          property.wishlist = true;
        },
        error => this.toastrService.warning('Error adding to wishlist.')
      );
    }
  }


  isLoggedIn() {
    return this.authService.getUsername() != null;
  }
}