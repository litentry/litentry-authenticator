import React, { useState } from 'react';
import {
	StyleSheet,
	Text,
	TextStyle,
	TouchableOpacity,
	View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import TextInput from './TextInput';

import { parseDerivationPath } from 'utils/suri';
import colors from 'styles/colors';
import fontStyles from 'styles/fontStyles';

export default function DerivationPathField(props: {
	onChange: (derivationEvent: {
		derivationPassword: string;
		derivationPath: string;
		isDerivationPathValid: boolean;
	}) => void;
	styles: {
		title: TextStyle;
	};
}): React.ReactElement {
	const { onChange, styles } = props;
	const [showAdvancedField, setShowAdvancedField] = useState(true);
	const [isValidPath, setIsValidPath] = useState(true);

	const toggleShowAdvancedField = (): void => {
		setShowAdvancedField(!showAdvancedField);
	};

	return (
		<>
			<TouchableOpacity onPress={toggleShowAdvancedField}>
				<View style={{ justifyContent: 'center' }}>
					<Text
						style={StyleSheet.flatten([styles.title, ownStyles.advancedText])}
					>
						ADVANCED
						<Icon
							name={showAdvancedField ? 'arrow-drop-up' : 'arrow-drop-down'}
							size={20}
						/>
					</Text>
				</View>
			</TouchableOpacity>
			{showAdvancedField && (
				<TextInput
					onChangeText={(text: string): void => {
						try {
							const derivationPath = parseDerivationPath(text);

							onChange({
								derivationPassword: derivationPath.password || '',
								derivationPath: derivationPath.derivePath || '',
								isDerivationPathValid: true
							});
							setIsValidPath(true);
						} catch (e) {
							// wrong derivationPath
							onChange({
								derivationPassword: '',
								derivationPath: '',
								isDerivationPathValid: false
							});
							setIsValidPath(false);
						}
					}}
					placeholder="optional derivation path"
					style={StyleSheet.flatten([
						fontStyles.h2,
						isValidPath ? {} : ownStyles.invalidInput
					])}
				/>
			)}
		</>
	);
}

const ownStyles = StyleSheet.create({
	advancedText: {
		paddingBottom: 0,
		paddingTop: 20
	},
	invalidInput: {
		borderBottomColor: colors.signal.error
	}
});
