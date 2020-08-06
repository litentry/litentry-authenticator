export const checksummedAddress = (address: string, hash: string): string => {
	let result = '';
	for (let n = 0; n < 40; n++) {
		result = `${result}${
			parseInt(hash[n], 16) > 7 ? address[n].toUpperCase() : address[n]
		}`;
	}
	return result;
};
