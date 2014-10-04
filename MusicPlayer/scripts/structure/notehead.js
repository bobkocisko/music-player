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
            Whole: "Whole",
            Half: "Half",
            Quarter: "Quarter",
        },
        directions: {
            Left: "Left",
            Right: "Right",
        },
        accidentals: {
            None: "None",
            Flat: "Flat",
            Sharp: "Sharp",
            Natural: "Natural"
        }
    };
});