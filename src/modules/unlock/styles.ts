import { StyleSheet } from 'react-native';

import colors from 'styles/colors';

const styles = StyleSheet.create({
	body: {
		backgroundColor: colors.background.app,
		flex: 1,
		overflow: 'hidden'
	},
	pinInput: {
		borderBottomColor: colors.border.light,
		borderColor: colors.border.light,
		minHeight: 48,
		paddingLeft: 10,
		paddingRight: 10
	}
});

export default styles;
