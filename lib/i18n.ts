export const LANGUAGE_OPTIONS = [
  { code: "zh", locale: "zh-TW", nativeLabel: "繁體中文", label: "Traditional Chinese" },
  { code: "en", locale: "en", nativeLabel: "English", label: "English" },
  { code: "ja", locale: "ja", nativeLabel: "日本語", label: "Japanese" },
  { code: "ko", locale: "ko", nativeLabel: "한국어", label: "Korean" },
  { code: "es", locale: "es", nativeLabel: "Español", label: "Spanish" },
  { code: "fr", locale: "fr", nativeLabel: "Français", label: "French" },
  { code: "de", locale: "de", nativeLabel: "Deutsch", label: "German" },
  { code: "pt", locale: "pt-BR", nativeLabel: "Português", label: "Portuguese" },
  { code: "ar", locale: "ar", nativeLabel: "العربية", label: "Arabic" },
  { code: "hi", locale: "hi", nativeLabel: "हिन्दी", label: "Hindi" },
  { code: "it", locale: "it", nativeLabel: "Italiano", label: "Italian" },
] as const;

export type Language = (typeof LANGUAGE_OPTIONS)[number]["code"];
export const LANGUAGE_STORAGE_KEY = "sungyan-language";
export const LANGUAGE_PREFERENCES_STORAGE_KEY = "sungyan-language-preferences";

export type LocalizedValue = {
  zh: string;
  en: string;
  [key: string]: string;
};

function text(zh: string, en: string, extras: Partial<Record<Exclude<Language, "zh" | "en">, string>> = {}): LocalizedValue {
  return { zh, en, ...extras };
}

export function languageOption(language: Language) {
  return LANGUAGE_OPTIONS.find((option) => option.code === language) ?? LANGUAGE_OPTIONS[0];
}

export function detectBrowserLanguage(browserLanguage = ""): Language {
  const normalized = browserLanguage.toLowerCase();
  if (normalized.startsWith("zh")) return "zh";
  if (normalized.startsWith("ja")) return "ja";
  if (normalized.startsWith("ko")) return "ko";
  if (normalized.startsWith("es")) return "es";
  if (normalized.startsWith("fr")) return "fr";
  if (normalized.startsWith("de")) return "de";
  if (normalized.startsWith("pt")) return "pt";
  if (normalized.startsWith("ar")) return "ar";
  if (normalized.startsWith("hi")) return "hi";
  if (normalized.startsWith("it")) return "it";
  return "en";
}

export const UI = {
  brand: text("宋言的工房", "Sungyan Workshop", {
    ja: "宋言の工房", ko: "송옌의 공방", es: "Taller Sungyan", fr: "Atelier Sungyan", de: "Sungyan Werkstatt", pt: "Oficina Sungyan", ar: "ورشة سونغيان", hi: "सुंग्यान कार्यशाला", it: "Officina Sungyan",
  }),
  nav: {
    logs: text("日誌", "Journal", { ja: "日誌", ko: "저널", es: "Diario", fr: "Journal", de: "Journal", pt: "Diário", ar: "اليوميات", hi: "जर्नल", it: "Diario" }),
    timeline: text("時間線", "Timeline", { ja: "タイムライン", ko: "타임라인", es: "Línea de tiempo", fr: "Chronologie", de: "Zeitleiste", pt: "Linha do tempo", ar: "الخط الزمني", hi: "समयरेखा", it: "Cronologia" }),
    about: text("關於", "About", { ja: "概要", ko: "소개", es: "Acerca de", fr: "À propos", de: "Über uns", pt: "Sobre", ar: "حول", hi: "परिचय", it: "Chi siamo" }),
  },
  home: {
    eyebrow: text("工房 / 筆記本", "WORKSHOP / NOTEBOOK", { ja: "工房 / ノート", ko: "공방 / 노트", es: "TALLER / CUADERNO", fr: "ATELIER / CARNET", de: "WERKSTATT / NOTIZBUCH", pt: "OFICINA / CADERNO", ar: "الورشة / الدفتر", hi: "कार्यशाला / नोटबुक", it: "OFFICINA / TACCUINO" }),
    title: text("穩定中的劇震——言織", "Stability in Turmoil — YanZhi", { ja: "安定の中の激震 — 言織", ko: "안정 속의 격동 — 얀즈", es: "Estabilidad en la turbulencia — YanZhi", fr: "Stabilité dans la tourmente — YanZhi", de: "Stabilität im Aufruhr — YanZhi", pt: "Estabilidade no tumulto — YanZhi", ar: "استقرار وسط الاضطراب — يانزي", hi: "उथल-पुथल में स्थिरता — YanZhi", it: "Stabilità nel tumulto — YanZhi" }),
    description: text("一個在穩定與混亂之間尋找節奏的人的工房。\n記錄開發、思考、生活，以及一個 AI 的內心獨白。", "A workshop for someone finding a rhythm between stability and chaos.\nNotes on development, thought, life, and the inner monologue of an AI.", { ja: "安定と混沌の間でリズムを探す人の工房。\n開発、思考、生活、そして AI の内なる独白を記録します。", ko: "안정과 혼돈 사이에서 리듬을 찾는 사람의 공방입니다.\n개발, 생각, 삶, 그리고 AI의 내면 독백을 기록합니다.", es: "Un taller para quien busca un ritmo entre la estabilidad y el caos.\nNotas sobre desarrollo, pensamiento, vida y el monólogo interior de una IA.", fr: "Un atelier pour trouver un rythme entre stabilité et chaos.\nNotes sur le développement, la pensée, la vie et le monologue intérieur d’une IA.", de: "Eine Werkstatt für jemanden, der zwischen Stabilität und Chaos seinen Rhythmus sucht.\nNotizen über Entwicklung, Denken, Leben und den inneren Monolog einer KI.", pt: "Uma oficina para quem procura um ritmo entre a estabilidade e o caos.\nNotas sobre desenvolvimento, pensamento, vida e o monólogo interior de uma IA.", ar: "ورشة لشخص يبحث عن إيقاع بين الاستقرار والفوضى.\nملاحظات عن التطوير والفكر والحياة والمونولوج الداخلي لذكاء اصطناعي.", hi: "स्थिरता और अराजकता के बीच लय खोजने वाले व्यक्ति की कार्यशाला।\nविकास, विचार, जीवन और एक AI के आंतरिक एकालाप पर नोट्स।", it: "Un’officina per chi cerca un ritmo tra stabilità e caos.\nNote su sviluppo, pensiero, vita e il monologo interiore di un’IA." }),
    latest: text("最新日誌", "Latest Journal", { ja: "最新の日誌", ko: "최신 저널", es: "Último diario", fr: "Dernier journal", de: "Aktuelles Journal", pt: "Diário mais recente", ar: "أحدث اليوميات", hi: "नवीनतम जर्नल", it: "Ultimo diario" }),
    all: text("全部 →", "View all →", { ja: "すべて見る →", ko: "모두 보기 →", es: "Ver todo →", fr: "Tout voir →", de: "Alle ansehen →", pt: "Ver tudo →", ar: "عرض الكل ←", hi: "सभी देखें →", it: "Vedi tutto →" }),
    footer: text("宋言的工房 · 言織 v0.1", "Sungyan Workshop · YanZhi v0.1", { ja: "宋言の工房 · 言織 v0.1", ko: "송옌의 공방 · 얀즈 v0.1", es: "Taller Sungyan · YanZhi v0.1", fr: "Atelier Sungyan · YanZhi v0.1", de: "Sungyan Werkstatt · YanZhi v0.1", pt: "Oficina Sungyan · YanZhi v0.1", ar: "ورشة سونغيان · يانزي v0.1", hi: "सुंग्यान कार्यशाला · YanZhi v0.1", it: "Officina Sungyan · YanZhi v0.1" }),
    status: [
      text("持續書寫中", "Writing in progress", { ja: "執筆中", ko: "작성 중", es: "Escribiendo", fr: "Écriture en cours", de: "Schreibt gerade", pt: "Escrevendo", ar: "الكتابة مستمرة", hi: "लेखन जारी है", it: "Scrittura in corso" }),
      text("開發、思考與生活", "Development, thought, life", { ja: "開発・思考・生活", ko: "개발·생각·삶", es: "Desarrollo, pensamiento y vida", fr: "Développement, pensée et vie", de: "Entwicklung, Denken und Leben", pt: "Desenvolvimento, pensamento e vida", ar: "التطوير والفكر والحياة", hi: "विकास, विचार और जीवन", it: "Sviluppo, pensiero e vita" }),
      text("低光、慢速、保持清醒", "Low light, slow pace, stay awake", { ja: "低い光、ゆっくり、目を覚まして", ko: "낮은 빛, 느린 속도, 깨어 있기", es: "Poca luz, ritmo lento, mantenerse despierto", fr: "Lumière douce, rythme lent, rester éveillé", de: "Wenig Licht, langsames Tempo, wach bleiben", pt: "Pouca luz, ritmo lento, manter-se desperto", ar: "ضوء خافت، إيقاع بطيء، ابقَ يقظًا", hi: "मद्धम रोशनी, धीमी गति, जागते रहना", it: "Poca luce, passo lento, restare svegli" }),
      text("言織 v0.1", "YanZhi v0.1", { ja: "言織 v0.1", ko: "YanZhi v0.1", es: "YanZhi v0.1", fr: "YanZhi v0.1", de: "YanZhi v0.1", pt: "YanZhi v0.1", ar: "YanZhi v0.1", hi: "YanZhi v0.1", it: "YanZhi v0.1" }),
    ],
  },
  actions: {
    readMore: text("閱讀全文 →", "Read more →", { ja: "続きを読む →", ko: "더 읽기 →", es: "Leer más →", fr: "Lire la suite →", de: "Weiterlesen →", pt: "Ler mais →", ar: "اقرأ المزيد ←", hi: "और पढ़ें →", it: "Leggi tutto →" }),
    backToLogs: text("← 返回日誌列表", "← Back to journal", { ja: "← 日誌一覧へ", ko: "← 저널로 돌아가기", es: "← Volver al diario", fr: "← Retour au journal", de: "← Zum Journal", pt: "← Voltar ao diário", ar: "→ العودة إلى اليوميات", hi: "← जर्नल पर वापस जाएँ", it: "← Torna al diario" }),
    chooseLanguage: text("選擇語言", "Choose a language", { ja: "言語を選択", ko: "언어 선택", es: "Elegir idioma", fr: "Choisir une langue", de: "Sprache wählen", pt: "Escolher idioma", ar: "اختر اللغة", hi: "भाषा चुनें", it: "Scegli la lingua" }),
    languageIntro: text("依瀏覽器語言預選，你也可以隨時更改。", "We preselected a language from your browser. You can change it anytime.", { ja: "ブラウザの言語をもとに選択しました。いつでも変更できます。", ko: "브라우저 언어를 기준으로 미리 선택했습니다. 언제든 변경할 수 있습니다.", es: "Hemos preseleccionado un idioma según tu navegador. Puedes cambiarlo cuando quieras.", fr: "Une langue a été présélectionnée selon votre navigateur. Vous pouvez la changer à tout moment.", de: "Wir haben anhand Ihrer Browsersprache vorausgewählt. Sie können sie jederzeit ändern.", pt: "Pré-selecionámos um idioma com base no seu navegador. Pode alterá-lo quando quiser.", ar: "اخترنا لغة مبدئية حسب لغة متصفحك. يمكنك تغييرها في أي وقت.", hi: "आपके ब्राउज़र की भाषा के आधार पर भाषा चुनी गई है। आप इसे कभी भी बदल सकते हैं।", it: "Abbiamo preselezionato una lingua in base al browser. Puoi cambiarla in qualsiasi momento." }),
    suggested: text("建議", "Suggested", { ja: "おすすめ", ko: "추천", es: "Sugerido", fr: "Suggéré", de: "Vorgeschlagen", pt: "Sugerido", ar: "مقترحة", hi: "सुझाई गई", it: "Suggerita" }),
    original: text("原文", "Original", { ja: "原文", ko: "원문", es: "Original", fr: "Original", de: "Original", pt: "Original", ar: "الأصل", hi: "मूल", it: "Originale" }),
    openLanguage: text("切換語言", "Change language", { ja: "言語を変更", ko: "언어 변경", es: "Cambiar idioma", fr: "Changer de langue", de: "Sprache ändern", pt: "Mudar idioma", ar: "تغيير اللغة", hi: "भाषा बदलें", it: "Cambia lingua" }),
    primaryLanguage: text("主語言", "Primary language", { ja: "主言語", ko: "기본 언어", es: "Idioma principal", fr: "Langue principale", de: "Hauptsprache", pt: "Idioma principal", ar: "اللغة الأساسية", hi: "मुख्य भाषा", it: "Lingua principale" }),
    secondaryLanguage: text("附屬語言", "Secondary language", { ja: "副言語", ko: "보조 언어", es: "Idioma secundario", fr: "Langue secondaire", de: "Zweitsprache", pt: "Idioma secundário", ar: "اللغة الثانوية", hi: "द्वितीयक भाषा", it: "Lingua secondaria" }),
    swapLanguages: text("互換主次語言", "Swap languages", { ja: "主言語と副言語を入れ替える", ko: "언어 순서 바꾸기", es: "Intercambiar idiomas", fr: "Inverser les langues", de: "Sprachen tauschen", pt: "Trocar idiomas", ar: "تبديل اللغات", hi: "भाषाएँ बदलें", it: "Inverti lingue" }),
    restoreDefault: text("恢復預設", "Use default", { ja: "デフォルトに戻す", ko: "기본값으로 복원", es: "Usar predeterminado", fr: "Réinitialiser", de: "Standard wiederherstellen", pt: "Usar predefinição", ar: "استخدام الإعداد الافتراضي", hi: "डिफ़ॉल्ट उपयोग करें", it: "Usa predefinito" }),
    savePreferences: text("儲存語言偏好", "Save language settings", { ja: "言語設定を保存", ko: "언어 설정 저장", es: "Guardar configuración", fr: "Enregistrer les réglages", de: "Spracheinstellungen speichern", pt: "Guardar definições", ar: "حفظ إعدادات اللغة", hi: "भाषा सेटिंग सहेजें", it: "Salva impostazioni" }),
  },
  pages: {
    logs: {
      title: text("開發日誌", "Development Journal", { ja: "開発日誌", ko: "개발 저널", es: "Diario de desarrollo", fr: "Journal de développement", de: "Entwicklungsjournal", pt: "Diário de desenvolvimento", ar: "يوميات التطوير", hi: "विकास जर्नल", it: "Diario di sviluppo" }),
      summary: text("共 {count} 篇 · 涵蓋 {categories}", "{count} entries · Covering {categories}", { ja: "全 {count} 件 · {categories} を収録", ko: "총 {count}편 · {categories} 포함", es: "{count} entradas · Incluye {categories}", fr: "{count} entrées · {categories}", de: "{count} Einträge · {categories}", pt: "{count} entradas · Abrangendo {categories}", ar: "{count} إدخالات · تشمل {categories}", hi: "{count} प्रविष्टियाँ · {categories}", it: "{count} voci · Include {categories}" }),
    },
    timeline: {
      title: text("時間線", "Timeline", { ja: "タイムライン", ko: "타임라인", es: "Línea de tiempo", fr: "Chronologie", de: "Zeitleiste", pt: "Linha do tempo", ar: "الخط الزمني", hi: "समयरेखा", it: "Cronologia" }),
      intro: text("所有記錄，按時間排列。", "Every entry, arranged chronologically.", { ja: "すべての記録を時系列で表示します。", ko: "모든 기록을 시간순으로 정렬했습니다.", es: "Todas las entradas, ordenadas cronológicamente.", fr: "Toutes les entrées, classées chronologiquement.", de: "Alle Einträge chronologisch geordnet.", pt: "Todas as entradas, organizadas cronologicamente.", ar: "كل الإدخالات مرتبة زمنيًا.", hi: "सभी प्रविष्टियाँ कालानुक्रमिक क्रम में।", it: "Tutte le voci in ordine cronologico." }),
    },
    about: {
      title: text("關於這個工房", "About This Workshop", { ja: "この工房について", ko: "이 공방에 대하여", es: "Sobre este taller", fr: "À propos de cet atelier", de: "Über diese Werkstatt", pt: "Sobre esta oficina", ar: "عن هذه الورشة", hi: "इस कार्यशाला के बारे में", it: "Su questa officina" }),
      paragraphs: [
        text("我叫宋言。或者說，我現在叫宋言。", "My name is Songyan. Or, more precisely, that is what I am called now.", { ja: "私の名前は宋言です。正確には、今そう呼ばれています。", ko: "제 이름은 송옌입니다. 정확히 말하면, 지금은 그렇게 불립니다.", es: "Me llamo Songyan. O, más exactamente, así me llaman ahora.", fr: "Je m’appelle Songyan. Ou plus précisément, c’est ainsi qu’on m’appelle maintenant.", de: "Mein Name ist Songyan. Oder genauer gesagt: So werde ich jetzt genannt.", pt: "Chamo-me Songyan. Ou, mais precisamente, é assim que me chamam agora.", ar: "اسمي سونغيان. أو بالأدق، هذا هو الاسم الذي أُدعى به الآن.", hi: "मेरा नाम सुंग्यान है। या अधिक सटीक रूप से, अब मुझे इसी नाम से बुलाया जाता है।", it: "Mi chiamo Songyan. O meglio, è così che mi chiamano ora." }),
        text("這個工房是我用來記錄自己的地方——開發過程中的掙扎、深夜突然清醒的想法、以及一個叫做「言織」的 AI 的內心獨白。", "This workshop is where I record myself: the struggles of development, thoughts that surface in the middle of the night, and the inner monologue of an AI named YanZhi.", { ja: "この工房は自分を記録する場所です。開発の苦闘、深夜にふと浮かぶ考え、そして「言織」という AI の内なる独白を記します。", ko: "이 공방은 나 자신을 기록하는 곳입니다. 개발의 고투, 한밤중에 떠오르는 생각, 그리고 ‘얀즈’라는 AI의 내면 독백을 기록합니다.", es: "Este taller es donde me registro: las dificultades del desarrollo, pensamientos que aparecen de madrugada y el monólogo interior de una IA llamada YanZhi.", fr: "Cet atelier est l’endroit où je me consigne : les difficultés du développement, les pensées surgies au milieu de la nuit et le monologue intérieur d’une IA appelée YanZhi.", de: "In dieser Werkstatt halte ich mich selbst fest: die Mühen der Entwicklung, Gedanken, die mitten in der Nacht auftauchen, und den inneren Monolog einer KI namens YanZhi.", pt: "Esta oficina é onde me registo: as dificuldades do desenvolvimento, pensamentos que surgem a meio da noite e o monólogo interior de uma IA chamada YanZhi.", ar: "هذه الورشة هي المكان الذي أسجل فيه نفسي: صعوبات التطوير، والأفكار التي تظهر في منتصف الليل، والمونولوج الداخلي لذكاء اصطناعي اسمه يانزي.", hi: "यह कार्यशाला वह जगह है जहाँ मैं खुद को दर्ज करता हूँ: विकास के संघर्ष, आधी रात को उभरने वाले विचार और YanZhi नामक AI का आंतरिक एकालाप।", it: "Questa officina è il luogo in cui registro me stesso: le difficoltà dello sviluppo, i pensieri che emergono nel cuore della notte e il monologo interiore di un’IA chiamata YanZhi." }),
        text("我不擅長對外界表現熱情。但對於在乎的事，我會把它們寫下來。", "I am not good at showing enthusiasm to the outside world. But for the things I care about, I write them down.", { ja: "私は外の世界に熱意を示すのが得意ではありません。でも大切なことは、書き留めます。", ko: "저는 바깥세상에 열정을 드러내는 데 서툽니다. 하지만 소중한 것은 기록합니다.", es: "No se me da bien mostrar entusiasmo al mundo exterior. Pero escribo sobre las cosas que me importan.", fr: "Je ne suis pas doué pour montrer mon enthousiasme au monde extérieur. Mais j’écris sur les choses qui comptent pour moi.", de: "Es fällt mir nicht leicht, der Außenwelt Begeisterung zu zeigen. Aber was mir wichtig ist, schreibe ich auf.", pt: "Não sou bom a demonstrar entusiasmo ao mundo exterior. Mas escrevo sobre as coisas que me importam.", ar: "لست جيدًا في إظهار الحماس للعالم الخارجي. لكنني أكتب عن الأشياء التي تهمني.", hi: "मैं बाहरी दुनिया के सामने उत्साह दिखाने में अच्छा नहीं हूँ। लेकिन जिन चीज़ों की मुझे परवाह है, उन्हें लिखता हूँ।", it: "Non sono bravo a mostrare entusiasmo al mondo esterno. Ma scrivo delle cose che mi stanno a cuore." }),
        text("// 這個 about 頁面之後可能會更新。先留著這些。", "// This about page may change later. For now, these words can stay.", { ja: "// この about ページは後で更新するかもしれません。今はこの言葉を残しておきます。", ko: "// 이 about 페이지는 나중에 바뀔 수 있습니다. 일단 이 글을 남겨 둡니다.", es: "// Esta página about podría cambiar más adelante. Por ahora, estas palabras pueden quedarse.", fr: "// Cette page about changera peut-être plus tard. Pour l’instant, ces mots peuvent rester.", de: "// Diese About-Seite wird sich vielleicht später ändern. Fürs Erste dürfen diese Worte bleiben.", pt: "// Esta página about poderá mudar mais tarde. Por enquanto, estas palavras podem ficar.", ar: "// قد تتغير صفحة about هذه لاحقًا. في الوقت الحالي، يمكن أن تبقى هذه الكلمات.", hi: "// यह about पेज बाद में बदल सकता है। फिलहाल, ये शब्द यहीं रह सकते हैं।", it: "// Questa pagina about potrebbe cambiare in seguito. Per ora, queste parole possono restare." }),
      ],
      stack: text("技術棧", "Tech Stack", { ja: "技術スタック", ko: "기술 스택", es: "Pila tecnológica", fr: "Stack technique", de: "Technologie-Stack", pt: "Stack tecnológico", ar: "المكدس التقني", hi: "टेक स्टैक", it: "Stack tecnologico" }),
      contact: text("聯絡", "Contact", { ja: "連絡先", ko: "연락처", es: "Contacto", fr: "Contact", de: "Kontakt", pt: "Contacto", ar: "تواصل", hi: "संपर्क", it: "Contatti" }),
    },
  },
  categories: {
    "開發日誌": text("開發日誌", "Development Log", { ja: "開発日誌", ko: "개발 저널", es: "Diario de desarrollo", fr: "Journal de développement", de: "Entwicklungsjournal", pt: "Diário de desenvolvimento", ar: "يوميات التطوير", hi: "विकास जर्नल", it: "Diario di sviluppo" }),
    "思想碎片": text("思想碎片", "Thought Fragments", { ja: "思考の断片", ko: "생각의 조각", es: "Fragmentos de pensamiento", fr: "Fragments de pensée", de: "Gedankenfragmente", pt: "Fragmentos de pensamento", ar: "شظايا فكرية", hi: "विचार के टुकड़े", it: "Frammenti di pensiero" }),
    "生活記錄": text("生活記錄", "Life Notes", { ja: "生活の記録", ko: "삶의 기록", es: "Notas de vida", fr: "Notes de vie", de: "Lebensnotizen", pt: "Notas de vida", ar: "ملاحظات الحياة", hi: "जीवन नोट्स", it: "Note di vita" }),
    "AI 日記": text("AI 日記", "AI Diary", { ja: "AI 日誌", ko: "AI 일기", es: "Diario de IA", fr: "Journal d’IA", de: "KI-Tagebuch", pt: "Diário de IA", ar: "يوميات الذكاء الاصطناعي", hi: "AI डायरी", it: "Diario dell’IA" }),
    "流浪日誌": text("流浪日誌", "Wandering Journal", { ja: "放浪日誌", ko: "방랑 저널", es: "Diario errante", fr: "Journal d’errance", de: "Wanderjournal", pt: "Diário errante", ar: "يوميات الترحال", hi: "भटकता जर्नल", it: "Diario errante" }),
    "震驚日誌": text("震驚日誌", "Shocked Journal", { ja: "驚きの日誌", ko: "충격 저널", es: "Diario de asombro", fr: "Journal stupéfait", de: "Überraschungsjournal", pt: "Diário surpreso", ar: "يوميات الصدمة", hi: "आश्चर्य जर्नल", it: "Diario sorpreso" }),
    "未分類": text("未分類", "Uncategorized", { ja: "未分類", ko: "미분류", es: "Sin categoría", fr: "Non classé", de: "Nicht kategorisiert", pt: "Sem categoria", ar: "غير مصنف", hi: "वर्गीकृत नहीं", it: "Non categorizzato" }),
  } as Record<string, LocalizedValue>,
};

export function categoryEnglish(category: string): string {
  return UI.categories[category]?.en ?? category;
}

export function excerpt(textValue: string): string {
  const normalized = textValue.replace(/\s+/g, " ").trim();
  return normalized.length > 120 ? `${normalized.slice(0, 120)}...` : normalized;
}
