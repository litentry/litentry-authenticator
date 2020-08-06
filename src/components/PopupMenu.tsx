import React from 'react';
import { Text, TextStyle } from 'react-native';
import {
	Menu,
	MenuOptions,
	MenuOption,
	MenuTrigger
} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialIcons';

import colors from 'styles/colors';
import fonts from 'styles/fonts';

type MenuItem = {
	text: string;
	value: string;
	textStyle?: TextStyle;
	testID?: string;
	hide?: boolean;
};

interface Props {
	onSelect: (selectedItem: any) => void;
	menuTriggerIconName: string;
	menuItems: Array<MenuItem>;
	testID?: string;
}

export default class PopupMenu extends React.PureComponent<Props> {
	render(): React.ReactElement {
		const { onSelect, menuTriggerIconName, menuItems, testID } = this.props;
		const menuTriggerIcon = (
			<Icon
				name={menuTriggerIconName}
				size={25}
				color={colors.text.main}
				testID={testID}
			/>
		);

		return (
			<Menu onSelect={onSelect}>
				<MenuTrigger children={menuTriggerIcon} />
				<MenuOptions customStyles={menuOptionsStyles}>
					{menuItems.map(
						(menuItem: MenuItem, index: number): React.ReactNode => {
							if (menuItem.hide === true) {
								return null;
							}
							return (
								<MenuOption key={index} value={menuItem.value}>
									<Text
										style={[menuOptionsStyles.optionText, menuItem.textStyle]}
										testID={menuItem.testID}
									>
										{menuItem.text}
									</Text>
								</MenuOption>
							);
						}
					)}
				</MenuOptions>
			</Menu>
		);
	}
}

const menuOptionsStyles = {
	optionText: {
		fontFamily: fonts.regular,
		fontSize: 16
	},
	optionWrapper: {
		padding: 15
	}
};
