/**
 * Creates and returns a new debounced version of the passed function that will
 * postpone its execution until after wait milliseconds have elapsed since
 * the last time it was invoked.
 *
 * @type  {T}                item    type
 * @param {(any) => any}     function to debounce
 * @param {number}           time in milliseconds
 *
 *
 * @return {any[]}            the debounced function
 */
let timeout: any;

export function debounce(fn: any, time: number): () => void {
	return function debouncedFunction(...args: any[]): void {
		const functionCall = (): any => fn.apply(null, ...args);

		clearTimeout(timeout);
		timeout = setTimeout(functionCall, time);
	};
}
