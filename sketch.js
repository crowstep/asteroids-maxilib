
//This code is a modfication of http://p5play.molleindustria.org/examples/index.html?fileName=asteroids.js
//asteroid clone (core mechanics only)
//arrow keys to move + x to shoot

var bullets;
var asteroids;
var ship;
var shipImage, bulletImage, particleImage;
var MARGIN = 40;
var brownVal = 0.5;
var asteroidHitSize = 0;

function setup()
{
  createCanvas(800,600);

  bulletImage = loadImage("assets/asteroids_bullet.png");
  shipImage = loadImage("assets/asteroids_ship0001.png");
  particleImage = loadImage("assets/asteroids_particle.png");

  ship = createSprite(width/2, height/2);
  ship.maxSpeed = 6;
  ship.friction = .98;
  ship.setCollider("circle", 0,0, 20);

  ship.addImage("normal", shipImage);
  ship.addAnimation("thrust", "assets/asteroids_ship0002.png", "assets/asteroids_ship0007.png");

  asteroids = new Group();
  bullets = new Group();

  for(var i = 0; i<8; i++)
  {
    var ang = random(360);
    var px = width/2 + random(1000) * cos(radians(ang));
    var py = height/2+ random(1000) * sin(radians(ang));
    createAsteroid(3, px, py);
  }


  //creating the MaximJs audio context
  audio = new maximJs.maxiAudio();
  audio.play = playLoop; //define the play loop
  audio.outputIsArray(true, 2); //we are working stereo now !
  audio.init();

  thrustEnv = new maximEx.env();
  fireOsc = new maximJs.maxiOsc();
  fireEnv = new maximEx.env();
  astroidSplitEnv = new maximEx.env();
  shitHipEnv = new maximEx.env();
  shitHipFil = new maximEx.filter();
  shitHipFilSweepEnv = new maximEx.env();

  thrustStereo = maximJs.maxiTools.getArrayAsVectorDbl([0,0]);
  thrustMixer = new maximJs.maxiMix();
  thrustPanAmount = 0;

  fireStereo = maximJs.maxiTools.getArrayAsVectorDbl([0,0]);
  fireMixer = new maximJs.maxiMix();
  fireFreqMod = new maximJs.maxiOsc();

  splitStereo = maximJs.maxiTools.getArrayAsVectorDbl([0,0]);
  splitMixer = new maximJs.maxiMix();
  splitPanAmount = 0;

  shitHipStereo = maximJs.maxiTools.getArrayAsVectorDbl([0,0]);
  shitHipMixer = new maximJs.maxiMix();
  shitHipPanAmount = 0;
  shitHipAmpMod = new maximJs.maxiOsc();


}

////////////////////////////////AUDIO LOOP///////////////////////////////
function playLoop()
{

  var thrustSound = whiteNoise(0.5) * thrustEnv.asr(0.5, 1);
  var thrustPan = thrustMixer.stereo(thrustSound, thrustStereo, thrustPanAmount);

  var fireFreq = fireFreqMod.sinewave(8);
  fireFreq = map(fireFreq, -1, 1, 600, 1000);
  var fireSound = (fireOsc.sinewave(fireFreq)+1)/2 * fireEnv.ar(0.1, 0.5);
  var firePan = fireMixer.stereo(fireSound, fireStereo, 0.5);

  var splitSound = brownNoise(0.2) * astroidSplitEnv.ar(0.1, 0.25) * asteroidHitSize;
  var splitPan = thrustMixer.stereo(splitSound, splitStereo, splitPanAmount);

  var cutoff = shitHipFilSweepEnv.xLine(1000,0.001,2);
  var shitHipAmp = (shitHipAmpMod.sinewave(6)+1)/2;
  var shitHipSound = shitHipFil.lowpass(whiteNoise(0.75) * shitHipEnv.ar(0.1, 2), cutoff) * shitHipAmp;
  var shitHipPan = shitHipMixer.stereo(shitHipSound, shitHipStereo, shitHipPanAmount);

  // var mix = thrustSound + fireSound + splitSound + shitHipSound; 
  // mix = constrain(mix, 0, 1);

  var leftMix = thrustStereo.get(0) + splitStereo.get(0) + fireStereo.get(0) + shitHipStereo.get(0);
  var rightMix = thrustStereo.get(1) + splitStereo.get(1) + fireStereo.get(1) + shitHipStereo.get(1);

  //we are working in stereo this time !
  this.output[0] = leftMix;
  this.output[1] = rightMix;
}


////////////////////////////////SOUND CALLBACKS///////////////////////

function startThrustAudio(x_pos)
{
  thrustEnv.trigger();
}

function continueThrustAudio(x_pos)
{
  thrustPanAmount = map(x_pos, 0, width, 0, 1);
  thrustPanAmount = constrain(thrustPanAmount, 0, 1);
}

function endThrustAudio()
{
  thrustEnv.release();
}


function asteroidSplitAudio(asteroidSize, x_pos)
{
  console.log("asteroidSplit: " + asteroidSize, x_pos);
  asteroidHitSize = asteroidSize / 3;
  astroidSplitEnv.trigger();

  splitPanAmount = map(x_pos, 0, width, 0, 1);
  splitPanAmount = constrain(splitPanAmount, 0, 1);
}

function shipHitAudio( ship, asteroid)
{
  console.log("shipHit: ", asteroid.type, ship.position.x);
  shitHipEnv.trigger();
  shitHipFilSweepEnv.trigger();

  shitHipPanAmount = map(ship.position.x, 0, width, 0, 1);
  shitHipPanAmount = constrain(shitHipPanAmount, 0, 1);
}

function fireBulletAudio()
{
  console.log("fire bullet");
  fireEnv.trigger();
}




///////////////////////////////////Noise functions////////////////////////////


function whiteNoise(amp) {
  return random(-amp, amp);
}

function brownNoise(delta) {
  brownVal += random(-delta, delta);
  brownVal = constrain(brownVal, 0, 1);
  return brownVal;
}


///////////////////////////////////////////////////////////////////////////

function draw() {
  background(0);

  fill(255);
  textAlign(CENTER);
  text("Controls: Arrow Keys + X", width/2, 20);

  for(var i=0; i<allSprites.length; i++)
  {
    var s = allSprites[i];
    if(s.position.x<-MARGIN) s.position.x = width+MARGIN;
    if(s.position.x>width+MARGIN) s.position.x = -MARGIN;
    if(s.position.y<-MARGIN) s.position.y = height+MARGIN;
    if(s.position.y>height+MARGIN) s.position.y = -MARGIN;
  }

  asteroids.overlap(bullets, asteroidHit);
  asteroids.bounce(asteroids);

  ship.bounce(asteroids, shipHitAudio);

  if(keyDown(LEFT_ARROW))
  {
    ship.rotation -= 4;
  }

  if(keyDown(RIGHT_ARROW))
  {
    ship.rotation += 4;
  }


  if(keyWentDown(UP_ARROW))
  {
    startThrustAudio(ship.position.x);
  }
  else if(keyDown(UP_ARROW))
  {
    ship.addSpeed(.2, ship.rotation);
    ship.changeAnimation("thrust");
    continueThrustAudio(ship.position.x);
  }
  else if(keyWentUp(UP_ARROW))
  {
    endThrustAudio(ship.position.x);
  }
  else
  {
    ship.changeAnimation("normal");
  }



  if(keyWentDown("x"))
  {
    var bullet = createSprite(ship.position.x, ship.position.y);
    bullet.addImage(bulletImage);
    bullet.setSpeed(10+ship.getSpeed(), ship.rotation);
    bullet.life = 30;
    bullets.add(bullet);
    fireBulletAudio();
  }

  drawSprites();

}

function createAsteroid(type, x, y) {
  var a = createSprite(x, y);
  var img  = loadImage("assets/asteroid"+floor(random(0,3))+".png");
  a.addImage(img);
  a.setSpeed(2.5-(type/2), random(360));
  a.rotationSpeed = .5;
  //a.debug = true;
  a.type = type;

  if(type == 2)
  a.scale = .6;
  if(type == 1)
  a.scale = .3;

  a.mass = 2+a.scale;
  a.setCollider("circle", 0, 0, 50);
  asteroids.add(a);
  return a;
}

function asteroidHit(asteroid, bullet)
{

  var newType = asteroid.type-1;

  if(newType>0) {
    createAsteroid(newType, asteroid.position.x, asteroid.position.y);
    createAsteroid(newType, asteroid.position.x, asteroid.position.y);
  }

  asteroidSplitAudio(newType, asteroid.position.x); //call the audio callback

  for(var i=0; i<10; i++) {
    var p = createSprite(bullet.position.x, bullet.position.y);
    p.addImage(particleImage);
    p.setSpeed(random(3,5), random(360));
    p.friction = 0.95;
    p.life = 15;
  }

  bullet.remove();
  asteroid.remove();
}
