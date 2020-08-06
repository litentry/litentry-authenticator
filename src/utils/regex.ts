export const pathsRegex: {
	[key: string]: RegExp;
} = {
	allPath: /(\/|\/\/)[\w-.]+(?=(\/?))/g,
	firstPath: /(\/|\/\/)[\w-.]+(?=(\/)?)/,
	networkPath: /(\/\/)[\w-.]+(?=(\/)?)/,
	validateDerivedPath: /^(\/\/?[\w-.]+)*$/
};

export const passwordRegex = /^[\w-]{0,1024}$/;

export const onlyNumberRegex = /^\d+$|^$/;
