import { Car } from './car';
import { lerp } from './helpers';

export class Sensor {
  car: Car;
  rayCount: number;
  rayLength: number;
  raySpread: number;
  rays: { x: number; y: number }[][];
  readings: any;
  constructor(car: Car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 100;
    this.raySpread = Math.PI / 2;
    this.rays = [];
    this.readings = [];
  }

  update(roadBorders: { x: number; y: number }[][]) {
    this._castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this._getReading(this.rays[i], roadBorders));
    }
  }

  private _getReading(
    ray: { x: number; y: number }[],
    roadBorders: { x: number; y: number }[][]
  ) {
    let touches = [];
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.rayCount; i++) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'yellow';
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.stroke();
    }
  }

  private _castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]);
    }
  }
}
