define(["utils", "drawcontext"], function (utils, drawcontext) {
    'use strict';

    var margin = 10;
    var buttonSize = 30;

    var ctx = drawcontext.get();

    var _drawButtons = function () {
        // draw a play triangle button
        var halfButtonSize = buttonSize / 2;
        ctx.beginPath();
        ctx.moveTo(margin, margin);
        ctx.lineTo(margin + buttonSize, margin + halfButtonSize);
        ctx.lineTo(margin, margin + buttonSize);
        ctx.fillStyle = "#0000FF";
        ctx.fill();
    };

    var _highLevelHitTest = function (point) {
        // returns whether the point is anywhere within the toolbar
        return utils.pointInRect(point, new utils.Rectangle(margin, margin, buttonSize, buttonSize));
    }

    var _buttonHitTest = function (point) {
        // returns which button the point is over, or -1 if no buttons
        if (!_highLevelHitTest(point)) {
            return -1;
        }
        return Math.floor((point.x - margin) / buttonSize);
    }

    return {
        drawButtons: _drawButtons,
        highLevelHitTest: _highLevelHitTest,
        buttonHitTest: _buttonHitTest
    };
});