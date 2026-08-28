import React, { useState, useMemo, useEffect, useRef, createContext, useContext } from "react";
import BootScreen from "./BootScreen.jsx";
import { isCloudConfigured, subscribeCloudField, saveCloudField } from "./cloud.js";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  ClipboardList,
  CalendarDays,
  Clock,
  FileStack,
  UserPlus,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Menu,
  X,
  RefreshCw,
  BookOpen,
  MessageCircle,
  GraduationCap,
  Send,
  FolderPlus,
  Folder,
  Palette,
  Globe,
  Maximize2,
  Minimize2,
  ImagePlus,
  Brain,
} from "lucide-react";

/* ---------------- CONSTANTS ---------------- */
const COLORS = {
  paper: "#FFFFFF",
  board: "#FFFFFF",
  cream: "#F4F1EA",
  ink: "#2E2A24",
  sub: "#8A8578",
  line: "#E7E2D6",
  mustard: "#E0A425",
  sage: "#6E9075",
  coral: "#E15A4C",
};

const DEFAULT_SUBJECTS = ["Math", "Science", "English", "Social Studies", "Art"];

const JOKES = [
  "Why did the student eat his homework? Because the teacher said it was a piece of cake!",
  "Why was the math book sad? It had too many problems.",
  "What do you call a teacher who never farts in public? A private tutor.",
  "Why did the pencil get sent to the principal's office? It kept making a point.",
  "What's a teacher's favorite nation? Explanation.",
  "Why did the student bring a ladder to school? To go to high school.",
  "What do you call a bear with no teeth? A gummy bear.",
  "Why don't scientists trust atoms? Because they make up everything.",
  "What did the calculator say to the student? You can count on me.",
  "Why did the teacher wear sunglasses to school? Because her students were so bright.",
  "What did one wall say to the other wall? I'll meet you at the corner.",
  "Why did the boy eat his report card? Because he heard it was full of A's and B's.",
];

/* ---------------- THEMES (background) ---------------- */
const THEMES = [
  { id: "classic", swatch: "#F4F1EA", bg: "#F4F1EA" },
  { id: "ocean", swatch: "#8FD9E8", bg: "linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 50%, #80DEEA 100%)" },
  { id: "sunset", swatch: "#FFAB91", bg: "linear-gradient(135deg, #FFE8CC 0%, #FFC9A8 50%, #FFAB91 100%)" },
  { id: "lavender", swatch: "#CBA8FA", bg: "linear-gradient(135deg, #F3E8FF 0%, #E4D4FF 50%, #D4C4FB 100%)" },
  { id: "forest", swatch: "#A5D6A7", bg: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%)" },
  { id: "aurora", swatch: "#8C6BFF", bg: "linear-gradient(120deg, #FDE7F3 0%, #E6DBFF 25%, #CFF6EA 50%, #FFF3D6 75%, #FDE7F3 100%)" },
];
function getTheme(id) {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}

/* ---------------- i18n ---------------- */
const LANGS = [
  { id: "en", label: "English" },
  { id: "hi", label: "हिन्दी" },
  { id: "de", label: "Deutsch" },
];

const STRINGS = {
  nav_dashboard: { en: "Dashboard", hi: "डैशबोर्ड", de: "Dashboard" },
  nav_students: { en: "Students", hi: "छात्र", de: "Schüler" },
  nav_attendance: { en: "Attendance", hi: "उपस्थिति", de: "Anwesenheit" },
  nav_scores: { en: "Scores", hi: "अंक", de: "Noten" },
  nav_calendar: { en: "Calendar", hi: "कैलेंडर", de: "Kalender" },
  nav_timetable: { en: "Timetable", hi: "समय सारणी", de: "Stundenplan" },
  nav_library: { en: "Library", hi: "पुस्तकालय", de: "Bibliothek" },
  nav_drafts: { en: "Drafts", hi: "ड्राफ्ट", de: "Entwürfe" },

  app_name: { en: "Classroom Tracker", hi: "क्लासरूम ट्रैकर", de: "Klassenzimmer-Tracker" },
  app_paused_badge: { en: "App Paused", hi: "ऐप रुका हुआ है", de: "App pausiert" },
  pause_entry: { en: "Pause Entry (Sundays/Holidays)", hi: "एंट्री रोकें (रविवार/छुट्टियां)", de: "Eingabe pausieren (Sonntage/Feiertage)" },
  resume_entry: { en: "Resume Entry", hi: "एंट्री फिर शुरू करें", de: "Eingabe fortsetzen" },
  menu_language: { en: "Language", hi: "भाषा", de: "Sprache" },
  menu_theme: { en: "Theme", hi: "थीम", de: "Design" },

  landing_tag: { en: "Classroom Tracker", hi: "क्लासरूम ट्रैकर", de: "Klassenzimmer-Tracker" },
  landing_title: { en: "Ready for the fun class!", hi: "मज़ेदार क्लास के लिए तैयार हैं!", de: "Bereit für die lustige Klasse!" },
  landing_sub: {
    en: "Attendance, test scores, timetables, and student profiles — all in one place.",
    hi: "उपस्थिति, परीक्षा अंक, समय सारणी और छात्र प्रोफाइल — सब एक ही जगह।",
    de: "Anwesenheit, Testergebnisse, Stundenpläne und Schülerprofile — alles an einem Ort.",
  },
  landing_enter: { en: "Enter Classroom →", hi: "क्लासरूम में प्रवेश करें →", de: "Klassenzimmer betreten →" },

  joke_label: { en: "Joke of the moment:", hi: "इस पल का चुटकुला:", de: "Witz des Moments:" },
  joke_next: { en: "Next", hi: "अगला", de: "Weiter" },

  shri_name: { en: "Shri AI", hi: "श्री AI", de: "Shri AI" },
  shri_sub: { en: "Your homework helper", hi: "आपका होमवर्क सहायक", de: "Dein Hausaufgabenhelfer" },
  shri_placeholder: { en: "Ask Shri AI…", hi: "श्री AI से पूछें…", de: "Frag Shri AI…" },
  shri_welcome: {
    en: "Ask about a homework question, a tricky topic, or how to approach a problem.",
    hi: "किसी होमवर्क प्रश्न, कठिन विषय या समस्या को हल करने के तरीके के बारे में पूछें।",
    de: "Frag nach einer Hausaufgabe, einem schwierigen Thema oder wie man ein Problem angeht.",
  },
  shri_thinking: { en: "Shri AI is thinking…", hi: "श्री AI सोच रहा है…", de: "Shri AI denkt nach…" },
  shri_error_generic: { en: "Something went wrong reaching Shri AI. Please try again.", hi: "श्री AI तक पहुँचने में समस्या हुई। कृपया दोबारा प्रयास करें।", de: "Fehler beim Erreichen von Shri AI. Bitte erneut versuchen." },
  shri_error_unavailable: { en: "Shri AI is unavailable right now — try again in a moment.", hi: "श्री AI अभी उपलब्ध नहीं है — कृपया थोड़ी देर बाद प्रयास करें।", de: "Shri AI ist gerade nicht verfügbar — bitte gleich nochmal versuchen." },
  shri_error_empty: { en: "Sorry, I didn't catch that — could you rephrase?", hi: "माफ़ कीजिए, समझ नहीं आया — क्या आप दोबारा पूछ सकते हैं?", de: "Entschuldigung, das habe ich nicht verstanden — kannst du es anders formulieren?" },

  dash_title: { en: "Dashboard", hi: "डैशबोर्ड", de: "Dashboard" },
  stat_students: { en: "Students", hi: "छात्र", de: "Schüler" },
  stat_avg_attendance: { en: "This Month's Avg. Attendance", hi: "इस महीने की औसत उपस्थिति", de: "Ø Anwesenheit diesen Monat" },
  stat_days_recorded: { en: "Days Recorded", hi: "दर्ज किए गए दिन", de: "Erfasste Tage" },
  stat_present_today: { en: "Present Today", hi: "आज उपस्थित", de: "Heute anwesend" },
  stat_absent_today: { en: "Absent Today", hi: "आज अनुपस्थित", de: "Heute abwesend" },
  card_month_attendance: { en: "Attendance This Month (resets each month)", hi: "इस महीने की उपस्थिति (हर महीने रीसेट होती है)", de: "Anwesenheit diesen Monat (wird monatlich zurückgesetzt)" },
  empty_no_attendance_month: { en: "No attendance marked yet this month.", hi: "इस महीने अभी तक उपस्थिति दर्ज नहीं हुई।", de: "Diesen Monat wurde noch keine Anwesenheit erfasst." },
  card_year_pattern: { en: "Attendance Pattern", hi: "उपस्थिति पैटर्न", de: "Anwesenheitsverlauf" },
  year_view: { en: "Year View", hi: "वार्षिक दृश्य", de: "Jahresansicht" },
  card_today_timetable: { en: "Today's Timetable", hi: "आज की समय सारणी", de: "Heutiger Stundenplan" },
  empty_sunday: { en: "It's Sunday — no classes today.", hi: "आज रविवार है — कोई कक्षा नहीं।", de: "Heute ist Sonntag — kein Unterricht." },
  empty_no_periods_today: { en: "No periods scheduled for today yet. Add some in Timetable.", hi: "आज के लिए अभी कोई पीरियड तय नहीं है। समय सारणी में जोड़ें।", de: "Für heute sind noch keine Stunden geplant. Füge welche im Stundenplan hinzu." },

  students_title: { en: "Student Profiles", hi: "छात्र प्रोफाइल", de: "Schülerprofile" },
  students_sub: { en: "Add or remove students as admissions change", hi: "प्रवेश बदलने पर छात्र जोड़ें या हटाएं", de: "Schüler bei Auf-/Abmeldungen hinzufügen oder entfernen" },
  card_add_student: { en: "Add a Student", hi: "छात्र जोड़ें", de: "Schüler hinzufügen" },
  placeholder_student_name: { en: "Student name", hi: "छात्र का नाम", de: "Schülername" },
  placeholder_roll: { en: "Roll no. (optional)", hi: "रोल नंबर (वैकल्पिक)", de: "Rollennummer (optional)" },
  btn_add_student: { en: "Add Student", hi: "छात्र जोड़ें", de: "Schüler hinzufügen" },
  roster_title: { en: "Roster", hi: "सूची", de: "Liste" },
  empty_no_students: { en: "No students yet — add your first one above.", hi: "अभी कोई छात्र नहीं — ऊपर पहला छात्र जोड़ें।", de: "Noch keine Schüler — füge oben den ersten hinzu." },
  roll_label: { en: "Roll #", hi: "रोल #", de: "Nr." },
  performance_suffix: { en: "'s Performance", hi: " का प्रदर्शन", de: "s Leistung" },
  select_student_prompt: { en: "Select a student", hi: "एक छात्र चुनें", de: "Schüler auswählen" },
  empty_select_student: { en: "Click a student on the left to view their subject-wise performance.", hi: "विषयवार प्रदर्शन देखने के लिए बाईं ओर किसी छात्र पर क्लिक करें।", de: "Klicke links auf einen Schüler, um die fachbezogene Leistung zu sehen." },
  empty_no_scores_student: { en: "No test scores recorded for this student yet.", hi: "इस छात्र के लिए अभी कोई परीक्षा अंक दर्ज नहीं हैं।", de: "Für diesen Schüler sind noch keine Testergebnisse erfasst." },

  attendance_title: { en: "Attendance", hi: "उपस्थिति", de: "Anwesenheit" },
  attendance_sub: { en: "Mark daily attendance for your class", hi: "अपनी कक्षा की दैनिक उपस्थिति दर्ज करें", de: "Tägliche Anwesenheit für deine Klasse erfassen" },
  btn_mark_all_present: { en: "Mark All Present", hi: "सभी को उपस्थित करें", de: "Alle als anwesend markieren" },
  btn_mark_all_absent: { en: "Mark All Absent", hi: "सभी को अनुपस्थित करें", de: "Alle als abwesend markieren" },
  msg_app_paused: { en: "App is paused.", hi: "ऐप रुका हुआ है।", de: "App ist pausiert." },
  msg_holiday: { en: "This date is marked as a holiday.", hi: "यह तारीख छुट्टी के रूप में चिह्नित है।", de: "Dieses Datum ist als Feiertag markiert." },
  msg_entry_disabled: { en: "Entry disabled.", hi: "एंट्री बंद है।", de: "Eingabe deaktiviert." },
  empty_add_students_first: { en: "Add students first from Student Profiles.", hi: "पहले छात्र प्रोफाइल से छात्र जोड़ें।", de: "Füge zuerst Schüler in den Schülerprofilen hinzu." },
  btn_present: { en: "Present", hi: "उपस्थित", de: "Anwesend" },
  btn_absent: { en: "Absent", hi: "अनुपस्थित", de: "Abwesend" },

  scores_title: { en: "Test Scores", hi: "परीक्षा अंक", de: "Testergebnisse" },
  scores_sub: { en: "Log test results per student and subject", hi: "प्रत्येक छात्र और विषय के लिए परीक्षा परिणाम दर्ज करें", de: "Testergebnisse pro Schüler und Fach erfassen" },
  card_add_score: { en: "Add a Score", hi: "अंक जोड़ें", de: "Ergebnis hinzufügen" },
  select_student: { en: "Select student", hi: "छात्र चुनें", de: "Schüler auswählen" },
  option_other: { en: "Other…", hi: "अन्य…", de: "Andere…" },
  placeholder_subject_name: { en: "Subject name", hi: "विषय का नाम", de: "Fachname" },
  placeholder_test_name: { en: "Test name", hi: "परीक्षा का नाम", de: "Testname" },
  placeholder_score: { en: "Score", hi: "अंक", de: "Punkte" },
  placeholder_max: { en: "Max", hi: "अधिकतम", de: "Max" },
  btn_add: { en: "Add", hi: "जोड़ें", de: "Hinzufügen" },
  card_all_scores: { en: "All Recorded Scores", hi: "सभी दर्ज अंक", de: "Alle erfassten Ergebnisse" },
  empty_no_scores: { en: "No scores logged yet.", hi: "अभी तक कोई अंक दर्ज नहीं।", de: "Noch keine Ergebnisse erfasst." },
  th_student: { en: "Student", hi: "छात्र", de: "Schüler" },
  th_subject: { en: "Subject", hi: "विषय", de: "Fach" },
  th_test: { en: "Test", hi: "परीक्षा", de: "Test" },
  th_score: { en: "Score", hi: "अंक", de: "Punkte" },
  th_date: { en: "Date", hi: "तारीख", de: "Datum" },

  calendar_title: { en: "Calendar & Pause", hi: "कैलेंडर और पॉज़", de: "Kalender & Pause" },
  calendar_sub: { en: "Mark Sundays or holidays so they're excluded from attendance stats", hi: "रविवार या छुट्टियों को चिह्नित करें ताकि वे उपस्थिति आँकड़ों से बाहर रहें", de: "Markiere Sonntage oder Feiertage, damit sie in der Anwesenheitsstatistik ausgeschlossen werden" },
  calendar_hint: {
    en: "Click any date to toggle it as a holiday / paused day. Second Saturdays (sage-colored) are marked automatically every month.",
    hi: "किसी भी तारीख पर क्लिक करके उसे छुट्टी / रुके हुए दिन के रूप में बदलें। हर महीने दूसरा शनिवार (हरे रंग में) अपने आप चिह्नित होता है।",
    de: "Klicke auf ein Datum, um es als Feiertag/Pausentag zu markieren. Der zweite Samstag (salbeifarben) wird jeden Monat automatisch markiert.",
  },
  tooltip_auto_holiday: { en: "2nd Saturday — automatic holiday", hi: "दूसरा शनिवार — स्वतः छुट्टी", de: "2. Samstag — automatischer Feiertag" },
  tooltip_holiday_unmark: { en: "Holiday — click to unmark", hi: "छुट्टी — हटाने के लिए क्लिक करें", de: "Feiertag — zum Entfernen klicken" },
  tooltip_mark_holiday: { en: "Click to mark as holiday", hi: "छुट्टी के रूप में चिह्नित करने के लिए क्लिक करें", de: "Zum Markieren als Feiertag klicken" },
  tag_2nd_sat: { en: "2ND SAT", hi: "2रा शनि", de: "2. SA" },

  timetable_title: { en: "Timetable", hi: "समय सारणी", de: "Stundenplan" },
  timetable_sub: { en: "Set up your weekly class schedule", hi: "अपनी साप्ताहिक कक्षा अनुसूची बनाएं", de: "Richte deinen wöchentlichen Stundenplan ein" },
  card_add_period: { en: "Add a Period", hi: "पीरियड जोड़ें", de: "Stunde hinzufügen" },
  placeholder_time: { en: "e.g. 9:00 - 9:45", hi: "उदा. 9:00 - 9:45", de: "z. B. 9:00 - 9:45" },
  placeholder_subject: { en: "Subject", hi: "विषय", de: "Fach" },
  empty_no_periods: { en: "No periods yet.", hi: "अभी कोई पीरियड नहीं।", de: "Noch keine Stunden." },

  library_title: { en: "Library", hi: "पुस्तकालय", de: "Bibliothek" },
  library_sub: { en: "PDF books and reference material, organized into categories", hi: "PDF किताबें और संदर्भ सामग्री, श्रेणियों में व्यवस्थित", de: "PDF-Bücher und Referenzmaterial, in Kategorien organisiert" },
  lib_open_msg: { en: "Everyone can browse, upload, and organize the library.", hi: "हर कोई पुस्तकालय देख, अपलोड और व्यवस्थित कर सकता है।", de: "Jeder kann die Bibliothek durchsuchen, hochladen und organisieren." },
  card_manage_categories: { en: "Manage Categories", hi: "श्रेणियां प्रबंधित करें", de: "Kategorien verwalten" },
  placeholder_new_category: { en: "New category name", hi: "नई श्रेणी का नाम", de: "Neuer Kategoriename" },
  btn_add_category: { en: "Add Category", hi: "श्रेणी जोड़ें", de: "Kategorie hinzufügen" },
  empty_no_categories: { en: "No categories yet — add one above.", hi: "अभी कोई श्रेणी नहीं — ऊपर एक जोड़ें।", de: "Noch keine Kategorien — füge oben eine hinzu." },
  card_upload_pdf: { en: "Upload a PDF", hi: "PDF अपलोड करें", de: "PDF hochladen" },
  option_uncategorized: { en: "Uncategorized", hi: "अवर्गीकृत", de: "Unkategorisiert" },
  uploading_label: { en: "Uploading…", hi: "अपलोड हो रहा है…", de: "Wird hochgeladen…" },
  err_pdf_only: { en: "Please upload a PDF file.", hi: "कृपया केवल PDF फ़ाइल अपलोड करें।", de: "Bitte lade eine PDF-Datei hoch." },
  err_upload_failed: { en: "Upload failed — the file may be too large for this browser's storage.", hi: "अपलोड विफल — फ़ाइल इस ब्राउज़र के स्टोरेज के लिए बहुत बड़ी हो सकती है।", de: "Upload fehlgeschlagen — die Datei ist möglicherweise zu groß für den Speicher dieses Browsers." },
  lib_storage_note: { en: "Books are stored locally in this browser — they stay on this device and aren't uploaded anywhere else.", hi: "किताबें इस ब्राउज़र में स्थानीय रूप से संग्रहीत हैं — वे इसी डिवाइस पर रहती हैं और कहीं और अपलोड नहीं होतीं।", de: "Bücher werden lokal in diesem Browser gespeichert — sie bleiben auf diesem Gerät und werden nirgendwo sonst hochgeladen." },
  loading_library: { en: "Loading library…", hi: "पुस्तकालय लोड हो रहा है…", de: "Bibliothek wird geladen…" },
  empty_no_books: { en: "No books uploaded yet.", hi: "अभी तक कोई किताब अपलोड नहीं हुई।", de: "Noch keine Bücher hochgeladen." },
  empty_no_books_category: { en: "No books in this category yet.", hi: "इस श्रेणी में अभी कोई किताब नहीं है।", de: "Noch keine Bücher in dieser Kategorie." },
  uncategorized_title: { en: "Uncategorized", hi: "अवर्गीकृत", de: "Unkategorisiert" },
  btn_view: { en: "View", hi: "देखें", de: "Ansehen" },
  btn_download: { en: "Download", hi: "डाउनलोड करें", de: "Herunterladen" },

  drafts_title: { en: "Drafts", hi: "ड्राफ्ट", de: "Entwürfe" },
  drafts_sub: { en: "A quick compiled view of scores, attendance, and timetable", hi: "अंक, उपस्थिति और समय सारणी का त्वरित सारांश दृश्य", de: "Ein schneller Überblick über Noten, Anwesenheit und Stundenplan" },
  card_recent_attendance: { en: "Recent Attendance", hi: "हाल की उपस्थिति", de: "Letzte Anwesenheit" },
  empty_no_attendance: { en: "No attendance recorded yet.", hi: "अभी तक कोई उपस्थिति दर्ज नहीं हुई।", de: "Noch keine Anwesenheit erfasst." },
  th_present: { en: "Present", hi: "उपस्थित", de: "Anwesend" },
  th_absent: { en: "Absent", hi: "अनुपस्थित", de: "Abwesend" },
  card_score_summary: { en: "Test Score Summary", hi: "परीक्षा अंक सारांश", de: "Testergebnis-Übersicht" },
  empty_no_students2: { en: "No students yet.", hi: "अभी कोई छात्र नहीं।", de: "Noch keine Schüler." },
  th_subjects_tested: { en: "Subjects Tested", hi: "परीक्षित विषय", de: "Getestete Fächer" },
  th_overall_avg: { en: "Overall Avg %", hi: "कुल औसत %", de: "Gesamt-Ø %" },
  card_weekly_overview: { en: "Weekly Timetable Overview", hi: "साप्ताहिक समय सारणी अवलोकन", de: "Wochenübersicht Stundenplan" },

  messenger_title: { en: "Class Messenger", hi: "क्लास मैसेंजर", de: "Klassen-Messenger" },
  messenger_sub: { en: "A shared board — everyone who opens this site can post and see messages here", hi: "एक साझा बोर्ड — इस साइट को खोलने वाला कोई भी यहाँ संदेश भेज और देख सकता है", de: "Eine gemeinsame Pinnwand — jeder, der diese Seite öffnet, kann hier Nachrichten posten und sehen" },
  placeholder_your_name: { en: "Your name", hi: "आपका नाम", de: "Dein Name" },
  placeholder_message: { en: "Write a message…", hi: "संदेश लिखें…", de: "Nachricht schreiben…" },
  btn_send: { en: "Send", hi: "भेजें", de: "Senden" },
  empty_no_messages: { en: "No messages yet — be the first to say something.", hi: "अभी कोई संदेश नहीं — पहला संदेश आप ही लिखें।", de: "Noch keine Nachrichten — schreib die erste." },
};

const MONTHS_BY_LANG = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  hi: ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
  de: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
};
const WEEKDAYS_SHORT_BY_LANG = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  hi: ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"],
  de: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
};
// Working-week tabs used in Timetable (Mon-Sat)
const WEEKDAYS_FULL_BY_LANG = {
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  hi: ["सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"],
  de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa"],
};

const LangContext = createContext({ lang: "en", setLang: () => {}, t: (k) => k });
function useLang() {
  return useContext(LangContext);
}

const ThemeContext = createContext({ theme: THEMES[0], themeId: "classic", setThemeId: () => {} });
function useAppTheme() {
  return useContext(ThemeContext);
}

const NAV_ITEMS = [
  { key: "dashboard", labelKey: "nav_dashboard", icon: LayoutDashboard },
  { key: "students", labelKey: "nav_students", icon: Users },
  { key: "attendance", labelKey: "nav_attendance", icon: ClipboardCheck },
  { key: "scores", labelKey: "nav_scores", icon: ClipboardList },
  { key: "calendar", labelKey: "nav_calendar", icon: CalendarDays },
  { key: "timetable", labelKey: "nav_timetable", icon: Clock },
  { key: "library", labelKey: "nav_library", icon: BookOpen },
  { key: "drafts", labelKey: "nav_drafts", icon: FileStack },
];

/* ---------------- HELPERS ---------------- */
function daysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate();
}
function isoDate(y, m, d) {
  const mm = String(m + 1).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}
function todayISO() {
  const d = new Date();
  return isoDate(d.getFullYear(), d.getMonth(), d.getDate());
}
function makeId() {
  return Math.random().toString(36).slice(2, 10);
}
// Whichever Saturday falls on the 8th-14th of a month is always the
// second Saturday — a neat shortcut that avoids counting weeks manually.
function isSecondSaturday(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.getDay() === 6 && d.getDate() >= 8 && d.getDate() <= 14;
}
// Combines manually-marked holidays with the automatic second-Saturday rule.
function isHolidayDate(dateStr, holidays) {
  return !!holidays[dateStr] || isSecondSaturday(dateStr);
}
function useLocalState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota errors */
    }
  }, [key, value]);
  return [value, setValue];
}

/**
 * Like useLocalState, but also syncs across every device/browser that opens
 * the site, via a shared Firestore document (see cloud.js / firebaseConfig.js).
 * Falls back to purely local storage automatically if Firebase isn't
 * configured yet, so the app still works fine without any setup.
 */
function useSyncedState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  const applyingRemoteRef = useRef(false);

  useEffect(() => {
    if (!isCloudConfigured()) return;
    const unsub = subscribeCloudField(key, (remoteValue) => {
      if (remoteValue !== undefined) {
        applyingRemoteRef.current = true;
        setValue(remoteValue);
      }
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota errors */
    }
    if (applyingRemoteRef.current) {
      // This update came FROM the cloud — don't echo it straight back.
      applyingRemoteRef.current = false;
      return;
    }
    if (isCloudConfigured()) saveCloudField(key, value);
  }, [key, value]);

  return [value, setValue];
}

/* ---------------- LIBRARY STORAGE (IndexedDB) ----------------
   PDFs are stored as Blobs in IndexedDB rather than localStorage —
   localStorage caps out around 5-10MB total and can't hold real book
   files. IndexedDB has a much larger quota and is built for this. */
const LIBRARY_DB_NAME = "classroom_tracker_library";
const LIBRARY_STORE = "books";

function openLibraryDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(LIBRARY_DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(LIBRARY_STORE)) {
        db.createObjectStore(LIBRARY_STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function libraryAddBook(book) {
  const db = await openLibraryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LIBRARY_STORE, "readwrite");
    tx.objectStore(LIBRARY_STORE).put(book);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function libraryGetBooks() {
  const db = await openLibraryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LIBRARY_STORE, "readonly");
    const req = tx.objectStore(LIBRARY_STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}
async function libraryDeleteBook(id) {
  const db = await openLibraryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LIBRARY_STORE, "readwrite");
    tx.objectStore(LIBRARY_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ---------------- SHRI AI: live grounding ----------------
   Genuine, honestly-scoped "real-time data": a live Wikipedia search
   feeds real current info into the prompt. It is not unrestricted access
   to "all data on the internet" — that isn't something a free client-side
   tool can responsibly promise — but it is real, live, and free. */
async function fetchWikiContext(query) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        query
      )}&format=json&origin=*&srlimit=1`
    );
    const data = await res.json();
    const hit = data && data.query && data.query.search && data.query.search[0];
    if (!hit) return "";
    const snippet = hit.snippet.replace(/<\/?[^>]+(>|$)/g, "");
    return `${hit.title}: ${snippet}`;
  } catch {
    return "";
  }
}

/** Splits a "Thinking: ... Answer: ..." formatted reply into its two parts.
 *  Falls back to treating the whole reply as the answer if the model didn't
 *  follow the format exactly. */
function parseThinkingAnswer(raw) {
  const answerMatch = raw.match(/Answer:\s*([\s\S]*)/i);
  const thinkingMatch = raw.match(/Thinking:\s*([\s\S]*?)(?=\n?Answer:|$)/i);
  if (answerMatch) {
    return {
      thinkingText: thinkingMatch ? thinkingMatch[1].trim() : "",
      answerText: answerMatch[1].trim(),
    };
  }
  return { thinkingText: "", answerText: raw };
}

/** Fetch with one automatic retry — the free Pollinations backend is
 *  occasionally flaky, so a single silent retry meaningfully improves
 *  reliability without the person needing to manually resend. */
async function fetchWithRetry(url, opts = {}, retries = 1) {
  try {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error("bad status " + res.status);
    return res;
  } catch (err) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 600));
      return fetchWithRetry(url, opts, retries - 1);
    }
    throw err;
  }
}

/* ---------------- LOGO ---------------- */
function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="60" height="60" rx="16" fill={COLORS.mustard} />
      <path
        d="M12 22 C20 18, 28 18, 32 22 C36 18, 44 18, 52 22 L52 42 C44 38, 36 38, 32 42 C28 38, 20 38, 12 42 Z"
        fill="#FFFFFF"
        stroke={COLORS.ink}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <line x1="32" y1="22" x2="32" y2="42" stroke={COLORS.ink} strokeWidth="2" />
      <circle cx="48" cy="46" r="11" fill={COLORS.sage} stroke="#FFFFFF" strokeWidth="2.5" />
      <path
        d="M43 46 L47 50 L54 42"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------- APP ---------------- */
export default function App() {
  const [booting, setBooting] = useState(true);
  const [entered, setEntered] = useLocalState("ct_entered", false);
  const [view, setView] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [students, setStudents] = useSyncedState("ct_students", []);
  const [attendance, setAttendance] = useSyncedState("ct_attendance", {});
  const [scores, setScores] = useSyncedState("ct_scores", {});
  const [timetable, setTimetable] = useSyncedState("ct_timetable", {});
  const [holidays, setHolidays] = useSyncedState("ct_holidays", {});
  const [categories, setCategories] = useSyncedState("ct_categories", []);
  const [appPaused, setAppPaused] = useSyncedState("ct_paused", false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const [lang, setLang] = useLocalState("ct_lang", "en");
  const [themeId, setThemeId] = useLocalState("ct_theme", "classic");
  const theme = getTheme(themeId);

  const t = (key) => (STRINGS[key] && (STRINGS[key][lang] || STRINGS[key].en)) || key;

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const addStudent = (name, roll) => {
    setStudents((prev) => [
      ...prev,
      { id: makeId(), name, roll: roll || String(prev.length + 1) },
    ]);
  };
  const removeStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (selectedStudentId === id) setSelectedStudentId(null);
  };

  if (booting) {
    return <BootScreen onDone={() => setBooting(false)} />;
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      <ThemeContext.Provider value={{ theme, themeId, setThemeId }}>
        {!entered ? (
          <Landing onEnter={() => setEntered(true)} />
        ) : (
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: theme.bg }}>
            <TopBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} appPaused={appPaused} />
            <SyncBanner />

            {menuOpen && (
              <HamburgerMenu
                view={view}
                setView={setView}
                onClose={() => setMenuOpen(false)}
                appPaused={appPaused}
                setAppPaused={setAppPaused}
              />
            )}

            <main className="ct-main" style={{ flex: 1 }}>
              {view === "dashboard" && (
                <DashboardView students={students} attendance={attendance} timetable={timetable} holidays={holidays} />
              )}
              {view === "students" && (
                <StudentsView
                  students={students}
                  addStudent={addStudent}
                  removeStudent={removeStudent}
                  scores={scores}
                  selectedStudentId={selectedStudentId}
                  setSelectedStudentId={setSelectedStudentId}
                />
              )}
              {view === "attendance" && (
                <AttendanceView
                  students={students}
                  attendance={attendance}
                  setAttendance={setAttendance}
                  holidays={holidays}
                  appPaused={appPaused}
                />
              )}
              {view === "scores" && <ScoresView students={students} scores={scores} setScores={setScores} />}
              {view === "calendar" && <CalendarView holidays={holidays} setHolidays={setHolidays} />}
              {view === "timetable" && <TimetableView timetable={timetable} setTimetable={setTimetable} />}
              {view === "library" && <LibraryView categories={categories} setCategories={setCategories} />}
              {view === "drafts" && (
                <DraftsView students={students} attendance={attendance} scores={scores} timetable={timetable} />
              )}
            </main>

            <JokeBar />
            <ShriAIWidget />
          </div>
        )}
      </ThemeContext.Provider>
    </LangContext.Provider>
  );
}

/* ---------------- LANDING ---------------- */
function Landing({ onEnter }) {
  const { t } = useLang();
  const { theme } = useAppTheme();
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 40,
        background: theme.bg,
      }}
    >
      <Logo size={56} />
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: COLORS.sage, textTransform: "uppercase", marginTop: 16, marginBottom: 14 }}>
        {t("landing_tag")}
      </div>
      <div
        style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: "clamp(40px, 7vw, 76px)",
          fontWeight: 700,
          color: COLORS.ink,
          lineHeight: 1.05,
          maxWidth: 800,
        }}
      >
        {t("landing_title")}
      </div>
      <div style={{ fontSize: 16, color: COLORS.sub, marginTop: 18, maxWidth: 480 }}>
        {t("landing_sub")}
      </div>
      <button
        onClick={onEnter}
        style={{
          marginTop: 36,
          padding: "14px 32px",
          borderRadius: 12,
          border: "none",
          background: COLORS.mustard,
          color: COLORS.board,
          fontWeight: 700,
          fontSize: 15.5,
        }}
      >
        {t("landing_enter")}
      </button>
    </div>
  );
}

/* ---------------- TOP BAR + HAMBURGER MENU ---------------- */
function TopBar({ menuOpen, setMenuOpen, appPaused }) {
  const { lang, setLang, t } = useLang();
  return (
    <div
      className="ct-topbar"
      style={{
        borderBottom: `1px solid ${COLORS.line}`,
        background: COLORS.paper,
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      <button
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Menu"
        style={{
          border: `1px solid ${COLORS.line}`,
          background: menuOpen ? COLORS.cream : "transparent",
          borderRadius: 9,
          padding: 8,
          display: "flex",
        }}
      >
        {menuOpen ? <X size={19} color={COLORS.ink} /> : <Menu size={19} color={COLORS.ink} />}
      </button>

      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="ct-lang-select"
        aria-label={t("menu_language")}
      >
        {LANGS.map((l) => (
          <option key={l.id} value={l.id}>{l.label}</option>
        ))}
      </select>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Logo size={26} />
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18, fontWeight: 700, color: COLORS.ink }}>
          {t("app_name")}
        </div>
      </div>
      {appPaused && (
        <span
          style={{
            marginLeft: 8,
            fontSize: 11.5,
            fontWeight: 700,
            color: COLORS.coral,
            border: `1px solid ${COLORS.coral}`,
            borderRadius: 999,
            padding: "3px 10px",
          }}
        >
          {t("app_paused_badge")}
        </span>
      )}
    </div>
  );
}

function SyncBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (isCloudConfigured() || dismissed) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 20px",
        background: "#FFF6E5",
        borderBottom: `1px solid ${COLORS.line}`,
        fontSize: 12.5,
        color: COLORS.ink,
      }}
    >
      <span style={{ flex: 1 }}>
        Changes made here only stay on this device right now — cross-device sync isn't set up yet. See{" "}
        <code style={{ background: "#00000010", padding: "1px 5px", borderRadius: 4 }}>src/firebaseConfig.js</code> for a 5-minute free setup.
      </span>
      <button
        onClick={() => setDismissed(true)}
        style={{ border: "none", background: "transparent", padding: 4, display: "flex" }}
        aria-label="Dismiss"
      >
        <X size={14} color={COLORS.sub} />
      </button>
    </div>
  );
}

function HamburgerMenu({ view, setView, onClose, appPaused, setAppPaused }) {
  const { lang, setLang, t } = useLang();
  const { themeId, setThemeId } = useAppTheme();

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(46,42,36,0.25)", zIndex: 20 }}
      />
      <div
        className="ct-menu-panel"
        style={{
          position: "fixed",
          top: 65,
          left: 0,
          bottom: 0,
          background: COLORS.paper,
          borderRight: `1px solid ${COLORS.line}`,
          padding: "18px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          zIndex: 30,
          boxShadow: "6px 0 24px rgba(0,0,0,0.08)",
          overflowY: "auto",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = view === item.key;
          return (
            <button
              key={item.key}
              onClick={() => {
                setView(item.key);
                onClose();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "11px 12px",
                borderRadius: 9,
                border: "none",
                background: active ? COLORS.cream : "transparent",
                color: active ? COLORS.ink : COLORS.sub,
                fontWeight: active ? 700 : 500,
                fontSize: 14,
                textAlign: "left",
              }}
            >
              <Icon size={17} />
              {t(item.labelKey)}
            </button>
          );
        })}

        <div style={{ borderTop: `1px solid ${COLORS.line}`, margin: "12px 0 10px" }} />

        <div style={{ padding: "0 8px 6px", display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: COLORS.sub, textTransform: "uppercase", letterSpacing: 0.4 }}>
          <Globe size={13} /> {t("menu_language")}
        </div>
        <div style={{ display: "flex", gap: 6, padding: "0 8px 12px", flexWrap: "wrap" }}>
          {LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: `1px solid ${lang === l.id ? COLORS.mustard : COLORS.line}`,
                background: lang === l.id ? COLORS.cream : "transparent",
                color: lang === l.id ? COLORS.ink : COLORS.sub,
                fontSize: 12.5,
                fontWeight: lang === l.id ? 700 : 500,
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "0 8px 6px", display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: COLORS.sub, textTransform: "uppercase", letterSpacing: 0.4 }}>
          <Palette size={13} /> {t("menu_theme")}
        </div>
        <div style={{ display: "flex", gap: 8, padding: "0 8px 12px", flexWrap: "wrap" }}>
          {THEMES.map((th) => (
            <button
              key={th.id}
              onClick={() => setThemeId(th.id)}
              title={th.id}
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                border: themeId === th.id ? `2.5px solid ${COLORS.ink}` : `1px solid ${COLORS.line}`,
                background: th.bg,
                padding: 0,
              }}
            />
          ))}
        </div>

        <div style={{ flex: 1 }} />
        <button
          onClick={() => setAppPaused((p) => !p)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 12px",
            borderRadius: 9,
            border: `1px solid ${appPaused ? COLORS.coral : COLORS.line}`,
            background: "transparent",
            color: appPaused ? COLORS.coral : COLORS.sub,
            fontWeight: 600,
            fontSize: 12.5,
          }}
        >
          {appPaused ? <Play size={14} /> : <Pause size={14} />}
          {appPaused ? t("resume_entry") : t("pause_entry")}
        </button>
      </div>
    </>
  );
}

/* ---------------- JOKE BAR ---------------- */
function JokeBar() {
  const { t } = useLang();
  const [index, setIndex] = useState(() => Math.floor(Math.random() * JOKES.length));
  return (
    <div
      className="ct-jokebar"
      style={{
        position: "sticky",
        bottom: 0,
        borderTop: `1px solid ${COLORS.line}`,
        background: COLORS.cream,
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.mustard, whiteSpace: "nowrap" }}>
        😄 {t("joke_label")}
      </span>
      <span style={{ fontSize: 13, color: COLORS.ink, flex: 1 }}>{JOKES[index]}</span>
      <button
        onClick={() => setIndex((i) => (i + 1) % JOKES.length)}
        style={{
          border: "none",
          background: "transparent",
          color: COLORS.sub,
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        <RefreshCw size={13} /> {t("joke_next")}
      </button>
    </div>
  );
}

/* ---------------- FORMATTED TEXT (for Shri AI answers) ----------------
   Lightweight markdown rendering — **bold**, bullet lists, numbered lists,
   paragraphs — so answers read like a properly formatted response instead
   of one flat block of text. */
function renderInline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>
    ) : (
      <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>
    )
  );
}
function FormattedText({ text }) {
  const blocks = text.split(/\n\s*\n/).filter((b) => b.trim());
  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block.split("\n").filter((l) => l.trim());
        const isBulletList = lines.length > 0 && lines.every((l) => /^[-*]\s+/.test(l.trim()));
        const isNumberList = lines.length > 0 && lines.every((l) => /^\d+[.)]\s+/.test(l.trim()));
        if (isBulletList) {
          return (
            <ul key={bi} style={{ margin: "6px 0", paddingLeft: 18 }}>
              {lines.map((l, li) => (
                <li key={li} style={{ marginBottom: 2 }}>
                  {renderInline(l.trim().replace(/^[-*]\s+/, ""), `${bi}-${li}`)}
                </li>
              ))}
            </ul>
          );
        }
        if (isNumberList) {
          return (
            <ol key={bi} style={{ margin: "6px 0", paddingLeft: 18 }}>
              {lines.map((l, li) => (
                <li key={li} style={{ marginBottom: 2 }}>
                  {renderInline(l.trim().replace(/^\d+[.)]\s+/, ""), `${bi}-${li}`)}
                </li>
              ))}
            </ol>
          );
        }
        return (
          <p key={bi} style={{ margin: bi === 0 ? "0 0 6px" : "6px 0" }}>
            {lines.map((l, li) => (
              <React.Fragment key={li}>
                {renderInline(l, `${bi}-${li}`)}
                {li < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

function ChatImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div
      style={{
        width: 220,
        height: 220,
        borderRadius: 10,
        overflow: "hidden",
        background: COLORS.cream,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {!loaded && !error && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="ct-typing-dot" />
          <span className="ct-typing-dot" />
          <span className="ct-typing-dot" />
        </div>
      )}
      {error && (
        <span style={{ fontSize: 11, color: COLORS.coral, padding: 10, textAlign: "center" }}>
          Couldn't generate that image.
        </span>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: loaded ? "block" : "none" }}
      />
    </div>
  );
}

function ShriAIWidget() {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [imageMode, setImageMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState("");
  const [thinkingOpen, setThinkingOpen] = useState({});
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking, open]);

  const sendText = async (promptText) => {
    setThinking(true);
    try {
      const context = await fetchWikiContext(promptText);
      const langName = lang === "hi" ? "Hindi" : lang === "de" ? "German" : "English";
      const systemPrompt =
        "You are Shri AI, a friendly and patient homework helper for school " +
        "students. Explain things clearly and step by step. Format the answer " +
        "well: use **bold** for key terms, use a numbered list (1. 2. 3.) for " +
        "sequential steps, use a bullet list (- item) for unordered points, and " +
        "break separate ideas into separate paragraphs with a blank line between " +
        "them. Encourage the student to understand rather than just handing them " +
        `an answer. Respond in ${langName}. First, on a line starting with ` +
        "'Thinking:', briefly reason through the problem in 2-4 short sentences " +
        "(how you're approaching it). Then, on a line starting with 'Answer:', " +
        "give the final, well-formatted answer." +
        (context ? ` Reference info (may or may not be relevant): ${context}` : "");
      const res = await fetchWithRetry("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: promptText },
          ],
        }),
      });
      const data = await res.json();
      const raw = (data?.choices?.[0]?.message?.content || "").trim();
      const { thinkingText, answerText } = parseThinkingAnswer(raw);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: answerText || raw || t("shri_error_empty"), thinking: thinkingText },
      ]);
    } catch (err) {
      setError(t("shri_error_unavailable"));
    } finally {
      setThinking(false);
    }
  };

  // Free, no-key image generation via Pollinations. This is instant
  // generation from the description given — not "live data" grounding
  // the way the text chat's Wikipedia lookup is, since that concept
  // doesn't really apply to image generation.
  const sendImage = async (promptText) => {
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?width=512&height=512&nologo=true&seed=${Date.now()}`;
    setMessages((m) => [...m, { role: "assistant", type: "image", content: url, prompt: promptText }]);
  };

  const send = async () => {
    if (!input.trim() || thinking) return;
    const promptText = input.trim();
    setMessages((m) => [...m, { role: "user", content: promptText }]);
    setInput("");
    setError("");
    if (imageMode) {
      await sendImage(promptText);
    } else {
      await sendText(promptText);
    }
  };

  return (
    <>
      {!(open && fullscreen) && (
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Shri AI homework helper"
          className="ct-shri-btn"
          style={{
            zIndex: 45,
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderRadius: 999,
            border: "none",
            background: COLORS.mustard,
            color: COLORS.board,
            fontWeight: 700,
            boxShadow: "0 8px 20px rgba(224,164,37,0.4)",
          }}
        >
          {open ? <X size={16} /> : <GraduationCap size={16} />}
          {t("shri_name")}
        </button>
      )}

      {open && (
        <div
          className={`ct-shri-panel${fullscreen ? " fullscreen" : ""}`}
          style={{
            maxWidth: fullscreen ? "100vw" : "calc(100vw - 44px)",
            background: COLORS.paper,
            border: `1px solid ${COLORS.line}`,
            borderRadius: 16,
            boxShadow: "0 16px 40px rgba(46,42,36,0.18)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 45,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 16px",
              borderBottom: `1px solid ${COLORS.line}`,
              background: COLORS.cream,
            }}
          >
            <GraduationCap size={20} color={COLORS.mustard} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 14.5 }}>{t("shri_name")}</div>
              <div style={{ fontSize: 11, color: COLORS.sub }}>{t("shri_sub")}</div>
            </div>
            <button
              onClick={() => setFullscreen((f) => !f)}
              aria-label="Toggle fullscreen"
              style={{ border: "none", background: "transparent", display: "flex", padding: 4 }}
            >
              {fullscreen ? <Minimize2 size={16} color={COLORS.sub} /> : <Maximize2 size={16} color={COLORS.sub} />}
            </button>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{ border: "none", background: "transparent", display: "flex", padding: 4 }}
            >
              <X size={16} color={COLORS.sub} />
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: fullscreen ? "24px max(14px, calc(50% - 320px))" : 14,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.length === 0 && (
              <div style={{ fontSize: 12.5, color: COLORS.sub }}>{t("shri_welcome")}</div>
            )}
            {messages.map((m, i) => (
              <div key={i} className="ct-msg" style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8 }}>
                {m.role === "assistant" && (
                  <div style={{ flexShrink: 0, marginTop: 2 }}>
                    <GraduationCap size={16} color={COLORS.mustard} />
                  </div>
                )}
                {m.type === "image" ? (
                  <div
                    style={{
                      borderRadius: 12,
                      overflow: "hidden",
                      border: `1px solid ${COLORS.line}`,
                      borderLeft: `3px solid ${COLORS.mustard}`,
                    }}
                  >
                    <ChatImage src={m.content} alt={m.prompt} />
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", maxWidth: fullscreen ? "min(640px, 82%)" : "82%" }}>
                    {m.thinking && (
                      <div style={{ marginBottom: 4 }}>
                        <button
                          onClick={() => setThinkingOpen((prev) => ({ ...prev, [i]: !prev[i] }))}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            border: "none",
                            background: "transparent",
                            padding: 0,
                            fontSize: 11,
                            color: COLORS.sub,
                            fontWeight: 600,
                          }}
                        >
                          <Brain size={11} />
                          {thinkingOpen[i] ? "Hide thinking" : "Show thinking"}
                        </button>
                        {thinkingOpen[i] && (
                          <div
                            style={{
                              fontSize: 12,
                              fontStyle: "italic",
                              color: COLORS.sub,
                              marginTop: 4,
                              padding: "4px 0 4px 10px",
                              borderLeft: `2px solid ${COLORS.line}`,
                            }}
                          >
                            {m.thinking}
                          </div>
                        )}
                      </div>
                    )}
                    <div
                      style={{
                        padding: "10px 13px",
                        borderRadius: 12,
                        fontSize: 13.5,
                        lineHeight: 1.65,
                        whiteSpace: "pre-wrap",
                        background: m.role === "user" ? COLORS.mustard : COLORS.paper,
                        color: m.role === "user" ? COLORS.board : COLORS.ink,
                        border: m.role === "assistant" ? `1px solid ${COLORS.line}` : "none",
                        borderLeft: m.role === "assistant" ? `3px solid ${COLORS.mustard}` : "none",
                        boxShadow: m.role === "assistant" ? "0 1px 3px rgba(46,42,36,0.06)" : "none",
                      }}
                    >
                      {m.role === "assistant" ? <FormattedText text={m.content} /> : m.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {thinking && (
              <div className="ct-msg" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <GraduationCap size={16} color={COLORS.mustard} />
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: `1px solid ${COLORS.line}`,
                    borderLeft: `3px solid ${COLORS.mustard}`,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span className="ct-typing-dot" />
                  <span className="ct-typing-dot" />
                  <span className="ct-typing-dot" />
                </div>
              </div>
            )}
            {error && <div style={{ fontSize: 12, color: COLORS.coral }}>{error}</div>}
            <div ref={bottomRef} />
          </div>

          <div style={{ display: "flex", gap: 8, padding: 12, borderTop: `1px solid ${COLORS.line}`, maxWidth: fullscreen ? 700 : "none", width: fullscreen ? "100%" : "auto", margin: fullscreen ? "0 auto" : 0 }}>
            <button
              onClick={() => setImageMode((v) => !v)}
              aria-label="Toggle image generation"
              title={imageMode ? "Switch to homework chat" : "Switch to image generation"}
              style={{
                ...iconBtn,
                borderRadius: 8,
                padding: 9,
                border: `1px solid ${imageMode ? COLORS.mustard : COLORS.line}`,
                background: imageMode ? COLORS.cream : "transparent",
              }}
            >
              <ImagePlus size={15} color={imageMode ? COLORS.mustard : COLORS.sub} />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={imageMode ? "Describe an image to generate…" : t("shri_placeholder")}
              style={{ ...inputStyle, flex: 1 }}
            />
            <button onClick={send} disabled={thinking} style={{ ...iconBtn, background: COLORS.mustard, borderRadius: 8, padding: 9 }}>
              <Send size={15} color={COLORS.board} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------- DASHBOARD ---------------- */
function DashboardView({ students, attendance, timetable, holidays }) {
  const { lang, t } = useLang();
  const MONTH_NAMES = MONTHS_BY_LANG[lang];
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth();
  const dim = daysInMonth(y, m);

  const monthlyData = useMemo(() => {
    const arr = [];
    for (let d = 1; d <= dim; d++) {
      const date = isoDate(y, m, d);
      if (isHolidayDate(date, holidays)) continue;
      const rec = attendance[date];
      if (!rec) continue;
      const vals = Object.values(rec);
      const present = vals.filter((v) => v === "present").length;
      const pct = vals.length ? Math.round((present / vals.length) * 100) : 0;
      arr.push({ day: d, pct });
    }
    return arr;
  }, [attendance, holidays, dim, y, m]);

  const yearlyData = useMemo(() => {
    const arr = [];
    for (let mo = 0; mo < 12; mo++) {
      let totalPresent = 0, totalMarks = 0;
      const dm = daysInMonth(y, mo);
      for (let d = 1; d <= dm; d++) {
        const date = isoDate(y, mo, d);
        if (isHolidayDate(date, holidays)) continue;
        const rec = attendance[date];
        if (!rec) continue;
        const vals = Object.values(rec);
        totalPresent += vals.filter((v) => v === "present").length;
        totalMarks += vals.length;
      }
      arr.push({ month: MONTH_NAMES[mo].slice(0, 3), pct: totalMarks ? Math.round((totalPresent / totalMarks) * 100) : 0 });
    }
    return arr;
  }, [attendance, holidays, y, MONTH_NAMES]);

  const dowFull = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayName = dowFull[now.getDay()] === "Sun" ? null : dowFull[now.getDay()];
  const todaysClasses = timetable[todayName] || [];

  const monthAvg = monthlyData.length ? Math.round(monthlyData.reduce((a, b) => a + b.pct, 0) / monthlyData.length) : 0;

  const todayRecord = attendance[todayISO()] || {};
  const todayVals = Object.values(todayRecord);
  const presentToday = todayVals.filter((v) => v === "present").length;
  const absentToday = todayVals.filter((v) => v === "absent").length;

  return (
    <div>
      <SectionTitle title={t("dash_title")} subtitle={`${MONTH_NAMES[m]} ${y}`} />
      <div className="ct-stats-grid">
        <StatCard label={t("stat_students")} value={students.length} color={COLORS.mustard} />
        <StatCard label={t("stat_avg_attendance")} value={`${monthAvg}%`} color={COLORS.sage} />
        <StatCard label={t("stat_days_recorded")} value={monthlyData.length} color={COLORS.coral} />
        <StatCard label={t("stat_present_today")} value={presentToday} color={COLORS.sage} />
        <StatCard label={t("stat_absent_today")} value={absentToday} color={COLORS.coral} />
      </div>

      <Card title={t("card_month_attendance")}>
        {monthlyData.length === 0 ? <Empty text={t("empty_no_attendance_month")} /> : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.line} />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis fontSize={12} domain={[0, 100]} />
              <Tooltip formatter={(v) => `${v}%`} labelFormatter={(d) => `${d}`} />
              <Bar dataKey="pct" fill={COLORS.sage} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card title={`${t("card_year_pattern")} — ${y} (${t("year_view")})`}>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.line} />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} domain={[0, 100]} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Line type="monotone" dataKey="pct" stroke={COLORS.mustard} strokeWidth={3} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title={t("card_today_timetable")}>
        {!todayName ? <Empty text={t("empty_sunday")} /> :
          todaysClasses.length === 0 ? <Empty text={t("empty_no_periods_today")} /> : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {todaysClasses.map((c, i) => (
              <div key={i} style={{ padding: "10px 14px", background: COLORS.cream, borderRadius: 10, border: `1px solid ${COLORS.line}` }}>
                <div style={{ fontSize: 12, color: COLORS.sub }}>{c.time}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{c.subject}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ---------------- STUDENTS ---------------- */
function StudentsView({ students, addStudent, removeStudent, scores, selectedStudentId, setSelectedStudentId }) {
  const { t } = useLang();
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");

  const selected = students.find((s) => s.id === selectedStudentId);

  const subjectPerf = useMemo(() => {
    if (!selected) return [];
    const studentScores = scores[selected.id] || {};
    return Object.entries(studentScores).map(([subject, entries]) => {
      const avg = entries.length ? Math.round(entries.reduce((a, e) => a + (e.score / e.maxScore) * 100, 0) / entries.length) : 0;
      return { subject, avg, count: entries.length };
    });
  }, [selected, scores]);

  return (
    <div>
      <SectionTitle title={t("students_title")} subtitle={t("students_sub")} />

      <Card title={t("card_add_student")}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input placeholder={t("placeholder_student_name")} value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          <input placeholder={t("placeholder_roll")} value={roll} onChange={(e) => setRoll(e.target.value)} style={{ ...inputStyle, width: 140 }} />
          <button
            onClick={() => { if (name.trim()) { addStudent(name.trim(), roll.trim()); setName(""); setRoll(""); } }}
            style={primaryBtn}
          >
            <UserPlus size={15} /> {t("btn_add_student")}
          </button>
        </div>
      </Card>

      <div className="ct-perf-grid">
        <Card title={`${t("roster_title")} (${students.length})`}>
          {students.length === 0 ? <Empty text={t("empty_no_students")} /> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {students.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedStudentId(s.id)}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 12px", borderRadius: 8,
                    background: selectedStudentId === s.id ? COLORS.cream : "transparent",
                    border: `1px solid ${selectedStudentId === s.id ? COLORS.mustard : "transparent"}`,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.sub }}>{t("roll_label")}{s.roll}</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); removeStudent(s.id); }} style={iconBtn}>
                    <Trash2 size={15} color={COLORS.coral} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title={selected ? `${selected.name}${t("performance_suffix")}` : t("select_student_prompt")}>
          {!selected ? <Empty text={t("empty_select_student")} /> : (
            subjectPerf.length === 0 ? <Empty text={t("empty_no_scores_student")} /> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={subjectPerf}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.line} />
                  <XAxis dataKey="subject" fontSize={11} interval={0} angle={-15} textAnchor="end" height={50} />
                  <YAxis fontSize={12} domain={[0, 100]} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Bar dataKey="avg" fill={COLORS.mustard} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )
          )}
        </Card>
      </div>
    </div>
  );
}

/* ---------------- ATTENDANCE ---------------- */
function AttendanceView({ students, attendance, setAttendance, holidays, appPaused }) {
  const { t } = useLang();
  const [date, setDate] = useState(todayISO());
  const isHoliday = isHolidayDate(date, holidays);
  const dayRecord = attendance[date] || {};

  const setStatus = (studentId, status) => {
    if (appPaused || isHoliday) return;
    setAttendance((prev) => ({
      ...prev,
      [date]: { ...(prev[date] || {}), [studentId]: status },
    }));
  };

  const markAll = (status) => {
    if (appPaused || isHoliday) return;
    const rec = {};
    students.forEach((s) => (rec[s.id] = status));
    setAttendance((prev) => ({ ...prev, [date]: rec }));
  };

  return (
    <div>
      <SectionTitle title={t("attendance_title")} subtitle={t("attendance_sub")} />
      <Card>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
          <button onClick={() => markAll("present")} style={secondaryBtn} disabled={appPaused || isHoliday}>{t("btn_mark_all_present")}</button>
          <button onClick={() => markAll("absent")} style={{ ...secondaryBtn, color: COLORS.coral, borderColor: COLORS.coral }} disabled={appPaused || isHoliday}>{t("btn_mark_all_absent")}</button>
          {(appPaused || isHoliday) && (
            <span style={{ fontSize: 13, color: COLORS.coral, fontWeight: 600 }}>
              {appPaused ? t("msg_app_paused") : t("msg_holiday")} {t("msg_entry_disabled")}
            </span>
          )}
        </div>

        {students.length === 0 ? <Empty text={t("empty_add_students_first")} /> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {students.map((s) => {
              const status = dayRecord[s.id];
              return (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: 8, background: COLORS.cream }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name} <span style={{ color: COLORS.sub, fontWeight: 400 }}>#{s.roll}</span></div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => setStatus(s.id, "present")}
                      style={{ ...toggleBtn, background: status === "present" ? COLORS.sage : "transparent", color: status === "present" ? "#fff" : COLORS.sage, borderColor: COLORS.sage }}
                    >{t("btn_present")}</button>
                    <button
                      onClick={() => setStatus(s.id, "absent")}
                      style={{ ...toggleBtn, background: status === "absent" ? COLORS.coral : "transparent", color: status === "absent" ? "#fff" : COLORS.coral, borderColor: COLORS.coral }}
                    >{t("btn_absent")}</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ---------------- SCORES ---------------- */
function ScoresView({ students, scores, setScores }) {
  const { t } = useLang();
  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState(DEFAULT_SUBJECTS[0]);
  const [customSubject, setCustomSubject] = useState("");
  const [testName, setTestName] = useState("");
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("100");

  const addScore = () => {
    const sub = subject === "__custom" ? customSubject.trim() : subject;
    if (!studentId || !sub || score === "" || maxScore === "") return;
    setScores((prev) => {
      const studentScores = { ...(prev[studentId] || {}) };
      const entries = [...(studentScores[sub] || [])];
      entries.push({ test: testName || "Test", score: Number(score), maxScore: Number(maxScore), date: todayISO() });
      studentScores[sub] = entries;
      return { ...prev, [studentId]: studentScores };
    });
    setTestName(""); setScore("");
  };

  const allEntries = useMemo(() => {
    const rows = [];
    Object.entries(scores).forEach(([sid, subjMap]) => {
      const student = students.find((s) => s.id === sid);
      if (!student) return;
      Object.entries(subjMap).forEach(([subj, entries]) => {
        entries.forEach((e) => rows.push({ student: student.name, subject: subj, ...e }));
      });
    });
    return rows.reverse();
  }, [scores, students]);

  return (
    <div>
      <SectionTitle title={t("scores_title")} subtitle={t("scores_sub")} />
      <Card title={t("card_add_score")}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <select value={studentId} onChange={(e) => setStudentId(e.target.value)} style={inputStyle}>
            <option value="">{t("select_student")}</option>
            {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} style={inputStyle}>
            {DEFAULT_SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            <option value="__custom">{t("option_other")}</option>
          </select>
          {subject === "__custom" && (
            <input placeholder={t("placeholder_subject_name")} value={customSubject} onChange={(e) => setCustomSubject(e.target.value)} style={inputStyle} />
          )}
          <input placeholder={t("placeholder_test_name")} value={testName} onChange={(e) => setTestName(e.target.value)} style={{ ...inputStyle, width: 130 }} />
          <input placeholder={t("placeholder_score")} type="number" value={score} onChange={(e) => setScore(e.target.value)} style={{ ...inputStyle, width: 90 }} />
          <span style={{ color: COLORS.sub }}>/</span>
          <input placeholder={t("placeholder_max")} type="number" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} style={{ ...inputStyle, width: 90 }} />
          <button onClick={addScore} style={primaryBtn}><Plus size={15} /> {t("btn_add")}</button>
        </div>
      </Card>

      <Card title={t("card_all_scores")}>
        {allEntries.length === 0 ? <Empty text={t("empty_no_scores")} /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead><tr>
                <th style={thStyle}>{t("th_student")}</th><th style={thStyle}>{t("th_subject")}</th><th style={thStyle}>{t("th_test")}</th>
                <th style={thStyle}>{t("th_score")}</th><th style={thStyle}>{t("th_date")}</th>
              </tr></thead>
              <tbody>
                {allEntries.map((r, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{r.student}</td>
                    <td style={tdStyle}>{r.subject}</td>
                    <td style={tdStyle}>{r.test}</td>
                    <td style={tdStyle}>{r.score}/{r.maxScore} ({Math.round((r.score / r.maxScore) * 100)}%)</td>
                    <td style={tdStyle}>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ---------------- CALENDAR ---------------- */
function CalendarView({ holidays, setHolidays }) {
  const { lang, t } = useLang();
  const MONTH_NAMES = MONTHS_BY_LANG[lang];
  const DOW_SHORT = WEEKDAYS_SHORT_BY_LANG[lang];
  const [cursor, setCursor] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const dim = daysInMonth(cursor.y, cursor.m);
  const firstDow = new Date(cursor.y, cursor.m, 1).getDay(); // 0=Sun

  const toggleHoliday = (dateStr) => {
    setHolidays((prev) => {
      const next = { ...prev };
      if (next[dateStr]) delete next[dateStr]; else next[dateStr] = true;
      return next;
    });
  };

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push(d);

  return (
    <div>
      <SectionTitle title={t("calendar_title")} subtitle={t("calendar_sub")} />
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <button onClick={() => setCursor((c) => c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 })} style={iconBtn}><ChevronLeft size={18} /></button>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 20, fontWeight: 600 }}>{MONTH_NAMES[cursor.m]} {cursor.y}</div>
          <button onClick={() => setCursor((c) => c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 })} style={iconBtn}><ChevronRight size={18} /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, fontSize: 12, color: COLORS.sub, marginBottom: 6, textAlign: "center" }}>
          {DOW_SHORT.map((d) => <div key={d}>{d}</div>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
          {cells.map((d, i) => {
            if (d === null) return <div key={i} />;
            const dateStr = isoDate(cursor.y, cursor.m, d);
            const isManualHol = !!holidays[dateStr];
            const isAutoHol = isSecondSaturday(dateStr);
            const isSun = new Date(cursor.y, cursor.m, d).getDay() === 0;
            return (
              <button
                key={i}
                onClick={() => !isAutoHol && toggleHoliday(dateStr)}
                style={{
                  aspectRatio: "1", borderRadius: 8, position: "relative",
                  border: `1px solid ${isAutoHol ? COLORS.sage : isManualHol ? COLORS.coral : COLORS.line}`,
                  background: isAutoHol ? "rgba(110,144,117,0.15)" : isManualHol ? "rgba(225,90,76,0.15)" : isSun ? COLORS.cream : COLORS.paper,
                  color: isAutoHol ? COLORS.sage : isManualHol ? COLORS.coral : COLORS.ink,
                  fontSize: 13, fontWeight: isAutoHol || isManualHol ? 700 : 500,
                  cursor: isAutoHol ? "default" : "pointer",
                }}
                title={isAutoHol ? t("tooltip_auto_holiday") : isManualHol ? t("tooltip_holiday_unmark") : t("tooltip_mark_holiday")}
              >
                {d}
                {isAutoHol && (
                  <span style={{ position: "absolute", bottom: 2, left: 0, right: 0, fontSize: 8, fontWeight: 700, letterSpacing: 0.3 }}>
                    {t("tag_2nd_sat")}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 14, fontSize: 12, color: COLORS.sub }}>
          {t("calendar_hint")}
        </div>
      </Card>
    </div>
  );
}

/* ---------------- TIMETABLE ---------------- */
function TimetableView({ timetable, setTimetable }) {
  const { lang, t } = useLang();
  const WEEKDAYS = WEEKDAYS_FULL_BY_LANG.en; // keys stay English internally for data consistency
  const WEEKDAYS_LABELS = WEEKDAYS_FULL_BY_LANG[lang];
  const [day, setDay] = useState("Mon");
  const [time, setTime] = useState("");
  const [subject, setSubject] = useState("");

  const addPeriod = () => {
    if (!time || !subject) return;
    setTimetable((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), { time, subject }],
    }));
    setTime(""); setSubject("");
  };

  const removePeriod = (d, idx) => {
    setTimetable((prev) => ({ ...prev, [d]: prev[d].filter((_, i) => i !== idx) }));
  };

  return (
    <div>
      <SectionTitle title={t("timetable_title")} subtitle={t("timetable_sub")} />
      <Card title={t("card_add_period")}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <select value={day} onChange={(e) => setDay(e.target.value)} style={inputStyle}>
            {WEEKDAYS.map((d, i) => <option key={d} value={d}>{WEEKDAYS_LABELS[i]}</option>)}
          </select>
          <input placeholder={t("placeholder_time")} value={time} onChange={(e) => setTime(e.target.value)} style={inputStyle} />
          <input placeholder={t("placeholder_subject")} value={subject} onChange={(e) => setSubject(e.target.value)} style={inputStyle} />
          <button onClick={addPeriod} style={primaryBtn}><Plus size={15} /> {t("btn_add")}</button>
        </div>
      </Card>

      <div className="ct-timetable-grid">
        {WEEKDAYS.map((d, i) => (
          <Card key={d} title={WEEKDAYS_LABELS[i]}>
            {(timetable[d] || []).length === 0 ? <Empty text={t("empty_no_periods")} /> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {timetable[d].map((p, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: COLORS.cream, borderRadius: 8 }}>
                    <div>
                      <div style={{ fontSize: 12, color: COLORS.sub }}>{p.time}</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{p.subject}</div>
                    </div>
                    <button onClick={() => removePeriod(d, idx)} style={iconBtn}><Trash2 size={14} color={COLORS.coral} /></button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------- LIBRARY (fully open — no admin lock) ---------------- */
function LibraryView({ categories, setCategories }) {
  const { t } = useLang();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [uploadCategoryId, setUploadCategoryId] = useState("");

  const loadBooks = async () => {
    try {
      const list = await libraryGetBooks();
      list.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      setBooks(list);
    } catch {
      setError("Could not load the library in this browser.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const addCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    setCategories((prev) => [...prev, { id: makeId(), name }]);
    setNewCategoryName("");
  };

  const removeCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setBooks((prev) => prev.map((b) => (b.categoryId === id ? { ...b, categoryId: null } : b)));
  };

  const handleUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError(t("err_pdf_only"));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setUploading(true);
    setError("");
    try {
      await libraryAddBook({
        id: makeId(),
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        categoryId: uploadCategoryId || null,
        blob: file,
      });
      await loadBooks();
    } catch {
      setError(t("err_upload_failed"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id) => {
    await libraryDeleteBook(id);
    loadBooks();
  };

  const handleView = (book) => {
    const url = URL.createObjectURL(book.blob);
    window.open(url, "_blank");
  };

  const handleDownload = (book) => {
    const url = URL.createObjectURL(book.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = book.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const groups = categories.map((cat) => ({
    ...cat,
    books: books.filter((b) => b.categoryId === cat.id),
  }));
  const uncategorized = books.filter(
    (b) => !b.categoryId || !categories.find((c) => c.id === b.categoryId)
  );

  return (
    <div>
      <SectionTitle title={t("library_title")} subtitle={t("library_sub")} />

      <Card>
        <div style={{ fontSize: 12.5, color: COLORS.sub }}>{t("lib_open_msg")}</div>
      </Card>

      <Card title={t("card_manage_categories")}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <input
            placeholder={t("placeholder_new_category")}
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
            style={inputStyle}
          />
          <button onClick={addCategory} style={primaryBtn}>
            <FolderPlus size={15} /> {t("btn_add_category")}
          </button>
        </div>
        {categories.length === 0 ? (
          <Empty text={t("empty_no_categories")} />
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {categories.map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  border: `1px solid ${COLORS.line}`, borderRadius: 999,
                  padding: "6px 12px", fontSize: 12.5, fontWeight: 600,
                }}
              >
                <Folder size={13} color={COLORS.mustard} />
                {c.name}
                <button onClick={() => removeCategory(c.id)} style={{ border: "none", background: "transparent", display: "flex", padding: 0 }}>
                  <Trash2 size={12} color={COLORS.coral} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title={t("card_upload_pdf")}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <select value={uploadCategoryId} onChange={(e) => setUploadCategoryId(e.target.value)} style={inputStyle}>
            <option value="">{t("option_uncategorized")}</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            disabled={uploading}
            style={inputStyle}
          />
          {uploading && <span style={{ fontSize: 12, color: COLORS.sub }}>{t("uploading_label")}</span>}
        </div>
        {error && <div style={{ color: COLORS.coral, fontSize: 13, marginTop: 10 }}>{error}</div>}
        <div style={{ fontSize: 12, color: COLORS.sub, marginTop: 10 }}>
          {t("lib_storage_note")}
        </div>
      </Card>

      {loading ? (
        <Card><Empty text={t("loading_library")} /></Card>
      ) : books.length === 0 ? (
        <Card><Empty text={t("empty_no_books")} /></Card>
      ) : (
        <>
          {groups.map((g) => (
            <Card key={g.id} title={`${g.name} (${g.books.length})`}>
              {g.books.length === 0 ? (
                <Empty text={t("empty_no_books_category")} />
              ) : (
                <BookGrid books={g.books} onView={handleView} onDownload={handleDownload} onDelete={handleDelete} />
              )}
            </Card>
          ))}
          {uncategorized.length > 0 && (
            <Card title={`${t("uncategorized_title")} (${uncategorized.length})`}>
              <BookGrid books={uncategorized} onView={handleView} onDownload={handleDownload} onDelete={handleDelete} />
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function BookGrid({ books, onView, onDownload, onDelete }) {
  const { t } = useLang();
  return (
    <div className="ct-lib-grid">
      {books.map((b) => (
        <div
          key={b.id}
          style={{
            border: `1px solid ${COLORS.line}`,
            borderRadius: 12,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BookOpen size={18} color={COLORS.mustard} />
            <div
              style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              title={b.name}
            >
              {b.name}
            </div>
          </div>
          <div style={{ fontSize: 11.5, color: COLORS.sub }}>
            {formatFileSize(b.size)} · {new Date(b.uploadedAt).toLocaleDateString()}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button onClick={() => onView(b)} style={secondaryBtn}>{t("btn_view")}</button>
            <button onClick={() => onDownload(b)} style={secondaryBtn}>{t("btn_download")}</button>
            <button onClick={() => onDelete(b.id)} style={iconBtn}>
              <Trash2 size={15} color={COLORS.coral} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- DRAFTS ---------------- */
function DraftsView({ students, attendance, scores, timetable }) {
  const { lang, t } = useLang();
  const WEEKDAYS = WEEKDAYS_FULL_BY_LANG.en;
  const WEEKDAYS_LABELS = WEEKDAYS_FULL_BY_LANG[lang];
  const recentDates = Object.keys(attendance).sort().reverse().slice(0, 7);
  return (
    <div>
      <div className="ct-aurora-banner">
        <div className="ct-aurora-blob a" />
        <div className="ct-aurora-blob b" />
        <div className="ct-aurora-blob c" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 26, fontWeight: 600 }}>{t("drafts_title")}</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>{t("drafts_sub")}</div>
        </div>
      </div>

      <Card title={t("card_recent_attendance")}>
        {recentDates.length === 0 ? <Empty text={t("empty_no_attendance")} /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead><tr><th style={thStyle}>{t("th_date")}</th><th style={thStyle}>{t("th_present")}</th><th style={thStyle}>{t("th_absent")}</th><th style={thStyle}>%</th></tr></thead>
              <tbody>
                {recentDates.map((date) => {
                  const rec = attendance[date];
                  const vals = Object.values(rec);
                  const present = vals.filter((v) => v === "present").length;
                  return (
                    <tr key={date}>
                      <td style={tdStyle}>{date}</td>
                      <td style={tdStyle}>{present}</td>
                      <td style={tdStyle}>{vals.length - present}</td>
                      <td style={tdStyle}>{vals.length ? Math.round((present / vals.length) * 100) : 0}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title={t("card_score_summary")}>
        {students.length === 0 ? <Empty text={t("empty_no_students2")} /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead><tr><th style={thStyle}>{t("th_student")}</th><th style={thStyle}>{t("th_subjects_tested")}</th><th style={thStyle}>{t("th_overall_avg")}</th></tr></thead>
              <tbody>
                {students.map((s) => {
                  const subjMap = scores[s.id] || {};
                  const allEntries = Object.values(subjMap).flat();
                  const avg = allEntries.length ? Math.round(allEntries.reduce((a, e) => a + (e.score / e.maxScore) * 100, 0) / allEntries.length) : null;
                  return (
                    <tr key={s.id}>
                      <td style={tdStyle}>{s.name}</td>
                      <td style={tdStyle}>{Object.keys(subjMap).length}</td>
                      <td style={tdStyle}>{avg === null ? "—" : `${avg}%`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title={t("card_weekly_overview")}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {WEEKDAYS.map((d, i) => (
            <div key={d} style={{ minWidth: 140, padding: 10, background: COLORS.cream, borderRadius: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{WEEKDAYS_LABELS[i]}</div>
              {(timetable[d] || []).length === 0 ? <div style={{ fontSize: 12, color: COLORS.sub }}>—</div> :
                timetable[d].map((p, idx) => <div key={idx} style={{ fontSize: 12, marginBottom: 2 }}>{p.time}: {p.subject}</div>)}
            </div>
          ))}
        </div>
      </Card>

      <ClassMessenger />
    </div>
  );
}

/* ---------------- CLASS MESSENGER (shared board on Drafts) ---------------- */
function ClassMessenger() {
  const { t } = useLang();
  const [messages, setMessages] = useSyncedState("ct_messages", []);
  const [name, setName] = useLocalState("ct_my_name", "");
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: makeId(), sender: name.trim() || "Anonymous", text: text.trim(), ts: new Date().toISOString() },
    ]);
    setText("");
  };

  return (
    <Card title={t("messenger_title")}>
      <div style={{ fontSize: 12, color: COLORS.sub, marginBottom: 12 }}>{t("messenger_sub")}</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 280, overflowY: "auto", marginBottom: 14 }}>
        {messages.length === 0 ? (
          <Empty text={t("empty_no_messages")} />
        ) : (
          messages.map((m) => (
            <div key={m.id} style={{ padding: "8px 12px", background: COLORS.cream, borderRadius: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <span style={{ fontWeight: 700, fontSize: 12.5, color: COLORS.mustard }}>{m.sender}</span>
                <span style={{ fontSize: 10.5, color: COLORS.sub }}>{new Date(m.ts).toLocaleString()}</span>
              </div>
              <div style={{ fontSize: 13, color: COLORS.ink, whiteSpace: "pre-wrap" }}>{m.text}</div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          placeholder={t("placeholder_your_name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ ...inputStyle, width: 140 }}
        />
        <input
          placeholder={t("placeholder_message")}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          style={{ ...inputStyle, flex: 1, minWidth: 160 }}
        />
        <button onClick={send} style={primaryBtn}>
          <Send size={15} /> {t("btn_send")}
        </button>
      </div>
    </Card>
  );
}

/* ---------------- SHARED UI ---------------- */
function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 26, fontWeight: 600, color: COLORS.ink }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13, color: COLORS.sub, marginTop: 3 }}>{subtitle}</div>}
    </div>
  );
}
function Card({ title, children }) {
  return (
    <div style={{ background: COLORS.paper, borderRadius: 14, border: `1px solid ${COLORS.line}`, padding: 20, marginBottom: 16 }}>
      {title && <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>{title}</div>}
      {children}
    </div>
  );
}
function StatCard({ label, value, color }) {
  return (
    <div style={{ background: COLORS.paper, border: `1px solid ${COLORS.line}`, borderRadius: 14, padding: 18 }}>
      <div style={{ fontSize: 12, color: COLORS.sub, fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 30, fontWeight: 700, color, marginTop: 4 }}>{value}</div>
    </div>
  );
}
function Empty({ text }) {
  return <div style={{ padding: "24px 10px", textAlign: "center", color: COLORS.sub, fontSize: 13 }}>{text}</div>;
}

const inputStyle = {
  padding: "9px 12px", borderRadius: 8, border: `1px solid ${COLORS.line}`, fontSize: 13.5, background: COLORS.paper, color: COLORS.ink,
};
const primaryBtn = {
  display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: "none",
  background: COLORS.mustard, color: COLORS.board, fontWeight: 700, fontSize: 13.5,
};
const secondaryBtn = {
  padding: "9px 14px", borderRadius: 8, border: `1px solid ${COLORS.sage}`, background: "transparent", color: COLORS.sage, fontWeight: 600, fontSize: 13,
};
const iconBtn = { border: "none", background: "transparent", padding: 6, borderRadius: 6, display: "flex" };
const toggleBtn = { padding: "6px 14px", borderRadius: 7, border: "1px solid", fontSize: 12.5, fontWeight: 700 };
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: 13 };
const thStyle = { textAlign: "left", padding: "8px 10px", borderBottom: `2px solid ${COLORS.line}`, color: COLORS.sub, fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.4 };
const tdStyle = { padding: "8px 10px", borderBottom: `1px solid ${COLORS.line}` };
