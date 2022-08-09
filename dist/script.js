// const homeLink = document.querySelector('.home-link');

// homeLink.addEventListener('click', () => {
//   links.forEach((link) => {
//     link.classList.remove('active-link');
//   });
// });
const links = document.querySelectorAll(
  '.main-header-link, .main-header-title'
);

links.forEach((link) => {
  link.addEventListener('click', (ev) => {
    links.forEach((link) => {
      link.classList.remove('active-link');
    });
    ev.target.classList.add('active-link');
    const settings = document.querySelectorAll(`[data-settings]`);
    settings.forEach((setting) => {
      if (setting.dataset.settings === ev.target.dataset.routelink) {
        setting.classList.remove('settings-invisible');
      } else {
        setting.classList.add('settings-invisible');
      }
    });
  });
});
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
  let AStar = createAStar();
  let currentPath = [];
  let nodeTree = [];
  let gridSize = mazePathGridSize;
  let digAll = true;
  let digSpeed = mazePathDigSpeed;
  let digger;
  let mazeFinished = false;
  setCanvasSize();
  let cellSize = {
    width: canvas.width / gridSize,
    height: canvas.height / gridSize,
  };
  let grid = Array.from(Array(gridSize * gridSize)).map((el, i) => {
    const { x, y } = getCellPosition(i, gridSize);
    return new Cell(x, y, cellSize);
  });
  let aStar = new AStar(0, 0);

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
    if (!currentNode.id) {
      currentNode.id = nodeId(currentNode.x, currentNode.y);
    }
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

  let callAStar = true;

  function animate() {
    ctx.fillStyle = '#264653';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawConnections(nodeTree);
    if (mazeFinished) {
      if (callAStar) {
        aStar.next();
        callAStar = false;
      }
      aStar.draw();
    }
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

  function createAStar() {
    return class AStar {
      constructor(x, y) {
        this.exit = { x: gridSize - 1, y: gridSize - 1 };
        this.exitId = nodeId(this.exit.x, this.exit.y);
        this.x = x;
        this.y = y;
        this.g = 0;
        this.h = this.getH(this.x, this.y);
        this.f = this.getF(this.g, this.h);
        this.id = nodeId(this.x, this.y);
        this.currentPath = [
          {
            x,
            y,
            g: this.g,
            h: this.h,
            f: this.f,
            id: this.id,
          },
        ];
        this.visitedCells = { [this.currentPath[0].id]: true };
        this.neighbours;
        this.nextCell;
      }

      draw() {
        for (let i = 0; i < this.currentPath.length; i++) {
          if (this.currentPath[i + 1]) {
            const { width, height } = cellSize;
            const { x: startX, y: startY } = this.currentPath[i];
            const { x: endX, y: endY } = this.currentPath[i + 1];
            // if (endX && endY) {
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

            ctx.fillStyle = '#48cebf';
            ctx.fillRect(
              newStartX * width + 2,
              newStartY * height + 2,
              connectedWidth - 4,
              connectedHeight - 4
            );
            // }
          }
        }
      }

      next() {
        if (this.exitId === this.id) {
          return;
        }
        this.getPossibleNeighbours();
        if (this.neighbours.length) {
          this.addCostToNeighbours();
          this.selectNextCell();
          this.goToNextCell();
          setTimeout(() => {
            this.next();
          }, digSpeed);
        } else {
          this.backtrack();
        }
      }

      findNeighbours(id, nodes) {
        nodes.forEach((node) => {
          if (node.id === id) {
            this.neighbours = node.children.map((c) => {
              const { children, ...nodeWithoutChildern } = c;
              return nodeWithoutChildern;
            });
            return;
          } else {
            if (node.children.length) {
              this.findNeighbours(id, node.children);
            }
          }
        });
      }

      getPossibleNeighbours() {
        this.neighbours = [];
        this.findNeighbours(nodeId(this.x, this.y), nodeTree);
        if (this.neighbours.length) {
          this.neighbours = this.neighbours.filter(
            (n) => !this.visitedCells[n.id]
          );
        }
        // const cellNeighbours = getCell(this.x, this.y).neighbours;

        // let possibleNeighbours = [];
        // Object.values(cellNeighbours).forEach((neighbour) => {
        //   if (neighbour) {
        //     const cell = getCell(neighbour.x, neighbour.y);
        //     if (!cell.visited) {
        //       possibleNeighbours = [...possibleNeighbours, neighbour];
        //     }
        //   }
        // });
        // if (this..length) {
        //   this.neighbours = possibleNeighbours;
        //   return true;
        // } else {
        //   return false;
        // }
      }

      addCostToNeighbours() {
        this.neighbours = this.neighbours.map((neighbour) => {
          const { x, y } = neighbour;
          const h = this.getH(x, y);
          const g = this.getG(x, y);
          const f = this.getF(g, h);
          return { ...neighbour, f, g, h };
        });
      }

      selectNextCell() {
        // if (!this.neighbours.length) {
        //   this.nextCell = undefined;
        //   return;
        // }
        if (this.neighbours.length === 1) {
          this.nextCell = this.neighbours[0];
          return;
        }
        this.currentCell;
        const lowestFValue = this.neighbours.reduce((a, b) =>
          a.f <= b.f ? a.f : b.f
        );
        const selectableCells = this.neighbours.filter(
          (n) => n.f === lowestFValue
        );
        if (selectableCells.length === 1) {
          this.nextCell = selectableCells[0];
        } else {
          const selectedIndex = Math.floor(
            Math.random() * selectableCells.length
          );
          this.nextCell = selectableCells[selectedIndex];
        }
      }

      goToNextCell() {
        this.currentPath = [...this.currentPath, this.nextCell];
        const { x, y, f, g, h, id } = this.nextCell;
        this.visitedCells[id] = true;
        this.setNewPosition(x, y, f, g, h, id);
        this.nextCell = {};
      }

      getG(x, y) {
        const currentG = this.g;
        const currentH = this.h;
        const neighbourH = this.getH(x, y);
        const hDiff = Math.abs(currentH - neighbourH);
        return currentG + hDiff;
      }
      getH(x, y) {
        const xLength = this.exit.x - x;
        const yLength = this.exit.y - y;
        return Math.sqrt(xLength * xLength + yLength * yLength);
      }
      getF(g, h) {
        return g + h;
      }

      backtrack() {
        this.currentPath.pop();
        if (this.currentPath.length) {
          const previousCell = this.currentPath.at(-1);
          const { x, y, f, g, h, id } = previousCell;
          this.setNewPosition(x, y, f, g, h, id);
          this.nextCell = [];
          this.next();
        }
      }

      setNewPosition(x, y, f, g, h, id) {
        this.x = x;
        this.y = y;
        this.f = f;
        this.g = g;
        this.h = h;
        this.id = id;
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
        } else {
          mazeFinished = true;
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
      newStartX * width + 2,
      newStartY * height + 2,
      connectedWidth - 4,
      connectedHeight - 4
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
let particleAnimationsParticleColour = '#e9c46a';
let particleAnimationsText = 'Hello';
let particleAnimationsParticleRadius = 2;

const particleAnimationsSettingsForm = document.querySelector(
  '.particle-animations-settings'
);
particleAnimationsSettingsForm[0].value = particleAnimationsParticleRadius;
particleAnimationsSettingsForm[1].value = particleAnimationsParticleColour;
particleAnimationsSettingsForm[2].value = particleAnimationsText;
particleAnimationsSettingsForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  particleAnimationsParticleRadius = ev.target[0].value;
  particleAnimationsParticleColour = ev.target[1].value;
  particleAnimationsText = ev.target[2].value;
  window['ParticleAnimations']();
});

function ParticleAnimations() {
  const contentDiv = document.querySelector('.text-particle-tab');
  const canvas = document.querySelector('.text-particle-canvas');
  let offset = getOffset();
  const ctx = canvas.getContext('2d');
  const mouse = { x: null, y: null };
  let Particle = createParticleClass();

  // let randomParticlesList;
  // let amountOfParticles = 2000;

  let particleColour = particleAnimationsParticleColour;
  let speedCoefficient = 0.03;

  let text = particleAnimationsText;
  let textWidth;
  let textParticlesList = [];

  function getOffset() {
    const { top, left } = canvas.getBoundingClientRect();
    return { top, left };
  }

  setCanvasSize();
  canvas.addEventListener('mousemove', setMouseCoordinates);
  window.addEventListener('resize', setCanvasSize);

  drawInitialText();
  initTextParticles();
  animateTextParticles();

  // initRandomParticles();
  // animateRandomParticles();

  function createParticleClass() {
    return class Particle {
      constructor(x, y) {
        this.originalX = x;
        this.originalY = y;
        this.setNewCoordinates(x, y);
        this.radius = particleAnimationsParticleRadius;
        this.weight = Math.floor(Math.random() * 3) + 1;
        this.distanceLimit = canvas.width / 10;
      }
      draw() {
        ctx.fillStyle = particleColour;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
      }
      update() {
        let mdx = this.x - mouse.x;
        let mdy = this.y - mouse.y;
        let idx = this.x - this.initialX;
        let idy = this.y - this.initialY;
        const mDistance = Math.sqrt(mdx * mdx + mdy * mdy);
        const iDistance = Math.sqrt(idx * idx + idy * idy);
        if (mDistance < this.distanceLimit) {
          const force =
            ((this.distanceLimit - mDistance) / this.distanceLimit) *
            this.weight;
          this.x += speedCoefficient * force * mdx;
          this.y += speedCoefficient * force * mdy;
        }
        if (this.initialX !== this.x || this.initialY !== this.x) {
          const returnForce = (iDistance / this.distanceLimit) * this.weight;
          this.x -= speedCoefficient * returnForce * idx;
          this.y -= speedCoefficient * returnForce * idy;
        }
      }
      setNewCoordinates() {
        this.x = this.originalX * (canvas.width / textWidth);
        this.y = this.originalY * (canvas.height / textWidth);
        this.initialX = this.x;
        this.initialY = this.y;
      }
    };
  }

  // function initRandomParticles() {
  //   randomParticlesList = Array.from(Array(amountOfParticles)).map((p) => {
  //     const x = canvas.width * Math.random();
  //     const y = canvas.height * Math.random();
  //     return new Particle(x, y);
  //   });
  // }

  function animateTextParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = 'white';
    // ctx.font = '100px Verdana';
    // ctx.fillText(text, 0, 100);
    // ctx.strokeStyle = 'white';
    // ctx.strokeRect(0, 0, 250, 250);
    for (let i = 0; i < textParticlesList.length; i++) {
      textParticlesList[i].draw();
      textParticlesList[i].update();
    }
    if (currentRoute === 'ParticleAnimations') {
      requestAnimationFrame(animateTextParticles);
    }
  }

  // function animateRandomParticles() {
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   for (let i = 0; i < randomParticlesList.length; i++) {
  //     randomParticlesList[i].draw();
  //     randomParticlesList[i].update();
  //   }
  //   requestAnimationFrame(animateRandomParticles);
  // }

  function drawInitialText() {
    const fontSize = Math.floor(canvas.height * 0.1);
    const font = 'Verdana';
    ctx.fillStyle = 'white';
    ctx.font = fontSize + 'px ' + font;
    textWidth = Math.ceil(ctx.measureText(text).width);
    ctx.fillText(text, 0, fontSize);
  }

  function setCanvasSize() {
    offset = getOffset();
    const { clientWidth, clientHeight } = contentDiv;
    canvas.width = canvas.height =
      clientWidth <= clientHeight ? clientWidth : clientHeight;
    if (textParticlesList.length) {
      for (let i = 0; i < textParticlesList.length; i++) {
        textParticlesList[i].setNewCoordinates();
      }
    }
  }

  function setMouseCoordinates(ev) {
    offset = getOffset();
    mouse.x = ev.x - offset.left;
    mouse.y = ev.y - offset.top;
  }

  function initTextParticles() {
    const rowLength = textWidth;
    const imageDataList = ctx.getImageData(0, 0, rowLength, rowLength).data;
    for (let i = 0; i < imageDataList.length; i++) {
      if ((i % 4 === 0) & (imageDataList[i - 1] > 122)) {
        const y = Math.floor((i / 4 - 1) / rowLength);
        const x = i / 4 - 1 - y * rowLength;
        textParticlesList.push(new Particle(x, y));
      }
    }
  }
}
let currentRoute = '';

const routes = {
  GameOfLife: '<div class="game-of-life-tab" data-routecomponent="GameOfLife">\r\n' +
    '  <p>Under development of being moved to this site.</p>\r\n' +
    '  <p>\r\n' +
    '    Currently available\r\n' +
    '    <a href="https://jp-game-of-life.netlify.app/" target="_blank">here</a>\r\n' +
    '  </p>\r\n' +
    '</div>\r\n',
  Home: '<div data-routecomponent="Home" class="home-tab">\r\n' +
    '  <p>\r\n' +
    "    Hello! I'm Jonatan and this is sort of a playground of mine, dabbling with\r\n" +
    "    data visualisation and algorithms which I've found fascinating and fun\r\n" +
    '    recently.\r\n' +
    '    <br />\r\n' +
    '    <br />\r\n' +
    "    In it's current state it works best on desktop, and there are lots still\r\n" +
    "    under development so don't expect too much.\r\n" +
    '    <br />\r\n' +
    '    <br />\r\n' +
    '    You can find my other development stuff\r\n' +
    '    <a href="https://jonatanpetersson.com/" target="_blank">here</a>.\r\n' +
    '  </p>\r\n' +
    '</div>\r\n',
  MazePath: '<section data-routecomponent="MazePath" class="maze-path-tab">\r\n' +
    '  <canvas class="maze-path-canvas"></canvas>\r\n' +
    '</section>\r\n',
  ParticleAnimations: '<section data-routecomponent="ParticleAnimations" class="text-particle-tab">\r\n' +
    '  <canvas class="text-particle-canvas"></canvas>\r\n' +
    '</section>\r\n'
};
function loadRouteComponent(event, component) {
    event.preventDefault();
    currentRoute = component;
    let shouldReload = true;
    const elements = document.querySelectorAll('[data-routecomponent]');
    elements.forEach((el) => {
        const tempWrapper = document.createElement('div');
        const routeComponent = el.dataset.routecomponent;
        if (routeComponent === component) {
            if (el.style.visibility !== 'hidden') {
                shouldReload = false;
                return;
            }
            tempWrapper.innerHTML = routes[component];
            const newElement = tempWrapper.firstChild;
            el.replaceWith(newElement);
        }
        else {
            tempWrapper.innerHTML = `<div data-routecomponent="${routeComponent}" style="visibility: hidden;"></div>`;
            const newElement = tempWrapper.firstChild;
            el.replaceWith(newElement);
        }
    });
    // @ts-ignore
    if (window[component] && shouldReload) {
        // @ts-ignore
        window[component]();
    }
}