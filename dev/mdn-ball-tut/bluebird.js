const canvas = /** @type {CanvasRenderingContext2D} */ (document.getElementById("gamebox"));
const ctx = canvas.getContext("2d");

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

const blueSprites = document.querySelector(".blue-sprites");



/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
            BLUE BIRD CLASS
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */
//  #region blue bird class
class blue {
  constructor(width = 40,
    x = Math.random()
      * ((canvas.width - 40) - 40) + 40,
    y = Math.random()
      * ((canvas.height - 40 * .67) - 40 * .67) + 40 * .67) {
    this.width = width;
    this.velocityX = 3;
    this.velocityY = 3;
    this.x = x;
    this.y = y;

  }

  // default to coords of right-facing unflapped sprite
  sprite = blueCoords.rt.down;

  // these functions need some thought
  moveRight() {
    this.x += this.velocityX;
    if (this.sprite === blueCoords.lt.up) {
      this.sprite = blueCoords.rt.up;
    }
    else if (this.sprite === blueCoords.lt.down) {
      this.sprite = blueCoords.rt.down;
    }
  }
  moveLeft() {
    this.x -= this.velocityX;
    if (this.sprite === blueCoords.rt.up) {
      this.sprite = blueCoords.lt.up;
    }
    else if (this.sprite === blueCoords.rt.down) {
      this.sprite = blueCoords.lt.down;
    }
  }
  moveUp() {
    this.y -= this.velocityY;
  }
  moveDown() {
    this.y += this.velocityY;
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

  isFlapping = false;

  // blueSprites is the whole sprite sheet
  image = blueSprites;
  width = 40;
  height = this.width * .67;
  x = canvas.width / 3;
  y = Math.random() * canvas.height;
  dx = this.velocityX;
  dy = this.velocityY;
}

// #endregion

export default blue;