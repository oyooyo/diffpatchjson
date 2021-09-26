const get_keys_of = Object.keys;

const get_length_of = ((value) =>
	value.length
);

const TYPEID_OBJECT = 'object';

const get_type_of = ((value) =>
	(typeof value)
);

const has_object_type = ((value) =>
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

const have_different_typeids = ((value_1, value_2) =>
	(get_typeid_of(value_1) !== get_typeid_of(value_2))
);

const are_deep_equal = ((value_1, value_2) => {
	if (value_1 === value_2) {
		// If the values are strict equal, then they are also deep equal
		return true;
	}
	if (have_different_typeids(value_1, value_2)) {
		// If the values have differnt typeids, then they are not deep equal
		return false;
	}
	if (! has_object_type(value_1)) {
		// If the values have the same typeid, but they are neither strict equal nor of type "object", then they are not deep equal
		return false;
	}
	const keys_of_value_1 = get_keys_of(value_1);
	if (get_length_of(keys_of_value_1) !== get_length_of(get_keys_of(value_2))) {
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

const create_are_equal_function_from_get_object_id_function = ((get_object_id) =>
	((value_1, value_2) =>
		(
			(value_1 === value_2)
			|| (
				(! have_different_typeids(value_1, value_2))
				&& has_object_type(value_1)
				&& (get_object_id(value_1) === get_object_id(value_2))
			)
		)
	)
);

const DELTA_NO_DIFFERENCE = 0;

const DELTA_TO_FALSE = 2;

const DELTA_TO_NULL = 6;

const DELTA_TO_TRUE = 3;

const DELTA_TO_UNDEFINED = 4;

const TYPEID_NUMBER = 'number';

const TYPEID_STRING = 'string';

const create_delta_to_value = ((new_value) =>
	[new_value]
);

const create_array_function = ((function_name) =>
	((array, ...args) =>
		array[function_name](...args)
	)
);

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

const is_delta_to_value = ((delta) =>
	(is_array(delta) && (get_length_of(delta) === 1))
);

const is_delta = ((value) =>
	(
		is_delta_no_difference(value)
		|| is_delta_to_undefined(value)
		|| is_delta_to_null(value)
		|| is_delta_to_true(value)
		|| is_delta_to_false(value)
		|| is_delta_to_value(value)
		|| is_delta_for_array_or_object(value)
	)
);

const is_integer = Number.isInteger;

const is_string = ((value) =>
	(get_type_of(value) === TYPEID_STRING)
);

const is_new_object_index = ((value) =>
	((is_integer(value) && (value > 0)) || is_string(value))
);

const is_object_subdelta = ((value) =>
	(is_array(value) && (get_length_of(value) === 2))
);

const is_object_subdelta_add = ((value) =>
	(
		is_object_subdelta(value)
		&& is_new_object_index(value[0])
		&& is_delta(value[1])
		&& (! is_delta_to_undefined(value[1]))
	)
);

const is_old_object_index = ((value) =>
	(is_integer(value) && (value < 0))
);

const is_object_subdelta_delete = ((value) =>
	(
		is_object_subdelta(value)
		&& is_old_object_index(value[0])
		&& is_delta_to_undefined(value[1])
	)
);

const is_object_subdelta_move = ((value) =>
	(
		is_object_subdelta(value)
		&& is_new_object_index(value[0])
		&& is_old_object_index(value[1])
	)
);

const is_object_subdelta_replace = ((value) =>
	(
		is_object_subdelta(value)
		&& is_old_object_index(value[0])
		&& is_delta(value[1])
		&& (! is_delta_to_undefined(value[1]))
	)
);

const sort_array_inplace = create_array_function('sort');

const sort_subdeltas_inplace = ((subdeltas) =>
	sort_array_inplace(subdeltas, ((subdelta_1, subdelta_2) => 
		(subdelta_1[0] - subdelta_2[0])
	))
);

const split_and_sort_subdeltas = ((subdeltas) =>
	[
		sort_subdeltas_inplace(filter_array(subdeltas, is_object_subdelta_move)),
		sort_subdeltas_inplace(filter_array(subdeltas, is_object_subdelta_replace)),
		sort_subdeltas_inplace(filter_array(subdeltas, is_object_subdelta_delete)),
		sort_subdeltas_inplace(filter_array(subdeltas, is_object_subdelta_add)),
	]
);

const convert_property_changes_to_object_delta = ((property_changes, diff_options) => {
	const {are_equal} = diff_options;
	const subdeltas = [];
	// Loop over all property changes looking for "add"/"remove" pairs that can be described as a "move"
	for (let target_property_change of property_changes) {
		if (
			is_undefined(target_property_change[1])
			&& (! is_undefined(target_property_change[2]))
		) {
			for (let source_property_change of property_changes) {
				if (
					(! is_undefined(source_property_change[1]))
					&& is_undefined(source_property_change[2])
					&& are_equal(source_property_change[1], target_property_change[2])
				) {
					push_to_array(subdeltas, [
						target_property_change[0],
						source_property_change[0],
					]);
					// Set all property changes that have been replaced with a "move" to empty arrays
					target_property_change.length = source_property_change.length = 0;
				}
			}
		}
	}
	// Convert the remaining (non-"move" and not replaced) property changes to subdeltas
	for (let property_change of property_changes) {
		const subdelta_delta = diff(
			property_change[1],
			property_change[2],
			diff_options,
		);
		if (! is_delta_no_difference(subdelta_delta)) {
			push_to_array(subdeltas, [
				property_change[0],
				subdelta_delta,
			]);
		}
	}
	// Return a flattened array version of the subdeltas, or DELTA_NO_DIFFERENCE if there are no subdeltas
	return ((get_length_of(subdeltas) > 0)
		? flatten_array(split_and_sort_subdeltas(subdeltas), 2)
		: DELTA_NO_DIFFERENCE
	);
});

const get_lcsl_table_at = ((lcsl_table, row_index, column_index) =>
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

const diff_arrays = ((old_array, new_array, diff_options) => {
	const {are_equal} = diff_options;
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
		const left_cell_value = get_lcsl_table_at(lcsl_table, lcsl_table_row_index, (lcsl_table_column_index - 1));
		const up_cell_value = get_lcsl_table_at(lcsl_table, (lcsl_table_row_index - 1), lcsl_table_column_index);
		const old_array_index = (lcsl_table_column_index + number_of_equal_elements_at_start - 1);
		const new_array_index = (lcsl_table_row_index + number_of_equal_elements_at_start - 1);
		if (left_cell_value > up_cell_value) {
			// Value was deleted
			push_to_array(property_changes,
				[
					-(old_array_index + 1),
					old_array[old_array_index],
					undefined,
				],
			);
			lcsl_table_column_index--;
		} else if (up_cell_value > left_cell_value) {
			// Value was added/inserted
			push_to_array(property_changes,
				[
					+(new_array_index + 1),
					undefined,
					new_array[new_array_index],
				],
			);
			lcsl_table_row_index--;
		} else {
			// Value was either not changed or replaced
			if (get_lcsl_table_at(lcsl_table, lcsl_table_row_index, lcsl_table_column_index) === get_lcsl_table_at(lcsl_table, (lcsl_table_row_index - 1), (lcsl_table_column_index - 1))) {
				// Value was replaced
				push_to_array(property_changes, [
					-(old_array_index + 1),
					old_array[old_array_index],
					new_array[new_array_index],
				]);
			}
			lcsl_table_column_index--;
			lcsl_table_row_index--;
		}
	}
	return convert_property_changes_to_object_delta(
		property_changes,
		diff_options,
	);
});

const diff_numbers = ((old_number, new_number, diff_options) =>
	create_delta_to_value(new_number)
);

const get_array_index = create_array_function('indexOf');

const get_sorted_keys_of_object_or_array = ((object_or_array) =>
	(is_array(object_or_array)
		? get_keys_of(object_or_array)
		: sort_array_inplace(get_keys_of(object_or_array))
	)
);

const map_array = create_array_function('map');

const remove_duplicates_from_array = ((array) =>
	[...(new Set(array))]
);

const diff_objects = ((old_object, new_object, diff_options) => {
	const {are_equal} = diff_options;
	const old_keys = get_sorted_keys_of_object_or_array(old_object);
	return convert_property_changes_to_object_delta(
		map_array(
			filter_array(
				remove_duplicates_from_array([
					...get_keys_of(old_object),
					...get_keys_of(new_object),
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
					(is_undefined(old_object[property_key])
						? property_key
						: -(get_array_index(old_keys, property_key) + 1)
					),
					old_object[property_key],
					new_object[property_key],
				]
			),
		),
		diff_options,
	);
});

const diff_strings = ((old_string, new_string, diff_options) =>
	create_delta_to_value(new_string)
);

const is_false = ((value) =>
	(value === false)
);

const is_true = ((value) =>
	(value === true)
);

const throw_invalid_value_typeid_error = ((old_value, new_value, diff_options) => {
	throw (new Error(`Invalid value type "${get_typeid_of(old_value)}": ${old_value}`));
});

const diff = ((old_value, new_value, diff_options) =>
	(old_value === new_value) ? DELTA_NO_DIFFERENCE :
	is_undefined(new_value) ? DELTA_TO_UNDEFINED :
	is_null(new_value) ? DELTA_TO_NULL :
	is_true(new_value) ? DELTA_TO_TRUE :
	is_false(new_value) ? DELTA_TO_FALSE :
	have_different_typeids(old_value, new_value) ? create_delta_to_value(new_value) :
	({
		[TYPEID_ARRAY]: diff_arrays,
		[TYPEID_NUMBER]: diff_numbers,
		[TYPEID_OBJECT]: diff_objects,
		[TYPEID_STRING]: diff_strings,
	}[get_typeid_of(old_value)] || throw_invalid_value_typeid_error)(old_value, new_value, diff_options)
);

const TYPEID_FUNCTION = 'function';

const is_function = ((value) =>
	(get_type_of(value) === TYPEID_FUNCTION)
);

const diff_deep_equal = ((
	old_value,
	new_value,
	{
		get_object_id,
		are_equal=(is_function(get_object_id)
			? create_are_equal_function_from_get_object_id_function(get_object_id)
			: are_deep_equal
		),
	} = {},
) =>
	diff(old_value, new_value, {
		are_equal: are_equal,
	})
);

const diff_strict_equal = ((
	old_value,
	new_value,
	{
		get_object_id,
		are_equal=(is_function(get_object_id)
			? create_are_equal_function_from_get_object_id_function(get_object_id)
			: are_strict_equal
		),
	} = {},
) =>
	diff(old_value, new_value, {
		are_equal: are_equal,
	})
);

const get_absolute_value_of = Math.abs;

const convert_object_index_to_index = ((object_index) =>
	(get_absolute_value_of(object_index) - 1)
);

const convert_object_index_to_key = ((object_index, old_keys) =>
	is_string(object_index) ? object_index :
	is_old_object_index(object_index) ? old_keys[convert_object_index_to_index(object_index)] :
	convert_object_index_to_index(object_index)
);

const splice_array = create_array_function('splice');

const split_into_chunks = ((sliceable, length, offset=0) => {
	const chunks = [];
	while (offset < get_length_of(sliceable)) {
		push_to_array(chunks, sliceable.slice(offset, (offset + length)));
		offset += length;
	}
	return chunks;
});

const patch_array_or_object = ((old_array_or_object, delta) => {
	const [move_subdeltas, replace_subdeltas, delete_subdeltas, add_subdeltas] = split_and_sort_subdeltas(split_into_chunks(delta, 2));
	// Replace all "move" subdeltas with "add"/"delete" subdelta pairs
	const old_keys = get_sorted_keys_of_object_or_array(old_array_or_object);
	for (let move_subdelta of move_subdeltas) {
		push_to_array(delete_subdeltas, [
			move_subdelta[1],
			DELTA_TO_UNDEFINED,
		]);
		push_to_array(add_subdeltas, [
			move_subdelta[0],
			create_delta_to_value(old_array_or_object[convert_object_index_to_key(move_subdelta[1], old_keys)]),
		]);
	}
	// Sort the add and delete subdelta arrays again
	sort_subdeltas_inplace(add_subdeltas);
	sort_subdeltas_inplace(delete_subdeltas);
	// Now comes the actual patching
	const new_array_or_object = (is_array(old_array_or_object)
		? [...old_array_or_object]
		: {...old_array_or_object}
	);
	// Step 1: Apply the "replace" subdeltas
	for (let replace_subdelta of replace_subdeltas) {
		const key = convert_object_index_to_key(replace_subdelta[0], old_keys);
		new_array_or_object[key] = patch(
			old_array_or_object[key],
			replace_subdelta[1],
		);
	}
	// Step 2: Apply the "delete" subdeltas
	for (let delete_subdelta of delete_subdeltas) {
		const key = convert_object_index_to_key(delete_subdelta[0], old_keys);
		if (is_array(new_array_or_object)) {
			splice_array(new_array_or_object, key, 1);
		} else {
			delete new_array_or_object[key];
		}
	}
	// Step 3: Apply the "add" subdeltas
	for (let add_subdelta of add_subdeltas) {
		const key = convert_object_index_to_key(add_subdelta[0], old_keys);
		const new_property_value = patch(
			undefined,
			add_subdelta[1],
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
	is_delta_to_undefined(delta) ? undefined :
	is_delta_to_null(delta) ? null :
	is_delta_to_true(delta) ? true :
	is_delta_to_false(delta) ? false :
	is_delta_to_value(delta) ? delta[0] :
	({
		[TYPEID_ARRAY]: patch_array,
		[TYPEID_OBJECT]: patch_object,
	}[get_typeid_of(old_value)] || throw_invalid_delta_error)(old_value, delta)
);

export {
	are_deep_equal,
	are_strict_equal,
	diff_strict_equal as diff,
	diff_deep_equal,
	diff_strict_equal,
	patch,
};
