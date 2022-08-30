import { useContext, useEffect } from 'react';
import {
  normalizePixel,
  setSquareCanvas,
  unNormalizePixel,
} from '../../../shared/functions';
import { UtilizeState } from '../../../shared/state';
import { Point } from '../../../shared/types';
import { degToRad, hypot, pointToRad, radToDeg } from '../../../shared/utils';
import './canvas-transforms.scss';
import { Method } from './types';

export function CanvasTransforms() {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let canvasSize: number = 1000;
  let containerSize: number;
  let mouse: Point;
  let cCenter: number;

  const { state, updateState } = UtilizeState();
  // Normalize / Restore pixel
  const n = (px: number) => normalizePixel(px, containerSize, canvasSize);
  const un = (px: number) => unNormalizePixel(px, containerSize, canvasSize);

  function update() {}

  function draw() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (mouse) {
      if (state!.method === Method.Translate) translate(mouse.x, mouse.y);
      else if (state!.method === Method.Rotate) rotate(mouse.x, mouse.y);
      else if (state!.method === Method.Scale) scale(mouse.x, mouse.y);
      else drawGrid();
    } else {
      drawGrid();
    }
  }

  function scale(x: number, y: number) {
    ctx.save();
    ctx.translate(cCenter, cCenter);
    ctx.scale((x - cCenter) / n(1000), (y - cCenter) / n(1000));
    drawGrid();
    ctx.restore();
  }

  function translate(x: number, y: number) {
    ctx.save();
    ctx.translate(x, y);
    drawGrid();
    ctx.restore();
  }

  function rotate(x: number, y: number) {
    const radius = hypot({ x: 0, y: 0 }, mouse);
    const displayRadius = radius > n(300) ? n(300) : radius;
    const endAngle = pointToRad(mouse.x, mouse.y) - degToRad(90);
    ctx.beginPath();
    ctx.strokeStyle = 'gray';
    ctx.arc(0, 0, displayRadius, 0, endAngle);
    ctx.stroke();

    ctx.save();
    const angle = radToDeg(pointToRad(x, y)) - 90;
    ctx.rotate(degToRad(angle));
    drawGrid();
    ctx.restore();
  }

  function drawGrid() {
    ctx.strokeStyle = 'gray';

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        ctx.strokeRect(n(x * 100), n(y * 100), n(100), n(100));
      }
    }
  }

  function init() {
    canvas = document.querySelector('.canvas-transforms-canvas')!;
    ctx = canvas.getContext('2d')!;
    setCanvasSize();
    window.addEventListener('resize', () => setCanvasSize());
    canvas.addEventListener('mousemove', ({ offsetX: x, offsetY: y }) => {
      mouse = { x, y };
    });
  }

  function setCanvasSize() {
    const size = setSquareCanvas(canvas);
    containerSize = size;
    cCenter = size / 2;
  }

  function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
  }

  useEffect(() => {
    init();
    animate();
  }, [state]);

  return (
    <>
      <canvas className="canvas-transforms-canvas"></canvas>
    </>
  );
}
