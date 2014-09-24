// Source: https://typescript.codeplex.com/SourceControl/latest#src/compiler/core/integerUtilities.ts
///<reference path='../references.ts' />
var KittWeb;
(function (KittWeb) {
    (function (IntegerUtilities) {
        function integerDivide(numerator, denominator) {
            return (numerator / denominator) >> 0;
        }
        IntegerUtilities.integerDivide = integerDivide;

        function integerMultiplyLow32Bits(n1, n2) {
            var n1Low16 = n1 & 0x0000ffff;
            var n1High16 = n1 >>> 16;

            var n2Low16 = n2 & 0x0000ffff;
            var n2High16 = n2 >>> 16;

            var resultLow32 = (((n1 & 0xffff0000) * n2) >>> 0) + (((n1 & 0x0000ffff) * n2) >>> 0) >>> 0;
            return resultLow32;
        }
        IntegerUtilities.integerMultiplyLow32Bits = integerMultiplyLow32Bits;

        function integerMultiplyHigh32Bits(n1, n2) {
            var n1Low16 = n1 & 0x0000ffff;
            var n1High16 = n1 >>> 16;

            var n2Low16 = n2 & 0x0000ffff;
            var n2High16 = n2 >>> 16;

            var resultHigh32 = n1High16 * n2High16 + ((((n1Low16 * n2Low16) >>> 17) + n1Low16 * n2High16) >>> 15);
            return resultHigh32;
        }
        IntegerUtilities.integerMultiplyHigh32Bits = integerMultiplyHigh32Bits;

        function isInteger(text) {
            return /^[0-9]+$/.test(text);
        }
        IntegerUtilities.isInteger = isInteger;

        function isHexInteger(text) {
            return /^0(x|X)[0-9a-fA-F]+$/.test(text);
        }
        IntegerUtilities.isHexInteger = isHexInteger;
    })(KittWeb.IntegerUtilities || (KittWeb.IntegerUtilities = {}));
    var IntegerUtilities = KittWeb.IntegerUtilities;
})(KittWeb || (KittWeb = {}));
//# sourceMappingURL=integerUtilities.js.map
