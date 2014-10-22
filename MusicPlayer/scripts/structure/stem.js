define([], function () {
    var _Stem = function (direction) {
        this.direction = direction;
        this.noteheads = [];
    };

    _Stem.prototype = function () {
        var _clone = function () {
            var newStem = new _Stem(this.direction);
            return newStem;
        };

        var _addNotehead = function (notehead) {
            this.noteheads.push(notehead);
        };

        var _removeNotehead = function (notehead) {
            var index = this.noteheads.indexOf(notehead);
            if (index > -1) {
                this.noteheads.splice(index, 1);
            }
        }

        return {
            addNotehead: _addNotehead,
            removeNotehead: _removeNotehead,
            clone: _clone,
        };
    }();

    return {
        Stem: _Stem,
        directions: {
            up: "up",
            down: "down",
        },
    };
});