"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rows = 150;
const cols = 150;
const { canvas, ctx } = initializeCanvas(900, 900);
const cellDimensions = canvas.width / cols;
let cellsArray;
let cellsDict;
let gameInterval;
let gameOn = false;
let tickSpeed = 150;
let populationRatio = 0.1;
let toggleButton;
let resetButton;
let settingsForm;
let tickSpeedInput;
let populationRatioInput;
setupGame();
function setupGame() {
    clearCanvas();
    cellsArray = createCellsArray(rows, cols);
    cellsDict = createCellsDict(cellsArray);
    drawCells(cellsArray);
    toggleButton = document.querySelector(".toggle-game");
    resetButton = document.querySelector(".reset-game");
    settingsForm = document.querySelector(".form");
    tickSpeedInput = document.querySelector("#tick-speed");
    populationRatioInput = document.querySelector("#population-ratio");
    tickSpeedInput.value = tickSpeed + "";
    populationRatioInput.value = populationRatio + "";
    settingsForm.addEventListener("submit", submitSettings);
    toggleButton.addEventListener("click", toggleGame);
    resetButton.addEventListener("click", resetGame);
}
function submitSettings(ev) {
    ev.preventDefault();
    tickSpeed = Number(tickSpeedInput.value);
    populationRatio = Number(populationRatioInput.value);
    resetGame();
}
function initializeCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.classList.add("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    document.body.append(canvas);
    return { canvas, ctx };
}
function toggleGame() {
    gameOn = !gameOn;
    if (gameOn) {
        runGame();
        toggleButton.textContent = "Paus game";
    }
    else {
        stopGame();
        toggleButton.textContent = "Start game";
    }
}
function runGame() {
    gameInterval = setInterval(() => {
        const { updatedCellsDict, updatedCellsArray } = updateCellsState(cellsArray, cellsDict);
        cellsArray = updatedCellsArray;
        cellsDict = updatedCellsDict;
        clearCanvas();
        drawCells(cellsArray);
    }, tickSpeed);
}
function stopGame() {
    clearInterval(gameInterval);
}
function resetGame() {
    gameOn = false;
    clearInterval(gameInterval);
    toggleButton.textContent = "Start game";
    setupGame();
}
function calculateCellPosition(cell) {
    const x = cellDimensions * cell.x;
    const y = cellDimensions * cell.y;
    return { x, y };
}
function drawCells(cellsArray) {
    cellsArray.forEach((cell) => {
        if (cell.alive) {
            const { x, y } = calculateCellPosition(cell);
            ctx.fillStyle = "black";
            ctx.fillRect(x, y, cellDimensions, cellDimensions);
        }
    });
}
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function updateCellsState(cellsArray, cellsDict) {
    const currentCellsDict = JSON.parse(JSON.stringify(cellsDict));
    const currentCellsArray = JSON.parse(JSON.stringify(cellsArray));
    const updatedCellsDict = {};
    const updatedCellsArray = currentCellsArray.map((cell) => {
        const numberOfAliveNeighbours = calculateNumberOfAliveNeighbours(cell, currentCellsDict);
        let cellAlive = false;
        if (cell.alive &&
            (numberOfAliveNeighbours === 2 || numberOfAliveNeighbours === 3)) {
            cellAlive = true;
        }
        else if (!cell.alive && numberOfAliveNeighbours === 3) {
            cellAlive = true;
        }
        updatedCellsDict[cell.position] = Object.assign(Object.assign({}, cell), { alive: cellAlive });
        return Object.assign(Object.assign({}, cell), { alive: cellAlive });
    });
    return { updatedCellsArray, updatedCellsDict };
}
function calculateNumberOfAliveNeighbours(cell, cellsDict) {
    const topLeft = `x${cell.x - 1}y${cell.y - 1}`;
    const topRight = `x${cell.x + 1}y${cell.y - 1}`;
    const bottomRight = `x${cell.x + 1}y${cell.y + 1}`;
    const bottomLeft = `x${cell.x - 1}y${cell.y + 1}`;
    const top = `x${cell.x}y${cell.y - 1}`;
    const bottom = `x${cell.x}y${cell.y + 1}`;
    const right = `x${cell.x + 1}y${cell.y}`;
    const left = `x${cell.x - 1}y${cell.y}`;
    let aliveNeighbours = 0;
    const neighbours = [
        topLeft,
        topRight,
        bottomRight,
        bottomLeft,
        top,
        bottom,
        right,
        left,
    ];
    neighbours.forEach((n) => {
        var _a;
        if ((_a = cellsDict[n]) === null || _a === void 0 ? void 0 : _a.alive) {
            aliveNeighbours++;
        }
    });
    return aliveNeighbours;
}
function createCellsArray(rows, cols) {
    let xLimit = cols;
    let x = 0;
    let y = 0;
    const cellsArray = Array(rows * cols)
        .fill({})
        .map((el) => {
        const position = `x${x}y${y}`;
        const alive = Math.random() < populationRatio;
        const cell = { x, y, position, alive };
        x++;
        if (x === xLimit) {
            x = 0;
            y++;
        }
        return cell;
    });
    return cellsArray;
}
function createCellsDict(cellsArray) {
    const cellsDict = {};
    cellsArray.forEach((c) => {
        cellsDict[c["position"]] = c;
    });
    return cellsDict;
}
