// Localised strings for the pricing, billing and admin pages.
// English is the source of truth; French and Arabic have complete
// translations. Every other language falls back to English here, consistent
// with the documented partial-language coverage.

import type { Language } from '@/types';

export interface BillingStrings {
  pricingNav: string;
  billingNav: string;
  adminNav: string;
  plansTitle: string;
  plansSubtitle: string;
  priceNote: string;
  freeName: string;
  proName: string;
  institutionalName: string;
  monthly: string;
  annual: string;
  annualSave: string;
  perMonth: string;
  customPricing: string;
  choosePlan: string;
  currentPlan: string;
  upgradeRequest: string;
  requestSent: string;
  requestPendingNotice: string;
  withdraw: string;
  cancelled: string;
  usage: string;
  usageOf: string;
  usedThisMonth: string;
  unlimited: string;
  limitReachedNotice: string;
  limitReachedCta: string;
  resetCounters: string;
  billingHistory: string;
  noInvoices: string;
  pendingProcessing: string;
  withdrawn: string;
  downgrade: string;
  features: string;
  freeAudience: string;
  proAudience: string;
  institutionalAudience: string;
  enquiryTitle: string;
  enquiryIntro: string;
  organisation: string;
  contactName: string;
  email: string;
  role: string;
  users: string;
  message: string;
  send: string;
  enquiryDraftNote: string;
  termsInfo: string;
  privacyInfo: string;
  cancellationTitle: string;
  cancellationBody: string;
  adminTitle: string;
  adminWarning: string;
  adminOverrides: string;
  proPriceMonthly: string;
  proPriceAnnual: string;
  save: string;
  reset: string;
  feature: string;
  limit: string;
  savedNote: string;
  syncNote: string;
  upgradesAlwaysAvailable: string;
  summarizeCta: string;
}

const en: BillingStrings = {
  pricingNav: 'Pricing',
  billingNav: 'Plan & billing',
  adminNav: 'Plan admin',
  plansTitle: 'Plans and pricing',
  plansSubtitle:
    'Everything essential — search, evidence, citations and every accessibility feature — works on the free plan. Paid plans add scale and team tools.',
  priceNote:
    'These prices are suggested list prices shown for planning purposes — they are not validated market prices, and payment processing is not connected yet, so nothing is charged today.',
  freeName: 'Free',
  proName: 'Pro',
  institutionalName: 'Institutional',
  monthly: 'Monthly',
  annual: 'Annual',
  annualSave: 'Save about a third',
  perMonth: 'per month',
  customPricing: 'Custom quotation',
  choosePlan: 'Choose plan',
  currentPlan: 'Your plan today: Free',
  upgradeRequest: 'Request upgrade',
  requestSent: 'Request saved.',
  requestPendingNotice:
    'Payment processing is pending: no provider is connected, so you are not charged and your plan stays Free until the operator switches on billing. Your request is stored on this device and waits for activation.',
  withdraw: 'Withdraw request',
  cancelled: 'Request withdrawn.',
  usage: 'Usage this month',
  usageOf: 'of',
  usedThisMonth: 'used',
  unlimited: 'Unlimited',
  limitReachedNotice:
    'Monthly limit reached for this feature. Basic search, reading and every source citation stay free — you can still use them without limits.',
  limitReachedCta: 'See plans',
  resetCounters: 'Reset counters (device-local demo)',
  billingHistory: 'Billing history',
  noInvoices:
    'No invoices yet. Invoices appear here once a payment provider is connected; requests below are quotations, not charges.',
  pendingProcessing: 'Pending — no payment taken',
  withdrawn: 'Withdrawn',
  downgrade: 'Stay on Free',
  features: 'What is included',
  freeAudience: 'Students, early-career researchers, individual users',
  proAudience: 'Researchers, postgraduates, academics, scientists',
  institutionalAudience: 'Universities, labs, hospitals, libraries',
  enquiryTitle: 'Request an institutional quotation',
  enquiryIntro:
    'Tell us about your institution and we prepare a tailored quote with multi-user access, shared workspaces and support. Submitting creates a draft on this device until the form backend is connected — nothing is sent automatically.',
  organisation: 'Organisation',
  contactName: 'Contact name',
  email: 'Email',
  role: 'Your role',
  users: 'Expected number of users',
  message: 'What do you need?',
  send: 'Request quotation',
  enquiryDraftNote:
    'Draft saved on this device — the enquiry form is not connected to a backend yet, so it has not been sent anywhere.',
  termsInfo: 'Terms of service',
  privacyInfo: 'Privacy notice',
  cancellationTitle: 'Cancellation',
  cancellationBody:
    'Because no payment is processed yet, there is nothing to cancel and no charge to refund. Once billing goes live: you can cancel any time, your plan stays active until the end of the paid period, and your saved research stays yours — cancellation never deletes your data or removes accessibility features.',
  adminTitle: 'Plan administration',
  adminWarning:
    'This dashboard edits a device-local configuration. It does not touch the server because there is no server to touch yet — all entitlement enforcement is pending backend integration, and no payment provider is connected. Anyone discovering this URL can change only their own device.',
  adminOverrides: 'Overrides',
  proPriceMonthly: 'Pro monthly price (EUR)',
  proPriceAnnual: 'Pro annual price (EUR)',
  save: 'Save',
  reset: 'Restore defaults',
  feature: 'Feature',
  limit: 'Monthly limit (empty = unlimited)',
  savedNote: 'Saved on this device.',
  syncNote: 'All plan data must eventually live on the server; prices here are suggested, not validated.',
  upgradesAlwaysAvailable: 'Never gated: literature search, reading, citations, accessibility.',
  summarizeCta: 'Summarize with AI',
};

const fr: BillingStrings = {
  pricingNav: 'Tarifs',
  billingNav: 'Abonnement & facturation',
  adminNav: 'Administration des offres',
  plansTitle: 'Offres et tarifs',
  plansSubtitle:
    'Tout l’essentiel — recherche, preuves, citations et toutes les fonctions d’accessibilité — fonctionne avec l’offre gratuite. Les offres payantes ajoutent du volume et des outils d’équipe.',
  priceNote:
    'Ces prix sont des tarifs indicatifs proposés à titre de référence — ils ne sont pas des prix de marché validés, et le paiement n’est pas encore connecté : rien n’est facturé aujourd’hui.',
  freeName: 'Gratuit',
  proName: 'Pro',
  institutionalName: 'Institutionnel',
  monthly: 'Mensuel',
  annual: 'Annuel',
  annualSave: 'Environ un tiers d’économie',
  perMonth: 'par mois',
  customPricing: 'Devis personnalisé',
  choosePlan: 'Choisir cette offre',
  currentPlan: 'Votre offre actuelle : Gratuite',
  upgradeRequest: 'Demander une mise à niveau',
  requestSent: 'Demande enregistrée.',
  requestPendingNotice:
    'Le paiement est en attente : aucun fournisseur n’est connecté, donc rien n’est débité et votre offre reste Gratuite jusqu’à l’activation de la facturation. La demande est conservée sur cet appareil.',
  withdraw: 'Retirer la demande',
  cancelled: 'Demande retirée.',
  usage: 'Utilisation ce mois-ci',
  usageOf: 'sur',
  usedThisMonth: 'utilisés',
  unlimited: 'Illimité',
  limitReachedNotice:
    'Limite mensuelle atteinte pour cette fonction. La recherche de base, la lecture et toutes les citations restent gratuites — utilisables sans limite.',
  limitReachedCta: 'Voir les offres',
  resetCounters: 'Réinitialiser les compteurs (démo locale)',
  billingHistory: 'Historique de facturation',
  noInvoices:
    'Aucune facture pour l’instant. Les factures apparaîtront ici une fois un fournisseur de paiement connecté ; les demandes ci-dessous sont des devis, pas des débits.',
  pendingProcessing: 'En attente — aucun paiement',
  withdrawn: 'Retirée',
  downgrade: 'Rester sur Gratuit',
  features: 'Ce qui est inclus',
  freeAudience: 'Étudiants, jeunes chercheurs, particulier·ères',
  proAudience: 'Chercheurs, diplômés, universitaires, scientifiques',
  institutionalAudience: 'Universités, laboratoires, hôpitaux, bibliothèques',
  enquiryTitle: 'Demander un devis institutionnel',
  enquiryIntro:
    'Décrivez votre institution et nous préparons un devis adapté avec accès multi-utilisateurs, espaces partagés et support. L’envoi crée un brouillon sur cet appareil jusqu’à ce que le formulaire soit connecté — rien n’est envoyé automatiquement.',
  organisation: 'Organisation',
  contactName: 'Nom du contact',
  email: 'E-mail',
  role: 'Votre rôle',
  users: 'Nombre d’utilisateurs prévu',
  message: 'De quoi avez-vous besoin ?',
  send: 'Demander un devis',
  enquiryDraftNote:
    'Brouillon enregistré sur cet appareil — le formulaire n’est pas encore connecté à un serveur, il n’a été envoyé nulle part.',
  termsInfo: 'Conditions d’utilisation',
  privacyInfo: 'Politique de confidentialité',
  cancellationTitle: 'Résiliation',
  cancellationBody:
    'Aucun paiement n’est traité actuellement : il n’y a donc rien à annuler ni à rembourser. Une fois la facturation active : résiliation possible à tout moment, l’offre reste active jusqu’à la fin de la période payée, et vos recherches restent les vôtres — la résiliation ne supprime jamais vos données ni les fonctions d’accessibilité.',
  adminTitle: 'Administration des offres',
  adminWarning:
    'Ce tableau de bord modifie une configuration locale à cet appareil. Il ne touche pas le serveur car il n’y a pas encore de serveur — l’application des droits est en attente d’intégration backend et aucun fournisseur de paiement n’est connecté.',
  adminOverrides: 'Remplacements',
  proPriceMonthly: 'Prix mensuel Pro (EUR)',
  proPriceAnnual: 'Prix annuel Pro (EUR)',
  save: 'Enregistrer',
  reset: 'Valeurs par défaut',
  feature: 'Fonction',
  limit: 'Limite mensuelle (vide = illimité)',
  savedNote: 'Enregistré sur cet appareil.',
  syncNote: 'Toutes les données d’offres devront vivre côté serveur ; les prix ici sont indicatifs, non validés.',
  upgradesAlwaysAvailable: 'Jamais restreint : recherche, lecture, citations, accessibilité.',
  summarizeCta: 'Résumer avec l’IA',
};

const ar: BillingStrings = {
  pricingNav: 'الأسعار',
  billingNav: 'الخطة والفوترة',
  adminNav: 'إدارة الخطط',
  plansTitle: 'الخطط والأسعار',
  plansSubtitle:
    'كل الأساسيات — البحث والأدلة والاقتباسات وكل مزايا إمكانية الوصول — تعمل في الخطة المجانية. الخطط المدفوعة تضيف حصصًا أكبر وأدوات للفرق.',
  priceNote:
    'هذه أسعار قائمة مقترحة للمرجعية فقط — ليست أسعار سوق معتمدة، ومعالجة الدفع غير متصلة بعد، لذا لا يُحصَّل أي مبلغ اليوم.',
  freeName: 'مجانية',
  proName: 'احترافية',
  institutionalName: 'مؤسسية',
  monthly: 'شهري',
  annual: 'سنوي',
  annualSave: 'توفير نحو الثلث',
  perMonth: 'شهريًا',
  customPricing: 'عرض سعر مخصص',
  choosePlan: 'اختيار الخطة',
  currentPlan: 'خطتك الحالية: مجانية',
  upgradeRequest: 'طلب ترقية',
  requestSent: 'تم حفظ الطلب.',
  requestPendingNotice:
    'معالجة الدفع معلّقة: لا يوجد مزوّد متصل، لذا لن يُحصَّل منك أي مبلغ وتبقى خطتك مجانية حتى تفعيل الفوترة. يُحفظ الطلب على هذا الجهاز بانتظار التفعيل.',
  withdraw: 'سحب الطلب',
  cancelled: 'تم سحب الطلب.',
  usage: 'الاستخدام هذا الشهر',
  usageOf: 'من',
  usedThisMonth: 'المستخدم',
  unlimited: 'غير محدود',
  limitReachedNotice:
    'تم بلوغ الحد الشهري لهذه الميزة. البحث الأساسي والقراءة وكل الاقتباسات تبقى مجانية — استخدمها بلا حدود.',
  limitReachedCta: 'استعرض الخطط',
  resetCounters: 'إعادة ضبط العدادات (عرض محلي)',
  billingHistory: 'سجل الفوترة',
  noInvoices:
    'لا توجد فواتير بعد. ستظهر الفواتير هنا بعد توصيل مزوّد الدفع؛ الطلبات أدناه عروض أسعار وليست مبالغ محصلة.',
  pendingProcessing: 'قيد الانتظار — لم يُحصَّل أي مبلغ',
  withdrawn: 'مسحوب',
  downgrade: 'البقاء في الخطة المجانية',
  features: 'ما يشمله',
  freeAudience: 'الطلاب والباحثون المبتدئون والمستخدمون الأفراد',
  proAudience: 'الباحثون وطلبة الدراسات العليا والأكاديميون والعلماء',
  institutionalAudience: 'الجامعات والمختبرات والمستشفيات والمكتبات',
  enquiryTitle: 'طلب عرض سعر مؤسسي',
  enquiryIntro:
    'أخبرنا عن مؤسستك وسنعدّ عرض سعر مخصصًا مع وصول متعدد المستخدمين ومساحات عمل مشتركة ودعم. يعمل الإرسال كمسودة على هذا الجهاز إلى أن يُوصَل نموذج الخلفية — لا يُرسل شيء تلقائيًا.',
  organisation: 'المؤسسة',
  contactName: 'اسم جهة الاتصال',
  email: 'البريد الإلكتروني',
  role: 'دورك',
  users: 'عدد المستخدمين المتوقع',
  message: 'ما الذي تحتاجه؟',
  send: 'طلب عرض سعر',
  enquiryDraftNote:
    'حُفظت المسودة على هذا الجهاز — النموذج غير موصول بخادم بعد، ولم يُرسَل إلى أي مكان.',
  termsInfo: 'شروط الخدمة',
  privacyInfo: 'إشعار الخصوصية',
  cancellationTitle: 'الإلغاء',
  cancellationBody:
    'لأنه لا تتم معالجة أي دفعة حاليًا، لا يوجد شيء للإلغاء ولا مبلغ لاسترداده. بعد تفعيل الفوترة: يمكنك الإلغاء في أي وقت، تبقى خطتك نشطة حتى نهاية الفترة المدفوعة، وتبقى أبحاثك ملكك — الإلغاء لا يحذف بياناتك ولا يزيل مزايا إمكانية الوصول.',
  adminTitle: 'إدارة الخطط',
  adminWarning:
    'هذه اللوحة تعدّل إعدادًا محليًا على هذا الجهاز فقط. لا تمس الخادم لأنه لا يوجد خادم بعد — فرض الحقوق معلّق بانتظار تكامل الخلفية ولا يوجد مزوّد دفع متصل.',
  adminOverrides: 'الاستبدالات',
  proPriceMonthly: 'السعر الشهري للاحترافية (EUR)',
  proPriceAnnual: 'السعر السنوي للاحترافية (EUR)',
  save: 'حفظ',
  reset: 'استعادة الافتراضي',
  feature: 'الميزة',
  limit: 'الحد الشهري (فارغ = غير محدود)',
  savedNote: 'حُفظ على هذا الجهاز.',
  syncNote: 'يجب أن تُخزَّن كل بيانات الخطط على الخادم في النهاية؛ الأسعار هنا مقترحة وغير معتمدة.',
  upgradesAlwaysAvailable: 'لا يُقيَّد أبدًا: البحث والقراءة والاقتباسات وإمكانية الوصول.',
  summarizeCta: 'لخّص بالذكاء الاصطناعي',
};

const BY_LANG: Partial<Record<Language, BillingStrings>> = { fr, ar };
export function billingT(language: Language): BillingStrings {
  const resolved = (language.startsWith('ar') ? 'ar' : language.startsWith('fr') ? 'fr' : language) as Language;
  return BY_LANG[resolved] ?? en;
}

/** Localised label for a metered feature, for billing pages and notices. */
export function featureLabel(feature: string, language: Language): string {
  if (language.startsWith('fr')) return FEATURE_LABELS_FR[feature] ?? feature;
  if (language.startsWith('ar')) return FEATURE_LABELS_AR[feature] ?? feature;
  return FEATURE_LABELS[feature] ?? feature;
}

const FEATURE_LABELS: Record<string, string> = {
  aiSummaries: 'AI summaries',
  articleComparisons: 'Article comparisons',
  pdfSummaries: 'PDF summaries',
  assistantQueries: 'Assistant queries',
  automations: 'Automations',
};

const FEATURE_LABELS_FR: Record<string, string> = {
  aiSummaries: 'Résumés IA',
  articleComparisons: 'Comparaisons d’articles',
  pdfSummaries: 'Résumés de PDF',
  assistantQueries: 'Requêtes à l’assistant',
  automations: 'Automatisations',
};

const FEATURE_LABELS_AR: Record<string, string> = {
  aiSummaries: 'ملخصات الذكاء الاصطناعي',
  articleComparisons: 'مقارنات المقالات',
  pdfSummaries: 'ملخصات PDF',
  assistantQueries: 'استعلامات المساعد',
  automations: 'الأتمتة',
};
