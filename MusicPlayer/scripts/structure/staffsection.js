define([], function () {
    var _StaffSection = function (clef, keysignature, timesignature) {
        clef = typeof clef !== 'undefined' ? clef : 'G';
        keysignature = typeof keysignature !== 'undefined' ? keysignature : 'C'; // TODO: perhaps create a class for this which defines the name of the key as well as the actual accidentals?
        timesignature = typeof timesignature !== 'undefined' ? timesignature : 'Common Time'; // TODO: create some options in another class or here??

        this.clef = clef;
        this.keysignature = keysignature;
        this.timesignature = timesignature;
    };

    return {
        StaffSection: _StaffSection,
    }
});