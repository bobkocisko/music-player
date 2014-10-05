define([], function () {
    var _Staff = function (startingstaffsection) {
        this.startingstaffsection = startingstaffsection;
        this.symbols = [];
        this.noteheads = [];
        this.stems = [];
    };

    _Staff.prototype = function () {
        var addSymbol = function (symbol) {
            this.symbols.push(symbol);
        };

        var insertSymbol = function (beforeSymbol, newSymbol) {
            var beforeIndex = this.symbols.indexOf(beforeSymbol);
            if (beforeIndex > -1) {
                this.symbols.splice(beforeIndex, 0, newSymbol);
            }
        }

        var removeSymbol = function (symbol) {
            var index = this.symbols.indexOf(symbol);
            if (index > -1) {
                this.symbols.splice(index, 1);
            }
        };

        var addNotehead = function (notehead) {
            this.noteheads.push(notehead);
        };

        var removeNotehead = function (notehead) {
            var index = this.noteheads.indexOf(notehead);
            if (index > -1) {
                this.noteheads.splice(index, 1);
            }
        };

        var addStem = function (stem) {
            this.stems.push(stem);
        };

        var removeStem = function (stem) {
            var index = this.stems.indexOf(stem);
            if (index > -1) {
                this.stems.splice(index, 1);
            }
        };

        return {
            addSymbol: addSymbol,
            insertSymbol: insertSymbol,
            removeSymbol: removeSymbol,
            addNotehead: addNotehead,
            removeNotehead: removeNotehead,
            addStem: addStem,
            removeStem: removeStem,
        };
    }();

    return {
        Staff: _Staff,
    };
});