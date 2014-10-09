define(function () {
    'use strict';

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    var _get = function () {
        return ctx;
    };

    var _getColor = function (isPreview) {
        if (isPreview) {
            return "rgba(170,170,170, 0.75)";
        }
        else {
            return "#000000";
        }
    };

    var _getEditButtonColors = function () {
        return {
            off: "rgba(200,200,255, 0.5)",
            on: "rgba(50,50,170, 1)",
            //pressed: "rgba(220,0,0, 1)",
            //disabled: "rgba(170,170,170, 0.75)",
            };
    }

    return {
        getColor: _getColor,
        getEditButtonColors: _getEditButtonColors,
        get: _get,
    };
})