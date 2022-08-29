const canvas = /** @type {CanvasRenderingContext2D} */ (document.getElementById("gamebox"));
const ctx = canvas.getContext("2d");
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
// sprite sheet frames (4x2)
const frameWidth = 927;
const frameHeight = 633;
let row = 2;
let column = 4;

let blueIsFlapping = false;
const blueSprites = document.querySelector(".blue-sprites");
const blueUpflap = document.querySelector(".blue-upflap");
const blueDownflap = document.querySelector(".blue-downflap");
// const blueSprites = [blueDownflap.src, blueUpflap.src];
const ballRadius = 10;

window.addEventListener('load', () => {
  Blue.image = new Image();
  Blue.image.src = blueSprites.src;
  document.querySelector('.stop-interval').addEventListener('click', stopIntervalClick);
  //  document.querySelector('.switch-sprite').addEventListener('click', switchSprite );
  document.addEventListener('keydown', keyDown );
  document.addEventListener('keyup', keyUp );
})

const keyDown = (e) => {
  console.log(e.key)
  if (e.key === ' ') {
    flapSprite(true);
  }
}

const keyUp = (e) => {
  if (e.key === ' ') {
    flapSprite(false);
  }
}

// flapSprite wants a boolean argument
const flapSprite = (flap) => {
  blueIsFlapping = flap ? true : false;
}

const switchSprite = (e) => {
  blueIsFlapping = !blueIsFlapping;
}
const stopIntervalClick = (e) => {
  console.log(e.target);
  clearInterval(drawInterval);
}

const drawSquare = () => {
  ctx.beginPath();
  ctx.rect(20, 40, 50, 50);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();
}

const drawGreenBall = () => {
  ctx.beginPath();
  ctx.arc(240, 160, 20, 0, Math.PI * 2, false);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.closePath();
}

const drawOpenRect = () => {
  ctx.beginPath();
  ctx.rect(160, 10, 100, 40);
  ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
  ctx.stroke();
  ctx.closePath();
}

const blue = {
  image: blueSprites,
  width: 40,
  height: 40 * .67,
  x: canvas.width / 3,
  y: Math.random() * canvas.height,
  dx: 1.5,
  dy: -2
}

const drawBall = () => {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

const drawblue = () => {
  row = blueIsFlapping ? 1 : 0;
  column = blueIsFlapping ? 3 : 0;
  ctx.drawImage(Blue.image, column * frameWidth, row * frameHeight, frameWidth, frameHeight, Blue.x, Blue.y, Blue.width, Blue.height);
  // ctx.drawImage(blue.image, blue.x, blue.y, 40, 40 * .67);
}


  /*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
              ANIMATION LOOP
          ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */   
const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawGreenBall();
  drawSquare();
  drawOpenRect();
  drawblue();
  if (y + dy > canvas.height || y + dy < 0) {
    dy = -dy;
  }
  if (x + dx > canvas.width || x + dx < 0) {
    dx = -dx;
  }
  if (Blue.x + Blue.dx > canvas.width - Blue.width || Blue.x + Blue.dx < 0) {
    Blue.dx = -Blue.dx;
   }
  if (Blue.y + Blue.dy > canvas.height - Blue.height || Blue.y + Blue.dy < 0) {
    Blue.dy = -Blue.dy;
  }

  x += dx;
  y += dy;
  Blue.x += Blue.dx;
  Blue.y += Blue.dy;
}
const drawInterval = setInterval(drawLoop, 20);
