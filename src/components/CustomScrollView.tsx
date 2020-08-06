import React from 'react';
import {
	Animated,
	LayoutChangeEvent,
	ScrollView,
	StyleSheet,
	ViewStyle
} from 'react-native';

import { SafeAreaViewContainer } from 'components/SafeAreaContainer';
import colors from 'styles/colors';

export default class CustomScrollView extends React.PureComponent<
	{
		contentContainerStyle: ViewStyle;
	},
	{
		indicator: Animated.AnimatedValue;
		visible: boolean;
		visibleHeight: number;
		wholeHeight: number;
	}
> {
	state = {
		indicator: new Animated.Value(0),
		visible: false,
		visibleHeight: 0,
		wholeHeight: 1
	};

	render(): React.ReactElement {
		const indicatorSize =
			this.state.wholeHeight > this.state.visibleHeight
				? (this.state.visibleHeight * this.state.visibleHeight) /
				  this.state.wholeHeight
				: this.state.visibleHeight;

		const difference =
			this.state.visibleHeight > indicatorSize
				? this.state.visibleHeight - indicatorSize
				: 1;

		return (
			<SafeAreaViewContainer>
				<ScrollView
					bounces={false}
					showsVerticalScrollIndicator={false}
					onContentSizeChange={(width: number, height: number): void => {
						this.setState({ wholeHeight: height });
					}}
					onLayout={({
						nativeEvent: {
							layout: { height }
						}
					}: LayoutChangeEvent): void =>
						this.setState({ visibleHeight: height })
					}
					scrollEventThrottle={16}
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { y: this.state.indicator } } }],
						{
							useNativeDriver: false
						}
					)}
					{...this.props}
				>
					{this.props.children}
				</ScrollView>
				<Animated.View
					style={[
						styles.indicator,
						{
							height: indicatorSize,
							transform: [
								{
									translateY: Animated.multiply(
										this.state.indicator,
										this.state.visibleHeight / this.state.wholeHeight
									).interpolate({
										extrapolate: 'clamp',
										inputRange: [0, difference],
										outputRange: [0, difference]
									})
								}
							]
						}
					]}
				/>
			</SafeAreaViewContainer>
		);
	}
}

const styles = StyleSheet.create({
	indicator: {
		backgroundColor: colors.text.main,
		borderRadius: 5,
		position: 'absolute',
		right: 0,
		width: 5
	}
});
