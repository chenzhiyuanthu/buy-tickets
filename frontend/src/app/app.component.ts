import { Component, ViewChild } from '@angular/core';
import { ConsumerService } from './algo/consumer.service';
import { Request } from './algo/models';
import { AREAS, MAX_TICKETS } from './configs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('AppTheatre', { static: false })
  appTheatre: any;
  constructor(private consumer: ConsumerService) {}
  title = 'frontend';
  ticketsSold = 0;
  start(ready: any) {
    console.log(this.consumer.getSeatDetail(7430));
    console.log(this.consumer.getSeatNumber(3, 22, 18));
    if (ready) {
      let userId = 1;
      let interval = setInterval(() => {
        let a: Request = {
          user: userId++,
          cnt: Math.floor(Math.random() * MAX_TICKETS) + 1,
        };
        if (this.ticketsSold + a.cnt > this.consumer.totalSeats) {
          clearInterval(interval);
        }
        let q = this.consumer.handleBuyRequest(a);
        if (this.appTheatre) {
          this.appTheatre.drawTickets(q);
        }
        this.ticketsSold += q.length;
      }, 10);
    }
  }
}
