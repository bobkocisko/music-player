define(['musicplayer', 'structure/notehead'], function (musicplayer, notehead) {

    var _getNoteIndexFromStaffPosition = function (staffPosition) {
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

    var _getSymbolBeats = function (asymbol) {
        var beats = null;
        if (asymbol.notehead) {
            var aNotehead = asymbol.notehead;
            switch (aNotehead.visualtype) {
                case notehead.visualTypes.whole:
                    beats = 4;
                    break;
                case notehead.visualTypes.half:
                    beats = 2;
                    break;
                case notehead.visualTypes.quarter:
                    switch (asymbol.flagcount) {
                        case 0:
                            beats = 1;
                            break;
                        case 1:
                            beats = 0.5;
                            break;
                        case 2:
                            beats = 0.25;
                            break;
                        case 3:
                            beats = 0.125;
                            break;
                    }
            }
            if (aNotehead.isdotted) {
                beats += beats * 0.5;
            }
        }
        return beats;
    };

    var _playStaff = function (astaff) {
        var cumulativeTime = 0;
        for (var i = 0; i < astaff.symbols.length; i++) {
            var aSymbol = astaff.symbols[i];
            var noteIndex = _getNoteIndexFromStaffPosition(aSymbol.notehead.staffposition);
            var symbolDuration = _getSymbolBeats(aSymbol);
            musicplayer.addNote(noteIndex, cumulativeTime, symbolDuration);
            cumulativeTime += symbolDuration;
        }
    };

    return {
        playStaff: _playStaff,
    };
});