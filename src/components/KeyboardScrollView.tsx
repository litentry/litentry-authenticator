import React from 'react';
import { Keyboard, Platform, ScrollViewProps } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { SafeAreaViewContainer } from 'components/SafeAreaContainer';

interface Props extends ScrollViewProps {
	enableAutomaticScroll?: boolean;
	extraHeight?: number;
}

class KeyboardScrollView extends React.PureComponent<Props> {
	render(): React.ReactElement | undefined {
		const defaultProps = { enableAutomaticScroll: true };
		return Platform.select({
			android: (
				<SafeAreaViewContainer>
					<KeyboardAwareScrollView
						keyboardDismissMode="on-drag"
						onScrollEndDrag={Keyboard.dismiss}
						keyboardShouldPersistTaps="handled"
						enableOnAndroid
						{...defaultProps}
						{...this.props}
					>
						{this.props.children}
					</KeyboardAwareScrollView>
				</SafeAreaViewContainer>
			),
			ios: (
				<SafeAreaViewContainer>
					<KeyboardAwareScrollView
						keyboardDismissMode="interactive"
						keyboardShouldPersistTaps="handled"
						{...defaultProps}
						{...this.props}
					>
						{this.props.children}
					</KeyboardAwareScrollView>
				</SafeAreaViewContainer>
			)
		});
	}
}

export default KeyboardScrollView;
