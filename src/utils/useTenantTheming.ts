import { useContext, useEffect, useState } from 'react';
import { apiGetTenantTheming } from '../api/apiGetTenantTheming';
import { TenantContext } from '../globalState';
import { config } from '../resources/scripts/config';
import getLocationVariables from './getLocationVariables';

const RGBToHSL = (r, g, b) => {
	// Make r, g, and b fractions of 1
	r /= 255;
	g /= 255;
	b /= 255;

	// Find greatest and smallest channel values
	let cmin = Math.min(r, g, b),
		cmax = Math.max(r, g, b),
		delta = cmax - cmin,
		h,
		s,
		l;

	// Calculate hue
	// No difference
	if (delta === 0) h = 0;
	// Red is max
	else if (cmax === r) h = ((g - b) / delta) % 6;
	// Green is max
	else if (cmax === g) h = (b - r) / delta + 2;
	// Blue is max
	else h = (r - g) / delta + 4;

	h = Math.round(h * 60);

	// Make negative hues positive behind 360°
	if (h < 0) h += 360;

	// Calculate lightness
	l = (cmax + cmin) / 2;

	// Calculate saturation
	s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

	// Multiply l and s by 100
	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	return { h, s, l };
};

const hexToRGB = (hex) => {
	let r = '0',
		g = '0',
		b = '0';

	// 3 digits
	if (hex.length === 4) {
		r = '0x' + hex[1] + hex[1];
		g = '0x' + hex[2] + hex[2];
		b = '0x' + hex[3] + hex[3];

		// 6 digits
	} else if (hex.length === 7) {
		r = '0x' + hex[1] + hex[2];
		g = '0x' + hex[3] + hex[4];
		b = '0x' + hex[5] + hex[6];
	}

	return RGBToHSL(r, g, b);
};

/**
 * adjusting colors via lightness, for hover effects, etc.
 * @param color {object}
 * @param adjust {number}
 * @return {string}
 */
const adjustHSLColor = ({
	color,
	adjust
}: {
	color: Record<string, any>;
	adjust: number;
}): string => {
	return `hsl(${color.h}, ${color.s}%, ${adjust}%)`;
};

const injectCss = ({ primaryColor, secondaryColor }) => {
	// make HSL colors over RGB from hex
	const primaryHSL = hexToRGB(primaryColor);
	const secondaryHSL = hexToRGB(secondaryColor);
	const contrastThreshold = 40;

	document.head.insertAdjacentHTML(
		'beforeend',
		`<style>
		:root {
		--skin-color-primary: ${primaryColor};
		--skin-color-primary-hover: ${
			primaryHSL.l < contrastThreshold
				? adjustHSLColor({
						color: primaryHSL,
						adjust: primaryHSL.l + 10
				  }) // lighter
				: adjustHSLColor({
						color: primaryHSL,
						adjust: primaryHSL.l - 1
				  }) // darker
		};
		--skin-color-secondary: ${secondaryColor};
		--skin-color-secondary-light: ${adjustHSLColor({
			color: secondaryHSL,
			adjust: 90
		})};
		
		--text-color-contrast-switch: ${
			primaryHSL.l < contrastThreshold
				? 'var(--skin-color-link-light)'
				: 'var(--skin-color-link-dark)'
		};
		}
		
		/* Text-links must be underlined in case we use the default color */
		a {
			text-decoration: underline;
			color: var(--skin-color-link);
		}
		a:hover {
			color: var(--skin-color-link-hover);
		}

		</style>`
	);
};

const useTenantTheming = () => {
	const { tenant, setTenant } = useContext(TenantContext);
	const { subdomain } = getLocationVariables();
	const [isLoadingTenant, setIsLoadingTenant] = useState(
		config.enableTenantTheming
	);

	useEffect(() => {
		if (!subdomain || !config.enableTenantTheming) {
			setIsLoadingTenant(false);
			return;
		}

		apiGetTenantTheming({ subdomain })
			.then((tenant) => {
				setTenant(tenant);
			})
			.catch((error) => {
				console.log('Theme could not be loaded', error);
			})
			.finally(() => {
				setIsLoadingTenant(false);
			});
	}, [setTenant, subdomain]);

	useEffect(() => {
		if (!tenant?.theming) return;

		injectCss(tenant.theming);
	}, [tenant?.theming]);

	return isLoadingTenant;
};

export default useTenantTheming;
