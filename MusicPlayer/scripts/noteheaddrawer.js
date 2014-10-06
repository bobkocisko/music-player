define(['drawcontext', 'staffarranger', 'utils', 'structure/notehead'], function (drawcontext, staffarranger, utils, notehead) {
    'use strict';

    var ctx = drawcontext.get();

    var _draw = function (visualType, centerPoint, isPreview) {
        switch (visualType) {
            case notehead.visualTypes.Quarter:
                var height = staffarranger.noteHeight;
                ctx.save();
                ctx.beginPath();
                ctx.translate(centerPoint.x, centerPoint.y);
                ctx.rotate(-Math.PI / 6);
                ctx.scale(1, 0.7);
                ctx.arc(0, 0, height * 0.6, 2 * Math.PI, 0);
                if (isPreview) {
                    ctx.fillStyle = "rgba(170,170,170, 0.75)";
                }
                else {
                    ctx.fillStyle = "#000000";
                }
                ctx.fill();
                ctx.restore();
                break;
        }
    };

    var _clear = function (visualType, centerPoint) {
        switch (visualType) {
            case notehead.visualTypes.Quarter:
                var clearRect = _getDrawRect(visualType, centerPoint);
                ctx.clearRect(clearRect.left, clearRect.top, clearRect.width, clearRect.height);
                return clearRect;
        }
    };

    var _getDrawRect = function (visualType, centerPoint) {
        switch (visualType) {
            case notehead.visualTypes.Quarter:
                var height = staffarranger.noteHeight + 4; // Need an extra 4 pixels to include 'ghost' pixels from antialiasing
                var halfHeight = height / 2;
                return new utils.Rectangle(centerPoint.x - halfHeight, centerPoint.y - halfHeight, height, height);
        }
    };

    var _getDrawSize = function (visualType) {
        switch (visualType) {
            case notehead.visualTypes.Quarter:
                var height = staffarranger.noteHeight + 4; // Need an extra 4 pixels to include 'ghost' pixels from antialiasing
                return new utils.Size(height, height);
        }
    };

    return {
        draw: _draw,
        clear: _clear,
        getDrawRect: _getDrawRect,
        getDrawSize: _getDrawSize,
    };
});