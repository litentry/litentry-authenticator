import React from 'react';

import styles from '../styles';

import KeyboardScrollView from 'components/KeyboardScrollView';
import testIDs from 'e2e/testIDs';

export function KeyboardAwareContainer(props: any): React.ReactElement {
	return (
		<KeyboardScrollView
			{...props}
			bounces={false}
			style={styles.body}
			testID={testIDs.IdentityPin.scrollScreen}
		/>
	);
}
