import {OnInit,AfterContentInit, AfterContentChecked, AfterViewChecked, AfterViewInit, Component, DoCheck, OnChanges, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnChanges {
  // ngOnChanges is called when any data-bound input property changes.
  // It is called before ngOnInit and whenever one or more data-bound input properties change.
  @Input('data1') data1='';
  ngOnChanges() {
    console.log('ngOnChanges called');
  }

  ngOnInit() {
    console.log('ngOnInit called');
  }


}
