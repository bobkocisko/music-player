define([], function () {

    var _getNoteIndexFromStaffPosition = function(staffPosition) {
        var octave = Math.floor(staffPosition / 7);
        var octaveBase = octave * 12;
        var noteInOctave = staffPosition % 7;

        if (noteInOctave < 0) {
            // the remainder operator (%) needs to be fixed for negative numbers
            noteInOctave = 6 + noteInOctave;
        }

        switch (noteInOctave) {
            case 0:
                return octaveBase;
                break;
            case 1:
                return octaveBase + 2;
                break;
            case 2:
                return octaveBase + 4;
                break;
            case 3:
                return octaveBase + 5;
                break;
            case 4:
                return octaveBase + 7;
                break;
            case 5:
                return octaveBase + 9;
                break;
            case 6:
                return octaveBase + 11;
                break;
            default:
                break;
        }
    };

    return {
        getNoteIndexFromStaffPosition: _getNoteIndexFromStaffPosition,
    };
});