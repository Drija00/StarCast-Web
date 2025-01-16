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

  expandedImages: string[] = [];
  currentImageIndex: number = 0;
  currentImageSet: string[] = [];
  previewImages: string[] = [];
  imageStrings: string[] = [];


  constructor(private router: Router, private cdr: ChangeDetectorRef, private dataService: DataService) {}
  expandImages(images: string[], index: number): void {
    this.expandedImages = images;
    this.currentImageIndex = index;
    const imageId = index;
    this.router.navigate(['/image-detail', imageId]);
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
    this.router.navigate(['/login']);
  }

  backToHome(){
    console.log("HOME")
    this.router.navigate(['/home',this.loggedUser?.userId]);
  }

  redirectToUser(starId:string){
    console.log("user")
    this.router.navigate(['/user',starId]);
  }

  ngOnInit(): void {
    const userJson = localStorage.getItem('logged_user');
    this.loadStars();
    if (userJson) {
      this.loggedUser = JSON.parse(userJson);
      console.log(this.loggedUser);
    }
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
              this.loadStars();
            }
          }
        },
        { root: this.scrollDiv.nativeElement, threshold: 1 }
      );
    
      this.observer.observe(this.scrollMarker.nativeElement);
    }
  
  loadStars(): void {
    if (this.loading) {
      console.warn('Učitavanje je već u toku. Preskačem poziv loadStars.');
      return;
    }
  
    this.loading = true;
  
    this.dataService.getStars(this.offset, this.limit).subscribe({
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
      this.previewImages = [];  // If you want to show previews for multiple images
      this.imageStrings = [];   // Store data URLs of the images
  
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.previewImages.push(reader.result as string);  // Add each preview image URL
          this.imageStrings.push(reader.result as string);   // Store the base64 image data
        };
        reader.readAsDataURL(file);
      });
    }
  }
  

  postStar(textarea: HTMLTextAreaElement){
    const newStar = {
      starId: "",
      content_imgs: [...this.previewImages],
      content: textarea.value,
      user: this.loggedUser!,
      timestamp: new Date().toISOString(),
    };
    console.log('Posting star:', newStar);
    this.previewImage = null;
    this.imageString = null;
    this.clearImage()
    this.stars.unshift(newStar);
    textarea.value = "";  
    this.cdr.detectChanges();
    console.log(this.stars)
  }
}
