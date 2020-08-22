import PropTypes from 'prop-types';
import React from 'react';

import PathCard from './PathCard';

import { AccountsContextState } from 'stores/AccountsContext';
import { FoundIdentityAccount } from 'types/identityTypes';

const CompatibleCard = ({
	account,
	accountsStore,
	titlePrefix
}: {
	account: FoundIdentityAccount;
	accountsStore: AccountsContextState;
	titlePrefix?: string;
}): React.ReactElement => (
	//Substrate tx do not need to render recipient
	<PathCard
		identity={accountsStore.getIdentityByAccountId(account.accountId)!}
		path={account.path}
		titlePrefix={titlePrefix}
	/>
);

CompatibleCard.propTypes = {
	account: PropTypes.object.isRequired,
	accountsStore: PropTypes.object.isRequired,
	titlePrefix: PropTypes.string
};

export default CompatibleCard;
