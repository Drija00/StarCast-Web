import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router,ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
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
      MatGridListModule],
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
  expandedImages: string[] = [];
  currentImageIndex: number = 0;
  currentImageSet: string[] = [];

  constructor(private router: Router,
    private route: ActivatedRoute , private cdr: ChangeDetectorRef, private dataService: DataService){}

  ngOnInit(): void {
     const userId = this.route.snapshot.paramMap.get('id');

     console.log(userId)

    if (!userId) {
      console.error('ID korisnika nije pronađen u URL-u!');
      this.redirectToLogin();
      return;
    }
    this.user = this.dataService.getUser(userId);

    console.log(this.user)
    const userJson = localStorage.getItem('logged_user');
    if (userJson) {
      this.loggedUser = JSON.parse(userJson);
      console.log(this.loggedUser);
    }
    this.post = userId === this.loggedUser?.userId;

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

    expandImages(images: string[], index: number): void {
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
    this.router.navigate(['/login']);
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

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
  
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please select a JPEG or PNG image.');
        return;
      }
  
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
        this.imageString = reader.result as string; 
      };
      reader.readAsDataURL(file);
    }
  }
  
  clearImage(): void {
    this.previewImage = null;
    this.imageString = null;
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  postStar(textarea: HTMLTextAreaElement){
    
    const newStar = {
      starId: "",
      content_imgs: [...this.imageString || ''],
      content: textarea.value,
      user: this.loggedUser!,
      timestamp: new Date().toISOString(),
    };
    console.log('Posting star:', newStar);
    this.previewImage = null;
    this.imageString = null;
    this.stars.unshift(newStar);
    textarea.value = "";  
    this.cdr.detectChanges();
    console.log(this.stars)

  }
  onInput(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

}
