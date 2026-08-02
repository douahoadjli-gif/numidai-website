/* ----------------------------------------------------------------------------
   NumidAI · "Start Your Project" form definition
   Single source of truth, extracted from the Google Form
   "NumidAI – Green Building Design Request" — every question, option, and
   required flag preserved; grouped into the seven acquisition sections.
   To change a question later, edit ONLY this file.
   NOTE: `timeline` is an optional addition (the original form has no timeline
   question) — remove that field object to match the form 1:1.
---------------------------------------------------------------------------- */

export const formSteps = [
  {
    id: 'personal',
    title: { en: 'Personal Information', ar: 'المعلومات الشخصية' },
    lede: {
      en: 'Who should we talk to about this project?',
      ar: 'من نتواصل معه بخصوص هذا المشروع؟'
    },
    fields: [
      {
        id: 'full_name', type: 'text', required: true, autoComplete: 'name',
        label: { en: 'Full Name', ar: 'الاسم الكامل' },
        placeholder: { en: 'e.g. Amina Bensalem', ar: 'مثال: أمينة بن سالم' }
      },
      {
        id: 'email', type: 'email', required: true, autoComplete: 'email',
        label: { en: 'Email', ar: 'البريد الإلكتروني' },
        placeholder: { en: 'name@company.com', ar: 'name@company.com' }
      }
    ]
  },
  {
    id: 'project',
    title: { en: 'Project Information', ar: 'معلومات المشروع' },
    lede: {
      en: 'The essentials of what you are building.',
      ar: 'أساسيات ما تنوي بناءه.'
    },
    fields: [
      {
        id: 'project_type', type: 'radio', required: true, otherId: 'project_type_other',
        label: { en: 'Project Type', ar: 'نوع المشروع' },
        options: [
          { value: 'residential', en: 'Residential', ar: 'سكني' },
          { value: 'commercial', en: 'Commercial', ar: 'تجاري' },
          { value: 'public', en: 'Public building', ar: 'مبنى عام' },
          { value: 'other', en: 'Other', ar: 'أخرى' }
        ]
      },
      {
        id: 'project_stage', type: 'radio', required: true, otherId: 'project_stage_other',
        label: { en: 'Project Stage', ar: 'مرحلة المشروع' },
        options: [
          { value: 'idea', en: 'Idea / Concept', ar: 'فكرة / تصور' },
          { value: 'design', en: 'Design phase', ar: 'مرحلة التصميم' },
          { value: 'construction', en: 'Under construction', ar: 'قيد الإنشاء' },
          { value: 'retrofit', en: 'Existing building (renovation / retrofit)', ar: 'مبنى قائم (تجديد / تحديث)' },
          { value: 'other', en: 'Other', ar: 'أخرى' }
        ]
      },
      {
        id: 'floors', type: 'number', required: true, min: 1, max: 200,
        label: { en: 'Number of Floors', ar: 'عدد الطوابق' },
        placeholder: { en: 'e.g. 3', ar: 'مثال: 3' }
      }
    ]
  },
  {
    id: 'site',
    title: { en: 'Site Information', ar: 'معلومات الموقع' },
    lede: {
      en: 'Where the project lives — climate starts with location.',
      ar: 'أين يقع المشروع — المناخ يبدأ من الموقع.'
    },
    fields: [
      {
        id: 'location', type: 'text', required: true,
        label: { en: 'Project Location (City, Country)', ar: 'موقع المشروع (المدينة، الدولة)' },
        placeholder: { en: 'e.g. Algiers, Algeria', ar: 'مثال: الجزائر العاصمة، الجزائر' }
      },
      {
        id: 'surface_area_m2', type: 'number', required: true, min: 1,
        label: { en: 'Estimated Surface Area (m²)', ar: 'المساحة التقديرية (م²)' },
        placeholder: { en: 'e.g. 420', ar: 'مثال: 420' }
      }
    ]
  },
  {
    id: 'preferences',
    title: { en: 'Design Preferences', ar: 'تفضيلات التصميم' },
    lede: {
      en: 'Which sustainable solutions interest you? Choose any.',
      ar: 'ما الحلول المستدامة التي تهمك؟ اختر ما تشاء.'
    },
    fields: [
      {
        id: 'sustainability_prefs', type: 'checks', required: false, otherId: 'sustainability_other',
        label: { en: 'Sustainability Preferences / Preferred Solutions', ar: 'تفضيلات الاستدامة / الحلول المفضّلة' },
        options: [
          { value: 'solar', en: 'Solar energy', ar: 'الطاقة الشمسية' },
          { value: 'insulation', en: 'Natural insulation', ar: 'العزل الطبيعي' },
          { value: 'local_materials', en: 'Local materials', ar: 'مواد محلية' },
          { value: 'water', en: 'Water-saving systems', ar: 'أنظمة توفير المياه' },
          { value: 'green_roofs', en: 'Green walls / roofs', ar: 'جدران / أسطح خضراء' },
          { value: 'smart', en: 'Smart home / IoT systems', ar: 'أنظمة المنزل الذكي' },
          { value: 'other', en: 'Other', ar: 'أخرى' }
        ]
      }
    ]
  },
  {
    id: 'goals',
    title: { en: 'Sustainability Goals', ar: 'أهداف الاستدامة' },
    lede: {
      en: 'What matters most to this project? Choose any.',
      ar: 'ما الأهم بالنسبة لهذا المشروع؟ اختر ما تشاء.'
    },
    fields: [
      {
        id: 'priorities', type: 'checks', required: false, otherId: 'priorities_other',
        label: { en: 'Priorities & Needs / Main Objective', ar: 'الأولويات والاحتياجات / الهدف الرئيسي' },
        options: [
          { value: 'carbon', en: 'Reduce carbon footprint', ar: 'تقليل البصمة الكربونية' },
          { value: 'energy', en: 'Save energy', ar: 'توفير الطاقة' },
          { value: 'water', en: 'Save water', ar: 'توفير المياه' },
          { value: 'costs', en: 'Reduce costs', ar: 'خفض التكاليف' },
          { value: 'comfort', en: 'Improve thermal comfort', ar: 'تحسين الراحة الحرارية' },
          { value: 'other', en: 'Other', ar: 'أخرى' }
        ]
      }
    ]
  },
  {
    id: 'budget',
    title: { en: 'Budget & Timeline', ar: 'الميزانية والجدول الزمني' },
    lede: {
      en: 'A rough range is enough at this stage.',
      ar: 'نطاق تقريبي يكفي في هذه المرحلة.'
    },
    fields: [
      {
        id: 'budget_range', type: 'radio', required: false,
        label: { en: 'Budget Range', ar: 'نطاق الميزانية' },
        options: [
          { value: 'low', en: 'Low', ar: 'منخفض' },
          { value: 'medium', en: 'Medium', ar: 'متوسط' },
          { value: 'high', en: 'High', ar: 'مرتفع' }
        ]
      },
      {
        /* optional addition — not in the original Google Form; delete to match 1:1 */
        id: 'timeline', type: 'radio', required: false,
        label: { en: 'Target Timeline (optional)', ar: 'الإطار الزمني المستهدف (اختياري)' },
        options: [
          { value: 'lt6m', en: 'Under 6 months', ar: 'أقل من 6 أشهر' },
          { value: '6to12m', en: '6–12 months', ar: '6–12 شهرًا' },
          { value: 'gt12m', en: 'Over a year', ar: 'أكثر من سنة' },
          { value: 'flexible', en: 'Flexible', ar: 'مرن' }
        ]
      }
    ]
  },
  {
    id: 'notes',
    title: { en: 'Additional Notes', ar: 'ملاحظات إضافية' },
    lede: {
      en: 'Anything else we should know — site constraints, references, ambitions.',
      ar: 'أي شيء آخر يجب أن نعرفه — قيود الموقع، مراجع، طموحات.'
    },
    fields: [
      {
        id: 'additional_comments', type: 'textarea', required: false, rows: 5,
        label: { en: 'Additional comments', ar: 'ملاحظات إضافية' },
        placeholder: {
          en: 'Tell us anything that will help us understand the project…',
          ar: 'أخبرنا بأي شيء يساعدنا على فهم المشروع…'
        }
      }
    ]
  }
];

export const formCopy = {
  en: {
    kicker: 'START YOUR PROJECT',
    title: 'Green Building Design Request',
    intro:
      'Tell us about your project to receive tailored, climate-adapted green building solutions — low carbon, energy- and water-efficient, using local materials.',
    next: 'Continue',
    back: 'Back',
    submit: 'Submit request',
    submitting: 'Submitting…',
    otherPlaceholder: 'Please specify…',
    requiredMark: 'required',
    errRequired: 'This field is required.',
    errEmail: 'Please enter a valid email address.',
    errNumber: 'Please enter a valid number.',
    errSubmit: 'Something went wrong while submitting. Please try again.',
    stepOf: (a, b) => `Step ${a} of ${b}`,
    successTitle: 'Thank you.',
    successLines: [
      'Your project has been received successfully.',
      'Our AI agents are now reviewing your requirements.',
      'A NumidAI architect will contact you shortly.'
    ],
    successRef: 'Your project reference',
    successHome: 'Back to home'
  },
  ar: {
    kicker: 'ابدأ مشروعك',
    title: 'طلب تصميم مبنى أخضر',
    intro:
      'أخبرنا عن مشروعك لتحصل على حلول بناء خضراء متكيّفة مع المناخ — منخفضة الكربون، موفّرة للطاقة والمياه، وبمواد محلية.',
    next: 'متابعة',
    back: 'رجوع',
    submit: 'إرسال الطلب',
    submitting: 'جارٍ الإرسال…',
    otherPlaceholder: 'يرجى التحديد…',
    requiredMark: 'إلزامي',
    errRequired: 'هذا الحقل إلزامي.',
    errEmail: 'يرجى إدخال بريد إلكتروني صحيح.',
    errNumber: 'يرجى إدخال رقم صحيح.',
    errSubmit: 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.',
    stepOf: (a, b) => `الخطوة ${a} من ${b}`,
    successTitle: 'شكرًا لك.',
    successLines: [
      'تم استلام مشروعك بنجاح.',
      'يقوم وكلاء الذكاء الاصطناعي لدينا الآن بمراجعة متطلباتك.',
      'سيتواصل معك معماري من NumidAI قريبًا.'
    ],
    successRef: 'الرقم المرجعي لمشروعك',
    successHome: 'العودة إلى الرئيسية'
  }
};
