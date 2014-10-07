define(['backgrounddrawer',
    'viewport',
    'utils',
    'symboldrawer',
    'symbols',
    'staffarranger',
    'relativearranger',
    'playbacktoolbar',
    'musicplayer',
    'notereader',
    'structure/staff',
    'structure/staffsection',
    'structure/notehead',
    'structure/symbol',
    'structure/stem',
],
    function (backgrounddrawer,
        viewport,
        utils,
        symboldrawer,
        symbols,
        staffarranger,
        relativearranger,
        playbacktoolbar,
        musicplayer,
        notereader,
        staff,
        staffsection,
        notehead,
        symbol,
        stem
        ) {
        'use strict';

        var mousePos = {
            x: -20,
            y: -20
        };

        var astaff = new staff.Staff(new staffsection.StaffSection());  // Use the default values for StaffSection
        var previewsymbol = new symbol.Note(new notehead.Notehead(null, notehead.visualTypes.quarter, null, false, notehead.accidentals.none), new stem.Stem(null), 0, symbol.minimumSymbolLMargin);

        //astaff.addSymbol(new symbol.Note(new notehead.Notehead(0, notehead.visualTypes.quarter, notehead.directions.Left, false, notehead.accidentals.None)));
        //astaff.addSymbol(new symbol.Note(new notehead.Notehead(1, notehead.visualTypes.quarter, notehead.directions.Left, false, notehead.accidentals.None)));
        //astaff.addSymbol(new symbol.Note(new notehead.Notehead(2, notehead.visualTypes.quarter, notehead.directions.Left, false, notehead.accidentals.None)));
        //astaff.addSymbol(new symbol.Note(new notehead.Notehead(3, notehead.visualTypes.quarter, notehead.directions.Left, false, notehead.accidentals.None)));
        //astaff.addSymbol(new symbol.Note(new notehead.Notehead(4, notehead.visualTypes.quarter, notehead.directions.Left, false, notehead.accidentals.None)));
        //astaff.addSymbol(new symbol.Note(new notehead.Notehead(5, notehead.visualTypes.quarter, notehead.directions.Left, false, notehead.accidentals.None)));
        //astaff.addSymbol(new symbol.Note(new notehead.Notehead(6, notehead.visualTypes.quarter, notehead.directions.Left, false, notehead.accidentals.None)));
        //astaff.addSymbol(new symbol.Note(new notehead.Notehead(7, notehead.visualTypes.quarter, notehead.directions.Left, false, notehead.accidentals.None)));
        //astaff.addSymbol(new symbol.Note(new notehead.Notehead(8, notehead.visualTypes.quarter, notehead.directions.Left, false, notehead.accidentals.None)));

        var canvas = document.getElementById("myCanvas");
        canvas.onmousemove = function (e) {
            var bbox = canvas.getBoundingClientRect();
            mousePos.x = e.clientX - bbox.left * (canvas.width / bbox.width);
            mousePos.y = e.clientY - bbox.top * (canvas.height / bbox.height);

            fixLastDrawnPoint();

            var clampedPoint = staffarranger.clampMovableHead(mousePos);
            var drawSize = symboldrawer.getDrawSize(previewsymbol);
            var clampResults = relativearranger.clampMovableHead(astaff, clampedPoint, (drawSize.width / 2) + symbol.minimumSymbolLMargin);
            clampedPoint = clampResults.clampedPoint;
            symboldrawer.draw(previewsymbol, clampedPoint, true);

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
                var drawSize = symboldrawer.getDrawSize(previewsymbol);
                var halfNoteWidth = (drawSize.width / 2);
                var clampResults = relativearranger.clampMovableHead(astaff, clampedPoint, halfNoteWidth + symbol.minimumSymbolLMargin);
                clampedPoint = clampResults.clampedPoint;
                var staffNotePosition = staffarranger.getStaffNotePositionFromY(clampedPoint.y);
                //var lmargin = symbol.minimumSymbolLMargin;

                //var leftmostAcceptableNotePosition = relativearranger.getCumulativeNoteSpace(astaff) + lmargin + halfNoteWidth;
                //if (leftmostAcceptableNotePosition < clampedPoint.x) {
                //    lmargin = symbol.minimumSymbolLMargin + (clampedPoint.x - leftmostAcceptableNotePosition);
                //}
                var stemdirection = staffarranger.getDefaultStemDirection(staffNotePosition);
                var notedirection = staffarranger.getDefaultNoteDirection(staffNotePosition);
                var newNote = new symbol.Note(new notehead.Notehead(staffNotePosition, notehead.visualTypes.quarter, notedirection, false, notehead.accidentals.none), new stem.Stem(stemdirection), 0, clampResults.newLMargin);
                if (!clampResults.beforeSymbol) {
                    astaff.addSymbol(newNote);
                }
                else {
                    clampResults.beforeSymbol.lmargin -= drawSize.width + newNote.lmargin;
                    if (clampResults.beforeSymbol.lmargin < symbol.minimumSymbolLMargin) clampResults.beforeSymbol.lmargin = symbol.minimumSymbolLMargin;
                    astaff.insertSymbol(clampResults.beforeSymbol, newNote);
                }

                // TODO  replace this with something like the following commented stuff              
                backgrounddrawer.clear(backgroundrect);
                backgrounddrawer.draw(backgroundrect);
                playbacktoolbar.drawButtons();
                drawIntersectingSymbols(backgroundrect);
                //var symbolLMargin = 50;
                //var centerX = astaff.symbols.length * symbolLMargin;

                //var centerPoint = { x: centerX, y: clampedPoint.y };
                //symboldrawer.draw(notehead.visualTypes.quarter, centerPoint, false);

                lastDrawnPoint = clampedPoint;
            }


        };

        var fixLastDrawnPoint = function () {
            var clearRect = symboldrawer.clear(previewsymbol, lastDrawnPoint);
            backgrounddrawer.draw(clearRect);

            drawIntersectingSymbols(clearRect);
        };

        var drawIntersectingSymbols = function (r) {
            var cumulativeX = staffarranger.horizontalMargin;

            for (var i = 0; i < astaff.symbols.length; i++) {
                var asymbol = astaff.symbols[i];

                var drawSize = symboldrawer.getDrawSize(asymbol);
                var spaceForSymbol = drawSize.width + asymbol.lmargin;

                var staffPosition = asymbol.notehead.staffposition;

                var centerX = cumulativeX + (spaceForSymbol - (drawSize.width / 2));

                var centerY = staffarranger.getYFromStaffNotePosition(staffPosition);
                var centerPoint = { x: centerX, y: centerY };

                if (utils.rectsIntersect(symboldrawer.getDrawRect(asymbol, centerPoint), r)) {
                    // need to re-draw this note because part of its bounds was erased
                    symboldrawer.draw(asymbol, centerPoint, false);
                }

                cumulativeX += spaceForSymbol;
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