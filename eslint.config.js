import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    settings:{
      react: {
        version: "detect"
      }
    }
  },
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules:{
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/display-name": "off"
    }     
  }
];