import React from 'react';
import { Text } from 'react-native';

import { SafeAreaViewContainer } from 'components/SafeAreaContainer';
import styles from 'modules/main/styles';

export default function ApiNotLoaded(): React.ReactElement {
	return (
		<SafeAreaViewContainer style={styles.onBoardingWrapper}>
			<Text style={styles.onBoardingText}>Connecting to node...</Text>
		</SafeAreaViewContainer>
	);
}
