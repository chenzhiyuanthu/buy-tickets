import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AREAS, AREA_COLORS } from '../configs';
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
      this.ready.emit(true);
    }
  }

  width = 0;
  height = 0;
  xAxis: Axis = new Axis([0, 100], []);
  yAxis: Axis = new Axis([0, 100], []);
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

  drawStage() {
    if (this.canvasCtx) {
      let ctx = this.canvasCtx;
      ctx.beginPath();
      ctx.fillStyle = 'green';
      let x = this.xAxis.transformToPixel(40);
      let y = this.yAxis.transformToPixel(80);
      let width = this.xAxis.transformToPixel(20);
      let height = this.yAxis.transformToPixel(10);
      ctx.rect(x, y, width, height);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('舞   台', x + width / 2, y + height / 2);
      ctx.closePath();

      let startAngle = 1.2 * Math.PI;
      let endAngle = 1.8 * Math.PI;
      let r = this.yAxis.transformToPixel(70);
      let minAngle = (endAngle - startAngle) / AREAS;
      for (let i = 0; i < AREAS; i++) {
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 15;
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
