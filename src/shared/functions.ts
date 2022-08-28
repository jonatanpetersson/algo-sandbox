export function setSquareCanvas(element: HTMLCanvasElement) {
  const { clientWidth, clientHeight } = element.parentElement!;
  const size = Math.min(clientWidth, clientHeight);
  element.height = element.width = size;
}
