define(['viewport', 'utils', 'structure/stem', 'structure/notehead'], function (viewport, utils, stem, notehead) {

    var staffHeight = 120;
    var _horizontalMargin = 20;
    var verticalMargin = 120;
    var _noteHeight = staffHeight / 4;
    var interStaffDistance = 150; // Must be a multiple of _noteHeight for current algorithm of _clampMovableHead

    // returns the closest valid location for a movable note head
    var _clampMovableHead = function (point) {
        var x = point.x, y = point.y;

        var bounds = _bounds();
        var lastStaff = bounds[bounds.length - 1];

        if (point.x < _horizontalMargin) {
            x = _horizontalMargin;
        } else if (point.x > viewport.width - _horizontalMargin) {
            x = viewport.width - _horizontalMargin;
        }

        if (y < verticalMargin) {
            y = verticalMargin;
        } else if (y > lastStaff.bottom() + (interStaffDistance / 2)) {
            y = lastStaff.bottom() + (interStaffDistance / 2);
        } else {
            var halfNoteHeight = _noteHeight / 2;
            y = (Math.floor(y / halfNoteHeight) * halfNoteHeight); // + (halfNoteHeight / 2);
        }

        //var staffIndex = Math.floor((y - (verticalMargin / 2)) / (staffHeight + interStaffDistance));
        //if (staffIndex < 0) staffIndex = 0;
        //if (staffIndex >= bounds.length) staffIndex = bounds.length - 1;
        //var staffBounds = bounds[staffIndex];

        //if (point.y < staffBounds.top) {
        //    y = staffBounds.top;
        //} else if (point.y > staffBounds.bottom()) {
        //    y = staffBounds.bottom();
        //}

        return {
            x: x,
            y: y
        }
    };

    var _getStaffNotePositionFromY = function (y) {
        var halfNoteHeight = _noteHeight / 2;
        return 23 - Math.floor(y / halfNoteHeight); // TODO: what a hack!!!!  Put it in the Guinness book of world records!
    };

    var _getYFromStaffNotePosition = function (staffnoteposition) {
        var halfNoteHeight = _noteHeight / 2;
        return (23 - staffnoteposition) * halfNoteHeight; // TODO: Hackathon!!!!
    };

    // returns the closest valid location for a stationary symbol
    var _clampStationarySymbol = function (point) {

    };

    // returns an array of bounding rectangles where each staff should be drawn
    var _bounds = function () {
        var staffList = [];
        for (var y = verticalMargin + (interStaffDistance / 2) ; y + staffHeight + (interStaffDistance / 2) + verticalMargin < viewport.height; y += interStaffDistance + staffHeight) {
            staffList.push(new utils.Rectangle(
                _horizontalMargin,
                y,
                viewport.width - (_horizontalMargin * 2),
                staffHeight
            ));
        }
        return staffList;
    };

    var _getDefaultStemDirection = function (staffNotePosition) {
        if (staffNotePosition >= 7) {
            return stem.directions.down;
        }
        else {
            return stem.directions.up;
        }
    };

    var _getDefaultNoteDirection = function (staffNotePosition) {
        if (staffNotePosition >= 7) {
            return notehead.directions.right;
        }
        else {
            return notehead.directions.left;
        }
    };

    return {
        horizontalMargin: _horizontalMargin,
        clampMovableHead: _clampMovableHead,
        clampStationarySymbol: _clampStationarySymbol,
        bounds: _bounds,
        noteHeight: _noteHeight,
        getStaffNotePositionFromY: _getStaffNotePositionFromY,
        getYFromStaffNotePosition: _getYFromStaffNotePosition,
        getDefaultStemDirection: _getDefaultStemDirection,
        getDefaultNoteDirection: _getDefaultNoteDirection,
    };
});