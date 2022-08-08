function MazePath() {
  const isNode = (n1, n2) => n1.x === n2.x && n1.y === n2.y;
  const nodeId = (x, y) => `x${x}y${y}`;

  const contentDiv = document.querySelector('.maze-path-tab');
  const canvas = document.querySelector('.maze-path-canvas');
  window.addEventListener('resize', resizeCanvas);
  const ctx = canvas.getContext('2d');
  let Cell = createCell();
  let MazeDigger = createMazeDigger();
  let gridSize = 10;
  let currentPath = [];
  let nodeTree = [];
  let digger;

  setCanvasSize();

  let cellSize = {
    width: canvas.width / gridSize,
    height: canvas.height / gridSize,
  };

  let grid = Array.from(Array(gridSize * gridSize)).map((el, i) => {
    const { x, y } = getCellPosition(i, gridSize);
    return new Cell(x, y, cellSize);
  });

  animate();
  dig(0, 0);

  function dig(x, y) {
    if (!digger) {
      digger = new MazeDigger(x, y);
    } else {
      digger.setCurrentPosition(x, y);
    }

    const currentCell = getCell(x, y);
    if (!currentCell.visited) {
      currentPath = [...currentPath, { x, y }];
      currentCell.markAsVisited();
    }

    const { node, possibleChildren, nextX, nextY } =
      digger.getNodeWithSelectedChild();

    if (possibleChildren) {
      addNodeToTree(node, nodeTree);
      drawConnection(x, y, nextX, nextY, cellSize);
      dig(nextX, nextY);
    } else {
      if (currentPath.length) {
        digger.backtrack();
      }
    }
  }

  function addNodeToTree(node, tree) {
    if (!tree.length) {
      nodeTree = [...nodeTree, node];
      return;
    }

    nodeTree = tree.map((treeNode) => ({
      ...treeNode,
      children: treeNode.children.map((c) => addNode(node, c, treeNode)),
    }));
  }

  function addNode(node, child, parent) {
    if (isNode(node, child)) {
      return {
        ...node,
        parent: { x: parent.x, y: parent.y },
        id: nodeId(node.x, node.y),
      };
    } else {
      return {
        ...child,
        children: child.children.map((c) => addNode(node, c, child)),
      };
    }
  }

  function canvasY(y, cellHeight) {
    return y * cellHeight + cellHeight / 2;
  }
  function canvasX(x, cellWidth) {
    return x * cellWidth + cellWidth / 2;
  }

  function drawConnection(startX, startY, endX, endY, cellSize) {
    const { width, height } = cellSize;
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.moveTo(canvasX(startX, width), canvasY(startY, height));
    ctx.lineTo(canvasX(endX, width), canvasY(endY, height));
    ctx.stroke();
  }

  function resizeCanvas() {
    setCanvasSize();
    setCellSize();
  }

  function createCell() {
    return class Cell {
      constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.neighbours = setCellNeighbours(x, y);
        this.visited = false;
      }

      reSize(newSize) {
        this.size = newSize;
      }

      draw() {
        ctx.strokeStyle = '#264653';
        ctx.strokeRect(
          this.x * this.size.width,
          this.y * this.size.height,
          this.size.width,
          this.size.height
        );
      }

      markAsVisited() {
        this.visited = true;
        const { width, height } = this.size;
        ctx.fillStyle = '#264653';
        ctx.beginPath();
        ctx.arc(
          this.x * width + width / 2,
          this.y * height + height / 2,
          (width + height) / 16,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }
    };
  }

  function createMazeDigger() {
    return class MazeDigger {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }

      backtrack() {
        currentPath.pop();
        if (currentPath.length) {
          const { x, y } = currentPath.at(-1);
          dig(x, y);
        }
      }

      setCurrentPosition(x, y) {
        this.x = x;
        this.y = y;
      }

      getNodeWithSelectedChild() {
        const currentCell = getCell(this.x, this.y);
        const cellNeighbours = currentCell.neighbours;

        let possibleChildren = [];
        Object.values(cellNeighbours).forEach((cellPosition) => {
          if (cellPosition) {
            const { x, y } = cellPosition;
            const cell = getCell(x, y);
            if (!cell.visited) {
              const childNode = { x, y, children: [] };
              possibleChildren = [...possibleChildren, childNode];
            }
          }
        });
        if (!possibleChildren.length) {
          return false;
        }
        const selectedIndex = Math.floor(
          Math.random() * possibleChildren.length
        );
        const selectedCell = possibleChildren[selectedIndex];
        const nextX = selectedCell.x;
        const nextY = selectedCell.y;

        const x = this.x;
        const y = this.y;
        const node = { x, y, children: [selectedCell] };

        return { node, possibleChildren, nextX, nextY };
      }
    };
  }

  function setCellNeighbours(x, y) {
    const neighbours = {
      top: { x: x, y: y - 1 },
      right: { x: x + 1, y: y },
      bottom: { x: x, y: y + 1 },
      left: { x: x - 1, y: y },
    };

    if (y === gridSize - 1) {
      neighbours.bottom = false;
    }
    if (x === gridSize - 1) {
      neighbours.right = false;
    }
    if (y === 0) {
      neighbours.top = false;
    }
    if (x === 0) {
      neighbours.left = false;
    }

    return neighbours;
  }

  function getCell(x, y) {
    return grid[y * gridSize + x];
  }

  function getCellPosition(idx, gridSize) {
    const y = Math.floor(idx / gridSize);
    const x = idx - y * gridSize;
    return { x, y };
  }

  function animate() {
    grid.forEach((cell) => cell.draw());
    requestAnimationFrame(animate);
  }

  function setCanvasSize() {
    canvas.width = contentDiv.clientWidth;
    canvas.height = contentDiv.clientHeight - 2;
  }

  function setCellSize() {
    cellSize = {
      width: canvas.width / gridSize,
      height: canvas.height / gridSize,
    };
    grid.forEach((cell) => {
      const newSize = {
        width: canvas.width / gridSize,
        height: canvas.height / gridSize,
      };
      cell.reSize(newSize);
    });
  }
}
