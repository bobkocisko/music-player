define(['drawcontext', 'staffarranger','utils'], function (drawcontext, staffarranger, utils) {
    var ctx = drawcontext.get();

    var _innerRadius = staffarranger.noteHeight * 2;
    var _outerRadius = _innerRadius + staffarranger.noteHeight * 4;
    var _centerPointXOffset = -staffarranger.noteHeight / 2;
    var _buttonColors = drawcontext.getEditButtonColors();
    var optionstatuses = {
        off: "off",
        on: "on",
    }

    var _Selector = function () {
        this.options = [];
    };

    _Selector.prototype = function () {
        var _addOption = function (option, drawer) {
            this.options.push(
                {
                    option: option,
                    drawer: drawer,
                    status: optionstatuses.off
                });
        };

        var _draw = function (centerPoint) {
            var arcSize = Math.PI / this.options.length;
            ctx.save();
            ctx.translate(centerPoint.x, centerPoint.y);
            ctx.rotate(-Math.PI / 2);
            for (var i = 0; i < this.options.length; i++) {
                var option = this.options[i];
                ctx.beginPath();
                ctx.fillStyle = _buttonColors[option.status];
                ctx.arc(0, 0, _outerRadius, arcSize * i, arcSize * (i + 1));
                ctx.arc(0, 0, _innerRadius,  arcSize * (i + 1), arcSize * i, true); // cut-out from the outer when all is filled
                ctx.fill();
            }
            ctx.restore();
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
            ctx.clearRect(clearRect.left, clearRect.top, clearRect.width, clearRect.height);
            return clearRect;
        };

        var _updateOptionStatuses = function (centerPoint, point) {
            // Updates the statuses of each option depending upon whether that option is under the specified point.
            // Returns whether there are any status changes as a result of this update.
            var pointAngle = Math.atan2(point.y - centerPoint.y, point.x - centerPoint.x) + (Math.PI / 2);
            var pointPercent = pointAngle / Math.PI;
            var optionUnderPoint = Math.floor(pointPercent * this.options.length);
            if (optionUnderPoint < 0) {
                return this.clearOptionStatuses();
            }
            var changes = false;
            for (var i = 0; i < this.options.length; i++) {
                var option = this.options[i];
                if (i == optionUnderPoint) {
                    var currentStatus = optionstatuses.on;
                }
                else {
                    var currentStatus = optionstatuses.off;
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
                if (this.options[i].status == optionstatuses.on) changes = true;
                this.options[i].status = optionstatuses.off;
            }
            return changes;
        };

        return {
            addOption: _addOption,
            draw: _draw,
            clear: _clear,
            getDrawRect: _getDrawRect,
            updateOptionStatuses: _updateOptionStatuses,
            clearOptionStatuses: _clearOptionStatuses,
        };
    }();

    return {
        Selector: _Selector,
    };
});