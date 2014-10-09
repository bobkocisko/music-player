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

        var _dotHeight = 1 / 2;
        var _halfDotHeight = _dotHeight / 2;
        var _spaceBeforeDotCenter = 1 / 2;
        var _stemHeight = 3;
        var _stemWidth = 0.0882;
        var _halfStemWidth = _stemWidth;

        var _draw = function (asymbol, centerPoint, isPreview, multiplier) {
            multiplier = typeof multiplier !== 'undefined' ? multiplier : 1;
            var noteHeight = staffarranger.noteHeight * multiplier;

            if (asymbol.notehead) {
                noteheaddrawer.draw(asymbol.notehead.visualtype, centerPoint, isPreview, multiplier);
                var headrect = noteheaddrawer.getDrawRect(asymbol.notehead.visualtype, centerPoint, multiplier);

                if (asymbol.notehead.isdotted) {
                    var halfDotHeight = noteHeight * _halfDotHeight;
                    var spaceBeforeDotCenter = noteHeight * _spaceBeforeDotCenter;
                    var drawcolor = drawcontext.getColor(isPreview);
                    var dotx = headrect.right() + spaceBeforeDotCenter;
                    var doty = headrect.top + halfDotHeight; // align dot to the top of the note
                    ctx.beginPath();
                    ctx.arc(dotx, doty, halfDotHeight, 2 * Math.PI, 0);
                    ctx.fillStyle = drawcolor;
                    ctx.fill();
                }

                if (asymbol.stem) {
                    var stemHeight = noteHeight * _stemHeight;
                    var stemWidth = noteHeight * _stemWidth;
                    var staffNotePosition = staffarranger.getStaffNotePositionFromY(centerPoint.y);
                    var notedirection = asymbol.notehead.direction;
                    if (!notedirection) notedirection = staffarranger.getDefaultNoteDirection(staffNotePosition);
                    var stemvector = noteheaddrawer.getStemAnchorVectors(asymbol.notehead.visualtype, multiplier)[notedirection];
                    var stemstart = utils.pointPlusVector(centerPoint, stemvector);
                    ctx.beginPath();
                    ctx.moveTo(stemstart.x, stemstart.y);
                    var stemdirection = asymbol.stem.direction;
                    if (!stemdirection) {
                        stemdirection = staffarranger.getDefaultStemDirection(staffNotePosition);
                    }
                    if (stemdirection == stem.directions.down) {
                        var stemend = new utils.Point(stemstart.x, stemstart.y + stemHeight);
                    }
                    else {  // stem up
                        var stemend = new utils.Point(stemstart.x, stemstart.y - stemHeight);
                    }
                    ctx.lineTo(stemend.x, stemend.y);
                    ctx.strokeStyle = drawcolor || drawcontext.getColor(isPreview);
                    ctx.lineWidth = stemWidth;
                    ctx.stroke();

                    if (asymbol.flagcount > 0) {
                        flagdrawer.draw(stemend, isPreview, stemdirection, multiplier);
                    }
                }
            }
        };

        var _drawInsideRect = function(asymbol, boundingRect, isPreview) {
            var drawUnitRect = _getDrawRect(asymbol, new utils.Point(0, 0));
            var dimension = utils.getConstrainingDimension(drawUnitRect, boundingRect);
            if (dimension == utils.dimensions.horizontal) {
                var multiplier = boundingRect.width / drawUnitRect.width;
            } else {
                var multiplier = boundingRect.height / drawUnitRect.height;
            }
            var centerX = boundingRect.left - (drawUnitRect.left * multiplier);
            var centerY = boundingRect.top - (drawUnitRect.top * multiplier);
            _draw(asymbol, new utils.Point(centerX, centerY), isPreview, multiplier);
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

        var _getDrawRect = function (asymbol, centerPoint, multiplier) {
            multiplier = typeof multiplier !== 'undefined' ? multiplier : 1;
            var noteHeight = staffarranger.noteHeight * multiplier;

            if (asymbol.notehead) {
                var drawrect = noteheaddrawer.getDrawRect(asymbol.notehead.visualtype, centerPoint, multiplier);

                if (asymbol.notehead.isdotted) {
                    var halfDotHeight = noteHeight * _halfDotHeight;
                    var spaceBeforeDotCenter = noteHeight * _spaceBeforeDotCenter;
                    var dotendx = drawrect.right() + spaceBeforeDotCenter + halfDotHeight;
                    var dotendy = drawrect.top + halfDotHeight; // align dot to the top of the note
                    var pointend = new utils.Point(dotendx, dotendy);
                    drawrect = utils.rectUnionPoint(drawrect, pointend);
                }

                if (asymbol.stem) {
                    var stemHeight = noteHeight * _stemHeight;
                    var halfStemWidth = noteHeight * _halfStemWidth;
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
                        var stemend = new utils.Point(stemstart.x, stemstart.y + stemHeight);
                    }
                    else {  // stem up
                        var stemend = new utils.Point(stemstart.x, stemstart.y - stemHeight);
                    }
                    if (notedirection == notehead.directions.right) {
                        stemend.x -= halfStemWidth;
                    } else {  // left
                        stemend.x += halfStemWidth;
                    }
                    drawrect = utils.rectUnionPoint(drawrect, stemend);

                    if (asymbol.flagcount > 0) {
                        var flagrect = flagdrawer.getDrawRect(stemend, stemdirection, multiplier);
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
            drawInsideRect: _drawInsideRect,
        };
    });