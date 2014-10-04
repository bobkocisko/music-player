define([], function () {
    var _Stem = function (direction) {
        this.direction = direction;
        this.noteheads = [];
    };

    _Stem.prototype = function () {
        var addNotehead = function (notehead) {
            this.noteheads.push(notehead);
        };

        var removeNotehead = function (notehead) {
            var index = this.noteheads.indexOf(notehead);
            if (index > -1) {
                this.noteheads.splice(index, 1);
            }
        }

        return {
            addNotehead: addNotehead,
            removeNotehead: removeNotehead,
        };
    }();

    return {
        Stem: _Stem,
    };
});