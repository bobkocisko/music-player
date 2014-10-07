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
            whole: "Whole",
            half: "Half",
            quarter: "Quarter",
        },
        directions: {
            left: "Left",
            right: "Right",
        },
        accidentals: {
            none: "None",
            flat: "Flat",
            sharp: "Sharp",
            natural: "Natural"
        }
    };
});