define([], function () {

    var _defaultSymbolLMargin = 25;

    var _SymbolBase = function (lmargin) {
        this.lmargin = typeof lmargin !== 'undefined' ? lmargin : _defaultSymbolLMargin;
    }

    var _Note = function (notehead, stem, stemOrder, lmargin) {
        _SymbolBase.call(this, lmargin);
        this.notehead = notehead;
        this.stem = stem;
        this.stemOrder = stemOrder; // Order on stem (0 is bottom of stem)
    };

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
        defaultSymbolLMargin: _defaultSymbolLMargin,
        Note: _Note,
        Rest: _Rest,
        MeasureBreak: _MeasureBreak,
        SectionStart: _SectionStart,
    };

});