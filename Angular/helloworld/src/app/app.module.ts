import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { combineLatest } from 'rxjs';
import { ReferenceComponent } from './reference/reference.component';

// Adding Routes configuration
const routes = [
  { path: 'home', component: HomeComponent },
  {path:'about', component: AboutComponent},  
  //empty path redirect to refrence component
  // pathMatch 'full' ensures that the empty path redirects only when the URL is exactly empty
  {path:'reference', component: ReferenceComponent},
  {path: '', redirectTo: 'reference', pathMatch: 'full'as const}, // without const it showing error due to type mismatch
  // wrong path will redirect to home
  {path:'**', redirectTo: 'reference'}

];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ReferenceComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
