var CrossfadeSample = {playing:false};

var sourceArray;

CrossfadeSample.play = function() {
  // Create three sources.
  this.ctl1 = createSource(BUFFERS.type1);
  this.ctl2 = createSource(BUFFERS.type2);
  this.ctl3 = createSource(BUFFERS.type3);
  sourceArray = [this.ctl1,this.ctl2,this.ctl3];
  // Mute the second source.
  sourceArray[0].gainNode.gain.value = 0;
  sourceArray[2].gainNode.gain.value = 0;
  // Start playback in a loop
  if (!sourceArray[0].source.start) {
    sourceArray[0].source.noteOn(0);
    sourceArray[1].source.noteOn(0);
    sourceArray[2].source.noteOn(0);
  } else {
    sourceArray[0].source.start(0);
    sourceArray[1].source.start(0);
    sourceArray[2].source.start(0);
  }

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
};

CrossfadeSample.stop = function() {
  if (!sourceArray[0].source.stop) {
    sourceArray[0].source.noteOff(0);
    sourceArray[1].source.noteOff(0);
    sourceArray[2].source.noteOff(0);
  } else {
    sourceArray[0].source.stop(0);
    sourceArray[1].source.stop(0);
    sourceArray[2].source.stop(0);
  }
};

// Fades between 0 (all source 1) and 1 (all source 2)
CrossfadeSample.crossfade = function(num) {
  var x = 0;
  //var x = parseInt(element.value) / parseInt(element.max);

  // Use an equal-power crossfading curve:
  var gain1 = Math.cos(x * 0.5*Math.PI);
  var gain2 = Math.cos((1.0 - x) * 0.5*Math.PI);
  sourceArray[0].gainNode.gain.value = gain2;
  sourceArray[1].gainNode.gain.value = gain2;
  sourceArray[2].gainNode.gain.value = gain2;
  sourceArray[num].gainNode.gain.value = gain1;
};

CrossfadeSample.toggle = function() {
  this.playing ? this.stop() : this.play();
  this.playing = !this.playing;
};
