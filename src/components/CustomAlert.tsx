import React, { useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Animated, Text, Easing } from 'react-native';

import Button from 'components/Button';
import { Action, AlertStateContext } from 'stores/alertContext';
import colors from 'styles/colors';
import fonts from 'styles/fonts';
import fontStyles from 'styles/fontStyles';

export default function CustomAlert(): React.ReactElement {
	const { title, alertIndex, message, actions } = useContext(AlertStateContext);
	/* eslint-disable-next-line react-hooks/exhaustive-deps */
	const animatedValue = useMemo(() => new Animated.Value(1), [alertIndex]);
	const [alertDisplay, setAlertDisplay] = useState<boolean>(false);

	useEffect(() => {
		if (alertIndex === 0) return;
		setAlertDisplay(true);
		if (actions.length === 0) {
			Animated.timing(animatedValue, {
				duration: 2000,
				easing: Easing.poly(8),
				toValue: 0,
				useNativeDriver: false
			}).start(() => {
				setAlertDisplay(false);
			});
		}
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [alertIndex]);

	const renderActions = (action: Action, index: number): React.ReactElement => (
		<Button
			onlyText={true}
			small={true}
			key={'alert' + index}
			testID={action.testID}
			title={action.text}
			onPress={(): any => {
				if (action.onPress) {
					action.onPress();
				}
				setAlertDisplay(false);
			}}
			style={styles.button}
			textStyles={
				action.onPress ? styles.buttonBoldText : styles.buttonLightText
			}
		/>
	);

	if (alertDisplay) {
		return (
			<Animated.View style={{ ...styles.background, opacity: animatedValue }}>
				<View style={styles.body}>
					{title !== '' && <Text style={styles.textTitle}>{title}</Text>}
					<Text style={styles.textMessage}>{message}</Text>
					{actions !== [] && (
						<View style={styles.actionsContainer}>
							{actions.map(renderActions)}
						</View>
					)}
				</View>
			</Animated.View>
		);
	} else {
		return <View />;
	}
}

const styles = StyleSheet.create({
	actionsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 20
	},
	background: {
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		top: 80,
		width: '100%',
		zIndex: 100
	},
	body: {
		backgroundColor: colors.background.alert,
		paddingHorizontal: 20,
		paddingVertical: 20,
		width: '90%'
	},
	button: {
		alignItems: 'center',
		borderRadius: 0,
		flex: 1,
		flexGrow: 1,
		justifyContent: 'center',
		marginHorizontal: 2,
		paddingHorizontal: 0
	},

	buttonBoldText: {
		fontFamily: fonts.robotoMonoMedium
	},
	buttonLightText: {
		fontFamily: fonts.robotoMono
	},
	textMessage: {
		...fontStyles.h2
	},
	textTitle: {
		paddingVertical: 10,
		...fontStyles.h1
	}
});
