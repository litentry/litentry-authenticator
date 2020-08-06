import t from 'modules/unlock/strings';
import { State, UpdateStateFunc } from 'modules/unlock/types';
import { onlyNumberRegex } from 'utils/regex';

type InputListener = (v: string) => void;

export const onPinInputChange = (
	stateName: 'pin' | 'confirmation',
	updateState: UpdateStateFunc
): InputListener => (pinInput: string): void => {
	if (onlyNumberRegex.test(pinInput)) {
		updateState({
			pinMismatch: false,
			pinTooShort: false,
			[stateName]: pinInput
		});
	}
};

export const getSubtitle = (state: State, isUnlock: boolean): string => {
	if (state.pinTooShort) {
		return t.pinTooShortHint;
	} else if (state.pinMismatch) {
		return isUnlock
			? t.pinMisMatchHint.pinUnlock
			: t.pinMisMatchHint.pinCreation;
	}
	return isUnlock ? t.subtitle.pinUnlock : t.subtitle.pinCreation;
};
