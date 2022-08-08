let mazePathGridSize = 5;
let mazePathDigSpeed = 50;
let mazePathCancel = true;
const mazePathSettingsForm = document.querySelector('.maze-path-settings');
mazePathSettingsForm[0].value = mazePathGridSize;
mazePathSettingsForm[1].value = mazePathDigSpeed;
mazePathSettingsForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  mazePathCancel = true;
  mazePathGridSize = ev.target[0].value;
  mazePathDigSpeed = ev.target[1].value;
  window['MazePath']();
});

function MazePath() {
  mazePathCancel = false;
  const isNode = (n1, n2) => n1.x === n2.x && n1.y === n2.y;
  const nodeId = (x, y) => `x${x}y${y}`;
  // const canvasY = (y, cellHeight) => y * cellHeight + cellHeight / 2;
  // const canvasX = (x, cellWidth) => x * cellWidth + cellWidth / 2;

  const contentDiv = document.querySelector('.maze-path-tab');
  const canvas = document.querySelector('.maze-path-canvas');
  window.addEventListener('resize', resizeCanvas);
  const ctx = canvas.getContext('2d');
  let Cell = createCell();
  let MazeDigger = createMazeDigger();
  let currentPath = [];
  let nodeTree = [];
  let gridSize = mazePathGridSize;
  let digAll = true;
  let digSpeed = mazePathDigSpeed;
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

  function addNodeRecursive(treeNode, nodeToAdd, nextSelectedNode) {
    if (isNode(treeNode, nodeToAdd) && !mazePathCancel) {
      return addNextNodeAsChildOnCurrentNode(treeNode, nextSelectedNode);
    } else {
      return {
        ...treeNode,
        children: treeNode.children.map((treeNodeChild) =>
          addNodeRecursive(treeNodeChild, nodeToAdd, nextSelectedNode)
        ),
      };
    }
  }

  function addNextNodeAsChildOnCurrentNode(currentNode, nextNode) {
    const updatedNextNode = {
      ...nextNode,
      id: nodeId(nextNode.x, nextNode.y),
      parent: { x: currentNode.x, y: currentNode.y },
      children: [],
    };
    return {
      ...currentNode,
      children: [...currentNode.children, updatedNextNode],
    };
  }

  function addNodeToTree(nodeToAdd, nextSelectedNode) {
    if (!nodeTree.length) {
      nodeTree = [addNextNodeAsChildOnCurrentNode(nodeToAdd, nextSelectedNode)];
      return;
    }

    nodeTree = nodeTree.map((treeNode) => {
      return addNodeRecursive(treeNode, nodeToAdd, nextSelectedNode);
    });
  }

  function animate() {
    ctx.fillStyle = '#264653';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // grid.forEach((cell) => cell.draw());
    drawConnections(nodeTree);
    const id = requestAnimationFrame(animate);
    if (mazePathCancel) {
      cancelAnimationFrame(id);
    }
  }

  function createCell() {
    return class Cell {
      constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.neighbours = setCellNeighbours(this.x, this.y);
        this.visited = false;
      }

      // draw() {
      //   ctx.strokeStyle = '#264653';
      //   ctx.strokeRect(
      //     this.x * this.size.width,
      //     this.y * this.size.height,
      //     this.size.width,
      //     this.size.height
      //   );
      // }
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
        const node = { x, y, children: [] };

        return { node, possibleChildren, nextX, nextY };
      }

      setCurrentPosition(x, y) {
        this.x = x;
        this.y = y;
      }
    };
  }

  function dig(x, y) {
    if (!digger) {
      digger = new MazeDigger(x, y);
    } else {
      digger.setCurrentPosition(x, y);
    }

    const currentCell = getCell(x, y);
    if (!currentCell.visited) {
      currentPath = [...currentPath, { x, y }];
      currentCell.visited = true;
    }

    const { node, possibleChildren, nextX, nextY } =
      digger.getNodeWithSelectedChild();
    const nextNode = { x: nextX, y: nextY };

    if (possibleChildren) {
      addNodeToTree(node, nextNode);
      if (digAll) {
        setTimeout(() => {
          dig(nextX, nextY);
        }, digSpeed);
      }
    } else {
      if (currentPath.length) {
        digger.backtrack();
      }
    }
  }

  function drawConnection(startX, startY, endX, endY, cellSize) {
    const { width, height } = cellSize;
    let connectedWidth = width;
    let connectedHeight = height;
    let newStartX = startX <= endX ? startX : endX;
    let newStartY = startY <= endY ? startY : endY;

    if (Math.abs(startX - endX) > 0) {
      connectedWidth *= 2;
    }
    if (Math.abs(startY - endY) > 0) {
      connectedHeight *= 2;
    }

    ctx.fillStyle = '#e9c46a';
    ctx.fillRect(
      newStartX * width + 1,
      newStartY * height + 1,
      connectedWidth - 2,
      connectedHeight - 2
    );
  }

  function drawConnections(nodeChildren) {
    if (nodeChildren.length) {
      nodeChildren.forEach((node) => {
        if (node.parent) {
          drawConnection(
            node.parent.x,
            node.parent.y,
            node.x,
            node.y,
            cellSize
          );
        }
        if (node.children?.length) {
          drawConnections(node.children);
        }
      });
    }
  }

  // function drawVisited(x, y, cellSize) {
  //   const { width, height } = cellSize;
  //   ctx.fillStyle = '#264653';
  //   ctx.beginPath();
  //   ctx.arc(
  //     x * width + width / 2,
  //     y * height + height / 2,
  //     (width + height) / 16,
  //     0,
  //     2 * Math.PI
  //   );
  //   ctx.fill();
  // }

  function getCell(x, y) {
    return grid[y * gridSize + x];
  }

  function getCellPosition(idx, gridSize) {
    const y = Math.floor(idx / gridSize);
    const x = idx - y * gridSize;
    return { x, y };
  }

  function resizeCanvas() {
    setCanvasSize();
    setCellSize();
  }

  function setCanvasSize() {
    const { clientWidth, clientHeight } = contentDiv;
    canvas.width = canvas.height =
      clientWidth <= clientHeight ? clientWidth : clientHeight;
    // canvas.width = contentDiv.clientWidth;
    // canvas.height = contentDiv.clientHeight - 2;
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
      cell.size = newSize;
    });
  }
}
