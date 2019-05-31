/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:test@example.com">UH DaViM</a>
 * @version 1.0
 */

/** @namespace */
var util = {
    /**
     * Repeat <tt>str</tt> several times.
     * @param {string} str The string to repeat.
     * @param {number} [times=1] How many times to repeat the string.
     * @returns {string}
     */
    repeat: function (str, times) {
        if (times === undefined || times < 1) {
            times = 1;
        }
        return new Array(times + 1).join(str);
    }
};

