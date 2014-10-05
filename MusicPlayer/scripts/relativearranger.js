define(['staffarranger', 'symboldrawer', 'structure/symbol', 'utils'], function (staffarranger, symboldrawer, symbol, utils) {

    var _clampMovableHead = function (staff, point, newSymbolWidth) {
        var x = point.x, y = point.y;
        var beforeSymbol = null;
        var newLMargin = symbol.minimumSymbolLMargin;

        var clamped = false;

        var cumulativeX = staffarranger.horizontalMargin;
        var lastExclusionRange = _getMarginExclusionRange(newSymbolWidth);
        var lastSymbolCenter = staffarranger.horizontalMargin;

        for (var i = 0; i < staff.symbols.length; i++) {
            var asymbol = staff.symbols[i];
            var drawSize = symboldrawer.getDrawSize(asymbol.notehead.visualtype);
            var spaceForSymbol = drawSize.width + asymbol.lmargin;

            var currentExclusionRange = _getExclusionRange(cumulativeX, asymbol.lmargin, drawSize.width, newSymbolWidth);
            var symbolCenter = cumulativeX + (spaceForSymbol - (drawSize.width / 2));

            if (symbolCenter > point.x) {

                if (utils.rangesIntersect(lastExclusionRange, currentExclusionRange)) {
                    // find the center point between the two notes
                    x = (symbolCenter + lastSymbolCenter) / 2;
                }
                else {
                    // TODO: if i is 0, clamp to right of range only (because left of range is absolute 0)
                    x = utils.clampOutsideRange(x, lastExclusionRange);
                    x = utils.clampOutsideRange(x, currentExclusionRange);
                    newLMargin = x - (newSymbolWidth / 2) - cumulativeX;
                }
                beforeSymbol = asymbol;
                clamped = true;
                break;
            }

            lastExclusionRange = currentExclusionRange;
            lastSymbolCenter = symbolCenter;
            cumulativeX += spaceForSymbol;
        }

        if (!clamped) { 
            if ((cumulativeX + symbol.minimumSymbolLMargin + (newSymbolWidth / 2))  > point.x) {
                x = cumulativeX + symbol.minimumSymbolLMargin + (newSymbolWidth / 2);
            }
            else {
                newLMargin = x - (newSymbolWidth / 2) - cumulativeX;
            }
        }

        return {
            clampedPoint: {
                x: x,
                y: y
            },
            beforeSymbol: beforeSymbol,
            newLMargin: newLMargin,
        };
    };

    var _getMarginExclusionRange = function (newSymbolWidth) {
        return {
            start: 0,
            end: staffarranger.horizontalMargin + newSymbolWidth / 2,
        };
    };

    var _getExclusionRange = function (cumulativeX, symbolLMargin, symbolWidth, newSymbolWidth) {
        var symbolLeft = cumulativeX + symbolLMargin;
        var symbolRight = symbolLeft + symbolWidth;
        var spaceNeeded = symbol.minimumSymbolLMargin + (newSymbolWidth / 2);
        return {
            start: symbolLeft - spaceNeeded,
            end: symbolRight + spaceNeeded,
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