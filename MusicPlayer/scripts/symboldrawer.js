define(['drawcontext', 'staffarranger', 'utils', 'structure/notehead'], function (drawcontext, staffarranger, utils, notehead) {
    'use strict';

    var ctx = drawcontext.get();

    var _draw = function (symbol, centerPoint, isPreview) {
        switch (symbol) {
            case notehead.visualTypes.Quarter:
                var height = staffarranger.noteHeight;
                ctx.beginPath();
                ctx.arc(centerPoint.x, centerPoint.y, height / 2, 0, 2 * Math.PI);
                if (isPreview) {
                    ctx.fillStyle = "#999999";
                }
                else {
                    ctx.fillStyle = "#000000";
                }
                ctx.fill();
                break;
        }
    };

    var _clear = function (symbol, centerPoint) {
        switch (symbol) {
            case notehead.visualTypes.Quarter:
                var clearRect = _getDrawRect(symbol, centerPoint);
                ctx.clearRect(clearRect.left, clearRect.top, clearRect.width, clearRect.height);
                return clearRect;
        }
    };

    var _getDrawRect = function (symbol, centerPoint) {
        switch (symbol) {
            case notehead.visualTypes.Quarter:
                var height = staffarranger.noteHeight + 4; // Need an extra 4 pixels to include 'ghost' pixels from antialiasing
                var halfHeight = height / 2;
                return new utils.Rectangle(centerPoint.x - halfHeight, centerPoint.y - halfHeight, height, height);
        }
    };

    return {
        draw: _draw,
        clear: _clear,
        getDrawRect: _getDrawRect
    };
});