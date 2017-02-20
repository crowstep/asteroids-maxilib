### Week 3 - Core ###
#### Asteroids ####

Your task this week is to add audio events to the classic game asteroids.  This will give us a really good opportunity to become familiar with different types of noise and subtractive synthesis techniques.

This week the skeleton code is a modified version of an example from p5play. This is a very useful extension to p5js for making games by molleindustria http://p5play.molleindustria.org/ . I'd encourage you to check out the library and the many great games at http://molleindustria.org/

An important point before we start is DO NOT USE samples. We are learning synthesis here so no marks will be awarded for work using samples.

1. Explore the code [0 marks]
  - Look at the various callback functions which all have "Audio" at the end of their name.
  - These get called when certain events happen in the game
  - Notice how some have parameters
  - These will allow you to access game information around which you can define your audio events
  - NB. All the sound still comes from <code>playLoop</code>
  - Also notice the command to set maxim to stereo mode and that there are now two audio outputs.

2. Basic Rocket Thrust [2 marks]
  - Fill in the whiteNoise function to produce white noise and call it in <code>playLoop</code> assigning the output to a variable
  - Feed the variable into <code>mix</code> so that it comes out of both channels evenly.
  - Create a maximEx ASR envelope to control the amplitude of the whiteNoise
  - Trigger the envelope in <code>startThrustAudio</code> & release it in <code>endThrustAudio</code>
  - Adjust the attack and release times so that they are appropriate for your thrust

3. Fire bullets [2 marks]
  - Create a periodic oscillator which we will use for the bullets firing (eg.a sinewave)
  - Assign the output to a new variable in <code>playLoop</code>
  - Adjust the volume to prevent clipping and add it to <code>mix</code>
  - Create a maximEx  AR envelope and use it to control the amplitude of the sound
  - Trigger the envelope in <code>fireBulletAudio</code>

4. Asteroid split [2 marks]
  - Complete the <code>BrownNoise</code> function
  - Call the function in the <code>playLoop</code> and assign it to new variable
  - Adjust the volume to prevent clipping and add it to <code>mix</code> as before
  - Create an AR envelope and use it to control the amplitude of the sound as before
  - Trigger the envelope in <code>asteroidSplitAudio</code>
  - Use <code>asteroidSize</code> to effect the volume of the sound (larger asteroids should make more noise)

5. Ship hit filter [1 marks]
  - Use some white noise for this
  - Assign it to a new variable as before and output to mix
  - Similarly use a new AR envelope to control the output and trigger it from <code>shipHitAudio</code>
  - Create a maximEx filter object and use the lowpass filter method in <code>playLoop</code> to filter your sound as below ...
    <code>mySig = myFilter.lowpass(mySig, cutoff)</code>
  - Experiment with different cutoff values

6. Ship hit voltage control [1 marks]
  - If you haven't already done so make a variable for your filter cutoff
  - Create a maximEx env object
  - In <code>playLoop</code> use the xLine method to make the cutoff frequency gradually descend. It should take the same amount of time as the AR envelope for ship hit.
  - Trigger the xLine envelope in <code>shipHitAudio</code>

7. Make everything stereo [1 mark]
  - Now it's time to pan the sounds
  - For each sound you'll need a maxiMix object & a vector of length 2 which you get by using
  <code>maximJs.maxiTools.getArrayAsVectorDbl([0,0])</code>
  - pan the thrust sound so that it follows the spaceship left and right (HINT: use x_pos & map)
  - pan the asteroid split and ship hit sounds in a similar way
  - you can keep bullets evenly panned

8. Tweak your sounds [1 mark]
  - Tweak the sound creatively.
  - Perhaps use some amplitude modulation to make the shipHit sound pulse,
  - Perhaps use frequency modulation for fire bullets
  - I'll leave it up to you.
