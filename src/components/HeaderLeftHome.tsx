import React from 'react';
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';

import iconLogo from 'res/img/litentry.png';
import colors from 'styles/colors';
import fonts from 'styles/fonts';

export default class HeaderLeftHome extends React.PureComponent<{
	style?: ViewStyle;
}> {
	render(): React.ReactElement {
		return (
			<View
				style={{
					alignItems: 'center',
					flexDirection: 'row',
					height: 48,
					paddingLeft: 15
				}}
			>
				<Image source={iconLogo} style={styles.logo} />
				<Text style={[styles.headerTextLeft, styles.t_bold]}>Litentry</Text>
				<Text style={styles.headerTextLeft}>Authenticator</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	headerTextLeft: {
		color: colors.text.main,
		fontFamily: fonts.light,
		fontSize: 14,
		marginRight: 2,
		marginTop: 15
	},
	logo: {
		height: 24,
		marginLeft: -8,
		marginTop: 5,
		width: 24
	},
	t_bold: {
		fontFamily: fonts.semiBold
	}
});
