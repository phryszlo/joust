const playerWingState = {
  flapped: '',
  

}

export default class Bird {
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

