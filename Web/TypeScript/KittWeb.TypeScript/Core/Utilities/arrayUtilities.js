// Partial Source: https://typescript.codeplex.com/SourceControl/latest#src/compiler/core/arrayUtilities.ts
///<reference path='../references.ts' />
var TypeScript;
(function (TypeScript) {
    var ArrayUtilities = (function () {
        function ArrayUtilities() {
        }
        ArrayUtilities.all = function (array, func) {
            for (var i = 0, n = array.length; i < n; i++) {
                if (!func(array[i])) {
                    return false;
                }
            }

            return true;
        };
        ArrayUtilities.any = function (array, func) {
            for (var i = 0, n = array.length; i < n; i++) {
                if (func(array[i])) {
                    return true;
                }
            }

            return false;
        };
        ArrayUtilities.binarySearch = function (array, value) {
            var low = 0;
            var high = array.length - 1;

            while (low <= high) {
                var middle = low + ((high - low) >> 1);
                var midValue = array[middle];

                if (midValue === value) {
                    return middle;
                } else if (midValue > value) {
                    high = middle - 1;
                } else {
                    low = middle + 1;
                }
            }

            return ~low;
        };
        ArrayUtilities.contains = function (array, value, containsFunc) {
            var f = TypeScript.ObjectUtilities.isNullOrEmptyFluid;

            if (!f) {
                return TypeScript.FunctionDefaults.contains(array, value);
            }

            if (typeof (f) === TypeScript.JsTypes.JsFunction) {
                return containsFunc(array, value);
            }
        };
        ArrayUtilities.copy = function (sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
            for (var i = 0; i < length; i++) {
                destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
            }
        };
        ArrayUtilities.createArray = function (length, defaultValue) {
            var result = new Array(length);
            for (var i = 0; i < length; i++) {
                result[i] = defaultValue;
            }

            return result;
        };

        // Gets unique element array
        ArrayUtilities.distinct = function (array, equalsFn) {
            var result = [];

            for (var i = 0, n = array.length; i < n; i++) {
                var current = array[i];
                for (var j = 0; j < result.length; j++) {
                    if (equalsFn(result[j], current)) {
                        break;
                    }
                }

                if (j === result.length) {
                    result.push(current);
                }
            }

            return result;
        };
        ArrayUtilities.first = function (array, func) {
            for (var i = 0, n = array.length; i < n; i++) {
                var value = array[i];
                if (!func || func(value, i)) {
                    return value;
                }
            }

            throw TypeScript.Errors.invalidOperation();
        };
        ArrayUtilities.firstOrDefault = function (array, func) {
            for (var i = 0, n = array.length; i < n; i++) {
                var value = array[i];
                if (func(value, i)) {
                    return value;
                }
            }

            return null;
        };
        ArrayUtilities.groupBy = function (array, func) {
            var result = {};

            for (var i = 0, n = array.length; i < n; i++) {
                var v = array[i];
                var k = func(v);

                var list = result[k] || [];
                list.push(v);
                result[k] = list;
            }

            return result;
        };
        ArrayUtilities.grow = function (array, length, defaultValue) {
            var count = length - array.length;
            for (var i = 0; i < count; i++) {
                array.push(defaultValue);
            }
        };
        ArrayUtilities.indexOf = function (array, predicate) {
            for (var i = 0, n = array.length; i < n; i++) {
                if (predicate(array[i])) {
                    return i;
                }
            }

            return -1;
        };
        ArrayUtilities.isArray = function (value) {
            return Object.prototype.toString.apply(value, []) === '[object Array]';
        };
        ArrayUtilities.last = function (array) {
            if (array.length === 0) {
                throw TypeScript.Errors.argumentOutOfRange('array');
            }

            return array[array.length - 1];
        };
        ArrayUtilities.lastOrDefault = function (array, predicate) {
            for (var i = array.length - 1; i >= 0; i--) {
                var v = array[i];
                if (predicate(v, i)) {
                    return v;
                }
            }

            return null;
        };
        ArrayUtilities.min = function (array, func) {
            // Debug.assert(array.length > 0);
            var min = func(array[0]);

            for (var i = 1; i < array.length; i++) {
                var next = func(array[i]);
                if (next < min) {
                    min = next;
                }
            }

            return min;
        };
        ArrayUtilities.max = function (array, func) {
            // Debug.assert(array.length > 0);
            var max = func(array[0]);

            for (var i = 1; i < array.length; i++) {
                var next = func(array[i]);
                if (next > max) {
                    max = next;
                }
            }

            return max;
        };
        ArrayUtilities.where = function (values, func) {
            var result = new Array();

            for (var i = 0; i < values.length; i++) {
                if (func(values[i])) {
                    result.push(values[i]);
                }
            }

            return result;
        };
        ArrayUtilities.sequenceEquals = function (array1, array2, equals) {
            if (array1 === array2) {
                return true;
            }

            if (array1 === null || array2 === null) {
                return false;
            }

            if (array1.length !== array2.length) {
                return false;
            }

            for (var i = 0, n = array1.length; i < n; i++) {
                if (!equals(array1[i], array2[i])) {
                    return false;
                }
            }

            return true;
        };
        ArrayUtilities.select = function (values, func) {
            var result = new Array(values.length);

            for (var i = 0; i < values.length; i++) {
                result[i] = func(values[i]);
            }

            return result;
        };
        ArrayUtilities.sum = function (array, func) {
            var result = 0;

            for (var i = 0, n = array.length; i < n; i++) {
                result += func(array[i]);
            }

            return result;
        };
        return ArrayUtilities;
    })();
    TypeScript.ArrayUtilities = ArrayUtilities;
})(TypeScript || (TypeScript = {}));
//# sourceMappingURL=arrayUtilities.js.map
