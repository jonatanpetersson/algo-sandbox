import { useEffect } from 'react';
import { Car } from './car';
import { Road } from './road';
import './self-driving-car.scss';
import { Sensor } from './sensor';

export function SelfDrivingCar() {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let car: Car;
  let road: Road;
  let sensor: Sensor;

  function init() {
    canvas = document.querySelector<HTMLCanvasElement>('#carCanvas')!;
    ctx = canvas.getContext('2d')!;
    canvas.width = 200;

    road = new Road(canvas.width / 2, canvas.width * 0.9, 3);
    car = new Car(road.getLaneCenter(1), 100, 30, 50);
  }

  function animate() {
    car.update(road.borders);
    canvas.height = canvas.parentElement?.clientHeight!;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7);

    road.draw(ctx);
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
  }

  useEffect(() => {
    init();
    animate();
  }, []);

  return (
    <>
      <canvas id="carCanvas"></canvas>
    </>
  );
}
