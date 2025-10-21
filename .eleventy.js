import { I18nPlugin } from "@11ty/eleventy";
import * as sass from "sass";

const configI18n = {
	defaultLanguage: "en",
	filters: {
		url: "locale_url",
		links: "locale_links",
	},
};

async function compileScss(inputContent, inputPath) {
	let result = sass.compileString(inputContent);
	return async (data) => {
		return result.css;
	};
}

export default async function (eleventyConfig) {
	// Required because of my strict .gitignore causing 0 files to be processed
	eleventyConfig.setUseGitIgnore(false);

	eleventyConfig.addPlugin(I18nPlugin, configI18n);

	// TODO: Look into a better way to handle this re: includes
	eleventyConfig.addTemplateFormats("scss");
	eleventyConfig.addExtension("scss", {
		outputFileExtension: "css",
		useLayouts: false,
		compile: compileScss,
	});
}

export const config = {
	dir: {
		input: "src",
		includes: "_includes",
		layouts: "_layouts",
		data: "_data",
		output: "_site",
	},
};
