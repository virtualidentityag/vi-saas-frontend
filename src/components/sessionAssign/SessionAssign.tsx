import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import {
	OverlayWrapper,
	Overlay,
	OverlayItem,
	OVERLAY_FUNCTIONS
} from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import { translate } from '../../utils/translate';
import { history } from '../app/app';
import {
	apiGetUserData,
	apiGetAgencyConsultantList,
	apiSessionAssign,
	FETCH_ERRORS,
	apiDeleteUserFromRoom
} from '../../api';
import {
	UserDataInterface,
	UserDataContext,
	ConsultantListContext,
	E2EEContext
} from '../../globalState';
import {
	SelectDropdownItem,
	SelectDropdown,
	SelectOption
} from '../select/SelectDropdown';
import {
	getSessionListPathForLocation,
	SESSION_LIST_TAB
} from '../session/sessionHelpers';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { useE2EE } from '../../hooks/useE2EE';
import { useSearchParam } from '../../hooks/useSearchParams';

export const ACCEPTED_GROUP_CLOSE = 'CLOSE';
export interface Consultant {
	consultantId: string;
	firstName: string;
	lastName: string;
}

export const SessionAssign = (props: { value?: string }) => {
	const { activeSession } = useContext(ActiveSessionContext);
	const { userData, setUserData } = useContext(UserDataContext);
	const { consultantList, setConsultantList } = useContext(
		ConsultantListContext
	);
	const [overlayActive, setOverlayActive] = useState(false);
	const [overlayItem, setOverlayItem] = useState({});
	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');

	const { isE2eeEnabled } = useContext(E2EEContext);

	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;

	const { addNewUsersToEncryptedRoom } = useE2EE(activeSession.item.groupId);

	useEffect(() => {
		const agencyId = activeSession.item.agencyId.toString();
		if (consultantList && consultantList.length <= 0) {
			apiGetAgencyConsultantList(agencyId)
				.then((response) => {
					const consultants =
						prepareConsultantDataForSelect(response);
					setConsultantList(consultants);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const prepareConsultantDataForSelect = (consultants: Consultant[]) => {
		let availableConsultants = [];
		consultants.forEach((item) => {
			const consultant: SelectOption = {
				value: item.consultantId,
				label: item.firstName + ` ` + item.lastName,
				iconLabel: item.firstName.charAt(0) + item.lastName.charAt(0)
			};
			availableConsultants.push(consultant);
		});
		return availableConsultants;
	};

	const initOverlays = (selectedOption, profileData) => {
		const currentUserId = profileData.userId;

		const assignOtherOverlay: OverlayItem = {
			svg: CheckIcon,
			headline: translate('session.assignOther.overlayHeadline'),
			buttonSet: [
				{
					label: translate('session.assignOther.buttonLabel'),
					function: OVERLAY_FUNCTIONS.CLOSE,
					type: BUTTON_TYPES.AUTO_CLOSE
				}
			]
		};

		const assignSelfOverlay: OverlayItem = {
			svg: CheckIcon,
			headline: translate('session.assignSelf.overlayHeadline'),
			buttonSet: [
				{
					label: translate('session.assignSelf.button1.label'),
					function: OVERLAY_FUNCTIONS.REDIRECT,
					type: BUTTON_TYPES.PRIMARY
				},
				{
					label: translate('session.assignSelf.button2.label'),
					function: OVERLAY_FUNCTIONS.CLOSE,
					type: BUTTON_TYPES.SECONDARY
				}
			]
		};

		const overlay =
			currentUserId === selectedOption.value
				? assignSelfOverlay
				: assignOtherOverlay;
		setOverlayActive(true);
		setOverlayItem(overlay);
	};

	const handleE2EEAssign = async (sessionId, userId) => {
		if (isE2eeEnabled) {
			try {
				await addNewUsersToEncryptedRoom();
				await apiDeleteUserFromRoom(sessionId, userId);
			} catch (e) {
				console.log('error encrypting new user key');
			}
		}
	};

	const handleDatalistSelect = (selectedOption) => {
		apiSessionAssign(activeSession.item.id, selectedOption.value)
			.then(() => {
				if (userData) {
					initOverlays(selectedOption, userData);
					handleE2EEAssign(activeSession.item.id, userData.userId);
				} else {
					apiGetUserData()
						.then((profileData: UserDataInterface) => {
							handleE2EEAssign(
								activeSession.item.id,
								profileData.userId
							);
							setUserData(profileData);
							initOverlays(selectedOption, profileData);
						})
						.catch((error) => console.log(error));
				}
			})
			.catch((error) => {
				if (error === FETCH_ERRORS.CONFLICT) {
					return null;
				} else console.log(error);
			});
	};

	const handleOverlayAction = (buttonFunction: string) => {
		setOverlayActive(false);
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			history.push(getSessionListPathForLocation() + getSessionListTab());
		} else {
			history.push(
				`/sessions/consultant/sessionView/${
					activeSession.item.groupId
				}/${activeSession.item.id}${getSessionListTab()}`
			);
		}
	};

	const prepareSelectDropdown = () => {
		const selectDropdown: SelectDropdownItem = {
			id: 'assignSelect',
			selectedOptions: consultantList,
			handleDropdownSelect: handleDatalistSelect,
			selectInputLabel: translate('session.u25.assignment.placeholder'),
			useIconOption: true,
			isSearchable: true,
			menuPlacement: 'top'
		};
		if (props.value) {
			selectDropdown['defaultValue'] = consultantList.filter(
				(option) => option.value === props.value
			)[0];
		}
		return selectDropdown;
	};

	return (
		<div className="assign__wrapper">
			<SelectDropdown {...prepareSelectDropdown()} />
			{overlayActive && (
				<OverlayWrapper>
					<Overlay
						item={overlayItem}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			)}
		</div>
	);
};
