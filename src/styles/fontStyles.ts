import { StyleSheet } from 'react-native';

import fonts from './fonts';
import colors from './colors';

export default StyleSheet.create({
	a_button: {
		color: colors.background.app,
		fontFamily: fonts.robotoMonoMedium,
		fontSize: 20
	},
	a_text: {
		color: colors.text.main,
		fontFamily: fonts.robotoMono,
		fontSize: 12,
		letterSpacing: 0.4
	},
	h1: {
		color: colors.text.main,
		fontFamily: fonts.robotoBold,
		fontSize: 22
	},
	h2: {
		color: colors.text.main,
		fontFamily: fonts.robotoMedium,
		fontSize: 18
	},
	h_subheading: {
		color: colors.text.main,
		fontFamily: fonts.roboto,
		fontSize: 14,
		textTransform: 'uppercase'
	},
	i_large: {
		fontSize: 22
	},
	i_medium: {
		fontSize: 18
	},
	i_small: {
		fontSize: 10
	},
	quote: {
		color: colors.text.main,
		fontFamily: fonts.robotoLight,
		fontSize: 28
	},
	t_big: {
		color: colors.text.main,
		fontFamily: fonts.roboto,
		fontSize: 16
	},
	t_code: {
		color: colors.text.main,
		fontFamily: fonts.robotoMono,
		fontSize: 15
	},
	t_codeS: {
		color: colors.text.main,
		fontFamily: fonts.robotoMono,
		fontSize: 11,
		letterSpacing: 0.2
	},
	t_important: {
		color: colors.text.main,
		fontFamily: fonts.robotoBold,
		fontSize: 13
	},
	t_label: {
		backgroundColor: colors.signal.main,
		color: colors.text.main,
		fontFamily: fonts.robotoMedium,
		fontSize: 13
	},
	t_prefix: {
		color: colors.text.main,
		fontFamily: fonts.roboto,
		fontSize: 14,
		textTransform: 'uppercase'
	},
	t_regular: {
		color: colors.text.main,
		fontFamily: fonts.roboto,
		fontSize: 12
	},
	t_seed: {
		borderColor: colors.background.card,
		borderWidth: 0.8,
		color: colors.signal.main,
		fontFamily: fonts.light,
		fontSize: 18,
		letterSpacing: 0.7,
		lineHeight: 23,
		minHeight: 100,
		paddingHorizontal: 16,
		paddingVertical: 10
	}
});
