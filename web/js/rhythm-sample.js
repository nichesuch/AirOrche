var RhythmSample = {
  bpm:0,
  startTimer:0
};

RhythmSample.setBPM = function(b,startTime) {
  this.bpm = b;
  this.startTimer = startTime;
};

// Fades between 0 (all source 1) and 1 (all source 2)
RhythmSample.SpeedChange = function() {
  var x = 0;
  //var x = parseInt(element.value) / parseInt(element.max);

  // Use an equal-power crossfading curve:
  if(sourceArray){
    for (var i = 0; i < sourceArray.length; i++) {
      sourceArray[i].source.playbackRate.value = this.bpm/startBpm;
    }
  }
};

var startBpm;

var sourceArray;

RhythmSample.play = function() {
  function playSound(buffer, time) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    if (!source.start)
      source.start = source.noteOn;
    source.start(time);
    sourceArray.push(source);
  }

  var kick = BUFFERS.kick;
  var snare = BUFFERS.snare;
  var hihat = BUFFERS.hihat;
  var hey = BUFFERS.hey;

  // We'll start playing the rhythm 100 milliseconds from "now"
//  var startTime = context.currentTime + 0.100;
  var tempo = this.bpm; // BPM (beats per minute)
  startBpm = tempo;
  var eighthNoteTime = (60 / tempo) / 2;
  var diff = parseInt((context.currentTime - this.startTimer) / (eighthNoteTime*2));
  var startTime = this.startTimer + ((diff+1)*eighthNoteTime*2)-0.1;
  console.log(diff+ ":" + context.currentTime + ":" + startTime);
  // Play 2 bars of the following:
  for (var bar = 0; bar < 100; bar++) {
    var time = startTime + bar * 8 * eighthNoteTime;
    // Play the bass (kick) drum on beats 1, 5
    playSound(kick, time);
    playSound(kick, time + 4 * eighthNoteTime);

    // Play the snare drum on beats 3, 7
    playSound(snare, time + 2 * eighthNoteTime);
    playSound(snare, time + 6 * eighthNoteTime);

    // Play the hi-hat every eighthh note.
    for (var i = 0; i < 8; ++i) {
      playSound(hihat, time + i * eighthNoteTime);
    }
  }
};
