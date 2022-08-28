export type Point = { x: number; y: number };

export interface StateModel {
  gameOfLife: GameOfLifeStateModel;
  particleAnimations: ParticleAnimationsStateModel;
  mazePath: MazePathStateModel;
  selfDrivingCar: SelfDrivingCarStateModel;
  fractalTrees: FractalTreesStateModel;
  canvasTransforms: CanvasTransformsStateModel;
}

export interface GameOfLifeStateModel {
  [key: string]: any;
}
export interface ParticleAnimationsStateModel {
  [key: string]: any;
}
export interface MazePathStateModel {
  [key: string]: any;
}
export interface SelfDrivingCarStateModel {
  [key: string]: any;
}
export interface FractalTreesStateModel {
  [key: string]: any;
}
export interface CanvasTransformsStateModel {
  [key: string]: any;
}
