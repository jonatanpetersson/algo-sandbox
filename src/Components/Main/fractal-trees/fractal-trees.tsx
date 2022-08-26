import { useEffect } from 'react';

export function FractalTrees() {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  function drawTree(
    x: number,
    y: number,
    length: number,
    width: number,
    angle: number
  ) {
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = length > 20 ? 'brown' : 'green';
    ctx.lineWidth = width;

    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 360);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -length);
    ctx.stroke();

    if (length < 10) {
      ctx.restore();
      return;
    } else {
      drawTree(0, -length, length * 0.85, 1 + length / 10, angle - 8);
      drawTree(0, -length, length * 0.75, 1 + length / 10, angle + 20);
    }

    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const length = 120;

    drawTree(
      canvas.width / 2,
      (canvas.height / 10) * 9,
      length,
      1 + length / 10,
      0
    );
  }

  function init() {
    canvas = document.querySelector('.fractal-trees-canvas')!;
    canvas.width = canvas.parentElement?.clientWidth!;
    canvas.height = canvas.parentElement?.clientHeight!;
    ctx = canvas.getContext('2d')!;
    window.addEventListener('resize', () => {
      canvas.width = canvas.parentElement?.clientWidth!;
      canvas.height = canvas.parentElement?.clientHeight!;
      draw();
    });
    canvas.addEventListener('click', (ev: any) => {
      drawTree(
        ev.x - ev.target.offsetLeft,
        ev.y - ev.target.offsetTop,
        120,
        1 + 120 / 10,
        0
      );
    });
  }

  function animate() {
    draw();
    // requestAnimationFrame(animate);
  }

  useEffect(() => {
    init();
    animate();
  }, []);

  return (
    <>
      <canvas className="fractal-trees-canvas"></canvas>
    </>
  );
}
