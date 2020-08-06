import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import TextInput from './TextInput';

import colors from 'styles/colors';
import fonts from 'styles/fonts';

export default function DerivationPasswordVerify(props: {
	password: string;
}): React.ReactElement {
	const { password } = props;
	const [enteredPassword, setEnteredPassword] = useState('');
	const [verifyField, setVerifyField] = useState(false);
	const isMatching = enteredPassword === password;

	const toggleVerifyField = (): void => {
		setVerifyField(!verifyField);
	};

	return (
		<>
			<TouchableOpacity onPress={toggleVerifyField}>
				<Text style={styles.passwordText}>
					<Icon name={'info'} size={14} color={colors.text.faded} /> This
					account countains a derivation password.{' '}
					<Text style={styles.link} onPress={toggleVerifyField}>
						Verify it here
					</Text>
					<Icon
						name={verifyField ? 'arrow-drop-up' : 'arrow-drop-down'}
						size={20}
					/>
				</Text>
			</TouchableOpacity>
			{verifyField && (
				<TextInput
					onChangeText={setEnteredPassword}
					placeholder="derivation password"
					style={isMatching ? styles.validInput : styles.invalidInput}
				/>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	invalidInput: {
		backgroundColor: '#fee3e3'
	},
	link: {
		textDecorationLine: 'underline'
	},
	passwordText: {
		color: colors.text.faded,
		fontFamily: fonts.regular,
		fontSize: 18,
		marginBottom: 10,
		marginTop: 20,
		paddingBottom: 0
	},
	validInput: {
		backgroundColor: '#e4fee4'
	}
});
