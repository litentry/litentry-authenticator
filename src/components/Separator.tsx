import React from 'react';
import { View, Image, ViewStyle, StyleSheet, ImageStyle } from 'react-native';

import shadowImage from 'res/img/card_shadow.png';

interface Props {
	shadow?: boolean;
	shadowStyle?: ImageStyle;
	style?: ViewStyle;
}

export default class Separator extends React.PureComponent<Props> {
	render(): React.ReactElement {
		const { shadow, shadowStyle, style } = this.props;

		return (
			<View
				style={[
					{
						alignSelf: 'stretch',
						backgroundColor: 'black',
						height: 1,
						marginVertical: 8
					},
					style
				]}
			>
				{shadow && (
					<Image
						source={shadowImage}
						style={StyleSheet.flatten([
							{
								height: 32,
								marginTop: -32,
								width: '100%'
							},
							shadowStyle
						])}
					/>
				)}
			</View>
		);
	}
}
