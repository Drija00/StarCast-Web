import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User, users } from '../users';
import { Star,stars } from '../posts';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  

  constructor() {}

  getStars(offset: number, limit: number): Observable<any[]> {
    return of(stars.slice(offset, offset + limit));
  }

  getUserStars(id: string,offset: number, limit: number): Observable<any[]> {
    return of(stars.filter(x=>x.user.userId===id).slice(offset, offset + limit));
  }

  getUser(userId:string): any{
    return users.find(x=>x.userId===userId)
  }

  addStar(star:Star){
    stars.unshift(star)
  }
}
