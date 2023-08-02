// This file should contain labels that should be overridden for both the
// default as well as the informal locale. If you need to override labels
// specific to one of those modes, please add them to the respective module.

const de = {
	anonymous: {
		waitingroom: {
			redirect: {
				subline:
					'Registrieren Sie sich und hinterlassen Sie uns Ihre Nachricht. Wir melden uns so schnell wie möglich bei Ihnen. <b>Gehen Sie <a href="registration">zur Registrierung</a></b>'
			},
			overlay: {
				rejection: {
					copy: 'Leider konnten wir innerhalb der Chat-Zeit nicht auf Ihr Anliegen eingehen. Registrieren Sie sich und hinterlassen Sie uns Ihre Nachricht. Wir melden uns so schnell wie möglich bei Ihnen.'
				}
			}
		},
		overlay: {
			chatWasFinished: {
				button: 'Zur Startseite'
			},
			finishChat: {
				success: {
					button: 'Zur Startseite'
				}
			}
		}
	},
	app: {
		title: 'Beratung\n& Hilfe'
	},
	deleteAccount: {
		successOverlay: {
			headline:
				'Sie haben Ihren Account bei der Online-Beratung & Hilfe erfolgreich gelöscht.'
		}
	},
	enquiry: {
		write: {
			overlay: {
				copy: 'Wir melden uns so schnell wie möglich bei Ihnen.'
			},
			infotext: {
				copy: {
					title: 'Vielleicht hilft Ihnen einer der folgenden Punkte bei der Formulierung weiter:',
					facts: '<ul><li>Zu welchem Thema wünschen Sie sich mehr Informationen oder Beratung?</li><li>Wie ist Ihre aktuelle Situation?</li><li>Was beschäftigt Sie?</li><li>Haben Sie eine bestimmte Frage oder wissen Sie vielleicht selbst noch nicht so genau was Ihnen helfen könnte?</li></ul>'
				}
			}
		}
	},
	error: {
		statusCodes: {
			400: {
				description:
					'Da ist etwas schiefgelaufen. Bitte überprüfe noch einmal deine URL, sie sollte so aussehen:<br /><br/><strong>[beratungsstelle].onlineberatung.net</strong>'
			}
		}
	},
	furtherSteps: {
		'step3.info': 'Ihr_e Berater_in antwortet so schnell wie möglich.'
	},
	groupChat: {
		create: {
			'button.label': 'Chat erstellen'
		}
	},
	legal: {
		'termsAndConditions.label': 'Nutzungsbedingungen'
	},
	login: {
		'register.linkLabel': 'Registrieren'
	},
	registration: {
		overlay: {
			success: {
				headline:
					'Herzlich willkommen<br>bei der Online-Beratung & Hilfe.'
			}
		},
		welcomeScreen: {
			subline: 'Wie läuft die Beratung & Hilfe ab?',
			info2: {
				text: 'Schicken Sie Ihre Nachricht an unsere Berater_innen'
			},
			info3: {
				text: 'Wir melden uns so schnell wie möglich bei Ihnen'
			}
		}
	},
	sessionList: {
		'createChat.buttonTitle': 'Chat erstellen'
	},
	twoFactorAuth: {
		subtitle:
			'Nutzen Sie eine weitere App für die Anmeldung mit Ihrem Online-Beratung & Hilfe Konto. Dadurch ist Ihr Konto sicherer vor einem möglichen unbefugtem Zugriff.'
	}
};

export default de;
