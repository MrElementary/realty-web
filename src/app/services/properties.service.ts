import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Property } from '../properties-for-sale/propertiesModel';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'https://propertyflaskapp.onrender.com/api/v1';

  constructor(private http: HttpClient) { }

  fetchProperties(): Observable<Property[]> {
    return this.http.get<{ [key: string ]: Property }>(`${this.apiUrl}/retrievedata`).pipe(
      map(response => Object.values(response))
    );
  }

  fetchFavorites(username: string): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.apiUrl}/retrievefavorites`, {
      params: { username }
    });
  }

  addToWishlist(username: string, propertyName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/addtowishlist`, { username, property_name: propertyName });
  }

  removeFromWishlist(username: string, propertyName: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/removefromwishlist`, {
      params: { username, property_name: propertyName }
    });
  }

  storeProperty(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/storepost`, formData)
  }

  updateWishlistStatus(propertyName: string, wishlist: boolean): Observable<any> {
  return this.http.patch(`${this.apiUrl}/updatewishlist`, { propertyName, wishlist });
  }
}