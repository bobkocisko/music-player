define(['staffarranger', 'symboldrawer', 'structure/symbol', 'utils'], function (staffarranger, symboldrawer, symbol, utils) {

    var _clampMovableHead = function (staff, point, newSymbolXUnitRect) {
        var x = point.x, y = point.y;
        var beforeSymbol = null;
        var newLMargin = symbol.minimumSymbolLMargin;

        var clamped = false;

        var cumulativeX = staffarranger.horizontalMargin;
        var lastExclusionRange = _getMarginExclusionRange(newSymbolXUnitRect);
        var lastSymbolCenter = staffarranger.horizontalMargin;

        for (var i = 0; i < staff.symbols.length; i++) {
            var asymbol = staff.symbols[i];
            var centerY = staffarranger.getYFromStaffNotePosition(asymbol.notehead.staffposition);
            var drawXUnitRect = symboldrawer.getDrawRect(asymbol, { x: 0, y: centerY });
            var spaceForSymbol = drawXUnitRect.width + asymbol.lmargin;

            var currentExclusionRange = _getExclusionRange(cumulativeX, asymbol.lmargin, drawXUnitRect.width, newSymbolXUnitRect);
            var symbolCenter = cumulativeX + asymbol.lmargin - drawXUnitRect.left;

            if (symbolCenter > point.x) {

                if (utils.rangesIntersect(lastExclusionRange, currentExclusionRange)) {
                    // find the center point between the two notes
                    x = (symbolCenter + lastSymbolCenter) / 2;
                }
                else {
                    // TODO: if i is 0, clamp to right of range only (because left of range is absolute 0)
                    x = utils.clampOutsideRange(x, lastExclusionRange);
                    x = utils.clampOutsideRange(x, currentExclusionRange);
                    newLMargin = x + newSymbolXUnitRect.left - cumulativeX;
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
            if ((cumulativeX + symbol.minimumSymbolLMargin - newSymbolXUnitRect.left)  > point.x) {
                x = cumulativeX + symbol.minimumSymbolLMargin - newSymbolXUnitRect.left;
            }
            else {
                newLMargin = x + newSymbolXUnitRect.left - cumulativeX;
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

    var _getMarginExclusionRange = function (newSymbolXUnitRect) {
        return {
            start: 0,
            end: staffarranger.horizontalMargin - newSymbolXUnitRect.left,
        };
    };

    var _getExclusionRange = function (cumulativeX, symbolLMargin, symbolWidth, newSymbolXUnitRect) {
        var symbolLeft = cumulativeX + symbolLMargin;
        var symbolRight = symbolLeft + symbolWidth;
        return {
            start: symbolLeft - symbol.minimumSymbolLMargin - newSymbolXUnitRect.right(),
            end: symbolRight + symbol.minimumSymbolLMargin - newSymbolXUnitRect.left,
        };
    };

    var _getCumulativeNoteSpace = function (staff) {
        var cumulativeX = staffarranger.horizontalMargin;
        for (var i = 0; i < staff.symbols.length; i++) {
            var asymbol = staff.symbols[i];
            var drawSize = symboldrawer.getDrawSize(asymbol);
            var spaceForSymbol = drawSize.width + asymbol.lmargin;
            cumulativeX += spaceForSymbol;
        }

        return cumulativeX;
    };


    return {
        clampMovableHead: _clampMovableHead,
        getCumulativeNoteSpace: _getCumulativeNoteSpace,
    };
});