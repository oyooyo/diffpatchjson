# Delta format


## Delta types


### NO_DIFFERENCE

```JavaScript
0
```

The integer value `0` represents a delta where the old value and the new value are considered equal and thus there is no difference.


### TO_TRUE

```JavaScript
1
```

The integer value `1` represents a delta where the new value is the boolean value `true`.


### TO_FALSE

```JavaScript
2
```

The integer value `2` represents a delta where the new value is the boolean value `false`.


### TO_NULL

```JavaScript
3
```

The integer value `3` represents a delta where the new value is `null`.


### TO_UNDEFINED

```JavaScript
4
```

The integer value `4` represents a delta where the new value is `undefined`. When this is the delta of an object property or array element, this means that the object property or array element shall be removed.


### TO_VALUE

```JavaScript
[X]
```

An array that contains a single value X represents a delta where the new value is X.


### FOR_ARRAY_OR_OBJECT

```JavaScript
[Operation_1_A, Operation_1_B, Operation_2_A, Operation_2_B, Operation_3_A, Operation_3_B, ...]
```

An array that contains an even number of elements represents a delta for an array or object. Think of this delta as a flattened version of an array of "Operations", where each "Operation" is an array with two elements A and B `[A, B]`:
```JavaScript
[[Operation_1_A, Operation_1_B], [Operation_2_A, Operation_2_B], [Operation_3_A, Operation_3_B], ...]
```

Each "operation" represents a single change to an array or object. There are four different types of "operation"s:

|         | A            | B     | Description                                                                      |
| ------- | ------------ | ----- | -------------------------------------------------------------------------------- |
| ADD     | new_id       | delta | Add a new property to an object or insert an element into an array               |
| REMOVE  | old_id       | 4     | Remove a property from an object or remove an element from an array              |
| REPLACE | old_id       | delta | Replace an existing property of an object or element of an arry with a new value |
| MOVE    | [old_id, id] | 8     | Move an object property or an array element within the object or array           |

An `old_id` is a positive integer value  0. It represents an object property or array element in the old version of the JSON value. In the case of arrays, this is simply a (1-based) index. So for example, if the old JSON value is the array`["A", "B", "C", "D"]` the third element (`"C"`) would be represented by `old_id` `3`. In the case of objects, `old_id` represents the n-th object property in alphabetical order. For example `{"foo":123, "bar":234}` has the properties named `foo` and `bar`, or, in alphabetical order, `["bar", "foo"]`. The property `bar` is the second property in alphabetical sort order and would thus be represented by the `old_id` `2`.

A `new_id` is either a negative integer value (in the case of arrays) or a string (in the case of objects). It represents an object property or array element in the new version of the JSON value. If it is a string, it is simply the key of the object property. If it is an integer, it is a negative (1-based) array index, so for example the `new_id` `4` represents the fourth element in the new version of the JSON array.

`id` simply stands for a value that may either be an `old_id` or a `new_id`.
