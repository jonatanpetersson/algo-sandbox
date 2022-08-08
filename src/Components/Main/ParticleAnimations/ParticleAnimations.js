let particleAnimationsParticleColour = '#e9c46a';

function ParticleAnimations() {
  const contentDiv = document.querySelector('.text-particle-tab');
  const canvas = document.querySelector('.text-particle-canvas');
  let offset = getOffset();
  const ctx = canvas.getContext('2d');
  const mouse = { x: null, y: null };
  let Particle = createParticleClass();

  // let randomParticlesList;
  // let amountOfParticles = 2000;

  let particleColour = '#e9c46a';
  let speedCoefficient = 0.05;

  let text = 'ABC';
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
        this.radius = 2;
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
    console.log(textWidth);
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
