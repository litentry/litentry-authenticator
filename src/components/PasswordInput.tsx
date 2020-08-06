import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import testIDs from 'e2e/testIDs';
import TextInput from 'components/TextInput';
import fontStyles from 'styles/fontStyles';
import { passwordRegex } from 'utils/regex';

export default function PasswordInput({
	password,
	setPassword,
	onSubmitEditing
}: {
	password: string;
	setPassword: (newPassword: string) => void;
	onSubmitEditing: () => void;
}): React.ReactElement {
	const onPasswordChange = (newPassword: string): void => {
		if (passwordRegex.test(newPassword)) setPassword(newPassword);
	};
	const [isShow, setShow] = useState<boolean>(false);
	const togglePasswordInput = (): void => setShow(!isShow);

	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={togglePasswordInput}
				style={styles.label}
				testID={testIDs.PathDerivation.togglePasswordButton}
			>
				<Text style={fontStyles.t_regular}>Add Optional Password</Text>
				<Icon
					name={isShow ? 'caretup' : 'caretdown'}
					style={styles.labelIcon}
				/>
			</TouchableOpacity>
			{isShow && (
				<>
					<TextInput
						onChangeText={onPasswordChange}
						testID={testIDs.PathDerivation.passwordInput}
						returnKeyType="done"
						onSubmitEditing={onSubmitEditing}
						placeholder="Optional password"
						value={password}
					/>
					<Text style={styles.hintText}>
						Password will be always needed when signing with this account.
					</Text>
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 16
	},
	hintText: {
		...fontStyles.t_regular,
		paddingHorizontal: 16
	},
	label: {
		alignItems: 'center',
		flexDirection: 'row',
		marginBottom: 3,
		paddingHorizontal: 16
	},
	labelIcon: {
		paddingLeft: 8,
		...fontStyles.t_regular
	}
});
