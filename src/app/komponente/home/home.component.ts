import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
import { User } from '../users';
import { DataService } from '../../servisi/data.service';
import { Star, stars } from '../posts';

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
    MatInputModule
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


  constructor(private router: Router, private cdr: ChangeDetectorRef, private dataService: DataService) {}

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  backToHome(){
    console.log("HOME")
    this.router.navigate(['/home',this.loggedUser?.userId]);
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

  postStar(textarea: HTMLTextAreaElement){
    const newStar = {
      starId: "",
      content_img: "",
      content: textarea.value,
      user: this.loggedUser!,
      timestamp: new Date().toISOString(),
    };
    
    this.stars.unshift(newStar);
    textarea.value = "";  
    this.cdr.detectChanges();
    console.log(this.stars)

  }
}
