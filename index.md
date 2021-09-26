# diffpatchjson

Minimalistic JavaScript module/package for **diff**ing & **patch**ing **JSON** values, aiming to minimize the footprint of the deltas/diffs.


## Comparison with *jsondiffpatch*

*diffpatchjson* is similar to *[jsondiffpatch](https://github.com/benjamine/jsondiffpatch)*, the most popular JavaScript library for diffing & patching JSON values. If you're coming here wondering how *diffpatchjson* compares to *jsondiffpatch* and which one you should use, I believe the short version is:

**Choose *diffpatchjson* if you're trying to minimize the footprint of the deltas/diffs, and all you need is the core diff/patch functionality.**

The biggest difference between *diffpatchjson* and *jsondiffpatch* is the format of the diffs/deltas (=the data format that describes the difference between the old and the new JSON value): The diffs/deltas produced by *diffpatchjson* will almost always be shorter (after conversion to a JSON string) than those produced by *jsondiffpatch*.

That's because *jsondiffpatch*'s delta format was developed with reversibility in mind, which means that it is possible to compute the inverse of a delta created by *jsondiffpatch* and *unpatch* a *patch*ed JSON value using the same delta/diff.

*diffpatchjson*'s delta format on the other hand is not reversible/invertable, which allows for a number of optimizations that can significantly reduce the footprint of the diffs/deltas, for example:

- When *jsondiffpatch* modifies a value, both the old and the new value are stored in the delta. *diffpatchjson* only stores the new value in such cases.
- When *jsondiffpatch* changes an object, the full names/keys of the changed properties are stored in the delta as strings. *diffpatchjson* on the other hand uses shorter integer indexes to identify the property, except when a new property is being added.

There should be only one situation when the deltas/diffs produced by *diffpatchjson* are longer than those produced by *jsondiffpatch*: when creating deltas/diffs for long strings with rather small changes. *diffpatchjson* (currently?) does not produce optimized diffs for strings.


### Comparison table

|                                         | *diffpatchjson* | *jsondiffpatch* |
| --------------------------------------- | --------------- | ----------------|
| Direct dependencies                     | 0               | 2               |
| Total (direct + indirect) dependencies  | 0               | 8               |
| Code size (including dependencies)      | 17.2 kB         | 155.9 kB        |
| Code size after minification            | 3.3 kB          | 54.6 kB         |
| Code size after minification + gzipping | 1.6 kB          | 16.0 kB         |
| Reversible deltas / unpatching          | no              | yes             |
| String diffs                            | no              | yes             |
| Output formatters (HTML, ANSI etc.)     | no              | yes             |
| Plugins                                 | no              | yes             |


### Test page

There is a small [test page](test_page/) where you can enter two JSON values and see the deltas/diffs produced by both *diffpatchjson* and *jsondiffpatch*.


## Installation

```sh
npm install diffpatchjson
```

## Usage

### Usage example

```JavaScript
import { are_deep_equal, diff, patch } from 'diffpatchjson';

let old_value, new_value, patched_value, delta;

old_value = {
  "name": {
		"first": "Max",
		"last": "Masterman"
  },
  "date of birth": "1984-03-23"
};
new_value = {
  "name": {
		"first": "Max",
		"last": "Mustermann"
  },
  "date of birth": "1984-03-23"
};

delta = diff(old_value, new_value);

console.log(JSON.stringify(delta));
// Prints: [-2,[-2,["Mustermann"]]]

patched_value = patch(new_value, delta);

console.log(are_deep_equal(new_value, patched_value));
// Prints: true
```
