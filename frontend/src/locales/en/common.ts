const en = {
    language: {
        switchLabel: 'Language',
        de: 'German',
        en: 'English',
    },
    common: {
        loading: 'Loading...',
        close: 'Close',
        back: 'Back',
        volume: 'Volume',
        optional: '(optional)',
        noAnswer: 'Prefer not to say',
        pleaseAnswerQuestion: 'Please answer this question',
        saveInProgress: 'Saving...',
    },
    nav: {
        videoCatalog: 'Video catalog',
        endSurvey: 'Final survey',
        endSurveyLockedSuffix: 'locked',
        endSurveyLockedTitle: 'The final survey is unlocked once all required videos are completed.',
    },
    footer: {
        imprint: 'Imprint',
        privacy: 'Privacy policy',
        copyright: '© 2026 Alexander Sickler - StrataAudio | Bachelor thesis HSHL',
    },
    seo: {
        siteName: 'StrataAudio',
        consent: {
            title: 'Consent declaration',
            description: 'Consent information for taking part in the StrataAudio research study on interactive audio mixing for web videos.',
        },
        demographics: {
            title: 'Demographic survey',
            description: 'Anonymous demographic questions for participants in the StrataAudio study and their audio usage habits.',
        },
        videoCatalog: {
            title: 'Video catalog',
            description: 'Browse required and optional study videos in StrataAudio and track your viewing progress.',
        },
        watch: {
            title: 'Watch video: {{title}}',
            description: 'Watch study videos in mixer and standard mode to evaluate interactive audio controls in StrataAudio.',
        },
        endSurvey: {
            title: 'Final survey',
            description: 'Final questions about usability and overall experience within the StrataAudio research study.',
        },
    },
    videoCatalog: {
        loading: 'Loading...',
        loadError: 'Error loading video catalog: {{message}}',
        mandatoryTitle: 'Required videos',
        mandatoryHint: 'These videos must be completed first.',
        progress: 'Progress',
        mandatoryEmpty: 'All required videos are completed.',
        optionalTitle: 'Optional videos',
        optionalLockedHint: 'Optional videos unlock after all required videos were watched.',
        optionalEmpty: 'No optional videos available.',
        watchedTitle: 'Watched videos',
        watchedHint: 'Already completed content.',
        watchedEmpty: 'No videos watched yet.',
        statusLocked: 'Locked',
        statusWatched: 'Watched',
        thumbnailAlt: '{{title}} thumbnail',
        audioWaveAlt: 'Audio wave',
    },
    watchPage: {
        playbackNote: 'Note: The video plays twice, once in mixer mode and once in standard mode. The survey unlocks afterwards.',
        loadingVideo: 'Loading video...',
        loadingAudio: 'Loading audio...',
        errorTitle: 'Error',
        errorLoadingVideo: 'Error loading video: {{message}}',
        errorLoadingAudio: 'Error loading audio: {{message}}',
        unknownVideo: 'Unknown video',
    },
    watchMode: {
        mixerMode: 'Mixer mode',
        standardMode: 'Standard mode',
        unlockTitle: 'Survey unlock progress',
        unlockHint: 'Watch the video in both modes to unlock the survey.',
        currentMode: 'Current mode',
        nextMode: 'Next: {{mode}}.',
        allDone: 'All modes completed. You can now fill out the survey.',
    },
    player: {
        masterVolume: 'Master volume',
        trackVolume: '{{title}} volume',
        openAudioMixer: 'Open audio mixer',
    },
    demographics: {
        missingParticipant: 'Participant ID missing. Please confirm consent again.',
        missingAnswers: 'Please answer required questions before continuing.',
        submitFailed: 'Failed to save responses.',
        transparencyTitle: 'Transparency about automatically collected technical data',
        transparencyText: 'When your participation was created, technical baseline data was collected automatically. These values are shown for transparency and cannot be edited.',
        metaBrowser: 'Browser',
        metaBrowserVersion: 'Browser version',
        metaOs: 'Operating system',
        metaOsVersion: 'OS version',
        submitButton: 'Continue to catalog',
    },
    videoSurvey: {
        missingParticipant: 'Participant ID missing. Please confirm consent again.',
        missingAnswers: 'Please answer all questions before submitting.',
        missingAudioConfiguration: 'Audio configuration missing. Please watch the full video before submitting.',
        submitFailed: 'Failed to save survey.',
        title: 'Survey for video "{{title}}"',
        intro: 'Thank you for taking part in this survey. Your feedback is very valuable and helps improve the analysis. Please answer the following questions as honestly as possible.',
        lockedMessage: 'The survey unlocks once you have watched the video.',
        submitSuccess: 'Thank you! Your responses were saved.',
        submitButton: 'Submit survey',
        savedButton: 'Saved',
    },
    endSurvey: {
        missingParticipant: 'Participant ID missing. Please confirm consent again.',
        missingAnswers: 'Please answer all required questions before submitting.',
        loadFailed: 'Could not load existing final survey.',
        submitFailed: 'Could not save final survey.',
        title: 'Final survey',
        intro: 'Thank you for participating this far. These final questions help evaluate the overall experience.',
        editableHint: 'You can update and save your final survey at any time.',
        loadingExisting: 'Loading existing final survey...',
        submitSuccess: 'Thank you! Your final survey was saved.',
        submitButton: 'Submit final survey',
        updateButton: 'Update final survey',
    },
    consent: {
        submitError: 'Could not create participant.',
        wait: 'Please wait...',
        continue: 'Agree and continue',
        mustConsent: 'Please agree first',
    },
    surveys: {
        demographics: {
            title: 'Demographic survey',
            eyebrow: 'Before you start',
            intro: 'Thank you for participating. Before you begin, please provide a few details about yourself and your experience. Your answers remain anonymous and are only used for study evaluation.',
            submitHint: 'After submitting, you will be taken directly to the video catalog.',
            questions: {
                streamingUsage: {
                    question: 'How often do you use streaming services (YouTube, Netflix, Twitch, etc.)?',
                    options: {
                        daily: 'Daily',
                        multiple_per_week: 'Several times per week',
                        weekly: 'About once per week',
                        multiple_per_month: 'Several times per month',
                        rarely: 'Rarely / almost never',
                    },
                },
                audioOutputType: {
                    question: 'Which type of audio output do you use?',
                    options: {
                        built_in_speakers: 'Built-in speakers',
                        headphones: 'Headphones',
                        external_speakers: 'External speakers',
                    },
                },
                audioDisturbance: {
                    question: 'How often do you find the volume balance between background music/effects and speech in videos disturbing?',
                    minDescription: 'Never',
                    maxDescription: 'Always/Very often',
                },
                audioSettingsSatisfaction: {
                    question: 'How do you rate current audio setting options in web videos (usually only one overall volume slider, on/off)?',
                    minDescription: 'Very dissatisfied',
                    maxDescription: 'Very satisfied',
                },
                gender: {
                    question: 'What is your gender?',
                    options: {
                        female: 'Female',
                        male: 'Male',
                        diverse: 'Diverse',
                    },
                },
                ageRange: {
                    question: 'Which age group are you in?',
                    options: {
                        under_18: 'Under 18',
                        age_18_24: '18-24',
                        age_25_34: '25-34',
                        age_35_44: '35-44',
                        age_45_54: '45-54',
                        age_55_64: '55-64',
                        age_65_plus: '65 or older',
                    },
                },
            },
        },
        video: {
            title: 'Video survey',
            sections: {
                section1: 'Questions about synchronization',
                section2: 'Questions about user experience',
            },
            questions: {
                sync1: {
                    question: 'How synchronized were the audio tracks with the video?',
                    minDescription: 'Very unsynchronized',
                    maxDescription: 'Perfectly synchronized',
                },
                sync2: {
                    question: 'Were there issues such as audio dropouts or stuttering while mixing?',
                    options: {
                            Ja: 'Yes',
                            Nein: 'No',
                    },
                },
                experience1: {
                    question: 'To what extent did being able to control the mix increase your interest in the video?',
                    minDescription: 'Not at all',
                    maxDescription: 'Very strongly',
                },
                experience2: {
                    question: 'Which mode did you prefer while watching the video?',
                    options: {
                            Standard: 'Standard',
                            Mixer: 'Mixer',
                    },
                },
            },
        },
        end: {
            title: 'Final survey',
            sections: {
                section1: {
                    title: 'Usability questions',
                    description: 'Please rate the following statements regarding mixer usability.',
                },
                section2: {
                    title: 'User experience questions',
                    description: 'How would you rate your experience while mixing the audio?',
                },
                section3: {
                    title: 'Recommendation',
                },
                section4: {
                    title: 'Open feedback',
                },
            },
            questions: {
                sus1: {
                    question: 'I found the mixer system easy to use.',
                    minDescription: 'Strongly disagree',
                    maxDescription: 'Strongly agree',
                },
                sus2: {
                    question: 'I believe users can learn to use the mixer very quickly.',
                    minDescription: 'Strongly disagree',
                    maxDescription: 'Strongly agree',
                },
                sus3: {
                    question: 'I felt very confident while using the mixer.',
                    minDescription: 'Strongly disagree',
                    maxDescription: 'Strongly agree',
                },
                sus4: {
                    question: 'I found the different functions (volume, mute) well integrated in the player.',
                    minDescription: 'Strongly disagree',
                    maxDescription: 'Strongly agree',
                },
                ueq1: {
                    minDescription: 'Unpleasant',
                    maxDescription: 'Pleasant',
                },
                ueq2: {
                    minDescription: 'Cluttered',
                    maxDescription: 'Clear',
                },
                ueq3: {
                    minDescription: 'Inefficient',
                    maxDescription: 'Efficient',
                },
                ueq4: {
                    minDescription: 'Unimaginative',
                    maxDescription: 'Creative',
                },
                ueq5: {
                    minDescription: 'Conventional',
                    maxDescription: 'Novel',
                },
                nps1: {
                    minDescription: 'Very unlikely',
                    maxDescription: 'Very likely',
                },
                feedback1: {
                    question: 'Do you have any additional comments or suggestions for improving the mixer or the video?',
                },
            },
        },
    },
};

export default en;
