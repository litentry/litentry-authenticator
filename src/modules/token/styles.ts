import colors from 'styles/colors';
import fontStyles from 'styles/fontStyles';

export const i_arrowOptions = {
	iconColor: colors.signal.main,
	iconName: 'arrowright',
	iconSize: fontStyles.i_extra_large.fontSize,
	iconType: 'antdesign',
	style: {
		paddingLeft: 64,
		paddingTop: 0
	},
	textStyle: { ...fontStyles.a_text, color: colors.signal.main }
};
