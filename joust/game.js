// import blue from './bluebird.js';



/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
              VARIABLES
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */

// #region variable declarations
const canvas = /** @type {CanvasRenderingContext2D} */ (document.getElementById("gamebox"));
const ctx = canvas.getContext("2d");

// holds the setInterval (until requestAnimationFrame is implemented)
let drawInterval = null;

// desperation variables
let redCount = 0;
let blueCount = 0;
let lastRedCount = 0;
let lastBlueCount = 0;

const keysPressed = [];

// i'm not doing drag.
const frictionX = 0.9;
const frictionY = 0.9;

const gravity = .008;

let deaths = 0;
let maxDeaths = 3;
let score = 0;


// KEYS CONSTANTS
const SPACE = 32;
const UP = 38;
const DOWN = 40;
const LEFT = 37;
const RIGHT = 39;

// for future expansion
const a = 65;
const s = 83;
const d = 68;
const w = 87;





// html elements
const blueSprites = document.querySelector(".blue-sprites");
const blueUpflap = document.querySelector(".blue-upflap");
const blueDownflap = document.querySelector(".blue-downflap");

const redSprites = document.querySelector(".red-sprites");

const stopBtn = document.querySelector('.stop-interval');
const startBtn = document.querySelector('.start-interval');
const startOverBtn = document.querySelector('.start-over');
const addBlueBtn = document.querySelector('.add-blue');
const removeBluesBtn = document.querySelector('.remove-blues');
const killRedBtn = document.querySelector('.wipe-out');

const scoreDisplay = document.querySelector('.score');
const deathsDisplay = document.querySelector('.deaths');

const gameOverImage = document.querySelector('.game-over');
const backgroundImage = document.querySelector('.background1');


// blue/red Coords are the locations in the sprite sheets.
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
const redCoords = {
  lt: {
    up: {
      row: 0,
      col: 3
    },
    down: {
      row: 1,
      col: 1
    }
  },
  rt: {
    up: {
      row: 0,
      col: 3
    },
    down: {
      row: 1,
      col: 1
    }
  }
}

// #endregion


/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
            BLUE BIRD CLASS
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */
//  #region blue bird class
class Blue {
  constructor() {
    this.isColliding = false;
    this.dead = false;
    this.invulnerable = false;
    this.width = 40;
    this.dx = 4;
    this.dy = 5;
    this.position = {
      x: Math.random()
        * ((canvas.width - 40) - 40) + 40,
      y: Math.random()
        * ((canvas.height - 40 * .67) - 40 * .67) + 40 * .67
    }
    this.mass = 1;
    this.initialAcceleration = {
      x: .001,
      y: .001
    }
    this.acceleration = {
      x: this.initialAcceleration.x,
      y: this.initialAcceleration.y
    }
    this.velocity = {
      x: 1,
      y: 0
    }

    this.isFlapping = false;

    // blue sprite sheet frames (4x4 [0..3,0..3])
    this.frameWidth = 927;
    this.frameHeight = 633;

    // blueSprites is the whole sprite sheet
    this.image = blueSprites;
    this.width = 40;
    this.height = this.width * .67;

    // default to coords of right-facing unflapped sprite
    this.sprite = blueCoords.rt.down;

  } // end constructor

  die() {
    this.dead = true;
    deaths++;
  }

  updatePosition() {
    this.velocity.y += this.acceleration.y;
    this.position.y += this.velocity.y;
  }

  draw() {
    if (this.dead) {
      setTimeout(() => {
        blues.splice(0);
        addBlue();
        // this.dead = false;
      }, 2000);
      return;
    }

    // are we collided?
    reds.forEach((red) => {
      if (((this.position.x + this.width > red.position.x)
        && (this.position.x + this.width < red.position.x + red.width))
        && ((this.position.y > red.position.y)
          && (this.position.y < red.position.y + red.height))
      ) {
        this.isColliding = true;
        // position needs to be LESS THAN theirs (higher = less on this grid)
        console.log(`red.position.y = ${red.position.y}   blue.position.y = ${this.position.y}`);
        if (!this.invulnerable) {
          if (this.position.y - this.height < red.position.y && this.isColliding) {
            console.log('we win');
            red.die();
            score += 1000;
            this.invulnerable = true;
            setTimeout(() => {

              // give it two seconds so we don't start auto-dying
              this.invulnerable = false;
            }, 4000);
          }
          else {
            console.log('we lose');
            this.die();
          }
        }
        // stopInterval(); 
        this.isColliding = false;
      }
    })


    ctx.drawImage(
      this.image,
      this.sprite.col * this.frameWidth,
      this.sprite.row * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    if (this.position.y < canvas.height - this.height - 5) {
      this.acceleration.y += gravity;
      this.updatePosition();
    }
    else {
      this.velocity.y = 0;
      this.acceleration.y = this.initialAcceleration.y;
    }
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
    // this.velocity.x = 0;
    // this.acceleration.x = this.initialAcceleration.x;
    // this.velocity.x += this.acceleration.x;
    this.position.x -= this.dx;

    if (this.sprite === blueCoords.rt.up) {
      this.sprite = blueCoords.lt.up;
    }
    else if (this.sprite === blueCoords.rt.down) {
      this.sprite = blueCoords.lt.down;
    }
  }
  moveUp() {
    this.velocity.y = 0;
    this.acceleration.y = this.initialAcceleration.y;
    this.velocity.y -= this.acceleration.y;
    this.position.y -= this.dy;
  }
  moveDown() {
    this.position.y += this.dy;
  }

  flap(flap) {
    this.isFlapping = flap ? true : false;



    // HANDLE SPRITE FRAME CHANGES
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

    // HANDLE VERTICAL LIFT
    if (this.position.y > 0 + this.height) {

      this.velocity.y = -1;
      this.acceleration.y = this.initialAcceleration.y;
      this.velocity.y -= this.acceleration.y;

      this.position.y -= this.dy;
    }


  }


}

// #endregion blue bird

/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
            RED BIRD CLASS
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */
//  #region red bird class
class Red {
  constructor() {
    this.dead = false;
    this.ignore = false;
    this.isColliding = false;
    this.width = 60;
    this.dx = 4;
    this.dy = 5;
    this.position = {
      x: canvas.width + this.width,
      y: Math.random()
        * ((canvas.height - 40 * .67) - 40 * .67) + 40 * .67
    }
    this.mass = 1;
    this.initialAcceleration = {
      x: .001,
      y: .001
    }
    this.acceleration = {
      x: this.initialAcceleration.x,
      y: this.initialAcceleration.y
    }
    this.velocity = {
      x: 1,
      y: 0
    }

    this.isFlapping = false;

    // red sprite sheet frames (5x3)
    this.frameWidth = 183.6;
    this.frameHeight = 168.67;
    // redSprites is the whole sprite sheet
    this.image = redSprites;
    this.width = 60;
    this.height = this.width * .67;

    // default to coords of right-facing unflapped sprite
    this.sprite = redCoords.lt.down;

  } // end constructor

  die() {
    this.dead = true;
  }

  updatePosition() {
    this.velocity.y += this.acceleration.y;
    this.position.y += this.velocity.y;

    this.position.x -= this.velocity.x;
  }

  draw() {
    if (this.dead) {
      setTimeout(() => {
        addRed();
        // this.dead = false;
      }, 1000);
      if (this.position.x < 0) {
        this.width = 0;
        this.height = 0;
        this.ignore = true;
      }
      return;
    }
    ctx.drawImage(
      this.image,
      this.sprite.col * this.frameWidth,
      this.sprite.row * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    if (this.position.y < canvas.height - this.height - 5) {
      this.acceleration.y += gravity;
      this.updatePosition();
    }
    else {
      this.velocity.y = 0;
      this.acceleration.y = this.initialAcceleration.y;
    }
  }

  // these functions need some thought
  moveRight() {
    this.position.x += this.dx;
    if (this.sprite === redCoords.lt.up) {
      this.sprite = redCoords.rt.up;
    }
    else if (this.sprite === redCoords.lt.down) {
      this.sprite = redCoords.rt.down;
    }
  }
  moveLeft() {
    // this.velocity.x = 0;
    // this.acceleration.x = this.initialAcceleration.x;
    // this.velocity.x += this.acceleration.x;
    this.position.x -= this.dx;

    if (this.sprite === redCoords.rt.up) {
      this.sprite = redCoords.lt.up;
    }
    else if (this.sprite === redCoords.rt.down) {
      this.sprite = redCoords.lt.down;
    }
  }
  moveUp() {
    this.velocity.y = 0;
    this.acceleration.y = this.initialAcceleration.y;
    this.velocity.y -= this.acceleration.y;
    this.position.y -= this.dy;
  }
  moveDown() {
    this.position.y += this.dy;
  }

  flap(flap) {
    this.isFlapping = flap ? true : false;



    // HANDLE SPRITE FRAME CHANGES
    if (flap) {
      if (this.sprite === redCoords.lt.down || this.sprite === redCoords.lt.up) {
        this.sprite = redCoords.lt.up;
      }
      else if (this.sprite === redCoords.rt.down || this.sprite === redCoords.rt.up) {
        this.sprite = redCoords.rt.up;
      }

    } else {
      // it would help if I could just look for redCoords.lt/rt (no up/down ||s)
      if (
        (this.sprite === redCoords.lt.up || this.sprite === redCoords.lt.down)
      ) {
        this.sprite = redCoords.lt.down;
      }
      else if (
        (this.sprite === redCoords.rt.up || this.sprite === redCoords.rt.down)
      ) {
        this.sprite = redCoords.rt.down;
      }
    }

    // HANDLE VERTICAL LIFT
    if (this.position.y > 0 + this.height) {

      this.velocity.y = -1;
      this.acceleration.y = this.initialAcceleration.y;
      this.velocity.y -= this.acceleration.y;

      this.position.y -= this.dy;
    }


  }
}

// #endregion red bird





/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
            LOAD EVENT
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */
//  #region load event
window.addEventListener('load', () => {
  // blue.image = new Image();
  // blue.image.src = blueSprites.src;
  stopBtn.addEventListener('click', stopInterval);
  startBtn.addEventListener('click', startInterval);
  startOverBtn.addEventListener('click', () => {
    window.location.reload();
  })
  killRedBtn.addEventListener('click', () => {
    reds.forEach((red) => {
      red.die();
    })
    blues.forEach((blue) => {
      blue.die();
    })
    reds.splice(1);
    blues.splice(1);
    killRedBtn.blur();
  });
  addBlueBtn.addEventListener('click', () => {
    addRed();
    // addBlue();
    addBlueBtn.blur();
  });
  removeBluesBtn.addEventListener('click', removeBlues);
  document.addEventListener('keydown', keyDown);
  document.addEventListener('keyup', keyUp);

  addBlue();
  addRed();
  addRed(  );


  // REMOVE FOR BUTTON PUSH START
  startInterval();
})
// #endregion 

/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
           CONTROLS HANDLERS
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */
//  #region controls handlers
const stopInterval = () => {
  clearInterval(drawInterval);
  stopBtn.blur();
}

const startInterval = () => {
  drawInterval = setInterval(drawLoop, 15);
  startBtn.blur();
}

const blues = [];
const reds = [];

const removeBlues = (e) => {
  blues.splice(1);
  removeBluesBtn.blur();
}
const addBlue = () => {
  if (blueCount <= lastBlueCount + 1) {
    blues.push(new Blue());
  }
  lastBlueCount = blueCount;
  blueCount++;

  addBlueBtn.blur();
}


const removeReds = (e) => {
  reds.splice(1);
  // removeRedsBtn.blur();
}
const addRed = () => {
  if (redCount <= lastRedCount + 1) {
    reds.push(new Red());
  }
  lastRedCount = redCount;
  redCount++;
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
  keysPressed[e.keyCode] = true;

  if (e.keyCode === SPACE) {
    blues.forEach((blue) => {
      // blue.flap(true);
    })
  }
}

const keyUp = (e) => {
  keysPressed[e.keyCode] = false;
  if (e.keyCode === SPACE) {
    blues.forEach((blue) => {
      blue.flap(false);
    })
  }
}
// #endregion


// #endregion

/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
          ANIMATION FUNCTIONS
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */
//  #region animation functions
const drawBlues = () => {
  blues.forEach((blue) => {
    blue.draw();
  }) // end foreach
  trackKeyStates();
}

const drawReds = () => {
  reds.forEach((red) => {

    // I mean, why not here?
    if (red.position.x < 0 && !red.ignore) {

      setTimeout(() => { addRed() }, 2000);
    }

    red.draw();
  }) // end foreach
  // trackKeyStates();
}

/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
           TRACK KEY STATES
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */
// #region trackKeyStates
const trackKeyStates = () => {
  // if (keysPressed[UP]) {
  //   blues.forEach((blue) => {
  //     if (blue.position.y > 0) {
  //       blue.moveUp();
  //     }
  //   })
  // }
  // if (keysPressed[DOWN]) {
  //   blues.forEach((blue) => {
  //     if (blue.position.y < canvas.height - blue.height) {
  //       blue.moveDown();
  //     }
  //   })
  // }
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
    })
  }
  else {
    blues.forEach((blue) => {
      if (blue.isFlapping) {
        blue.flap(false);
      }
    })

  }
}

// #endregion


/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
      ANIMATION SetINTERVAL LOOP
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */
let frameCount = 0;
const drawLoop = () => {

  // update scores
  deathsDisplay.innerHTML = deaths;
  scoreDisplay.innerHTML = score;


  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  if (deaths >= maxDeaths) {
    ctx.drawImage(gameOverImage, 0, 0, canvas.width, canvas.height);
    stopInterval();

  }
  if (blues.length > 0) {
    drawBlues();
  }
  if (reds.length > 0) {
    drawReds();
  }

  // autoflap the reds
  frameCount += 1;
  if (frameCount % 30 === 0) {
    reds.forEach((red) => {
      red.flap(true);
    })
  }
  else if (frameCount % 15 === 0) {
    reds.forEach((red) => {
      red.flap(false);
    })
  }
}

const animate = () => {
  // requestAnimationFrame(animate);

  // // update scores
  // deathsDisplay.innerHTML = deaths;
  // scoreDisplay.innerHTML = score;


  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.drawImage(backgroundImage, 0, 0, canvas.width,canvas.height);

  // if (deaths >= maxDeaths) {
  //   ctx.drawImage(gameOverImage, 0, 0, canvas.width, canvas.height);
  //   stopInterval();

  // }
  // if (blues.length > 0) {
  //   drawBlues();
  // }
  // if (reds.length > 0) {
  //   drawReds();
  // }

  // // autoflap the reds
  // frameCount += 1;
  // if (frameCount % 30 === 0) {
  //   reds.forEach((red) => {
  //     red.flap(true);
  //   })
  // }
  // else if (frameCount % 15 === 0) {
  //   reds.forEach((red) => {
  //     red.flap(false);
  //   })
  // }
}
// animate();

// drawInterval = setInterval(draw, 20);
