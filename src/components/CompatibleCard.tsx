import PropTypes from 'prop-types';
import React from 'react';

import AccountCard from './AccountCard';
import PathCard from './PathCard';

import { AccountsContextState } from 'stores/AccountsContext';
import { FoundAccount } from 'types/identityTypes';
import { isLegacyFoundAccount } from 'utils/identitiesUtils';

const CompatibleCard = ({
	account,
	accountsStore,
	titlePrefix
}: {
	account: FoundAccount;
	accountsStore: AccountsContextState;
	titlePrefix?: string;
}): React.ReactElement =>
	isLegacyFoundAccount(account) || account.isLegacy === undefined ? (
		<AccountCard
			title={account.name}
			address={account.address}
			networkKey={account.networkKey || ''}
		/>
	) : (
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
