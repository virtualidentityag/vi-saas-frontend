import { generateMultipleConsultantSessions } from '../support/sessions';
import { config } from '../../src/resources/scripts/config';

const groupChatConsultantMockedLogin = (amountOfSessions: number) => {
	const sessions = generateMultipleConsultantSessions(amountOfSessions);
	cy.caritasMockedLogin({
		type: 'group-chat-consultant',
		sessions
	});
};

describe('Group chat consultant', () => {
	beforeEach(() => {
		cy.fixture('services.group-chat-consultanttype.basic.json').then(
			(basicGroupCHatConsultantType) =>
				cy.intercept(
					`${config.endpoints.consultingTypeServiceBase}/basic`,
					basicGroupCHatConsultantType
				)
		);
	});

	it('should be able to login', () => {
		groupChatConsultantMockedLogin(3);
	});
});
