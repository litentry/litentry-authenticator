import React from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	TouchableNativeFeedback,
	TouchableNativeFeedbackProps,
	TouchableOpacity,
	View
} from 'react-native';

import colors from 'styles/colors';
import fontStyles from 'styles/fontStyles';

export default function LabelTextCard(props: {
	text: string;
	label: string;
	small?: boolean;
	onPress?: () => any;
}): React.ReactElement {
	const Touchable: React.ComponentClass<TouchableNativeFeedbackProps> =
		Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

	const { label, small, text, onPress } = props;
	return (
		<Touchable
			style={styles.body}
			disabled={onPress === undefined}
			onPress={onPress ? onPress : () => 1}
		>
			<View style={styles.label}>
				<Text style={fontStyles.t_important}>{label}</Text>
			</View>
			<View style={styles.content}>
				<Text style={small ? fontStyles.t_codeS : fontStyles.t_code}>
					{text}
				</Text>
			</View>
		</Touchable>
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
