import React from 'react';
import {
	StyleSheet,
	TextInput as TextInputOrigin,
	View,
	Text,
	TextStyle,
	TextInputProps
} from 'react-native';

import fontStyles from 'styles/fontStyles';
import colors from 'styles/colors';

interface Props extends TextInputProps {
	fixedPrefix?: string;
	focus?: boolean;
	label?: string;
	error?: boolean;
}

export default class TextInput extends React.PureComponent<Props, {}> {
	static defaultProps = {
		focus: false
	};
	input: TextInputOrigin | null = null;

	// Methods:
	focus(): void {
		this.input?.focus();
	}

	componentDidUpdate(): void {
		const { focus } = this.props;
		focus && this.focus();
	}

	renderLabel(): React.ReactNode {
		const { label } = this.props;
		if (!label) return;
		return <Text style={styles.label}>{label}</Text>;
	}

	render(): React.ReactElement {
		const { fixedPrefix, style, error } = this.props;
		const finalInputStyles: TextStyle[] = [styles.input];
		if (error) {
			finalInputStyles.push(styles.input_error);
		}

		return (
			<View style={styles.body}>
				{this.renderLabel()}
				<View style={styles.viewStyle}>
					{fixedPrefix && (
						<Text style={[fontStyles.h2, finalInputStyles, styles.inputFixed]}>
							{fixedPrefix}
						</Text>
					)}
					<TextInputOrigin
						ref={(input: TextInputOrigin): any => (this.input = input)}
						autoCapitalize="none"
						keyboardAppearance="dark"
						underlineColorAndroid="transparent"
						{...this.props}
						style={[fontStyles.h2, finalInputStyles, style]}
						placeholderTextColor={colors.text.faded}
						selectionColor={colors.border.light}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	body: {
		marginVertical: 8,
		paddingHorizontal: 16
	},
	input: {
		borderBottomColor: colors.border.light,
		borderBottomWidth: 0.8,
		flex: 1,
		height: 40,
		padding: 0,
		paddingTop: 8
	},
	inputFixed: {
		color: '#888',
		flex: 0,
		paddingTop: 11.5
	},
	input_error: {
		borderBottomColor: colors.signal.error
	},
	label: {
		marginBottom: 3,
		...fontStyles.t_regular
	},
	viewStyle: {
		flexDirection: 'row'
	}
});
