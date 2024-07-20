import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit, OnDestroy {
  backgroundImages: string[] = [];
  currentIndex: number = 0;
  intervalId: any;

  constructor (
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.backgroundImages = this.imageService.getBackgroundImages().map(image => image.src)
    this.changeBackgroundImage();
    this.intervalId = setInterval(() => this.changeBackgroundImage(), 5000); // Change image every 5 seconds
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