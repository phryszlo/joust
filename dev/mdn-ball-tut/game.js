import blue from './bluebird.js';


/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
              VARIABLES
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */

// #region variable declarations
const canvas = /** @type {CanvasRenderingContext2D} */ (document.getElementById("gamebox"));
const ctx = canvas.getContext("2d");
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 10;
const keysPressed = [];

const frictionX = 0.9;
const frictionY = 0.9;
const gravity = 5;

// KEYS CONSTANTS
// const SPACE = ' ';
// const UP = 'ArrowUp';
// const DOWN = 'ArrowDown';
// const LEFT = 'ArrowLeft';
// const RIGHT = 'ArrowRight';
const SPACE = 32;
const UP = 38;
const DOWN = 40;
const LEFT = 37;
const RIGHT = 39;
const a = 65;
const s = 83;
const d = 68;
const w = 87;

let drawInterval;
const keyEventTracker = function (e) { keysPressed[e.keyCode] = e.type == 'keydown'; }
window.addEventListener("keydown", keyEventTracker);
window.addEventListener("keyup", keyEventTracker);

// sprite sheet frames (4x4 [0..3,0..3])
const frameWidth = 927;
const frameHeight = 633;
const blueCoords = {
  lt: {
    up: {
      row: 3,
      col: 3
    },
    down: {
      row: 2,
      col: 0
    }
  },
  rt: {
    up: {
      row: 1,
      col: 0
    },
    down: {
      row: 0,
      col: 3
    }
  }
}
let row = 2;
let column = 4;

// html elements
const blueSprites = document.querySelector(".blue-sprites");
const blueUpflap = document.querySelector(".blue-upflap");
const blueDownflap = document.querySelector(".blue-downflap");

const stopBtn = document.querySelector('.stop-interval');
const startBtn = document.querySelector('.start-interval');
const addBlueBtn = document.querySelector('.add-blue');
const removeBluesBtn = document.querySelector('.remove-blues');

// #endregion

/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
            LOAD EVENT
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */
//  #region load event
window.addEventListener('load', () => {
  // blue.image = new Image();
  // blue.image.src = blueSprites.src;
  stopBtn.addEventListener('click', stopInterval);
  startBtn.addEventListener('click', startInterval);
  addBlueBtn.addEventListener('click', () => {
    addBlue();
  });
  removeBluesBtn.addEventListener('click', removeBlues);
  document.addEventListener('keydown', keyDown);
  document.addEventListener('keyup', keyUp);

  // REMOVE FOR BUTTON PUSH START
  startInterval();
})
// #endregion

/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
           CONTROLS HANDLERS
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */
//  #region controls handlers
const stopInterval = (e) => {
  clearInterval(drawInterval);
  stopBtn.blur();
}

const startInterval = () => {
  drawInterval = setInterval(draw, 20);
  startBtn.blur();
}

const blues = [];

const removeBlues = (e) => {
  console.log('remove blues')
  blues.splice(1);
  removeBluesBtn.blur();
}

const addBlue = () => {
  console.log(blues.length)
  blues.push(new blue());
  addBlueBtn.blur();
}

// #endregion

/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
            SPRITE ACTIONS
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */
//  #region sprite actions

// flapSprite wants a boolean argument
// const flapSprite = (flap) => {
//   blueIsFlapping = flap ? true : false;
// }

const allBluesSpeedUp = () => {
  blues.forEach(blue => {
    blue.speedUp();
  })
}
const allBluesSlowDown = () => {
  blues.forEach(blue => {
    blue.slowDown();
  })
}



// #endregion

/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
             KEY HANDLERS
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */
//  #region key handlers
const keyDown = (e) => {
  console.log(e.keyCode);
  keysPressed[e.keyCode] = true;

  if (e.keyCode === SPACE) {
    console.log('space')
    blues.forEach((blue) => {
      console.log(blue.x)
      // blue.flap(true);
    })
  }
}

const keyUp = (e) => {
  keysPressed[e.keyCode] = false;
  if (e.keyCode === SPACE) {
    console.log('space up');
    blues.forEach((blue) => {
      blue.flap(false);
    })
  }
}
// #endregion

/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
       OBJECT DRAWING FUNCTIONS
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */
//#region object drawing functions
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

const drawBall = () => {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// #endregion

// just for testing
// const drawblue = () => {
//   row = blues[0].isFlapping ? 1 : 0;
//   column = blues[0].isFlapping ? 3 : 0;

//   // this does the pixel sheet row/column image switching
//   ctx.drawImage(
//     blues[0].image,
//     column * frameWidth,
//     row * frameHeight,
//     frameWidth,
//     frameHeight,
//     blues[0].x,
//     blues[0].y,
//     blues[0].width,
//     blues[0].height
//   );
// }


/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
          ANIMATION FUNCTIONS
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */
//  #region animation functions
const drawBlues = () => {
  blues.forEach((blue) => {
    console.log(`blue.sprite = ${blue.sprite.row}, ${blue.sprite.col}`);

    // blue.sprite.col/row * frameWidth/Height: chooses the sprite from the sheet
    ctx.drawImage(
      blue.image,
      blue.sprite.col * frameWidth,
      blue.sprite.row * frameHeight,
      frameWidth,
      frameHeight,
      blue.x,
      blue.y,
      blue.width,
      blue.height
    );
  })
  updateBluePositions();
}

// update positions
const updateBluePositions = () => {
  if (keysPressed[UP]) {
    blues.forEach((blue) => {
      blue.moveUp();
    })
  }
  if (keysPressed[DOWN]) {
    blues.forEach((blue) => {
      blue.moveDown();
    })
  }
  if (keysPressed[LEFT]) {
    blues.forEach((blue) => {

      // blue.x -= blue.dx;
      blue.moveLeft();
    })
  }
  if (keysPressed[RIGHT]) {
    blues.forEach((blue) => {
      blues.forEach((blue) => {
        blue.moveRight();
      })
    })
  }

  if (keysPressed[SPACE]) {
    blues.forEach((blue) => {
      if (!blue.isFlapping) {
        blue.flap(true);
      }
      // if (blue.sprite === blueCoords.lt.down || blue.sprite === blueCoords.lt.up ) {
      //   blue.sprite = blueCoords.lt.up;
      //   // blue.x += blue.dx;
      // }
      // else if (blue.sprite === blueCoords.rt.down || blue.sprite === blueCoords.rt.up) {
      //   blue.sprite = blueCoords.rt.up;
      // }
    })
  }
  else {
    blues.forEach((blue) => {
      if (blue.isFlapping) {
        blue.flap(false);
      }

      // it would help if I could figure out a way to just look for blueCoords.lt/rt (no up/down ||s)
      // if (blue.sprite === blueCoords.lt.up || blue.sprite === blueCoords.lt.down) {
      //   blue.sprite = blueCoords.lt.down;
      //   blue.x += blue.dx;
      // }
      // else if (blue.sprite === blueCoords.rt.up || blue.sprite === blueCoords.rt.down) {
      //   blue.sprite = blueCoords.rt.down;
      // }
    })

  }
}

// #endregion


/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
            INTERVAL LOOP
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */
const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawGreenBall();
  drawSquare();
  drawOpenRect();
  drawBlues();
  // if (blues.length > 0) {
  //   drawblue();
  // }
  if (y + dy > canvas.height || y + dy < 0) {
    dy = -dy;
  }
  if (x + dx > canvas.width || x + dx < 0) {
    dx = -dx;
  }
  if (blue.x + blue.dx > canvas.width - blue.width || blue.x + blue.dx < 0) {
    blue.dx = -blue.dx;
  }
  if (blue.y + blue.dy > canvas.height - blue.height || blue.y + blue.dy < 0) {
    blue.dy = -blue.dy;
  }

  x += dx;
  y += dy;
  blue.x += blue.dx;
  blue.y += blue.dy;
}
// drawInterval = setInterval(draw, 20);
