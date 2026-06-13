import * as fs from 'fs';
import { LightPalette, DarkPalette } from '../../src/vs/platform/theme/common/colors/palette';
import { generateUIColors } from './generateUIColors';
import { generateTokenColors } from './generateTokenColors';

const darkTheme = {
	name: 'Kiro Dark',
	type: 'dark',
	colors: generateUIColors(DarkPalette),
	tokenColors: generateTokenColors(DarkPalette),
};

const lightTheme = {
	name: 'Kiro Light',
	type: 'light',
	colors: generateUIColors(LightPalette, 'light'),
	tokenColors: generateTokenColors(LightPalette),
};

fs.writeFileSync('themes/dark_default.json', JSON.stringify(darkTheme, null, 2));
fs.writeFileSync('themes/light_default.json', JSON.stringify(lightTheme, null, 2));
