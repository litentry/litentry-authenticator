import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import colors from 'styles/colors';
import fontStyles from 'styles/fontStyles';

export default function LabelTextCard(props: {
	text: string;
	label: string;
	small?: boolean;
}): React.ReactElement {
	const { label, small, text } = props;
	return (
		<View style={styles.body}>
			<View style={styles.label}>
				<Text style={fontStyles.t_important}>{label}</Text>
			</View>
			<View style={styles.content}>
				<Text style={small ? fontStyles.t_codeS : fontStyles.t_code}>
					{text}
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	body: {
		backgroundColor: colors.background.app,
		flexDirection: 'row'
	},
	content: {
		alignItems: 'flex-start',
		flex: 3,
		justifyContent: 'center',
		padding: 20
	},
	label: {
		alignItems: 'flex-start',
		flex: 1,
		justifyContent: 'center',
		padding: 20
	}
});
