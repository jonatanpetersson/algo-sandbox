import { Point } from './types';

export const degToRad = (deg: number) => deg * (Math.PI / 180);
export const radToDeg = (rad: number) => rad * (180 / Math.PI);
export const pointToRad = (x: number, y: number) => Math.atan2(x, -y);
export const hypot = (A: Point, B: Point) => Math.hypot(B.x - A.x, B.y - A.y);
