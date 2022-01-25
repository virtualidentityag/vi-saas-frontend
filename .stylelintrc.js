const defaultConfig = require('@biotope/quality-gate/config/.stylelintrc');

module.exports = {
	...defaultConfig,
	extends: [
		// The config from quality-gate isn't compatible with stylelint@^14,
		// therefore merge it with working alternatives.
		'stylelint-config-standard-scss',
		'stylelint-config-prettier'
	],
	rules: {
		...defaultConfig.rules,
		'plugin/no-unsupported-browser-features': [
			true,
			{
				severity: 'warning',
				ignore: [
					// Works good enough in the supported browsers
					'calc',
					'flexbox',
					'css-gradients',
					'multicolumn',
					// Progressive enhancement
					'text-size-adjust',
					'viewport-units',
					'css-appearance',
					'word-break',
					'css-unset-value',
					'css-filters',
					'outline',
					'css3-cursors',
					'css-resize',
					'intrinsic-width'
				]
			}
		],

		// Defaults are not good
		// 'alpha-value-notation': 'number',
		'number-leading-zero': 'always',
		'color-function-notation': 'legacy',
		'value-keyword-case': null, // Requires e.g. "robotoslab" instead of "RobotoSlab"
		'scss/operator-no-unspaced': null, // Has false positives
		'scss/dollar-variable-empty-line-before': null,

		// Too much effort to change
		'selector-class-pattern': null,

		// TODO: Only disabled temporarily to compile this list, but should be fixed
		'scss/dollar-variable-pattern': null, // Likely requires changes in lib consumer
		'scss/at-mixin-argumentless-call-parentheses': null,
		'color-hex-length': null,
		'scss/double-slash-comment-whitespace-inside': null,
		'selector-pseudo-element-colon-notation': null,
		'property-no-vendor-prefix': null,
		'length-zero-no-unit': null,
		'declaration-empty-line-before': null,
		'rule-empty-line-before': null,
		'keyframes-name-pattern': null,
		'no-descending-specificity': null,
		'declaration-block-no-shorthand-property-overrides': null,
		'declaration-no-important': null,
		'scss/no-global-function-names': null,
		'no-duplicate-selectors': null,
		'declaration-block-no-redundant-longhand-properties': null,
		'selector-no-vendor-prefix': null,
		'value-no-vendor-prefix': null,
		'shorthand-property-no-redundant-values': null,
		'declaration-block-no-duplicate-properties': null
	}
};
