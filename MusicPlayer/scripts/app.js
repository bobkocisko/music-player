define(['backgrounddrawer',
    'viewport',
    'utils',
    'symboldrawer',
    'symbols',
    'staffarranger',
    'playbacktoolbar',
    'musicplayer',
    'notereader',
    'structure/staff',
    'structure/staffsection',
    'structure/notehead',
    'structure/symbol',
],
    function (backgrounddrawer,
        viewport,
        utils,
        symboldrawer,
        symbols,
        staffarranger,
        playbacktoolbar,
        musicplayer,
        notereader,
        staff,
        staffsection,
        notehead,
        symbol
        ) {
        'use strict';

        var mousePos = {
            x: -20,
            y: -20
        };

        var astaff = new staff.Staff(new staffsection.StaffSection());  // Use the default values for StaffSection

        //astaff.addSymbol(new symbol.Note(new notehead.Notehead(0, notehead.visualTypes.Quarter, notehead.directions.Left, false, notehead.accidentals.None)));
        //astaff.addSymbol(new symbol.Note(new notehead.Notehead(1, notehead.visualTypes.Quarter, notehead.directions.Left, false, notehead.accidentals.None)));
        //astaff.addSymbol(new symbol.Note(new notehead.Notehead(2, notehead.visualTypes.Quarter, notehead.directions.Left, false, notehead.accidentals.None)));
        //astaff.addSymbol(new symbol.Note(new notehead.Notehead(3, notehead.visualTypes.Quarter, notehead.directions.Left, false, notehead.accidentals.None)));
        //astaff.addSymbol(new symbol.Note(new notehead.Notehead(4, notehead.visualTypes.Quarter, notehead.directions.Left, false, notehead.accidentals.None)));
        //astaff.addSymbol(new symbol.Note(new notehead.Notehead(5, notehead.visualTypes.Quarter, notehead.directions.Left, false, notehead.accidentals.None)));
        //astaff.addSymbol(new symbol.Note(new notehead.Notehead(6, notehead.visualTypes.Quarter, notehead.directions.Left, false, notehead.accidentals.None)));
        //astaff.addSymbol(new symbol.Note(new notehead.Notehead(7, notehead.visualTypes.Quarter, notehead.directions.Left, false, notehead.accidentals.None)));
        //astaff.addSymbol(new symbol.Note(new notehead.Notehead(8, notehead.visualTypes.Quarter, notehead.directions.Left, false, notehead.accidentals.None)));

        var canvas = document.getElementById("myCanvas");
        canvas.onmousemove = function (e) {
            var bbox = canvas.getBoundingClientRect();
            mousePos.x = e.clientX - bbox.left * (canvas.width / bbox.width);
            mousePos.y = e.clientY - bbox.top * (canvas.height / bbox.height);

            fixLastDrawnPoint();

            var clampedPoint = staffarranger.clampMovableHead(mousePos);
            symboldrawer.draw(notehead.visualTypes.Quarter, clampedPoint, true);

            lastDrawnPoint = clampedPoint;

        };

        canvas.onmousedown = function (e) {
            var bbox = canvas.getBoundingClientRect();
            mousePos.x = e.clientX - bbox.left * (canvas.width / bbox.width);
            mousePos.y = e.clientY - bbox.top * (canvas.height / bbox.height);

            fixLastDrawnPoint();

            if (playbacktoolbar.highLevelHitTest(mousePos)) {
                // assume that it's the play button because it's the only one in the toolbar
                for (var i = 0; i < astaff.symbols.length; i++) {
                    var aSymbol = astaff.symbols[i];
                    var noteIndex = notereader.getNoteIndexFromStaffPosition(aSymbol.notehead.staffposition);
                    musicplayer.addNote(noteIndex, i, 0.75);
                }

            } else {
                var clampedPoint = staffarranger.clampMovableHead(mousePos);

                var staffNotePosition = staffarranger.getStaffNotePositionFromY(clampedPoint.y);

                astaff.addSymbol(new symbol.Note(new notehead.Notehead(staffNotePosition, notehead.visualTypes.Quarter, notehead.directions.Left, false, notehead.accidentals.None)));
                
                var symbolMargin = 50;
                var centerX = astaff.symbols.length * symbolMargin;

                var centerPoint = { x: centerX, y: clampedPoint.y };
                symboldrawer.draw(notehead.visualTypes.Quarter, centerPoint, false);

                lastDrawnPoint = clampedPoint;
            }


        };

        var fixLastDrawnPoint = function () {
            var clearRect = symboldrawer.clear(notehead.visualTypes.Quarter, lastDrawnPoint);
            backgrounddrawer.draw(clearRect);

            drawIntersectingSymbols(clearRect);
        };

        var drawIntersectingSymbols = function (r) {
            for (var i = 0; i < astaff.symbols.length; i++) {
                var symbol = astaff.symbols[i];

                var staffPosition = symbol.notehead.staffposition;

                var symbolMargin = 50;
                var centerX = (i + 1) * symbolMargin;

                var centerY = staffarranger.getYFromStaffNotePosition(staffPosition);
                var centerPoint = { x: centerX, y: centerY };

                if (utils.rectsIntersect(symboldrawer.getDrawRect(symbol.notehead.visualtype, centerPoint), r)) {
                    // need to re-draw this note because part of its bounds was erased
                    symboldrawer.draw(symbol.notehead.visualtype, centerPoint, false);
                }
            }
        };

        var backgroundrect = new utils.Rectangle(
            0,
            0,
            viewport.width,
            viewport.height);

        backgrounddrawer.draw(backgroundrect);
        drawIntersectingSymbols(backgroundrect);

        playbacktoolbar.drawButtons();

        var lastDrawnPoint = mousePos;

        function step(timestamp) {

            requestAnimationFrame(step);
        };

        //requestAnimationFrame(step);
    });