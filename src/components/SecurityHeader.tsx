import React from 'react';
import { StyleSheet, View } from 'react-native';

import IdentitiesSwitch from 'components/IdentitiesSwitch';

function SecurityHeader(): React.ReactElement {
	return (
		<View style={styles.body}>
			<IdentitiesSwitch />
		</View>
	);
}

const styles = StyleSheet.create({
	body: {
		flexDirection: 'row',
		justifyContent: 'center'
	}
});

export default SecurityHeader;
