import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import { environment } from '../../../environments/environment';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { User, UserFollowing, users } from '../../users';
import { DataService } from '../../servisi/data.service';
import { Star } from '../../posts';
import { filter } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollMarker', { static: false }) scrollMarker!: ElementRef;
  @ViewChild('scrollMarker1', { static: false }) scrollMarker1!: ElementRef;
  @ViewChild('scroll', { static: true }) scrollDiv!: ElementRef;
  stars:Star[] = [];
  loading = false;
  showFeed = true;
  value = '';
  offset = 0;
  limit = 6;
  offsetFilter=0;
  limitFilter = 12;
  searchValue=""
  searchedUsers:any[]=[];
  showTopButton = false;
  loggedUser: User | undefined;
  private observer!: IntersectionObserver;
  previewImage: string | null = null;
  expandedImages: string[] = [];
  currentImageIndex: number = 0;
  currentImageSet: string[] = [];
  previewImages: string[] = [];
  imageStrings: string[] = [];
  imageFiles?: File[];
  starBasePath = environment.apiHostStar;
  userBasePath = environment.apiHostUser;
  profileImage:string = "";


  constructor(private router: Router, private cdr: ChangeDetectorRef, private dataService: DataService) {}
  expandImages(images: string[], index: number): void {
    this.expandedImages = images;
    this.currentImageIndex = index;
    const imageId = index;
    this.router.navigate(['/image-detail', imageId]);
  }

  changeFeed(){
    this.showFeed = !this.showFeed;
  }

  removeImage(index: number): void {
    this.previewImages.splice(index, 1);
  }
  
  clearImage(): void {
    this.previewImages = [];
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  closeImage(): void {
    this.expandedImages = [];
    this.currentImageIndex = 0;
  }

  prevImage(event: Event): void {
    event.stopPropagation(); 
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  nextImage(event: Event): void {
    event.stopPropagation();
    if (this.currentImageIndex < this.expandedImages.length - 1) {
      this.currentImageIndex++;
    }
  }

  redirectToLogin() {
    this.dataService.logout(this.loggedUser!.userId).subscribe(()=>{
      localStorage.removeItem('logged_user');
      this.router.navigate(['/login']);
    }
    )
  }

  backToHome() {
    console.log("HOME");
    this.showFeed = true;
    this.router.navigate(['/home', this.loggedUser?.userId]);

    // Reinitialize lazy loading observer
    setTimeout(() => {
        if (this.scrollDiv && this.scrollMarker) {
            this.scrollDiv.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
            this.observeScrollMarker();
        }
    }, 10);
}

observeScrollMarker() {
    if (!this.observer) {
        this.observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && this.showFeed) {
                this.loadStars();
            }
        });
    }
    if (this.scrollMarker) {
        this.observer.observe(this.scrollMarker.nativeElement);
    }
}


  redirectToUser(starId:string){
    console.log("user")
    this.router.navigate(['/user',starId]);
  }

  ngOnInit(): void {
    
    this.showFeed = true
    setTimeout(() => {
      
      const userJson = localStorage.getItem('logged_user');
      if (userJson) {
        this.loggedUser = JSON.parse(userJson);
        if(this.loggedUser?.profileImage) this.profileImage = this.loggedUser.profileImage
        console.log(this.loggedUser);
      }
      this.loadStars();
      console.log(this.scrollDiv)
      if (this.scrollDiv) {
        this.scrollDiv.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
      } else {
        console.error('Element #scroll nije pronađen!');
      };
    
    this.cdr.detectChanges()
    }, 10);
  }
    ngAfterViewInit(): void {
      if (!this.scrollMarker) {
        console.error('Scroll marker element nije pronađen!');
        return;
      }
    
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !this.loading) {
              if(this.showFeed){
                this.loadStars();
              }else{
                this.getFilteredUser()
              }
            }
          }
        },
        { root: this.scrollDiv.nativeElement, threshold: 1 }
      );
    
      this.observer.observe(this.scrollMarker.nativeElement);
    }
  
  loadStars() {
    if (this.loading) {
      console.warn('Učitavanje je već u toku. Preskačem poziv loadStars.');
      return;
    }
  
    this.loading = true;
    this.dataService.getStars(this.loggedUser!.userId,this.offset, this.limit).subscribe({
      next: (data) => {
        console.log(data)
        if (data.items.length > 0) {
          this.stars = [...this.stars, ...data.items];
          this.offset++;
          console.log(this.offset)
          console.log(this.limit)
          console.log(this.stars)
        } else {
          console.log('Diskonektujem posmatrača.');
          this.observer?.disconnect();
        }
      },
      error: (err) => console.error('Greška prilikom učitavanja zvezdica:', err),
      complete: () => {
        this.loading = false;
        console.log('Učitavanje završeno.');
      },
    });
  }  

  getFilteredUser(){
    if (this.loading) {
      console.warn('Učitavanje je već u toku. Preskačem poziv loadStars.');
      return;
      }
  
      this.loading = true;
    
      this.dataService.getFilteredUsers(this.searchValue,this.offsetFilter,this.limitFilter).subscribe({
        next: (x) => {
          if (x.items.length > 0) {
            this.searchedUsers = [...this.searchedUsers,...x.items]
            this.offsetFilter++
            console.log(x.items)
            this.showFeed = false;
            this.value = '';
          }else{
            console.log('Diskonektujem posmatrača.');
            this.observer?.disconnect();
          }
        },error: (err) => console.error('Greška prilikom učitavanja zvezdica:', err),
        complete: () => {
          this.loading = false;
          console.log('Učitavanje završeno.');
        },
        
      })
  }
  
  search() {
    this.offsetFilter=0
    this.searchedUsers = []
    this.scrollToTop()
    this.searchValue = this.value.toLowerCase().trim();
    this.getFilteredUser()
    /*this.searchedUsers = users.filter(user =>
      user.username.toLowerCase().includes(searchValue) ||
      user.firstName.toLowerCase().includes(searchValue) ||
      user.lastName.toLowerCase().includes(searchValue)
    );*/
  }
  

  onInput(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
  

  onScroll() {
    const scrollTop = this.scrollDiv.nativeElement.scrollTop;
    this.showTopButton = scrollTop > 50;
  }

  scrollToTop() {
    this.scrollDiv.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files && fileInput.files.length > 0) {
      const files = Array.from(fileInput.files);  // Convert FileList to an array
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
  
      if (invalidFiles.length > 0) {
        alert('Invalid file type(s). Please select only JPEG or PNG images.');
        return;
      }
  
      // Reset previews
      this.previewImages = [];
      this.imageFiles = files;  // If you want to show previews for multiple images
  
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.previewImages.push(reader.result as string);  // Add each preview image URL
        };
        reader.readAsDataURL(file);
      });
      console.log(this.previewImages)
    }
  }
  postStar(textarea: HTMLTextAreaElement) {
    const newStar = {
      user_id: this.loggedUser?.userId || '',
      content: textarea.value,
    };
  
    const files = this.imageFiles ? Array.from(this.imageFiles) : [];
  
    this.dataService.uploadStar(newStar, files).subscribe({
      next: (response) => {
        console.log('Star posted successfully:', response);
        this.previewImages = [];
        this.previewImage = null;
        this.clearImage()
        this.imageFiles = [];
        textarea.value = '';
        //potrebno na beku vratiti kreiranu objavu sa id-em kako bi se odmah na feed postavila
      /*const newStar1 = {
        starId: "",
        content_imgs: [...this.previewImages],
        content: textarea.value,
        user: this.loggedUser!,
        timestamp: new Date().toISOString(),
      };*/
        console.log(response)
        this.stars.unshift(response);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error posting star:', err);
      },
    });
  }

  likePost(userId:string,star:Star){
    this.dataService.likePost(userId,star.starId).subscribe(x=>{
      let u : UserFollowing = {
        firstName:this.loggedUser!.firstName,
        lastName:this.loggedUser!.lastName,
        userId:userId,
        username:this.loggedUser!.username,
        profileImage:this.loggedUser!.profileImage
      }
      star.userLikes.unshift(u)
      console.log("LIKE");
    })
      
  }

  
  isPostFromLoggedUser(star:Star): boolean {
   return star.user.userId === this.loggedUser?.userId ? true :false;
  }


  unlikePost(userId:string,star:Star){
    this.dataService.unlikePost(userId,star.starId).subscribe(x=>{
      star.userLikes = star.userLikes.filter(x=>x.userId!==userId)
      console.log("UNLIKE")
    })
  }

  didILikeThePost(likes:any[]):boolean{
    if(likes.some(x=>x.userId === this.loggedUser?.userId)) return true;

    return false;
  }

  get profileImageStyle(): string {
    if (this.loggedUser?.profileImage) {
        return `url('${this.userBasePath}${this.loggedUser.profileImage}')`;
    }
    return `url('Images/profile.jpg')`; 
}
get rofileImageStyle(): string {
  if (this.loggedUser?.profileImage) {
      return `url('${this.userBasePath}${this.loggedUser.profileImage}')`;
  }
  return `url('Images/profile.jpg')`; 
}
getProfileImage(user: UserFollowing): string {
  const imageUrl = user?.profileImage
      ? `${this.userBasePath}${user?.profileImage}`
      : 'Images/profile.jpg';

  return `url('${imageUrl}')`;
}

formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  return isToday
    ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('en-GB');
}

deleteStar(star:Star){
  this.stars = [...this.stars.filter(x=>x.starId!==star.starId)]
  this.dataService.deleteStar(this.loggedUser!.userId,star.starId).subscribe(x=>{
    console.log("Uspesno obirsna objava")
  })
}



  /*postStar(textarea: HTMLTextAreaElement){
    const newStar = {
      starId: "",
      content_imgs: [...this.previewImages],
      content: textarea.value,
      user: this.loggedUser!,
      timestamp: new Date().toISOString(),
    };
    console.log('Posting star:', newStar);
    this.previewImage = null;
    this.clearImage()
    this.stars.unshift(newStar);
    textarea.value = "";  
    this.cdr.detectChanges();
    console.log(this.stars)
  }*/
}
