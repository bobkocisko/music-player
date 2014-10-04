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

    var _pointInRect = function (p, r) {
        return !(p.x > r.right() ||
                 p.x < r.left ||
                 p.y > r.bottom() ||
                 p.y < r.top);
    }

    return {
        Rectangle: _Rectangle,
        Size: _Size,
        rectsIntersect: _rectsIntersect,
        getIntersection: _getIntersection,
        pointInRect: _pointInRect
    };

});