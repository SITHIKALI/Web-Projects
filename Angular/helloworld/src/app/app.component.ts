import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'helloworld';
  data1='waiting for input';
   constructor(private router: Router) { }

  // Simple navigation methods
  goHome() {
    this.router.navigate(['/home']);
  }

  goAbout() {
    this.router.navigate(['/about']);
  }

  goReference() {
    this.router.navigate(['/reference']);
  }
  
}
