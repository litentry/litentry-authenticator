// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

// @flow

import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import TouchableItem from 'components/TouchableItem';
import colors from 'styles/colors';
import fonts from 'styles/fonts';

type Props = {
	identity: string;
	onPress: () => any;
	style: ViewStyle;
	index: number;
	title: string;
};

type aProps = {
	token: {
		id: 0;
		hash: '0x';
	};
};

export default function TokenCard(props: Props): React.ReactElement {
	const { identity, onPress, style, index, title } = props;
	return (
		<TouchableItem
			accessibilityComponentType="button"
			disabled={false}
			onPress={onPress}
		>
			<View style={[styles.body, style]}>
				<View style={styles.desc}>
					<Text numberOfLines={1} style={styles.titleText}>
						{`${title} ${index}`}
					</Text>
					<Text
						numberOfLines={1}
						style={styles.titleText}
						ellipsizeMode="middle"
					>
						{`hash: ${identity}`}
					</Text>
				</View>
			</View>
		</TouchableItem>
	);
}

const styles = StyleSheet.create({
	body: {
		flex: 1,
		// height: 50,
		backgroundColor: colors.background.card,
		padding: 10
	},
	desc: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		// alignItems: 'stretch',
		paddingLeft: 10,
		flex: 1
	},
	titleText: {
		fontFamily: fonts.semiBold,
		fontSize: 20,
		color: colors.background.app
	}
});
