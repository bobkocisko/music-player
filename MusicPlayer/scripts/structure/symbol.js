define([], function () {

    var _minimumSymbolLMargin = 5;

    var _SymbolBase = function (lmargin) {
        this.lmargin = typeof lmargin !== 'undefined' ? lmargin : _minimumSymbolLMargin;
    }

    var _Note = function (notehead, stem, stemOrder, flagCount, lmargin) {
        _SymbolBase.call(this, lmargin);
        this.notehead = notehead;
        this.stem = stem;
        this.stemorder = stemOrder; // Order on stem (0 is bottom of stem)
        this.flagcount = flagCount;
    };

    _Note.prototype = function () {
        var _clone = function () {
            var newNote = new _Note(
                this.notehead.clone(),
                this.stem.clone(),
                this.stemorder,
                this.flagcount,
                this.lmargin);
            return newNote;
        };

        var _clearDirection = function () {
            // Removes the notehead and stem direction information
            this.notehead.direction = null;
            this.stem.direction = null;
        };

        return {
            clone: _clone,
            clearDirection: _clearDirection,
        };
    }();

    var _Rest = function (type, lmargin) {
        _SymbolBase.call(this, lmargin);
        this.type = type;
    };

    var _MeasureBreak = function (lmargin) {
        _SymbolBase.call(this, lmargin);

    };

    var _SectionStart = function (staffsection) {
        _SymbolBase.call(this);
        this.staffsection = staffsection;
    };

    return {
        minimumSymbolLMargin: _minimumSymbolLMargin,
        Note: _Note,
        Rest: _Rest,
        MeasureBreak: _MeasureBreak,
        SectionStart: _SectionStart,
    };

});