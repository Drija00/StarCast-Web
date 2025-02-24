/* import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormBuilder} from '@angular/forms';
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
export class RegisterComponent implements OnInit{
  signup!:FormGroup;
  constructor(private router: Router,private formBuilder: FormBuilder){
    
  }

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
  
  users = [...users];

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
      join: new Date(),
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
    this.router.navigate(['/login']);
    }else{
      window.alert("Invalid credentials!");
    }
  }
}
 */