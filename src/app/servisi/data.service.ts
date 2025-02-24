import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User, users } from '../users';
import { Star,stars } from '../posts';
import { environment } from '../../environments/environment';

import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService{
  constructor(private http: HttpClient) {}

  private apiUrlUser = environment.apiHostUser;
  private apiUrlLike = environment.apiHostLike;
  private apiUrlStar = environment.apiHostStar;


  login(username: string, password: string): Observable<User> {
    console.log("apiUrlUser")
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);
    //return this.http.put<User>('http://localhost:8082/user/login', null, { params });
    return this.http.put<User>(`${this.apiUrlUser}/user/login`, null, { params });
  }

  uploadStar(postData: any, files: File[]):Observable<Star> {
    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(postData)], { type: 'application/json' });
    formData.append('post', jsonBlob);

    if(files.length>0){
      files.forEach((file) => {
        formData.append('images', file);
      });
    }

    var url = this.apiUrlStar + '/star/upload';
    let newPost = this.http.post<Star>(url, formData);
    return newPost;
  }

  logout(userId:string): any{console.log("apiUrlUser")
    console.log(userId)
    const params = new HttpParams()
      .set('user_id', userId)
    return this.http.put<User>(`${this.apiUrlUser}/user/logout`, null, { params });
  }

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
