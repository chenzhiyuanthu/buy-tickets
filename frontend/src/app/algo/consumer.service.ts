import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AREAS, MAX_ROW, MAX_TICKETS, MIN_ROW, OFFSET } from '../configs';
import { Request } from './models';

@Injectable({
  providedIn: 'root',
})
export class ConsumerService {
  pointer = 0;
  selectedCntRaw = 0;
  toBeSelected: any = {};
  candidates: any[] = [];
  areaSeats = 0;
  totalSeats = 0;
  rows = 0;
  constructor() {
    this.rows = (MAX_ROW - MIN_ROW) / OFFSET + 1;
    this.areaSeats = ((MIN_ROW + MAX_ROW) * this.rows) / 2;
    this.totalSeats = this.areaSeats * AREAS;
  }
  ended: Subject<boolean> = new Subject<boolean>();

  handleBuyRequest(r: Request) {
    // 1. check toBeSelected
    let cnt = r.cnt;
    let res: any = [];
    if (cnt in this.toBeSelected) {
      // 有空缺满足
      let tmp = this.toBeSelected[cnt];
      let index = 0;
      if (tmp.length > 1) {
        let holesArround = [];
        for (let i = 0; i < tmp.length; i++) {
          let q = tmp[i];
          holesArround[i] = 0;
          let s = this.candidates.indexOf(q[0]);
          let e = this.candidates.indexOf(q[q.length - 1]);
          let sDetail = this.getSeatDetail(s);
          for (let j = 1; j <= MAX_TICKETS; j++) {
            if (s - j in this.candidates) {
              let detail = this.getSeatDetail(this.candidates[s - j]);
              if (
                detail[0] == sDetail[0] &&
                Math.abs(detail[1] - sDetail[1]) == 1
              ) {
                holesArround[i]++;
              } else break;
            } else break;
          }

          for (let j = 1; j <= MAX_TICKETS; j++) {
            if (e + j in this.candidates) {
              let detail = this.getSeatDetail(this.candidates[e + j]);
              if (
                detail[0] == sDetail[0] &&
                Math.abs(detail[1] - sDetail[1]) == 1
              ) {
                holesArround[i]++;
              } else break;
            } else break;
          }
        }

        let min = holesArround[0];
        for (let i = 0; i < holesArround.length; i++) {
          if (holesArround[i] < min) {
            min = holesArround[i];
            index = i;
          }
        }
      }

      res = [].concat(...tmp.splice(index, 1));
      if (tmp.length == 0) {
        delete this.toBeSelected[cnt];
      }
      this.candidates.splice(this.candidates.indexOf(res[0]), r.cnt);
    } else if (this.totalSeats - this.selectedCntRaw >= r.cnt) {
      // 顺序选择后面的座位
      let startInfo = this.getSeatDetail(this.pointer);
      let startArea = startInfo[0];
      let startRow = startInfo[1];
      let endRow = this.getSeatDetail(this.pointer + r.cnt - 1)[1];
      if (startRow == endRow) {
        // 就在这一排选
        for (let i = 0; i < r.cnt; i++) {
          res.push(this.pointer + i);
        }
        //this.pointer += r.cnt;
        this.selectedCntRaw += r.cnt;
        if (this.getSeatDetail(this.pointer + cnt)[1] != endRow) {
          this.pointer = this.getSeatNumber(
            startArea == AREAS - 1 ? 0 : startArea + 1,
            startArea == AREAS - 1 ? startRow + 1 : startRow,
            0
          );
        } else {
          this.pointer += cnt;
        }
      } else {
        // 需要换一排
        let newArea = startArea == AREAS - 1 ? 0 : startArea + 1;
        let newRow = startArea == AREAS - 1 ? startRow + 1 : startRow;
        if (newRow > this.rows) {
          // 没地方选了
          console.error('不应该出现这种情况');
        } else {
          let tmp = [];
          for (var i = 0; i < r.cnt; i++) {
            if (this.getSeatDetail(this.pointer + i)[1] == startRow) {
              tmp.push(this.pointer + i);
              this.candidates.push(this.pointer + i);
            } else break;
          }
          if (!(i in this.toBeSelected)) {
            this.toBeSelected[i] = [];
          }
          this.toBeSelected[i].push(tmp);

          this.selectedCntRaw += i + cnt;
          this.pointer = this.getSeatNumber(newArea, newRow, 0);
          for (let i = 0; i < cnt; i++) {
            res.push(this.pointer + i);
          }
          this.pointer += cnt;
        }
      }
    } else {
      // 没地方选了 TODO
      //console.log(this.candidates.length);
      //console.log(this.toBeSelected);
      this.candidates.sort();
      if (this.candidates.length == 0) {
        this.ended.next();
      } else if (this.candidates.length >= cnt) {
        let found = true;
        for (var i = 0; i < this.candidates.length - cnt + 1; i++) {
          let detail0 = this.getSeatDetail(this.candidates[i]);
          found = true;
          for (var j = 1; j < cnt; j++) {
            let detail = this.getSeatDetail(this.candidates[i + j]);
            if (
              detail[0] == detail0[0] &&
              Math.abs(detail[1] - detail0[1]) <= 1
            ) {
              detail0 = detail;
            } else {
              found = false;
            }
          }
          if (found) break;
        }
        if (found) {
          res = [].concat(...this.candidates.splice(i, cnt));
        }
      }
    }

    return res.map((n: any) => this.getSeatDetail(n));
  }

  getSeatDetail(n: number) {
    let rows = this.rows;
    let areaCnt = this.areaSeats;
    let area = Math.floor(n / areaCnt);
    let q = n % areaCnt;
    for (var i = 0; i < rows; i++) {
      if (MIN_ROW * (i + 1) + (OFFSET * (i + 1) * i) / 2 > q) {
        break;
      }
    }
    let row = i;
    let column = q - (MIN_ROW * i + (OFFSET * i * (i - 1)) / 2);
    return [area, row, column];
  }

  getSeatNumber(area: number, row: number, column: number) {
    return (
      this.areaSeats * area +
      MIN_ROW * row +
      (OFFSET * row * (row - 1)) / 2 +
      column
    );
  }
}
