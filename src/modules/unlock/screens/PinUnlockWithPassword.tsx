import React, { useState } from 'react';

import { KeyboardAwareContainer } from 'modules/unlock/components/Container';
import PinInput from 'modules/unlock/components/PinInput';
import { usePinState } from 'modules/unlock/hooks';
import t from 'modules/unlock/strings';
import { getSubtitle, onPinInputChange } from 'modules/unlock/utils';
import testIDs from 'e2e/testIDs';
import ScreenHeading from 'components/ScreenHeading';
import { NavigationTargetIdentityProps } from 'types/props';
import { withTargetIdentity } from 'utils/HOC';
import { useSeedRef } from 'utils/seedRefHooks';
import Button from 'components/Button';

function PinUnlockWithPassword({
	targetIdentity,
	route
}: NavigationTargetIdentityProps<'PinUnlockWithPassword'>): React.ReactElement {
	const [state, updateState, resetState] = usePinState();
	const [focusPassword, setFocusPassword] = useState<boolean>(false);
	const { createSeedRef } = useSeedRef(targetIdentity.encryptedSeed);

	async function submit(): Promise<void> {
		const { pin, password } = state;
		const resolvePassword = route.params.resolve;
		if (!route.params.isSeedRefValid) {
			if (pin.length >= 6 && targetIdentity) {
				try {
					await createSeedRef(pin);
					resolvePassword(password);
					resetState();
				} catch (e) {
					updateState({ password: '', pin: '', pinMismatch: true });
					//TODO record error times;
				}
			} else {
				updateState({ pinTooShort: true });
			}
		} else {
			resolvePassword(password);
			resetState();
		}
	}

	function onPasswordInputChange(password: string): void {
		updateState({
			password,
			pinMismatch: false
		});
	}

	return (
		<KeyboardAwareContainer
			contentContainerStyle={{
				flexGrow: 1
			}}
		>
			<ScreenHeading
				title={t.title.pinUnlock}
				error={state.pinMismatch || state.pinTooShort}
				subtitle={getSubtitle(state, true)}
			/>
			{!route.params.isSeedRefValid && (
				<PinInput
					label={t.pinLabel}
					autoFocus
					testID={testIDs.IdentityPin.unlockPinInput}
					returnKeyType="done"
					onChangeText={onPinInputChange('pin', updateState)}
					onSubmitEditing={(): void => setFocusPassword(true)}
					value={state.pin}
				/>
			)}
			<PinInput
				label={t.passwordLabel}
				testID={testIDs.IdentityPin.passwordInput}
				returnKeyType="done"
				keyboardType="default"
				focus={focusPassword}
				onChangeText={onPasswordInputChange}
				onSubmitEditing={submit}
				value={state.password}
			/>
			<Button
				title={t.doneButton.pinUnlock}
				onPress={submit}
				testID={testIDs.IdentityPin.unlockPinButton}
			/>
		</KeyboardAwareContainer>
	);
}

export default withTargetIdentity(PinUnlockWithPassword);
