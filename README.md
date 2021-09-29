# diffpatchjson

A small JavaScript library for **diff**ing & **patch**ing **JSON** values, using low-footprint deltas/diffs.


## Comparison with *jsondiffpatch*

*diffpatchjson* is very similar to *[jsondiffpatch](https://github.com/benjamine/jsondiffpatch)*, the probably most popular JavaScript library for diffing & patching JSON values. So if you're reading this, there's a good chance that you are wondering how *diffpatchjson* compares to *jsondiffpatch* and which one you should choose.

The following sections describe some noteworthy differences between *diffpatchjson* and *jsondiffpatch*:


### Smaller (but non-reversible) deltas/diffs

The deltas/diffs (=the data that describes the difference between the old and the new JSON value) created by *diffpatchjson* will almost always be smaller than those created by *jsondiffpatch* (after conversion to a JSON string). That's because [*jsondiffpatch*'s delta format](https://github.com/benjamine/jsondiffpatch/blob/master/docs/deltas.md) was developed with reversibility in mind, which basically means that it is possible to *unpatch* a *patch*ed JSON value using the same delta/diff. [*diffpatchjson*'s delta format](delta_format.md) on the other hand is not reversible, which allows for a number of optimizations that can significantly reduce the footprint of the diffs/deltas, for example:

- When *jsondiffpatch* modifies a value, both the old and the new value are stored in the delta. *diffpatchjson* only stores the new value in such cases.
- When *jsondiffpatch* changes an object, the full names/keys of the changed properties are stored in the delta as strings. *diffpatchjson* uses shorter integer indexes to identify the property, except when a new property is being added.

There is a [test page](https://oyooyo.github.io/diffpatchjson/test_page/) where you can enter two JSON values and see/compare the deltas/diffs produced by both *diffpatchjson* and *jsondiffpatch*.


### Smaller code size, no dependencies

*jsondiffpatch* depends on 8 other npm packages (2 direct + 6 indirect dependencies), and the code size (including dependencies) is about 55 kB even after minification.

*diffpatchjson* on the other hand has no dependencies, and the minified code is only about 4 kB.


### Builtin object matching

*jsondiffpatch* does not automatically compare arrays/objects for equality, for example when moving arrays/objects inside an array. To overcome this limitation, the user can provide an optional `objectHash` function, but that usually requires some knowledge about the structure of the objects.

*diffpatchjson* on the other hand automatically compares objects for equality by default. Since this might be computationally expensive in some cases, one can override this default behaviour:

- by passing the [`compute_object_hash`](#compute_object_hash) option (this is pretty much the same as the `objectHash` option in *jsondiffpatch*)
- by passing the [`are_objects_equal`](#are_objects_equal) option
- by passing the [`are_equal`](#are_equal) option


### No string diffs

Unlike *jsondiffpatch*, *diffpatchjson* (currently?) does not have an optimized delta/diff for strings, so *jsondiffpatch* is not well suited for diffing long strings with small changes.


### No fancy features

*diffpatchjson* provides pretty much only the core functionality: `diff` & `patch` plus a few useful helper functions.

It does not provide "output formatters" for HTML, ANSI etc. and does not support plugins.


## Installation

```sh
npm install diffpatchjson
```


## Usage example

Here's a short example that shows how to use *diffpatchjson*:

```JavaScript
import { are_deep_equal, diff, patch } from 'diffpatchjson';

let old_value, new_value, delta, patched_value;

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
// Prints: [2,[2,["Mustermann"]]]

patched_value = patch(old_value, delta);

console.log(are_deep_equal(new_value, patched_value));
// Prints: true
```


## API

Remember to `import`:

```JavaScript
import { are_deep_equal, deep_clone, diff, patch } from 'diffpatchjson';
```

...or `require`:

```JavaScript
const { are_deep_equal, deep_clone, diff, patch } = require('diffpatchjson');
```

...the functions you intend to use.


### diff

```JavaScript
diff(*<old_value>*, *<new_value>* [, *<diff_options>*])
```

Computes and returns the delta/difference between the JSON values *<old_value>* and *<new_value>*. The returned delta/diff is a JSON value as well.

#### diff options

`diff` accepts an optional third object argument for passing options. Right now, the following options are supported:

##### are_objects_equal

In order to check two objects for equality, you can pass a function as the `are_objects_equal` option. The function will be called with two objects as arguments, and shall return `true` if these objects are considered equal.

```JavaScript
import { diff } from 'diffpatchjson';

diff(*<old_value>*, *<new_value>*, {
  are_objects_equal: (object_1, object_2) => (object_1 === object_2),
})
```

The module exports an `are_strict_equal` function by the way that does just the above:

```JavaScript
import { are_strict_equal, diff } from 'diffpatchjson';

diff(*<old_value>*, *<new_value>*, {
  are_objects_equal: are_strict_equal,
})
```


##### compute_object_hash

As an alternative to providing the `are_objects_equal` option, you can provide an `compute_object_hash` option. This works pretty much identical to the `objectHash` option that you may know from *jsondiffpatch*. The function will be called with an object as argument, and must return a "hash" value that should be the same for all objects that are considered equal.

This usually requires some knowledge about the internal structure of the objects you are diffing:

```JavaScript
import { diff } from 'diffpatchjson';

diff(*<old_value>*, *<new_value>*, {
  compute_object_hash: (object) => object.id,
})
```

The default behaviour of *diffpatchjson* by the way is that the "hash" of an object is simply a JSON string representation of the object:

```JavaScript
import { diff, stringify_json_value } from 'diffpatchjson';

diff(*<old_value>*, *<new_value>*, {
  compute_object_hash: stringify_json_value,
})
```

The results are being cached, so the function you pass as the `compute_object_hash` option will only be called once for each object.


### patch

```JavaScript
patch(*<old_value>*, *<delta*)
```

Patches *<old_value>* with a *<delta>* (created by the [`diff`](#diff) function) and returns the new/patched value.


### are_deep_equal

```JavaScript
are_deep_equal(*<value_1>*, *<value_2>*)
```

Helper function that compares *<value_1>* and *<value_2>* and returns a boolean value indicating if the values are "deep-equal". In JavaScript, booleans, numbers, strings etc. can easily be compared for equality using the strict equality operator `===` (e.g. `"foo" === "foo"` is `true`), but objects cannot (e.g. `{a:1} === {a:1}` is `false`). The `are_deep_equal` function can help in such cases (e.g. `are_deep_equal({a:1}, {a:1})` is `true`).


### deep_clone

```JavaScript
deep_clone(*<value>*)
```

Helper function that returns a deep-cloned copy of the JSON value *<value>*.
