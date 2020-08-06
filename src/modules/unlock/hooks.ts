import { useState } from 'react';

import { State, StateReducer, UpdateStateFunc } from './types';

const initialState: State = {
	confirmation: '',
	focusConfirmation: false,
	password: '',
	pin: '',
	pinMismatch: false,
	pinTooShort: false
};

export function usePinState(): StateReducer {
	const [state, setState] = useState<State>(initialState);
	const updateState: UpdateStateFunc = delta =>
		setState({ ...state, ...delta });
	const resetState = (): void => setState(initialState);
	return [state, updateState, resetState];
}
