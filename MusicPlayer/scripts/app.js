define(['backgrounddrawer',
    'viewport',
    'utils',
    'symboldrawer',
    'staffarranger',
    'relativearranger',
    'playbacktoolbar',
    'staffinterpreter',
    'structure/staff',
    'structure/staffsection',
    'structure/notehead',
    'structure/symbol',
    'structure/stem',
    'selector',
    'symboladder',
],
    function (backgrounddrawer,
        viewport,
        utils,
        symboldrawer,
        staffarranger,
        relativearranger,
        playbacktoolbar,
        staffinterpreter,
        staff,
        staffsection,
        notehead,
        symbol,
        stem,
        selector,
        symboladder
        ) {
        'use strict';

        var astaff = new staff.Staff(new staffsection.StaffSection());  // Use the default values for StaffSection

        var asymboladder = new symboladder.Adder(astaff);

        var canvas = document.getElementById("myCanvas");
        canvas.onmousemove = function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            var bbox = canvas.getBoundingClientRect();
            var mouseX = e.clientX - bbox.left * (canvas.width / bbox.width);
            var mouseY = e.clientY - bbox.top * (canvas.height / bbox.height);
            var mousePos = { x: mouseX, y: mouseY };

            asymboladder.mouseMoved(mousePos);
        };

        canvas.onmousedown = function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            var bbox = canvas.getBoundingClientRect();
            var mouseX = e.clientX - bbox.left * (canvas.width / bbox.width);
            var mouseY = e.clientY - bbox.top * (canvas.height / bbox.height);
            var mousePos = { x: mouseX, y: mouseY };

            if (playbacktoolbar.highLevelHitTest(mousePos)) {
                // assume that it's the play button because it's the only one in the toolbar
                staffinterpreter.playStaff(astaff);

            } else {
                asymboladder.mouseDown(mousePos);
            }


        };

        canvas.onmouseup = function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            var bbox = canvas.getBoundingClientRect();
            var mouseX = e.clientX - bbox.left * (canvas.width / bbox.width);
            var mouseY = e.clientY - bbox.top * (canvas.height / bbox.height);
            var mousePos = { x: mouseX, y: mouseY };

            asymboladder.mouseUp(mousePos);
        };

        var backgroundrect = new utils.Rectangle(
            0,
            0,
            viewport.width,
            viewport.height);

        backgrounddrawer.draw(backgroundrect);
        //drawIntersectingSymbols(backgroundrect);

        playbacktoolbar.drawButtons();

        function step(timestamp) {

            requestAnimationFrame(step);
        };

        //requestAnimationFrame(step);
    });