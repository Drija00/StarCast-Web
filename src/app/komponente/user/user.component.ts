import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router,ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';

import { cilCalendar, cilList, cilShieldAlt } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../users';
import { DataService } from '../../servisi/data.service';
import { Star, stars } from '../../posts';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user',
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
      MatGridListModule,
      IconDirective],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent  implements OnInit{
  @ViewChild('scrollMarker', { static: false }) scrollMarker!: ElementRef;
  @ViewChild('scroll', { static: true }) scrollDiv!: ElementRef;
  stars:Star[] = [];
  loading = false;
  offset = 0;
  limit = 6;
  showTopButton = false;
  loggedUser: User | undefined;
  private observer!: IntersectionObserver;
  previewImage: string | null = null;
  imageString: string | null = null;
  user: any;
  post:boolean = true;
  starBasePath = environment.apiHostStar;
  icons = { cilList, cilCalendar };
  
  
  previewImages: string[] = [];
  imageStrings: string[] = [];
  expandedImages: string[] = [];
  currentImageIndex: number = 0;
  currentImageSet: string[] = [];
  imageFiles?: File[];

  constructor(private router: Router,
    private route: ActivatedRoute , private cdr: ChangeDetectorRef, private dataService: DataService,private sanitizer: DomSanitizer){}

  ngOnInit(): void {
     const userId = this.route.snapshot.paramMap.get('id');

     console.log(userId)

    if (!userId) {
      console.error('ID korisnika nije pronađen u URL-u!');
      this.redirectToLogin();
      return;
    }
    const userJson = localStorage.getItem('logged_user');
    if (userJson) {
      this.loggedUser = JSON.parse(userJson);
      console.log(this.loggedUser);
    }
    console.log("Da li je ulogovani korisnik na strani: "+ (userId === this.loggedUser?.userId))
    if(userId === this.loggedUser?.userId){
      this.user = this.loggedUser;
      this.post = true;
    }else{
      this.user = this.dataService.getUser(userId);

      console.log(this.user)
      this.post = false;
    }

    console.log(this.post)
    
    setTimeout(() => {
      this.loadStars(this.user.userId);
      this.cdr.detectChanges();
    }, 100);
    

    console.log(this.scrollDiv)
    if (this.scrollDiv) {
      this.scrollDiv.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
    } else {
      console.error('Element #scroll nije pronađen!');
    };
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
              this.loadStars(this.user.userId);
            }
          }
        },
        { root: this.scrollDiv.nativeElement, threshold: 1 }
      );
    
      this.observer.observe(this.scrollMarker.nativeElement);
    }
    getSanitizedUrl(image: string): string {
      const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(image);
      console.log(sanitizedUrl);  // Proveri vrednost URL-a
      return sanitizedUrl as string;
    }
    

    loadStars(starId:string): void {
      if (this.loading) {
        console.warn('Učitavanje je već u toku. Preskačem poziv loadStars.');
        return;
      }
    
      this.loading = true;
    
      this.dataService.getUserStars(starId,this.offset, this.limit).subscribe({
        next: (data) => {
          if (data.length > 0) {
            this.stars = [...this.stars, ...data];
            this.offset += data.length;
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

    expandImages(images: string[], index: number, event?: any) {
      if(event!=null){
        event.stopPropagation();
      }
      this.expandedImages = images;
      this.currentImageIndex = index;
    }
    closeImage(): void {
      this.expandedImages = [];
      this.currentImageIndex = 0;
    }
  
    prevImage(event: Event): void {
      event.stopPropagation(); // Spreči zatvaranje modala
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--;
      }
    }
  
    nextImage(event: Event): void {
      event.stopPropagation(); // Spreči zatvaranje modala
      if (this.currentImageIndex < this.expandedImages.length - 1) {
        this.currentImageIndex++;
      }
    }

    redirectToLogin() {
      this.dataService.logout(this.loggedUser!.userId).subscribe(
        this.router.navigate(['/login'])
      )
    }

  backToHome(){
    console.log("HOME")
    this.router.navigate(['/home',this.loggedUser?.userId]);
  }

  onScroll() {
    const scrollTop = this.scrollDiv.nativeElement.scrollTop;
    this.showTopButton = scrollTop > 50;
  }

  scrollToTop() {
    this.scrollDiv.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
  }

  
  onBackgroundButtonSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files && fileInput.files.length > 0) {
      const files = Array.from(fileInput.files);  // Convert FileList to an array
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
  
      if (invalidFiles.length > 0) {
        alert('Invalid file type(s). Please select only JPEG or PNG images.');
        return;
      }
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => { // Store the base64 image data
          this.user.backgroundImage = reader.result as string;
        };
        reader.readAsDataURL(file);
      });
      console.log(this.imageStrings[0]) 
    }
  }
  
  onProfileButtonSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files && fileInput.files.length > 0) {
      const files = Array.from(fileInput.files);  // Convert FileList to an array
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
  
      if (invalidFiles.length > 0) {
        alert('Invalid file type(s). Please select only JPEG or PNG images.');
        return;
      }
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => { // Store the base64 image data
          this.user.profileImage = reader.result as string;
        };
        reader.readAsDataURL(file);
      });
    }
  }
  
  removeImage(index: number): void {
    this.previewImages.splice(index, 1);
  }
  
  clearImage(): void {
    this.previewImages = [];
    this.imageStrings = [];
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  formatDate(date:Date):String {
    const parsedDate = new Date(date);
    const month = parsedDate.toLocaleString('en-US', { month: 'long' });
    const year = parsedDate.getFullYear();

    return `${month} ${year}`;
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
      console.log(this.imageFiles)
    }
  }
  postStar(textarea: HTMLTextAreaElement) {
    const newStar = {
      user_id: this.loggedUser?.userId || '',
      content: textarea.value,
    };
  
    const files = this.imageFiles ? Array.from(this.imageFiles) : [];
    console.log(files)
    
  
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
        this.stars.unshift(response);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error posting star:', err);
      },
    });
  }
  onInput(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

}
