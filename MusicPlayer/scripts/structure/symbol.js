define([], function () {

    var _Note = function (notehead, stemId, stemOrder) {
        this.notehead = notehead;
        this.stemId = stemId;
        this.stemOrder = stemOrder; // Order on stem (0 is bottom of stem)
    };

    var _Rest = function (type) {
        this.type = type;
    };

    var _MeasureBreak = function () {

    };

    var _SectionStart = function (staffsection) {
        this.staffsection = staffsection;
    };

    return {
        Note: _Note,
        Rest: _Rest,
        MeasureBreak: _MeasureBreak,
        SectionStart: _SectionStart,
    };

});