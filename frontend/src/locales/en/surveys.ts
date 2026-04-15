const enSurveys = {
    demographics: {
        title: 'Demographic survey',
        eyebrow: 'Before you start',
        intro: 'Thank you for participating. Before you begin, please provide a few details about yourself and your experience. Your answers remain anonymous and are only used for study evaluation.',
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
};

export default enSurveys;
