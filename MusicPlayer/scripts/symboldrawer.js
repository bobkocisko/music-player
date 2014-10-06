define(['noteheaddrawer'], function (noteheaddrawer) {

    var _draw = function (visualType, centerPoint, isPreview) {
        return noteheaddrawer.draw(visualType, centerPoint, isPreview);
    };

    var _clear = function (visualType, centerPoint) {
        return noteheaddrawer.clear(visualType, centerPoint);
    };

    var _getDrawRect = function (visualType, centerPoint) {
        return noteheaddrawer.getDrawRect(visualType, centerPoint);
    };

    var _getDrawSize = function (visualType) {
        return noteheaddrawer.getDrawSize(visualType);
    };

    return {
        draw: _draw,
        clear: _clear,
        getDrawRect: _getDrawRect,
        getDrawSize: _getDrawSize,
    };
});