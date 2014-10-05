define(['drawcontext', 'staffarranger', 'utils'], function (drawcontext, staffarranger, utils) {
    'use strict';

    var ctx = drawcontext.get();

    var _draw = function (drawRect) {
        var bounds = staffarranger.bounds();
        for (var i = 0; i < bounds.length; i++) {
            var staffRect = bounds[i];

            if (utils.rectsIntersect(staffRect, drawRect)) {
                // draw the part of the staff that is needed to be drawn
                var intersection = utils.getIntersection(staffRect, drawRect);
                var lineHeight = staffRect.height / 4;
                for (var y = staffRect.top; y - 1 < intersection.bottom(); y += lineHeight) { // " - 1" serves as an epsilon value due to fp math
                    if (y + 1 >= intersection.top) { // " + 1" serves as an epsilon value due to fp math
                        _drawLine(y, intersection);
                    }
                }
                if (staffRect.bottom() <= intersection.bottom()) {
                    _drawLine(staffRect.bottom(), intersection);
                }
            }
        }
    };

    var _drawLine = function(y, intersection) {
        var crispY = Math.floor(y) + 0.5;
        ctx.beginPath();
        ctx.moveTo(intersection.left, crispY);
        ctx.lineTo(intersection.right(), crispY);
        ctx.fillStyle = "#000000";
        ctx.stroke();
    }

    var _clear = function(clearRect) {
        ctx.clearRect(clearRect.left, clearRect.top, clearRect.width, clearRect.height);
    }

    return {
        draw: _draw,
        clear: _clear
    };
});