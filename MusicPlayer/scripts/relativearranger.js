define(['staffarranger', 'symboldrawer'], function (staffarranger, symboldrawer) {

    var _clampMovableHead = function (staff, point, spaceToRight) {
        var x = point.x, y = point.y;

        var clamped = false;

        var cumulativeX = staffarranger.horizontalMargin;
        for (var i = 0; i < staff.symbols.length; i++) {
            var symbol = staff.symbols[i];
            var drawSize = symboldrawer.getDrawSize(symbol.notehead.visualtype);
            var spaceForSymbol = drawSize.width + symbol.lmargin;

            if (cumulativeX + (spaceForSymbol - (drawSize.width / 2)) > point.x) {
                if (i == 0) {
                    x = staffarranger.horizontalMargin;
                }
                else {
                    x = cumulativeX + (symbol.lmargin / 2);
                }
                clamped = true;
                break;
            }
            cumulativeX += spaceForSymbol;
        }

        if (!clamped && (cumulativeX + spaceToRight) > point.x) {
            x = cumulativeX + spaceToRight;
        }

        return {
            x: x,
            y: y
        };
    };

    var _getCumulativeNoteSpace = function (staff) {
        var cumulativeX = staffarranger.horizontalMargin;
        for (var i = 0; i < staff.symbols.length; i++) {
            var symbol = staff.symbols[i];
            var drawSize = symboldrawer.getDrawSize(symbol.notehead.visualtype);
            var spaceForSymbol = drawSize.width + symbol.lmargin;
            cumulativeX += spaceForSymbol;
        }

        return cumulativeX;
    };


    return {
        clampMovableHead: _clampMovableHead,
        getCumulativeNoteSpace: _getCumulativeNoteSpace,
    };
});