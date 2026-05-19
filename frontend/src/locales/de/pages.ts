const dePages = {
  videoCatalog: {
    loading: "Lade...",
    loadError: "Fehler beim Laden des Videokatalogs: {{message}}",
    mandatoryTitle: "Erforderliche Videos",
    mandatoryHint:
      "Diese Videos müssen abgeschlossen werden, um die Endumfrage freizuschalten.",
    progress: "Fortschritt",
    mandatoryEmpty: "Alle erforderlichen Videos sind abgeschlossen.",
    proceedToSurvey: "Zur Endumfrage",
    optionalTitle: "Optionale Videos",
    optionalLockedHint:
      "Optionale Videos werden freigeschaltet, sobald alle erforderlichen Videos angesehen wurden.",
    optionalEmpty: "Keine optionalen Videos verfügbar.",
    watchedTitle: "Gesehene Videos",
    watchedHint: "Bereits abgeschlossene Inhalte.",
    watchedEmpty: "Noch keine Videos angesehen.",
    statusLocked: "Gesperrt",
    statusWatched: "Angeschaut",
    thumbnailAlt: "{{title}} Vorschaubild",
    audioWaveAlt: "Audio-Welle",
  },
  videoManagement: {
    title: "Videoverwaltung",
    subtitle:
      "Hier kannst du Videos einsehen, entfernen und neue Inhalte hochladen.",
    authLoading: "Prüfe Administrator-Login...",
    authRequired:
      "Diese Verwaltungsseite ist nur für eingeloggte Administratoren verfügbar.",
    authHint:
      "Bitte melde dich mit dem vorhandenen Admin-Account an, um Videos anzuzeigen, zu löschen oder hochzuladen.",
    inviteHint:
      "Alternativ kann ein persönlicher Upload-Link mit invite-Token verwendet werden (nur Upload, keine Anzeige/Löschung).",
    inviteAdminTitle: "Upload-Invite erstellen",
    inviteAdminHint:
      "Erzeuge einen persönlichen Link für externe Uploader. Der Link erlaubt nur den Upload in user_uploads.",
    inviteLabel: "Bezeichnung (optional)",
    inviteLabelPlaceholder: "z. B. Cutter Team A",
    inviteExpiresHours: "Gültig für Stunden",
    inviteMaxUses: "Maximale Verwendungen",
    inviteCreateAction: "Invite-Link erstellen",
    inviteCreating: "Invite wird erstellt...",
    inviteCreateSuccess: "Invite erstellt. Teile den folgenden Link:",
    inviteCopyAction: "Link kopieren",
    loading: "Lade Videodaten...",
    loadError: "Fehler beim Laden der Videodaten: {{message}}",
    empty: "Es sind aktuell keine Videos vorhanden.",
    genre: "Genre",
    mandatory: "Erforderlich",
    yes: "Ja",
    no: "Nein",
    duration: "Dauer (Sekunden)",
    noDuration: "Keine Angabe",
    deleteAction: "Video entfernen",
    deleting: "Entferne...",
    deleteConfirm: 'Soll das Video "{{title}}" wirklich entfernt werden?',
    uploadTitle: "Neues Video hochladen",
    uploadTitleInvite: "Upload (persönlicher Link)",
    modeCatalog: "HLS + Datenbank",
    modeRaw: "Rohdaten nach user_uploads",
    folderHint:
      "Erwartete Struktur: master.m3u8, thumbnail.webp, stream_0 (Video), stream_1..n (Audio).",
    mediaFolderHintDetailed:
      "Hinweis: Enthaltene Dateien im Ordner sollten HLS/Video-Dateien (z. B. .m3u8, .ts, .mp4) sein. Die maximal erlaubte Dateigroesse richtet sich nach dem Storage-Bucket-Limit.",
    mediaFolder: "Kompletten Medienordner auswählen",
    checkMasterOk: "master.m3u8 erkannt",
    checkMasterMissing: "master.m3u8 fehlt",
    checkStream0Ok: "stream_0/playlist.m3u8 erkannt",
    checkStream0Missing: "stream_0/playlist.m3u8 fehlt",
    checkThumbnailOk: "Thumbnail erkannt",
    checkThumbnailMissing: "Thumbnail nicht gefunden (optional)",
    checkAudioTracksOk: "{{count}} Audio-Streams erkannt",
    checkAudioTracksMissing:
      "Keine Audio-Streams erkannt (stream_1, stream_2, ...)",
    checkRawVideoOk: "Video-Datei erkannt",
    checkRawVideoMissing: "Video-Datei fehlt",
    checkRawThumbnailOk: "Thumbnail-Datei erkannt",
    checkRawThumbnailMissing: "Thumbnail-Datei fehlt (optional)",
    checkRawAudiosOk: "{{count}} Audio-Dateien erkannt",
    titleDe: "Titel (DE)",
    titleEn: "Titel (EN)",
    localizedTitle: "Titel",
    descriptionDe: "Beschreibung (DE)",
    descriptionEn: "Beschreibung (EN)",
    localizedDescription: "Beschreibung",
    genreDe: "Genre (DE)",
    genreEn: "Genre (EN)",
    localizedGenre: "Genre",
    audioTracksTitle: "Audio-Streams konfigurieren",
    audioTracksHint:
      "Beschreibe pro Audiospur, was sie enthält, und setze die Standardlautstärke.",
    rawVideoFile: "Video-Datei",
    rawVideoFileHint:
      "Erlaubte Formate: .mp4, .mov, .mkv, .webm, .m4v. Maximal 300 MiB (Ziel: HD, 30fps, bis 5 Minuten).",
    rawVideoContainsAudio: "Enthält Audio",
    rawVideoContainsAudioTitle: "Eingebettete Audiospur im Video",
    rawVideoAudioMetaComplete:
      "Metadaten der eingebetteten Audiospur vollständig.",
    rawVideoAudioMetaRequired:
      "Bitte beschreibe, was die im Video eingebettete Audiospur enthält.",
    rawThumbnailFile: "Thumbnail-Datei",
    rawThumbnailFileHint:
      "Erlaubte Formate: .png, .jpg, .jpeg, .webp, .gif, .avif. Maximal 20 MiB. Optional.",
    rawAudioFiles: "Audio-Dateien",
    rawAudioPickerHint:
      'Wähle pro Feld genau eine Audio-Datei. Für weitere Dateien klicke auf "Weitere Audio hinzufügen" oder nutze das automatisch nächste Feld.',
    rawAudioMinRequired: "Bitte gib mindestens {{count}} Audio-Dateien an.",
    rawAudioFileLabel: "Audio-Datei {{index}}",
    rawAudioFileHint:
      "Erlaubte Formate: .aiff, .aif, .wav, .mp3, .aac, .flac, .m4a, .ogg. Maximal 64 MiB pro Datei.",
    addAudioFileAction: "Weitere Audio hinzufügen",
    removeAudioFileAction: "Audio entfernen",
    rawAudioMetaTitle: "Audio-Dateien konfigurieren",
    rawAudioMetaHint:
      "Beschreibe pro Audio-Datei, was sie enthält, und setze die Standardlautstärke.",
    rawAudioMetaComplete: "Audio-Metadaten vollständig.",
    rawAudioMetaRequired:
      "Bitte beschreibe für jede ausgewählte Audio-Datei, was sie enthält.",
    audioContentDe: "Was enthält diese Audiospur? (DE)",
    audioContentEn: "Was enthält diese Audiospur? (EN)",
    localizedAudioContent:
      "Was enthält diese Audiospur? (z. B. Hintergrundmusik oder Stimme)",
    audioDefaultVolume: "Standardlautstärke (0 bis 1)",
    detectedFiles: "Erkannte Dateien",
    moreFiles: "Und {{count}} weitere Dateien...",
    uploadAction: "Video hochladen",
    rawUploadAction: "Rohdaten hochladen",
    uploading: "Lade hoch...",
    uploadSuccess: "Video wurde erfolgreich hochgeladen.",
    rawUploadSuccess:
      "Rohdaten wurden erfolgreich nach user_uploads hochgeladen.",
    thumbnailAlt: "Thumbnail zu {{title}}",
    inviteAttributionHint:
      "Falls eine namentliche Nennung gewuenscht ist, kann der Name im Titel oder in der Beschreibung angegeben werden.",
    inviteConsentLabel:
      "Ich stimme zu, dass mein Upload fuer die StrataAudio-Studie gespeichert und verwendet werden darf, und bestaetige, dass ich die erforderlichen Rechte an den hochgeladenen Inhalten habe.",
  },
  watchPage: {
    playbackNote:
      "Hinweis: Das Video wird zwei Mal abgespielt, einmal im Mixer-Modus und einmal im Standard-Modus. Die Umfrage wird anschließend freigeschaltet.",
    playbackNoteMidSwitch:
      "Hinweis: Bei diesem Video wird der Modus in der Mitte gewechselt (Mixer und Standard in zufaelliger Reihenfolge). Die Umfrage wird anschließend freigeschaltet.",
    activeModeBadge: "Aktiv",
    activeModeHint: "Moduswechsel in der Videomitte ist eingeschaltet.",
    technicalMetadataTitle: "Credits",
    technicalMetadataCategory: "Kategorie",
    technicalMetadataSource: "Quelle",
    technicalMetadataLicense: "Lizenz",
    technicalMetadataMissingValue: "-",
    technicalMetadataEmpty: "Keine technischen Metadaten hinterlegt.",
    loadingVideo: "Lade Video...",
    loadingAudio: "Lade Audio...",
    errorTitle: "Fehler",
    errorLoadingVideo: "Fehler beim Laden des Videos: {{message}}",
    errorLoadingAudio: "Fehler beim Laden des Audios: {{message}}",
    unknownVideo: "Unbekanntes Video",
  },
  watchMode: {
    mixerMode: "Mixer-Modus",
    standardMode: "Standard-Modus",
    unlockTitle: "Freischaltung der Umfrage",
    unlockHint:
      "Schau das Video in beiden Modi, um die Umfrage freizuschalten.",
    currentMode: "Aktueller Modus",
    nextMode: "Als nächstes: {{mode}}.",
    allDone: "Alle Modi abgeschlossen. Du kannst jetzt die Umfrage ausfüllen.",
  },
  player: {
    masterVolume: "Master",
    trackVolume: "{{title}} Lautstärke",
    openAudioMixer: "Audio-Mixer öffnen",
  },
  demographics: {
    missingParticipant:
      "Participant-ID fehlt. Bitte Einverständnis erneut bestätigen.",
    missingAnswers: "Bitte beantworte die Pflichtfragen, bevor du fortfährst.",
    submitFailed: "Die Angaben konnten nicht gespeichert werden.",
    transparencyTitle: "Transparenz zu automatisch erfassten technischen Daten",
    transparencyText:
      "Beim Anlegen der Teilnahme wurden technische Basisdaten automatisch erfasst. Diese Angaben sind hier nur zur Einsicht ausgegraut dargestellt und können von dir nicht bearbeitet werden.",
    metaBrowser: "Browser",
    metaBrowserVersion: "Browser-Version",
    metaOs: "Betriebssystem",
    metaOsVersion: "OS-Version",
    submitButton: "Weiter zum Katalog",
  },
  videoSurvey: {
    missingParticipant:
      "Participant-ID fehlt. Bitte Einverständnis erneut bestätigen.",
    missingAnswers: "Bitte beantworte alle Fragen, bevor du absendest.",
    missingAudioConfiguration:
      "Audio-Konfiguration fehlt. Bitte schaue das Video vollständig an, bevor du absendest.",
    submitFailed: "Umfrage konnte nicht gespeichert werden.",
    title: 'Umfrage zum Video "{{title}}"',
    intro:
      "Vielen Dank, dass du an der Videoumfrage teilnimmst! Deine Meinung ist sehr wichtig und hilft, genauere Einblicke zu gewinnen. Bitte beantworte die folgenden Fragen so ehrlich wie möglich.",
    lockedMessage:
      "Die Umfrage wird freigeschaltet, sobald du das Video angeschaut hast.",
    submitSuccess: "Vielen Dank! Deine Antworten wurden gespeichert.",
    submitButton: "Umfrage absenden",
    savedButton: "Gespeichert",
  },
  endSurvey: {
    missingParticipant:
      "Participant-ID fehlt. Bitte Einverständnis erneut bestätigen.",
    missingAnswers: "Bitte beantworte alle Pflichtfragen, bevor du absendest.",
    loadFailed: "Bestehende Endumfrage konnte nicht geladen werden.",
    submitFailed: "Endumfrage konnte nicht gespeichert werden.",
    title: "Abschließende Umfrage",
    intro:
      "Vielen Dank, dass du bis hierhin teilgenommen hast. Diese abschließenden Fragen helfen, das gesamte Nutzungserlebnis zu bewerten.",
    editableHint:
      "Du kannst deine Endumfrage jederzeit anpassen und erneut speichern.",
    loadingExisting: "Lade bestehende Endumfrage...",
    submitSuccess: "Vielen Dank! Deine Endumfrage wurde gespeichert.",
    submitButton: "Endumfrage absenden",
    updateButton: "Endumfrage aktualisieren",
    rewardPopup: {
      title: "Vielen Dank für deine Teilnahme",
      thanks:
        "Deine Antworten helfen dabei, das Audio-Erlebnis in Webvideos zu verbessern. Du kannst gerne zurück zum Videokatalog gehen und weitere Videos anschauen, wenn du möchtest.",
      codeText: "SurveyCircle-Code zum Einlösen der Punkte:",
      codeAria: "SurveyCircle Code",
      copyButton: "Code kopieren",
      copiedButton: "Kopiert",
      linkText: "Punkte mit einem Klick einsammeln",
      linkLabel: "SurveyCircle",
      linkUrl: "https://www.surveycircle.com/32SQ-FSHU-8MTM-5QQ8/",
    },
  },
  consent: {
    submitError: "Studie noch nicht aktiv oder Fehler.",
    wait: "Bitte warten...",
    continue: "Einverstanden und Fortfahren",
    mustConsent: "Bitte zustimmen",
  },
  consentPage: {
    title: "Einverständniserklärung",
    surveyCircleNotice: {
      prefix: "An die ",
      suffix:
        "-Nutzer: Sie erhalten den Code, um Punkte einzulösen nach Beantwortung der Endumfrage.",
    },
    topic:
      "Thema: Nutzerzentriertes Audio-Mixing individueller Audio-Tracks für Videos im Web",
    lead: "Studienleitung: Alexander Sickler, Hochschule Hamm-Lippstadt (HSHL)",
    contactLabel: "Kontakt",
    duration:
      "Der Test dauert etwa 20 bis 30 Minuten und kann auf Wunsch verlängert werden. Du schaust Videos in zwei Modi (Mixer und Standard) in zufälliger Reihenfolge und beantwortest dazu Fragen. Videos bis 2 Minuten werden in beiden Modi vollständig geschaut, bei längeren Videos erfolgt der Moduswechsel in der Mitte. Du hast anschließend die Möglichkeit, auch weitere Videos zu schauen und zu bewerten, um die Arbeit zu unterstützen.",
    sections: {
      purposeTitle: "Zweck der Datenerhebung",
      purposeText:
        "Die im Rahmen dieser Umfrage/Anwendung erhobenen Daten dienen ausschließlich der wissenschaftlichen Untersuchung im Rahmen meiner Bachelorarbeit. Ziel ist es, die Anforderungen an einen interaktiven Audio-Mixer im Browser zu evaluieren.",
      dataTypeTitle: "Art der erhobenen Daten",
      dataTypeLead: "Es werden folgende Daten erhoben:",
      storageTitle: "Speicherung und Sicherheit (Supabase)",
      storageText:
        "Die Speicherung der Daten erfolgt verschlüsselt in einer Datenbank des Dienstleisters Supabase, Inc.",
      voluntaryTitle: "Freiwilligkeit und Widerruf",
      voluntaryText:
        "Die Teilnahme an dieser Umfrage/Anwendung ist freiwillig. Du kannst deine Einwilligung jederzeit widerrufen, indem du die Anwendung schließt.",
      sharingTitle: "Datenweitergabe",
      sharingText:
        "Eine Weitergabe der Rohdaten an Dritte erfolgt nicht. Die Ergebnisse der Arbeit werden in aggregierter Form (Statistiken/Grafiken) in der Bachelorarbeit veröffentlicht.",
      consentTitle: "Einverständnis",
      consentText:
        "Durch das Klicken auf [Ich stimme zu] bestätige ich, dass ich:",
    },
    bullets: {
      dataTypes: [
        "Demografische Daten: Alter, Geschlecht sowie Angaben zu deiner Erfahrung im Umgang mit Audiotechnik.",
        "Nutzungs- und Interaktionsdaten: Deine Bewertungen der Videos sowie automatisierte Protokolle deiner Interaktion mit dem Audio-Mixer (z. B. Zeitpunkt und Intensität von Regler-Bewertungen, finale Audio-Konfiguration).",
        "Technische Daten: Browsertyp und Gerätetyp, jedoch keine direkt identifizierbaren Daten wie Name oder E-Mail-Adresse (anonyme Erhebung).",
        "Anonymisierung: Zur Vermeidung von Mehrfachteilnahmen wird ein technischer User-Hash generiert. Es werden keine IP-Adressen oder direkt identifizierbaren Daten gespeichert.",
      ],
      storage: [
        "Serverstandort: Die Daten werden in der Region EU (Frankfurt, Deutschland) gespeichert, um den Anforderungen der DSGVO zu entsprechen.",
        "Sicherheit: Supabase nutzt moderne Sicherheitsstandards (AES-256 Verschlüsselung), um die Daten vor unbefugtem Zugriff zu schützen.",
      ],
      consent: [
        "Das 18. Lebensjahr vollendet habe.",
        "Die oben genannten Informationen gelesen und verstanden habe.",
        "Mit der anonymisierten Speicherung meiner Daten auf den Servern von Supabase einverstanden bin.",
        "Mit der Datenerhebung unmittelbar nach der Zustimmung einverstanden bin.",
      ],
    },
    checkbox: "Ich stimme zu",
  },
  imprintPage: {
    metaTitle: "Impressum",
    metaDescription:
      "Rechtliche Angaben und Kontaktdaten zur Forschungs-Webanwendung StrataAudio.",
    title: "Impressum",
    operator: "Betreiber der Webseite",
    contentOwner: "Verantwortlicher für den Inhalt",
    liability: "Haftungshinweis",
    liabilityText:
      "Diese Website wurde im Rahmen einer Bachelorarbeit an der Hochschule Hamm-Lippstadt (HSHL) erstellt. Sie dient ausschließlich wissenschaftlichen Zwecken und verfolgt keine kommerziellen Interessen. Trotz sorgfältiger inhaltlicher Kontrolle übernehme ich keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.",
    iconCreditsTitle: "Icon-Quellen",
    iconCreditsText:
      "Folgende Icons werden in der Anwendung verwendet. Angegeben sind das Icon, die Quellen-Website und der Ersteller.",
    iconCreditsEmpty: "Keine Icon-Einträge vorhanden.",
    iconCreditsLoadError: "Fehler beim Laden der Icon-Liste: {{message}}",
    iconHeader: "Icon-Bild",
    sourceHeader: "Quelle",
    authorHeader: "Autor",
  },
  privacyPolicyPage: {
    metaTitle: "Datenschutzerklärung",
    metaDescription:
      "Datenschutzhinweise zur Verarbeitung personenbezogener Daten innerhalb der StrataAudio-Forschungsstudie.",
    title: "Datenschutzerklärung",
    intro:
      "Diese Datenschutzerklärung informiert Sie über die Art, den Umfang und Zweck der Verarbeitung personenbezogener Daten im Rahmen dieser wissenschaftlichen Webanwendung.",
    version: "Stand: 10.04.2026",
    controllerTitle: "Verantwortlicher",
    purposeTitle: "Zweck und Rechtsgrundlage der Verarbeitung",
    purposeText:
      "Die Datenverarbeitung erfolgt ausschließlich zu wissenschaftlichen Zwecken im Rahmen einer Bachelorarbeit an der Hochschule Hamm-Lippstadt (HSHL). Die erhobenen Daten dienen der Evaluation von Anforderungen an interaktive Audio-Mixer im Web.",
    purposeList: [
      "Durchführung der wissenschaftlichen Studie und Bereitstellung der Anwendung.",
      "Auswertung von Interaktions- und Umfrageergebnissen zur Audio-Wahrnehmung.",
      "Sicherstellung des technischen Betriebs und Vermeidung von Mehrfachteilnahmen.",
    ],
    legalBasisLabel: "Rechtsgrundlage:",
    legalBasisText:
      "Die Verarbeitung erfolgt auf Basis Ihrer freiwilligen Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.",
    dataTypesTitle: "Art der erhobenen Daten",
    dataTypesLead:
      "Die Erhebung der Daten beginnt unmittelbar nach Ihrer ausdrücklichen Zustimmung. Folgende Daten werden verarbeitet:",
    dataTypesList: [
      "Demografische Angaben: Alter, Geschlecht und Erfahrung im Audio-Bereich.",
      "Nutzungs- und Interaktionsdaten: Protokollierung von Reglerbewegungen (Zeitstempel, Werte), gewählte Audio-Einstellungen und Antworten zu den Video-Umfragen.",
      "Technische Metadaten: Browsertyp und Gerätetyp (z. B. Smartphone/PC).",
      "Anonymisierung: Es werden keine IP-Adressen oder direkt identifizierbaren Daten (Namen, E-Mails) dauerhaft gespeichert. Zur Vermeidung von Mehrfachteilnahmen wird ein technischer User-Hash verwendet.",
    ],
    retentionTitle: "Hosting, Infrastruktur und Content Delivery Network (CDN)",
    hostingIntro:
      "Zur sicheren, performanten und DSGVO-konformen Bereitstellung dieser Forschungsanwendung werden Dienste spezialisierter Drittanbieter genutzt, die als Auftragsverarbeiter auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer technisch fehlerfreien, sicheren und stabilen Online-Präsenz) fungieren. Mit allen Anbietern wurden Verträge zur Auftragsverarbeitung (AVV) nach Art. 28 DSGVO geschlossen.",

    ionosLabel: "Domain-Registrar:",
    ionosText:
      "1&1 IONOS SE (Elgendorfer Str. 57, 56410 Montabaur). IONOS stellt die Domain-Infrastruktur bereit. Beim Aufruf der Domain werden standardmäßig Server-Logfiles (inkl. gekürzter/anonymisierter IP-Adressen) verarbeitet.",

    vercelLabel: "Frontend-Hosting:",
    vercelText:
      "Vercel Inc. (www.vercel.com) zur Bereitstellung der React-Weboberfläche. Beim Zugriff werden technische Verbindungsdaten (z. B. IP-Adresse, Browsertyp) verarbeitet, um die Seite auszuliefern, jedoch nicht dauerhaft gespeichert.",

    cloudflareCdnLabel: "DNS, SSL & Content Delivery Network (CDN):",
    cloudflareCdnText:
      "Cloudflare, Inc. (www.cloudflare.com). Cloudflare verwaltet die Nameserver dieser Anwendung, stellt die SSL-Verschlüsselung (https://) bereit und schützt die Anwendung vor DDoS-Angriffen. Hierbei fließt der Datenverkehr durch die Infrastruktur von Cloudflare, wobei technische Logdaten verarbeitet werden.",

    supabaseLabel: "Datenbank & Backend:",
    supabaseText:
      "Supabase, Inc. (www.supabase.com) zur strukturierten Speicherung der Forschungsdaten. Um ein hohes Datenschutzniveau zu gewährleisten, ist als Speicherort explizit die AWS-Region Frankfurt am Main (eu-central-1) konfiguriert.",

    cloudflareLabel: "Medien-Speicher (Object Storage):",
    cloudflareText:
      "Cloudflare, Inc. (R2 Storage) zur Bereitstellung der segmentierten Audio- und Videodateien (HLS-Infrastruktur). Die Auslieferung und Speicherung der Mediendaten erfolgt über Server innerhalb der Europäischen Union (Region Westeuropa/Frankfurt).",

    retentionPeriodLabel: "Geplante Speicherdauer:",
    retentionPeriodText:
      "Die im Rahmen der Umfrage erhobenen Forschungsdaten werden bis zum endgültigen Abschluss des akademischen Prüfungsverfahrens dieser Bachelorarbeit gespeichert und anschließend vollständig gelöscht. Die von den Hostern erfassten technischen Logfiles werden nach den jeweiligen Standard-Fristen der Anbieter (in der Regel 7 bis 14 Tage) automatisch gelöscht oder anonymisiert.",
    cookiesTitle: "Cookies und lokale Speicherung",
    cookiesText:
      "Zur Sicherstellung der Funktionalität speichert die Anwendung technische Informationen (z. B. einen User-Hash zur Vermeidung von Mehrfachteilnahmen sowie deinen individuellen Fortschritt beim Ansehen von Videos) lokal im Browser (Local Storage). Diese Daten werden ausschließlich für technische Zwecke verwendet und nicht für Tracking oder Profiling genutzt.",
    privacyNotesTitle: "Datenschutzhinweise",
    privacyNotesText:
      "Es werden keine IP-Adressen oder Tracking-Cookies gespeichert. Es werden nur technisch notwendige Daten (anonymisierter Benutzer-Hash, Upload-Metadaten) verarbeitet. Local Storage wird ausschließlich für den Benutzer-Hash und den Video-Fortschritt verwendet. Betroffenenrechte: Kontakt per E-Mail, mit Hinweis auf Anonymisierung und eingeschränkte Löschbarkeit. Datenverarbeitungsverträge bestehen mit Supabase, Cloudflare, Vercel und hCaptcha. Privacy by Design: Datenminimierung, Speicherbegrenzung, keine dauerhafte Identifizierung. Sicherheitsmaßnahmen: TLS, Supabase-Verschlüsselung, keine sensiblen Daten im Klartext. Drittlandübermittlungen: siehe hCaptcha und Cloudflare, abgesichert durch Standardvertragsklauseln.",
    hcaptchaTitle: "Einsatz von hCaptcha",
    hcaptchaText:
      "Zum Schutz vor Missbrauch und Spam wird der Dienst hCaptcha (Intuition Machines, Inc., USA) eingesetzt. Bei der Nutzung kann es zur Übermittlung personenbezogener Daten (z. B. IP-Adresse, Browserdaten) in die USA kommen. Weitere Informationen finden Sie in der Datenschutzerklärung von hCaptcha: ",
    hcaptchaLinkText: "https://www.hcaptcha.com/privacy",
    hcaptchaLabel: "Datenschutzerklärung von hCaptcha",
    withdrawalLabel: "Hinweis zum Widerruf und Betroffenenrechten:",
    withdrawalText:
      "Die Erhebung der Umfragedaten erfolgt von Beginn an vollständig anonymisiert (es werden im Backend keine IP-Adressen, Namen oder Mailadressen mit den Antworten verknüpft). Da die Daten nach dem Absenden der Umfrage technisch keiner spezifischen natürlichen Person mehr zugeordnet werden können, ist eine nachträgliche Identifizierung, Auskunft oder Löschung einzelner Datensätze nicht möglich.",
    rightsTitle: "Ihre Rechte",
    rightsLead: "Ihnen stehen nach der DSGVO insbesondere folgende Rechte zu:",
    rightsList: [
      "Auskunft über die verarbeiteten Daten (Art. 15 DSGVO).",
      "Berichtigung unrichtiger Daten (Art. 16 DSGVO).",
      "Löschung Ihrer Daten (Art. 17 DSGVO - sofern technisch durch Identifizierbarkeit möglich).",
      "Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO).",
    ],
    rightsClosing:
      "Zudem haben Sie das Recht, sich bei einer Datenschutzaufsichtsbehörde (z. B. dem Landesbeauftragten für Datenschutz und Informationsfreiheit Nordrhein-Westfalen) zu beschweren.",
  },
};

export default dePages;
