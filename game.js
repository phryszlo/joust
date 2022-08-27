import Bird from './js/bird.js'
import paths from './js/birdpaths.js'
// import {SvgPath} from 'svg-path-to-canvas'

window.addEventListener("DOMContentLoaded", () => {
  setupEvents();
  loadSprites();
});


const canvas = document.querySelector('.gamebox');
const ctx = canvas.getContext('2d');

const player = new Bird(20);
// const enemies = 
const setupEvents = () => {
  document.addEventListener("keydown", keyDown);
}

const loadSprites = () => {
  // var svgElement = document.querySelector('#sprites');
  // let { width, height } = svgElement.getBBox();
  // console.log(width, height)
  // let clonedSvgElement = svgElement.cloneNode(true);
  // // true for deep clone
  // let outerHTML = clonedSvgElement.outerHTML,
  // blob = new Blob([outerHTML], { type: 'image/svg+xml;charset=utf-8' });
  // let URL = window.URL || window.webkitURL || window;
  // let blobURL = URL.createObjectURL(blob);

  console.log('loadSprites')
  console.log(player.x)
  const image = new Image();

  // image.src = 'images/walking.png';
  // ctx.drawImage(image, 10, 10, player.width, player.height);
  // image.src = 'images/coast.png';
  // ctx.drawImage(image, 50, 10, player.width + 7, player.height - 2);
  // image.src = 'images/red-upflap-30px.png';
  // console.log(image.src)
  // ctx.drawImage(image, 100, 100, 40, 30);

  // var path = new Path2D('M 100,100 h 50 v 50 h 50');
  // ctx.stroke(path);


  image.src = 'images/red-downflap.png';
  ctx.drawImage(image, 50, 50, player.width, player.height);

  // ctx.strokeStyle = 'red'
  // ctx.lineWidth = 5
  // ctx.scale(.1)

  // paths is now an array of path objects
  paths.forEach((path) => {
    ctx.stroke(path.path);
    ctx.fillStyle = path.fill;
    ctx.scale(.1, .07)
    ctx.fill(path.path);
    
  })


    // // using the svg-to-canvas script
    // const d = path.path;
    // const sp = new SvgPath(d)
    // const [cx, cy] = sp.center
    // sp.save()
    //   .beginPath()
    //   .translate(-cx, -cy)
    //   .rotate(45)
    //   .scale(10)
    //   .translate(cx, cy)
    //   .translate(350, 350)
    //   .strokeStyle(path.fill)
    //   .lineWidth(3)
    //   .to(ctx)
    //   .stroke()




}

const keyDown = (e) => {
  console.log(e.key)



}