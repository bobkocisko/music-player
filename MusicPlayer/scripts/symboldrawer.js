define(['drawcontext', 'noteheaddrawer', 'symbol', 'staffarranger', 'structure/stem'], function (drawcontext, noteheaddrawer, symbol, staffarranger, stem) {

    var ctx = drawcontext.get();

    var _draw = function (asymbol, centerPoint, isPreview) {
        if (asymbol.notehead) {
            noteheaddrawer.draw(asymbol.notehead.visualtype, centerPoint, isPreview);
            var headrect = noteheaddrawer.getDrawRect(asymbol.notehead.visualtype, centerPoint);
            if (asymbol.stem) {
                var stemdirection = staffarranger.getStemDirection(asymbol);
                ctx.beginPath();
                if (stemdirection == stem.directions.down) {
                    // TODO
                }
                else {  // stem up
                    ctx.moveTo();
                    ctx.lineTo();
                }
                ctx.stroke();
            }
        }
    };

    var _clear = function (asymbol, centerPoint) {
        return noteheaddrawer.clear(visualType, centerPoint);
    };

    var _getDrawRect = function (asymbol, centerPoint) {
        return noteheaddrawer.getDrawRect(visualType, centerPoint);
    };

    var _getDrawSize = function (asymbol) {
        return noteheaddrawer.getDrawSize(visualType);
    };

    return {
        draw: _draw,
        clear: _clear,
        getDrawRect: _getDrawRect,
        getDrawSize: _getDrawSize,
    };
});