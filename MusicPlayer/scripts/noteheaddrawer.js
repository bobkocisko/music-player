define(['drawcontext', 'staffarranger', 'utils', 'structure/notehead'], function (drawcontext, staffarranger, utils, notehead) {
    'use strict';

    var ctx = drawcontext.get();

    var _draw = function (visualType, centerPoint, isPreview, multiplier) {
        multiplier = typeof multiplier !== 'undefined' ? multiplier : 1;

        switch (visualType) {
            case notehead.visualTypes.quarter:
                var height = staffarranger.noteHeight * multiplier;
                ctx.save();
                ctx.beginPath();
                ctx.translate(centerPoint.x, centerPoint.y);
                ctx.rotate(-Math.PI / 6);
                ctx.scale(1.3, 0.95); // 0.95 to shorten the note slightly so that when it is rotated it will not be too tall
                ctx.arc(0, 0, height / 2, 2 * Math.PI, 0);
                ctx.fillStyle = drawcontext.getColor(isPreview);
                ctx.fill();
                ctx.restore();
                break;
        }
    };

    var _getDrawRect = function (visualType, centerPoint, multiplier) {
        multiplier = typeof multiplier !== 'undefined' ? multiplier : 1;
        switch (visualType) {
            case notehead.visualTypes.quarter:
                var width = staffarranger.noteHeight * 1.3 * multiplier;
                var height = staffarranger.noteHeight * multiplier;
                return new utils.Rectangle(centerPoint.x - width / 2, centerPoint.y - height / 2, width, height);
        }
    };

    var _getStemAnchorVectors = function (visualType, multiplier) {
        // Returns the offsets from the center of the head where the stem should be anchored
        multiplier = typeof multiplier !== 'undefined' ? multiplier : 1;

        var width = (staffarranger.noteHeight * 1.2) * multiplier;
        var height = staffarranger.noteHeight * multiplier;
        switch (visualType) {
            case notehead.visualTypes.quarter:
                return {
                    left: {
                        x: width / 2,
                        y: -height * 0.1,
                        },
                    right: {
                        x: -width / 2,
                        y: height * 0.1,
                    },
                };
        }
    };

    return {
        draw: _draw,
        getDrawRect: _getDrawRect,
        getStemAnchorVectors: _getStemAnchorVectors,
    };
});