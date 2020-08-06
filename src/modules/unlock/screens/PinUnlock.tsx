import React from 'react';

import { KeyboardAwareContainer } from 'modules/unlock/components/Container';
import PinInput from 'modules/unlock/components/PinInput';
import { usePinState } from 'modules/unlock/hooks';
import t from 'modules/unlock/strings';
import { getSubtitle, onPinInputChange } from 'modules/unlock/utils';
import testIDs from 'e2e/testIDs';
import ScreenHeading from 'components/ScreenHeading';
import { NavigationTargetIdentityProps } from 'types/props';
import { debounce } from 'utils/debounce';
import { withTargetIdentity } from 'utils/HOC';
import { unlockIdentitySeedWithReturn } from 'utils/identitiesUtils';
import { useSeedRef } from 'utils/seedRefHooks';

function PinUnlock({
	targetIdentity,
	route
}: NavigationTargetIdentityProps<'PinUnlock'>): React.ReactElement {
	const [state, updateState, resetState] = usePinState();
	const { createSeedRef } = useSeedRef(targetIdentity.encryptedSeed);

	async function submit(pin: string): Promise<void> {
		if (pin.length >= 6 && targetIdentity) {
			try {
				if (route.params.shouldReturnSeed) {
					const resolveSeedPhrase = route.params.resolve;
					const seedPhrase = await unlockIdentitySeedWithReturn(
						pin,
						targetIdentity,
						createSeedRef
					);
					resetState();
					resolveSeedPhrase(seedPhrase);
				} else {
					const resolve = route.params.resolve;
					await createSeedRef(pin);
					resetState();
					resolve();
				}
			} catch (e) {
				updateState({ pin, pinMismatch: true });
			}
		} else {
			updateState({ pin, pinTooShort: true });
		}
	}

	const onPinInput = (pin: string): void => {
		onPinInputChange('pin', updateState)(pin);
		const debounceSubmit = debounce(() => submit(pin), 500);
		debounceSubmit();
	};

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
			<PinInput
				label={t.pinLabel}
				autoFocus
				testID={testIDs.IdentityPin.unlockPinInput}
				returnKeyType="done"
				onChangeText={onPinInput}
				value={state.pin}
			/>
		</KeyboardAwareContainer>
	);
}

export default withTargetIdentity(PinUnlock);
