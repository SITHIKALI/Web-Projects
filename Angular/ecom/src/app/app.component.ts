import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ecom';
  courses: any[] = [];
  
  constructor(private db: AngularFireDatabase) {
    // Example of using AngularFireDatabase
   
  }
  // Angular lifecycle hook to initialize the component
  ngOnInit() {
    this.db.list('/courses').valueChanges().subscribe(courses => {
      console.log(courses);
      this.courses = courses as any[];
    });
  }
}
