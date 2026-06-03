export type Lang = "ar" | "en";

export const translations = {
  ar: {
    dir: "rtl" as const,
    fontClass: "font-arabic",
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      services: "الخدمات",
      jobs: "الوظائف",
      booking: "الحجز",
      projects: "المشاريع",
      partners: "الشركاء",
      contact: "تواصل معنا",
      cta: "احجز استشارة",
    },
    hero: {
      label: "حلول تكنولوجيا وشبكات للمؤسسات والأعمال",
      title: "نوظف التكنولوجيا الذكية، لأعمال أكثر استقراراً",
      sub: "حلول متقدمة في الشبكات، البنية التحتية الرقمية، أنظمة المراقبة، أنظمة الجهد المنخفض، البرامج الإدارية، وتجهيزات الحاسوب منذ عام 2022.",
      para: "تدعم شركة أبراج الماس الأفراد والشركات بأحدث خدمات تكنولوجيا المعلومات والبنية التحتية الرقمية، من التخطيط والاستشارة إلى التجهيز والتركيب والصيانة، مع الالتزام بالجودة والموثوقية وسرعة التنفيذ.",
      primary: "احجز استشارة تقنية",
      secondary: "استعرض الخدمات",
      third: "شاهد شركاءنا",
      badges: [
        "تأسست عام 2022",
        "تصميم وتنفيذ الشبكات",
        "أنظمة المراقبة والحماية",
        "أنظمة الجهد المنخفض",
        "برامج إدارة المؤسسات",
        "استشارات تقنية",
      ],
    },
    about: {
      title: "من نحن",
      subtitle: "شركة أبراج الماس متخصصة في خدمات التكنولوجيا والشبكات لتقديم حلول تكنولوجية متكاملة.",
      p1: "تأسست شركة أبراج الماس عام 2022، وتتمثل مهمتنا في دعم الأفراد والشركات بأحدث خدمات تكنولوجيا المعلومات والبنية التحتية الرقمية، مع الالتزام بأعلى معايير الجودة والاحترافية.",
      p2: "نؤمن بأن التكنولوجيا هي أساس النجاح في عالمنا المعاصر، لذلك نلتزم بتقديم حلول مبتكرة وفعالة تلبي احتياجات عملائنا بدقة، مع الحفاظ على الموثوقية وسرعة التنفيذ.",
      cards: [
        { title: "رسالتنا", text: "نقدم مجموعة واسعة من الخدمات تشمل تصميم الشبكات وتنفيذها، صيانة الأنظمة، حلول المراقبة والأمن، توريد وتركيب المعدات التقنية، والاستشارات التقنية لمساعدة عملائنا على تطوير أعمالهم ومواكبة التطورات الرقمية." },
        { title: "فريقنا", text: "يتألف فريقنا من نخبة من المهندسين والفنيين ذوي الخبرة العالية، يعملون بتعاون وثيق لضمان تقديم أفضل الخدمات وتحقيق رضا العملاء." },
        { title: "شراكات طويلة الأمد", text: "نسعى في أبراج الماس إلى بناء شراكات طويلة الأمد، ونطمح لأن نكون الخيار الأمثل في مجال خدمات التكنولوجيا والشبكات." },
      ],
    },
    vision: {
      title: "رؤيتنا",
      text: "أن نكون من الشركات الرائدة في مجال تكنولوجيا المعلومات والشبكات في العراق، وأن نساهم في تطوير البنية التحتية الرقمية وتقديم حلول مبتكرة تواكب التطور العالمي.",
    },
    whyUs: {
      title: "لماذا أبراج الماس؟",
      items: [
        { title: "تنفيذ عالي الجودة", text: "تنفيذ احترافي وفق معايير تقنية دقيقة لضمان استقرار الأنظمة وجودة النتائج." },
        { title: "سرعة فائقة", text: "استجابة سريعة، تنفيذ منظم، وتحسين أداء الشبكات والأنظمة بما يناسب بيئة العمل." },
        { title: "أسعار تنافسية", text: "حلول عملية تحقق توازناً بين الجودة والتكلفة والقيمة طويلة الأمد." },
        { title: "دعم فني متواصل", text: "متابعة وصيانة ودعم مستمر للحفاظ على استقرار الأنظمة وتشغيلها دون انقطاع." },
        { title: "فريق متخصص وذو خبرة", text: "مهندسون وفنيون بخبرة عملية في التخطيط والتنفيذ والصيانة والاستشارات." },
      ],
    },
    services: {
      title: "خدماتنا التقنية المتكاملة",
      subtitle: "نقدم مجموعة شاملة من الحلول التقنية المصممة لتلبية احتياجات الأفراد والشركات من جميع الأحجام.",
      bookCta: "احجز هذه الخدمة",
      items: [
        { title: "تصميم وتنفيذ الشبكات والألياف الضوئية", desc: "نقوم بتصميم وتنفيذ الشبكات الداخلية والخارجية LAN/WAN باستخدام أحدث التقنيات لضمان اتصال سريع ومستقر وآمن، مع تمديد وربط شبكات الألياف الضوئية لضمان نقل بيانات عالي السرعة والكفاءة.", features: ["تصميم شبكات LAN/WAN","تمديد كابلات الشبكات","تمديد وربط الألياف الضوئية","إعداد الراوترات والسويتشات","نقل بيانات عالي السرعة","الالتزام بمعايير الأمان والكفاءة"] },
        { title: "صيانة وإدارة الشبكات", desc: "نقدم خدمات الصيانة الدورية وإدارة الشبكات الشاملة، بالإضافة إلى تحديثات الأنظمة والمراقبة ومعالجة الأعطال لضمان التشغيل دون انقطاع.", features: ["صيانة دورية","إدارة الشبكة","مراقبة الأداء","معالجة الأعطال","تحديث الأنظمة","تحسين الأداء"] },
        { title: "أنظمة كاميرات المراقبة والحماية", desc: "نقوم بتوريد وتركيب كاميرات مراقبة عالية الجودة، مع أنظمة التسجيل والمراقبة عن بعد لضمان حماية المنشآت على مدار الساعة.", features: ["كاميرات مراقبة CCTV","أنظمة IP Camera","إعداد NVR/DVR","مراقبة عن بعد","حماية المنشآت","أنظمة التحكم الأمني"] },
        { title: "توريد وتركيب المعدات التقنية", desc: "نوفر ونركب أجهزة الكمبيوتر واللابتوبات والخوادم ومعدات الشبكات مثل الراوترات والسويتشات، إضافة إلى خدمات الاتصال بالإنترنت والدعم الفني والاستشارات.", features: ["أجهزة كمبيوتر ولابتوبات","تجهيز الخوادم","راوترات وسويتشات","معدات الشبكات","ربط الإنترنت","دعم فني واستشارات"] },
        { title: "أنظمة الجهد المنخفض", desc: "نقدم حلول أنظمة الجهد المنخفض والأنظمة الضعيفة للمباني والشركات والمكاتب والمتاجر والمنشآت، بما يشمل الأنظمة المركزية وأنظمة الإنذار والصوت والتحكم.", features: ["أنظمة الأقمار الصناعية المركزية","أنظمة إنذار الحريق","أنظمة الصوت المركزية","أنظمة المراقبة","أنظمة التحكم الأمني","تكامل الأنظمة الضعيفة"] },
        { title: "برامج إدارة المؤسسات", desc: "نوفر حلولاً برمجية لإدارة الأعمال تشمل المحاسبة، الموارد البشرية، الحضور والانصراف، المخزون، نقاط البيع، وإدارة المشاريع.", features: ["برامج المحاسبة","برامج الموارد البشرية","الحضور والانصراف","إدارة المخزون","نقاط البيع POS","إدارة المشاريع"] },
        { title: "الاستشارات التقنية", desc: "نقدم استشارات تقنية احترافية لمساعدة العملاء على تطوير أعمالهم، اختيار الحلول المناسبة، تحسين البنية التحتية، ومواكبة التحول الرقمي.", features: ["تخطيط البنية التحتية","استشارات تقنية","استراتيجية تطوير الأنظمة","تحسين إجراءات العمل","توصيات الأمان","خارطة طريق تقنية"] },
        { title: "الاتصال بالإنترنت والدعم الفني", desc: "نقدم خدمات إعداد الاتصال بالإنترنت، تحسين التغطية، تجهيز نقاط الوصول، اختبار الأداء، ومعالجة المشاكل الفنية لضمان استقرار التشغيل.", features: ["إعداد الاتصال بالإنترنت","نقاط الوصول","تخطيط تغطية Wi-Fi","اختبار الأداء","دعم فني","معالجة الأعطال الميدانية"] },
        { title: "البيت الذكي والمؤسسات الذكية", desc: "حوّل منزلك أو مؤسستك إلى بيئة ذكية متكاملة تمنحك الراحة والأمان والتحكم الكامل في إدارة المنزل، من الإضاءة والتكييف وأنظمة المراقبة والأجهزة المنزلية بسهولة عبر الهاتف الذكي أو الأوامر الصوتية أو الشاشات الذكية، مع إمكانية إنشاء سيناريوهات مخصصة تناسب أسلوب حياتك وتساعد على ترشيد استهلاك الطاقة، ومناسبة للاستخدام اليومي.", features: ["التحكم بالإضاءة والتكييف","أنظمة المراقبة الذكية","التحكم عبر الهاتف الذكي","الأوامر الصوتية والشاشات الذكية","سيناريوهات مخصصة","ترشيد استهلاك الطاقة"] },
      ],
    },
    process: {
      title: "من التقييم إلى التنفيذ",
      subtitle: "منهجية عمل منظمة لضمان تقديم أنظمة تقنية مستقرة وآمنة وقابلة للتوسع.",
      steps: [
        { title: "التقييم الفني", text: "نقوم بدراسة الموقع واحتياجات العمل وسعة الشبكة ومتطلبات الأمان وأهداف التشغيل." },
        { title: "تصميم الحل", text: "نضع خطة تقنية قابلة للتوسع تشمل الأجهزة، الشبكات، الاتصال، الأمان، وتكامل الأنظمة." },
        { title: "التوريد والتركيب الاحترافي", text: "نوفر المعدات المطلوبة، نركب الأنظمة، نضبط الأجهزة، ونجهز البنية التحتية." },
        { title: "الاختبار والتسليم", text: "نختبر الأداء والاستقرار والأمان والتسجيل والاتصال، ونوثق العمل المنجز." },
        { title: "الصيانة والدعم المستمر", text: "نقدم التحديثات والمراقبة ومعالجة الأعطال وتحسين الأداء والدعم الفني طويل الأمد." },
      ],
    },
    booking: {
      title: "احجز استشارتك التقنية",
      subtitle: "اختر الخدمة المطلوبة، أرسل تفاصيل مشروعك، وسيقوم فريقنا التقني بالتواصل معك لتقديم الحل المناسب.",
      steps: ["اختيار الخدمة","تفاصيل المشروع","معلومات التواصل","مراجعة الطلب","تم الإرسال"],
      stepLabel: "الخطوة",
      next: "التالي",
      back: "رجوع",
      submit: "إرسال الطلب",
      sendWa: "إرسال عبر واتساب",
      services: [
        "تصميم الشبكات والألياف الضوئية",
        "صيانة وإدارة الشبكات",
        "كاميرات المراقبة وأنظمة الحماية",
        "توريد وتركيب المعدات التقنية",
        "أنظمة الجهد المنخفض",
        "برامج إدارة المؤسسات",
        "الاستشارات التقنية",
        "الاتصال بالإنترنت والدعم الفني",
        "البيت الذكي والمؤسسات الذكية",
        "خدمة أخرى",
      ],
      labels: {
        projectType: "نوع المشروع",
        location: "موقع المشروع",
        preferredDate: "تاريخ الزيارة المفضل",
        preferredTime: "وقت الزيارة المفضل",
        urgency: "درجة الاستعجال",
        projectSize: "حجم المشروع المتوقع",
        projectDescription: "وصف المشروع",
        upload: "رفع ملف / مخطط / صور للنظام الحالي",
        fullName: "الاسم الكامل",
        companyName: "اسم الشركة",
        phone: "رقم الهاتف",
        whatsapp: "رقم واتساب",
        email: "البريد الإلكتروني",
        city: "المدينة",
        contactMethod: "طريقة التواصل المفضلة",
        selected: "الخدمات المختارة",
        notes: "الملاحظات",
      },
      projectTypes: ["منزل","مكتب","شركة","متجر","مخزن","فندق","مدرسة / معهد","جهة حكومية / منظمة","أخرى"],
      urgencies: ["عادي","مستعجل","طارئ"],
      sizes: ["صغير","متوسط","كبير","مؤسسي"],
      contactMethods: ["اتصال هاتفي","واتساب","بريد إلكتروني"],
      validation: {
        services: "يرجى اختيار خدمة واحدة على الأقل.",
        fullName: "يرجى كتابة الاسم الكامل.",
        phone: "يرجى إدخال رقم الهاتف أو رقم واتساب.",
        location: "يرجى كتابة موقع المشروع.",
        description: "يرجى كتابة وصف المشروع.",
        contactMethod: "يرجى اختيار طريقة التواصل المفضلة.",
        projectType: "يرجى اختيار نوع المشروع.",
      },
      success: {
        title: "تم استلام طلبك بنجاح",
        message: "شكراً لتواصلك مع شركة أبراج الماس. سيقوم فريقنا التقني بمراجعة طلبك والتواصل معك قريباً.",
        backHome: "العودة للرئيسية",
        another: "إرسال طلب آخر",
        contactWa: "التواصل عبر واتساب",
      },
      waTemplate: (d: any) => `مرحباً شركة أبراج الماس،
أرغب بحجز استشارة تقنية.

الخدمات المطلوبة:
${(d.selectedServices || []).join("، ")}

نوع المشروع: ${d.projectType}
الموقع: ${d.location}
التاريخ المفضل: ${d.preferredDate}
الوقت المفضل: ${d.preferredTime}
درجة الاستعجال: ${d.urgency}

تفاصيل المشروع:
${d.projectDescription}

الاسم: ${d.fullName}
الشركة: ${d.companyName}
الهاتف: ${d.phone}
واتساب: ${d.whatsapp}
البريد الإلكتروني: ${d.email}
طريقة التواصل المفضلة: ${d.preferredContactMethod}`,
    },
    jobs: {
      title: "انضم إلى فريق أبراج الماس",
      subtitle: "نبحث عن الكفاءات والمواهب المتميزة للانضمام إلى فريقنا التقني المتخصص في الشبكات والتكنولوجيا.",
      intro: "شركة أبراج الماس تتطلع دائماً لتوسيع فريقها بإضافة مهندسين وفنيين ومتخصصين في مجال تكنولوجيا المعلومات والشبكات. إذا كنت تمتلك الخبرة والشغف في هذا المجال، نرحب بك للتقديم والانضمام إلينا.",
      whyJoin: "لماذا تنضم إلينا؟",
      benefits: [
        { title: "بيئة عمل احترافية", text: "فريق عمل متعاون ومشاريع تقنية متنوعة ومتطورة." },
        { title: "فرص التطور", text: "تدريب مستمر واكتساب خبرات عملية في أحدث التقنيات." },
        { title: "رواتب تنافسية", text: "نقدم مقابل مادي عادل مع حوافز ومزايا إضافية." },
        { title: "مشاريع متنوعة", text: "العمل على مشاريع حكومية، تجارية، سكنية، ومؤسسية." },
      ],
      openPositions: "الوظائف المتاحة",
      positions: [
        { title: "مهندس شبكات", type: "دوام كامل", desc: "خبرة في تصميم وتنفيذ الشبكات LAN/WAN والألياف الضوئية وإعداد المعدات الشبكية." },
        { title: "فني أنظمة مراقبة", type: "دوام كامل", desc: "خبرة في تركيب وصيانة كاميرات المراقبة وأنظمة IP Camera وNVR/DVR." },
        { title: "فني جهد منخفض", type: "دوام كامل", desc: "خبرة في أنظمة الجهد المنخفض والأنظمة الضعيفة وإنذار الحريق والصوت المركزي." },
        { title: "مندوب مبيعات تقني", type: "دوام كامل", desc: "خبرة في المبيعات التقنية وتسويق الحلول والمعدات للشركات والمؤسسات." },
        { title: "مطور برمجيات", type: "دوام كامل", desc: "خبرة في تطوير أنظمة إدارة المؤسسات والتطبيقات الويب والمحاسبة." },
      ],
      applyNow: "قدّم طلبك الآن",
      formTitle: "نموذج التقديم الوظيفي",
      labels: {
        fullName: "الاسم الكامل",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        whatsapp: "رقم واتساب",
        position: "الوظيفة المطلوبة",
        experience: "سنوات الخبرة",
        education: "المؤهل العلمي",
        specialization: "التخصص",
        skills: "المهارات التقنية",
        cv: "رفع السيرة الذاتية (PDF)",
        portfolio: "رفع شهادات أو أعمال سابقة (اختياري)",
        message: "رسالة إضافية",
        selectedPosition: "الوظيفة المختارة",
      },
      educationLevels: ["ثانوية","دبلوم","بكالوريوس","ماجستير","دكتوراه"],
      experienceYears: ["أقل من سنة","1-3 سنوات","3-5 سنوات","5-10 سنوات","أكثر من 10 سنوات"],
      submit: "إرسال الطلب",
      sendWa: "إرسال الطلب",
      validation: {
        fullName: "الرجاء إدخال الاسم الكامل.",
        email: "الرجاء إدخال البريد الإلكتروني.",
        phone: "الرجاء إدخال رقم الهاتف.",
        position: "الرجاء اختيار الوظيفة المطلوبة.",
        experience: "الرجاء تحديد سنوات الخبرة.",
        education: "الرجاء تحديد المؤهل العلمي.",
        specialization: "الرجاء إدخال التخصص.",
        skills: "الرجاء إدخال المهارات التقنية.",
      },
      success: {
        title: "تم استلام طلبك الوظيفي بنجاح",
        message: "شكراً لاهتمامك بالانضمام إلى فريق أبراج الماس. سنقوم بمراجعة طلبك والتواصل معك في حال تطابق مؤهلاتك مع متطلبات الوظيفة.",
        backHome: "العودة للرئيسية",
        another: "تقديم طلب آخر",
        contactWa: "تواصل بواتساب",
      },
      waTemplate: (d: any) => `مرحباً أبراج الماس،
أود التقديم على وظيفة.

الوظيفة المطلوبة: ${d.position}
الاسم: ${d.fullName}
التخصص: ${d.specialization}
المؤهل العلمي: ${d.education}
سنوات الخبرة: ${d.experience}

المهارات التقنية:
${d.skills}

رقم الهاتف: ${d.phone}
واتساب: ${d.whatsapp}
البريد الإلكتروني: ${d.email}

${d.message ? 'رسالة إضافية:\n' + d.message : ''}`,
    },
    projects: {
      title: "أبرز مشاريعنا المنجزة",
      subtitle: "نفتخر بتنفيذ مجموعة مميزة من المشاريع في مجال الشبكات والتكنولوجيا، تعكس خبرتنا وجودة خدماتنا.",
      categoryLabel: "التصنيف",
      statusLabel: "الحالة",
      status: "مشروع منجز",
      categories: ["شبكات","كاميرات","بنية تحتية","أنظمة تقنية"],
      items: [
        "وزارة الخارجية","سكن بغداد - المنطقة الخضراء","قصر الشام","أبراج النخيل","النخيل مول","HOD","EISB","قرية تجديد","المصدر العلمي","مشروع إضافي",
      ],
    },
    partners: {
      title: "شركاؤنا في التقنية",
      subtitle: "تشمل شبكة شركائنا مجموعة من الشركات الرائدة والموردين المعتمدين في مجالات الشبكات، أنظمة المراقبة، وأجهزة الاتصالات، مما يمكننا من تقديم حلول متكاملة باستخدام أحدث التقنيات العالمية.",
    },
    business: {
      title: "حلول مصممة لكل بيئة عمل",
      items: [
        { title: "الشركات والمكاتب", text: "شبكات داخلية واتصال داخلي، نقاط وصول، خوادم البيانات، كاميرات مراقبة، متحسسات إنذار الحرائق، برامج إدارية متكاملة، ربط أفرع المؤسسات بخادم بيانات موحد." },
        { title: "المتاجر ونقاط البيع", text: "كاميرات، إدارة المخازن، إدارة المبيعات، ربط الإنترنت، أنظمة الحماية، دعم فني." },
        { title: "المخازن والمستودعات", text: "مراقبة، تغطية شبكية، تحكم أمني، تخزين، وأنظمة جهد منخفض." },
        { title: "الفنادق والضيافة", text: "تغطية Wi-Fi، كاميرات، صوت مركزي، أنظمة أقمار صناعية، ودعم فني." },
        { title: "المدارس والمعاهد", text: "شبكات، كاميرات، مختبرات، خوادم، أنظمة حضور، ومراقبة." },
        { title: "الجهات الحكومية والمنظمات", text: "بنية تحتية مؤسسية، أنظمة حماية، أنظمة الشبكات المشتركة والمنفصلة، حلول رقمية، كاميرات مراقبة، أنظمة أمنية وإنذار." },
        { title: "المجمعات السكنية", text: "كاميرات مراقبة، توزيع الإنترنت، حماية من الحرائق والإنذار، أنظمة ومنازل ذكية، بوابات دخول، منظومات الصوتيات، أنظمة الأقمار الصناعية المركزية، برامج إدارة المبيعات والمستودعات والأفراد." },
        { title: "غرف السيرفر والشبكات", text: "راكات، سويتشات، راوترات، خوادم، تنظيم كابلات، وتحسين أداء." },
      ],
    },
    contact: {
      title: "جاهز لبناء بنية رقمية أقوى؟",
      subtitle: "أخبرنا بما تحتاجه شركتك أو مشروعك، وسنساعدك في التخطيط والتركيب والتأمين والصيانة للحل التقني المناسب.",
      location: "العراق",
      labels: { fullName: "الاسم الكامل", company: "اسم الشركة", phone: "رقم الهاتف", email: "البريد الإلكتروني", service: "الخدمة المطلوبة", message: "الرسالة", send: "إرسال الرسالة" },
      quick: { call: "اتصل الآن", wa: "تواصل عبر واتساب", book: "احجز استشارة", email: "أرسل بريد إلكتروني" },
    },
    footer: {
      tagline: "Network, Computers, Cameras",
      desc: "تقدم شركة أبراج الماس حلولاً متقدمة في الشبكات، الحاسبات، الكاميرات، أنظمة الجهد المنخفض، البرامج الإدارية، والبنية التحتية الرقمية للأفراد والشركات الحديثة.",
      colServicesTitle: "الخدمات",
      colServices: ["تصميم الشبكات والألياف الضوئية","أنظمة المراقبة والحماية","أنظمة الجهد المنخفض","برامج إدارة المؤسسات","المعدات التقنية","صيانة الشبكات"],
      colCompanyTitle: "الشركة",
      colCompany: ["من نحن","رؤيتنا","الخدمات","الحجز","المشاريع","الشركاء","تواصل معنا"],
      colContactTitle: "التواصل",
      colContact: ["www.abrajalmas.com","info@abrajalmas.com","07838904041","07829904041","07702904041","العراق"],
      copyright: "© 2026 شركة أبراج الماس. جميع الحقوق محفوظة.",
    },
    floating: { book: "احجز الآن" },
  },
  en: {
    dir: "ltr" as const,
    fontClass: "font-english",
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      jobs: "Careers",
      booking: "Booking",
      projects: "Projects",
      partners: "Partners",
      contact: "Contact",
      cta: "Book a Consultation",
    },
    hero: {
      label: "Enterprise Technology & Network Solutions",
      title: "Smart Technology for More Stable Operations",
      sub: "Advanced solutions in networking, digital infrastructure, CCTV, low-voltage systems, enterprise software, and IT equipment since 2022.",
      para: "ABRAJ ALMAS supports individuals and businesses with modern IT and digital infrastructure services, from planning and consulting to supply, installation, maintenance, and support, with a focus on quality, reliability, and fast execution.",
      primary: "Book a Technical Consultation",
      secondary: "Explore Services",
      third: "View Our Partners",
      badges: [
        "Established in 2022",
        "Network Design & Implementation",
        "CCTV & Security",
        "Low-Voltage Systems",
        "Enterprise Software",
        "Technical Consulting",
      ],
    },
    about: {
      title: "About ABRAJ ALMAS",
      subtitle: "ABRAJ ALMAS specializes in technology and network services, delivering integrated technology solutions.",
      p1: "Established in 2022, ABRAJ ALMAS supports individuals and businesses with the latest IT and digital infrastructure services while adhering to the highest standards of quality and professionalism.",
      p2: "We believe technology is the foundation of success in today's world. Therefore, we provide innovative and effective solutions that precisely meet client needs while maintaining reliability and speed in execution.",
      cards: [
        { title: "Our Mission", text: "We provide a wide range of services including network design and implementation, systems maintenance, monitoring and security solutions, supply and installation of technical equipment, and technical consulting to help clients develop their businesses and keep pace with digital advancement." },
        { title: "Our Team", text: "Our team includes experienced engineers and technicians who work collaboratively to deliver high-quality services and achieve customer satisfaction." },
        { title: "Long-Term Partnerships", text: "ABRAJ ALMAS aims to build long-term partnerships and become the preferred choice for technology and network services." },
      ],
    },
    vision: {
      title: "Our Vision",
      text: "To be among the leading companies in information technology and networks in Iraq, contributing to the development of digital infrastructure and providing innovative solutions that keep pace with global development.",
    },
    whyUs: {
      title: "Why Choose ABRAJ ALMAS?",
      items: [
        { title: "High-Quality Execution", text: "Professional implementation aligned with strict technical standards to ensure stability and quality." },
        { title: "Ultra-Fast Speed", text: "Fast response, organized deployment, and optimized network and system performance." },
        { title: "Competitive Prices", text: "Practical solutions that balance quality, cost, and long-term value." },
        { title: "Continuous Technical Support", text: "Ongoing support, maintenance, and follow-up to keep systems stable and operational." },
        { title: "Specialized Expert Team", text: "Experienced engineers and technicians for planning, implementation, maintenance, and consulting." },
      ],
    },
    services: {
      title: "Integrated Technology Services",
      subtitle: "A complete range of technology solutions designed to meet the needs of individuals and businesses of all sizes.",
      bookCta: "Book This Service",
      items: [
        { title: "Network Design, Implementation & Fiber Optics", desc: "We design and implement internal and external LAN/WAN networks using modern technologies to ensure fast, stable, secure, and efficient connectivity. We also extend and connect fiber optic networks for high-speed data transmission.", features: ["LAN/WAN network design","Structured cabling","Fiber optic installation","Routing and switching","High-speed data transmission","Security and efficiency standards"] },
        { title: "Network Maintenance & Management", desc: "We provide regular maintenance, comprehensive network management, system updates, monitoring, troubleshooting, and optimization to ensure uninterrupted operation.", features: ["Periodic maintenance","Network management","Performance monitoring","Troubleshooting","System updates","Performance optimization"] },
        { title: "CCTV & Security Systems", desc: "We supply and install high-quality CCTV cameras, recording systems, remote monitoring systems, and security infrastructure to protect facilities 24/7.", features: ["CCTV cameras","IP camera systems","NVR/DVR setup","Remote monitoring","Facility protection","Security control systems"] },
        { title: "Supply & Installation of Technical Equipment", desc: "We supply and install computers, laptops, servers, routers, switches, network devices, internet connectivity equipment, and technical infrastructure.", features: ["PC and laptop supply","Server setup","Routers and switches","Network equipment","Internet connectivity","Technical support and consulting"] },
        { title: "Low-Voltage Systems", desc: "We provide integrated low-voltage and low-current systems for buildings, companies, offices, retail spaces, and enterprise facilities.", features: ["Central satellite systems","Fire alarm systems","Central audio systems","Security monitoring systems","Control systems","Low-current integration"] },
        { title: "Enterprise Management Software", desc: "We provide business software solutions for accounting, HR, attendance, inventory, POS, workflow, and project management.", features: ["Accounting software","HR software","Attendance and timekeeping","Inventory management","Point-of-sale systems","Project management software"] },
        { title: "Technical Consulting", desc: "We provide professional consulting to help clients improve operations, choose the right technology, develop infrastructure, and keep pace with digital transformation.", features: ["Infrastructure planning","Technology advisory","System upgrade strategy","Business process optimization","Security recommendations","Long-term development roadmap"] },
        { title: "Internet Connectivity & Support", desc: "We provide network connectivity setup, internet infrastructure support, technical troubleshooting, Wi-Fi coverage planning, and ongoing operational assistance.", features: ["Internet connectivity setup","Network access points","Wi-Fi coverage planning","Performance testing","Technical support","Site troubleshooting"] },
        { title: "Smart Home & Smart Enterprise", desc: "Transform your home or business into a fully integrated smart environment that gives you comfort, safety, and complete control. Manage lighting, climate, surveillance, and home appliances easily via smartphone, voice commands, or smart panels, with custom scenarios tailored to your lifestyle that help save energy and suit daily use.", features: ["Lighting & climate control","Smart surveillance systems","Smartphone control","Voice commands & smart panels","Custom automation scenarios","Energy consumption savings"] },
      ],
    },
    process: {
      title: "From Assessment to Deployment",
      subtitle: "A structured workflow designed to deliver stable, secure, and scalable technology systems.",
      steps: [
        { title: "Technical Assessment", text: "We study the site, business needs, network capacity, security requirements, and operational goals." },
        { title: "Solution Design", text: "We create a scalable plan covering hardware, topology, connectivity, safety, and system integration." },
        { title: "Supply & Professional Installation", text: "We supply the required equipment, install the systems, configure devices, and prepare the infrastructure." },
        { title: "Testing & Handover", text: "We test performance, stability, security, recording, connectivity, and document the delivered work." },
        { title: "Maintenance & Continuous Support", text: "We provide updates, monitoring, troubleshooting, optimization, and long-term technical support." },
      ],
    },
    booking: {
      title: "Book Your Technology Consultation",
      subtitle: "Choose the service you need, share your project details, and our technical team will contact you to plan the right solution.",
      steps: ["Select Service","Project Details","Contact Information","Review & Submit","Success"],
      stepLabel: "Step",
      next: "Next",
      back: "Back",
      submit: "Send Booking Request",
      sendWa: "Send via WhatsApp",
      services: [
        "Network Design & Fiber Optics",
        "Network Maintenance & Management",
        "CCTV & Security Systems",
        "Technical Equipment Supply & Installation",
        "Low-Voltage Systems",
        "Enterprise Management Software",
        "Technical Consulting",
        "Internet Connectivity & Support",
        "Smart Home & Smart Enterprise",
        "Other Service",
      ],
      labels: {
        projectType: "Project Type",
        location: "Project Location",
        preferredDate: "Preferred Visit Date",
        preferredTime: "Preferred Visit Time",
        urgency: "Project Urgency",
        projectSize: "Estimated Project Size",
        projectDescription: "Project Description",
        upload: "Upload File / Layout / Existing System Photos",
        fullName: "Full Name",
        companyName: "Company Name",
        phone: "Phone Number",
        whatsapp: "WhatsApp Number",
        email: "Email Address",
        city: "City",
        contactMethod: "Preferred Contact Method",
        selected: "Selected Services",
        notes: "Notes",
      },
      projectTypes: ["Residential","Office","Company","Retail Store","Warehouse","Hotel","School / Institute","Government / Organization","Other"],
      urgencies: ["Normal","Urgent","Emergency"],
      sizes: ["Small","Medium","Large","Enterprise"],
      contactMethods: ["Phone Call","WhatsApp","Email"],
      validation: {
        services: "Please select at least one service.",
        fullName: "Please enter your full name.",
        phone: "Please enter a phone number or WhatsApp number.",
        location: "Please enter the project location.",
        description: "Please enter the project description.",
        contactMethod: "Please select a preferred contact method.",
        projectType: "Please select a project type.",
      },
      success: {
        title: "Your request has been received.",
        message: "Thank you for contacting ABRAJ ALMAS. Our technical team will review your request and contact you shortly.",
        backHome: "Back to Home",
        another: "Submit Another Request",
        contactWa: "Contact by WhatsApp",
      },
      waTemplate: (d: any) => `Hello ABRAJ ALMAS,
I would like to request a technology consultation.

Selected Services:
${(d.selectedServices || []).join(", ")}

Project Type: ${d.projectType}
Location: ${d.location}
Preferred Date: ${d.preferredDate}
Preferred Time: ${d.preferredTime}
Urgency: ${d.urgency}

Project Details:
${d.projectDescription}

Customer Name: ${d.fullName}
Company: ${d.companyName}
Phone: ${d.phone}
WhatsApp: ${d.whatsapp}
Email: ${d.email}
Preferred Contact Method: ${d.preferredContactMethod}`,
    },
    jobs: {
      title: "Join ABRAJ ALMAS Team",
      subtitle: "We are looking for distinguished talents and competencies to join our specialized technical team in networks and technology.",
      intro: "ABRAJ ALMAS is always looking to expand its team by adding engineers, technicians, and specialists in the field of information technology and networks. If you have experience and passion in this field, we welcome you to apply and join us.",
      whyJoin: "Why Join Us?",
      benefits: [
        { title: "Professional Work Environment", text: "Collaborative team and diverse, advanced technical projects." },
        { title: "Development Opportunities", text: "Continuous training and gaining practical experience in the latest technologies." },
        { title: "Competitive Salaries", text: "Fair compensation with incentives and additional benefits." },
        { title: "Diverse Projects", text: "Work on government, commercial, residential, and enterprise projects." },
      ],
      openPositions: "Open Positions",
      positions: [
        { title: "Network Engineer", type: "Full-time", desc: "Experience in designing and implementing LAN/WAN networks, fiber optics, and network equipment setup." },
        { title: "CCTV Systems Technician", type: "Full-time", desc: "Experience in installing and maintaining CCTV cameras, IP Camera systems, and NVR/DVR." },
        { title: "Low-Voltage Technician", type: "Full-time", desc: "Experience in low-voltage systems, low-current systems, fire alarms, and central audio." },
        { title: "Technical Sales Representative", type: "Full-time", desc: "Experience in technical sales and marketing solutions and equipment to companies and institutions." },
        { title: "Software Developer", type: "Full-time", desc: "Experience in developing enterprise management systems, web applications, and accounting." },
      ],
      applyNow: "Apply Now",
      formTitle: "Job Application Form",
      labels: {
        fullName: "Full Name",
        email: "Email Address",
        phone: "Phone Number",
        whatsapp: "WhatsApp Number",
        position: "Desired Position",
        experience: "Years of Experience",
        education: "Education Level",
        specialization: "Specialization",
        skills: "Technical Skills",
        cv: "Upload Resume (PDF)",
        portfolio: "Upload Certificates or Previous Work (Optional)",
        message: "Additional Message",
        selectedPosition: "Selected Position",
      },
      educationLevels: ["High School","Diploma","Bachelor's","Master's","PhD"],
      experienceYears: ["Less than 1 year","1-3 years","3-5 years","5-10 years","More than 10 years"],
      submit: "Submit Application",
      sendWa: "Submit Application",
      validation: {
        fullName: "Please enter your full name.",
        email: "Please enter your email address.",
        phone: "Please enter your phone number.",
        position: "Please select the desired position.",
        experience: "Please select years of experience.",
        education: "Please select education level.",
        specialization: "Please enter your specialization.",
        skills: "Please enter your technical skills.",
      },
      success: {
        title: "Your Job Application Has Been Received",
        message: "Thank you for your interest in joining ABRAJ ALMAS team. We will review your application and contact you if your qualifications match the job requirements.",
        backHome: "Back to Home",
        another: "Submit Another Application",
        contactWa: "Contact by WhatsApp",
      },
      waTemplate: (d: any) => `Hello ABRAJ ALMAS,
I would like to apply for a position.

Desired Position: ${d.position}
Name: ${d.fullName}
Specialization: ${d.specialization}
Education Level: ${d.education}
Years of Experience: ${d.experience}

Technical Skills:
${d.skills}

Phone: ${d.phone}
WhatsApp: ${d.whatsapp}
Email: ${d.email}

${d.message ? 'Additional Message:\n' + d.message : ''}`,
    },
    projects: {
      title: "Our Most Prominent Projects",
      subtitle: "We are proud to have executed a distinguished portfolio of networking and technology projects that reflect our expertise and service quality.",
      categoryLabel: "Category",
      statusLabel: "Status",
      status: "Completed Project",
      categories: ["Network","CCTV","IT Infrastructure","Technical Systems"],
      items: [
        "Ministry of Foreign Affairs","Baghdad Residences - Green Zone","Qasr Al-Sham","Palm Towers","Al-Nakheel Mall","HOD","EISB","Tajdid Village","The Scientific Source","Additional Project",
      ],
    },
    partners: {
      title: "Our Technology Partners",
      subtitle: "Our partner network includes leading companies and certified suppliers in networking, surveillance systems, and communications equipment, enabling us to offer integrated solutions using modern global technologies.",
    },
    business: {
      title: "Built for Every Business Environment",
      items: [
        { title: "Corporate Offices", text: "Internal networks and intercom, access points, data servers, CCTV, fire alarm sensors, integrated management software, and linking company branches to a unified data server." },
        { title: "Retail Stores", text: "CCTV, warehouse management, sales management, internet connectivity, security systems, and technical support." },
        { title: "Warehouses", text: "Surveillance, network coverage, access control, storage systems, and low-voltage infrastructure." },
        { title: "Hotels & Hospitality", text: "Wi-Fi coverage, CCTV, central audio, satellite systems, and technical support." },
        { title: "Schools & Institutes", text: "Networks, cameras, labs, servers, attendance systems, and monitoring." },
        { title: "Government & Organizations", text: "Enterprise infrastructure, security systems, shared and segregated network systems, digital solutions, CCTV, and security & alarm systems." },
        { title: "Residential Compounds", text: "CCTV, internet distribution, fire protection and alarm, smart systems and smart homes, entrance gates, audio systems, central satellite systems, and software for sales, warehouse, and personnel management." },
        { title: "Server & Network Rooms", text: "Racks, switches, routers, servers, cable management, and performance optimization." },
      ],
    },
    contact: {
      title: "Ready to Build a Stronger Digital Infrastructure?",
      subtitle: "Tell us what your business needs. ABRAJ ALMAS will help you plan, install, secure, and maintain the right technology solution.",
      location: "Iraq",
      labels: { fullName: "Full Name", company: "Company Name", phone: "Phone Number", email: "Email Address", service: "Required Service", message: "Message", send: "Send Message" },
      quick: { call: "Call Now", wa: "Send WhatsApp", book: "Book Consultation", email: "Send Email" },
    },
    footer: {
      tagline: "Network, Computers, Cameras",
      desc: "ABRAJ ALMAS provides advanced network, computer, camera, low-voltage, enterprise software, and digital infrastructure solutions for individuals and modern businesses.",
      colServicesTitle: "Services",
      colServices: ["Network Design & Fiber Optics","CCTV & Security Systems","Low-Voltage Systems","Enterprise Software","Technical Equipment","Network Maintenance"],
      colCompanyTitle: "Company",
      colCompany: ["About","Vision","Services","Booking","Projects","Partners","Contact"],
      colContactTitle: "Contact",
      colContact: ["www.abrajalmas.com","info@abrajalmas.com","07838904041","07829904041","07702904041","Iraq"],
      copyright: "© 2026 ABRAJ ALMAS. All rights reserved.",
    },
    floating: { book: "Book Now" },
  },
};

export const PARTNERS = ["Cisco","MikroTik","Tenda","TP-Link","Finder","Aswar","Dahua","Televes","Hikvision","Morrell"];
export const PHONES = ["07838904041","07829904041","07702904041"];
export const WA_NUMBER = "9647838904041";
export const EMAIL = "info@abrajalmas.com";
export const WEBSITE = "www.abrajalmas.com";