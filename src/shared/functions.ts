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
