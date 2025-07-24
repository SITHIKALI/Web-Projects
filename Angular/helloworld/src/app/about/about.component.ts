import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
 user: any = null; // Simple user property

  people = [
    { name: "DouglasPace", age: 30, address: "123 UK Street", country: "UK" },
    { name: "McleodMueller", age: 25, address: "456 USA Ave", country: "USA" },
    { name: "DayMeyers", age: 35, address: "789 HK Road", country: "HK" },
    { name: "AguirreEllis", age: 28, address: "321 HZ Street", country: "HZ" },
    { name: "CookTyson", age: 32, address: "654 LAN Blvd", country: "LAN" }
  ];
 constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Get name from URL and find user
    this.route.params.subscribe(params => {
      if (params['name']) {
        this.user = this.people.find(p => p.name === params['name']);
      }
    });
  }
}
