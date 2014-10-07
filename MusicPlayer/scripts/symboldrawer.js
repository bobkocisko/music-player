define(['drawcontext', 'noteheaddrawer', 'structure/symbol', 'staffarranger', 'structure/stem', 'structure/notehead', 'utils'], function (drawcontext, noteheaddrawer, symbol, staffarranger, stem, notehead, utils) {

    var ctx = drawcontext.get();

    var _stemHeight = staffarranger.noteHeight * 3;
    var _stemWidth = staffarranger.noteHeight * 0.0882;
    var _spaceBeforeDotCenter = staffarranger.noteHeight / 2;
    var _dotHeight = staffarranger.noteHeight / 2;

    var _draw = function (asymbol, centerPoint, isPreview) {
        if (asymbol.notehead) {
            noteheaddrawer.draw(asymbol.notehead.visualtype, centerPoint, isPreview);
            var headrect = noteheaddrawer.getDrawRect(asymbol.notehead.visualtype, centerPoint);
            if (asymbol.notehead.isdotted) {
                var drawcolor = drawcontext.getColor(isPreview);
                var dotx = headrect.right() + _spaceBeforeDotCenter;
                var doty = headrect.top + (_dotHeight / 2); // align dot to the top of the note
                ctx.beginPath();
                ctx.arc(dotx, doty, _dotHeight / 2, 2 * Math.PI, 0);
                ctx.fillStyle = drawcolor;
                ctx.fill();
            }
            if (asymbol.stem) {
                var staffNotePosition = staffarranger.getStaffNotePositionFromY(centerPoint.y);
                var notedirection = asymbol.notehead.direction;
                if (!notedirection) notedirection = staffarranger.getDefaultNoteDirection(staffNotePosition);
                var stemvector = noteheaddrawer.getStemAnchorVectors(asymbol.notehead.visualtype)[notedirection];
                var stemstart = utils.pointPlusVector(centerPoint, stemvector);
                ctx.beginPath();
                ctx.moveTo(stemstart.x, stemstart.y);
                var stemdirection = asymbol.stem.direction;
                if (!stemdirection) {
                    stemdirection = staffarranger.getDefaultStemDirection(staffNotePosition);
                }
                if (stemdirection == stem.directions.down) {
                    ctx.lineTo(stemstart.x, stemstart.y + _stemHeight);
                }
                else {  // stem up
                    ctx.lineTo(stemstart.x, stemstart.y - _stemHeight);
                }
                ctx.strokeStyle = drawcolor || drawcontext.getColor(isPreview);
                ctx.lineWidth = _stemWidth;
                ctx.stroke();
            }
        }
    };

    var _clear = function (asymbol, centerPoint) {
        var clearRect = _getDrawRect(asymbol, centerPoint);
        ctx.clearRect(clearRect.left, clearRect.top, clearRect.width, clearRect.height);
        return clearRect;
    };

    var _getDrawRect = function (asymbol, centerPoint) {
        if (asymbol.notehead) {
            var drawrect = noteheaddrawer.getDrawRect(asymbol.notehead.visualtype, centerPoint);
            if (asymbol.notehead.isdotted) {
                var dotendx = drawrect.right() + _spaceBeforeDotCenter + (_dotHeight / 2) + 2;  // 2 for antialiasing buffer
                var dotendy = drawrect.top + (_dotHeight / 2); // align dot to the top of the note
                var pointend = new utils.Point(dotendx, dotendy);
                drawrect = utils.rectUnionPoint(drawrect, pointend);
            }
            if (asymbol.stem) {
                var staffNotePosition = staffarranger.getStaffNotePositionFromY(centerPoint.y);
                var notedirection = asymbol.notehead.direction;
                if (!notedirection) notedirection = staffarranger.getDefaultNoteDirection(staffNotePosition);
                var stemvector = noteheaddrawer.getStemAnchorVectors(asymbol.notehead.visualtype)[notedirection];
                var stemstart = utils.pointPlusVector(centerPoint, stemvector);
                var stemdirection = asymbol.stem.direction;
                if (!stemdirection) {
                    stemdirection = staffarranger.getDefaultStemDirection(staffNotePosition);
                }
                if (stemdirection == stem.directions.down) {
                    var stemend = new utils.Point(stemstart.x, stemstart.y + _stemHeight);
                }
                else {  // stem up
                    var stemend = new utils.Point(stemstart.x, stemstart.y - _stemHeight);
                }
                if (notedirection == notehead.directions.right) {
                    stemend.x -= (_stemWidth / 2) - 2; // Extra 2 for antialias pixels
                } else {  // left
                    stemend.x += (_stemWidth / 2) + 2; // Extra 2 for antialias pixels
                }
                drawrect = utils.rectUnionPoint(drawrect, stemend);
            }
            return drawrect;
        }
    };

    var _getDrawSize = function (asymbol) {
        var drawRect = _getDrawRect(asymbol, new utils.Point(0, 0));
        return new utils.Size(drawRect.width, drawRect.height);
    };

    return {
        draw: _draw,
        clear: _clear,
        getDrawRect: _getDrawRect,
        getDrawSize: _getDrawSize,
    };
});