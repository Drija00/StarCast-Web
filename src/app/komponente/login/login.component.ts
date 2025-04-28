import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormBuilder} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup} from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {User, UserRegister, users} from '../../users';
import { DataService } from '../../servisi/data.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,MatIconModule,MatDividerModule,MatButtonModule,FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private formBuilder: FormBuilder, private cdr: ChangeDetectorRef, private dataService: DataService){console.log(window.innerWidth)}
  switchForm:boolean=true;
  users = [...users];
  email3:any;
  password3:any;
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
    this.switchForm = true;
    setTimeout(() => {
      this.signup = this.formBuilder.group({
      username: ['', [Validators.required, Validators.min(3) ]],
      firstName: ['', [Validators.required, Validators.min(3) ]],
      lastName: ['', [Validators.required, Validators.min(3) ]],
      email: ['', [Validators.email, Validators.required ]],
      password: ['', [Validators.required, Validators.min(3) ]],
      password2: ['', [Validators.required, Validators.min(3) ]]
      })
      this.cdr.detectChanges()
    }, 100);
  }
  
  


  hide = true;
  get usernameInput() {return this.signup.get('username');}
  get firstNameInput() {return this.signup.get('firstname');}
  get lastNameInput() {return this.signup.get('lastname');}
  get emailInput() { return this.signup.get('email'); }
  get emailInput3() { return this.email3}
  get passwordInput() { return this.signup.get('password'); }  
  get passwordInput3() { return this.password3 }  
  get password2Input() { return this.signup.get('password2'); }  

  async register(): Promise<boolean> {
    const formValues = this.signup.value;

    for (const u of users) {
      if (u.email === formValues.email || u.username === formValues.username || formValues.password !== formValues.password2) {
        return false;
      }
    }

    let userRegister: UserRegister = {
      username: formValues.username,
      email: formValues.email,
      password: formValues.password,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      active: true
    };

    console.log(formValues);

    try {
      await this.dataService.register(userRegister).toPromise();

      users.push({
        userId: "",
        username: formValues.username,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        description: "",
        joinDate: new Date(),
        email: formValues.email,
        password: formValues.password,
        active: true,
        profileImage: "",
        backgroundImage: "",
        following: [],
        followers: []
      });
      window.alert("Successful registration!");
      return true;
    } catch (err) {
      window.alert('Registration failed!');
      console.error('Registration failed:', err);
      return false;
    }
}

  

  redirectToLogin = async () => {
    if(await this.register()){
      this.switchForm = true;
      setTimeout(() => {
        this.cdr.detectChanges();
      });
    }else{
      window.alert("Invalid credentials!");
    }
  }

  checkCredentials(): User | undefined {
    for (const u of users) {
      if (u.email === this.email3 && u.password === this.password3) {
        return u;
      }
    }
    return undefined;
  }

  async redirectToHome() {
    //let user = this.checkCredentials();
    this.dataService.login(this.email3,this.password3).subscribe(user=>{
      if(user){
        console.log(user)
      localStorage.setItem('logged_user',JSON.stringify(user))
      this.router.navigate(['/home',user.userId]);
      }else{
        window.alert("Invalid credentials!");
      }
    })
  }

  redirectToSignup(){this.switchForm = false;
      this.signup.reset();
      setTimeout(() => {
        this.cdr.detectChanges(); 
      },100);
    }

}


/*import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
import { DataService } from '../../servisi/data.service';
import { HttpClient, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,MatIconModule,MatDividerModule,MatButtonModule,FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private formBuilder: FormBuilder, private cdr: ChangeDetectorRef, private dataService: DataService){console.log(window.innerWidth)}
  switchForm:boolean=true;
  users = [...users];
  email3:any;
  password3:any;
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
    //console.log(this.dataService.apiUrlUser)
    this.switchForm = true;
    setTimeout(() => {
      this.signup = this.formBuilder.group({
      username: ['', [Validators.required, Validators.min(3) ]],
      firstName: ['', [Validators.required, Validators.min(3) ]],
      lastName: ['', [Validators.required, Validators.min(3) ]],
      email: ['', [Validators.email, Validators.required ]],
      password: ['', [Validators.required, Validators.min(3) ]],
      password2: ['', [Validators.required, Validators.min(3) ]]
      })
      this.cdr.detectChanges()
    }, 100);
  }
  
  


  hide = true;
  get usernameInput() {return this.signup.get('username');}
  get firstNameInput() {return this.signup.get('firstName');}
  get lastNameInput() {return this.signup.get('lastName');}
  get emailInput() { return this.signup.get('email'); }
  get emailInput3() { return this.email3}
  get passwordInput() { return this.signup.get('password'); }  
  get passwordInput3() { return this.password3 }  
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
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      description: "",
      joinDate: new Date(),
      email: formValues.email,
      password: formValues.password,
      active: true,
      profileImage: "",
      backgroundImage: "",
      following:[]
    })
    return true;
  }
  

  redirectToLogin = () => {
    if(this.register()){
      this.switchForm = true;
      setTimeout(() => {
        this.cdr.detectChanges(); 
      });
    }else{
      window.alert("Invalid credentials!");
    }
  }

  async checkCredentials(): Promise<User | undefined> {
    try {
      const user = await firstValueFrom(this.dataService.login(this.email3, this.password3));
      console.log(user);
      return user.active ? user : undefined;
    } catch (error) {
      console.error('Login error:', error);
      return undefined;
    }
  }

  async redirectToHome() {
    const user = await this.checkCredentials();
    if (user) {
      console.log(user);
      localStorage.setItem('logged_user', JSON.stringify(user));
      this.router.navigate(['/home', user.userId]);
    } else {
      window.alert('Invalid credentials!');
    }
  }

  redirectToSignup(){this.switchForm = false;
      this.signup.reset();
      setTimeout(() => {
        this.cdr.detectChanges(); 
      },100);
    }

}*/
