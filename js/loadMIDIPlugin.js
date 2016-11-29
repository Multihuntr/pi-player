$(document).ready(function() {
	MIDI.loadPlugin({
		soundfontUrl: "./soundfont/",
		instrument: "acoustic_grand_piano",
		onsuccess: function() {
			// console.log("Ready")
		}
	})
})