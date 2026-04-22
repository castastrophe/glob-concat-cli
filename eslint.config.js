import js from "@eslint/js";
import globals from "globals";
import jsoncPlugin from "eslint-plugin-jsonc";
import * as jsoncParser from "jsonc-eslint-parser";

export default [
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			globals: {
				...globals.node,
			},
		},
		rules: {
			"brace-style": ["warn", "stroustrup", { allowSingleLine: true }],
			"func-call-spacing": ["warn", "never"],
			indent: ["warn", "tab", { ignoredNodes: ["TemplateLiteral *"], SwitchCase: 1 }],
			"linebreak-style": ["warn", "unix"],
			"no-console": ["warn", { allow: ["warn", "error"] }],
			quotes: ["warn", "double"],
			semi: ["warn", "always"],
			"space-before-blocks": ["warn", "always"],
		},
	},
	{
		files: ["**/*.json"],
		plugins: { jsonc: jsoncPlugin },
		languageOptions: { parser: jsoncParser },
		rules: {
			...jsoncPlugin.configs["recommended-with-jsonc"].rules,
		},
	},
	{
		files: ["package.json"],
		rules: {
			"jsonc/sort-keys": [
				"warn",
				{
					pathPattern: "^$",
					order: [
						"$schema",
						"private",
						"name",
						"version",
						"description",
						"license",
						"author",
						"maintainers",
						"contributors",
						"homepage",
						"repository",
						"bugs",
						"type",
						"exports",
						"main",
						"module",
						"browser",
						"man",
						"preferGlobal",
						"bin",
						"files",
						"directories",
						"scripts",
						"config",
						"sideEffects",
						"types",
						"typings",
						"workspaces",
						"resolutions",
						"dependencies",
						"bundleDependencies",
						"bundledDependencies",
						"peerDependencies",
						"peerDependenciesMeta",
						"optionalDependencies",
						"devDependencies",
						"keywords",
						"engines",
						"engineStrict",
						"os",
						"cpu",
						"publishConfig",
					],
				},
				{
					pathPattern: "^repository$",
					order: ["type", "url", "directory"],
				},
				{
					pathPattern: "^spectrum$",
					order: { type: "asc" },
				},
				{
					pathPattern: "^exports$",
					order: ["."],
				},
				{
					pathPattern: ".*",
					order: { type: "asc" },
				},
			],
		},
	},
];
