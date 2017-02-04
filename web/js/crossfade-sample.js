var CrossfadeSample = {playing:false,
bpm:-1};

var sourceArray;
var firstIndex = 0;

CrossfadeSample.setBPM = function(b) {
  this.bpm = b;
}

CrossfadeSample.init = function() {
  // Create three sources.
  this.ctl1 = createSource(BUFFERS.type1);
  this.ctl2 = createSource(BUFFERS.type1);
  this.ctl3 = createSource(BUFFERS.type1);
  this.ctl4 = createSource(BUFFERS.type4);
  sourceArray = [this.ctl1,this.ctl2,this.ctl3,this.ctl4];
  // Mute the second source.
  for (var i = 0; i < sourceArray.length; i++) {
    sourceArray[i].gainNode.gain.value = 0;
  }
  sourceArray[firstIndex].gainNode.gain.value = 100;

  function createSource(buffer) {
    var source = context.createBufferSource();
    var gainNode = context.createGain ? context.createGain() : context.createGainNode();
    source.buffer = buffer;
    // Turn on looping
    source.loop = true;
    // Connect source to gain.
    source.connect(gainNode);
    // Connect gain to destination.
    gainNode.connect(context.destination);

    return {
      source: source,
      gainNode: gainNode
    };
  }

}

CrossfadeSample.play = function() {
  // Start playback in a loop
  if (!sourceArray[firstIndex].source.start) {
    for (var i = 0; i < sourceArray.length; i++) {
      sourceArray[i].source.noteOn(0);
    }
  } else {
    for (var i = 0; i < sourceArray.length; i++) {
      sourceArray[i].source.start(0);
    }
  }

};

CrossfadeSample.stop = function() {
  if (!sourceArray[firstIndex].source.stop) {
    for (var i = 0; i < sourceArray.length; i++) {
      sourceArray[i].source.noteOff(0);
    }
  } else {
    for (var i = 0; i < sourceArray.length; i++) {
      sourceArray[i].source.stop(0);
    }
  }
};

// Fades between 0 (all source 1) and 1 (all source 2)
CrossfadeSample.crossfade = function(num) {
  var x = 0;
  //var x = parseInt(element.value) / parseInt(element.max);

  // Use an equal-power crossfading curve:
  var gain1 = Math.cos(x * 0.5*Math.PI);
  var gain2 = Math.cos((1.0 - x) * 0.5*Math.PI);

  for (var i = 0; i < sourceArray.length; i++) {
    sourceArray[i].gainNode.gain.value = gain2;
  }
  sourceArray[num].gainNode.gain.value = gain1;
};

// Fades between 0 (all source 1) and 1 (all source 2)
CrossfadeSample.SpeedChange = function() {
  var x = 0;
  //var x = parseInt(element.value) / parseInt(element.max);

  // Use an equal-power crossfading curve:

  for (var i = 0; i < sourceArray.length; i++) {
    sourceArray[i].buffer.playbackRate.value = this.bpm;
  }
};

CrossfadeSample.toggle = function() {
  this.playing ? this.stop() : this.play();
  this.playing = !this.playing;
};
