import { I18nPlugin } from "@11ty/eleventy";
import * as sass from "sass";
import * as bootstrapNavbar from "./shortcodes/bootstrapNavbar.js";

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

export const config = {
	dir: {
		input: "src",
		includes: "_includes",
		layouts: "_layouts",
		data: "_data",
		output: "_site",
	},
};

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

	eleventyConfig.addPairedShortcode(
		"bootstrapNavbar",
		bootstrapNavbar.bootstrapNavbar
	);
	eleventyConfig.addShortcode(
		"bootstrapNavbarBrand",
		bootstrapNavbar.bootstrapNavbarBrand
	);
	eleventyConfig.addShortcode(
		"bootstrapNavbarToggler",
		bootstrapNavbar.bootstrapNavbarToggler
	);
	eleventyConfig.addPairedShortcode(
		"bootstrapNavbarNav",
		bootstrapNavbar.bootstrapNavbarNav
	);
	eleventyConfig.addShortcode(
		"bootstrapNavbarItem",
		bootstrapNavbar.bootstrapNavbarItem
	);
	eleventyConfig.addPairedShortcode(
		"bootstrapNavbarItemDropdown",
		bootstrapNavbar.bootstrapNavbarItemDropdown
	);
	eleventyConfig.addShortcode(
		"bootstrapNavbarItemDropdownItem",
		bootstrapNavbar.bootstrapNavbarItemDropdownItem
	);

	// TODO: Look into SCSS storage so they're not passthrough copied to the site
	eleventyConfig.addPassthroughCopy(`${config.dir.input}/assets`);
	// Passthrough copy any referenced assets within the HTML-output content
	eleventyConfig.addPassthroughCopy(`${config.dir.input}/**`, {
		mode: "html-relative",
	});
}
