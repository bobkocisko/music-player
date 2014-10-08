define(['drawcontext', 'staffarranger', 'structure/stem', 'utils'], function (drawcontext, staffarranger, stem, utils) {

    var ctx = drawcontext.get();

    var _flagNoteHeightReference = 20; // Number of pixels of note height used as reference when designing the flag
    var _flagScale = staffarranger.noteHeight / _flagNoteHeightReference;

    var _draw = function (anchorPoint, isPreview, stemdirection) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(anchorPoint.x, anchorPoint.y);
        ctx.moveTo(0, 0);
        if (stemdirection == stem.directions.down) {
            // The flag was designed for an 'up' stem, so flip it for 'down'
            ctx.scale(1, -1);
        }
        ctx.scale(_flagScale, _flagScale);
        ctx.bezierCurveTo(4, 15, 25, 14, 10, 45);
        ctx.bezierCurveTo(15, 27, 15, 17, 0, 12);
        ctx.fillStyle = drawcontext.getColor(isPreview);
        ctx.fill();
        ctx.restore();
    };

    var _getDrawRect = function (anchorPoint, stemdirection) {
        var left = anchorPoint.x;
        var width = 27 * _flagScale;
        var height = 45 * _flagScale;
        if (stemdirection == stem.directions.up) {
            var top = anchorPoint.y;
        }
        else {
            var top = anchorPoint.y - height;
        }
        return new utils.Rectangle(
            left,
            top,
            width,
            height
            );
    };

    return {
        draw: _draw,
        getDrawRect: _getDrawRect,
    }
});