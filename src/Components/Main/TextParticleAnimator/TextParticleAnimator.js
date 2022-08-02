function TextParticleAnimator() {
  const contentDiv = document.querySelector('.text-particle-tab');
  const canvas = document.querySelector('.text-particle-canvas');
  const yOffset = canvas.getBoundingClientRect().top;
  const ctx = canvas.getContext('2d');
  const mouse = { x: null, y: null };
  let Particle = createParticleClass();

  // let randomParticlesList;
  // let amountOfParticles = 2000;

  let particleColor = 'white';
  let speedCoefficient = 0.05;

  let text = 'ABC';
  let textParticlesList = [];

  setCanvasSize();
  canvas.addEventListener('mousemove', setMouseCoordinates);

  drawInitialText();
  initTextParticles();
  animateTextParticles();

  // initRandomParticles();
  // animateRandomParticles();

  function createParticleClass() {
    return class Particle {
      constructor(x, y) {
        this.x = 8 * x + 100;
        this.y = 8 * y - 120;
        this.initialX = this.x;
        this.initialY = this.y;
        this.radius = 3;
        this.weight = Math.floor(Math.random() * 3) + 1;
        this.distanceLimit = 150;
      }
      draw() {
        ctx.fillStyle = particleColor;
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
    if (currentRoute === 'TextParticleAnimator') {
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
    ctx.fillStyle = 'white';
    ctx.font = '100px Verdana';
    ctx.fillText(text, 0, 100);
  }

  function setCanvasSize() {
    canvas.width = contentDiv.clientWidth;
    canvas.height = contentDiv.clientHeight;
  }

  function setMouseCoordinates(ev) {
    mouse.x = ev.x;
    mouse.y = ev.y - yOffset;
  }

  function initTextParticles() {
    const rowLength = 250;
    const imageDataList = ctx.getImageData(0, 0, rowLength, 250).data;
    for (let i = 0; i < imageDataList.length; i++) {
      if ((i % 4 === 0) & (imageDataList[i - 1] > 122)) {
        const y = Math.floor((i / 4 - 1) / rowLength);
        const x = i / 4 - 1 - y * rowLength;
        textParticlesList.push(new Particle(x, y));
      }
    }
  }
}
