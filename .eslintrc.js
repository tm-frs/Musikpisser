module.exports = {
	"env": {
		"commonjs": true,
		"es2021": true,
		"node": true
	},
	"extends": `eslint:recommended`,
	"overrides": [
		{
			"env": {
				"node": true
			},
			"files": [
				`.eslintrc.{js,cjs}`
			],
			"parserOptions": {
				"sourceType": `script`
			}
		}
	],
	"parserOptions": {
		"ecmaVersion": `latest`
	},
	"rules": { // Übersicht über alle Regeln: https://eslint.org/docs/latest/rules/ --- Informaionen: https://github.com/eslint/eslint#configuration
		"no-duplicate-imports": [ // Possible Problems: https://eslint.org/docs/latest/rules/#possible-problems
			`error`
		],
		"no-self-compare": [
			`warn`
		],
		"no-unused-vars": [
			`error`
		],
		"camelcase": [ // Suggestions: https://eslint.org/docs/latest/rules/#suggestions
			`error`,
			{ "properties": `always` }
		],
		"eqeqeq": [
			`error`,
			`always`
		],
		"func-style": [
			`error`,
			`declaration`,
			{ "allowArrowFunctions": true }
		],
		"no-lonely-if": [
			`error`
		],
		"yoda": [
			`error`,
			`never`
		],
		"array-bracket-spacing": [ // Layout & Formatting: https://eslint.org/docs/latest/rules/#layout--formatting
			`error`,
			`never`
		],
		"arrow-parens":	[
			`error`,
			`always`
		],
		"arrow-spacing": [
			`error`,
			{ "before": true, "after": true }
		],
		"block-spacing": [
			`error`,
			`always`
		],
		"brace-style": [
			`error`,
			`1tbs`,
			{ "allowSingleLine": true }
		],
		"comma-dangle": [
			`error`,
			`never`
		],
		"comma-spacing": [
			`error`,
			{ "before": false, "after": true }
		],
		"comma-style": [
			`error`,
			`last`
		],
		"dot-location": [
			`warn`,
			`property`
		],
		"eol-last": [
			`error`,
			`always`
		],
		"func-call-spacing": [
			`error`,
			`never`
		],
		"implicit-arrow-linebreak": [
			`error`,
			`beside`
		],
		"indent": [
			`error`,
			`tab`
		],
		"key-spacing": [
			`error`,
			{ "beforeColon": false, "afterColon": true, "mode": `strict` }
		],
		"keyword-spacing": [
			`error`,
			{ "before": true, "after": true }
		],
		"line-comment-position": [
			`off`
		],
		"linebreak-style": [
			`error`,
			`unix`
		],
		"new-parens": [
			`error`,
			`always`
		],
		"newline-per-chained-call": [
			`error`,
			{ "ignoreChainWithDepth": 2 }
		],
		"no-mixed-spaces-and-tabs": [
			`error`,
			`smart-tabs`
		],
		"no-multi-spaces": [
			`error`,
			{ "ignoreEOLComments": true }
		],
		"no-multiple-empty-lines": [
			`error`,
			{ "max": 5, "maxBOF": 0, "maxEOF": 0 }
		],
		"no-trailing-spaces": [
			`error`,
			{ "skipBlankLines": false, "ignoreComments": false }
		],
		"no-whitespace-before-property": [
			`error`
		],
		"nonblock-statement-body-position": [
			`error`,
			`beside`
		],
		"padded-blocks": [
			`error`,
			`never`
		],
		"quotes": [
			`error`,
			`backtick`
		],
		"semi": [
			`error`,
			`always`
		],
		"semi-spacing": [
			`error`,
			{"before": false, "after": true}
		],
		"semi-style": [
			`error`,
			`last`
		],
		"space-before-blocks": [
			`error`,
			`always`
		],
		"space-before-function-paren": [
			`error`,
			{ "anonymous": `never`, "named": `never`, "asyncArrow": `always` }
		],
		"space-in-parens": [
			`error`,
			`never`
		],
		"space-infix-ops": [
			`error`
		],
		"template-curly-spacing": [
			`error`,
			`never`
		]
	}
};
