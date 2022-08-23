import { Controls } from './controls';
import { Sensor } from './sensor';

export class Car {
  x: number;
  y: number;
  width: number;
  height: number;
  controls: Controls;
  sensor: Sensor;
  speed: number;
  acceleration: number;
  maxSpeed: number;
  friction: number;
  angle: number;
  magnitude: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sensor = new Sensor(this);
    this.controls = new Controls();

    this.speed = 0;
    this.angle = 0;

    this.magnitude = 0.001;
    this.acceleration = 10 * this.magnitude;
    this.maxSpeed = 1000 * this.magnitude;
    this.friction = 2 * this.magnitude;
  }

  update(roadBorders: { x: number; y: number }[][]) {
    this._move();
    this.sensor.update(roadBorders);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    ctx.fillStyle = '#000';
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    ctx.restore();

    this.sensor.draw(ctx);
  }

  private _move() {
    let flip: number = 1;
    if (this.controls.forward) this.speed += this.acceleration;
    if (this.controls.reverse) this.speed -= this.acceleration;

    if (this.speed !== 0) flip = this.speed > 0 ? 1 : -1;
    if (this.controls.left) this.angle += this.acceleration * flip;
    if (this.controls.right) this.angle -= this.acceleration * flip;

    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    if (this.speed < -this.maxSpeed) this.speed = -this.maxSpeed;
    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    if (this.speed < -this.maxSpeed) this.speed = -this.maxSpeed;

    if (this.speed > 0) this.speed -= this.friction;
    if (this.speed < 0) this.speed += this.friction;
    if (this.speed > 0) this.speed -= this.friction;
    if (this.speed < 0) this.speed += this.friction;

    if (Math.abs(this.speed) < this.friction) this.speed = 0;

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
}
