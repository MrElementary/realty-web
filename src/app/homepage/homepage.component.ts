import { Component, OnInit } from '@angular/core';
import { ImageSliderComponent } from './image-slider/image-slider.component';
import { NavigationButtonsComponent } from './navigation-buttons/navigation-buttons.component';
import { EmailFormComponent } from "./email-form/email-form.component";
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-homepage-component',
    standalone: true,
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.css',
    imports: [
        ImageSliderComponent,
        NavigationButtonsComponent,
        EmailFormComponent,
        CommonModule,
        RouterModule,
        ]
})
export class HomepageComponent implements OnInit {

    constructor(
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                window.scrollTo(0, 0);
            }
        });
    }
}
