import { Palette } from '../../src/vs/platform/theme/common/colors/palette';
import { TokenColor, TokenColorSetting } from './TokenColor';

function tokenColor(scope: string | string[], settings: TokenColorSetting) {
	return {
		scope,
		settings
	};
}

export function generateTokenColors(palette: Palette): TokenColor[] {
	const { pink, red, blue, yellow, purple, teal, orange, green, violet, foreground } = palette;
	const light = foreground.transparent(0.8);
	const lighter = foreground.transparent(0.6);

	// TODO: We should get these colors from the brand colors eventually but need to
	//       adjust colors slightly beforehand to make them pop more for syntax highlighting
	// const pink = isDark ? brandColors.pink300 : brandColors.pink500;
	// const red = isDark ? brandColors.red300 : brandColors.red600;
	// const blue = isDark ? brandColors.blue200 : brandColors.blue700;
	// const yellow = isDark ? brandColors.yellow100 : brandColors.yellow500;
	// const purple = isDark ? brandColors.purple200 : brandColors.purple700;
	// const teal = isDark ? brandColors.teal200 : brandColors.teal500;
	// const orange = isDark ? brandColors.orange200 : brandColors.orange500;
	// const green = isDark ? brandColors.green300 : brandColors.green600;

	return [
		tokenColor('comment', {
			foreground: lighter.toHex()
		}),
		tokenColor([
			'comment.line',
			'comment.block.documentation',
		], {
			foreground: lighter.toHex(),
			fontStyle: 'italic'
		}),
		tokenColor('constant.language.boolean.false', {
			foreground: red.toHex()
		}),
		tokenColor('constant.language.boolean.true', {
			foreground: red.toHex()
		}),
		tokenColor('constant.language.import-export-all', {
			foreground: blue.toHex()
		}),
		tokenColor('constant.language.null', {
			foreground: red.toHex()
		}),
		tokenColor('constant.language.symbol', {
			foreground: pink.toHex()
		}),
		tokenColor('constant.numeric', {
			foreground: pink.lighten(0.125).toHex()
		}),
		tokenColor('entity.name.tag', {
			foreground: blue.toHex()
		}),
		tokenColor('entity.name.tag.reference', {
			foreground: purple.lighten(0.125).toHex()
		}),
		tokenColor('entity.name.tag.yaml', {
			foreground: orange.toHex()
		}),
		tokenColor('entity.name.type.module', {
			foreground: orange.toHex()
		}),
		tokenColor('entity.name.function', {
			foreground: blue.toHex()
		}),
		tokenColor('entity.other.attribute-name.id', {
			foreground: orange.toHex()
		}),
		tokenColor('entity.other.attribute-name.class', {
			foreground: yellow.toHex()
		}),
		tokenColor('entity.other.attribute-name', {
			foreground: orange.toHex()
		}),
		tokenColor('keyword', {
			foreground: purple.lighten(0.125).toHex()
		}),
		tokenColor([
			'keyword.control',
			'keyword.control.import',
			'keyword.control.from',
			'keyword.control.flow',
		], {
			foreground: purple.toHex()
		}),
		tokenColor([
			'keyword.operator',
			'keyword.operator.logical'
		], {
			foreground: light.toHex()
		}),
		tokenColor([
			'keyword.unit',
			'keyword.other.unit'
		], {
			foreground: pink.lighten(0.125).toHex()
		}),
		tokenColor([
			'markup.bold'
		], {
			foreground: purple.toHex()
		}),
		tokenColor([
			'markup.italic'
		], {
			foreground: blue.toHex(),
			fontStyle: 'italic'
		}),
		tokenColor([
			'markup.fenced_code'
		], {
			foreground: light.toHex()
		}),
		tokenColor([
			'markup.heading'
		], {
			foreground: light.toHex(),
			fontStyle: 'bold'
		}),
		tokenColor([
			'markup.quote'
		], {
			foreground: light.toHex(),
			fontStyle: 'italic'
		}),
		tokenColor([
			'markup.underline_link'
		], {
			foreground: teal.toHex()
		}),
		tokenColor([
			'meta.class'
		], {
			foreground: pink.toHex()
		}),
		tokenColor([
			'meta.jsx.children'
		], {
			foreground: light.toHex()
		}),
		tokenColor([
			'meta.object'
		], {
			foreground: teal.toHex()
		}),
		tokenColor([
			'meta.property-name.css'
		], {
			foreground: violet.toHex()
		}),
		tokenColor([
			'meta.property-value.css'
		], {
			foreground: violet.toHex()
		}),
		tokenColor([
			'meta.selector'
		], {
			foreground: green.toHex()
		}),
		tokenColor([
			'meta.structure.dictionary'
		], {
			foreground: violet.toHex()
		}),
		tokenColor([
			'meta.tag.attributes'
		], {
			foreground: teal.toHex()
		}),
		tokenColor([
			'meta.type.parameters'
		], {
			foreground: violet.lighten(0.125).toHex()
		}),
		tokenColor([
			'meta.var.expr'
		], {
			foreground: violet.lighten(0.125).toHex()
		}),
		tokenColor([
			'punctuation.accessor',
			'punctuation.definition.array',
			'punctuation.definition.block',
			'punctuation.definition.dictionary',
			'punctuation.definition.parameters',
			'punctuation.definition.tag',
			'punctuation.definition.typeparameters',
			'punctuation.separator'
		], {
			foreground: light.toHex()
		}),
		tokenColor([
			'punctuation.definition.heading'
		], {
			foreground: orange.toHex()
		}),
		tokenColor([
			'punctuation.definition.string'
		], {
			foreground: green.toHex()
		}),
		tokenColor([
			'punctuation.definition.template-expression'
		], {
			foreground: red.toHex()
		}),
		tokenColor([
			'punctuation.selection',
			'punctuation.terminator'
		], {
			foreground: lighter.toHex()
		}),
		tokenColor([
			'storage'
		], {
			foreground: purple.toHex()
		}),
		tokenColor([
			'string'
		], {
			foreground: green.toHex()
		}),
		tokenColor([
			'support.class',
			'support.class.component'
		], {
			foreground: pink.toHex()
		}),
		tokenColor([
			'support.constant.color',
			'support.constant.font-name',
			'support.constant.property-value'
		], {
			foreground: blue.lighten(0.125).toHex()
		}),
		tokenColor([
			'support.function'
		], {
			foreground: violet.lighten(0.125).toHex()
		}),
		tokenColor([
			'support.type.property-name'
		], {
			foreground: purple.lighten(0.125).toHex()
		}),
		tokenColor([
			'support.type.property-name.css'
		], {
			foreground: light.toHex()
		}),
		tokenColor([
			'support.type.vendored'
		], {
			foreground: yellow.toHex()
		}),
		tokenColor([
			'variable'
		], {
			foreground: teal.toHex()
		}),
		tokenColor([
			'variable.language.super'
		], {
			foreground: green.lighten(0.125).toHex(),
			fontStyle: 'italic'
		}),
		tokenColor([
			'variable.language.this'
		], {
			foreground: teal.lighten(0.125).toHex(),
			fontStyle: 'italic'
		}),
	];
}
