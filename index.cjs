const get_keys_of_object = Object.keys;

const get_length_of = ((value) =>
	value.length
);

const TYPEID_OBJECT = 'object';

const get_type_of = ((value) =>
	(typeof value)
);

const is_of_type_object = ((value) =>
	(get_type_of(value) === TYPEID_OBJECT)
);

const TYPEID_ARRAY = 'array';

const TYPEID_NULL = 'null';

const is_array = Array.isArray;

const is_null = ((value) =>
	(value === null)
);

const get_typeid_of = ((value) =>
	is_null(value) ? TYPEID_NULL :
	is_array(value) ? TYPEID_ARRAY :
	get_type_of(value)
);

const are_of_different_typeids = ((value_1, value_2) =>
	(get_typeid_of(value_1) !== get_typeid_of(value_2))
);

const are_deep_equal = ((value_1, value_2) => {
	if (value_1 === value_2) {
		// If the values are strict equal, then they are also deep equal
		return true;
	}
	if (are_of_different_typeids(value_1, value_2)) {
		// If the values have differnt typeids, then they are not deep equal
		return false;
	}
	if (! is_of_type_object(value_1)) {
		// If the values have the same typeid, but they are neither strict equal nor of type "object", then they are not deep equal
		return false;
	}
	const keys_of_value_1 = get_keys_of_object(value_1);
	if (get_length_of(keys_of_value_1) !== get_length_of(get_keys_of_object(value_2))) {
		// If the values have a different number of keys, then they are not deep equal
		return false;
	}
	for (let key of keys_of_value_1) {
		if (! (key in value_2)) {
			// If the values do not have the same keys, then they are not deep equal
			return false;
		}
	}
	for (let key of keys_of_value_1) {
		if (! are_deep_equal(value_1[key], value_2[key])) {
			// If the values have properties with the same key but whose values are not deep equal, then the values itself are not deep equal either
			return false;
		}
	}
	// If all above checks have passed, the values are considered deep equal
	return true;
});

const are_strict_equal = ((value_1, value_2) =>
	(value_1 === value_2)
);

const TYPEID_BOOLEAN = 'boolean';

const TYPEID_NUMBER = 'number';

const TYPEID_STRING = 'string';

const TYPEID_UNDEFINED = 'undefined';

const identity_function = ((value) =>
	value
);

const create_array_function = ((function_name) =>
	((array, ...args) =>
		array[function_name](...args)
	)
);

const map_array = create_array_function('map');

const map_object = ((object, callback, this_arg=undefined) => {
	const mapped_object = {};
	for (let key of get_keys_of_object(object)) {
		mapped_object[key] = callback.apply(this_arg, [object[key], key, object]);
	}
	return mapped_object;
});

const throw_invalid_value_typeid_error = ((value) => {
	throw (new Error(`Invalid value type "${get_typeid_of(value)}": ${value}`));
});

const deep_clone = ((json_value) =>
	({
		[TYPEID_ARRAY]: ((array) => map_array(array, deep_clone)),
		[TYPEID_BOOLEAN]: identity_function,
		[TYPEID_NULL]: identity_function,
		[TYPEID_NUMBER]: identity_function,
		[TYPEID_OBJECT]: ((object) => map_object(object, deep_clone)),
		[TYPEID_STRING]: identity_function,
		[TYPEID_UNDEFINED]: identity_function,
	}[get_typeid_of(json_value)] || throw_invalid_value_typeid_error)(json_value)
);

const create_are_equal_function_from_are_objects_equal_function = ((are_objects_equal) =>
	((value_1, value_2) =>
		(
			(value_1 === value_2)
			|| (
				is_of_type_object(value_1)
				&& (! are_of_different_typeids(value_1, value_2))
				&& are_objects_equal(value_1, value_2)
			)
		)
	)
);

const is_string = ((value) =>
	(get_type_of(value) === TYPEID_STRING)
);

const create_are_objects_equal_function_from_compute_object_hash_function = ((compute_object_hash) => {
	const objects_to_object_hashs_map = (new Map());
	const object_hash_strings_to_object_hash_symbols_map = (new Map());
	const compute_object_hash_cached = ((object) => {
		if (! objects_to_object_hashs_map.has(object)) {
			let object_hash = compute_object_hash(object);
			if (is_string(object_hash)) {
				if (! object_hash_strings_to_object_hash_symbols_map.has(object_hash)) {
					object_hash_strings_to_object_hash_symbols_map.set(
						object_hash,
						Symbol(object_hash),
					);
				}
				object_hash = object_hash_strings_to_object_hash_symbols_map.get(object_hash);
			}
			objects_to_object_hashs_map.set(object, object_hash);
		}
		return objects_to_object_hashs_map.get(object);
	});
	return ((value_1, value_2) =>
		(compute_object_hash_cached(value_1) === compute_object_hash_cached(value_2))
	);
});

const DELTA_NO_DIFFERENCE = 0;

const DELTA_TO_FALSE = 2;

const DELTA_TO_NULL = 3;

const DELTA_TO_TRUE = 1;

const DELTA_TO_UNDEFINED = 4;

const create_delta_to_value = ((new_value) =>
	[new_value]
);

const OPERATION_ID_MOVE = 8;

const flatten_array = create_array_function('flat');

const is_delta_no_difference = ((delta) =>
	(delta === DELTA_NO_DIFFERENCE)
);

const is_undefined = ((value) =>
	(value === undefined)
);

const push_to_array = create_array_function('push');

const filter_array = create_array_function('filter');

const is_delta_for_array_or_object = ((delta) =>
	(is_array(delta) && ((get_length_of(delta) % 2) === 0))
);

const is_delta_to_false = ((delta) =>
	(delta === DELTA_TO_FALSE)
);

const is_delta_to_null = ((delta) =>
	(delta === DELTA_TO_NULL)
);

const is_delta_to_true = ((delta) =>
	(delta === DELTA_TO_TRUE)
);

const is_delta_to_undefined = ((delta) =>
	(delta === DELTA_TO_UNDEFINED)
);

const is_array_of_length = ((value, length) =>
	(is_array(value) && (get_length_of(value) === length))
);

const is_delta_to_value = ((value) =>
	is_array_of_length(value, 1)
);

const is_delta = ((value) =>
	(
		is_delta_no_difference(value)
		|| is_delta_to_true(value)
		|| is_delta_to_false(value)
		|| is_delta_to_null(value)
		|| is_delta_to_undefined(value)
		|| is_delta_to_value(value)
		|| is_delta_for_array_or_object(value)
	)
);

const is_delta_but_not_to_undefined = ((value) =>
	(
		is_delta(value)
		&& (! is_delta_to_undefined(value))
	)
);

const is_operation = ((value) =>
	is_array_of_length(value, 2)
);

const is_integer = Number.isInteger;

const is_property_id_of_new_array_or_object = ((value) =>
	((is_integer(value) && (value < 0)) || is_string(value))
);

const is_operation_add = ((value) =>
	(
		is_operation(value)
		&& is_property_id_of_new_array_or_object(value[0])
		&& is_delta_but_not_to_undefined(value[1])
	)
);

const OPERATION_ID_COPY = 9;

const is_property_id_of_old_array_or_object = ((value) =>
	(is_integer(value) && (value > 0))
);

const is_property_id_of_array_or_object = ((value) =>
	(
		is_property_id_of_old_array_or_object(value)
		|| is_property_id_of_new_array_or_object(value)
	)
);

const is_multiple_properties_operation_with_id = ((value, operation_id) =>
	(
		is_operation(value)
		&& (value[1] === operation_id)
		&& is_array_of_length(value[0], 2)
		&& is_property_id_of_old_array_or_object(value[0][0])
		&& is_property_id_of_array_or_object(value[0][1])
	)
);

const is_operation_copy = ((value) =>
	is_multiple_properties_operation_with_id(value, OPERATION_ID_COPY)
);

const is_operation_move = ((value) =>
	is_multiple_properties_operation_with_id(value, OPERATION_ID_MOVE)
);

const is_operation_remove = ((value) =>
	(
		is_operation(value)
		&& is_property_id_of_old_array_or_object(value[0])
		&& is_delta_to_undefined(value[1])
	)
);

const is_operation_replace = ((value) =>
	(
		is_operation(value)
		&& is_property_id_of_old_array_or_object(value[0])
		&& is_delta_but_not_to_undefined(value[1])
	)
);

const get_sort_index_of_operation = ((operation) =>
	(is_array(operation[0])
		? operation[0][1]
		: operation[0]
	)
);

const sort_array_inplace = create_array_function('sort');

const sort_operations_inplace = ((operations) =>
	sort_array_inplace(operations, ((operation_1, operation_2) => 
		(get_sort_index_of_operation(operation_2) - get_sort_index_of_operation(operation_1))
	))
);

const split_and_sort_operations = ((operations) =>
	[
		sort_operations_inplace(filter_array(operations, is_operation_copy)),
		sort_operations_inplace(filter_array(operations, is_operation_move)),
		sort_operations_inplace(filter_array(operations, is_operation_replace)),
		sort_operations_inplace(filter_array(operations, is_operation_remove)),
		sort_operations_inplace(filter_array(operations, is_operation_add)),
	]
);

const convert_property_changes_to_delta_for_array_or_object = ((property_changes, are_equal) => {
	const operations = [];
	// Loop over all property changes looking for property changes that can be described as a "move"
	for (let target_property_change of property_changes) {
		if (! is_undefined(target_property_change[2])) {
			for (let source_property_change of property_changes) {
				if (
					(! is_undefined(source_property_change[1]))
					&& is_undefined(source_property_change[2])
				) {
					if (are_equal(source_property_change[1], target_property_change[2])) {
						push_to_array(operations, [
							[
								source_property_change[0],
								target_property_change[0],
							],
							OPERATION_ID_MOVE,
						]);
						// Set all property changes that have been replaced with a "move" to empty arrays
						target_property_change.length = source_property_change.length = 0;
					}
				}
			}
		}
	}
	// Convert the remaining (non-"move" and not replaced) property changes to operations
	for (let property_change of property_changes) {
		const operation_delta = diff(
			property_change[1],
			property_change[2],
			are_equal,
		);
		if (! is_delta_no_difference(operation_delta)) {
			push_to_array(operations, [
				property_change[0],
				operation_delta,
			]);
		}
	}
	// Return a flattened array version of the operations, or DELTA_NO_DIFFERENCE if there are no operations
	return ((get_length_of(operations) > 0)
		? flatten_array(split_and_sort_operations(operations), 2)
		: DELTA_NO_DIFFERENCE
	);
});

const get_lcsl_table_cell_at = ((lcsl_table, row_index, column_index) =>
	(((row_index < 0) || (column_index < 0))
		? -1
		: lcsl_table[row_index][column_index]
	)
);

const create_array_from = Array.from;

const get_maximum_of = Math.max;

const get_lcsl_table_for = ((x, y, are_equal) => {
	const increased_length_of_x = (get_length_of(x) + 1);
	const increased_length_of_y = (get_length_of(y) + 1);
	const lcsl_table = create_array_from({length:increased_length_of_y}, (() => Array(increased_length_of_x).fill(0)));
	for (let row_index = 1; (row_index < increased_length_of_y); row_index++) {
		for (let column_index = 1; (column_index < increased_length_of_x); column_index++) {
			lcsl_table[row_index][column_index] = (are_equal(x[column_index - 1], y[row_index - 1])
				? (lcsl_table[row_index - 1][column_index - 1] + 1)
				: get_maximum_of(lcsl_table[row_index][column_index - 1], lcsl_table[row_index - 1][column_index])
			);
		}
	}
	return lcsl_table;
});

const get_minimum_of = Math.min;

const slice_array = create_array_function('slice');

const diff_arrays = ((old_array, new_array, are_equal) => {
	const old_array_length = get_length_of(old_array);
	const new_array_length = get_length_of(new_array);
	const minimum_array_length = get_minimum_of(old_array_length, new_array_length);
	let number_of_equal_elements_at_start = 0;
	while (
		(number_of_equal_elements_at_start < minimum_array_length)
		&& are_equal(
			old_array[number_of_equal_elements_at_start],
			new_array[number_of_equal_elements_at_start],
		)
	) {
		number_of_equal_elements_at_start++;
	}
	let number_of_equal_elements_at_end = 0;
	while (
		(number_of_equal_elements_at_end < minimum_array_length)
		&& are_equal(
			old_array[old_array_length - 1 - number_of_equal_elements_at_end],
			new_array[new_array_length - 1 - number_of_equal_elements_at_end],
		)
	) {
		number_of_equal_elements_at_end++;
	}
	const lcsl_table = get_lcsl_table_for(
		slice_array(old_array,
			number_of_equal_elements_at_start,
			(old_array_length - number_of_equal_elements_at_end),
		),
		slice_array(new_array,
			number_of_equal_elements_at_start,
			(new_array_length - number_of_equal_elements_at_end),
		),
		are_equal,
	);
	const property_changes = [];
	let lcsl_table_row_index = (new_array_length - number_of_equal_elements_at_start - number_of_equal_elements_at_end);
	let lcsl_table_column_index = (old_array_length - number_of_equal_elements_at_start - number_of_equal_elements_at_end);
	while((lcsl_table_column_index > 0) || (lcsl_table_row_index > 0)) {
		const left_cell_value = get_lcsl_table_cell_at(lcsl_table, lcsl_table_row_index, (lcsl_table_column_index - 1));
		const up_cell_value = get_lcsl_table_cell_at(lcsl_table, (lcsl_table_row_index - 1), lcsl_table_column_index);
		const old_array_index = (lcsl_table_column_index + number_of_equal_elements_at_start - 1);
		const new_array_index = (lcsl_table_row_index + number_of_equal_elements_at_start - 1);
		if (left_cell_value > up_cell_value) {
			// Value was removed
			push_to_array(property_changes,
				[
					+(old_array_index + 1),
					old_array[old_array_index],
					undefined,
				],
			);
			lcsl_table_column_index--;
		} else if (up_cell_value > left_cell_value) {
			// Value was added
			push_to_array(property_changes,
				[
					-(new_array_index + 1),
					undefined,
					new_array[new_array_index],
				],
			);
			lcsl_table_row_index--;
		} else {
			// Value was either not changed or replaced
			if (
				get_lcsl_table_cell_at(
					lcsl_table,
					lcsl_table_row_index,
					lcsl_table_column_index,
				)
				=== get_lcsl_table_cell_at(
					lcsl_table,
					(lcsl_table_row_index - 1),
					(lcsl_table_column_index - 1),
				)
			) {
				// Value was replaced
				push_to_array(property_changes, [
					+(old_array_index + 1),
					old_array[old_array_index],
					new_array[new_array_index],
				]);
			}
			lcsl_table_column_index--;
			lcsl_table_row_index--;
		}
	}
	return convert_property_changes_to_delta_for_array_or_object(
		property_changes,
		are_equal,
	);
});

const diff_numbers = ((old_number, new_number, are_equal) =>
	create_delta_to_value(new_number)
);

const get_array_index = create_array_function('indexOf');

const get_keys_of_array = ((array) =>
	create_array_from(array, ((value, index) => index))
);

const get_sorted_keys_of = ((array_or_object) =>
	(is_array(array_or_object)
		? get_keys_of_array(array_or_object)
		: sort_array_inplace(get_keys_of_object(array_or_object))
	)
);

const is_in_array = create_array_function('includes');

const remove_duplicates_from_array = ((array) =>
	[...(new Set(array))]
);

const diff_objects = ((old_object, new_object, are_equal) => {
	const old_keys = get_sorted_keys_of(old_object);
	return convert_property_changes_to_delta_for_array_or_object(
		map_array(
			filter_array(
				remove_duplicates_from_array([
					...get_keys_of_object(old_object),
					...get_keys_of_object(new_object),
				]),
				((property_key) =>
					(! are_equal(
						old_object[property_key],
						new_object[property_key],
					))
				),
			),
			((property_key) =>
				[
					(is_in_array(old_keys, property_key)
						? +(get_array_index(old_keys, property_key) + 1)
						: property_key
					),
					old_object[property_key],
					new_object[property_key],
				]
			),
		),
		are_equal,
	);
});

const diff_strings = ((old_string, new_string, are_equal) =>
	create_delta_to_value(new_string)
);

const is_false = ((value) =>
	(value === false)
);

const is_true = ((value) =>
	(value === true)
);

const diff = ((old_value, new_value, are_equal) =>
	are_equal(old_value, new_value) ? DELTA_NO_DIFFERENCE :
	is_true(new_value) ? DELTA_TO_TRUE :
	is_false(new_value) ? DELTA_TO_FALSE :
	is_null(new_value) ? DELTA_TO_NULL :
	is_undefined(new_value) ? DELTA_TO_UNDEFINED :
	are_of_different_typeids(old_value, new_value) ? create_delta_to_value(new_value) :
	({
		[TYPEID_ARRAY]: diff_arrays,
		[TYPEID_NUMBER]: diff_numbers,
		[TYPEID_OBJECT]: diff_objects,
		[TYPEID_STRING]: diff_strings,
	}[get_typeid_of(old_value)] || throw_invalid_value_typeid_error)(old_value, new_value, are_equal)
);

const join_array = create_array_function('join');

const stringify_json = JSON.stringify;

const stringify_json_value = ((json_value) =>
	({
		[TYPEID_ARRAY]: ((array) => `[${join_array(map_array(array, stringify_json), ',')}]`),
		[TYPEID_BOOLEAN]: stringify_json,
		[TYPEID_NULL]: stringify_json,
		[TYPEID_NUMBER]: stringify_json,
		[TYPEID_OBJECT]: ((object) => `{${map_array(sort_array_inplace(get_keys_of_object(object)), ((key) => `"${key}":${stringify_json_value(object[key])}`))}}`),
		[TYPEID_STRING]: stringify_json,
		[TYPEID_UNDEFINED]: (() => TYPEID_UNDEFINED),
	}[get_typeid_of(json_value)] || throw_invalid_value_typeid_error)(json_value)
);

const diff_with_options = ((
	old_value,
	new_value,
	{
		compute_object_hash=stringify_json_value,
		are_objects_equal=create_are_objects_equal_function_from_compute_object_hash_function(compute_object_hash),
		are_equal=create_are_equal_function_from_are_objects_equal_function(are_objects_equal),
	} = {},
) =>
	diff(old_value, new_value, are_equal)
);

const get_absolute_value_of = Math.abs;

const convert_property_id_to_property_key = ((property_id, old_property_keys) =>
	is_string(property_id) ? property_id :
	is_property_id_of_old_array_or_object(property_id) ? old_property_keys[property_id - 1] :
	(get_absolute_value_of(property_id) - 1)
);

const splice_array = create_array_function('splice');

const split_into_chunks = ((sliceable, chunk_length, offset=0) => {
	const chunks = [];
	while (offset < get_length_of(sliceable)) {
		push_to_array(chunks,
			slice_array(sliceable,
				offset,
				(offset + chunk_length),
			),
		);
		offset += chunk_length;
	}
	return chunks;
});

const patch_array_or_object = ((old_array_or_object, delta) => {
	const [
		copy_operations,
		move_operations,
		replace_operations,
		remove_operations,
		add_operations,
	] = split_and_sort_operations(split_into_chunks(delta, 2));
	const old_keys = get_sorted_keys_of(old_array_or_object);
	// Replace all "copy" and "move" operations with "add"/"remove"/"replace" operations
	for (let operation of [...copy_operations, ...move_operations]) {
		const from_property_id = operation[0][0];
		const to_property_id = operation[0][1];
		if (is_operation_move(operation)) {
			push_to_array(remove_operations, [
				from_property_id,
				DELTA_TO_UNDEFINED,
			]);
		}
		push_to_array(
			(is_property_id_of_old_array_or_object(to_property_id)
				? replace_operations
				: add_operations
			),
			[
				to_property_id,
				create_delta_to_value(old_array_or_object[convert_property_id_to_property_key(from_property_id, old_keys)]),
			]
		);
	}
	// Sort the add and delete operation arrays again
	sort_operations_inplace(add_operations);
	sort_operations_inplace(remove_operations);
	// Now comes the actual patching
	const new_array_or_object = (is_array(old_array_or_object)
		? [...old_array_or_object]
		: {...old_array_or_object}
	);
	// Step 1: Apply the "replace" operations
	for (let replace_operation of replace_operations) {
		const key = convert_property_id_to_property_key(replace_operation[0], old_keys);
		new_array_or_object[key] = patch(
			old_array_or_object[key],
			replace_operation[1],
		);
	}
	// Step 2: Apply the "remove" operations
	for (let remove_operation of remove_operations) {
		const key = convert_property_id_to_property_key(remove_operation[0], old_keys);
		if (is_array(new_array_or_object)) {
			splice_array(new_array_or_object, key, 1);
		} else {
			delete new_array_or_object[key];
		}
	}
	// Step 3: Apply the "add" operations
	for (let add_operation of add_operations) {
		const key = convert_property_id_to_property_key(add_operation[0], old_keys);
		const new_property_value = patch(
			undefined,
			add_operation[1],
		);
		if (is_array(new_array_or_object)) {
			splice_array(new_array_or_object, key, 0, new_property_value);
		} else {
			new_array_or_object[key] = new_property_value;
		}
	}
	// Return the new array or object
	return new_array_or_object;
});

const patch_array = patch_array_or_object;

const patch_object = patch_array_or_object;

const throw_invalid_delta_error = ((old_value, delta) => {
	throw (new Error(`Invalid delta for value of type "${get_typeid_of(old_value)}": ${delta}`));
});

const patch = ((old_value, delta) =>
	is_delta_no_difference(delta) ? old_value :
	is_delta_to_true(delta) ? true :
	is_delta_to_false(delta) ? false :
	is_delta_to_null(delta) ? null :
	is_delta_to_undefined(delta) ? undefined :
	is_delta_to_value(delta) ? delta[0] :
	({
		[TYPEID_ARRAY]: patch_array,
		[TYPEID_OBJECT]: patch_object,
	}[get_typeid_of(old_value)] || throw_invalid_delta_error)(old_value, delta)
);

module.exports = {
	are_deep_equal: are_deep_equal,
	are_strict_equal: are_strict_equal,
	deep_clone: deep_clone,
	diff: diff_with_options,
	patch: patch,
	stringify_json_value: stringify_json_value,
};
