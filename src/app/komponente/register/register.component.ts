import { Component } from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup} from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {users} from '../../users';



@Component({
  selector: 'app-register',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,MatIconModule,MatDividerModule,MatButtonModule,FormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private router: Router){}
  users = [...users];
  email:any;
  password:any;
  password2:any;
  username:any;
  firstname:any;
  lastname:any;

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  signup: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.min(3) ]),
    firstname: new FormControl('', [Validators.required, Validators.min(3) ]),
    lastname: new FormControl('', [Validators.required, Validators.min(3) ]),
    email: new FormControl('', [Validators.email, Validators.required ]),
    password: new FormControl('', [Validators.required, Validators.min(3) ]),
    password2: new FormControl('', [Validators.required, Validators.min(3) ])
  });
  hide = true;
  get usernameInput() {return this.signup.get('username');}
  get firstnameInput() {return this.signup.get('firstname');}
  get lastnameInput() {return this.signup.get('lastname');}
  get emailInput() { return this.emailFormControl.get('email'); }
  get passwordInput() { return this.signup.get('password'); }  
  get password2Input() { return this.signup.get('password2'); }  

  register(): boolean {
    let idCounter=0;
    for (const u of users) {
      idCounter++;
      if (u.email === this.email || u.username === this.username || this.password!==this.password2) {
        return false;
      }
    }
    users.push({
      userId: "",
      username: this.username,
      firstname: this.firstname,
      lastname: this.lastname,
      description: "",
      date: new Date(),
      email: this.email,
      password: this.password,
      active: true,
      profile_img: "",
      background_img: ""
    })
    return true;
  }
  

  redirectToLogin = () => {
    if(this.register()){
    this.router.navigate(['/login']);
    }else{
      window.alert("Invalid credentials!");
    }
  }
}
