import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AREAS, AREA_COLORS, MAX_ROW, MIN_ROW, OFFSET } from '../configs';
import { Axis } from '../utils/axis';

@Component({
  selector: 'app-theatre',
  templateUrl: './theatre.component.html',
  styleUrls: ['./theatre.component.scss'],
})
export class TheatreComponent implements OnInit {
  @Output() ready: EventEmitter<boolean> = new EventEmitter<boolean>();
  canvas: any;
  @ViewChild('myCanvas', { static: false })
  set _canvas(content: any) {
    if (content) {
      this.canvas = content;
      this.canvasCtx = this.canvas.nativeElement.getContext('2d');
      this.setCanvasSize();
      this.drawStage();
      this.drawSeats();
      this.ready.emit(true);
    }
  }

  width = 0;
  height = 0;
  xAxis: Axis = new Axis([0, 100], []);
  yAxis: Axis = new Axis([0, 100], []);
  startAngle = 1.2 * Math.PI;
  endAngle = 1.8 * Math.PI;
  r = 0;
  cx = 0;
  cy = 0;
  canvasCtx: CanvasRenderingContext2D | null;
  constructor() {
    this.canvasCtx = null;
  }

  setCanvasSize() {
    let canvasElement = this.canvas.nativeElement;
    this.width = canvasElement.clientWidth * 2;
    this.height = canvasElement.clientHeight * 2;
    canvasElement.height = this.height;
    canvasElement.width = this.width;
    this.xAxis.range = [0, this.width];
    this.yAxis.range = [0, this.height];
  }

  drawSeats() {
    if (this.canvasCtx) {
      let ctx = this.canvasCtx;
      let rows = (MAX_ROW - MIN_ROW) / OFFSET + 1;
      ctx.beginPath();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 4;
      for (let area = 0; area < AREAS; area++) {
        for (let row = 0; row < rows; row++) {
          let columns = MIN_ROW + OFFSET * row;
          for (let column = 0; column < columns; column++) {
            let tmp = this.getSeatPosition(area, row, column);
            let startPosition = tmp[0];
            let endPosition = tmp[1];
            ctx.moveTo(startPosition[0], startPosition[1]);
            ctx.lineTo(endPosition[0], endPosition[1]);
          }
        }
      }
      ctx.stroke();
    }
  }

  generateRandomColor() {
    return (
      '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
    );
  }

  drawTickets(tickets: any) {
    let ctx = this.canvasCtx;
    if (ctx) {
      ctx.beginPath();
      ctx.strokeStyle = this.generateRandomColor();
      for (let i = 0; i < tickets.length; i++) {
        let ticket = tickets[i];
        let positions = this.getSeatPosition(ticket[0], ticket[1], ticket[2]);
        ctx.moveTo(positions[0][0], positions[0][1]);
        ctx.lineTo(positions[1][0], positions[1][1]);
      }
      ctx.stroke();
    }
  }

  getSeatPosition(area: number, row: number, column: number) {
    let delta = (this.endAngle - this.startAngle) / AREAS;
    let seats = MIN_ROW + row * OFFSET;
    let startAngle =
      this.startAngle +
      area * delta +
      (delta / seats) * (column + 0.5) -
      Math.PI;
    let rows = (MAX_ROW - MIN_ROW) / OFFSET + 1;
    let r =
      this.r / 2 +
      ((this.r / 2) * row) / rows +
      this.yAxis.transformToPixel(0.4);
    let startPosition = [
      this.cx - r * Math.cos(startAngle),
      this.cy - r * Math.sin(startAngle),
    ];
    r = this.r / 2 + ((this.r / 2) * (row + 1)) / rows;
    let endPosition = [
      this.cx - r * Math.cos(startAngle),
      this.cy - r * Math.sin(startAngle),
    ];

    return [startPosition, endPosition];
  }

  drawStage() {
    if (this.canvasCtx) {
      let ctx = this.canvasCtx;
      ctx.beginPath();
      ctx.fillStyle = 'green';
      let x = this.xAxis.transformToPixel(40);
      let y = this.yAxis.transformToPixel(80);
      let width = this.xAxis.transformToPixel(20);
      let height = this.yAxis.transformToPixel(10);
      this.cx = x + width / 2;
      this.cy = y + height / 2;
      ctx.rect(x, y, width, height);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('舞   台', x + width / 2, y + height / 2);
      ctx.closePath();

      let startAngle = this.startAngle;
      let endAngle = this.endAngle;
      this.r = this.yAxis.transformToPixel(75);
      let r = this.r;
      let minAngle = (endAngle - startAngle) / AREAS;
      for (let i = 0; i < AREAS; i++) {
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        let _startAngle = startAngle + i * minAngle;
        let startX = x + width / 2 - Math.cos(_startAngle - Math.PI) * r;
        let startY = y + height / 2 - Math.sin(_startAngle - Math.PI) * r;
        ctx.moveTo(startX, startY);
        ctx.arc(
          x + width / 2,
          y + height / 2,
          r,
          _startAngle,
          _startAngle + minAngle
        );
        ctx.lineTo(
          this.cx +
            (Math.cos(Math.PI * 2 - _startAngle - minAngle) * this.r) / 2,
          this.cy -
            (Math.sin(Math.PI * 2 - _startAngle - minAngle) * this.r) / 2
        );
        ctx.arc(
          x + width / 2,
          y + height / 2,
          r / 2,
          _startAngle + minAngle,
          _startAngle,
          true
        );
        ctx.lineTo(startX, startY);
        ctx.stroke();
        ctx.fillStyle = AREA_COLORS[i];
        ctx.fill();
        ctx.closePath();
      }
    }
  }

  ngOnInit(): void {}
}
