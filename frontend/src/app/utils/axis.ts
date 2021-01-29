export class Axis {
  domain: number[];
  range: number[];
  constructor(domain: number[], range: number[]) {
    this.domain = domain;
    this.range = range;
  }

  transformToPixel(value: number) {
    let perc = (value - this.domain[0]) / (this.domain[1] - this.domain[0]);
    return perc * (this.range[1] - this.range[0]) + this.range[0];
  }
}
