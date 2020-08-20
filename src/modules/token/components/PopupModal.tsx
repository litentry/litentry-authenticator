import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import TransparentBackground from 'components/TransparentBackground';
import colors from 'styles/colors';
import fontStyles from 'styles/fontStyles';

export default function PopupModal({
	title,
	visible,
	setVisible,
	innerComponent
}: {
	title: string;
	visible: boolean;
	setVisible: (shouldVisible: boolean) => void;
	innerComponent: React.ReactElement;
}): React.ReactElement {
	return (
		<TransparentBackground
			style={styles.optionsWrapper}
			visible={visible}
			setVisible={setVisible}
			animationType="fade"
		>
			<View style={styles.optionsBackground}>
				<View style={{ ...styles.optionWrapper, borderTopWidth: 0 }}>
					<Text style={fontStyles.h2}>{title}</Text>
				</View>
				{innerComponent}
			</View>
		</TransparentBackground>
	);
}

const styles = StyleSheet.create({
	body: {
		flex: 1,
		marginBottom: 48,
		marginTop: 24,
		paddingHorizontal: 16
	},
	label: {
		flex: 1,
		marginBottom: 3,
		...fontStyles.t_regular
	},
	optionsBackground: {
		backgroundColor: colors.background.app
	},
	optionsWrapper: {
		justifyContent: 'center'
	},
	optionWrapper: {
		alignItems: 'center',
		justifyContent: 'center',
		borderTopColor: 'black',
		borderTopWidth: 1,
		flexDirection: 'row',
		paddingVertical: 8
	}
});
