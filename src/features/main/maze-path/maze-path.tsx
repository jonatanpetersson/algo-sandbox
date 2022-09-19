import { useEffect } from 'react';
import { setSquareCanvas } from '../../../shared/functions';

export function MazePath() {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  function init() {
    canvas = document.querySelector('.maze-path-canvas')!;
    ctx = canvas.getContext('2d')!;
    setSquareCanvas(canvas);
    window.addEventListener('resize', () => setSquareCanvas(canvas));
  }

  function animate() {
    requestAnimationFrame(animate);
  }

  useEffect(() => {
    init();
    animate();
  }, []);

  return (
    <>
      <canvas className="maze-path-canvas"></canvas>
    </>
  );
}
