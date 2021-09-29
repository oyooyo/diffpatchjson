import {
	are_deep_equal,
	diff as diffpatchjson_diff,
	patch as diffpatchjson_patch,
} from './diffpatchjson.mjs';

const EXAMPLES = {
	'Object property replace': {
		old_value: {
			players: {
				'Foo': {
					score: 123,
				},
				'Bar': {
					score: 234,
				},
			},
			current_player: 'Foo',
		},
		new_value: {
			players: {
				'Foo': {
					score: 124,
				},
				'Bar': {
					score: 234,
				},
			},
			current_player: 'Bar',
		},
	},
	'Object property remove': {
		old_value: {
			players: {
				'Foo': {
					score: 123,
				},
				'Bar': {
					score: 234,
				},
			},
			current_player: 'Foo',
		},
		new_value: {
			players: {
				'Foo': {
					score: 123,
				},
			},
			current_player: 'Foo',
		},
	},
	'Object property add': {
		old_value: {
			players: {
				'Foo': {
					score: 123,
				},
			},
			current_player: 'Foo',
		},
		new_value: {
			players: {
				'Foo': {
					score: 123,
				},
				'Bar': {
					score: 234,
				},
			},
			current_player: 'Foo',
		},
	},
	'Object property move primitive': {
		old_value: {
			players: {
				'Foo': {
					Score: 123,
				},
				'Bar': {
					Score: 234,
				},
			},
			current_player: 'Foo',
		},
		new_value: {
			players: {
				'Foo': {
					score: 123,
				},
				'Bar': {
					score: 234,
				},
			},
			current_player: 'Foo',
		},
	},
	'Object property move object': {
		old_value: {
			Players: {
				'Foo': {
					score: 123,
				},
				'Bar': {
					score: 234,
				},
			},
			current_player: 'Foo',
		},
		new_value: {
			players: {
				'Foo': {
					score: 123,
				},
				'Bar': {
					score: 234,
				},
			},
			current_player: 'Foo',
		},
	},
	'Array replace': {
		old_value: [0,1,"old value",2,3,4,5,6,7,8,9],
		new_value: [0,1,"new value",2,3,4,5,6,7,8,9],
	},
	'Array remove': {
		old_value: [0,1,2,3,"remove element",4,5,6,7,8,9],
		new_value: [0,1,2,3,4,5,6,7,8,9],
	},
	'Array add': {
		old_value: [0,1,2,3,4,5,6,7,8,9],
		new_value: [0,1,2,3,4,"add element",5,6,7,8,9],
	},
	'Array move primitive': {
		old_value: [0,1,2,3,4,5,6,7,8,"move element",9],
		new_value: [0,1,2,"move element",3,4,5,6,7,8,9],
	},
	'Array move object': {
		old_value: [0,1,2,3,4,5,6,7,8,{"this":"object", "is":"being moved"},9],
		new_value: [0,1,2,{"this":"object", "is":"being moved"},3,4,5,6,7,8,9],
	},
	'Boolean': {
		old_value: true,
		new_value: false,
	},
	'Number': {
		old_value: 12345,
		new_value: 12346,
	},
	'null': {
		old_value: 123,
		new_value: null,
	},
	'Short string': {
		old_value: 'ding dong the witch is alive',
		new_value: 'ding dong the witch is dead',
	},
	'Long string': {
		old_value: 'LOREM ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		new_value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	},
};

const jsondiffpatch_diff = jsondiffpatch.diff;

const get_element_by_id = ((element_id) =>
	document.getElementById(element_id)
);

const parse_json_string = JSON.parse;

const stringify_json_value = ((value, ...args) =>
	(value === undefined)
		? 'undefined'
		: JSON.stringify(value, ...args)
);

const setup = (() => {
	const old_json_value_element = get_element_by_id('old_json_value');
	const old_json_value_error_element = get_element_by_id('old_json_value_error');
	const new_json_value_element = get_element_by_id('new_json_value');
	const new_json_value_error_element = get_element_by_id('new_json_value_error');
	const diffpatchjson_delta_element = get_element_by_id('diffpatchjson_delta');
	const diffpatchjson_delta_length_element = get_element_by_id('diffpatchjson_delta_length');
	const jsondiffpatch_delta_element = get_element_by_id('jsondiffpatch_delta');
	const jsondiffpatch_delta_length_element = get_element_by_id('jsondiffpatch_delta_length');
	const example_select_element = get_element_by_id('example_select');

	const update = (() => {
		old_json_value_error_element.value = '';
		new_json_value_error_element.value = '';
		diffpatchjson_delta_element.value = '';
		diffpatchjson_delta_length_element.value = '';
		jsondiffpatch_delta_element.value = '';
		jsondiffpatch_delta_length_element.value = '';
		let old_json_value = undefined;
		let new_json_value = undefined;
		try {
			old_json_value = parse_json_string(old_json_value_element.value.trim());
		} catch (exception) {
			old_json_value_error_element.value = exception.message;
		}
		try {
			new_json_value = parse_json_string(new_json_value_element.value.trim());
		} catch (exception) {
			new_json_value_error_element.value = exception.message;
		}
		if ((old_json_value !== undefined) && (new_json_value !== undefined)) {
			const diffpatchjson_delta = diffpatchjson_diff(
				old_json_value,
				new_json_value,
			);
			if (are_deep_equal(new_json_value, diffpatchjson_patch(old_json_value, diffpatchjson_delta))) {
				const diffpatchjson_delta_string = stringify_json_value(diffpatchjson_delta);
				diffpatchjson_delta_element.value = diffpatchjson_delta_string;
				diffpatchjson_delta_length_element.value = diffpatchjson_delta_string.length;
			}
			const jsondiffpatch_delta = jsondiffpatch_diff(
				old_json_value,
				new_json_value,
			);
			const jsondiffpatch_delta_string = stringify_json_value(jsondiffpatch_delta);
			jsondiffpatch_delta_element.value = jsondiffpatch_delta_string;
			jsondiffpatch_delta_length_element.value = jsondiffpatch_delta_string.length;
		}
	});

	old_json_value_element.oninput = update;
	new_json_value_element.oninput = update;

	for (let example_name of Object.keys(EXAMPLES)) {
		const example = EXAMPLES[example_name];
		const example_option_element = document.createElement('option');
		example_option_element.setAttribute('value', example_name);
		example_option_element.appendChild(document.createTextNode(example_name));
		example_select_element.appendChild(example_option_element);
	}
	example_select_element.onchange = ((event) => {
		const example_name = example_select_element.value;
		const example = EXAMPLES[example_name];
		old_json_value_element.value = stringify_json_value(example.old_value, null, 2);
		new_json_value_element.value = stringify_json_value(example.new_value, null, 2);
		update();
	});

});

setup();
