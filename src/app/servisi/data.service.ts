import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SetBackgroundImage, SetDescription, SetProfileResponse, User, Users, users } from '../users';
import { Star,Stars } from '../posts';
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
    newPost.subscribe(x=>console.log(x))
    return newPost;
  }

  
  setProfileImage(userId: string, file: File): Observable<SetProfileResponse> {
    console.log("POSTAVLJAM PROFILNU SLIKU");

    const formData = new FormData();
    const jsonBlob = new Blob([`"${userId}"`], { type: 'application/json' });
    
    formData.append('user', jsonBlob);
    formData.append('image', file);
    
    return this.http.patch<SetProfileResponse>(`${this.apiUrlUser}/user/profileimage`, formData);
}

setBackgroundImage(userId: string, file: File): Observable<SetBackgroundImage> {
  console.log("POSTAVLJAM POZADINSKU SLIKU");

  const formData = new FormData();
  const jsonBlob = new Blob([`"${userId}"`], { type: 'application/json' });
  
  formData.append('user', jsonBlob);
  formData.append('image', file);
  
  return this.http.patch<SetBackgroundImage>(`${this.apiUrlUser}/user/backgroundimage`, formData);
}

setDescription(userId: string, description:string): Observable<SetDescription> {
  console.log("POSTAVLJAM POZADINSKU SLIKU");

  const params = new HttpParams()
  .set('userId', userId)
  .set('description', description);
  
  return this.http.patch<SetDescription>(`${this.apiUrlUser}/user/description`,null ,{params});
}


  likePost(userId:string,starId:string):Observable<void>{
    console.log("apiUrlUser")
    const params = new HttpParams()
      .set('userId', userId)
      .set('starId', starId);
    //return this.http.put<User>('http://localhost:8082/user/login', null, { params });
    return this.http.post<void>(`${this.apiUrlLike}/like`, null, { params });
  }

  unlikePost(userId:string,starId:string):Observable<void>{
    const params = new HttpParams()
      .set('userId', userId)
      .set('starId', starId);
    //return this.http.put<User>('http://localhost:8082/user/login', null, { params });
    return this.http.delete<void>(`${this.apiUrlLike}/unlike`,{ params });
  }

  logout(userId:string): any{console.log("apiUrlUser")
    console.log(userId)
    const params = new HttpParams()
      .set('user_id', userId)
    return this.http.put<User>(`${this.apiUrlUser}/user/logout`, null, { params });
  }

  follow(userId:string, followeUsername:string): any{console.log("apiUrlUser")
    console.log(userId)
    const params = new HttpParams()
      .set('followerId', userId)
      .set('followeeUsername', followeUsername)
    return this.http.put<void>(`${this.apiUrlUser}/user/follow`, null, { params });
  }

  unfollow(userId:string, followeUsername:string): any{console.log("apiUrlUser")
    console.log(userId)
    const params = new HttpParams()
      .set('followerId', userId)
      .set('followeeUsername', followeUsername)
    return this.http.put<void>(`${this.apiUrlUser}/user/unfollow`, null, { params });
  }

  getStars(id: string,offset: number, limit: number): Observable<Stars> {
    const params = new HttpParams()
      .set('userId',id)
      .set('offset',offset)
      .set('limit',limit)
    return this.http.get<Stars>(`${this.apiUrlStar}/user/stars/foryou`, { params });
    //return of(stars.slice(offset, offset + limit));
  }
  deleteStar(userId: string, starId:string): Observable<void> {
    const params = new HttpParams()
      .set('userId',userId)
      .set('starId',starId)
    return this.http.delete<void>(`${this.apiUrlStar}/star`, { params });
    //return of(stars.slice(offset, offset + limit));
  }

  getFilteredUsers(filter: string,offset: number, limit: number): Observable<Users> {
    const params = new HttpParams()
      .set('filter',filter)
      .set('offset',offset)
      .set('limit',limit)
    return this.http.get<Users>(`${this.apiUrlUser}/users/filter`, { params });
    //return of(stars.slice(offset, offset + limit));
  }

  getUserStars(id: string,offset: number, limit: number): Observable<Stars> {
    const params = new HttpParams()
      .set('userId',id)
      .set('offset',offset)
      .set('limit',limit)
    return this.http.get<Stars>(`${this.apiUrlStar}/user/stars`, { params });
    //return of(stars.filter(x=>x.user.userId===id).slice(offset, offset + limit));
  }


  getUser(userId:string): Observable<User>{
    console.log(userId)
    const params = new HttpParams()
      .set('userId',userId)
    return this.http.get<User>(`${this.apiUrlUser}/user`, { params });
   //return users.find(x=>x.userId===userId)
  }

  /*addStar(star:Star){
    stars.unshift(star)
  }*/
}
