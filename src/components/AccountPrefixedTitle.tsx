import React, { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import fontStyles from 'styles/fontStyles';
import colors from 'styles/colors';

export default function AccountPrefixedTitle({
	titlePrefix,
	title
}: {
	title: string;
	titlePrefix?: string;
}): ReactElement {
	return (
		<View style={{ flexDirection: 'row' }}>
			{titlePrefix && (
				<Text numberOfLines={1} style={[fontStyles.t_codeS, styles.text]}>
					{titlePrefix}
				</Text>
			)}
			<Text numberOfLines={1} style={[fontStyles.h2, { marginTop: -2 }]}>
				{title}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	text: {
		alignSelf: 'flex-end',
		color: colors.signal.main,
		marginBottom: 1,
		marginRight: 4
	}
});
