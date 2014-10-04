define([], function () {

    var _noteBaseIndex = 60; // middle C

    MIDI.loadPlugin({
        soundfontUrl: "./scripts/libs/midi/soundfont/",
        instrument: "acoustic_grand_piano",
        callback: function () {
            var delay = 0;
            var note = 50; // the MIDI note
            var velocity = 127; // how hard the note hits
            // play the note
            MIDI.setVolume(0, 127);
            MIDI.noteOn(0, note, velocity, delay);
            MIDI.noteOff(0, note, delay + 0.75);

        }
    });

    var _addNote = function (noteIndex, beginTime, duration) {
        console.assert(typeof beginTime === "number");
        console.log(noteIndex, beginTime, duration);
        MIDI.noteOn(0, _noteBaseIndex + noteIndex, 127, beginTime);
        MIDI.noteOff(0, _noteBaseIndex + noteIndex, 127, beginTime + duration);
    };

    return {
        addNote: _addNote
    };
});