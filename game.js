import { PngBird, SvgBird } from './js/bird.js'
import paths from './js/birdpaths.js'

window.addEventListener("DOMContentLoaded", () => {
  setupEvents();
  loadSprites();
});


const canvas = document.querySelector('.gamebox');
const ctx = canvas.getContext('2d');

const player = new PngBird(20);
const enemy = new SvgBird(.06);
// const enemies = 
const setupEvents = () => {
  document.addEventListener("keydown", keyDown);
}

const loadSprites = () => {

  console.log(player.x)
  const image = new Image();

  image.src = document.getElementById("player-downflap").src; // 'images/red-downflap.png';
  ctx.drawImage(image, 10, 50, player.width * 3, player.height * 3);

  image.src = document.getElementById("player-upflap").src; // 'images/red-upflap.png';
  ctx.drawImage(image, 80, 50, player.width * 3, player.height * 3);

  // paths is now an array of path objects
  // paths.forEach((path) => {
    for (let i = 0; i < paths.length; i++) {
      console.log(paths[i])
    ctx.stroke(paths[i].path);
    ctx.fillStyle = paths[i].fill;
    ctx.scale(enemy.width, enemy.height)
    ctx.fill(paths[i].path);
  }









  // var svgElement = document.querySelector('#sprites');
  // let { width, height } = svgElement.getBBox();
  // console.log(width, height)
  // let clonedSvgElement = svgElement.cloneNode(true);
  // // true for deep clone
  // let outerHTML = clonedSvgElement.outerHTML,
  // blob = new Blob([outerHTML], { type: 'image/svg+xml;charset=utf-8' });
  // let URL = window.URL || window.webkitURL || window;
  // let blobURL = URL.createObjectURL(blob);

  // image.src = 'images/walking.png';
  // ctx.drawImage(image, 10, 10, player.width, player.height);
  // image.src = 'images/coast.png';
  // ctx.drawImage(image, 50, 10, player.width + 7, player.height - 2);
  // image.src = 'images/red-upflap-30px.png';
  // console.log(image.src)
  // ctx.drawImage(image, 100, 100, 40, 30);

  // var path = new Path2D('M 100,100 h 50 v 50 h 50');
  // ctx.stroke(path);






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