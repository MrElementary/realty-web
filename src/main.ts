import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule, ToastrConfig } from 'ngx-toastr';

const toastrConfig: Partial<ToastrConfig> = {
  timeOut: 3000,
  positionClass: 'toast-middle-center',
};

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot(toastrConfig)
    ),
    provideHttpClient(),
    provideAnimations()
  ]
}).catch(err => console.error(err));