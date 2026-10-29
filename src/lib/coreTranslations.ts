// Core interface translations for the 16 languages beyond en/fr/ar.
// These are merged over the English base at load time (see i18n.ts).
// Coverage: navigation, common actions, and loading/error states.
// Chat, voice, and PDF strings continue to work in every language through
// the AI/voice layer; undisclosed gaps fall back to English (disclosed in
// the language picker).

import type { Language } from '@/types';

export interface CorePartial {
  nav?: Partial<Record<string, string>>;
  common?: Partial<Record<string, string>>;
  states?: Partial<Record<string, string>>;
  sidebar?: Partial<Record<string, string>>;
  accessible?: Partial<Record<string, string>>;
  auth?: Partial<Record<string, string>>;
  dashboard?: Partial<Record<string, string>>;
  recordCard?: Partial<Record<string, string>>;
  resistance?: Partial<Record<string, string>>;
  curemap?: Partial<Record<string, string>>;
  equity?: Partial<Record<string, string>>;
  discovery?: Partial<Record<string, string>>;
  planner?: Partial<Record<string, string>>;
  assistant?: Partial<Record<string, string>>;
  biomarkers?: Partial<Record<string, string>>;
  anatomy?: Partial<Record<string, string>> & { systemLabels?: Record<string, string> };
  burden?: Partial<Record<string, string>>;
}

export const coreTranslations: Partial<Record<Language, CorePartial>> = {
  es: {
    nav: {
      dashboard: 'Panel', discovery: 'Descubrimiento de Fármacos', curemap: 'Búsqueda de Literatura',
      resistance: 'Resistencia a Tratamientos', equity: 'Equidad en el Cáncer', burden: 'Estadísticas del Cáncer',
      biomarkers: 'Biomarcadores', anatomy: 'Tipos y Biología del Cáncer', companion: 'Chat Acompañante',
      planner: 'Planificador de Investigación', assistant: 'Asistente de Investigación IA', pdf: 'Lector de PDF',
      library: 'Artículos y Notas Guardados', methodology: 'Métodos de Investigación', account: 'Cuenta',
      modules: 'Módulos de Investigación',
    },
    common: {
      search: 'Buscar', loading: 'Buscando bases de datos de investigación reales…',
      skipToContent: 'Saltar al contenido principal',
      loadingHint: 'Esto puede tardar unos segundos', errorTitle: 'Algo salió mal',
      errorMessage: 'Ocurrió un error al obtener los datos. Inténtalo de nuevo.', retry: 'Reintentar',
      emptyTitle: 'Sin resultados todavía',
      emptyMessage: 'Introduce términos de búsqueda arriba para recuperar registros de investigación reales.',
      view: 'Ver', copied: '¡Copiado!', copy: 'Copiar', saved: '¡Guardado!', download: 'Descargar',
      clearAll: 'Borrar todo', examples: 'Ejemplos:', onePerLine: '(uno por línea)',
      errorBoundaryMessage: 'La página encontró un error inesperado. Tus datos guardados están a salvo. Puedes recargar o volver al panel.',
      reloadApp: 'Recargar la aplicación', backToDashboard: 'Volver al panel',
    },
    states: {
      loadingDefault: 'Cargando datos reales…', loadingHint: 'Consultando fuentes de investigación públicas',
      errorTitle: 'No se pudieron cargar los datos',
      errorMessage: 'Las fuentes de investigación no respondieron. Comprueba tu conexión e inténtalo de nuevo.',
      retry: 'Reintentar', emptyTitle: 'Nada aquí todavía', emptyMessage: 'Los resultados de búsqueda aparecerán aquí.',
    },
    sidebar: {
      openMenu: 'Abrir menú de navegación', closeMenu: 'Cerrar menú de navegación',
      signIn: 'Iniciar sesión / Crear cuenta', signOut: 'Cerrar sesión', disclaimer: 'Aviso legal',
    },
    accessible: {
      languageTitle: 'Idioma', interfaceLanguages: 'Idiomas de la interfaz',
      interfaceNote: 'Interfaz completamente traducida', moreLanguages: 'Más idiomas',
      aiNote: 'El chat con IA funciona en este idioma; la recuperación de evidencia está indexada en inglés.',
      limitedVoice: 'Reconocimiento o síntesis de voz limitados en este dispositivo.',
    },
    auth: {
      signIn: 'Iniciar sesión', createAccount: 'Crear cuenta', email: 'Correo electrónico',
      password: 'Contraseña', guest: 'Continuar como invitado',
    },
    dashboard: {
      badge: 'Inteligencia de Investigación Pan-Cancer', askAssistant: 'Preguntar al Asistente de Investigación',
    },
    recordCard: {
      clinicalTrial: 'Ensayo clínico', publication: 'Publicación', free: 'Gratuito',
      showAbstract: 'Mostrar resumen', select: 'Seleccionar',
    },
  },
  de: {
    nav: {
      dashboard: 'Übersicht', discovery: 'Arzneimittelforschung', curemap: 'Literatursuche',
      resistance: 'Therapieresistenz', equity: 'Chancengleichheit bei Krebs', burden: 'Krebsstatistiken',
      biomarkers: 'Biomarker', anatomy: 'Krebsarten & Biologie', companion: 'Begleit-Chat',
      planner: 'Forschungsplaner', assistant: 'KI-Forschungsassistent', pdf: 'PDF-Reader',
      library: 'Gespeicherte Arbeiten & Notizen', methodology: 'Forschungsmethoden', account: 'Konto',
      modules: 'Forschungsmodule',
    },
    common: {
      search: 'Suchen', loading: 'Durchsuche echte Forschungsdatenbanken…',
      skipToContent: 'Zum Hauptinhalt springen',
      loadingHint: 'Dies kann einige Sekunden dauern', errorTitle: 'Etwas ist schiefgelaufen',
      errorMessage: 'Beim Abrufen der Daten ist ein Fehler aufgetreten. Bitte versuche es erneut.',
      retry: 'Erneut versuchen', emptyTitle: 'Noch keine Ergebnisse',
      emptyMessage: 'Gib oben Suchbegriffe ein, um echte Forschungsdaten abzurufen.',
      view: 'Anzeigen', copied: 'Kopiert!', copy: 'Kopieren', saved: 'Gespeichert!', download: 'Herunterladen',
      clearAll: 'Alles löschen', examples: 'Beispiele:', onePerLine: '(einer pro Zeile)',
      errorBoundaryMessage: 'Die Seite hat einen unerwarteten Fehler festgestellt. Deine gespeicherten Daten sind sicher. Du kannst neu laden oder zur Übersicht zurückkehren.',
      reloadApp: 'App neu laden', backToDashboard: 'Zurück zur Übersicht',
    },
    states: {
      loadingDefault: 'Echte Daten werden geladen…', loadingHint: 'Öffentliche Forschungsquellen werden abgefragt',
      errorTitle: 'Daten konnten nicht geladen werden',
      errorMessage: 'Die Forschungsquellen haben nicht geantwortet. Prüfe deine Verbindung und versuche es erneut.',
      retry: 'Erneut versuchen', emptyTitle: 'Noch nichts hier', emptyMessage: 'Suchergebnisse erscheinen hier.',
    },
    sidebar: {
      openMenu: 'Navigationsmenü öffnen', closeMenu: 'Navigationsmenü schließen',
      signIn: 'Anmelden / Konto erstellen', signOut: 'Abmelden', disclaimer: 'Haftungsausschluss',
    },
    accessible: {
      languageTitle: 'Sprache', interfaceLanguages: 'Sprachen der Benutzeroberfläche',
      interfaceNote: 'Vollständig übersetzte Oberfläche', moreLanguages: 'Weitere Sprachen',
      aiNote: 'Der KI-Chat funktioniert in dieser Sprache; die Literatursuche ist auf Englisch indexiert.',
      limitedVoice: 'Spracherkennung oder Sprachausgabe auf diesem Gerät eingeschränkt.',
    },
    auth: {
      signIn: 'Anmelden', createAccount: 'Konto erstellen', email: 'E-Mail',
      password: 'Passwort', guest: 'Als Gast fortfahren',
    },
    dashboard: {
      badge: 'Pan-Krebs-Forschungsintelligenz', askAssistant: 'Den Forschungsassistenten fragen',
    },
    recordCard: {
      clinicalTrial: 'Klinische Studie', publication: 'Publikation', free: 'Kostenlos',
      showAbstract: 'Abstract anzeigen', select: 'Auswählen',
    },
  },
  pt: {
    nav: {
      dashboard: 'Painel', discovery: 'Pesquisa de Fármacos', curemap: 'Busca de Literatura',
      resistance: 'Resistência a Tratamentos', equity: 'Equidade no Câncer', burden: 'Estatísticas do Câncer',
      biomarkers: 'Biomarcadores', anatomy: 'Tipos e Biologia do Câncer', companion: 'Chat Acompanhante',
      planner: 'Planejador de Pesquisa', assistant: 'Assistente de Pesquisa com IA', pdf: 'Leitor de PDF',
      library: 'Trabalhos e Notas Salvos', methodology: 'Métodos de Pesquisa', account: 'Conta',
      modules: 'Módulos de Pesquisa',
    },
    common: {
      search: 'Buscar', loading: 'Pesquisando bancos de dados reais de pesquisa…',
      skipToContent: 'Ir para o conteúdo principal',
      loadingHint: 'Isso pode levar alguns segundos', errorTitle: 'Algo deu errado',
      errorMessage: 'Ocorreu um erro ao buscar os dados. Tente novamente.', retry: 'Tentar novamente',
      emptyTitle: 'Ainda sem resultados',
      emptyMessage: 'Digite termos de pesquisa acima para recuperar registros reais de pesquisa.',
      view: 'Ver', copied: 'Copiado!', copy: 'Copiar', saved: 'Salvo!', download: 'Baixar',
      clearAll: 'Limpar tudo', examples: 'Exemplos:', onePerLine: '(um por linha)',
      errorBoundaryMessage: 'A página encontrou um erro inesperado. Seus dados salvos estão seguros. Você pode recarregar ou voltar ao painel.',
      reloadApp: 'Recarregar o aplicativo', backToDashboard: 'Voltar ao painel',
    },
    states: {
      loadingDefault: 'Carregando dados reais…', loadingHint: 'Consultando fontes públicas de pesquisa',
      errorTitle: 'Não foi possível carregar os dados',
      errorMessage: 'As fontes de pesquisa não responderam. Verifique sua conexão e tente novamente.',
      retry: 'Tentar novamente', emptyTitle: 'Nada aqui ainda', emptyMessage: 'Os resultados da pesquisa aparecerão aqui.',
    },
    sidebar: {
      openMenu: 'Abrir menu de navegação', closeMenu: 'Fechar menu de navegação',
      signIn: 'Entrar / Criar conta', signOut: 'Sair', disclaimer: 'Aviso legal',
    },
    accessible: {
      languageTitle: 'Idioma', interfaceLanguages: 'Idiomas da interface',
      interfaceNote: 'Interface totalmente traduzida', moreLanguages: 'Mais idiomas',
      aiNote: 'O chat com IA funciona neste idioma; a busca de evidências é indexada em inglês.',
      limitedVoice: 'Reconhecimento ou síntese de voz limitados neste dispositivo.',
    },
    auth: {
      signIn: 'Entrar', createAccount: 'Criar conta', email: 'E-mail',
      password: 'Senha', guest: 'Continuar como visitante',
    },
    dashboard: {
      badge: 'Inteligência de Pesquisa Pan-Cancer', askAssistant: 'Perguntar ao Assistente de Pesquisa',
    },
    recordCard: {
      clinicalTrial: 'Ensaio clínico', publication: 'Publicação', free: 'Gratuito',
      showAbstract: 'Mostrar resumo', select: 'Selecionar',
    },
  },
  it: {
    nav: {
      dashboard: 'Pannello', discovery: 'Ricerca di Farmaci', curemap: 'Ricerca in Letteratura',
      resistance: 'Resistenza ai Trattamenti', equity: 'Equità nel Cancro', burden: 'Statistiche sul Cancro',
      biomarkers: 'Biomarcatori', anatomy: 'Tipi e Biologia del Cancro', companion: 'Chat Accompagnante',
      planner: 'Pianificatore di Ricerca', assistant: 'Assistente di Ricerca IA', pdf: 'Lettore PDF',
      library: 'Articoli e Note Salvati', methodology: 'Metodi di Ricerca', account: 'Account',
      modules: 'Moduli di Ricerca',
    },
    common: {
      search: 'Cerca', loading: 'Ricerca nei database di ricerca reali…',
      skipToContent: 'Vai al contenuto principale',
      loadingHint: 'Potrebbe richiedere alcuni secondi', errorTitle: 'Qualcosa è andato storto',
      errorMessage: 'Si è verificato un errore durante il recupero dei dati. Riprova.', retry: 'Riprova',
      emptyTitle: 'Ancora nessun risultato',
      emptyMessage: 'Inserisci sopra i termini di ricerca per recuperare dati di ricerca reali.',
      view: 'Vedi', copied: 'Copiato!', copy: 'Copia', saved: 'Salvato!', download: 'Scarica',
      clearAll: 'Cancella tutto', examples: 'Esempi:', onePerLine: '(uno per riga)',
      errorBoundaryMessage: 'La pagina ha riscontrato un errore imprevisto. I tuoi dati salvati sono al sicuro. Puoi ricaricare o tornare al pannello.',
      reloadApp: 'Ricarica l’app', backToDashboard: 'Torna al pannello',
    },
    states: {
      loadingDefault: 'Caricamento dati reali…', loadingHint: 'Interrogazione di fonti di ricerca pubbliche',
      errorTitle: 'Impossibile caricare i dati',
      errorMessage: 'Le fonti di ricerca non hanno risposto. Controlla la connessione e riprova.',
      retry: 'Riprova', emptyTitle: 'Ancora niente qui', emptyMessage: 'I risultati della ricerca appariranno qui.',
    },
    sidebar: {
      openMenu: 'Apri menu di navigazione', closeMenu: 'Chiudi menu di navigazione',
      signIn: 'Accedi / Crea account', signOut: 'Esci', disclaimer: 'Dichiarazione',
    },
    accessible: {
      languageTitle: 'Lingua', interfaceLanguages: 'Lingue dell’interfaccia',
      interfaceNote: 'Interfaccia completamente tradotta', moreLanguages: 'Altre lingue',
      aiNote: 'La chat IA funziona in questa lingua; il recupero delle prove è indicizzato in inglese.',
      limitedVoice: 'Riconoscimento o sintesi vocale limitati su questo dispositivo.',
    },
    auth: {
      signIn: 'Accedi', createAccount: 'Crea account', email: 'Email',
      password: 'Password', guest: 'Continua come ospite',
    },
    dashboard: {
      badge: 'Intelligence di Ricerca Pan-Cancro', askAssistant: 'Chiedi all’Assistente di Ricerca',
    },
    recordCard: {
      clinicalTrial: 'Studio clinico', publication: 'Pubblicazione', free: 'Gratuito',
      showAbstract: 'Mostra abstract', select: 'Seleziona',
    },
  },
  tr: {
    nav: {
      dashboard: 'Panel', discovery: 'İlaç Keşfi', curemap: 'Literatür Arama',
      resistance: 'Tedavi Direnci', equity: 'Kanser Eşitliği', burden: 'Kanser İstatistikleri',
      biomarkers: 'Biyobelirteçler', anatomy: 'Kanser Türleri ve Biyolojisi', companion: 'Refakatçi Sohbet',
      planner: 'Araştırma Planlayıcı', assistant: 'Yapay Zeka Araştırma Asistanı', pdf: 'PDF Okuyucu',
      library: 'Kaydedilen Makaleler ve Notlar', methodology: 'Araştırma Yöntemleri', account: 'Hesap',
      modules: 'Araştırma Modülleri',
    },
    common: {
      search: 'Ara', loading: 'Gerçek araştırma veritabanları aranıyor…',
      skipToContent: 'Ana içeriğe geç',
      loadingHint: 'Bu birkaç saniye sürebilir', errorTitle: 'Bir şeyler ters gitti',
      errorMessage: 'Veriler alınırken bir hata oluştu. Lütfen tekrar deneyin.', retry: 'Tekrar dene',
      emptyTitle: 'Henüz sonuç yok',
      emptyMessage: 'Gerçek araştırma kayıtlarını getirmek için yukarıya arama terimlerini girin.',
      view: 'Görüntüle', copied: 'Kopyalandı!', copy: 'Kopyala', saved: 'Kaydedildi!', download: 'İndir',
      clearAll: 'Tümünü temizle', examples: 'Örnekler:', onePerLine: '(her satıra bir tane)',
      errorBoundaryMessage: 'Sayfa beklenmeyen bir hatayla karşılaştı. Kayıtlı verileriniz güvende. Yeniden yükleyebilir veya panele dönebilirsiniz.',
      reloadApp: 'Uygulamayı yeniden yükle', backToDashboard: 'Panele dön',
    },
    states: {
      loadingDefault: 'Gerçek veriler yükleniyor…', loadingHint: 'Herkese açık araştırma kaynakları sorgulanıyor',
      errorTitle: 'Veriler yüklenemedi',
      errorMessage: 'Araştırma kaynakları yanıt vermedi. Bağlantınızı kontrol edip tekrar deneyin.',
      retry: 'Tekrar dene', emptyTitle: 'Burada henüz bir şey yok', emptyMessage: 'Arama sonuçları burada görünecek.',
    },
    sidebar: {
      openMenu: 'Gezinme menüsünü aç', closeMenu: 'Gezinme menüsünü kapat',
      signIn: 'Oturum aç / Hesap oluştur', signOut: 'Oturumu kapat', disclaimer: 'Yasal uyarı',
    },
    accessible: {
      languageTitle: 'Dil', interfaceLanguages: 'Arayüz dilleri',
      interfaceNote: 'Tam çevrilmiş arayüz', moreLanguages: 'Diğer diller',
      aiNote: 'Yapay zeka sohbeti bu dilde çalışır; kanıt taraması İngilizce dizinlidir.',
      limitedVoice: 'Bu cihazda konuşma tanıma veya seslendirme sınırlı.',
    },
    auth: {
      signIn: 'Oturum aç', createAccount: 'Hesap oluştur', email: 'E-posta',
      password: 'Şifre', guest: 'Misafir olarak devam et',
    },
    dashboard: {
      badge: 'Pan-Kanser Araştırma İstihbaratı', askAssistant: 'Araştırma Asistanına sor',
    },
    recordCard: {
      clinicalTrial: 'Klinik çalışma', publication: 'Yayın', free: 'Ücretsiz',
      showAbstract: 'Özeti göster', select: 'Seç',
    },
  },
  zh: {
    nav: {
      dashboard: '仪表板', discovery: '药物发现', curemap: '文献检索',
      resistance: '治疗耐药性', equity: '癌症公平性', burden: '癌症统计',
      biomarkers: '生物标志物', anatomy: '癌症类型与生物学', companion: '陪伴聊天',
      planner: '研究规划器', assistant: 'AI 研究助手', pdf: 'PDF 阅读器',
      library: '保存的文章与笔记', methodology: '研究方法', account: '账户',
      modules: '研究模块',
    },
    common: {
      search: '搜索', loading: '正在检索真实的研究数据库…',
      skipToContent: '跳到主要内容',
      loadingHint: '这可能需要几秒钟', errorTitle: '出错了',
      errorMessage: '获取数据时发生错误。请重试。', retry: '重试',
      emptyTitle: '暂无结果',
      emptyMessage: '请在上方输入搜索词，以获取真实的研究记录。',
      view: '查看', copied: '已复制！', copy: '复制', saved: '已保存！', download: '下载',
      clearAll: '全部清除', examples: '示例：', onePerLine: '（每行一个）',
      errorBoundaryMessage: '页面遇到意外错误。您保存的数据是安全的。您可以重新加载或返回仪表板。',
      reloadApp: '重新加载应用', backToDashboard: '返回仪表板',
    },
    states: {
      loadingDefault: '正在加载真实数据…', loadingHint: '正在查询公开研究来源',
      errorTitle: '无法加载数据',
      errorMessage: '研究来源未响应。请检查网络连接后重试。',
      retry: '重试', emptyTitle: '这里还没有内容', emptyMessage: '搜索结果将显示在这里。',
    },
    sidebar: {
      openMenu: '打开导航菜单', closeMenu: '关闭导航菜单',
      signIn: '登录 / 创建账户', signOut: '退出登录', disclaimer: '免责声明',
    },
    accessible: {
      languageTitle: '语言', interfaceLanguages: '界面语言',
      interfaceNote: '完整翻译的界面', moreLanguages: '更多语言',
      aiNote: 'AI 聊天支持此语言；文献证据检索为英文索引。',
      limitedVoice: '此设备上的语音识别或语音合成受限。',
    },
    auth: {
      signIn: '登录', createAccount: '创建账户', email: '邮箱',
      password: '密码', guest: '以访客身份继续',
    },
    dashboard: {
      badge: '泛癌症研究智能平台', askAssistant: '询问研究助手',
    },
    recordCard: {
      clinicalTrial: '临床试验', publication: '论文', free: '免费',
      showAbstract: '显示摘要', select: '选择',
    },
  },
  ja: {
    nav: {
      dashboard: 'ダッシュボード', discovery: '創薬研究', curemap: '文献検索',
      resistance: '治療耐性', equity: 'がん公平性', burden: 'がん統計',
      biomarkers: 'バイオマーカー', anatomy: 'がんの種類と生物学', companion: 'コンパニオンチャット',
      planner: '研究プランナー', assistant: 'AI研究アシスタント', pdf: 'PDFリーダー',
      library: '保存した論文とノート', methodology: '研究方法', account: 'アカウント',
      modules: '研究モジュール',
    },
    common: {
      search: '検索', loading: '実際の研究データベースを検索中…',
      skipToContent: 'メインコンテンツへスキップ',
      loadingHint: '数秒かかる場合があります', errorTitle: '問題が発生しました',
      errorMessage: 'データの取得中にエラーが発生しました。もう一度お試しください。', retry: '再試行',
      emptyTitle: '結果はまだありません',
      emptyMessage: '上に検索語を入力すると、実際の研究レコードを取得できます。',
      view: '表示', copied: 'コピーしました！', copy: 'コピー', saved: '保存しました！', download: 'ダウンロード',
      clearAll: 'すべてクリア', examples: '例：', onePerLine: '（1行に1つ）',
      errorBoundaryMessage: 'ページで予期しないエラーが発生しました。保存されたデータは安全です。再読み込みするか、ダッシュボードに戻ってください。',
      reloadApp: 'アプリを再読み込み', backToDashboard: 'ダッシュボードに戻る',
    },
    states: {
      loadingDefault: '実際のデータを読み込み中…', loadingHint: '公開研究ソースに問い合わせ中',
      errorTitle: 'データを読み込めませんでした',
      errorMessage: '研究ソースが応答しませんでした。接続を確認して再試行してください。',
      retry: '再試行', emptyTitle: 'まだ何もありません', emptyMessage: '検索結果がここに表示されます。',
    },
    sidebar: {
      openMenu: 'ナビゲーションメニューを開く', closeMenu: 'ナビゲーションメニューを閉じる',
      signIn: 'サインイン / アカウント作成', signOut: 'サインアウト', disclaimer: '免責事項',
    },
    accessible: {
      languageTitle: '言語', interfaceLanguages: 'インターフェース言語',
      interfaceNote: '完全翻訳されたインターフェース', moreLanguages: 'その他の言語',
      aiNote: 'AIチャットはこの言語で動作します。エビデンス検索は英語インデックスです。',
      limitedVoice: 'このデバイスでは音声認識または音声合成が制限されています。',
    },
    auth: {
      signIn: 'サインイン', createAccount: 'アカウント作成', email: 'メール',
      password: 'パスワード', guest: 'ゲストとして続ける',
    },
    dashboard: {
      badge: '汎がん研究インテリジェンス', askAssistant: '研究アシスタントに質問',
    },
    recordCard: {
      clinicalTrial: '臨床試験', publication: '論文', free: '無料',
      showAbstract: '概要を表示', select: '選択',
    },
  },
  ko: {
    nav: {
      dashboard: '대시보드', discovery: '약물 발굴', curemap: '문헌 검색',
      resistance: '치료 내성', equity: '암 형평성', burden: '암 통계',
      biomarkers: '바이오마커', anatomy: '암 유형과 생물학', companion: '동반자 채팅',
      planner: '연구 플래너', assistant: 'AI 연구 어시스턴트', pdf: 'PDF 리더',
      library: '저장한 논문과 노트', methodology: '연구 방법', account: '계정',
      modules: '연구 모듈',
    },
    common: {
      search: '검색', loading: '실제 연구 데이터베이스를 검색하는 중…',
      skipToContent: '본문으로 건너뛰기',
      loadingHint: '몇 초 걸릴 수 있습니다', errorTitle: '문제가 발생했습니다',
      errorMessage: '데이터를 가져오는 중 오류가 발생했습니다. 다시 시도해 주세요.', retry: '다시 시도',
      emptyTitle: '아직 결과가 없습니다',
      emptyMessage: '위에 검색어를 입력하면 실제 연구 기록을 가져올 수 있습니다.',
      view: '보기', copied: '복사됨!', copy: '복사', saved: '저장됨!', download: '다운로드',
      clearAll: '모두 지우기', examples: '예시:', onePerLine: '(한 줄에 하나)',
      errorBoundaryMessage: '페이지에서 예기치 않은 오류가 발생했습니다. 저장된 데이터는 안전합니다. 새로고침하거나 대시보드로 돌아갈 수 있습니다.',
      reloadApp: '앱 새로고침', backToDashboard: '대시보드로 돌아가기',
    },
    states: {
      loadingDefault: '실제 데이터를 불러오는 중…', loadingHint: '공개 연구 소스에 질의하는 중',
      errorTitle: '데이터를 불러올 수 없습니다',
      errorMessage: '연구 소스가 응답하지 않았습니다. 연결을 확인하고 다시 시도해 주세요.',
      retry: '다시 시도', emptyTitle: '아직 여기에 없습니다', emptyMessage: '검색 결과가 여기에 표시됩니다.',
    },
    sidebar: {
      openMenu: '탐색 메뉴 열기', closeMenu: '탐색 메뉴 닫기',
      signIn: '로그인 / 계정 만들기', signOut: '로그아웃', disclaimer: '면책 조항',
    },
    accessible: {
      languageTitle: '언어', interfaceLanguages: '인터페이스 언어',
      interfaceNote: '완전 번역된 인터페이스', moreLanguages: '더 많은 언어',
      aiNote: 'AI 채팅은 이 언어로 작동합니다. 근거 검색은 영어 인덱스입니다.',
      limitedVoice: '이 기기에서는 음성 인식 또는 음성 합성이 제한됩니다.',
    },
    auth: {
      signIn: '로그인', createAccount: '계정 만들기', email: '이메일',
      password: '비밀번호', guest: '게스트로 계속',
    },
    dashboard: {
      badge: '범암 연구 인텔리전스', askAssistant: '연구 어시스턴트에게 질문',
    },
    recordCard: {
      clinicalTrial: '임상시험', publication: '논문', free: '무료',
      showAbstract: '초록 보기', select: '선택',
    },
  },
  hi: {
    nav: {
      dashboard: 'डैशबोर्ड', discovery: 'ड्रग डिस्कवरी', curemap: 'साहित्य खोज',
      resistance: 'उपचार प्रतिरोध', equity: 'कैंसर समानता', burden: 'कैंसर सांख्यिकी',
      biomarkers: 'बायोमार्कर', anatomy: 'कैंसर के प्रकार और जीव विज्ञान', companion: 'साथी चैट',
      planner: 'अनुसंधान योजनाकार', assistant: 'एआई अनुसंधान सहायक', pdf: 'पीडीएफ रीडर',
      library: 'सहेजे गए पेपर और नोट्स', methodology: 'अनुसंधान विधियाँ', account: 'खाता',
      modules: 'अनुसंधान मॉड्यूल',
    },
    common: {
      search: 'खोजें', loading: 'वास्तविक अनुसंधान डेटाबेस खोजे जा रहे हैं…',
      skipToContent: 'मुख्य सामग्री पर जाएँ',
      loadingHint: 'इसमें कुछ सेकंड लग सकते हैं', errorTitle: 'कुछ गलत हो गया',
      errorMessage: 'डेटा लाने में त्रुटि हुई। कृपया पुनः प्रयास करें।', retry: 'पुनः प्रयास करें',
      emptyTitle: 'अभी कोई परिणाम नहीं',
      emptyMessage: 'वास्तविक अनुसंधान रिकॉर्ड प्राप्त करने के लिए ऊपर खोज शब्द दर्ज करें।',
      view: 'देखें', copied: 'कॉपी हो गया!', copy: 'कॉपी', saved: 'सहेजा गया!', download: 'डाउनलोड',
      clearAll: 'सब साफ़ करें', examples: 'उदाहरण:', onePerLine: '(एक पंक्ति में एक)',
      errorBoundaryMessage: 'पृष्ठ में अनपेक्षित त्रुटि हुई। आपका सहेजा गया डेटा सुरक्षित है। आप पुनः लोड कर सकते हैं या डैशबोर्ड पर लौट सकते हैं।',
      reloadApp: 'ऐप पुनः लोड करें', backToDashboard: 'डैशबोर्ड पर लौटें',
    },
    states: {
      loadingDefault: 'वास्तविक डेटा लोड हो रहा है…', loadingHint: 'सार्वजनिक अनुसंधान स्रोतों से पूछा जा रहा है',
      errorTitle: 'डेटा लोड नहीं हो सका',
      errorMessage: 'अनुसंधान स्रोतों ने प्रतिक्रिया नहीं दी। कनेक्शन जाँचें और पुनः प्रयास करें।',
      retry: 'पुनः प्रयास करें', emptyTitle: 'यहाँ अभी कुछ नहीं', emptyMessage: 'खोज परिणाम यहाँ दिखाई देंगे।',
    },
    sidebar: {
      openMenu: 'नेविगेशन मेनू खोलें', closeMenu: 'नेविगेशन मेनू बंद करें',
      signIn: 'साइन इन / खाता बनाएँ', signOut: 'साइन आउट', disclaimer: 'अस्वीकरण',
    },
    accessible: {
      languageTitle: 'भाषा', interfaceLanguages: 'इंटरफ़ेस भाषाएँ',
      interfaceNote: 'पूर्ण अनुवादित इंटरफ़ेस', moreLanguages: 'अधिक भाषाएँ',
      aiNote: 'एआई चैट इस भाषा में काम करता है; साक्ष्य पुनर्प्राप्ति अंग्रेजी-अनुक्रमित है।',
      limitedVoice: 'इस डिवाइस पर वाणी पहचान या वाक् संश्लेषण सीमित है।',
    },
    auth: {
      signIn: 'साइन इन', createAccount: 'खाता बनाएँ', email: 'ईमेल',
      password: 'पासवर्ड', guest: 'अतिथि के रूप में जारी रखें',
    },
    dashboard: {
      badge: 'पैन-कैंसर अनुसंधान इंटेलिजेंस', askAssistant: 'अनुसंधान सहायक से पूछें',
    },
    recordCard: {
      clinicalTrial: 'क्लिनिकल परीक्षण', publication: 'प्रकाशन', free: 'मुफ़्त',
      showAbstract: 'सारांश देखें', select: 'चुनें',
    },
  },
  ur: {
    nav: {
      dashboard: 'ڈیش بورڈ', discovery: 'ادویہ تحقیق', curemap: 'ادبیات تلاش',
      resistance: 'علاج برداشت', equity: 'کینسر مساوات', burden: 'کینسر اعداد و شمار',
      biomarkers: 'بائیو مارکرس', anatomy: 'کینسر کی اقسام اور حیاتیات', companion: 'ساتھی چیٹ',
      planner: 'تحقیق منصوبہ ساز', assistant: 'اے آئی تحقیق اسسٹنٹ', pdf: 'پی ڈی ایف ریڈر',
      library: 'محفوظ شدہ مقالات اور نوٹس', methodology: 'تحقیق کے طریقے', account: 'اکاؤنٹ',
      modules: 'تحقیق ماڈیولز',
    },
    common: {
      search: 'تلاش کریں', loading: 'حقیقی تحقیقی ڈیٹا بیس تلاش کیے جا رہے ہیں…',
      skipToContent: 'مرکزی مواد پر جائیں',
      loadingHint: 'اس میں کچھ سیکنڈ لگ سکتے ہیں', errorTitle: 'کچھ غلط ہو گیا',
      errorMessage: 'ڈیٹا حاصل کرنے میں خرابی ہوئی۔ براہ کرم دوبارہ کوشش کریں۔', retry: 'دوبارہ کوشش کریں',
      emptyTitle: 'ابھی کوئی نتیجہ نہیں',
      emptyMessage: 'حقیقی تحقیقی ریکارڈ حاصل کرنے کے لیے اوپر تلاش کے الفاظ درج کریں۔',
      view: 'دیکھیں', copied: 'کاپی ہو گیا!', copy: 'کاپی', saved: 'محفوظ ہو گیا!', download: 'ڈاؤن لوڈ',
      clearAll: 'سب صاف کریں', examples: 'مثالیں:', onePerLine: '(ایک سطر میں ایک)',
      errorBoundaryMessage: 'صفحے میں غیر متوقع خرابی ہوئی۔ آپ کا محفوظ کردہ ڈیٹا محفوظ ہے۔ آپ دوبارہ لوڈ کر سکتے ہیں یا ڈیش بورڈ پر واپس جا سکتے ہیں۔',
      reloadApp: 'ایپ دوبارہ لوڈ کریں', backToDashboard: 'ڈیش بورڈ پر واپس جائیں',
    },
    states: {
      loadingDefault: 'حقیقی ڈیٹا لوڈ ہو رہا ہے…', loadingHint: 'عوامی تحقیقی ذرائع سے پوچھا جا رہا ہے',
      errorTitle: 'ڈیٹا لوڈ نہیں ہو سکا',
      errorMessage: 'تحقیقی ذرائع نے جواب نہیں دیا۔ کنکشن چیک کریں اور دوبارہ کوشش کریں۔',
      retry: 'دوبارہ کوشش کریں', emptyTitle: 'یہاں ابھی کچھ نہیں', emptyMessage: 'تلاش کے نتائج یہاں دکھائی دیں گے۔',
    },
    sidebar: {
      openMenu: 'نیویگیشن مینو کھولیں', closeMenu: 'نیویگیشن مینو بند کریں',
      signIn: 'سائن ان / اکاؤنٹ بنائیں', signOut: 'سائن آؤٹ', disclaimer: 'ڈس کلیمر',
    },
    accessible: {
      languageTitle: 'زبان', interfaceLanguages: 'انٹرفیس زبانیں',
      interfaceNote: 'مکمل ترجمہ شدہ انٹرفیس', moreLanguages: 'مزید زبانیں',
      aiNote: 'اے آئی چیٹ اس زبان میں کام کرتی ہے؛ شواہد کی تلاش انگریزی میں ترتیب دی گئی ہے۔',
      limitedVoice: 'اس ڈیوائس پر آواز کی پہچان یا آواز نکالنا محدود ہے۔',
    },
    auth: {
      signIn: 'سائن ان', createAccount: 'اکاؤنٹ بنائیں', email: 'ای میل',
      password: 'پاس ورڈ', guest: 'مہمان کے طور پر جاری رکھیں',
    },
    dashboard: {
      badge: 'پین کینسر تحقیقی ذہانت', askAssistant: 'تحقیقی اسسٹنٹ سے پوچھیں',
    },
    recordCard: {
      clinicalTrial: 'کلینیکل ٹرائل', publication: 'مقالہ', free: 'مفت',
      showAbstract: 'خلاصہ دکھائیں', select: 'منتخب کریں',
    },
  },
  fa: {
    nav: {
      dashboard: 'داشبورد', discovery: 'کشف دارو', curemap: 'جستجوی مقالات',
      resistance: 'مقاومت درمانی', equity: 'برابری سرطان', burden: 'آمار سرطان',
      biomarkers: 'بیومارکرها', anatomy: 'انواع و زیست‌شناسی سرطان', companion: 'چت همراه',
      planner: 'برنامه‌ریز پژوهش', assistant: 'دستیار پژوهش هوش مصنوعی', pdf: 'خواننده PDF',
      library: 'مقالات و یادداشت‌های ذخیره‌شده', methodology: 'روش‌های پژوهش', account: 'حساب',
      modules: 'ماژول‌های پژوهش',
    },
    common: {
      search: 'جستجو', loading: 'در حال جستجوی پایگاه‌های داده واقعی…',
      skipToContent: 'رفتن به محتوای اصلی',
      loadingHint: 'این ممکن است چند ثانیه طول بکشد', errorTitle: 'مشکلی پیش آمد',
      errorMessage: 'هنگام دریافت داده خطایی رخ داد. لطفاً دوباره تلاش کنید.', retry: 'تلاش دوباره',
      emptyTitle: 'هنوز نتیجه‌ای نیست',
      emptyMessage: 'برای دریافت رکوردهای واقعی پژوهش، عبارت جستجو را در بالا وارد کنید.',
      view: 'مشاهده', copied: 'کپی شد!', copy: 'کپی', saved: 'ذخیره شد!', download: 'دانلود',
      clearAll: 'پاک کردن همه', examples: 'مثال‌ها:', onePerLine: '(هر خط یکی)',
      errorBoundaryMessage: 'صفحه با خطای غیرمنتظره‌ای مواجه شد. داده‌های ذخیره‌شده شما ایمن هستند. می‌توانید دوباره بارگذاری کنید یا به داشبورد برگردید.',
      reloadApp: 'بارگذاری مجدد برنامه', backToDashboard: 'بازگشت به داشبورد',
    },
    states: {
      loadingDefault: 'در حال بارگذاری داده‌های واقعی…', loadingHint: 'پرس‌وجو از منابع پژوهشی عمومی',
      errorTitle: 'داده‌ها بارگذاری نشدند',
      errorMessage: 'منابع پژوهشی پاسخ ندادند. اتصال خود را بررسی و دوباره تلاش کنید.',
      retry: 'تلاش دوباره', emptyTitle: 'هنوز چیزی اینجا نیست', emptyMessage: 'نتایج جستجو اینجا نمایش داده می‌شوند.',
    },
    sidebar: {
      openMenu: 'باز کردن منوی ناوبری', closeMenu: 'بستن منوی ناوبری',
      signIn: 'ورود / ایجاد حساب', signOut: 'خروج', disclaimer: 'سلب مسئولیت',
    },
    accessible: {
      languageTitle: 'زبان', interfaceLanguages: 'زبان‌های رابط',
      interfaceNote: 'رابط کاملاً ترجمه‌شده', moreLanguages: 'زبان‌های بیشتر',
      aiNote: 'چت هوش مصنوعی در این زبان کار می‌کند؛ بازیابی شواهد با نمایه انگلیسی است.',
      limitedVoice: 'تشخیص یا تولید گفتار در این دستگاه محدود است.',
    },
    auth: {
      signIn: 'ورود', createAccount: 'ایجاد حساب', email: 'ایمیل',
      password: 'گذرواژه', guest: 'ادامه به عنوان مهمان',
    },
    dashboard: {
      badge: 'هوش پژوهشی فرا-سرطان', askAssistant: 'از دستیار پژوهش بپرسید',
    },
    recordCard: {
      clinicalTrial: 'کارآزمایی بالینی', publication: 'مقاله', free: 'رایگان',
      showAbstract: 'نمایش چکیده', select: 'انتخاب',
    },
  },
  bn: {
    nav: {
      dashboard: 'ড্যাশবোর্ড', discovery: 'ওষুধ আবিষ্কার', curemap: 'সাহিত্য অনুসন্ধান',
      resistance: 'চিকিৎসা প্রতিরোধ', equity: 'ক্যান্সার সমতা', burden: 'ক্যান্সার পরিসংখ্যান',
      biomarkers: 'বায়োমার্কার', anatomy: 'ক্যান্সারের প্রকার ও জীববিজ্ঞান', companion: 'সঙ্গী চ্যাট',
      planner: 'গবেষণা পরিকল্পক', assistant: 'এআই গবেষণা সহকারী', pdf: 'পিডিএফ রিডার',
      library: 'সংরক্ষিত প্রবন্ধ ও নোট', methodology: 'গবেষণা পদ্ধতি', account: 'অ্যাকাউন্ট',
      modules: 'গবেষণা মডিউল',
    },
    common: {
      search: 'খুঁজুন', loading: 'সত্যিকারের গবেষণা ডেটাবেস অনুসন্ধান করা হচ্ছে…',
      skipToContent: 'মূল বিষয়বস্তুতে যান',
      loadingHint: 'এতে কয়েক সেকেন্ড লাগতে পারে', errorTitle: 'কিছু ভুল হয়েছে',
      errorMessage: 'ডেটা আনতে সমস্যা হয়েছে। আবার চেষ্টা করুন।', retry: 'আবার চেষ্টা করুন',
      emptyTitle: 'এখনও কোনো ফলাফল নেই',
      emptyMessage: 'সত্যিকারের গবেষণা রেকর্ড পেতে উপরে অনুসন্ধানের শব্দ লিখুন।',
      view: 'দেখুন', copied: 'কপি হয়েছে!', copy: 'কপি', saved: 'সংরক্ষিত!', download: 'ডাউনলোড',
      clearAll: 'সব মুছুন', examples: 'উদাহরণ:', onePerLine: '(প্রতি লাইনে একটি)',
      errorBoundaryMessage: 'পৃষ্ঠায় অপ্রত্যাশিত ত্রুটি হয়েছে। আপনার সংরক্ষিত ডেটা নিরাপদ। আপনি পুনরায় লোড করতে পারেন বা ড্যাশবোর্ডে ফিরে যেতে পারেন।',
      reloadApp: 'অ্যাপ পুনরায় লোড করুন', backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    },
    states: {
      loadingDefault: 'সত্যিকারের ডেটা লোড হচ্ছে…', loadingHint: 'পাবলিক গবেষণা উৎসে জিজ্ঞাসা করা হচ্ছে',
      errorTitle: 'ডেটা লোড করা যায়নি',
      errorMessage: 'গবেষণা উৎসগুলি সাড়া দেয়নি। সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।',
      retry: 'আবার চেষ্টা করুন', emptyTitle: 'এখানে এখনও কিছু নেই', emptyMessage: 'অনুসন্ধানের ফলাফল এখানে দেখা যাবে।',
    },
    sidebar: {
      openMenu: 'নেভিগেশন মেনু খুলুন', closeMenu: 'নেভিগেশন মেনু বন্ধ করুন',
      signIn: 'সাইন ইন / অ্যাকাউন্ট তৈরি করুন', signOut: 'সাইন আউট', disclaimer: 'দাবিত্যাগ',
    },
    accessible: {
      languageTitle: 'ভাষা', interfaceLanguages: 'ইন্টারফেস ভাষা',
      interfaceNote: 'সম্পূর্ণ অনূদিত ইন্টারফেস', moreLanguages: 'আরও ভাষা',
      aiNote: 'এআই চ্যাট এই ভাষায় কাজ করে; প্রমাণ অনুসন্ধান ইংরেজি-সূচিভুক্ত।',
      limitedVoice: 'এই ডিভাইসে কণ্ঠস্বর শনাক্তকরণ বা সংশ্লেষণ সীমিত।',
    },
    auth: {
      signIn: 'সাইন ইন', createAccount: 'অ্যাকাউন্ট তৈরি করুন', email: 'ইমেল',
      password: 'পাসওয়ার্ড', guest: 'অতিথি হিসেবে চালিয়ে যান',
    },
    dashboard: {
      badge: 'প্যান-ক্যান্সার গবেষণা ইন্টেলিজেন্স', askAssistant: 'গবেষণা সহকারীকে জিজ্ঞাসা করুন',
    },
    recordCard: {
      clinicalTrial: 'ক্লিনিকাল ট্রায়াল', publication: 'প্রকাশনা', free: 'বিনামূল্যে',
      showAbstract: 'সারাংশ দেখুন', select: 'নির্বাচন',
    },
  },
  id: {
    nav: {
      dashboard: 'Dasbor', discovery: 'Penemuan Obat', curemap: 'Pencarian Literatur',
      resistance: 'Resistensi Pengobatan', equity: 'Kesetaraan Kanker', burden: 'Statistik Kanker',
      biomarkers: 'Biomarker', anatomy: 'Jenis & Biologi Kanker', companion: 'Obrolan Pendamping',
      planner: 'Perencana Penelitian', assistant: 'Asisten Penelitian AI', pdf: 'Pembaca PDF',
      library: 'Makalah & Catatan Tersimpan', methodology: 'Metode Penelitian', account: 'Akun',
      modules: 'Modul Penelitian',
    },
    common: {
      search: 'Cari', loading: 'Mencari basis data penelitian nyata…',
      skipToContent: 'Lewati ke konten utama',
      loadingHint: 'Ini mungkin memerlukan beberapa detik', errorTitle: 'Terjadi kesalahan',
      errorMessage: 'Terjadi kesalahan saat mengambil data. Silakan coba lagi.', retry: 'Coba lagi',
      emptyTitle: 'Belum ada hasil',
      emptyMessage: 'Masukkan kata kunci pencarian di atas untuk mengambil catatan penelitian nyata.',
      view: 'Lihat', copied: 'Tersalin!', copy: 'Salin', saved: 'Tersimpan!', download: 'Unduh',
      clearAll: 'Hapus semua', examples: 'Contoh:', onePerLine: '(satu per baris)',
      errorBoundaryMessage: 'Halaman mengalami kesalahan tak terduga. Data tersimpan Anda aman. Anda dapat memuat ulang atau kembali ke dasbor.',
      reloadApp: 'Muat ulang aplikasi', backToDashboard: 'Kembali ke dasbor',
    },
    states: {
      loadingDefault: 'Memuat data nyata…', loadingHint: 'Mengquery sumber penelitian publik',
      errorTitle: 'Gagal memuat data',
      errorMessage: 'Sumber penelitian tidak merespons. Periksa koneksi Anda dan coba lagi.',
      retry: 'Coba lagi', emptyTitle: 'Belum ada apa pun di sini', emptyMessage: 'Hasil pencarian akan muncul di sini.',
    },
    sidebar: {
      openMenu: 'Buka menu navigasi', closeMenu: 'Tutup menu navigasi',
      signIn: 'Masuk / Buat akun', signOut: 'Keluar', disclaimer: 'Penafian',
    },
    accessible: {
      languageTitle: 'Bahasa', interfaceLanguages: 'Bahasa antarmuka',
      interfaceNote: 'Antarmuka diterjemahkan penuh', moreLanguages: 'Bahasa lainnya',
      aiNote: 'Obrolan AI berfungsi dalam bahasa ini; penelusuran bukti terindeks bahasa Inggris.',
      limitedVoice: 'Pengenalan atau sintesis suara terbatas di perangkat ini.',
    },
    auth: {
      signIn: 'Masuk', createAccount: 'Buat akun', email: 'Email',
      password: 'Kata sandi', guest: 'Lanjut sebagai tamu',
    },
    dashboard: {
      badge: 'Intelijen Penelitian Pan-Kanker', askAssistant: 'Tanya Asisten Penelitian',
    },
    recordCard: {
      clinicalTrial: 'Uji klinis', publication: 'Publikasi', free: 'Gratis',
      showAbstract: 'Tampilkan abstrak', select: 'Pilih',
    },
  },
  vi: {
    nav: {
      dashboard: 'Bảng điều khiển', discovery: 'Nghiên cứu thuốc', curemap: 'Tìm tài liệu',
      resistance: 'Kháng thuốc điều trị', equity: 'Công bằng ung thư', burden: 'Thống kê ung thư',
      biomarkers: 'Chỉ dấu sinh học', anatomy: 'Các loại ung thư & sinh học', companion: 'Trò chuyện đồng hành',
      planner: 'Lập kế hoạch nghiên cứu', assistant: 'Trợ lý nghiên cứu AI', pdf: 'Đọc PDF',
      library: 'Bài viết & ghi chú đã lưu', methodology: 'Phương pháp nghiên cứu', account: 'Tài khoản',
      modules: 'Mô-đun nghiên cứu',
    },
    common: {
      search: 'Tìm kiếm', loading: 'Đang tra cứu cơ sở dữ liệu nghiên cứu thực tế…',
      skipToContent: 'Chuyển đến nội dung chính',
      loadingHint: 'Việc này có thể mất vài giây', errorTitle: 'Đã xảy ra lỗi',
      errorMessage: 'Có lỗi khi tải dữ liệu. Vui lòng thử lại.', retry: 'Thử lại',
      emptyTitle: 'Chưa có kết quả',
      emptyMessage: 'Nhập từ khóa tìm kiếm ở trên để lấy hồ sơ nghiên cứu thực tế.',
      view: 'Xem', copied: 'Đã sao chép!', copy: 'Sao chép', saved: 'Đã lưu!', download: 'Tải xuống',
      clearAll: 'Xóa tất cả', examples: 'Ví dụ:', onePerLine: '(mỗi dòng một mục)',
      errorBoundaryMessage: 'Trang gặp lỗi không mong muốn. Dữ liệu đã lưu của bạn vẫn an toàn. Bạn có thể tải lại hoặc quay lại bảng điều khiển.',
      reloadApp: 'Tải lại ứng dụng', backToDashboard: 'Quay lại bảng điều khiển',
    },
    states: {
      loadingDefault: 'Đang tải dữ liệu thực tế…', loadingHint: 'Đang truy vấn nguồn nghiên cứu công khai',
      errorTitle: 'Không thể tải dữ liệu',
      errorMessage: 'Nguồn nghiên cứu không phản hồi. Kiểm tra kết nối và thử lại.',
      retry: 'Thử lại', emptyTitle: 'Chưa có gì ở đây', emptyMessage: 'Kết quả tìm kiếm sẽ hiển thị ở đây.',
    },
    sidebar: {
      openMenu: 'Mở menu điều hướng', closeMenu: 'Đóng menu điều hướng',
      signIn: 'Đăng nhập / Tạo tài khoản', signOut: 'Đăng xuất', disclaimer: 'Tuyên bố miễn trừ',
    },
    accessible: {
      languageTitle: 'Ngôn ngữ', interfaceLanguages: 'Ngôn ngữ giao diện',
      interfaceNote: 'Giao diện được dịch đầy đủ', moreLanguages: 'Ngôn ngữ khác',
      aiNote: 'Trò chuyện AI hoạt động bằng ngôn ngữ này; tìm kiếm bằng chứng đánh chỉ mục tiếng Anh.',
      limitedVoice: 'Nhận dạng hoặc tổng hợp giọng nói bị hạn chế trên thiết bị này.',
    },
    auth: {
      signIn: 'Đăng nhập', createAccount: 'Tạo tài khoản', email: 'Email',
      password: 'Mật khẩu', guest: 'Tiếp tục với tư cách khách',
    },
    dashboard: {
      badge: 'Trí tuệ nghiên cứu ung thư toàn cầu', askAssistant: 'Hỏi Trợ lý nghiên cứu',
    },
    recordCard: {
      clinicalTrial: 'Thử nghiệm lâm sàng', publication: 'Ấn phẩm', free: 'Miễn phí',
      showAbstract: 'Xem tóm tắt', select: 'Chọn',
    },
  },
  th: {
    nav: {
      dashboard: 'แดชบอร์ด', discovery: 'ค้นคว้ายา', curemap: 'ค้นหาวรรณกรรม',
      resistance: 'การดื้อต่อการรักษา', equity: 'ความเท่าเทียมด้านมะเร็ง', burden: 'สถิติมะเร็ง',
      biomarkers: 'ไบโอมาร์กเกอร์', anatomy: 'ชนิดและชีววิทยาของมะเร็ง', companion: 'แชทผู้ช่วย',
      planner: 'แผนงานวิจัย', assistant: 'ผู้ช่วยวิจัย AI', pdf: 'เครื่องอ่าน PDF',
      library: 'บทความและโน้ตที่บันทึกไว้', methodology: 'วิธีการวิจัย', account: 'บัญชี',
      modules: 'โมดูลวิจัย',
    },
    common: {
      search: 'ค้นหา', loading: 'กำลังค้นฐานข้อมูลวิจัยจริง…',
      skipToContent: 'ข้ามไปยังเนื้อหาหลัก',
      loadingHint: 'อาจใช้เวลาสักครู่', errorTitle: 'เกิดข้อผิดพลาด',
      errorMessage: 'เกิดข้อผิดพลาดขณะดึงข้อมูล โปรดลองอีกครั้ง', retry: 'ลองอีกครั้ง',
      emptyTitle: 'ยังไม่มีผลลัพธ์',
      emptyMessage: 'ป้อนคำค้นด้านบนเพื่อดึงบันทึกวิจัยจริง',
      view: 'ดู', copied: 'คัดลอกแล้ว!', copy: 'คัดลอก', saved: 'บันทึกแล้ว!', download: 'ดาวน์โหลด',
      clearAll: 'ล้างทั้งหมด', examples: 'ตัวอย่าง:', onePerLine: '(บรรทัดละหนึ่งรายการ)',
      errorBoundaryMessage: 'หน้านี้พบข้อผิดพลาดที่ไม่คาดคิด ข้อมูลที่บันทึกไว้ของคุณปลอดภัย คุณสามารถโหลดใหม่หรือกลับไปที่แดชบอร์ดได้',
      reloadApp: 'โหลดแอปใหม่', backToDashboard: 'กลับไปที่แดชบอร์ด',
    },
    states: {
      loadingDefault: 'กำลังโหลดข้อมูลจริง…', loadingHint: 'กำลังสอบถามแหล่งวิจัยสาธารณะ',
      errorTitle: 'โหลดข้อมูลไม่สำเร็จ',
      errorMessage: 'แหล่งวิจัยไม่ตอบสนอง ตรวจสอบการเชื่อมต่อแล้วลองอีกครั้ง',
      retry: 'ลองอีกครั้ง', emptyTitle: 'ยังไม่มีอะไรที่นี่', emptyMessage: 'ผลการค้นหาจะปรากฏที่นี่',
    },
    sidebar: {
      openMenu: 'เปิดเมนูนำทาง', closeMenu: 'ปิดเมนูนำทาง',
      signIn: 'เข้าสู่ระบบ / สร้างบัญชี', signOut: 'ออกจากระบบ', disclaimer: 'ข้อปฏิเสธความรับผิด',
    },
    accessible: {
      languageTitle: 'ภาษา', interfaceLanguages: 'ภาษาของอินเทอร์เฟซ',
      interfaceNote: 'อินเทอร์เฟซแปลครบถ้วน', moreLanguages: 'ภาษาอื่น ๆ',
      aiNote: 'แชท AI ใช้ได้กับภาษานี้; การค้นหาหลักฐานจัดทำดัชนีเป็นภาษาอังกฤษ',
      limitedVoice: 'การจดจำหรือสังเคราะห์เสียงจำกัดบนอุปกรณ์นี้',
    },
    auth: {
      signIn: 'เข้าสู่ระบบ', createAccount: 'สร้างบัญชี', email: 'อีเมล',
      password: 'รหัสผ่าน', guest: 'ดำเนินการต่อในฐานะผู้เยี่ยมชม',
    },
    dashboard: {
      badge: 'สติปัญญาการวิจัยมะเร็งทุกชนิด', askAssistant: 'ถามผู้ช่วยวิจัย',
    },
    recordCard: {
      clinicalTrial: 'การทดลองทางคลินิก', publication: 'สิ่งพิมพ์', free: 'ฟรี',
      showAbstract: 'แสดงบทคัดย่อ', select: 'เลือก',
    },
  },
  sw: {
    nav: {
      dashboard: 'Dashibodi', discovery: 'Utafiti wa Dawa', curemap: 'Utafutaji wa Fasihi',
      resistance: 'Ukinzani wa Matibabu', equity: 'Usawa wa Saratani', burden: 'Takwimu za Saratani',
      biomarkers: 'Biomarka', anatomy: 'Aina na Biolojia ya Saratani', companion: 'Mazungumzo ya Mwongozi',
      planner: 'Mpangaji wa Utafiti', assistant: 'Msaidizi wa Utafiti wa AI', pdf: 'Kisoma PDF',
      library: 'Makala na Maelezo Yaliyohifadhiwa', methodology: 'Njia za Utafiti', account: 'Akaunti',
      modules: 'Moduli za Utafiti',
    },
    common: {
      search: 'Tafuta', loading: 'Inatafuta hifadhidata halisi za utafiti…',
      skipToContent: 'Ruka hadi maudhui makuu',
      loadingHint: 'Hii inaweza kuchukua sekunde chache', errorTitle: 'Kuna kilichokosekana',
      errorMessage: 'Kosa lilitokea wakati wa kupata data. Tafadhali jaribu tena.', retry: 'Jaribu tena',
      emptyTitle: 'Hakuna matokeo bado',
      emptyMessage: 'Ingiza maneno ya utafutaji hapo juu ili kupata rekodi halisi za utafiti.',
      view: 'Angalia', copied: 'Imenakiliwa!', copy: 'Nakili', saved: 'Imehifadhiwa!', download: 'Pakua',
      clearAll: 'Futa zote', examples: 'Mifano:', onePerLine: '(moja kwa mstari)',
      errorBoundaryMessage: 'Ukurasa umekutana na hitilafu isiyotarajiwa. Data yako iliyohifadhiwa iko salama. Unaweza kupakia upya au kurudi kwenye dashibodi.',
      reloadApp: 'Pakia upya programu', backToDashboard: 'Rudi kwenye dashibodi',
    },
    states: {
      loadingDefault: 'Inapakia data halisi…', loadingHint: 'Inauliza vyanzo vya umma vya utafiti',
      errorTitle: 'Imeshindwa kupakia data',
      errorMessage: 'Vyanzo vya utafiti vilishindwa kujibu. Angalia muunganisho wako kisha ujaribu tena.',
      retry: 'Jaribu tena', emptyTitle: 'Hakuna kitu hapa bado', emptyMessage: 'Matokeo ya utafutaji yataonekana hapa.',
    },
    sidebar: {
      openMenu: 'Fungua menyu ya urambazaji', closeMenu: 'Funga menyu ya urambazaji',
      signIn: 'Ingia / Fungua akaunti', signOut: 'Toka', disclaimer: 'Kanusho',
    },
    accessible: {
      languageTitle: 'Lugha', interfaceLanguages: 'Lugha za kiolesura',
      interfaceNote: 'Kiolesura kilichotafsiriwa kikamilifu', moreLanguages: 'Lugha zaidi',
      aiNote: 'Soga la AI linafanya kazi kwa lugha hii; utafutaji wa ushahidi umepangwa kwa Kiingereza.',
      limitedVoice: 'Utambuzi wa sauti au utengenezaji wa sauti ni mdogo kwenye kifaa hiki.',
    },
    auth: {
      signIn: 'Ingia', createAccount: 'Fungua akaunti', email: 'Barua pepe',
      password: 'Nenosiri', guest: 'Endelea kama mgeni',
    },
    dashboard: {
      badge: 'Ujasiri wa Utafiti wa Saratani Zote', askAssistant: 'Uliza Msaidizi wa Utafiti',
    },
    recordCard: {
      clinicalTrial: 'Ujaribio wa Kikliniki', publication: 'Machapisho', free: 'Bure',
      showAbstract: 'Onyesha muhtasari', select: 'Chagua',
    },
  },
};
