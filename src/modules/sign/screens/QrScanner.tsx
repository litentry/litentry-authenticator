// Copyright 2015-2020 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

import { SafeAreaViewContainer } from 'components/SafeAreaContainer';
import Button from 'components/Button';
import { useProcessBarCode } from 'modules/sign/utils';
import { useInjectionQR } from 'e2e/injections';
import { AlertStateContext } from 'stores/alertContext';
import { ScannerContext } from 'stores/ScannerContext';
import { NavigationProps } from 'types/props';
import colors from 'styles/colors';
import fonts from 'styles/fonts';
import ScreenHeading from 'components/ScreenHeading';
import { Frames, TxRequestData } from 'types/scannerTypes';

export default function Scanner({}: NavigationProps<
	'QrScanner'
>): React.ReactElement {
	const scannerStore = useContext(ScannerContext);
	const { setAlert } = useContext(AlertStateContext);
	const [enableScan, setEnableScan] = useState<boolean>(true);
	const [lastFrame, setLastFrame] = useState<null | string>(null);
	const [mockIndex, onMockBarCodeRead] = useInjectionQR();
	const [multiFrames, setMultiFrames] = useState<Frames>({
		completedFramesCount: 0,
		isMultipart: false,
		missedFrames: [],
		missingFramesMessage: '',
		totalFramesCount: 0
	});
	function showErrorMessage(title: string, message: string): void {
		setEnableScan(false);
		setAlert(title, message, [
			{
				onPress: async (): Promise<void> => {
					scannerStore.cleanup();
					scannerStore.setReady();
					setLastFrame(null);
					setEnableScan(true);
				},
				text: 'Try again'
			}
		]);
	}

	const processBarCode = useProcessBarCode(showErrorMessage);
	useEffect(() => {
		const {
			missedFrames,
			completedFramesCount,
			totalFrameCount
		} = scannerStore.state;
		setMultiFrames({
			completedFramesCount,
			isMultipart: totalFrameCount > 1,
			missedFrames,
			missingFramesMessage: missedFrames && missedFrames.join(', '),
			totalFramesCount: totalFrameCount
		});
	}, [lastFrame, scannerStore.state]);

	const onBarCodeRead = async (event: any): Promise<void> => {
		if (event.type !== RNCamera.Constants.BarCodeType.qr) return;
		if (!enableScan) {
			return;
		}
		if (event.rawData === lastFrame) {
			return;
		}
		setLastFrame(event.rawData);
		await processBarCode(event as TxRequestData);
	};

	useEffect(() => {
		/** E2E Test Injection Code **/
		if (global.inTest && global.scanRequest !== undefined) {
			onMockBarCodeRead(
				global.scanRequest,
				async (tx: TxRequestData): Promise<void> => {
					await processBarCode(tx);
				}
			);
		}
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [mockIndex]);

	const {
		completedFramesCount,
		isMultipart,
		missedFrames,
		totalFramesCount,
		missingFramesMessage
	} = multiFrames;
	return (
		<SafeAreaViewContainer>
			<RNCamera
				captureAudio={false}
				onBarCodeRead={onBarCodeRead}
				style={styles.view}
			>
				<View style={styles.body}>
					<View style={styles.top}>
						<ScreenHeading title="Scanner" />
					</View>
					<View style={styles.middle}>
						<View style={styles.middleLeft} />
						<View style={styles.middleCenter} />
						<View style={styles.middleRight} />
					</View>
					{isMultipart ? (
						<View style={styles.bottom}>
							<Text style={styles.descTitle}>
								Scanning Multipart Data, Please Hold Still...
							</Text>
							<Text style={styles.descSecondary}>
								{completedFramesCount} / {totalFramesCount} Completed.
							</Text>
							<Button
								onPress={(): void => scannerStore.clearMultipartProgress()}
								title="Start Over"
								small
							/>
						</View>
					) : (
						<View style={styles.bottom}>
							<Text style={styles.descTitle}>Scan QR Code</Text>
						</View>
					)}
					{missedFrames && missedFrames.length >= 1 && (
						<View style={styles.bottom}>
							<Text style={styles.descTitle}>
								Missing following frame(s): {missingFramesMessage}
							</Text>
						</View>
					)}
				</View>
			</RNCamera>
		</SafeAreaViewContainer>
	);
}

const styles = StyleSheet.create({
	body: {
		backgroundColor: 'transparent',
		flex: 1,
		flexDirection: 'column'
	},
	bottom: {
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 15
	},
	descSecondary: {
		color: colors.text.main,
		fontFamily: fonts.bold,
		fontSize: 14,
		paddingBottom: 20
	},
	descTitle: {
		color: colors.text.main,
		fontFamily: fonts.bold,
		fontSize: 18,
		paddingBottom: 10,
		textAlign: 'center'
	},
	inactive: {
		backgroundColor: colors.background.app,
		flex: 1,
		flexDirection: 'column',
		padding: 20
	},
	middle: {
		backgroundColor: 'transparent',
		flexBasis: 280,
		flexDirection: 'row'
	},
	middleCenter: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		flexBasis: 280
	},
	middleLeft: {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		flex: 1
	},
	middleRight: {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		flex: 1
	},
	progress: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	top: {
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		flexBasis: 80,
		flexDirection: 'row',
		justifyContent: 'center'
	},
	view: {
		backgroundColor: 'black',
		flex: 1
	}
});
