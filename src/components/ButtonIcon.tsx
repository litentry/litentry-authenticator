import React, { FunctionComponent } from 'react';
import {
	TouchableOpacity,
	View,
	Text,
	ViewStyle,
	TextStyle,
	StyleSheet
} from 'react-native';
import { Icon } from 'react-native-elements';
import AntIcon from 'react-native-vector-icons/AntDesign';

import colors from 'styles/colors';
import { ButtonListener } from 'types/props';

interface Props {
	iconName: string;
	iconType: string;
	iconColor?: string;
	onPress: ButtonListener;
	iconBgStyle?: ViewStyle;
	iconSize?: number;
	testID?: string;
	textStyle?: TextStyle;
	title?: string;
	style?: ViewStyle;
}

const ButtonIcon: FunctionComponent<Props> = ({
	iconName,
	iconType,
	iconColor,
	onPress,
	iconBgStyle,
	iconSize,
	testID,
	textStyle,
	title,
	style = {}
}) => {
	const size = iconSize || 28;

	const styles = StyleSheet.create({
		generalView: {
			display: 'flex',
			flexDirection: 'row',
			paddingVertical: 10
		},
		iconTitleView: {
			alignItems: 'center',
			flexDirection: 'row',
			marginLeft: 8
		},
		iconView: {
			height: size,
			paddingLeft: 3,
			paddingTop: size / 8,
			width: size
		},
		title: {
			marginLeft: 8
		}
	});

	const renderIcon = (): React.ReactElement => {
		if (iconType === 'antdesign') {
			return (
				<AntIcon
					color={iconColor || colors.text.main}
					size={size - 6}
					name={iconName}
				/>
			);
		}
		return (
			<Icon
				color={iconColor || colors.text.main}
				size={size - 6}
				name={iconName}
				type={iconType}
			/>
		);
	};

	return (
		<TouchableOpacity
			accessibilityComponentType="button"
			onPress={onPress}
			activeOpacity={0.5}
			style={{ ...styles.generalView, ...style }}
			testID={testID}
		>
			<View style={styles.iconTitleView}>
				<View style={[styles.iconView, iconBgStyle]}>{renderIcon()}</View>
				{!!title && <Text style={[styles.title, textStyle]}>{title}</Text>}
			</View>
		</TouchableOpacity>
	);
};

export default ButtonIcon;
