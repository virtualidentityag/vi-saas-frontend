import * as React from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import './sessionsList.styles';

export const SessionListEmptyState = () => {
	return (
		<div className="sessionsList">
			<p className="sessionsList--empty">
				{translate('sessionList.empty')}
			</p>
		</div>
	);
};
