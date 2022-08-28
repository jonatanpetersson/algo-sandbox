import { Point } from '../../../shared/types';

export interface Neighbours {
  top: Point | false;
  right: Point | false;
  bottom: Point | false;
  left: Point | false;
}

export interface CellSize {
  width: number;
  height: number;
}

export interface Node {
  x: number;
  y: number;
  children?: Node[];
  parent?: Point;
  id?: string;
}

export interface AStarNode {
  x: number;
  y: number;
  f: number;
  g: number;
  h: number;
  id: string;
}
