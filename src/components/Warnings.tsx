import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import colors from 'styles/colors';
import fonts from 'styles/fonts';

export function UnknownAccountWarning({
	isPath
}: {
	isPath?: boolean;
}): React.ReactElement {
	return (
		<View style={styles.warningView}>
			<Text style={styles.warningTitle}>Warning</Text>
			{isPath ? (
				<Text style={styles.warningText}>
					This account is not bond to a specific network.
					{'\n'}
					{'\n'}
					This could be because the network specifications are updated or the
					account is generated in a previous version. The address currently
					displayed is using Kusama format.
					{'\n'}
					{'\n'}
					To bind the desired network with this account you need to:
					{'\n'}- remember account path
					{'\n'}- delete the account
					{'\n'}- tap "Add Network Account {'->'} Create Custom Path"
					{'\n'}- derive an account with the same path as before
				</Text>
			) : (
				<Text style={styles.warningText}>
					This account wasn't retrieved successfully. This could be because its
					network isn't supported.
					{'\n'}
					{'\n'}
					To be able to use this account you need to:
					{'\n'}- write down its recovery phrase
					{'\n'}- delete it
					{'\n'}- recover/derive it
					{'\n'}
				</Text>
			)}
		</View>
	);
}

export function PasswordedAccountExportWarning(): React.ReactElement {
	return (
		<View style={styles.warningView}>
			<Text style={styles.warningTitle}>Warning</Text>
			<Text style={styles.warningText}>
				The secret is generated with the input password.
				{'\n'}
				{'\n'}
				Please make sure you have input the correct password, a wrong password
				will lead to a different QR code.
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	warningText: {
		color: colors.text.main,
		fontFamily: fonts.regular
	},
	warningTitle: {
		color: colors.signal.error,
		fontFamily: fonts.bold,
		fontSize: 20,
		marginBottom: 10
	},
	warningView: {
		padding: 20
	}
});
