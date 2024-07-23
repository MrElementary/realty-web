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
export class PropertiesForSaleComponent implements OnInit, AfterViewInit {
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
  }

  ngAfterViewInit(): void {
    document.getElementById('applyFilters')?.addEventListener('click', () => this.applyFilters());
  }

  fetchProperties(): void {
    this.propertyService.fetchProperties().subscribe(
      data => {
        if (Array.isArray(data)) {
          this.properties = data;
        } else {
          this.toastrService.warning('Data is not an array: ', data)
        }
      },
      error => this.toastrService.warning('Error fetching properties:', error)
    );
  }

  applyFilters(): void {
    const typeFilter = (document.getElementById('typeFilter') as HTMLSelectElement).value;
    const priceFilter = parseInt((document.getElementById('priceFilter') as HTMLInputElement).value) || Infinity;
    const roomsFilter = parseInt((document.getElementById('roomsFilter') as HTMLInputElement).value) || 0;
    const areaFilter = (document.getElementById('areaFilter') as HTMLInputElement).value.toLowerCase();

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
  property.wishlist = !property.wishlist;
  this.propertyService.updateWishlistStatus(property.property_name, property.wishlist).subscribe(
    response => this.toastrService.success('Wishlist updated.'),
    error => this.toastrService.warning('Error updating wishlist.')
  );
}

isLoggedIn() {
  return this.authService.getUsername() != null;
}
}