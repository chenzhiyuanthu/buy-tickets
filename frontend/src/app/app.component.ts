import { Component } from '@angular/core';
import {Request} from './algo/models';
import { AREAS, MAX_TICKETS } from './configs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';
  start(ready: any) {
    let interval = setInterval(() => {
      let a: Request = {
        cnt: Math.floor(Math.random() * MAX_TICKETS) + 1,
      };
      console.log(a);
    }, 1000);
  }
}
