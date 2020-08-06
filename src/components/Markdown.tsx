import React from 'react';
import { StyleSheet } from 'react-native';
import { default as MarkdownRender } from 'react-native-markdown-renderer';

import colors from 'styles/colors';
import fonts from 'styles/fonts';

export default class Markdown extends React.PureComponent<any> {
	render(): React.ReactElement {
		return (
			<MarkdownRender
				style={StyleSheet.create({
					listOrderedItemIcon: {
						color: colors.text.main,
						marginRight: 3,
						marginTop: 19
					},
					listUnorderedItemIcon: {
						color: colors.text.faded,
						fontFamily: fonts.bold,
						marginRight: 3,
						marginTop: 19
					},
					text: {
						color: colors.text.main,
						fontFamily: fonts.regular,
						fontSize: 14,
						marginTop: 10
					}
				})}
				{...this.props}
			/>
		);
	}
}
