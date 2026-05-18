const enPages = {
  videoCatalog: {
    loading: "Loading...",
    loadError: "Error loading video catalog: {{message}}",
    mandatoryTitle: "Required videos",
    mandatoryHint: "These videos must be completed to unlock the final survey.",
    progress: "Progress",
    mandatoryEmpty: "All required videos are completed.",
    optionalTitle: "Optional videos",
    optionalLockedHint:
      "Optional videos unlock after all required videos were watched.",
    optionalEmpty: "No optional videos available.",
    watchedTitle: "Watched videos",
    watchedHint: "Already completed content.",
    watchedEmpty: "No videos watched yet.",
    statusLocked: "Locked",
    statusWatched: "Watched",
    thumbnailAlt: "{{title}} thumbnail",
    audioWaveAlt: "Audio wave",
  },
  videoManagement: {
    title: "Video management",
    subtitle: "View videos, remove entries, and upload new content.",
    authLoading: "Checking administrator login...",
    authRequired:
      "This management page is only available to signed-in administrators.",
    authHint:
      "Please sign in with the existing admin account to view, delete, or upload videos.",
    inviteHint:
      "Alternatively, a personal upload link with invite token can be used (upload only, no list/delete access).",
    inviteAdminTitle: "Create upload invite",
    inviteAdminHint:
      "Generate a personal link for external uploaders. This link only allows uploads to user_uploads.",
    inviteLabel: "Label (optional)",
    inviteLabelPlaceholder: "e.g. Editing team A",
    inviteExpiresHours: "Valid for hours",
    inviteMaxUses: "Maximum uses",
    inviteCreateAction: "Create invite link",
    inviteCreating: "Creating invite...",
    inviteCreateSuccess: "Invite created. Share this link:",
    inviteCopyAction: "Copy link",
    loading: "Loading video data...",
    loadError: "Error loading video data: {{message}}",
    empty: "No videos available yet.",
    genre: "Genre",
    mandatory: "Mandatory",
    yes: "Yes",
    no: "No",
    duration: "Duration (seconds)",
    noDuration: "Not set",
    deleteAction: "Remove video",
    deleting: "Removing...",
    deleteConfirm: 'Do you really want to remove "{{title}}"?',
    uploadTitle: "Upload new video",
    uploadTitleInvite: "Upload (personal link)",
    modeCatalog: "HLS + database",
    modeRaw: "Raw files to user_uploads",
    folderHint:
      "Expected structure: master.m3u8, thumbnail.webp, stream_0 (video), stream_1..n (audio).",
    mediaFolderHintDetailed:
      "Hint: Files in the selected folder should be HLS/video assets (e.g. .m3u8, .ts, .mp4). Maximum file size depends on the storage bucket limit.",
    mediaFolder: "Select full media folder",
    checkMasterOk: "master.m3u8 detected",
    checkMasterMissing: "master.m3u8 missing",
    checkStream0Ok: "stream_0/playlist.m3u8 detected",
    checkStream0Missing: "stream_0/playlist.m3u8 missing",
    checkThumbnailOk: "Thumbnail detected",
    checkThumbnailMissing: "Thumbnail not found (optional)",
    checkAudioTracksOk: "{{count}} audio streams detected",
    checkAudioTracksMissing:
      "No audio streams detected (stream_1, stream_2, ...)",
    checkRawVideoOk: "Video file detected",
    checkRawVideoMissing: "Video file missing",
    checkRawThumbnailOk: "Thumbnail file detected",
    checkRawThumbnailMissing: "Thumbnail file missing (optional)",
    checkRawAudiosOk: "{{count}} audio files detected",
    titleDe: "Title (DE)",
    titleEn: "Title (EN)",
    localizedTitle: "Title",
    descriptionDe: "Description (DE)",
    descriptionEn: "Description (EN)",
    localizedDescription: "Description",
    genreDe: "Genre (DE)",
    genreEn: "Genre (EN)",
    localizedGenre: "Genre",
    audioTracksTitle: "Configure audio streams",
    audioTracksHint:
      "Set what each audio track contains and the default volume.",
    rawVideoFile: "Video file",
    rawVideoFileHint:
      "Allowed formats: .mp4, .mov, .mkv, .webm, .m4v. Maximum 300 MiB (target: HD, 30fps, up to 5 minutes).",
    rawVideoContainsAudio: "Contains audio",
    rawVideoContainsAudioTitle: "Embedded audio in video",
    rawVideoAudioMetaComplete: "Embedded video-audio metadata complete.",
    rawVideoAudioMetaRequired:
      "Please describe what the embedded video-audio track contains.",
    rawThumbnailFile: "Thumbnail file",
    rawThumbnailFileHint:
      "Allowed formats: .png, .jpg, .jpeg, .webp, .gif, .avif. Maximum 20 MiB. Optional.",
    rawAudioFiles: "Audio files",
    rawAudioPickerHint:
      'Select one audio file per field. Click "Add another audio" for more files or use the automatically added next field.',
    rawAudioMinRequired: "Please provide at least {{count}} audio files.",
    rawAudioFileLabel: "Audio file {{index}}",
    rawAudioFileHint:
      "Allowed formats: .aiff, .aif, .wav, .mp3, .aac, .flac, .m4a, .ogg. Maximum 64 MiB per file.",
    addAudioFileAction: "Add another audio",
    removeAudioFileAction: "Remove audio",
    rawAudioMetaTitle: "Configure audio files",
    rawAudioMetaHint:
      "Set what each audio file contains and the default volume.",
    rawAudioMetaComplete: "Audio metadata complete.",
    rawAudioMetaRequired:
      "Please describe what each selected audio file contains.",
    audioContentDe: "What does this audio track contain? (DE)",
    audioContentEn: "What does this audio track contain? (EN)",
    localizedAudioContent:
      "What does this audio track contain? (e.g. background music or voice)",
    audioDefaultVolume: "Default volume (0 to 1)",
    detectedFiles: "Detected files",
    moreFiles: "And {{count}} more files...",
    uploadAction: "Upload video",
    rawUploadAction: "Upload raw files",
    uploading: "Uploading...",
    uploadSuccess: "Video uploaded successfully.",
    rawUploadSuccess: "Raw files uploaded successfully to user_uploads.",
    thumbnailAlt: "Thumbnail for {{title}}",
    inviteAttributionHint:
      "If attribution is desired, the name can be included in the title or description.",
    inviteConsentLabel:
      "I agree that my upload may be stored and used for the StrataAudio study, and I confirm that I hold the necessary rights to the uploaded content.",
  },
  watchPage: {
    playbackNote:
      "Note: The video plays twice, once in mixer mode and once in standard mode. The survey unlocks afterwards.",
    playbackNoteMidSwitch:
      "Note: For this video, the watch mode switches at the midpoint (mixer and standard remain in random order). The survey unlocks afterwards.",
    activeModeBadge: "Active",
    activeModeHint: "Midpoint watch mode switching is enabled.",
    technicalMetadataTitle: "Credits",
    technicalMetadataCategory: "Category",
    technicalMetadataSource: "Source",
    technicalMetadataLicense: "License",
    technicalMetadataMissingValue: "-",
    technicalMetadataEmpty: "No technical metadata available.",
    loadingVideo: "Loading video...",
    loadingAudio: "Loading audio...",
    errorTitle: "Error",
    errorLoadingVideo: "Error loading video: {{message}}",
    errorLoadingAudio: "Error loading audio: {{message}}",
    unknownVideo: "Unknown video",
  },
  watchMode: {
    mixerMode: "Mixer mode",
    standardMode: "Standard mode",
    unlockTitle: "Survey unlock progress",
    unlockHint: "Watch the video in both modes to unlock the survey.",
    currentMode: "Current mode",
    nextMode: "Next: {{mode}}.",
    allDone: "All modes completed. You can now fill out the survey.",
  },
  player: {
    masterVolume: "Master",
    trackVolume: "{{title}} volume",
    openAudioMixer: "Open audio mixer",
  },
  demographics: {
    missingParticipant: "Participant ID missing. Please confirm consent again.",
    missingAnswers: "Please answer required questions before continuing.",
    submitFailed: "Failed to save responses.",
    transparencyTitle:
      "Transparency about automatically collected technical data",
    transparencyText:
      "When your participation was created, technical baseline data was collected automatically. These values are shown for transparency and cannot be edited.",
    metaBrowser: "Browser",
    metaBrowserVersion: "Browser version",
    metaOs: "Operating system",
    metaOsVersion: "OS version",
    submitButton: "Continue to catalog",
  },
  videoSurvey: {
    missingParticipant: "Participant ID missing. Please confirm consent again.",
    missingAnswers: "Please answer all questions before submitting.",
    missingAudioConfiguration:
      "Audio configuration missing. Please watch the full video before submitting.",
    submitFailed: "Failed to save survey.",
    title: 'Survey for video "{{title}}"',
    intro:
      "Thank you for taking part in this survey. Your feedback is very valuable and helps improve the analysis. Please answer the following questions as honestly as possible.",
    lockedMessage: "The survey unlocks once you have watched the video.",
    submitSuccess: "Thank you! Your responses were saved.",
    submitButton: "Submit survey",
    savedButton: "Saved",
  },
  endSurvey: {
    missingParticipant: "Participant ID missing. Please confirm consent again.",
    missingAnswers: "Please answer all required questions before submitting.",
    loadFailed: "Could not load existing final survey.",
    submitFailed: "Could not save final survey.",
    title: "Final survey",
    intro:
      "Thank you for participating this far. These final questions help evaluate the overall experience.",
    editableHint: "You can update and save your final survey at any time.",
    loadingExisting: "Loading existing final survey...",
    submitSuccess: "Thank you! Your final survey was saved.",
    submitButton: "Submit final survey",
    updateButton: "Update final survey",
    rewardPopup: {
      title: "Thank you for your participation",
      thanks: "Your answers help improve the audio experience in web videos.",
      codeText: "Here is your code to redeem points:",
      codeAria: "SurveyCircle code",
      copyButton: "Copy code",
      copiedButton: "Copied",
      linkText: "Redeem Survey Code with one click",
      linkLabel: "SurveyCircle",
      linkUrl: "https://www.surveycircle.com/32SQ-FSHU-8MTM-5QQ8/",
    },
  },
  consent: {
    submitError: "Study not active yet or Error.",
    wait: "Please wait...",
    continue: "Agree and continue",
    mustConsent: "Please agree first",
  },
  consentPage: {
    title: "Consent Declaration",
    surveyCircleNotice: {
      prefix: "For ",
      suffix:
        " users: You will receive the code to redeem points after completing the final survey.",
    },
    topic:
      "Topic: User-centered audio mixing of individual audio tracks for web videos",
    lead: "Study lead: Alexander Sickler, Hamm-Lippstadt University of Applied Sciences (HSHL)",
    contactLabel: "Contact",
    duration:
      "This test takes about 10 minutes and can be extended if desired. You will watch videos in two modes (mixer and standard) in random order and answer related questions. Videos up to 2 minutes are watched fully in both modes, while longer videos switch mode at the midpoint. Afterwards, you can continue watching and rating additional videos to support the research.",
    sections: {
      purposeTitle: "Purpose of data collection",
      purposeText:
        "The data collected through this survey/application is used solely for scientific analysis as part of my bachelor thesis. The goal is to evaluate requirements for an interactive browser-based audio mixer.",
      dataTypeTitle: "Types of collected data",
      dataTypeLead: "The following data is collected:",
      storageTitle: "Storage and security (Supabase)",
      storageText:
        "Data is stored in encrypted form in a database provided by Supabase, Inc.",
      voluntaryTitle: "Voluntary participation and withdrawal",
      voluntaryText:
        "Participation is voluntary. You may withdraw your consent at any time by closing the application.",
      sharingTitle: "Data sharing",
      sharingText:
        "Raw data is not shared with third parties. Results are published in aggregated form (statistics/charts) within the bachelor thesis.",
      consentTitle: "Consent",
      consentText: "By clicking [I agree], I confirm that I:",
    },
    bullets: {
      dataTypes: [
        "Demographic data: age, gender, and information about your experience with audio technology.",
        "Usage and interaction data: your video ratings and automated logs of your interaction with the audio mixer (e.g., timestamp and intensity of slider ratings, final audio configuration).",
        "Technical data: browser type and device type, but no directly identifiable data such as name or email address (anonymous collection).",
        "Anonymization: to avoid multiple participations, a technical user hash is generated. No IP addresses or directly identifiable data are stored.",
      ],
      storage: [
        "Server location: data is stored in the EU region (Frankfurt, Germany) to meet GDPR requirements.",
        "Security: Supabase uses modern security standards (AES-256 encryption) to protect data from unauthorized access.",
      ],
      consent: [
        "I am at least 18 years old.",
        "I have read and understood the information above.",
        "I agree to the anonymized storage of my data on Supabase servers.",
        "I agree that data collection starts immediately after consent.",
      ],
    },
    checkbox: "I agree",
  },
  imprintPage: {
    metaTitle: "Imprint",
    metaDescription:
      "Legal notice and contact details for the StrataAudio research web application.",
    title: "Imprint",
    operator: "Website operator",
    contentOwner: "Responsible for content",
    liability: "Liability notice",
    liabilityText:
      "This website was created as part of a bachelor thesis at Hamm-Lippstadt University of Applied Sciences (HSHL). It is intended exclusively for scientific purposes and does not pursue commercial interests. Despite careful content control, I accept no liability for the content of external links. The operators of linked pages are solely responsible for their content.",
  },
  privacyPolicyPage: {
    metaTitle: "Privacy Policy",
    metaDescription:
      "Privacy information about data processing within the StrataAudio research study.",
    title: "Privacy Policy",
    intro:
      "This privacy policy informs you about the type, scope, and purpose of processing personal data within this scientific web application.",
    version: "Version: 2026-04-10",
    controllerTitle: "Controller",
    purposeTitle: "Purpose and legal basis of processing",
    purposeText:
      "Data processing is carried out solely for scientific purposes within a bachelor thesis at Hamm-Lippstadt University of Applied Sciences (HSHL). Collected data is used to evaluate requirements for interactive web audio mixers.",
    purposeList: [
      "Execution of the scientific study and operation of the application.",
      "Analysis of interaction and survey results regarding audio perception.",
      "Ensuring technical operation and preventing multiple participations.",
    ],
    legalBasisLabel: "Legal basis:",
    legalBasisText:
      "Processing is based on your voluntary consent according to Art. 6(1)(a) GDPR.",
    dataTypesTitle: "Types of collected data",
    dataTypesLead:
      "Data collection starts immediately after your explicit consent. The following data is processed:",
    dataTypesList: [
      "Demographic data: Age, gender, and audio-related experience.",
      "Usage and interaction data: Logging slider movements (timestamps, values), selected audio settings, and responses to video surveys.",
      "Technical metadata: Browser type and device type (e.g., smartphone/PC).",
      "Anonymization: No IP addresses or directly identifiable data (names, emails) are stored permanently. A technical user hash is used to avoid multiple participations.",
    ],
    retentionTitle: "Hosting and Infrastructure",
    hostingIntro:
      "To provide this application, services from third-party providers acting as data processors are used:",

    supabaseLabel: "Database & Backend:",
    supabaseText:
      "Supabase, Inc. for storing research data (Frankfurt region).",

    vercelLabel: "Frontend Hosting:",
    vercelText:
      "Vercel Inc. for providing the web interface. Technical connection data (e.g., IP address) is processed during access but not stored permanently.",

    cloudflareLabel: "Media Storage:",
    cloudflareText:
      "Cloudflare, Inc. (R2 Storage) for providing audio and video files. Delivery is handled via servers in the EU (Western Europe/Frankfurt region).",

    retentionPeriodLabel: "Planned retention period:",
    retentionPeriodText:
      "Data is stored until final completion of the bachelor thesis examination process and then deleted.",
    cookiesTitle: "Cookies and Local Storage",
    cookiesText:
      "To ensure functionality, the application stores technical information (such as a user hash to avoid multiple participations and your individual progress when watching videos) locally in the browser (Local Storage). These data are used solely for technical purposes and are not used for tracking or profiling.",
    privacyNotesTitle: "Data protection notes",
    privacyNotesText:
      "No IP addresses or tracking cookies are stored. Only technically necessary data (anonymized user hash, upload metadata) is processed. Local Storage is used exclusively for the user hash and video progress. Data subject rights: Contact via email, with a note on anonymization and limited erasability. Data processing agreements exist with Supabase, Cloudflare, Vercel, and hCaptcha. Privacy by design: data minimization, storage limitation, no permanent identification. Security measures: TLS, Supabase encryption, no sensitive data in plain text. Third-country transfers: see hCaptcha and Cloudflare, secured via standard contractual clauses.",
    hcaptchaTitle: "Use of hCaptcha",
    hcaptchaText:
      "To protect against abuse and spam, the hCaptcha service (Intuition Machines, Inc., USA) is used. When using the service, personal data (e.g. IP address, browser data) may be transmitted to the USA. More information can be found in the hCaptcha privacy policy: ",
    hcaptchaLinkText: "https://www.hcaptcha.com/privacy",
    hcaptchaLabel: "hCaptcha Privacy Policy",
    withdrawalLabel: "Withdrawal note:",
    withdrawalText:
      "Because collection is anonymized, data cannot be technically assigned to a specific person after survey submission. Subsequent identification or deletion of individual records is therefore not possible.",
    rightsTitle: "Your rights",
    rightsLead:
      "Under GDPR, you are entitled to the following rights in particular:",
    rightsList: [
      "Access to processed data (Art. 15 GDPR).",
      "Rectification of inaccurate data (Art. 16 GDPR).",
      "Deletion of your data (Art. 17 GDPR - where technically possible through identifiability).",
      "Withdrawal of granted consent with effect for the future (Art. 7(3) GDPR).",
    ],
    rightsClosing:
      "You also have the right to lodge a complaint with a data protection supervisory authority.",
  },
};

export default enPages;
