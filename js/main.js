/*global loop,noLoop,ellipseMode,map,saveSound,p5,noTint,tint,GRAY,filter,lerpColor,resizeCanvas,CLOSE,vertex,rectMode,CORNER,RGB,ARROW,HAND,cursor,createSlider,createButton,rect,HSB,colorMode,ambientMaterial,pop,cylinder,specularMaterial,radians,rotateX,rotateY,rotateZ,push,sphere,directionalLight,texture,orbitControl,createGraphics,WEBGL,createCanvas,color,translate,triangle,frameRate,beginShape,endShape,curveVertex,shuffle,sin,cos,floor,rotate,textAlign,LEFT,RIGHT,CENTER,text,textSize,stroke,noStroke,strokeWeight,keyCode,keyIsDown,LEFT_ARROW,RIGHT_ARROW,UP_ARROW,DOWN_ARROW,mouseIsPressed,fill,noFill,mouseX,mouseY,line,ellipse,background,displayWidth,displayHeight,windowWidth,windowHeight,height,width,dist,loadSound,loadImage,image,random,angleMode,RADIANS,DEGREES*/

var stars = [];

let buttonPause;
let buttonSwitch;
let inRotation = true;
let controlMode = true;
let windowWidth = 525;
let windowHeight = 525;


function setup() {
  createCanvas(windowWidth, windowHeight);

  // stars moving rate
  frameRate(4);
  for (var i = 0; i < 50; i++) {
    stars.push(new Star());
  }
  // angleMode(DEGREES);
  ellipseMode(CENTER);
  // rectMode(CENTER);
  buttonPause = createButton("Pause");
  buttonPause.position(200, 440);
  buttonPause.mousePressed(pauseRotation);
  buttonPause.size(100);
  buttonPause.style("font-size", "18px");
  buttonPause.style("font-family", "Tahoma");
  buttonSwitch = createButton("Move the Earth by your Mouse");
  buttonSwitch.position(100, 480);
  buttonSwitch.mousePressed(switchControl);
  buttonSwitch.size(300);
  buttonSwitch.style("font-size", "18px");
  buttonSwitch.style("font-family", "Tahoma");
}

let centerX = 250;
let centerY = 250;
// let circleAngle = 0;
let earthAngle = 0;
let moonAngle = 0;
let a = 200;
let b = 160;
let x1, y1, x2, y2;


function draw() {
  background(220);
  //two colors for gradient
  var color1 = color(0, 0, 255);
  var color2 = color(158, 51, 0);
  //make gradient
  setGradient(0, 0, windowWidth, windowHeight, color1, color2, "Y");
  
  //draw some stars
  for (var i = 0; i < 50; i++) {
    var x = random(windowWidth);
    var y = random(windowHeight);
    noStroke();
    fill(255, 255, 0);
    ellipse(x, y, 2, 2);
  }
  drawTrack();
  if (controlMode===true) {
    autoControl();
  } else {
    mouseControl();
  }  
  drawMoon();  
  infoIcon();
}

//fill the background with a gradient
function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  // Top to bottom gradient
  if (axis == "Y") {
    for (let i = y; i <= y + h; i++) {
      var inter = map(i, y, y + h, 0, 1);
      var c = lerpColor(c1, c2, inter); //blends the two colors together
      stroke(c);
      line(x, i, x + w, i);
    }
  }
  // Left to right gradient
  else if (axis == "X") {
    for (let j = x; j <= x + w; j++) {
      var inter2 = map(j, x, x + w, 0, 1);
      var d = lerpColor(c1, c2, inter2);
      stroke(d);
      line(j, y, j, y + h);
    }
  }
}

//position stars randomly
function Star() {
  this.x = random(windowWidth);
  this.y = random(windowHeight - 200);
  this.w = 2;
  this.h = 2;
}

Star.prototype.draw = function() {
  noStroke();
  fill(255, 255, 0);
  ellipse(this.x, this.y, this.w, this.h);
  this.x += (random(10) - 5);
  this.y += (random(10) - 5);
  if (this.w == 2) {
    this.w = 3;
    this.h = 3;
  } else {
    this.w = 2;
    this.h = 2;
  }
}

function pauseRotation() {
  inRotation = !inRotation;
  if (inRotation === true) {
    loop();
    buttonPause.html("Pause");
  } else {
    noLoop();
    buttonPause.html("Resume");
  }
}

function switchControl() {
  controlMode = !controlMode;
  if (controlMode === true) {
    buttonSwitch.html("Move the Earth by your Mouse");
  } else {
    buttonSwitch.html("Resume auto-revolution");
  }
}

function drawTrack() {
  // draw the center and the circular track
  noStroke();
  fill(255);
  ellipse(centerX, centerY, 5, 5);
  fill(255, 215, 0); //sun color
  ellipse(centerX+90, centerY, 60, 60); 

  // draw the ellipse track
  push();
  stroke(color(255, 0, 0)); // red track
  noFill();
  ellipse(centerX, centerY, 2 * a, 2 * b); //sun
  pop(); 
}

function autoControl() {
  // revolution of earth around sun on a ellipse track
  push();
  translate(centerX, centerY);
  let rEarth = a * b / sqrt(sq(b * cos(earthAngle)) + sq(a * sin(earthAngle)));
  x1 = rEarth * cos(earthAngle);
  y1 = rEarth * sin(earthAngle);
    
  drawEarth();
}

function mouseControl() {
  let mouseDist = dist(mouseX, mouseY, centerX, centerY);
  let distRatio = (mouseY-250)/mouseDist
  let earthAngle = asin(distRatio);
  let rEarth = a * b / sqrt(sq(b * cos(earthAngle)) + sq(a * sin(earthAngle)));
  x1 = rEarth * cos(earthAngle);
  y1 = rEarth * sin(earthAngle);
  push();
  translate(centerX, centerY);
  if (mouseX<centerX) {
    x1= x1*-1
  }    
  drawEarth();
}

function drawEarth() {
  fill(85, 123, 250, 200);
  ellipse(x1, y1, 35, 35);
  fill(85, 123, 250);
  ellipse(x1, y1, 5, 5);
  // stroke(0);
  // line(90, 0, x1, y1);
  let rEarth = dist(90, 0, x1, y1);
  let ellipseSpeed = 0.3-0.001 * rEarth;
  earthAngle-=ellipseSpeed;
  pop();
}

function drawMoon() {
  // revolution of the moon around earth
  push();
  translate(x1, y1);
  stroke(color(255, 255, 255)); // white track
  noFill();
  ellipse(centerX, centerY, 100, 100);
  let rMoon = 50;
  x2 = centerX + rMoon * cos(moonAngle);
  y2 = centerY + rMoon * sin(moonAngle);
  noStroke();
  fill(227, 232, 247, 200);
  ellipse(x2, y2, 20, 20);
  fill(227, 232, 247);
  ellipse(x2, y2, 5, 5);
  moonAngle-=0.25;
  pop(); 
}

function infoIcon() {
  stroke(240);
  fill(240, 100);
  ellipse(490, 30, 15, 15);
  fill(240);
  textSize(10);
  textFont('Georgia');
  text("i", 488, 33);
  if (dist(mouseX, mouseY, 490, 30)<=10) {
    text("image not to scale", 390, 33);
    stroke(240);
    fill(240, 100);
    rect(385, 20, 90, 20, 5);    
  }
}
