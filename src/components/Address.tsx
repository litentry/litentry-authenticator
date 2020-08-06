import React, { ReactElement } from 'react';
import { Text, TextStyle } from 'react-native';

import fontStyles from 'styles/fontStyles';
import { NetworkProtocols } from 'constants/networkSpecs';
import { NetworkProtocol } from 'types/networkSpecsTypes';

export default function Address(props: {
	address: string;
	protocol?: NetworkProtocol;
	style?: TextStyle;
}): ReactElement {
	const { address, protocol = NetworkProtocols.SUBSTRATE, style = {} } = props;
	const prefix = protocol === NetworkProtocols.ETHEREUM ? '0x' : '';

	return (
		<Text
			numberOfLines={1}
			style={[style, fontStyles.t_codeS]}
			ellipsizeMode="middle"
		>
			{prefix}
			{address}
		</Text>
	);
}
