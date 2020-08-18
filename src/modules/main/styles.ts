import { StyleSheet } from 'react-native';

import colors from 'styles/colors';
import fonts from 'styles/fonts';

const styles = StyleSheet.create({
	onBoardingText: {
		fontFamily: fonts.bold,
		color: colors.text.faded,
		fontSize: 34
	},
	onBoardingWrapper: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	scrollContent: {
		flex: 1,
		justifyContent: 'center',
		padding: 16,
		paddingBottom: 100
	}
});

export default styles;
