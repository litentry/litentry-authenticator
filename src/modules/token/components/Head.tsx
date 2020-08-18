import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function Head({ label }: { label: string }): React.ReactElement {
	return <Text style={styles.label}>{label}</Text>;
}

const styles = StyleSheet.create({
	label: {
		fontSize: 16,
		paddingHorizontal: 20,
		paddingVertical: 16
	}
});
