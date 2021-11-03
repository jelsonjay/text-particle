// text particle animation

'use strict'

const text = document.getElementById('text')
const context = text.getContext('2d')
text.width = innerWidth;
text.height = innerHeight;
let textArray = [];
let adjustx = 25;
let adjusty = -5;

// handle mause interaction
const mouse = {
  x: 0,
  y: 0,
  radius: 50
}

addEventListener('mousemove', function (e) {
  mouse.x = e.x;
  mouse.y = e.y;
})

context.fillStyle = '#fff';
context.font = 'bold 22px Arial';
context.fillText('JAVASCRIPT', 10, 60)
context.strokeStyle = '#fff';
context.strokeRect(0, 0, 100, 100)
const textCoordinates = context.getImageData(0, 0, 1100, 1100)

// TEXT
class Text {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 3;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = (Math.random() * 150) + 1;
  }

// DRAW
  draw() {
    context.fillStyle = '#fff';
    context.beginPath()
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.closePath()
    context.fill()
  }

// UPDATE
  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy)
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    if (distance < mouse.radius) {
      this.y -= directionY;
      this.x -= directionX;
      this.size = 5;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 50;
      }
      if (this.y !== this.baseY) {
        let dy = this.x - this.baseY;
        this.y -= dy / 20;
      }
    }
  }
}



// INIT function 
function initiate() {
  textArray = [];
  for(let y = 0, y2 = textCoordinates.height; y < y2; y++){
  for(let x = 0, x2 = textCoordinates.width; x < x2; x++){
  if(textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){
  let positionX = x + adjustx;
  let positionY = y + adjusty;
  textArray.push(new Text(positionX * 10, positionY * 10))
  }
  }
  }
}
initiate()

//console.log(particleArray)


// animation
function animate() {
  context.clearRect(0, 0, text.width, text.height)
  for (let i = 0; i < textArray.length; i++) {
    textArray[i].draw();
    textArray[i].update();
  }
  stickText()
  requestAnimationFrame(animate)
}
animate()

function stickText(){
    let opacityValue = 1;
    for (let i = 0; i < textArray.length; i++) {
        for (let k = i; k < textArray.length; k++) {
            let distance = (( textArray[i].x - textArray[k].x) * (textArray[i].x - textArray[k].x))
            + ((textArray[i].y - textArray[k].y) * (textArray[i].y - textArray[k].y));
            
            if (distance < 1800) {
                opacityValue = 1 - (distance/1800);
                let dx = mouse.x - textArray[i].x;
                let dy = mouse.y - textArray[i].y;
                let mouseDistance = Math.sqrt(dx*dx+dy*dy);
                if (mouseDistance < mouse.radius / 2) {
                  context.strokeStyle='rgba(255,255,0,' + opacityValue + ')';
                } else if (mouseDistance < mouse.radius - 50) {
                  context.strokeStyle='rgba(255,25,10,' + opacityValue + ')';
                } else if (mouseDistance < mouse.radius + 20) {
                  context.strokeStyle='rgba(255,255,210,' + opacityValue + ')';
                } else  {
                context.strokeStyle='rgba(255,255,255,' + opacityValue + ')';
                }
                context.lineWidth = 1;
                context.beginPath();
                context.moveTo(textArray[i].x, textArray[i].y);
                context.lineTo(textArray[k].x, textArray[k].y);
                context.stroke();
            }
        }
    
    }
}