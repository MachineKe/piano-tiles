

let mySound;
let amp;
let varR;

let count =0;
let col = 0;

let now = 0;
let prv = 0;

let alpha=0;

function preload() {
  soundFormats('mp3', 'ogg');
  mySound = loadSound('https://dl.dropbox.com/s/ad3gwapcs4nd8kp/everyonedies.mp3?');
}

let score = 0;
let s = 'play';

class Tile{
  constructor(lane,w,h){
    this.lane= lane;
    this.t=w;
    this.w = w/4-2;
    this.h = h/5;
    this.x = 1 + this.lane*w/4;
    this.y = -2*this.h;
    this.speed = 5;
    this.once = true;
    this.trolled = false;
    this.freq = 2;
  }
  
  move(r,a){
      this.y+=r*this.speed+a;
      
      if(this.y>5*this.h/2 && !troll && !this.trolled){
        this.trolled = true;
      }
      
      if(this.y>5*this.h/2 && troll && !this.trolled){
        this.trolled = true;
        this.speed = 4;
        this.lane = 3 - this.lane;
        this.x = 1 + this.lane*this.t/4;
      }
  }
  
  touched(x,y,a){
    stroke(255-col);
    textSize(32);
    textAlign(CENTER);
    fill(0);
    if((x>this.x) && (x<this.x+this.w) && (y>this.y) && (y<this.y+this.h+a)){
      if(this.y<this.h/2){
        score+=1;
        s = 'lame';
      }
      else if(this.y<3*this.h/2){
        score+=2;
        s = 'not bad';
      }
      else if(this.y<5*this.h/2){
        score+=3;
        s = 'nice';
      }
      else if(this.y<7*this.h/2){
        score+=4;
        s = 'super';
      }
      else if(this.y<9*this.h/2){
        score+=5;
        s = 'you rock';
      }
      return true;
    }
    else {
      s = 'LMAO';
      return false;
    }
  }
  
  ding(){
    if(this.y>-this.h+5&&this.once){
      this.once=false;
      return true;
    }
    return false;
  }
  
  dong(){
    return this.y>9*this.h/2;
  }
  
  show(r,a){
    if(blink){
      this.freq-=1;
      if(!this.freq){
        col = 255 - col;
        this.freq = 2;
      }
    }
      fill(255-col);
      noStroke();
      push();
        translate(this.x,this.y);
        rectMode(CENTER);
        rect(this.w/2,this.h/2,r*this.w,r*this.h+a);
      pop();
  }
}


let tiles = [];
let gameOver = false;
let gameWon = false;

function setup(){
  createCanvas(windowWidth,windowHeight);
  background(col);
  now = int(random(4));
  tiles.push(new Tile(now,width,height));
  amp = new p5.Amplitude();
  mySound.play();
}
 
function mousePressed(){
  if(gameOver){
    gameReset();
  }
  else{
    if(tiles[0].touched(mouseX,mouseY,alpha)){
      tiles.splice(0,1);
    }
    else gameOver = true;
  }
}

function gameReset(){
  troll = false;
  blink = false;
  
  score = 0;
  s = 'play';
  
  tiles = [];
  gameOver = false;
  gameWon = false;
  
  count =0;
  col = 0;

  now = 0;
  prv = 0;

  alpha=0;
  
  background(col);
  now = int(random(4));
  tiles.push(new Tile(now,width,height));
  mySound.play();
}
  

troll = false;
blink = false;

function draw(){
  frameRate(30);
  alpha = score/40;
  varR = amp.getLevel();
  
  if(tiles[tiles.length-1].ding()){
    prv = now;
    now = int(random(4));
    if(now===prv)
      count++;
    if(count===3){
      now = 3 - now;
      count = 0;
    }
    tiles.push(new Tile(now,width,height));
  }
  
  for(var tile of tiles){
    if(tile.dong()){
      s = 'LMAO';
      gameOver=true;
    }
  }
  
  if(score<100)
    col=0;
  else if(score<200)
    col=255;
  else if(score<300)
    col=0;
  else if(score<400)
    col=255;
  else if(score<500)
    col=0;
  else
    col=255;
    
  if(score>250)
    troll = true;
    
  //if(score>400)
    //blink = true;
  
  if(varR<0.2){
    varR = 0.8;
  } 
  else varR = map(varR,0.4,1,0.8,1);
  
  background(col,100);
  stroke(100);
  line(1*width/4,0,1*width/4,height);
  line(2*width/4,0,2*width/4,height);
  line(3*width/4,0,3*width/4,height);
  line(0,4*height/5,width,4*height/5);
  stroke(255-col);
  
  for(tile of tiles){
    if(!gameOver&&!gameWon){
      tile.show(varR,alpha);
      tile.move(varR,alpha);
    }
  }
  
  stroke(255-col);
  
  textSize(32);
  textAlign(CENTER);
  fill(col);
  text(s,width/2,32);
  text(score,width/2,64);
  
  if(score>=600) 
    gameWon = true;
  
  if(gameOver){
    mySound.stop();
    textSize(50);
    text('LOL YOU LOST',width/2,height/2);
  }
  if(gameWon){
    mySound.stop();
    textSize(50);
    background(col);
    text('YOU KILLED IT',width/2,height/2);
    text('YOU WON',width/2,height/2+50);
    text('score: '+score,width/2,height/2+100);
  }
}

