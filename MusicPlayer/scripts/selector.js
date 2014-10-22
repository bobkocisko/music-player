define(['drawcontext', 'staffarranger', 'utils'], function (drawcontext, staffarranger, utils) {
    var ctx = drawcontext.get();

    var _innerRadius = staffarranger.noteHeight * 2;
    var _outerRadius = _innerRadius + staffarranger.noteHeight * 4;
    var _centerPointXOffset = -staffarranger.noteHeight / 2;
    var _buttonColors = drawcontext.getEditButtonColors();
    var _symbolDrawMult = 0.5;
    var _optionstatuses = {
        off: "off",
        on: "on",
    };
    var _halfPI = Math.PI / 2;

    var _Selector = function () {
        this.options = [];
    };

    _Selector.prototype = function () {
        var _addOption = function (option, drawer, status) {
            var aStatus = typeof status !== 'undefined' ? status : _optionstatuses.off;
            this.options.push(
                {
                    option: option,
                    drawer: drawer,
                    status: aStatus,
                });
        };

        var _draw = function (centerPoint) {
            var arcSize = Math.PI / this.options.length;
            for (var i = 0; i < this.options.length; i++) {
                ctx.save();
                ctx.translate(centerPoint.x, centerPoint.y);
                ctx.scale(1, -1); // flip vertically so that the arc angles match typical geometry (for sanity!)
                var option = this.options[i];
                ctx.beginPath();
                ctx.fillStyle = _buttonColors[option.status];
                var arcBegin = _halfPI - arcSize * i;
                var arcEnd = _halfPI - arcSize * (i + 1);
                ctx.arc(0, 0, _outerRadius, arcBegin, arcEnd, true); // true now means clockwise because we flipped the ctx!
                ctx.arc(0, 0, _innerRadius, arcEnd, arcBegin); // cut-out from the outer when all is filled
                ctx.fill();
                ctx.restore();

                var edgeAngle = (arcBegin + arcEnd) / 2;
                var edgeAnchor = _identifyEdgeAnchor(centerPoint, edgeAngle);
                var optionUnitRect = option.drawer.getDrawRect(option.option, new utils.Point(0, 0), _symbolDrawMult);
                var optionDrawLocation = utils.getRectUnitLocationFromAngleAnchor(optionUnitRect, edgeAnchor, edgeAngle);
                option.drawer.draw(option.option, optionDrawLocation, true, _symbolDrawMult);
            }
        };

        var _identifyEdgeAnchor = function (centerPoint, edgeAngle) {
            return new utils.Point(
                centerPoint.x + Math.cos(edgeAngle) * _outerRadius,
                centerPoint.y - Math.sin(edgeAngle) * _outerRadius
                );
        };

        var _getDrawRect = function (centerPoint) {
            return new utils.Rectangle(
                centerPoint.x + _centerPointXOffset,
                centerPoint.y - _outerRadius,
                _outerRadius - _centerPointXOffset,
                _outerRadius * 2
                );
        };

        var _clear = function (centerPoint) {
            var clearRect = _getDrawRect(centerPoint);
            // adjust clear area so that the pixels affected by antialiasing will be properly cleaned up
            clearRect.left -= 2;
            clearRect.top -= 2;
            clearRect.width += 4;
            clearRect.height += 4;
            ctx.clearRect(clearRect.left, clearRect.top, clearRect.width, clearRect.height);
            return clearRect;
        };

        var _updateOptionStatuses = function (centerPoint, point) {
            // Updates the statuses of each option depending upon whether that option is under the specified point.
            // Returns whether there are any status changes as a result of this update.
            var pointAngle = Math.atan2(point.y - centerPoint.y, point.x - centerPoint.x) + _halfPI;
            var pointPercent = pointAngle / Math.PI;
            var optionUnderPoint = Math.floor(pointPercent * this.options.length);
            var distance = Math.sqrt(Math.pow(point.x - centerPoint.x, 2) + Math.pow(point.y - centerPoint.y, 2));
            if (distance < _innerRadius ||
                distance > _outerRadius ||
                optionUnderPoint < 0 ||
                optionUnderPoint >= this.options.length) {
                // The point does not fall anywhere on this selector, so no status changes will be made
                return false;
            }
            var changes = false;
            for (var i = 0; i < this.options.length; i++) {
                var option = this.options[i];
                if (i == optionUnderPoint) {
                    var currentStatus = _optionstatuses.on;
                }
                else {
                    var currentStatus = _optionstatuses.off;
                }
                if (option.status != currentStatus) {
                    changes = true;
                    option.status = currentStatus;
                }
            }
            return changes;
        };

        var _clearOptionStatuses = function () {
            // Returns whether there are any status changes as a result of this update.
            var changes = false;
            for (var i in this.options) {
                if (this.options[i].status == _optionstatuses.on) changes = true;
                this.options[i].status = _optionstatuses.off;
            }
            return changes;
        };

        var _getSelectedOption = function () {
            // returns the first of the selected options, or undefined if there are none.
            for (var i in this.options) {
                if (this.options[i].status == _optionstatuses.on) {
                    return this.options[i].option;
                }
            }
            return;
        };

        return {
            addOption: _addOption,
            draw: _draw,
            clear: _clear,
            getDrawRect: _getDrawRect,
            updateOptionStatuses: _updateOptionStatuses,
            clearOptionStatuses: _clearOptionStatuses,
            getSelectedOption: _getSelectedOption,
        };
    }();

    return {
        optionStatuses: _optionstatuses,
        Selector: _Selector,
    };
});