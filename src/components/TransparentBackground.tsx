import React from 'react';
import {
	Modal,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
	ViewStyle
} from 'react-native';

interface Props {
	animationType: 'none' | 'slide' | 'fade';
	setVisible: (isVisible: boolean) => void;
	style?: ViewStyle;
	testID?: string;
	visible: boolean;
	children: any;
}

export default function TransparentBackground({
	children,
	visible,
	setVisible,
	testID,
	style,
	animationType
}: Props): React.ReactElement {
	return (
		<Modal
			animationType={animationType}
			visible={visible}
			transparent={true}
			onRequestClose={(): void => setVisible(false)}
		>
			<TouchableWithoutFeedback
				style={{ flex: 1 }}
				onPress={(): void => setVisible(false)}
			>
				<View
					testID={testID}
					style={StyleSheet.flatten([styles.container, style])}
				>
					{children}
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'rgba(0,0,0,0.8)',
		flex: 1
	}
});
