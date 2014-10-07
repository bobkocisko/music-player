define(function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    var _get = function () {
        return ctx;
    }

    var _getColor = function (isPreview) {
        if (isPreview) {
            return "rgba(170,170,170, 0.75)";
        }
        else {
            return "#000000";
        }
    }

    return {
        getColor: _getColor,
        get: _get
    };
})