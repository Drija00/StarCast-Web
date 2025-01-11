import { Routes } from '@angular/router';
import { LoginComponent } from './komponente/login/login.component';
import { HomeComponent } from './komponente/home/home.component';
import { RegisterComponent } from './komponente/register/register.component';
import { UserComponent } from './komponente/user/user.component';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path:'login', component: LoginComponent},
    {path:'signup', component: RegisterComponent},
    {path:'home/:id', component: HomeComponent},
    {path:'user/:id', component: UserComponent}
];
