import {Component, OnInit} from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormBuilder} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup} from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {User, users} from '../../users';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,MatIconModule,MatDividerModule,MatButtonModule,FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router: Router, private formBuilder: FormBuilder){console.log(window.innerWidth)}
  switchForm:boolean=true;
  users = [...users];
  email:any;
  password:any;
  signup!:FormGroup;

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  signin: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required ]),
    password: new FormControl('', [Validators.required, Validators.min(3) ])
  });
  hide1 = true;
  get emailInput1() { return this.emailFormControl.get('email'); }
  get passwordInput1() { return this.signin.get('password'); }  
  
  ngOnInit() {
    this.signup = this.formBuilder.group({
      username: ['', [Validators.required, Validators.min(3) ]],
      firstname: ['', [Validators.required, Validators.min(3) ]],
      lastname: ['', [Validators.required, Validators.min(3) ]],
      email: ['', [Validators.email, Validators.required ]],
      password: ['', [Validators.required, Validators.min(3) ]],
      password2: ['', [Validators.required, Validators.min(3) ]]
    })
  }
  


  hide = true;
  get usernameInput() {return this.signup.get('username');}
  get firstnameInput() {return this.signup.get('firstname');}
  get lastnameInput() {return this.signup.get('lastname');}
  get emailInput() { return this.signup.get('email'); }
  get passwordInput() { return this.signup.get('password'); }  
  get password2Input() { return this.signup.get('password2'); }  

  register(): boolean {

    const formValues = this.signup.value;
    let idCounter=0;
    for (const u of users) {
      idCounter++;
      if (u.email === formValues.email || u.username === formValues.username || formValues.password!==formValues.password2) {
        return false;
      }
    }
    users.push({
      userId: "",
      username: formValues.username,
      firstname: formValues.firstname,
      lastname: formValues.lastname,
      description: "",
      date: new Date(),
      email: formValues.email,
      password: formValues.password,
      active: true,
      profile_img: "",
      background_img: ""
    })
    return true;
  }
  

  redirectToLogin = () => {
    if(this.register()){
      this.switchForm = true;
    }else{
      window.alert("Invalid credentials!");
    }
  }

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

  redirectToSignup(){this.switchForm = false;
    }

}
