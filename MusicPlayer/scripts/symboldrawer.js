define(
    ['drawcontext',
    'noteheaddrawer',
    'flagdrawer',
    'structure/symbol',
    'staffarranger',
    'structure/stem',
    'structure/notehead',
    'utils'],
    function (
    drawcontext,
    noteheaddrawer,
    flagdrawer,
    symbol,
    staffarranger,
    stem,
    notehead,
    utils) {

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
                        var stemend = new utils.Point(stemstart.x, stemstart.y + _stemHeight);
                    }
                    else {  // stem up
                        var stemend = new utils.Point(stemstart.x, stemstart.y - _stemHeight);
                    }
                    ctx.lineTo(stemend.x, stemend.y);
                    ctx.strokeStyle = drawcolor || drawcontext.getColor(isPreview);
                    ctx.lineWidth = _stemWidth;
                    ctx.stroke();

                    if (asymbol.flagcount > 0) {
                        flagdrawer.draw(stemend, isPreview, stemdirection);
                    }
                }
            }
        };

        var _clear = function (asymbol, centerPoint) {
            var clearRect = _getDrawRect(asymbol, centerPoint);
            // adjust clear area so that the pixels affected by antialiasing will be properly cleaned up
            clearRect.left -= 2;
            clearRect.top -= 2;
            clearRect.width += 4;
            clearRect.height += 4;
            ctx.clearRect(clearRect.left, clearRect.top, clearRect.width, clearRect.height);
            return clearRect;
        };

        var _getDrawRect = function (asymbol, centerPoint) {
            if (asymbol.notehead) {
                var drawrect = noteheaddrawer.getDrawRect(asymbol.notehead.visualtype, centerPoint);

                if (asymbol.notehead.isdotted) {
                    var dotendx = drawrect.right() + _spaceBeforeDotCenter + (_dotHeight / 2);
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
                        stemend.x -= _stemWidth / 2;
                    } else {  // left
                        stemend.x += _stemWidth / 2;
                    }
                    drawrect = utils.rectUnionPoint(drawrect, stemend);

                    if (asymbol.flagcount > 0) {
                        var flagrect = flagdrawer.getDrawRect(stemend, stemdirection);
                        drawrect = utils.rectUnionRect(drawrect, flagrect);
                    }
                }
                return drawrect;
            }
        };

        return {
            draw: _draw,
            clear: _clear,
            getDrawRect: _getDrawRect,
        };
    });