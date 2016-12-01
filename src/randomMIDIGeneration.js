var randomMidiGeneration = {}
$(document).ready(function() {
	var firstNote = 29 // is an F
	var lowC = 36

	var octave = 12
	var baseNotes = {
		"F" : 29,
		"Gb" : 30,
		"G" : 31,
		"Ab" : 32,
		"A" : 33,
		"Bb" : 34,
		"B" : 35,
		"C" : 36,
		"Db" : 37,
		"D" : 38,
		"Eb" : 39,
		"E" : 40
	}
	var keys = {
		"major": [1,2,2,1,2,2,2,1,2],
		"minor": [1,2,2,2,1,2,2,1,2],
		"harmonicMinor" : [1,2,1,2,2,1,3,1,2],
	}

	// Takes the integer value of the first note,
	//  and an array of steps (the key) and
	// returns a map from the digits 0-9 to the notes
	function getNotes(first, key) {

		var notes = [first]
		var currNote = first
		for (var i = 0; i < key.length; i++) {
			currNote += key[i]
			notes.push(currNote)
		}
		return notes
	}

	var lowerHandPattern = [
		[0,4,4,2,2,3,-3,-2],
		[0,5,2,2,0,2,-2,2]
	]
	var hardCoded = [1, 4, 3, 2, 3, 5]
	//				 31 41 59 26 53 58 97 93 23 84 62 64 33 83 27 95028

	function playGenerated(str, first, key) {
		var velocity = 127;
		var stepDelay = 1.35;
		MIDI.setVolume(0, 127);

		var chars = str.split("")
		var nums = chars.map(function(char){ return parseInt(char) });

		var notes = getNotes(baseNotes[first], keys[key])

		// Upper hand
		for (var i = 0; i < nums.length; i++) {
			var note = notes[nums[i]]+3*octave
			var thisDelay = stepDelay*i;

			MIDI.noteOn(0, note, velocity, thisDelay);
			MIDI.noteOff(0, note, thisDelay + 0.75);
			MIDI.noteOn(0, note+octave, velocity, thisDelay);
			MIDI.noteOff(0, note+octave, thisDelay + 0.75);
		}

		// Lower hand
		var startingNotes = [];
		for (var i = 0; i < nums.length; i+=2) {
			var note = Math.min(notes[nums[i]],notes[nums[i+1]])
			if (note == startingNotes[startingNotes.length-1]) {
				note = Math.max(notes[nums[i]],notes[nums[i+1]])
			}
			startingNotes.push(note)
		}

		var patternSwap = 1
		for (var i = 0; i < startingNotes.length; ++i) {

			var handStart = stepDelay*2*i
			var nextNote = startingNotes[i]+octave

			patternSwap ++
			var pattern = lowerHandPattern[0]
			if (patternSwap % 4 == 0) {
				pattern = lowerHandPattern[1]
			}

			for (var j = 0; j <= 7; ++j) {
				nextNote += pattern[j]
				var thisDelay = j/4*stepDelay+handStart

				MIDI.noteOn(0,nextNote, velocity*0.55, thisDelay)
				MIDI.noteOff(0,nextNote, thisDelay+0.75)
			}
		}
	}

	function playNote(str) {
		var note = parseInt(str)
		MIDI.noteOn(0, note, 127, 0);
		MIDI.noteOff(0, note, 0.75);
	}

	function playScale() {
		var velocity = 127;
		var stepDelay = 0.5;
		MIDI.setVolume(0, 127);

		for (var i = 0; i < notes.length; i++) {
			var thisDelay = stepDelay*i;
			MIDI.noteOn(0, notes[i], velocity, thisDelay);
			MIDI.noteOff(0, notes[i], thisDelay + 0.75);
		}
		
	}

	randomMidiGeneration.playGenerated = playGenerated;
	randomMidiGeneration.playNote = playNote;
	randomMidiGeneration.playScale = playScale;
})