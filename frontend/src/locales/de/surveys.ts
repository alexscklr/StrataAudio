const deSurveys = {
    demographics: {
        title: 'Demografische Umfrage',
        eyebrow: 'Vor dem Start',
        intro: 'Vielen Dank für Deine Teilnahme. Bevor du startest, gib bitte noch einige Informationen zu Deiner Person und Erfahrung an. Die Antworten bleiben anonym und werden nur für die Auswertung der Studie verwendet.',
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
                    Ja: 'Ja',
                    Nein: 'Nein',
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
                    Standard: 'Standard',
                    Mixer: 'Mixer',
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
                minDescription: 'Herkömmlich',
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
};

export default deSurveys;
