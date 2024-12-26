import {Component, OnInit} from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup} from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {User, users} from '../users';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,MatIconModule,MatDividerModule,MatButtonModule,FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router: Router){console.log(window.innerWidth)}

  users = [...users];
  email:any;
  password:any;

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  signin: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required ]),
    password: new FormControl('', [Validators.required, Validators.min(3) ])
  });
  hide = true;
  get emailInput() { return this.emailFormControl.get('email'); }
  get passwordInput() { return this.signin.get('password'); }  

  checkCredentials(): User | undefined {
    for (const u of users) {
      if (u.email === this.email && u.password === this.password) {
        return u;
      }
    }
    return undefined;
  }

  redirectToHome() {
    let user = this.checkCredentials();
    if(user){
      console.log(user)
    localStorage.setItem('logged_user',JSON.stringify(user))
    this.router.navigate(['/home',user.userId]);
    }else{
      window.alert("Invalid credentials!");
    }
  }

  redirectToSignup(){
      this.router.navigate(['/signup']);
    }

}
