import { ImageService } from './../../services/image.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Image } from '../../image.model';

@Component({
  selector: 'app-image-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.css'
})
export class ImageSliderComponent implements OnInit {
  homeImages: Image[] = [];
  currentIndex: number = 0;
  intervalId: any;

  constructor(private ImageService: ImageService) {}

  ngOnInit() {
    this.homeImages = this.ImageService.getImages();
  }

}

