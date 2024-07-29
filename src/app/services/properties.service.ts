import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Property } from '../properties-for-sale/propertiesModel';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'https://propertyflaskapp.onrender.com/api/v1';
  public wishlist = new BehaviorSubject<Property[]>([]);
  wishlist$ = this.wishlist.asObservable();

  constructor(private http: HttpClient) { }

  fetchProperties(): Observable<Property[]> {
    return this.http.get<{ [key: string ]: Property }>(`${this.apiUrl}/retrievedata`).pipe(
      map(response => Object.values(response))
    );
  }

  fetchFavorites(username: string): Observable<Property[]> {
  return this.http.get<{ [key: string]: Property }>(`${this.apiUrl}/retrievefavorites`, {
    params: { username }
  }).pipe(
    map(response => Object.values(response))
  );
}

  addToWishlist(username: string, property: Property): Observable<any> {
  return this.http.post(`${this.apiUrl}/addtowishlist`, { 
    user_name: username,
    wishlist_property: property.property_name
  }).pipe(
    map(response => Object.values(response))
  );
}

removeFromWishlist(username: string, propertyName: string): Observable<any> {
  const params = new HttpParams()
    .set('username', username)
    .set('property_name', propertyName);
  return this.http.delete(`${this.apiUrl}/removefromwishlist`, { params }).pipe(tap(() => {
    const currentWishlist = this.wishlist.value;
    this.wishlist.next(currentWishlist.filter(property => property.property_name !== propertyName))
  }))
}

  storeProperty(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/storepost`, formData)
  }

  updateWishlistStatus(username: string, property: Property, wishlist: boolean): Observable<any> {
  const propertyName = property.property_name;
  const params = new HttpParams()
    .set('username', username)
    .set('property_name', propertyName);

  if (wishlist) {
    return this.addToWishlist(username, property);
  } else {
    return this.removeFromWishlist(username, propertyName);
  }
}

isInWishlist(propertyName: string): boolean {
  return this.wishlist.value.some(property => property.property_name === propertyName)
}
}