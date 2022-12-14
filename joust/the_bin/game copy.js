// import blue from './bluebird.js';


/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
              VARIABLES
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */

// #region variable declarations
const canvas = /** @type {CanvasRenderingContext2D} */ (document.getElementById("gamebox"));
const ctx = canvas.getContext("2d");
// let x = canvas.width / 2;
// let y = canvas.height - 30;
// let velocity = {
//   x: 2,
//   y: -2
// }
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

// html elements
const blueSprites = document.querySelector(".blue-sprites");
const blueUpflap = document.querySelector(".blue-upflap");
const blueDownflap = document.querySelector(".blue-downflap");

const stopBtn = document.querySelector('.stop-interval');
const startBtn = document.querySelector('.start-interval');
const addBlueBtn = document.querySelector('.add-blue');
const removeBluesBtn = document.querySelector('.remove-blues');


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

// #endregion

// gravity/drag equations (from https://burakkanber.com/blog/modeling-physics-javascript-gravity-and-drag/ &&
// https://jsfiddle.net/bkanber/39jrM/)

// drag
/*

CD is drag coefficient
ρ = 1.22 (kg / m3) = the density of air
-0.5 is negative because the force pushes Against
    FD = -0.5 * CD * A * ρ * v2
    ||
    FD, x = -0.5 * CD * A * ρ * vx2
    FD, y = -0.5 * CD * A * ρ * vy2
*/

// ag is accel. due to gravity 

// var Cd = 0.47;  // Dimensionless
// var rho = 1.22; // kg / m^3
// var A = Math.PI * blue.radius * blue.radius / (10000); // m^2
// var ag = 9.81;  // m / s^2
// var Fx = -0.5 * Cd * A * rho * blue.velocity.x * blue.velocity.x * blue.velocity.x / Math.abs(blue.velocity.x);
// var Fy = -0.5 * Cd * A * rho * blue.velocity.y * blue.velocity.y * blue.velocity.y / Math.abs(blue.velocity.y);


/*



*/
/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
            BLUE BIRD CLASS
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */
//  #region blue bird class
class blue {
  constructor() {
    this.width = 40;
    this.velocity = {
      x: 0,
      y: 0
    }
    this.dx = 2;
    this.dy = 2;
    this.position = {
      x: Math.random()
        * ((canvas.width - 40) - 40) + 40,
      y: Math.random()
        * ((canvas.height - 40 * .67) - 40 * .67) + 40 * .67
    }
    // this.velocityX = 3;
    // this.velocityY = 3;
    // this.x = x;
    // this.y = y;
    this.mass = 1;
    this.acceleration = {
      x: 0,
      y: 1
    }

    this.isFlapping = false;

    // blueSprites is the whole sprite sheet
    this.image = blueSprites;
    this.width = 40;
    this.height = this.width * .67;

    // default to coords of right-facing unflapped sprite
    this.sprite = blueCoords.rt.down;
  }

  // these functions need some thought
  moveRight() {
    this.position.x += this.dx;
    if (this.sprite === blueCoords.lt.up) {
      this.sprite = blueCoords.rt.up;
    }
    else if (this.sprite === blueCoords.lt.down) {
      this.sprite = blueCoords.rt.down;
    }
  }
  moveLeft() {
    this.position.x -= this.dx;
    if (this.sprite === blueCoords.rt.up) {
      this.sprite = blueCoords.lt.up;
    }
    else if (this.sprite === blueCoords.rt.down) {
      this.sprite = blueCoords.lt.down;
    }
  }
  moveUp() {
    this.position.y -= this.dy;
  }
  moveDown() {
    this.position.y += this.dy;
  }

  flap(flap) {
    this.isFlapping = flap ? true : false;
    console.log(`this.sprite = ${this.sprite.row}, ${this.sprite.col}`);

    if (flap) {
      if (this.sprite === blueCoords.lt.down || this.sprite === blueCoords.lt.up) {
        this.sprite = blueCoords.lt.up;
      }
      else if (this.sprite === blueCoords.rt.down || this.sprite === blueCoords.rt.up) {
        this.sprite = blueCoords.rt.up;
      }

    } else {
      // it would help if I could figure out a way to just look for blueCoords.lt/rt (no up/down ||s)
      if (
        (this.sprite === blueCoords.lt.up || this.sprite === blueCoords.lt.down)
      ) {
        this.sprite = blueCoords.lt.down;
      }
      else if (
        (this.sprite === blueCoords.rt.up || this.sprite === blueCoords.rt.down)
      ) {
        this.sprite = blueCoords.rt.down;
      }
    }
    console.log(`this.sprite = ${this.sprite.row}, ${this.sprite.col}`);
  }
}

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
      console.log(blue.position.x)
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
      blue.position.x,
      blue.position.y,
      blue.width,
      blue.height
    );

    // uncomment to make birds move around and bounce off walls
    // console.log(`${blue.position}..${blue.velocity}`)

    // if (blue.position.x + blue.velocity.x > canvas.width - blue.width || blue.position.x + blue.velocity.x < 0) {
    //   blue.velocity.x = -blue.velocity.x;
    // }
    // if (blue.position.y + blue.velocity.y > canvas.height - blue.height || blue.position.y + blue.velocity.y < 0) {
    //   blue.velocity.y = -blue.velocity.y;
    // }

    // blue.position.x += blue.velocity.x;
    // blue.position.y += blue.velocity.y;
  })
  updateBluePositions();


}

// update positions
const updateBluePositions = () => {
  if (keysPressed[UP]) {
    blues.forEach((blue) => {
      if (blue.position.y > 0) {
        blue.moveUp();
      }
    })
  }
  if (keysPressed[DOWN]) {
    blues.forEach((blue) => {
      if (blue.position.y < canvas.height - blue.height) {
        blue.moveDown();
      }
    })
  }
  if (keysPressed[LEFT]) {
    blues.forEach((blue) => {
      if (blue.position.x > 0) {
        blue.moveLeft();
      }
    })
  }
  if (keysPressed[RIGHT]) {
    blues.forEach((blue) => {
      blues.forEach((blue) => {
        if (blue.position.x < canvas.width - blue.width) {
          blue.moveRight();
        }
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
      //   // blue.x += blue.velocity.x;
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
      //   blue.x += blue.velocity.x;
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

  if (blues.length > 0) {
    drawBlues();

  }
}

const animate = () => {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (blues.length > 0) {
    drawBlues();
  }
}

// drawInterval = setInterval(draw, 20);
