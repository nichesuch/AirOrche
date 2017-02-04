var RhythmSample = {
  bpm:0,
  startTimer:0
};

RhythmSample.setBPM = function(b,startTime) {
  this.bpm = b;
  this.startTimer = startTime;
};

RhythmSample.play = function() {
  function playSound(buffer, time) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    if (!source.start)
      source.start = source.noteOn;
    source.start(time);
  }

  var kick = BUFFERS.kick;
  var snare = BUFFERS.snare;
  var hihat = BUFFERS.hihat;
  var hey = BUFFERS.hey;

  // We'll start playing the rhythm 100 milliseconds from "now"
//  var startTime = context.currentTime + 0.100;
  var tempo = this.bpm; // BPM (beats per minute)
  var eighthNoteTime = (60 / tempo) / 2;
  var diff = parseInt((context.currentTime - this.startTimer) / eighthNoteTime*2);
  var startTime = this.startTimer + diff;

  // Play 2 bars of the following:
  for (var bar = 0; bar < 1; bar++) {
    var time = startTime + bar * 8 * eighthNoteTime;
    // Play the bass (kick) drum on beats 1, 5
    playSound(hey, time);
    playSound(hey, time + 2 * eighthNoteTime);

  }
};
