/*
 * @dev Modulo division that wraps on negative numbers because Javascript % does not by default.
 */
export function mod(n: number, m: number): number {
	return ((n % m) + m) % m;
}
