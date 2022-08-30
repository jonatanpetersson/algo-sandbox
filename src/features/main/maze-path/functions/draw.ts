import { CellSize, Node } from '../types';

export function drawConnections(
  nodeChildren: Node[],
  cellSize: CellSize,
  ctx: CanvasRenderingContext2D
) {
  if (nodeChildren.length) {
    nodeChildren.forEach((node) => {
      if (node.parent) {
        drawConnection(
          node.parent.x,
          node.parent.y,
          node.x,
          node.y,
          cellSize,
          ctx
        );
      }
      if (node.children?.length) {
        drawConnections(node.children, cellSize, ctx);
      }
    });
  }
}

export function drawConnection(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  cellSize: CellSize,
  ctx: CanvasRenderingContext2D
) {
  const { width, height } = cellSize;
  let connectedWidth = width;
  let connectedHeight = height;
  let newStartX = startX <= endX ? startX : endX;
  let newStartY = startY <= endY ? startY : endY;

  if (Math.abs(startX - endX) > 0) {
    connectedWidth *= 2;
  }
  if (Math.abs(startY - endY) > 0) {
    connectedHeight *= 2;
  }

  ctx.fillStyle = '#e9c46a';
  ctx.fillRect(
    newStartX * width + 2,
    newStartY * height + 2,
    connectedWidth - 4,
    connectedHeight - 4
  );
}
