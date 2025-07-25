import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ReferenceComponent } from './reference/reference.component';
import { UserComponent } from './user/user.component';

// Adding Routes configuration
const routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },  
  { path: 'about/:name', component: AboutComponent },  
  { path: 'reference', component: ReferenceComponent },
  { path: 'user', component: UserComponent }, // Add user route
  { path: '', redirectTo: '/reference', pathMatch: 'full' as const },
  { path: '**', redirectTo: 'reference' },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ReferenceComponent,
    UserComponent // Add UserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, // Import FormsModule to use ngModel
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
