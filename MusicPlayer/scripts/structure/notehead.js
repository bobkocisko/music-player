define([], function () {
    var _Notehead = function (staffposition, visualtype, direction, isdotted, accidental) {
        this.staffposition = staffposition; // 0 is middle C
        this.visualtype = visualtype;
        this.direction = direction;
        this.isdotted = isdotted;
        this.accidental = accidental;
    };

    return {
        Notehead: _Notehead,
        visualTypes: {
            whole: "whole",
            half: "half",
            quarter: "quarter",
        },
        directions: {
            left: "left",
            right: "right",
        },
        accidentals: {
            none: "none",
            flat: "flat",
            sharp: "sharp",
            natural: "natural"
        }
    };
});