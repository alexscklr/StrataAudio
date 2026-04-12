const de = {
    language: {
        switchLabel: 'Sprache',
        de: 'Deutsch',
        en: 'Englisch',
    },
    common: {
        loading: 'Lade...',
        close: 'Schließen',
        back: 'Zurück',
        volume: 'Lautstärke',
        optional: '(optional)',
        noAnswer: 'Keine Angabe',
        pleaseAnswerQuestion: 'Bitte beantworte diese Frage',
        saveInProgress: 'Speichere...',
    },
    nav: {
        videoCatalog: 'Videoauswahl',
        endSurvey: 'Endumfrage',
        endSurveyLockedSuffix: 'gesperrt',
        endSurveyLockedTitle: 'Die Endumfrage wird freigeschaltet, sobald alle erforderlichen Videos abgeschlossen wurden.',
    },
    footer: {
        imprint: 'Impressum',
        privacy: 'Datenschutz',
        copyright: '© 2026 Alexander Sickler - StrataAudio | Bachelorarbeit HSHL',
    },
    seo: {
        siteName: 'StrataAudio',
        consent: {
            title: 'Einverstaendniserklaerung',
            description: 'Einwilligung zur Teilnahme an der StrataAudio-Studie zur Evaluation eines interaktiven Audio-Mixers fuer Webvideos.',
        },
        demographics: {
            title: 'Demografische Umfrage',
            description: 'Anonyme demografische Angaben zur Teilnahme an der StrataAudio-Studie und zur Nutzung von Audio in Webvideos.',
        },
        videoCatalog: {
            title: 'Videoauswahl',
            description: 'Auswahl der Pflicht- und Optionalvideos fuer die StrataAudio-Studie mit Fortschrittsanzeige und Watch-Status.',
        },
        watch: {
            title: 'Video ansehen: {{title}}',
            description: 'Videowiedergabe mit Mixer- und Standard-Modus zur Bewertung interaktiver Audioeinstellungen in StrataAudio.',
        },
        endSurvey: {
            title: 'Abschliessende Umfrage',
            description: 'Abschliessende Bewertung der Nutzbarkeit und des Gesamterlebnisses innerhalb der StrataAudio-Studie.',
        },
    },
    videoCatalog: {
        loading: 'Lade...',
        loadError: 'Fehler beim Laden des Videokatalogs: {{message}}',
        mandatoryTitle: 'Erforderliche Videos',
        mandatoryHint: 'Diese Videos müssen zuerst abgeschlossen werden.',
        progress: 'Fortschritt',
        mandatoryEmpty: 'Alle erforderlichen Videos sind abgeschlossen.',
        optionalTitle: 'Optionale Videos',
        optionalLockedHint: 'Optionale Videos werden freigeschaltet, sobald alle erforderlichen Videos angesehen wurden.',
        optionalEmpty: 'Keine optionalen Videos verfügbar.',
        watchedTitle: 'Gesehene Videos',
        watchedHint: 'Bereits abgeschlossene Inhalte.',
        watchedEmpty: 'Noch keine Videos angesehen.',
        statusLocked: 'Gesperrt',
        statusWatched: 'Angeschaut',
        thumbnailAlt: '{{title}} Vorschaubild',
        audioWaveAlt: 'Audio-Welle',
    },
    watchPage: {
        playbackNote: 'Hinweis: Das Video wird zwei Mal abgespielt, einmal im Mixer-Modus und einmal im Standard-Modus. Die Umfrage wird anschließend freigeschaltet.',
        loadingVideo: 'Lade Video...',
        loadingAudio: 'Lade Audio...',
        errorTitle: 'Fehler',
        errorLoadingVideo: 'Fehler beim Laden des Videos: {{message}}',
        errorLoadingAudio: 'Fehler beim Laden des Audios: {{message}}',
        unknownVideo: 'Unbekanntes Video',
    },
    watchMode: {
        mixerMode: 'Mixer-Modus',
        standardMode: 'Standard-Modus',
        unlockTitle: 'Freischaltung der Umfrage',
        unlockHint: 'Schau das Video in beiden Modi, um die Umfrage freizuschalten.',
        currentMode: 'Aktueller Modus',
        nextMode: 'Als nächstes: {{mode}}.',
        allDone: 'Alle Modi abgeschlossen. Du kannst jetzt die Umfrage ausfüllen.',
    },
    player: {
        masterVolume: 'Master-Lautstärke',
        trackVolume: '{{title}} Lautstärke',
        openAudioMixer: 'Audio-Mixer öffnen',
    },
    demographics: {
        missingParticipant: 'Participant-ID fehlt. Bitte Einverstaendnis erneut bestaetigen.',
        missingAnswers: 'Bitte beantworte die Pflichtfragen, bevor du fortfaehrst.',
        submitFailed: 'Die Angaben konnten nicht gespeichert werden.',
        transparencyTitle: 'Transparenz zu automatisch erfassten technischen Daten',
        transparencyText: 'Beim Anlegen der Teilnahme wurden technische Basisdaten automatisch erfasst. Diese Angaben sind hier nur zur Einsicht ausgegraut dargestellt und koennen von dir nicht bearbeitet werden.',
        metaBrowser: 'Browser',
        metaBrowserVersion: 'Browser-Version',
        metaOs: 'Betriebssystem',
        metaOsVersion: 'OS-Version',
        submitButton: 'Weiter zum Katalog',
    },
    videoSurvey: {
        missingParticipant: 'Participant-ID fehlt. Bitte Einverständnis erneut bestätigen.',
        missingAnswers: 'Bitte beantworte alle Fragen, bevor du absendest.',
        missingAudioConfiguration: 'Audio-Konfiguration fehlt. Bitte schaue das Video vollständig an, bevor du absendest.',
        submitFailed: 'Umfrage konnte nicht gespeichert werden.',
        title: 'Umfrage zum Video "{{title}}"',
        intro: 'Vielen Dank, dass du an der Videoumfrage teilnimmst! Deine Meinung ist sehr wichtig und hilft, genauere Einblicke zu gewinnen. Bitte beantworte die folgenden Fragen so ehrlich wie möglich.',
        lockedMessage: 'Die Umfrage wird freigeschaltet, sobald du das Video angeschaut hast.',
        submitSuccess: 'Vielen Dank! Deine Antworten wurden gespeichert.',
        submitButton: 'Umfrage absenden',
        savedButton: 'Gespeichert',
    },
    endSurvey: {
        missingParticipant: 'Participant-ID fehlt. Bitte Einverständnis erneut bestätigen.',
        missingAnswers: 'Bitte beantworte alle Pflichtfragen, bevor du absendest.',
        loadFailed: 'Bestehende Endumfrage konnte nicht geladen werden.',
        submitFailed: 'Endumfrage konnte nicht gespeichert werden.',
        title: 'Abschließende Umfrage',
        intro: 'Vielen Dank, dass du bis hierhin teilgenommen hast. Diese abschließenden Fragen helfen, das gesamte Nutzungserlebnis zu bewerten.',
        editableHint: 'Du kannst deine Endumfrage jederzeit anpassen und erneut speichern.',
        loadingExisting: 'Lade bestehende Endumfrage...',
        submitSuccess: 'Vielen Dank! Deine Endumfrage wurde gespeichert.',
        submitButton: 'Endumfrage absenden',
        updateButton: 'Endumfrage aktualisieren',
    },
    consent: {
        submitError: 'Teilnehmer konnte nicht angelegt werden.',
        wait: 'Bitte warten...',
        continue: 'Einverstanden und Fortfahren',
        mustConsent: 'Bitte zustimmen',
    },
    surveys: {
        demographics: {
            title: 'Demografische Umfrage',
            eyebrow: 'Vor dem Start',
            intro: 'Vielen Dank für Deine Teilnahme. Bevor du startest, gib bitte noch einige Informationen zu Deiner Person und Erfahrung an. Die Antworten bleiben anonym und werden nur für die Auswertung der Studie verwendet.',
            submitHint: 'Nach dem Absenden gelangst du direkt zum Videokatalog.',
            questions: {
                streamingUsage: {
                    question: 'Wie oft nutzen Sie Streaming-Dienste (YouTube, Netflix, Twitch etc.)?',
                    options: {
                        daily: 'Täglich',
                        multiple_per_week: 'Mehrmals pro Woche',
                        weekly: 'Etwa einmal pro Woche',
                        multiple_per_month: 'Mehrmals pro Monat',
                        rarely: 'Seltener / Fast nie',
                    },
                },
                audioOutputType: {
                    question: 'Welche Art von Audio-Ausgabe nutzt du?',
                    options: {
                        built_in_speakers: 'Eingebaute Lautsprecher',
                        headphones: 'Kopfhörer',
                        external_speakers: 'Externe Boxen',
                    },
                },
                audioDisturbance: {
                    question: 'Wie oft empfindest du das Lautstärkeverhältnis zwischen Hintergrundmusik / Effekten und Sprache in Videos als störend?',
                    minDescription: 'Nie',
                    maxDescription: 'Immer/Sehr häufig',
                },
                audioSettingsSatisfaction: {
                    question: 'Wie bewertest du die aktuellen Audio-Einstellmöglichkeiten (meist nur einen gesamten Lautstärkeregler, an/aus) bei Videos im Web?',
                    minDescription: 'Sehr unzufrieden',
                    maxDescription: 'Sehr zufrieden',
                },
                gender: {
                    question: 'Welches Geschlecht hast du?',
                    options: {
                        female: 'Weiblich',
                        male: 'Männlich',
                        diverse: 'Divers',
                    },
                },
                ageRange: {
                    question: 'In welchem Alter befindest du dich?',
                    options: {
                        under_18: 'Unter 18',
                        age_18_24: '18-24',
                        age_25_34: '25-34',
                        age_35_44: '35-44',
                        age_45_54: '45-54',
                        age_55_64: '55-64',
                        age_65_plus: '65 oder älter',
                    },
                },
            },
        },
        video: {
            title: 'Umfrage zum Video',
            sections: {
                section1: 'Fragen zum Thema Synchronisation',
                section2: 'Fragen zum Thema Erlebnis',
            },
            questions: {
                sync1: {
                    question: 'Wie synchron waren die Tonspuren mit dem Video?',
                    minDescription: 'Sehr unsynchron',
                    maxDescription: 'Perfekt synchron',
                },
                sync2: {
                    question: 'Gab es Störungen wie Tonaussetzer oder Ruckeln während des Tonmischens?',
                    options: {
                        yes: 'Ja',
                        no: 'Nein',
                    },
                },
                experience1: {
                    question: 'Inwiefern hat die Möglichkeit, den Mix selbst zu bestimmen, Ihr Interesse am Video gesteigert?',
                    minDescription: 'Gar nicht',
                    maxDescription: 'Sehr stark',
                },
                experience2: {
                    question: 'Welchen Modus haben Sie beim Ansehen des Videos bevorzugt?',
                    options: {
                        standard: 'Standard',
                        mixer: 'Mixer',
                    },
                },
            },
        },
        end: {
            title: 'Abschließende Umfrage',
            sections: {
                section1: {
                    title: 'Fragen zur Benutzbarkeit',
                    description: 'Bitte bewerten Sie die folgenden Aussagen zur Benutzbarkeit des Mischpults.',
                },
                section2: {
                    title: 'Fragen zur Benutzererfahrung',
                    description: 'Wie bewerten Sie Ihr Erlebnis beim Mischen des Tons?',
                },
                section3: {
                    title: 'Weiterempfehlung',
                },
                section4: {
                    title: 'Offenes Feedback',
                },
            },
            questions: {
                sus1: {
                    question: 'Ich fand das Mischpult-System einfach zu bedienen.',
                    minDescription: 'Stimme überhaupt nicht zu',
                    maxDescription: 'Stimme voll und ganz zu',
                },
                sus2: {
                    question: 'Ich glaube, dass man die Bedienung des Mischpults sehr schnell lernt.',
                    minDescription: 'Stimme überhaupt nicht zu',
                    maxDescription: 'Stimme voll und ganz zu',
                },
                sus3: {
                    question: 'Ich fühlte mich bei der Benutzung des Mischpults sehr sicher.',
                    minDescription: 'Stimme überhaupt nicht zu',
                    maxDescription: 'Stimme voll und ganz zu',
                },
                sus4: {
                    question: 'Ich fand die verschiedenen Funktionen (Volume, Mute) im Player gut integriert.',
                    minDescription: 'Stimme überhaupt nicht zu',
                    maxDescription: 'Stimme voll und ganz zu',
                },
                ueq1: {
                    minDescription: 'Unerfreulich',
                    maxDescription: 'Erfreulich',
                },
                ueq2: {
                    minDescription: 'Überladen',
                    maxDescription: 'Übersichtlich',
                },
                ueq3: {
                    minDescription: 'Ineffizient',
                    maxDescription: 'Effizient',
                },
                ueq4: {
                    minDescription: 'Phantasielos',
                    maxDescription: 'Kreativ',
                },
                ueq5: {
                    minDescription: 'Herkoemmlich',
                    maxDescription: 'Neuartig',
                },
                nps1: {
                    minDescription: 'Sehr unwahrscheinlich',
                    maxDescription: 'Sehr wahrscheinlich',
                },
                feedback1: {
                    question: 'Haben Sie weitere Anmerkungen oder Verbesserungsvorschlaege zum Mischpult oder dem Video?',
                },
            },
        },
    },
};

export default de;
