import js from "@eslint/js";
import tseslint from "typescript-eslint";
import obsidian from "eslint-plugin-obsidianmd";
import globals from "globals";

export default tseslint.config(
	{
		ignores: ["main.js", "node_modules/**"],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	...obsidian.configs.recommended,
	{
		files: ["**/*.ts"],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
);
