import { Component } from '@angular/core';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.css']
})
export class ReferenceComponent {
  people: any[] = [
    {
      "name": "DouglasPace",
      "country": 'UK',
      "status":1,
    },
    {
      "name": "McleodMueller",
      "country": 'USA',
      "status":2,
    },
    {
      "name": "DayMeyers",
      "country": 'HK',
      "status":3,
    },
    {
      "name": "AguirreEllis",
      "country": 'HZ',
      "status":1,
    },
    {
      "name": "CookTyson",
      "country": 'LAN',
       "status":2,
    },
     {
      "name": "CookTyson",
      "country": 'RUS',
       "status":3,
    }
  ];

}
