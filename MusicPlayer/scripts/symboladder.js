define([
    'staffarranger',
    'symboldrawer',
    'backgrounddrawer',
    'relativearranger',
    'selector',
    'structure/notehead',
    'structure/symbol',
    'structure/stem',
    'utils',
    'viewport',
],
    function (
        staffarranger,
        symboldrawer,
        backgrounddrawer,
        relativearranger,
        selector,
        notehead,
        symbol,
        stem,
        utils,
        viewport) {
        var _Adder = function (aStaff) {
            this.staff = aStaff;
            this.previewsymbol = new symbol.Note(new notehead.Notehead(null, notehead.visualTypes.quarter, null, false, notehead.accidentals.none), new stem.Stem(null), 0, 0, symbol.minimumSymbolLMargin);

            this.lastDrawnPoint = {
                x: -20,
                y: -20
            };

            this.selector = new selector.Selector();
            var dqnote = new symbol.Note(new notehead.Notehead(null, notehead.visualTypes.quarter, notehead.directions.left, true, notehead.accidentals.none), new stem.Stem(stem.directions.up), 0, 0, symbol.minimumSymbolLMargin);
            this.selector.addOption(dqnote, symboldrawer);
            var qnote = new symbol.Note(new notehead.Notehead(null, notehead.visualTypes.quarter, notehead.directions.left, false, notehead.accidentals.none), new stem.Stem(stem.directions.up), 0, 0, symbol.minimumSymbolLMargin);
            this.selector.addOption(qnote, symboldrawer, selector.optionStatuses.on);
            var enote = new symbol.Note(new notehead.Notehead(null, notehead.visualTypes.quarter, notehead.directions.left, false, notehead.accidentals.none), new stem.Stem(stem.directions.up), 0, 1, symbol.minimumSymbolLMargin);
            this.selector.addOption(enote, symboldrawer);

            this.isSelecting = false;
        };

        _Adder.prototype = function () {
            var _mouseMoved = function (mousePoint) {

                if (this.isSelecting) {
                    var anyUpdates = this.selector.updateOptionStatuses(this.selectorLocation, mousePoint);
                    if (anyUpdates) {
                        _updatePreviewSymbolFromSelector.call(this);
                        this.fixLastDrawnPoint();
                        var clearRect = this.selector.clear(this.selectorLocation);
                        backgrounddrawer.draw(clearRect);
                        this.drawIntersectingSymbols(clearRect);
                        _clampAndDrawPreview.call(this, this.selectorLocation);
                        this.selector.draw(this.selectorLocation);
                    }

                }
                else {
                    this.fixLastDrawnPoint();
                    _clampAndDrawPreview.call(this, mousePoint);
                }
            };

            var _mouseDown = function (mousePoint) {
                this.fixLastDrawnPoint();

                _clampAndDrawPreview.call(this, mousePoint);

                this.selector.draw(mousePoint);

                this.selectorLocation = mousePoint;

                this.isSelecting = true;
            };

            var _mouseUp = function (mousePoint) {
                if (this.isSelecting) {
                    _addToStaff.call(this, this.selectorLocation);
                    this.isSelecting = false;
                }
            };

            var _clampAndDrawPreview = function (mousePoint) {
                var clampedPoint = staffarranger.clampMovableHead(mousePoint);
                var drawXUnitRect = symboldrawer.getDrawRect(this.previewsymbol, { x: 0, y: clampedPoint.y });
                var clampResults = relativearranger.clampMovableHead(this.staff, clampedPoint, drawXUnitRect);
                clampedPoint = clampResults.clampedPoint;
                symboldrawer.draw(this.previewsymbol, clampedPoint, true);
                this.lastDrawnPoint = clampedPoint;
            };

            var _updatePreviewSymbolFromSelector = function () {
                this.previewsymbol = this.selector.getSelectedOption();
            };

            var _fixLastDrawnPoint = function () {
                var clearRect = symboldrawer.clear(this.previewsymbol, this.lastDrawnPoint);
                backgrounddrawer.draw(clearRect);

                this.drawIntersectingSymbols(clearRect);
            };

            var _drawIntersectingSymbols = function (r) {
                var cumulativeX = staffarranger.horizontalMargin;

                for (var i = 0; i < this.staff.symbols.length; i++) {
                    var asymbol = this.staff.symbols[i];

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

            var _addToStaff = function (mousePoint) {
                var clampedPoint = staffarranger.clampMovableHead(mousePoint);
                var drawXUnitRect = symboldrawer.getDrawRect(this.previewsymbol, { x: 0, y: clampedPoint.y });
                var clampResults = relativearranger.clampMovableHead(this.staff, clampedPoint, drawXUnitRect);
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

                // TODO  replace this with clearing then redrawing notes              
                backgrounddrawer.clear(backgroundrect);
                backgrounddrawer.draw(backgroundrect);
                this.drawIntersectingSymbols(backgroundrect);
            };

            return {
                mouseMoved: _mouseMoved,
                mouseDown: _mouseDown,
                mouseUp: _mouseUp,
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