import BigNumber from 'bignumber.js';

const unitMap: {
	[key: string]: string;
} = {
	noether: '0',
	wei: '1',
	kwei: '1000',
	Kwei: '1000',
	babbage: '1000',
	femtoether: '1000',
	mwei: '1000000',
	Mwei: '1000000',
	lovelace: '1000000',
	picoether: '1000000',
	gwei: '1000000000',
	Gwei: '1000000000',
	shannon: '1000000000',
	nanoether: '1000000000',
	nano: '1000000000',
	szabo: '1000000000000',
	microether: '1000000000000',
	micro: '1000000000000',
	finney: '1000000000000000',
	milliether: '1000000000000000',
	milli: '1000000000000000',
	ether: '1000000000000000000',
	kether: '1000000000000000000000',
	grand: '1000000000000000000000',
	mether: '1000000000000000000000000',
	gether: '1000000000000000000000000000',
	tether: '1000000000000000000000000000000'
};

function getValueOfUnit(unit?: string): BigNumber {
	unit = unit ? unit.toLowerCase() : 'ether';
	const unitValue = unitMap[unit] || 0;
	return new BigNumber(unitValue, 10);
}

export function fromWei(number: any, unit?: string): string {
	return new BigNumber(number || 0, 16)
		.dividedBy(getValueOfUnit(unit))
		.toString(10);
}
