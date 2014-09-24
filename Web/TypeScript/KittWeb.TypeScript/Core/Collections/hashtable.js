// Source: https://typescript.codeplex.com/SourceControl/latest#src/compiler/core/hashTable.ts
///<reference path='../references.ts' />
var KittWeb;
(function (KittWeb) {
    (function (Collections) {
        Collections.DefaultHashTableCapacity = 1024;

        var HashTableEntry = (function () {
            function HashTableEntry(Key, Value, HashCode, Next) {
                this.Key = Key;
                this.Value = Value;
                this.HashCode = HashCode;
                this.Next = Next;
            }
            return HashTableEntry;
        })();

        var HashTable = (function () {
            function HashTable(capacity, hash) {
                this.hash = hash;
                this.count = 0;
                var size = KittWeb.Hash.getPrime(capacity);
                this.entries = KittWeb.ArrayUtilities.createArray(size, null);
            }
            // Maps 'key' to 'value' in this table.  Does not throw if 'key' is already in the table.
            HashTable.prototype.set = function (key, value) {
                this.addOrSet(key, value, false);
            };

            // Maps 'key' to 'value' in this table.  Throws if 'key' is already in the table.
            HashTable.prototype.add = function (key, value) {
                this.addOrSet(key, value, true);
            };

            HashTable.prototype.containsKey = function (key) {
                var hashCode = this.computeHashCode(key);
                var entry = this.findEntry(key, hashCode);
                return entry !== null;
            };

            HashTable.prototype.get = function (key) {
                var hashCode = this.computeHashCode(key);
                var entry = this.findEntry(key, hashCode);

                return entry === null ? null : entry.Value;
            };

            HashTable.prototype.computeHashCode = function (key) {
                var hashCode = this.hash === null ? key.hashCode : this.hash(key);

                hashCode = hashCode & 0x7FFFFFFF;
                KittWeb.Debug.assert(hashCode >= 0);

                return hashCode;
            };

            HashTable.prototype.addOrSet = function (key, value, throwOnExistingEntry) {
                // Compute the hash for this key.  Also ensure that it's non negative.
                var hashCode = this.computeHashCode(key);

                var entry = this.findEntry(key, hashCode);
                if (entry !== null) {
                    if (throwOnExistingEntry) {
                        throw KittWeb.Errors.invalidArgument('key', "Key was already in table.");
                    }

                    entry.Key = key;
                    entry.Value = value;
                    return;
                }

                return this.addEntry(key, value, hashCode);
            };

            HashTable.prototype.findEntry = function (key, hashCode) {
                for (var e = this.entries[hashCode % this.entries.length]; e !== null; e = e.Next) {
                    if (e.HashCode === hashCode && key === e.Key) {
                        return e;
                    }
                }

                return null;
            };

            HashTable.prototype.addEntry = function (key, value, hashCode) {
                var index = hashCode % this.entries.length;

                var e = new HashTableEntry(key, value, hashCode, this.entries[index]);

                this.entries[index] = e;

                if (this.count >= (this.entries.length / 2)) {
                    this.grow();
                }

                this.count++;
                return e.Key;
            };

            //private dumpStats() {
            //    var standardOut = Environment.standardOut;
            //    standardOut.WriteLine("----------------------")
            //    standardOut.WriteLine("Hash table stats");
            //    standardOut.WriteLine("Count            : " + this.count);
            //    standardOut.WriteLine("Entries Length   : " + this.entries.length);
            //    var occupiedSlots = 0;
            //    for (var i = 0; i < this.entries.length; i++) {
            //        if (this.entries[i] !== null) {
            //            occupiedSlots++;
            //        }
            //    }
            //    standardOut.WriteLine("Occupied slots   : " + occupiedSlots);
            //    standardOut.WriteLine("Avg Length/Slot  : " + (this.count / occupiedSlots));
            //    standardOut.WriteLine("----------------------");
            //}
            HashTable.prototype.grow = function () {
                //this.dumpStats();
                var newSize = KittWeb.Hash.expandPrime(this.entries.length);

                var oldEntries = this.entries;
                var newEntries = KittWeb.ArrayUtilities.createArray(newSize, null);

                this.entries = newEntries;

                for (var i = 0; i < oldEntries.length; i++) {
                    var e = oldEntries[i];

                    while (e !== null) {
                        var newIndex = e.HashCode % newSize;
                        var tmp = e.Next;
                        e.Next = newEntries[newIndex];
                        newEntries[newIndex] = e;
                        e = tmp;
                    }
                }
                //this.dumpStats();
            };
            return HashTable;
        })();
        Collections.HashTable = HashTable;

        function createHashTable(capacity, hash) {
            if (typeof capacity === "undefined") { capacity = Collections.DefaultHashTableCapacity; }
            if (typeof hash === "undefined") { hash = null; }
            return new HashTable(capacity, hash);
        }
        Collections.createHashTable = createHashTable;

        var currentHashCode = 1;
        function identityHashCode(value) {
            if (value.__hash === undefined) {
                value.__hash = currentHashCode;
                currentHashCode++;
            }

            return value.__hash;
        }
        Collections.identityHashCode = identityHashCode;
    })(KittWeb.Collections || (KittWeb.Collections = {}));
    var Collections = KittWeb.Collections;
})(KittWeb || (KittWeb = {}));
//# sourceMappingURL=hashtable.js.map
