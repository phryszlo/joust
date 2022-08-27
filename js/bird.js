const playerWingState = {
  flapped: '',


}

class PngBird {
  x = 0;
  y = 0;
  constructor(width) {
    console.log(`ctor ${width}`)
    this.width = width;
    this.height = this.width * .67;

  }
  wingState = ''
  flap() {

  }
}
class SvgBird {
  x = 0;
  y = 0;
  constructor(width) {
    console.log(`ctor ${width}`)
    this.width = width;
    this.height = this.width * .67;
  }
  wingState = ''
  flap() {

  }
}

export { PngBird, SvgBird }

