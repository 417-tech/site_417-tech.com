// Based on https://getbootstrap.com/docs/5.3/components/navbar/

export async function bootstrapNavbar(content, navbarExpand = undefined) {
	let result = "";

	let expand = "";
	if (navbarExpand) {
		expand = `navbar-expand-${navbarExpand}`;
	}

	result += `<nav class="navbar ${expand}">\n`;
	result += `<div class="container">\n`;
	result += content;
	result += "</div>\n";
	result += "</nav>\n";

	return result;
}

export async function bootstrapNavbarBrand(
	brandName,
	brandImage = undefined,
	brandUrl = "/"
) {
	let result = "";

	let brand = brandName;
	if (brandImage) {
		brand = `<img src="${brandImage}" alt="${brandName}" />`;
	}

	if (brandUrl) {
		result = `<a class="navbar-brand" href="${brandUrl}">${brand}</a>\n`;
	} else {
		result = `<span class="navbar-brand mb-0 h1">${brand}</span>\n`;
	}

	return result;
}

export async function bootstrapNavbarToggler(navbarId) {
	let result = "";

	result += `<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#${navbarId}" aria-controls="${navbarId}" aria-expanded="false" aria-label="Toggle navigation">\n`;
	result += `<span class="navbar-toggler-icon"></span>\n`;
	result += "</button>\n";

	return result;
}

export async function bootstrapNavbarNav(content, navbarId, collapse = true) {
	let result = "";

	if (collapse) {
		result += `<div id="${navbarId}" class="collapse navbar-collapse">\n`;
	} else {
		result += `<div id="${navbarId}">\n`;
	}

	result += `<ul class="navbar-nav">\n`;
	result += content;
	result += "</ul>\n";
	result += "</div>\n";

	return result;
}

export async function bootstrapNavbarItem(
	itemSlug,
	itemName = undefined,
	itemDisabled = false
) {
	let result = "";

	let itemPageCurrent = false;
	let collections = this.ctx.environments.collections.all;

	let itemPage = collections.find((obj) => {
		return (
			obj.filePathStem == itemSlug ||
			obj.filePathStem == `${itemSlug}/index`
		);
	});
	if (itemPage) {
		itemSlug = itemPage.url;
		if (!itemName) {
			itemName = itemPage.data.title;
		}
		if (this.page.url == itemSlug) {
			itemPageCurrent = true;
		}
	}

	result += `<li class="nav-item">\n`;
	if (itemPageCurrent) {
		result += `<a class="nav-link active" aria-current="page" href="${itemSlug}">${itemName}</a>\n`;
	} else if (itemDisabled) {
		result += `<a class="nav-link disabled" aria-disabled="true">${itemName}</a>\n`;
	} else {
		result += `<a class="nav-link" href="${itemSlug}">${itemName}</a>\n`;
	}
	result += "</li>\n";

	return result;
}

export async function bootstrapNavbarItemDropdown(
	content,
	itemSlug,
	itemName = undefined,
	itemDisabled = false
) {
	let result = "";

	let itemPageCurrent = false;
	let collections = this.ctx.environments.collections.all;

	let itemPage = collections.find((obj) => {
		return (
			obj.filePathStem == itemSlug ||
			obj.filePathStem == `${itemSlug}/index`
		);
	});
	if (itemPage) {
		itemSlug = itemPage.url;
		if (!itemName) {
			itemName = itemPage.data.title;
		}
		if (this.page.url == itemSlug) {
			itemPageCurrent = true;
		}
	}

	result += `<li class="nav-item dropdown">\n`;
	if (itemPageCurrent) {
		result += `<a class="nav-link dropdown-toggle active" role="button" aria-current="page" data-bs-toggle="dropdown" aria-expanded="false" href="${itemSlug}">${itemName}</a>\n`;
	} else if (itemDisabled) {
		result += `<a class="nav-link dropdown-toggle disabled" role="button" aria-disabled="true" data-bs-toggle="dropdown" aria-expanded="false">${itemName}</a>\n`;
	} else {
		result += `<a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false" href="${itemSlug}">${itemName}</a>\n`;
	}
	result += `<ul class="dropdown-menu">\n`;
	result += content;
	result += "</ul>\n";
	result += "</li>\n";

	return result;
}

export async function bootstrapNavbarItemDropdownItem(
	itemSlug,
	itemName,
	itemDisabled
) {
	let result = "";

	let itemPageCurrent = false;
	let collections = this.ctx.environments.collections.all;

	let itemPage = collections.find((obj) => {
		return (
			obj.filePathStem == itemSlug ||
			obj.filePathStem == `${itemSlug}/index`
		);
	});
	if (itemPage) {
		itemSlug = itemPage.url;
		if (!itemName) {
			itemName = itemPage.data.title;
		}
		if (this.page.url == itemSlug) {
			itemPageCurrent = true;
		}
	}

	result += `<li>\n`;
	if (itemPageCurrent) {
		result += `<a class="dropdown-item active" aria-current="page" href="${itemSlug}">${itemName}</a>\n`;
	} else if (itemDisabled) {
		result += `<a class="dropdown-item disabled" aria-disabled="true">${itemName}</a>\n`;
	} else {
		result += `<a class="dropdown-item" href="${itemSlug}">${itemName}</a>\n`;
	}
	result += "</li>\n";

	return result;
}
