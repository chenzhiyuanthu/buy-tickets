import { Component, ViewChild } from '@angular/core';
import { interval } from 'rxjs';
import { ConsumerService } from './algo/consumer.service';
import { Request } from './algo/models';

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
  ended = false;
  start(ready: any) {
    if (ready) {
      let userId = 1;
      let samples = [1, 2, 3, 4, 5];
      let interval = setInterval(() => {
        let a: Request = {
          user: userId++,
          cnt: samples[Math.floor(Math.random() * samples.length)],
        };
        console.log('用户' + a.user + '欲购买' + a.cnt + '张票');
        let q = this.consumer.handleBuyRequest(a);
        if (this.appTheatre) {
          this.appTheatre.drawTickets(q);
        }
        console.log('成功出票');
        q.forEach((ticket: any) => {
          console.log(
            'ticket -> ' +
              String.fromCharCode(ticket[0] + 65) +
              '区-' +
              ticket[1] +
              '排-' +
              ticket[2] +
              '列'
          );
        });
        console.log('------------------------');
        this.ticketsSold += q.length;
      }, 5);
      this.consumer.ended.subscribe(() => clearInterval(interval));
    }
  }
}
