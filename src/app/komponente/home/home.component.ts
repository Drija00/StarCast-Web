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
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

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
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('scroll', { static: true }) scrollDiv!: ElementRef;

  showTopButton = false;

  constructor(private router: Router) {}

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    console.log(this.scrollDiv)
      console.log(this.scrollDiv)
      if (this.scrollDiv) {
        console.log("scroll")
        this.scrollDiv.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
      } else {
        console.error('Element #scroll nije pronađen!');
      };
  }

  onInput(textarea: HTMLTextAreaElement) {
    // Resetuje visinu pre nego što se ponovo postavi
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`; // Postavlja visinu na visinu sadržaja
  }
  

  onScroll() {
    console.log("mjau")
    const scrollTop = this.scrollDiv.nativeElement.scrollTop;
    this.showTopButton = scrollTop > 50;
  }

  scrollToTop() {
    this.scrollDiv.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
