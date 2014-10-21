define([
    'staffarranger',
    'symboldrawer',
    'backgrounddrawer',
    'relativearranger',
    'selector',
    'structure/notehead',
    'structure/symbol'
],
    function (
        staffarranger,
        symboldrawer,
        backgrounddrawer,
        relativearranger,
        selector,
        notehead,
        symbol) {
        var _Adder = function (aStaff) {
            this.staff = aStaff;
            this.previewsymbol = new symbol.Note(new notehead.Notehead(null, notehead.visualTypes.quarter, null, false, notehead.accidentals.none), new stem.Stem(null), 0, 1, symbol.minimumSymbolLMargin);

            this.lastDrawnPoint = {
                x: -20,
                y: -20
            };

            this.selector = new selector.Selector();
            var dqnote = new symbol.Note(new notehead.Notehead(null, notehead.visualTypes.quarter, notehead.directions.left, true, notehead.accidentals.none), new stem.Stem(stem.directions.up), 0, 0, symbol.minimumSymbolLMargin);
            this.selector.addOption(dqnote, symboldrawer);
            var qnote = new symbol.Note(new notehead.Notehead(null, notehead.visualTypes.quarter, notehead.directions.left, false, notehead.accidentals.none), new stem.Stem(stem.directions.up), 0, 0, symbol.minimumSymbolLMargin);
            this.selector.addOption(qnote, symboldrawer);
            var enote = new symbol.Note(new notehead.Notehead(null, notehead.visualTypes.quarter, notehead.directions.left, false, notehead.accidentals.none), new stem.Stem(stem.directions.up), 0, 1, symbol.minimumSymbolLMargin);
            this.selector.addOption(enote, symboldrawer);
        };

        _Adder.prototype = function () {
            var _mouseMoved = function (mousePoint) {

                this.fixLastDrawnPoint();

                var clampedPoint = staffarranger.clampMovableHead(mousePoint);
                var drawXUnitRect = symboldrawer.getDrawRect(this.previewsymbol, { x: 0, y: clampedPoint.y });
                var clampResults = relativearranger.clampMovableHead(astaff, clampedPoint, drawXUnitRect);
                clampedPoint = clampResults.clampedPoint;
                symboldrawer.draw(this.previewsymbol, clampedPoint, true);

                // TODO: clean this up
                this.selector.updateOptionStatuses(this.selectorLocation, mousePoint);
                this.selector.clear(this.selectorLocation);
                this.selector.draw(this.selectorLocation);

                this.lastDrawnPoint = clampedPoint;
            };

            var _mouseDown = function (mousePoint) {
                this.fixLastDrawnPoint();

                var clampedPoint = staffarranger.clampMovableHead(mousePoint);
                var drawXUnitRect = symboldrawer.getDrawRect(this.previewsymbol, { x: 0, y: clampedPoint.y });
                var clampResults = relativearranger.clampMovableHead(astaff, clampedPoint, drawXUnitRect);
                clampedPoint = clampResults.clampedPoint;
                var staffNotePosition = staffarranger.getStaffNotePositionFromY(clampedPoint.y);
                var stemdirection = staffarranger.getDefaultStemDirection(staffNotePosition);
                var notedirection = staffarranger.getDefaultNoteDirection(staffNotePosition);
                var newNote = new symbol.Note(new notehead.Notehead(staffNotePosition, notehead.visualTypes.quarter, notedirection, false, notehead.accidentals.none), new stem.Stem(stemdirection), 0, 1, clampResults.newLMargin);
                if (!clampResults.beforeSymbol) {
                    this.staff.addSymbol(newNote);
                }
                else {
                    // adjust the margin of the note following the inserted note
                    clampResults.beforeSymbol.lmargin -= drawXUnitRect.width + newNote.lmargin;
                    if (clampResults.beforeSymbol.lmargin < symbol.minimumSymbolLMargin) clampResults.beforeSymbol.lmargin = symbol.minimumSymbolLMargin;
                    this.staff.insertSymbol(clampResults.beforeSymbol, newNote);
                }

                // TODO  replace this with something like the following commented stuff              
                backgrounddrawer.clear(backgroundrect);
                backgrounddrawer.draw(backgroundrect);
                this.drawIntersectingSymbols(backgroundrect);
                //var symbolLMargin = 50;
                //var centerX = astaff.symbols.length * symbolLMargin;

                //var centerPoint = { x: centerX, y: clampedPoint.y };
                //symboldrawer.draw(notehead.visualTypes.quarter, centerPoint, false);

                this.lastDrawnPoint = clampedPoint;

            };

            var _fixLastDrawnPoint = function () {
                var clearRect = symboldrawer.clear(this.previewsymbol, this.lastDrawnPoint);
                backgrounddrawer.draw(clearRect);

                this.drawIntersectingSymbols(clearRect);
            };

            var _drawIntersectingSymbols = function (r) {
                var cumulativeX = staffarranger.horizontalMargin;

                for (var i = 0; i < astaff.symbols.length; i++) {
                    var asymbol = astaff.symbols[i];

                    var staffPosition = asymbol.notehead.staffposition;
                    var centerY = staffarranger.getYFromStaffNotePosition(staffPosition);
                    var drawXUnitRect = symboldrawer.getDrawRect(asymbol, { x: 0, y: centerY });
                    var spaceForSymbol = drawXUnitRect.width + asymbol.lmargin;


                    var centerX = cumulativeX + asymbol.lmargin - drawXUnitRect.left;

                    var centerPoint = { x: centerX, y: centerY };

                    if (utils.rectsIntersect(symboldrawer.getDrawRect(asymbol, centerPoint), r)) {
                        // need to re-draw this note because part of its bounds was erased
                        symboldrawer.draw(asymbol, centerPoint, false);
                    }

                    cumulativeX += spaceForSymbol;
                }
            };

            return {
                mouseMoved: _mouseMoved,
                mouseDown: _mouseDown,
                fixLastDrawnPoint: _fixLastDrawnPoint,
                drawIntersectingSymbols: _drawIntersectingSymbols,
            };
        }();

        var backgroundrect = new utils.Rectangle(
            0,
            0,
            viewport.width,
            viewport.height);

        return {
            Adder: _Adder,
        };
    });