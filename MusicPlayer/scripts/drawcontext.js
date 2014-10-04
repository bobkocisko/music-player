define(function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    var _get = function () {
        return ctx;
    }

    return {
        get: _get
    };
})