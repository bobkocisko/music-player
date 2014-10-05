define(function () {
    var _Rectangle = function (left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    };

    _Rectangle.prototype = function () {
        var right = function () {
            return this.left + this.width;
        };
        var bottom = function () {
            return this.top + this.height;
        };

        return {
            right: right,
            bottom: bottom
        }
    }();

    var _Size = function (width, height) {
        this.width = width;
        this.height = height;
    };

    var _Range = function (start, end) {
        this.start = start;
        this.end = end;
    };

    var _rectsIntersect = function (r1, r2) {
        return !(r2.left > r1.right() ||
                 r2.right() < r1.left ||
                 r2.top > r1.bottom() ||
                 r2.bottom() < r1.top);
    };

    var _getIntersection = function (r1, r2) {
        var left = Math.max(r1.left, r2.left);
        var top = Math.max(r1.top, r2.top);
        return new _Rectangle(
            left,
            top,
            Math.min(r1.right(), r2.right()) - left,
            Math.min(r1.bottom(), r2.bottom()) - top
            );
    };

    var _rangesIntersect = function (range1, range2) {
        return !(range2.start > range1.end ||
                 range2.end < range1.start);
    };

    var _clampOutsideRange = function (value, range) {
        // Returns a value that is the left or right bound of the range if the value falls inside the range
        var rangeMidpoint = (range.end + range.start) / 2;
        if (value > range.start && value <= rangeMidpoint) {
            return range.start;
        }
        else if (value < range.end && value > rangeMidpoint) {
            return range.end;
        }
        return value;
    };

    var _pointInRect = function (p, r) {
        return !(p.x > r.right() ||
                 p.x < r.left ||
                 p.y > r.bottom() ||
                 p.y < r.top);
    }

    return {
        Rectangle: _Rectangle,
        Size: _Size,
        Range: _Range,
        rectsIntersect: _rectsIntersect,
        getIntersection: _getIntersection,
        pointInRect: _pointInRect,
        rangesIntersect: _rangesIntersect,
        clampOutsideRange: _clampOutsideRange,
    };

});