import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { User } from '../users';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';

export interface Notifications{
  items: Notification[]
}

export interface Notification{
    status:string,
    message:string,
    seen:boolean,
    timestamp:Date,
    notificationId:string,
    user:User
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

    socketClientUser:any=null;
    socketClientLike:any=null;

    private apiUrlUser = environment.apiHostUserWS;
    private apiUrlLike = environment.apiHostLikeWS;
    private apiUrlStar = environment.apiHostStarWS;

    private notificationSubscription:any;
    private likeSubscription:any;

    //unreadNotificationsCount=0;
    notifications: Array<Notification> = [];
    
    public newNotification$: Subject<Notification> = new Subject<Notification>();

  connect(user: User) {
    console.log('Connecting to WS...');

    let wsUser = new SockJS(this.apiUrlUser);
    this.socketClientUser = Stomp.over(wsUser);

    this.socketClientUser.connect({}, (frame: any) => {
        console.log('Connected to User WS:', frame);

        this.notificationSubscription = this.socketClientUser.subscribe(
            '/user/' + user.userId + '/notification',
            (message: any) => {
                const notification : Notification = JSON.parse(message.body)
                console.log('Received user notification:', notification);
                
                this.notifications.unshift(notification)
                this.newNotification$.next(notification);
                //this.brojNovihNotifikacija()
            }
        );

    }, (error: any) => {
        console.error('User WebSocket connection error:', error);
    });

    let wsLike = new SockJS(this.apiUrlLike);
    this.socketClientLike = Stomp.over(wsLike);

    this.socketClientLike.connect({}, (frame: any) => {
        console.log('Connected to Like WS:', frame);

        this.likeSubscription = this.socketClientLike.subscribe(
            '/user/' + user.userId + '/notification',
            (message: any) => {
                const notification : Notification = JSON.parse(message.body)
                console.log('Received like notification:', notification);
                this.notifications.unshift(notification)
                this.newNotification$.next(notification);
                //this.brojNovihNotifikacija()
            }
        );

    }, (error: any) => {
        console.error('Like WebSocket connection error:', error);
    });
}

getUnseenNotifications():Array<Notification>{
  return this.notifications.filter(notification => !notification.seen);
}

markAllNotificationsAsSeen() {
  this.notifications.forEach(notification => {
    if (!notification.seen) {
      notification.seen = true;
    }
  });
}

/*getNotifications():Array<Notification>{
    return this.notifications;
}


/*constructor(public apiNotifikacijeServis: ApiSignalService) {
    this.notificationsSubject.next(this.notifikacije);
   }
  notifikacije:Notification[] = []*/

  dropdownOpen: boolean = false;

  /*notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private currentPageSubject = new BehaviorSubject<number>(0);

  brojNotifikacija = 0
  
  pageSize = 4
  prikazaneNotifikacije : Notification[] = [] 
  notifications$ = this.notificationsSubject.asObservable();
  currentPage$ = this.currentPageSubject.asObservable();
  
  getPaginatedNotifications(page: number): Notification[] {
    const notifications = this.notificationsSubject.getValue();
    const start = page * this.pageSize;
    const end = start + this.pageSize;
    let sortedNotification = notifications.slice(start, end);
    return sortedNotification;
  }
  brojNovihNotifikacija(){
    this.brojNotifikacija = 0  
    this.notifikacije.forEach(element => {
      if(element.message_seen === false){
        this.brojNotifikacija++
      }
    });
    //return this.brojNotifikacija
  }
  notifikacijeVidjene(){
    let vidjeneNotifikacije = this.notifikacije
    vidjeneNotifikacije.forEach(element => {
      element.message_seen = true
    });
    this.notificationsSubject.next(vidjeneNotifikacije)
    console.log(vidjeneNotifikacije)
    //this.removeAllNotifications()
  }

  ucitajInicijalneNotifikacije() {
  
    this.prikazaneNotifikacije = this.notifikacije.slice(0, 4); 
  }
  loadMoreItems() {
    const notificationsDisplay = this.prikazaneNotifikacije.length
    console.log(notificationsDisplay)
    console.log(this.notifikacije)
    let newItems = this.notifikacije.slice(notificationsDisplay, notificationsDisplay + this.pageSize); 
    console.log(newItems)
    this.prikazaneNotifikacije = [...this.prikazaneNotifikacije, ...newItems];
    console.log(this.prikazaneNotifikacije)

  }*/
    /*dodajNotifikaciju(notifikacija:Message){
      this.notifikacije.unshift(notifikacija)
      this.notificationsSubject.next(this.notifikacije);
      this.brojNotifikacija++
    }
   /*updatujNotifikacije(notifkacije:Message[]){
    //let noveNotifikacije:Message[] = []
    /*notifkacije.forEach(notifikacija => {
      if(notifikacija.message_seen === false){
        noveNotifikacije.unshift(notifikacija)
      }
    });
    this.notifikacije=notifkacije
    console.log(this.notifikacije)
    this.notificationsSubject.next(this.notifikacije);
   }

  getTotalPages(): number {
    const notifications = this.notificationsSubject.getValue();
    return Math.ceil(notifications.length / this.pageSize);
  }

  setCurrentPage(page: number): void {
    this.currentPageSubject.next(page);
  }



  /*removeNotification(notificationMessage_id: number): void {
    const notifications = this.notificationsSubject.getValue();
    console.log(notifications)
    let messages = [];
    messages.push(notificationMessage_id)
    const username = localStorage.getItem('username')
    if(username){
    const request: NotifikacijaPost = {
      username: username,
      messages: messages  
    }
    console.log(request)
    this.apiNotifikacijeServis.skloniNotifikacije(request).subscribe(
        x=>{
          console.log(x)
          
        }
      )
    } else {
      console.log('Desila se greska!')
    }
  

    const updatedNotifications = notifications.filter(
      notification => notification.message_id !== notificationMessage_id
    );
    this.notificationsSubject.next(updatedNotifications);
  }*/

  /*removeAllNotifications(): void {
    const notifications = this.notificationsSubject.getValue();
    console.log(notifications)
    let messages:number[] = [];
    this.notifikacije.forEach(element => {
      messages.push(element.message_id)
    });

    const username = localStorage.getItem('username')
    if(username){
      const params = new HttpParams().set('ids', messages.join(','));
      console.log(params.toString)
    const request: NotifikacijaPost = {
      username: username,
      messages: messages  
    }
    if(messages.length !== 0){
      this.apiNotifikacijeServis.skloniNotifikacije(request).subscribe(
        x=>{
          console.log(x)
          this.brojNotifikacija = 0
        }
      )
    }
    
    } else {
      console.log('Desila se greska!')
    }
    //this.notifikacije = []
    //this.notificationsSubject.next(this.notifikacije);
  }*/


}
