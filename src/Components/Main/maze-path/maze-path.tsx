import { useEffect } from 'react';

export function MazePath() {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  function init() {
    canvas = document.querySelector('.maze-path-canvas')!;
    ctx = canvas.getContext('2d')!;
    setCanvasSize();
    window.addEventListener('resize', () => setCanvasSize());
  }

  function setCanvasSize() {
    canvas.width = canvas.parentElement?.clientWidth!;
    canvas.height = canvas.parentElement?.clientHeight!;
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
