export interface Cell {
    id: number, x: number, y: number, alive: boolean, position: string
}


export type CellsArray = Cell[];

export type CellsDict = {[key: Cell['position']]: Cell};