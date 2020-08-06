import React, { MutableRefObject } from 'react';
import { KeyboardTypeOptions, StyleSheet, TextInputProps } from 'react-native';

import TextInput from 'components/TextInput';
import fontStyles from 'styles/fontStyles';
import colors from 'styles/colors';

interface PinInputProps extends TextInputProps {
	label: string;
	focus?: boolean;
	keyboardType?: KeyboardTypeOptions;
	ref?: MutableRefObject<TextInput | null>;
}

export default function PinInput(props: PinInputProps): React.ReactElement {
	return (
		<TextInput
			keyboardAppearance="dark"
			editable
			keyboardType={props.keyboardType ?? 'numeric'}
			multiline={false}
			autoCorrect={false}
			numberOfLines={1}
			returnKeyType="next"
			secureTextEntry
			{...props}
			style={StyleSheet.flatten([
				fontStyles.t_seed,
				styles.pinInput,
				{ fontSize: 18 },
				props.style
			])}
		/>
	);
}

const styles = StyleSheet.create({
	pinInput: {
		borderBottomColor: colors.border.light,
		borderColor: colors.border.light,
		minHeight: 48,
		paddingLeft: 10,
		paddingRight: 10
	}
});
