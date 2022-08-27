import { useEffect } from 'react';

export function Boilerplate() {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  function update() {}

  function draw() {}

  function init() {
    canvas = document.querySelector('.boilerplate-canvas')!;
    ctx = canvas.getContext('2d')!;
    setCanvasSize();
    window.addEventListener('resize', () => setCanvasSize());
  }

  function setCanvasSize() {
    canvas.width = canvas.parentElement?.clientWidth!;
    canvas.height = canvas.parentElement?.clientHeight!;
  }

  function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
  }

  useEffect(() => {
    init();
    animate();
  }, []);

  return (
    <>
      <canvas className="boilerplate-canvas"></canvas>
    </>
  );
}
