export function setSquareCanvas(element: HTMLCanvasElement) {
  const { clientWidth, clientHeight } = element.parentElement!;
  const size = Math.min(clientWidth, clientHeight);
  element.height = element.width = size;
  return size;
}

export const normalizePixel = (
  px: number,
  containerSize: number,
  canvasSize: number
) => px * (containerSize / canvasSize);

export const unNormalizePixel = (
  px: number,
  containerSize: number,
  canvasSize: number
) => px * (canvasSize / containerSize);

export function getClickedCellPosition(
  canvas: HTMLCanvasElement,
  event: MouseEvent
) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor(event.clientX - rect.left);
  const y = Math.floor(event.clientY - rect.top);
  return { x, y };
}
