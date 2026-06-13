import { Palette } from '../../src/vs/platform/theme/common/colors/palette';
import { Color } from '../../src/vs/base/common/color';
import { UIColor } from './UIColor';

type ColorMode = 'light' | 'dark' | 'hcLight' | 'hcDark';

export function generateUIColors(palette: Palette, mode: ColorMode = 'dark'): UIColor {
	const { red, blue, lime, green, yellow, violet, teal, orange, foreground, background, brandColors, bodyBackground, panelBackground, headerBackground, primaryDivider, secondaryDivider } = palette;

	const modifier = mode === 'light' ? 'lighten' : 'darken';
	const isDark = mode === 'dark' || mode === 'hcDark';

	const secondaryForeground = brandColors.prey400;

	const purple = brandColors.purple500;
	const purpleForeground = isDark ? brandColors.purple300 : brandColors.purple700;

	const border = [
		foreground.transparent(0.2),
		foreground.transparent(0.15),
		foreground.transparent(0.05),
	] as const;
	const overlay = [
		foreground.transparent(0.050),
		foreground.transparent(0.075),
		foreground.transparent(0.100),
	] as const;

	return {
		// Kiro-specific
		//'background.gradientEnd': blue[modifier](0.25).transparent(0.125).toHex(),
		//'background.gradientStart': purple[modifier](0.25).transparent(0.125).toHex(),
		'background': bodyBackground.toHex(),

		'foreground': foreground.toHex(),
		'accent': purpleForeground.toHex(),
		'errorForeground': red.toHex(),
		'icon.foreground': isDark ? brandColors.prey300.toHex() : brandColors.prey500.toHex(),
		'disabledForeground': secondaryForeground.toHex(),
		'textLink.foreground': purpleForeground.toHex(),
		'textLink.activeForeground': blue.toHex(),
		'focusBorder': brandColors.purple400.toHex(),
		'input.background': background[1].toHex(),
		'input.border': primaryDivider.toHex(),
		'inputValidation.errorBorder': red.toHex(),
		'inputValidation.errorBackground': red.toHex(),
		'inputValidation.errorForeground': background[0].toHex(),
		'titleBar.activeBackground': Color.transparent.toHex(),
		'titleBar.inactiveBackground': Color.transparent.toHex(),

		'commandCenter.border': Color.transparent.toHex(),
		'commandCenter.debuggingBackground': purple.transparent(0.75).toHex(),
		'commandCenter.activeBorder': purple.transparent(0.25).toHex(),

		'keybindingLabel.background': overlay[2].toHex(),
		'keybindingLabel.border': Color.transparent.toHex(),
		'keybindingLabel.bottomBorder': overlay[2].toHex(),
		'keybindingLabel.foreground': secondaryForeground.toHex(),
		'keybindingLabel.shadow': Color.transparent.toHex(),

		'pickerGroup.foreground': purple.toHex(),

		// These are toggle buttons, you can see them in search options
		'inputOption.activeBackground': brandColors.purple600.toHex(),
		'inputOption.activeBorder': Color.transparent.toHex(),
		'inputOption.activeForeground': brandColors.white.toHex(),
		'inputOption.hoverBackground': background[1].toHex(),

		'checkbox.background': background[1].toHex(),
		'checkbox.border': primaryDivider.toHex(),
		'checkbox.foreground': purple.toHex(),

		'toolbar.hoverBackground': background[2].toHex(),

		'badge.background': blue.transparent(0.25).toHex(),
		'badge.foreground': blue.toHex(),

		'activityBarBadge.background': brandColors.purple700.toHex(),
		'activityBarBadge.foreground': brandColors.white.toHex(),
		'activityBar.background': headerBackground.toHex(),
		'activityBar.foreground': purpleForeground.toHex(),
		'activityBar.activeBorder': Color.transparent.toHex(),
		'activityBar.inactiveForeground': isDark ? brandColors.prey300.toHex() : brandColors.prey500.toHex(),
		'activityBar.activeBackground': isDark ? brandColors.purple500.transparent(0.25).toHex() : brandColors.purple500.transparent(0.15).toHex(),
		'activityBar.border': primaryDivider.toHex(),
		//'activityBar.activeGradientEnd': purple.toHex(),

		'editor.background': panelBackground.toHex(),
		'editor.foreground': foreground.toHex(),
		'editorInfo.foreground': blue.toHex(),
		'editorWarning.foreground': orange.toHex(),

		'editorGroupHeader.tabsBackground': headerBackground.toHex(),
		'editorGroupHeader.tabsBorder': primaryDivider.toHex(),
		'editorGroupHeader.border': Color.transparent.toHex(),
		'editorGroup.border': primaryDivider.toHex(),
		'tab.border': primaryDivider.toHex(),
		'tab.activeBorder': panelBackground.toHex(),
		'tab.activeBorderTop': purpleForeground.toHex(),
		'tab.activeBackground': headerBackground.toHex(),
		'tab.activeForeground': foreground.toHex(),
		'tab.inactiveBackground': headerBackground.toHex(),
		'tab.inactiveForeground': secondaryForeground.toHex(),

		'symbolIcon.variableForeground': red.toHex(),
		'symbolIcon.functionForeground': blue.toHex(),
		'symbolIcon.classForeground': orange.toHex(),
		'symbolIcon.arrayForeground': violet.toHex(),
		'symbolIcon.propertyForeground': secondaryForeground.toHex(),
		'symbolIcon.interfaceForeground': purple.toHex(),
		'symbolIcon.typeParameterForeground': purple.toHex(),

		'welcomePage.background': panelBackground.toHex(),
		'welcomePage.tileBackground': isDark ? brandColors.prey900.toHex() : brandColors.prey100.toHex(),
		'welcomePage.progress.background': background[1].toHex(),
		'welcomePage.progress.foreground': blue.toHex(),

		// Loader color
		'progressBar.background': brandColors.purple700.toHex(),

		'editorWidget.background': background[1].toHex(),
		'editorWidget.border': Color.transparent.toHex(),
		'editorHoverWidget.background': background[2].toHex(),
		'editorHoverWidget.border': Color.transparent.toHex(),

		'widget.shadow': isDark ? background[0].toHex() : foreground.transparent(0.25).toHex(),
		'widget.border': border[0].toHex(),

		'button.background': brandColors.purple700.toHex(),
		'button.separator': background[0].transparent(0.25).toHex(),
		'button.hoverBackground': isDark ? brandColors.purple500.toHex() : brandColors.purple800.toHex(),
		'button.foreground': brandColors.prey100.toHex(),
		'button.secondaryBackground': overlay[1].toHex(),
		'button.secondaryHoverBackground': purple.transparent(0.25).toHex(),
		'button.secondaryForeground': foreground.toHex(),
		// Kiro-specific
		//'button.gradient': blue.transparent(0.5).toHex(),

		'notifications.background': background[1].toHex(),
		'notifications.border': Color.transparent.toHex(),
		'notificationsInfoIcon.foreground': blue.toHex(),
		'notificationsErrorIcon.foreground': red.toHex(),
		'notificationsWarningIcon.foreground': orange.toHex(),

		'sideBar.background': panelBackground.toHex(),
		'sideBar.foreground': foreground.toHex(),
		'sideBarSectionHeader.background': panelBackground.toHex(),
		'sideBarSectionHeader.border': secondaryDivider.toHex(),
		'sideBarTitle.background': headerBackground.toHex(),
		'sideBarTitle.border': primaryDivider.toHex(),

		'list.activeSelectionBackground': background[2].toHex(),
		'list.activeSelectionForeground': foreground.toHex(),
		'list.inactiveSelectionBackground': background[2].toHex(),
		'list.focusBackground': blue.transparent(0.25).toHex(),
		'list.focusOutline': Color.transparent.toHex(),
		'list.errorForeground': red.toHex(),
		'list.warningForeground': orange.toHex(),

		// This will affect the list items in the sidebar as well as
		// hovering over a toast notification!
		'list.hoverBackground': overlay[0].toHex(),
		'list.hoverForeground': foreground.toHex(),

		'quickInput.background': panelBackground.toHex(),
		'quickInput.overlayBackground': bodyBackground.transparent(0.5).toHex(),
		'quickInputList.focusForeground': foreground.toHex(),
		'quickInputList.focusBackground': background[2].toHex(),

		'tree.inactiveIndentGuidesStroke': Color.transparent.toHex(),
		'tree.indentGuidesStroke': Color.transparent.toHex(),

		'panel.background': panelBackground.toHex(),
		'panel.border': Color.transparent.toHex(),
		'panelTitle.activeBorder': Color.transparent.toHex(),
		'panelTitle.activeForeground': foreground.toHex(),
		'panelTitle.activeBackground': background[2].toHex(),
		'panelTitle.inactiveForeground': secondaryForeground.toHex(),

		'titleBar.border': Color.transparent.toHex(),
		'statusBar.background': Color.transparent.toHex(),
		'statusBar.debuggingBackground': purple.transparent(0.25).toHex(),
		'statusBar.noFolderBackground': Color.transparent.toHex(),
		'statusBar.foreground': isDark ? brandColors.prey400.toHex() : brandColors.prey500.toHex(),
		'statusBarItem.remoteForeground': isDark ? brandColors.prey400.toHex() : brandColors.prey500.toHex(),
		'statusBarItem.remoteBackground': Color.transparent.toHex(),
		'statusBarItem.hoverBackground': overlay[1].toHex(),
		'statusBarItem.hoverForeground': foreground.toHex(),

		'editorLineNumber.activeForeground': foreground.transparent(0.6).toHex(),
		'editorLineNumber.foreground': foreground.transparent(0.4).toHex(),
		'editorLineNumber.dimmedForeground': foreground.transparent(0.3).toHex(),

		'editor.lineHighlightBorder': Color.transparent.toHex(),
		'editor.lineHighlightBackground': overlay[0].toHex(),
		'editor.selectionBackground': isDark ? brandColors.purple200.transparent(0.25).toHex() : brandColors.purple700.transparent(0.125).toHex(),
		'editor.selectionHighlightBackground': Color.transparent.toHex(),
		'editor.wordHighlightBackground': blue.transparent(0.125).toHex(),
		'editor.rangeHighlightBackground': blue.transparent(0.125).toHex(),
		'editor.findMatchHighlightBackground': purpleForeground.transparent(0.25).toHex(),

		'editorBracketHighlight.foreground1': orange.toHex(),
		'editorBracketHighlight.foreground2': yellow.toHex(),
		'editorBracketHighlight.foreground3': lime.toHex(),

		// This is actually a border color
		'editorIndentGuide.background': border[2].toHex(),
		'editorIndentGuide.activeBackground1': border[1].toHex(),

		'editorGutter.background': Color.transparent.toHex(),
		'editorGutter.addedBackground': green.transparent(0.75).toHex(),
		'editorGutter.deletedBackground': red.transparent(0.75).toHex(),
		'editorGutter.modifiedBackground': purpleForeground.transparent(0.75).toHex(),
		'editorError.foreground': red.transparent(0.75).toHex(),
		'editorLightBulb.foreground': yellow.toHex(),
		'editorLightBulbAutoFix.foreground': lime.toHex(),

		'editorSuggestWidget.selectedBackground': background[2].toHex(),

		'minimap.errorHighlight': red.transparent(0.5).toHex(),
		'minimap.infoHighlight': blue.transparent(0.5).toHex(),
		'minimap.findMatchHighlight': purpleForeground.transparent(0.5).toHex(),
		'minimap.selectionHighlight': purpleForeground.transparent(0.25).toHex(),
		'minimap.selectionOccurrenceHighlight': purpleForeground.toHex(),
		'minimap.foregroundOpacity': foreground.transparent(0.25).toHex(),

		'gitDecoration.deletedResourceForeground': lime.toHex(),

		'problemsErrorIcon.foreground': red.toHex(),
		'problemsWarningIcon.foreground': orange.toHex(),
		'problemsInfoIcon.foreground': blue.toHex(),

		'scmGraph.historyItemRefColor': blue.toHex(),
		'scmGraph.historyItemHoverLabelForeground': background[0].toHex(),
		'scmGraph.historyItemBaseRefColor': blue.toHex(),
		'scmGraph.historyItemRemoteRefColor': purple.toHex(),

		'gitDecoration.modifiedResourceForeground': orange.toHex(),
		'gitDecoration.untrackedResourceForeground': green.toHex(),
		'gitDecoration.ignoredResourceForeground': secondaryForeground.toHex(),
		'gitDecoration.conflictingResourceForeground': red.toHex(),

		'terminal.ansiGreen': green.toHex(),
		'terminal.ansiRed': red.toHex(),
		'terminal.ansiYellow': yellow.toHex(),
		'terminal.ansiBlue': blue.toHex(),
		'terminal.ansiCyan': teal.toHex(),
		'terminal.ansiMagenta': purple.toHex(),
		'terminal.ansiBrightGreen': green.toHex(),
		'terminal.ansiBrightYellow': yellow.toHex(),
		'terminal.ansiBrightBlue': blue.toHex(),
		'terminal.ansiBrightCyan': teal.toHex(),
		'terminal.ansiBrightRed': red.toHex(),
		'terminal.ansiBrightMagenta': purple.toHex(),
		'terminal.ansiBrightBlack': foreground.transparent(0.25).toHex(),

		'diffEditor.insertedLineBackground': green.transparent(0.125).toHex(),
		'diffEditor.insertedTextBackground': green.transparent(0.125).toHex(),
		'diffEditor.removedLineBackground': red.transparent(0.125).toHex(),
		'diffEditor.removedTextBackground': red.transparent(0.125).toHex(),

		'debugToolBar.background': background[2].toHex(),
		'debugIcon.restartForeground': green.toHex(),
		'debugIcon.startForeground': green.toHex(),
		'debugIcon.stopForeground': red.toHex(),
		'debugIcon.continueForeground': blue.toHex(),
		'debugIcon.pauseForeground': blue.toHex(),

		// This is the show on scrollable lists
		'scrollbar.shadow': background[0].toHex(),

		'dropdown.background': background[1].toHex(),
		'dropdown.border': primaryDivider.toHex(),
		'settings.dropdownBackground': background[1].toHex(),
		'settings.dropdownBorder': primaryDivider.toHex(),

		'extensionButton.background': brandColors.purple700.toHex(),
		'extensionButton.hoverBackground': brandColors.purple500.toHex(),
		'extensionButton.foreground': brandColors.white.toHex(),
		'extensionButton.prominentBackground': brandColors.purple700.toHex(),
		'extensionButton.prominentHoverBackground': brandColors.purple500.toHex(),
		'extensionButton.prominentForeground': brandColors.white.toHex(),

		'textPreformat.foreground': secondaryForeground.toHex(),
		'textPreformat.background': overlay[2].toHex(),

		'peekViewTitle.background': background[1].toHex(),
		'multiDiffEditor.headerBackground': background[1].toHex(),
	};
}
