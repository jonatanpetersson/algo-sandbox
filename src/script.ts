import { Cell, CellsArray, CellsDict } from './types.js';

runGameOfLife();

function runGameOfLife() {
    let cellsArray = createCellsArray(50, 50);
    let cellsDict = createCellsDict(cellsArray);
    createCellsInUI(cellsArray);
    let counter = 0;
    let i = setInterval(() => {
        const { updatedCellsDict, updatedCellsArray } = updateCellsState(cellsArray, cellsDict);
        cellsArray = updatedCellsArray;
        cellsDict = updatedCellsDict;
        updateCellsInUI(cellsDict);
        counter++;
        if (counter === 300) {
            clearInterval(i);
        }
    }, 100);
}

function updateCellsInUI(cellsDict: CellsDict) {
    const cells = document.querySelectorAll('.cell') as unknown as HTMLElement[];
    cells.forEach(cell => {
        const cellPosition = cell.dataset['position'] as string;
        cell.classList.remove('alive', 'dead');
        cell.classList.add(cellsDict[cellPosition].alive ? 'alive' : 'dead' );
    })
}

function updateCellsState(cellsArray: CellsArray, cellsDict: CellsDict): {updatedCellsArray: CellsArray, updatedCellsDict: CellsDict} {
    const currentCellsDict: CellsDict = JSON.parse(JSON.stringify(cellsDict));
    const currentCellsArray: CellsArray = JSON.parse(JSON.stringify(cellsArray));

    const updatedCellsDict: CellsDict = JSON.parse(JSON.stringify(cellsDict));
    const updatedCellsArray = currentCellsArray.map(cell => {
        const numberOfAliveNeighbours = calculateNumberOfAliveNeighbours(cell, currentCellsDict);
        let cellAlive = cell.alive;

        if (cell.alive && numberOfAliveNeighbours < 2) {
            cellAlive = false;
        }
        if (cell.alive && numberOfAliveNeighbours > 3) {
            cellAlive = false;
        }
        if (!cell.alive && numberOfAliveNeighbours === 3) {
            cellAlive = true;
        }

        updatedCellsDict[cell.position].alive = cellAlive;

        return {...cell, alive: cellAlive};
    });

    return { updatedCellsArray, updatedCellsDict }
}

function calculateNumberOfAliveNeighbours (cell: Cell, cellsDict: CellsDict): number {
    const leftNeighbour = (cell: Cell): number => {
        const x = cell.x - 1;
        const y = cell.y;
        const position = `${x}${y}`;
        const leftNeighbour = cellsDict[position];
        return leftNeighbour?.alive ? 1 : 0;
    }

    const rightNeighbour = (cell: Cell): number => {
        const x = cell.x + 1;
        const y = cell.y;
        const position = `${x}${y}`;
        const leftNeighbour = cellsDict[position];
        return leftNeighbour?.alive ? 1 : 0;
    }

    const topNeighbours = (cell: Cell): number => {
        let numberOfAlive = 0;
        const xs = [cell.x - 1, cell.x, cell.x + 1];
        const y = cell.y - 1;
        xs.forEach(x => {
            const position = `${x}${y}`;
            const neighbour = cellsDict[position];
            numberOfAlive = numberOfAlive + (neighbour?.alive ? 1 : 0);
        });
        return numberOfAlive;
    }

    const bottomNeighbours = (cell: Cell): number => {
        let numberOfAlive = 0;
        const xs = [cell.x - 1, cell.x, cell.x + 1];
        const y = cell.y + 1;
        xs.forEach(x => {
            const position = `${x}${y}`;
            const neighbour = cellsDict[position];
            numberOfAlive = numberOfAlive + (neighbour?.alive ? 1 : 0);
        });
        return numberOfAlive;
    }
    return leftNeighbour(cell) + rightNeighbour(cell) + topNeighbours(cell) + bottomNeighbours(cell);
}

function createCellsArray(rows: number, cols: number): CellsArray {
    let id = 0;
    const outerArray = Array(rows).fill([]);
    const fullArray = outerArray.map((row, y) => {
        const innerArray = Array(cols).fill({}).map((el, x) => {
            const cell = {
                id,
                x: x + 1, 
                y: y + 1, 
                position: `${x + 1}${y + 1}`, 
                alive: Math.random() > 0.5
            };
            id++;
            return cell;
        });
        return innerArray;
    })
    return fullArray.reduce((prev, curr) => [...prev, ...curr], []);
}

function createCellsDict(cellsArray: CellsArray): CellsDict {
    const cellsDict: CellsDict = {};
    cellsArray.forEach(c => {
        cellsDict[c['position']] = c;
    });
    return cellsDict;
}

function createCellsInUI(cellsArray: CellsArray): void {
    const gameArea = document.querySelector('.game-area');
    const cellDimension = 500 / Math.sqrt(cellsArray.length) + 'px';

    cellsArray.forEach(c => {
        const cell = document.createElement('div');

        cell.dataset['id'] = c.id + '';
        cell.dataset['position'] = c.position;
        cell.dataset['x'] = c.x + '';
        cell.dataset['y'] = c.y + '';
        cell.style.width = cellDimension;
        cell.style.height = cellDimension;
        cell.classList.add('cell');
        cell.classList.add(c.alive ? 'alive' : 'dead');

        gameArea?.append(cell);
    })
}