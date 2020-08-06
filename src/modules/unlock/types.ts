export type State = {
	confirmation: string;
	focusConfirmation: boolean;
	password: string;
	pin: string;
	pinMismatch: boolean;
	pinTooShort: boolean;
};

export type UpdateStateFunc = (delta: Partial<State>) => void;

export type StateReducer = [State, UpdateStateFunc, () => void];
