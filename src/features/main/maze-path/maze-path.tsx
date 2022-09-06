import { useEffect, useState } from 'react';
import { setSquareCanvas } from '../../../shared/functions';
import { CreateLocalState } from '../../../shared/state';
import { Point } from '../../../shared/types';
import { AStar } from './a-star';
import { Cell } from './cell';
import { drawConnections } from './functions/draw';
import { getCellPosition } from './functions/helpers';
import { dig } from './functions/tree';
import { MazeDigger } from './maze-digger';
import { CellSize, Node } from './types';

export function MazePath() {
  const state = CreateLocalState({jaha: 'lalala'});
  state({mhm: 'BLAAAHAA'})
  console.log(state())

  // Controls
  let mazePathGridSize: number = 5;
  let mazePathDigSpeed: number = 50;
  let mazePathCancel: boolean = true;

  mazePathCancel = false;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let currentPath: Point[] = [];
  let nodeTree: Node[] = [];
  let gridSize: number = mazePathGridSize;
  let digAll: boolean = true;
  let digSpeed: number = mazePathDigSpeed;
  let mazeFinished: boolean = false;
  let digger: MazeDigger;
  let cellSize: CellSize;
  let grid = Array.from(Array(gridSize * gridSize)).map((el, i) => {
    const { x, y } = getCellPosition(i, gridSize);
    return new Cell(x, y, cellSize, gridSize);
  });
  let aStar = new AStar(0, 0, gridSize);

  function init() {
    canvas = document.querySelector('.maze-path-canvas')!;
    ctx = canvas.getContext('2d')!;
    setSquareCanvas(canvas);
    window.addEventListener('resize', () => setSquareCanvas(canvas));
    cellSize = {
      width: canvas.width / gridSize,
      height: canvas.height / gridSize,
    };
  }

  let callAStar = true;

  function animate() {
    ctx.fillStyle = '#264653';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawConnections(nodeTree, cellSize, ctx);
    if (mazeFinished) {
      if (callAStar) {
        aStar.next(digSpeed, nodeTree);
        callAStar = false;
      }
      aStar.draw(cellSize, ctx);
    }
    const id = requestAnimationFrame(animate);
    if (mazePathCancel) {
      cancelAnimationFrame(id);
    }
  }

  useEffect(() => {
    init();
    animate();
    dig(0, 0, digger!, grid, gridSize, currentPath, nodeTree, digAll, digSpeed, mazeFinished, mazePathCancel);
  }, []);

  return (
    <>
      <canvas className="maze-path-canvas"></canvas>
    </>
  );
}
