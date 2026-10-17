/* عبقر ABQAR — portable, framework-free browser game */
(() => {
  "use strict";

  const SAVE_KEY = "abqar-game-save-v1";
  const ARABIC_NUMERALS = "٠١٢٣٤٥٦٧٨٩";
  const PERSIAN_NUMERALS = "۰۱۲۳۴۵۶۷۸۹";
  const WORLD_DATA = [
    { id: "puzzles", name: "مملكة الألغاز", scene: "realm", note: "بوابة البداية" },
    { id: "forest", name: "غابة الهمس", scene: "forest", note: "بين الأشجار" },
    { id: "cave", name: "كهف البلور", scene: "cave", note: "أعماق البلور" },
    { id: "lab", name: "مختبر النور", scene: "lab", note: "تجارب عبقر" },
  ];

  // Each stage is data, not a separate screen: add a record here to extend the journey.
  const STAGES = [
    { id: 1, world: "puzzles", name: "سُلّم الأعداد", type: "choice", description: "اكتشف الرقم الذي يُكمل النمط.", prompt: "ما العدد التالي؟ ٢، ٤، ٨، ١٦، ؟", options: ["٢٤", "٣٢", "٣٠", "٢٠"], correctIndex: 1, hint: "فكّر: ماذا يحدث للعدد في كل خطوة؟", reward: 100 },
    { id: 2, world: "puzzles", name: "ترتيب الكواكب", type: "sort", description: "رتّب الكواكب من الأقرب إلى الشمس إلى الأبعد.", items: [{ id: "earth", label: "الأرض", icon: "🌍", shape: "earth" }, { id: "mars", label: "المريخ", icon: "🔴", shape: "mars" }, { id: "mercury", label: "عطارد", icon: "☿", shape: "mercury" }, { id: "venus", label: "الزهرة", icon: "🟡", shape: "venus" }], order: ["mercury", "venus", "earth", "mars"], initialOrder: ["earth", "mars", "mercury", "venus"], sortPrompt: "رحلة حول الشمس", hint: "اسحب البطاقات أو بدّل بينها بأزرار الأسهم.", reward: 120 },
    { id: 3, world: "forest", name: "ذاكرة الغابة", type: "memory", description: "اكشف البطاقات واعثر على الأزواج المتشابهة.", memoryPairs: [{ id: "circle", shape: "circle" }, { id: "triangle", shape: "triangle" }, { id: "diamond", shape: "diamond" }, { id: "square", shape: "square" }], reward: 130 },
    { id: 4, world: "forest", name: "الجربوع السريع", type: "gerbil", description: "المس الجربوع عندما يظهر قبل انتهاء الوقت.", seconds: 15, hits: 7, holes: 9, moveEvery: 580, reward: 150 },
    { id: 5, world: "cave", name: "ممرّ البلور", type: "maze", description: "حرّك عبقر عبر الممر حتى يصل إلى بوابة البلور.", maze: { cols: 4, rows: 4, start: 0, goal: 15, walls: [1, 6, 7, 9, 10] }, reward: 130 },
    { id: 6, world: "cave", name: "أضواء الكهف", type: "sequence", description: "شاهد تسلسل الأضواء ثم أعده بالترتيب نفسه.", length: 4, reward: 150 },
    { id: 7, world: "lab", name: "عين المختبر", type: "observe", description: "ركّز جيدًا واختر الرمز المختلف.", count: 9, columns: 3, baseShape: "circle", targetShape: "triangle", reward: 120 },
    { id: 8, world: "lab", name: "لغز العالم", type: "written", description: "فكّر في اللغز واكتب الإجابة.", prompt: "أنا عدد؛ إذا أضفت ٧ إلى ضعفي أصبح الناتج ٢١. ما أنا؟", answers: ["7", "سبعة", "سبع"], hint: "جرّب معادلة بسيطة: العدد مضروبًا في ٢، ثم نضيف ٧.", reward: 150 },

    { id: 9, world: "puzzles", name: "ثلاث قفزات", type: "choice", description: "اختر العدد الذي يقبل القسمة على ثلاثة.", prompt: "أي عدد يقبل القسمة على ٣ دون باقٍ؟", options: ["١٤", "١٨", "٢٢", "٢٥"], correctIndex: 1, hint: "اجمع أرقام العدد؛ مجموع أرقام مضاعفات ٣ يقبل القسمة على ٣.", reward: 110 },
    { id: 10, world: "puzzles", name: "حروف مبعثرة", type: "word", description: "كوّن كلمة من الحروف المتناثرة.", answer: "باب", distractors: ["ن", "ر"], hint: "الكلمة شيء ندخل منه إلى البيت.", reward: 120 },
    { id: 11, world: "puzzles", name: "كفّتا الميزان", type: "balance", description: "اختر الأوزان التي تجعل الكفّتين متساويتين.", weights: [1, 3, 4, 6], targetWeight: 7, hint: "اجمع بعض الأوزان الصغيرة لتساوي الوزن المقابل.", reward: 130 },
    { id: 12, world: "puzzles", name: "من بذرة إلى زهرة", type: "sort", description: "رتّب مراحل نمو النبتة من البداية إلى النهاية.", items: [{ id: "flower", label: "زهرة", icon: "🌼" }, { id: "seed", label: "بذرة", icon: "🌱" }, { id: "sprout", label: "برعم", icon: "🌿" }, { id: "fruit", label: "ثمرة", icon: "🍎" }], order: ["seed", "sprout", "flower", "fruit"], initialOrder: ["flower", "seed", "fruit", "sprout"], sortPrompt: "دورة النبتة", hint: "كل شجرة تبدأ ببذرة صغيرة.", reward: 130 },
    { id: 13, world: "puzzles", name: "رفيق الضوء", type: "written", description: "حلّ لغزًا قصيرًا واكتب كلمة السر.", prompt: "أمشي معك في الشمس، وأختفي حين يحلّ الظلام. من أنا؟", answers: ["الظل", "ظل"], hint: "انظر إلى الأرض عندما تقف تحت الشمس.", reward: 130 },
    { id: 14, world: "puzzles", name: "مصابيح البداية", type: "lights", description: "أطفئ كل المصابيح بضغطات ذكية.", size: 2, scramble: [0, 3], hint: "كل ضغطة تغيّر المصباح وجيرانه من الأعلى والأسفل والجانبين.", reward: 140 },
    { id: 15, world: "puzzles", name: "لغز الصناديق", type: "choice", description: "استخدم المنطق قبل أن تختار.", prompt: "صندوق فيه ٣ كرات حمراء وكرّتان زرقاوان. ما أقل عدد تسحبه مغمضًا لتضمن كرتين من اللون نفسه؟", options: ["٢", "٣", "٤", "٥"], correctIndex: 1, hint: "فكّر في أسوأ احتمال قبل أن يظهر اللون نفسه مرتين.", reward: 150 },
    { id: 16, world: "puzzles", name: "المربعات المنزلقة", type: "sliding", description: "رتّب الأرقام بتحريك مربع واحد في كل مرة.", size: 3, scramble: ["up", "left", "down", "left", "up", "right", "up", "left"], reward: 160 },
    { id: 17, world: "puzzles", name: "كلمة من الفضاء", type: "word", description: "أعد الحروف إلى كلمة تصف ما نعيش عليه.", answer: "كوكب", distractors: ["و", "ر"], hint: "نحن نعيش على كوكب أزرق يدور حول الشمس.", reward: 150 },
    { id: 18, world: "puzzles", name: "ميزان الخبير", type: "balance", description: "وازن الثقل باستخدام أقل عدد من الأوزان.", weights: [2, 4, 5, 7, 9], targetWeight: 16, hint: "يمكنك اختيار أكثر من ثقل، لكن كل ثقل مرة واحدة.", reward: 170 },

    { id: 19, world: "forest", name: "ورقة بين الأوراق", type: "observe", description: "ابحث عن الورقة التي تختلف عن بقية الرموز.", count: 16, columns: 4, baseShape: "circle", targetShape: "diamond", reward: 140 },
    { id: 20, world: "forest", name: "درب اليراعات", type: "path", description: "اتبع الطريق خطوة خطوة حتى تصل إلى اليراعة الأخيرة.", path: { cols: 4, rows: 4, route: [0, 1, 5, 9, 10, 14, 15], walls: [2, 3, 4, 6, 7, 8, 11, 12, 13] }, reward: 150 },
    { id: 21, world: "forest", name: "ذاكرة الأعشاش", type: "memory", description: "تذكّر أماكن ستة أزواج من علامات الغابة.", memoryPairs: [{ id: "leaf", symbol: "🍃" }, { id: "acorn", symbol: "🌰" }, { id: "flower", symbol: "🌼" }, { id: "mushroom", symbol: "🍄" }, { id: "nest", symbol: "🪺" }, { id: "bee", symbol: "🐝" }], reward: 170 },
    { id: 22, world: "forest", name: "مطاردة الجربوع", type: "gerbil", description: "الجربوع أسرع الآن؛ التقطه تسع مرات.", seconds: 14, hits: 9, holes: 12, moveEvery: 500, reward: 180 },
    { id: 23, world: "forest", name: "متاهة الجذور", type: "maze", description: "اعبر الممر المتعرّج بين الجذور.", maze: { cols: 5, rows: 5, start: 0, goal: 24, walls: [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19] }, reward: 170 },
    { id: 24, world: "forest", name: "قصة الفراشة", type: "sort", description: "رتّب التحوّلات من البيضة إلى الفراشة.", items: [{ id: "butterfly", label: "فراشة", icon: "🦋" }, { id: "egg", label: "بيضة", icon: "🥚" }, { id: "caterpillar", label: "يرقة", icon: "🐛" }, { id: "cocoon", label: "شرنقة", icon: "🫘" }], order: ["egg", "caterpillar", "cocoon", "butterfly"], initialOrder: ["caterpillar", "butterfly", "egg", "cocoon"], sortPrompt: "رحلة التحوّل", hint: "أي مرحلة تأتي قبل أن تطير الفراشة؟", reward: 160 },
    { id: 25, world: "forest", name: "إشارة اليراعة", type: "reaction", description: "انتظر الضوء الأخضر ثم المسه بأسرع ما تستطيع.", minDelay: 1000, maxDelay: 2400, timeLimit: 8000, targetMs: 700, reward: 180 },
    { id: 26, world: "forest", name: "سرّ الغابة", type: "word", description: "رتّب الحروف لتجد مكان المغامرة.", answer: "غابة", distractors: ["ل"], hint: "تكثر فيها الأشجار وأصوات الطيور.", reward: 160 },
    { id: 27, world: "forest", name: "زهرة نادرة", type: "observe", description: "تأمّل شبكة الرموز واعثر على الزهرة المختلفة.", count: 25, columns: 5, baseShape: "square", targetShape: "triangle", reward: 190 },
    { id: 28, world: "forest", name: "الممرّ السري", type: "path", description: "ارسم طريقًا متعرّجًا بين الحجارة من دون دخولها.", path: { cols: 5, rows: 5, route: [0, 1, 6, 11, 10, 15, 16, 17, 22, 23, 24], walls: [2, 3, 4, 5, 7, 8, 9, 12, 13, 14, 18, 19, 20, 21] }, reward: 190 },

    { id: 29, world: "cave", name: "بلّورات منزلقة", type: "sliding", description: "رتّب البلّورات الرقمية لتحرير الممر.", size: 3, scramble: ["up", "left", "up", "right", "down", "left", "down", "left", "up", "right", "up", "left"], reward: 180 },
    { id: 30, world: "cave", name: "لوح البلور", type: "lights", description: "أطفئ شبكة البلور بحركات أقل.", size: 3, scramble: [0, 2, 4, 6, 8, 1], hint: "الضغطة تغيّر جيرانها أيضًا؛ خطّط قبل أن تبدأ.", reward: 190 },
    { id: 31, world: "cave", name: "ممرّ الصدى", type: "maze", description: "اتبع الممر الوحيد عبر شبكة الكهف.", maze: { cols: 5, rows: 5, start: 0, goal: 24, walls: [2, 3, 4, 5, 7, 8, 9, 10, 13, 14, 15, 16, 18, 19, 20, 21] }, reward: 190 },
    { id: 32, world: "cave", name: "صدى الألوان", type: "sequence", description: "احفظ خمسة أضواء وأعدها بالترتيب.", length: 5, reward: 190 },
    { id: 33, world: "cave", name: "خطوات البلّور", type: "path", description: "ارسم طريق البلّورات من المدخل إلى المخرج.", path: { cols: 5, rows: 5, route: [0, 5, 6, 7, 12, 17, 18, 19, 24], walls: [1, 2, 3, 4, 8, 9, 10, 11, 13, 14, 15, 16, 20, 21, 22, 23] }, reward: 200 },
    { id: 34, world: "cave", name: "ذاكرة الكهف", type: "memory", description: "اعثر على ثمانية أزواج في الظلال.", memoryPairs: [{ id: "moon", symbol: "🌙" }, { id: "star", symbol: "⭐" }, { id: "crystal", symbol: "💎" }, { id: "comet", symbol: "☄️" }, { id: "planet", symbol: "🪐" }, { id: "key", symbol: "🗝️" }, { id: "spark", symbol: "✨" }, { id: "shell", symbol: "🐚" }], reward: 210 },
    { id: 35, world: "cave", name: "مربعات البلّور الكبرى", type: "sliding", description: "حلّ شبكة أكبر من دون بعثرة الأرقام.", size: 4, scramble: ["up", "left", "up", "left", "down", "right", "up", "right", "down", "left", "down", "left", "up", "right", "up", "left"], reward: 230 },
    { id: 36, world: "cave", name: "أصداء متتابعة", type: "sequence", description: "تذكّر ست إشارات متتالية في الكهف.", length: 6, reward: 220 },
    { id: 37, world: "cave", name: "متاهة الأعمدة", type: "maze", description: "اعثر على الممر في الكهف ذي الستة أعمدة.", maze: { cols: 6, rows: 5, start: 0, goal: 29, walls: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23] }, reward: 230 },
    { id: 38, world: "cave", name: "الجربوع في الكهف", type: "gerbil", description: "لا تدع الجربوع يهرب؛ التقطه إحدى عشرة مرة.", seconds: 13, hits: 11, holes: 16, moveEvery: 430, reward: 240 },

    { id: 39, world: "lab", name: "معادلة الضوء", type: "choice", description: "حلّ النمط قبل تشغيل الجهاز.", prompt: "ثلاثة أعداد متتالية مجموعها ٣٣. ما العدد الأوسط؟", options: ["٩", "١٠", "١١", "١٢"], correctIndex: 2, hint: "العدد الأوسط يساوي متوسط الأعداد الثلاثة.", reward: 210 },
    { id: 40, world: "lab", name: "قفل المختبر", type: "code", description: "استنتج الرمز السري من القرائن.", code: "427", codeHints: ["الرقم الأوسط هو ٢.", "الرقم الأول أكبر من الأوسط باثنين.", "الرقم الأخير أكبر من الأول بثلاثة."], reward: 220 },
    { id: 41, world: "lab", name: "ميزان الضوء", type: "balance", description: "اختر أوزانًا تعادل ثقل البلّورة.", weights: [3, 5, 7, 8, 11], targetWeight: 19, hint: "وازن الكفّتين من دون تكرار أي وزن.", reward: 230 },
    { id: 42, world: "lab", name: "لوحة الطاقة", type: "lights", description: "أطفئ لوحة الطاقة ذات الأربعة صفوف.", size: 4, scramble: [0, 3, 5, 6, 9, 10, 12, 15], reward: 250 },
    { id: 43, world: "lab", name: "الشفرة اللونية", type: "sequence", description: "احفظ سلسلة من سبع ومضات ثم أعدها.", length: 7, reward: 250 },
    { id: 44, world: "lab", name: "رسالة عبقر", type: "word", description: "رتّب الحروف لفك كلمة السر.", answer: "منطق", distractors: ["س", "ر"], hint: "به نفكّ الألغاز ونصل إلى الحل.", reward: 230 },
    { id: 45, world: "lab", name: "شفرة العالِم", type: "code", description: "استخدم القرائن الأربع لفتح الخزنة.", code: "5241", codeHints: ["الرقم الأول هو ٥.", "الثاني أقل من الأول بثلاثة.", "الثالث أكبر من الثاني باثنين.", "الأخير هو الأصغر."], reward: 260 },
    { id: 46, world: "lab", name: "اختبار البرق", type: "reaction", description: "انتظر الإشارة؛ أي لمسة مبكرة تعيد الاختبار.", minDelay: 1500, maxDelay: 3000, timeLimit: 7000, targetMs: 420, reward: 270 },
    { id: 47, world: "lab", name: "مسار الطاقة", type: "path", description: "اعبر المسار المتشابك إلى مركز الطاقة.", path: { cols: 6, rows: 6, route: [0, 1, 7, 13, 14, 20, 21, 22, 28, 29, 35], walls: [2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 23, 24, 25, 26, 27, 30, 31, 32, 33, 34] }, reward: 280 },
    { id: 48, world: "lab", name: "بوابة العباقرة", type: "sliding", description: "رتّب الشبكة الكاملة لتحرير بوابة المختبر.", size: 4, scramble: ["up", "left", "up", "left", "down", "left", "up", "right", "up", "right", "down", "left", "down", "left", "up", "left", "down", "right", "up", "right", "down", "left", "up", "left"], reward: 300 },
  ];

  const PAIRS = ["circle", "triangle", "diamond", "square"];
  const COLORS = [
    { id: "sky", name: "أزرق سماوي" },
    { id: "blue", name: "أزرق داكن" },
    { id: "gold", name: "ذهبي" },
    { id: "green", name: "أخضر" },
  ];

  const $ = (id) => document.getElementById(id);
  const app = $("app-shell") || document.body;
  const screens = ["home-screen", "map-screen", "game-screen", "result-screen"]
    .map($)
    .filter(Boolean);
  const challengeArea = $("challenge-area");

  let saved = loadSave();
  let currentStage = null;
  let activeWorld = WORLD_DATA[0].id;
  let round = null;
  let intervalId = null;
  let timeouts = [];
  let feedbackTimer = null;
  let sortPointer = null;
  let draggedSortItem = false;

  function freshSave() {
    return { score: 0, stars: 0, completed: [], bestStars: {}, sound: false, lastStage: 1 };
  }

  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return freshSave();
      const parsed = JSON.parse(raw);
      const completed = Array.isArray(parsed.completed)
        ? parsed.completed.filter((id) => STAGES.some((stage) => stage.id === Number(id)))
        : [];
      const bestStars = {};
      if (parsed.bestStars && typeof parsed.bestStars === "object") {
        for (const stage of STAGES) {
          const value = Number(parsed.bestStars[stage.id]);
          if (Number.isFinite(value) && value >= 1 && value <= 3) bestStars[stage.id] = value;
        }
      }
      return {
        score: Math.max(0, Number(parsed.score) || 0),
        stars: Math.max(0, Number(parsed.stars) || 0),
        completed: [...new Set(completed.map(Number))],
        bestStars,
        sound: Boolean(parsed.sound),
        lastStage: STAGES.some((stage) => stage.id === Number(parsed.lastStage))
          ? Number(parsed.lastStage)
          : 1,
      };
    } catch (error) {
      showStorageWarning("تعذّر قراءة الحفظ السابق. سيبدأ اللعب من جديد في هذه الجلسة.");
      return freshSave();
    }
  }

  function saveGame() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(saved));
      return true;
    } catch (error) {
      showStorageWarning("الحفظ المحلي غير متاح في هذا المتصفح؛ سيبقى التقدم لهذه الجلسة فقط.");
      return false;
    }
  }

  function showStorageWarning(message) {
    let notice = $("storage-warning");
    if (!notice) {
      notice = document.createElement("p");
      notice.id = "storage-warning";
      notice.className = "storage-warning";
      notice.setAttribute("role", "status");
      const target = $("home-screen") || app;
      target.prepend(notice);
    }
    notice.textContent = message;
  }

  function setText(id, value) {
    const element = $(id);
    if (element) element.textContent = String(value);
  }

  function clearTimers() {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
    for (const id of timeouts) window.clearTimeout(id);
    timeouts = [];
  }

  function later(callback, delay) {
    const id = window.setTimeout(() => {
      timeouts = timeouts.filter((timeoutId) => timeoutId !== id);
      callback();
    }, delay);
    timeouts.push(id);
    return id;
  }

  function showScreen(screenId) {
    for (const screen of screens) {
      const active = screen.id === screenId;
      screen.hidden = !active;
      screen.classList.toggle("is-active", active);
      screen.setAttribute("aria-hidden", String(!active));
    }
    if (screenId === "home-screen") refreshHome();
    updateStats();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateStats() {
    setText("score-value", toArabicNumerals(saved.score));
    setText("stars-value", toArabicNumerals(saved.stars));
    setText("completed-value", `${toArabicNumerals(saved.completed.length)}/${toArabicNumerals(STAGES.length)}`);
    document.querySelectorAll('[data-stat="score"]').forEach((node) => {
      node.textContent = toArabicNumerals(saved.score);
    });
    document.querySelectorAll('[data-stat="stars"]').forEach((node) => {
      node.textContent = toArabicNumerals(saved.stars);
    });
    document.querySelectorAll('[data-stat="completed"]').forEach((node) => {
      node.textContent = `${toArabicNumerals(saved.completed.length)}/${toArabicNumerals(STAGES.length)}`;
    });
    document.querySelectorAll('[data-action="sound"]').forEach((soundButton) => {
      soundButton.setAttribute("aria-pressed", String(saved.sound));
      soundButton.setAttribute("aria-label", saved.sound ? "إيقاف الصوت" : "تشغيل الصوت");
      soundButton.title = saved.sound ? "إيقاف الصوت" : "تشغيل الصوت";
    });
    const fill = $("overall-progress");
    if (fill) {
      const percent = (saved.completed.length / STAGES.length) * 100;
      fill.style.width = `${percent}%`;
      fill.setAttribute("aria-valuenow", String(saved.completed.length));
    }
  }

  function refreshHome() {
    const next = nextPlayableStage();
    const continueButton = document.querySelector('[data-action="start-game"]');
    if (continueButton) {
      continueButton.textContent = saved.completed.length === STAGES.length
        ? "أعد مغامرتك"
        : saved.completed.length > 0
          ? "تابع المغامرة"
          : "ابدأ المغامرة";
      continueButton.dataset.stage = String(next.id);
    }
    setText("home-completed-value", `${toArabicNumerals(saved.completed.length)} من ${toArabicNumerals(STAGES.length)}`);
    updateStats();
  }

  function nextPlayableStage() {
    return STAGES.find((stage) => !saved.completed.includes(stage.id)) || STAGES[0];
  }

  function isUnlocked(stage) {
    if (stage.id === 1 || saved.completed.includes(stage.id)) return true;
    return saved.completed.includes(stage.id - 1);
  }

  function renderWorldTabs() {
    const root = $("world-tabs");
    if (!root) return;
    root.innerHTML = WORLD_DATA.map((world) => `
      <button class="world-tab ${world.id === activeWorld ? "is-selected" : ""}"
        type="button" data-world="${world.id}" aria-pressed="${world.id === activeWorld}">
        <span class="world-tab-mark" aria-hidden="true">${world.id === "puzzles" ? "١" : world.id === "forest" ? "٢" : world.id === "cave" ? "٣" : "٤"}</span>
        <span>${world.name}</span>
      </button>`).join("");
  }

  function renderStageGrid() {
    const root = $("stage-grid");
    if (!root) return;
    const world = WORLD_DATA.find((item) => item.id === activeWorld) || WORLD_DATA[0];
    const stages = STAGES.filter((stage) => stage.world === activeWorld);
    app.dataset.scene = world.scene;
    root.innerHTML = stages.map((stage) => {
      const unlocked = isUnlocked(stage);
      const complete = saved.completed.includes(stage.id);
      const best = saved.bestStars[stage.id] || 0;
      const status = complete ? "مكتملة" : unlocked ? "جاهزة للعب" : "مقفلة";
      return `<button class="stage-card ${unlocked ? "" : "is-locked"} ${complete ? "is-complete" : ""}"
        type="button" data-stage="${stage.id}" ${unlocked ? "" : "disabled"}
        aria-label="المرحلة ${stage.id}: ${stage.name}، ${status}">
        <span class="stage-card-number">${String(stage.id).replace(/\d/g, (d) => ARABIC_NUMERALS[Number(d)])}</span>
        <span class="stage-card-copy"><strong>${stage.name}</strong><small>${status}</small></span>
        <span class="stage-card-stars" aria-label="${best} من ٣ نجوم">${"★".repeat(best)}${"☆".repeat(3 - best)}</span>
      </button>`;
    }).join("");
  }

  function openMap() {
    clearTimers();
    renderWorldTabs();
    renderStageGrid();
    showScreen("map-screen");
  }

  function startStage(id) {
    const stage = STAGES.find((item) => item.id === Number(id));
    if (!stage || !isUnlocked(stage)) {
      announce("أكمل المرحلة السابقة أولًا لفتح هذا التحدي.", "is-warning");
      return;
    }
    clearTimers();
    currentStage = stage;
    activeWorld = stage.world;
    saved.lastStage = stage.id;
    saveGame();
    round = {
      mistakes: 0,
      startedAt: Date.now(),
      finished: false,
      cards: [],
      openCards: [],
      matchedCards: [],
      sortItems: [],
      hits: 0,
      seconds: stage.seconds || 15,
      wordTiles: [],
      wordSelection: [],
      selectedWeights: [],
      pathProgress: 0,
      codeDigits: [],
      lights: [],
      sliding: [],
      sequence: [],
      sequenceInput: [],
      sequenceReady: false,
    };
    setText("stage-title", stage.name);
    setText("stage-subtitle", stage.description);
    setText("stage-progress", `المرحلة ${toArabicNumerals(stage.id)} من ${toArabicNumerals(STAGES.length)}`);
    const progressFill = document.querySelector(".progress-track span");
    if (progressFill) progressFill.style.width = `${(stage.id / STAGES.length) * 100}%`;
    updateStats();
    setScene(stage.world, stage.type);
    const renderers = {
      choice: renderChoice,
      sort: renderSort,
      memory: renderMemory,
      gerbil: renderGerbil,
      maze: renderMaze,
      sequence: renderSequence,
      observe: renderObserve,
      written: renderWritten,
      word: renderWord,
      balance: renderBalance,
      lights: renderLights,
      sliding: renderSliding,
      path: renderPath,
      reaction: renderReaction,
      code: renderCode,
    };
    if (!renderers[stage.type]) {
      announce("هذا التحدي غير متاح حاليًا.", "is-warning");
      return;
    }
    renderers[stage.type]();
    showScreen("game-screen");
    if (stage.type === "gerbil") beginGerbilTimer();
    if (stage.type === "sequence") playColorSequence();
  }

  function setScene(worldId, stageType) {
    const world = WORLD_DATA.find((item) => item.id === worldId);
    if (world) app.dataset.scene = world.scene;
    const moodByType = {
      choice: "thinking",
      sort: "approval",
      memory: "thinking",
      gerbil: "surprise",
      maze: "neutral",
      sequence: "thinking",
      observe: "surprise",
      written: "thinking",
      word: "thinking",
      balance: "approval",
      lights: "thinking",
      sliding: "thinking",
      path: "thinking",
      reaction: "surprise",
      code: "thinking",
    };
    setMascotMood(moodByType[stageType] || "thinking");
  }

  function setMascotMood(mood) {
    const mascot = $("mascot");
    const guide = $("guide-mascot");
    const images = {
      welcome: "./assets/character/welcome.png",
      thinking: "./assets/character/thinking.png",
      success: "./assets/character/success.png",
      sad: "./assets/character/sad.png",
      joy: "./assets/character/joy.png",
      neutral: "./assets/character/neutral.png",
    };
    if (mascot) {
      mascot.src = images[mood] || images.welcome;
      mascot.alt = mood === "success" ? "عبقر يحتفل بالفوز" : mood === "sad" ? "عبقر يشجّعك على المحاولة" : "عبقر يرحّب بك";
      mascot.dataset.mood = mood;
    }
    if (guide) guide.src = images[mood] || images.thinking;
  }

  function renderChoice() {
    if (!challengeArea) return;
    const options = currentStage.options || ["١", "٢", "٣", "٤"];
    challengeArea.innerHTML = `
      <div class="challenge-intro"><span class="challenge-kicker">تحدّي التفكير</span>
        <h2>${currentStage.prompt}</h2></div>
      <div class="answer-grid" role="group" aria-label="اختر الإجابة">
        ${options.map((answer, index) => `
          <button class="answer-tile" type="button" data-answer="${index}" aria-label="الإجابة ${answer}">${answer}</button>`).join("")}
      </div>
      <p class="game-hint">${currentStage.hint || "فكّر جيدًا قبل أن تختار."}</p>`;
  }

  function renderSort() {
    const ids = (currentStage.items || []).map((item) => item.id);
    round.sortItems = currentStage.initialOrder ? [...currentStage.initialOrder] : shuffle(ids);
    if (!challengeArea) return;
    challengeArea.innerHTML = `
      <div class="challenge-intro"><span class="challenge-kicker">تحدّي الترتيب</span>
        <h2>${currentStage.sortPrompt || "رتّب العناصر"}</h2><p>${currentStage.description}</p></div>
      <ol class="sort-list" id="sort-list" aria-label="بطاقات الكواكب"></ol>
      <div class="sort-actions"><button class="primary-button" type="button" data-action="check-sort">تحقّق من الترتيب</button></div>
      <p class="game-hint">${currentStage.hint || "اسحب البطاقة لمكانها، أو استخدم أزرار التحريك."}</p>`;
    updateSortList();
  }

  function updateSortList() {
    const list = $("sort-list");
    if (!list || !round) return;
    list.innerHTML = round.sortItems.map((id, index) => {
      const item = currentStage.items.find((entry) => entry.id === id);
      return `<li class="sort-item" data-stage-tile="${index}" data-sort-id="${item.id}" draggable="true">
        <span class="sort-position">${index + 1}</span>
        ${item.shape ? `<span class="planet-orb planet-${item.shape}" aria-hidden="true">${item.icon || ""}</span>` : `<span class="sort-symbol" aria-hidden="true">${item.icon || "✦"}</span>`}
        <strong>${item.label}</strong>
        <span class="sort-controls">
          <button type="button" class="icon-button" data-sort-move="${index}" data-direction="-1" aria-label="حرّك ${item.label} إلى الأعلى" ${index === 0 ? "disabled" : ""}>↑</button>
          <button type="button" class="icon-button" data-sort-move="${index}" data-direction="1" aria-label="حرّك ${item.label} إلى الأسفل" ${index === round.sortItems.length - 1 ? "disabled" : ""}>↓</button>
        </span></li>`;
    }).join("");
  }

  function renderMemory() {
    const pairs = currentStage.memoryPairs || PAIRS.map((shape) => ({ id: shape, shape }));
    const deck = pairs.flatMap((pair, index) => [
      { pair: pair.id, shape: pair.shape, symbol: pair.symbol, key: `${index}-a` },
      { pair: pair.id, shape: pair.shape, symbol: pair.symbol, key: `${index}-b` },
    ]);
    round.cards = shuffle(deck);
    round.pairCount = pairs.length;
    if (!challengeArea) return;
    challengeArea.innerHTML = `
      <div class="challenge-intro"><span class="challenge-kicker">تحدّي الذاكرة</span>
        <h2>أين الأزواج؟</h2><p>${currentStage.description}</p></div>
      <div class="memory-board" id="memory-board" role="group" aria-label="بطاقات الذاكرة">
        ${round.cards.map((card, index) => memoryCardMarkup(card, index)).join("")}
      </div>
      <p class="memory-progress" id="memory-progress">الأزواج المكتشفة: ٠ من ${toArabicNumerals(round.pairCount)}</p>`;
  }

  function memoryCardMarkup(card, index) {
    return `<button class="memory-card" type="button" data-card-index="${index}"
      aria-label="بطاقة مخفية" aria-pressed="false">
      <span class="memory-card-back" aria-hidden="true">؟</span>
      ${card.shape ? `<span class="shape-mark shape-${card.shape}" aria-hidden="true"></span>` : `<span class="memory-card-symbol" aria-hidden="true">${card.symbol}</span>`}
    </button>`;
  }

  function renderGerbil() {
    round.hits = 0;
    round.seconds = currentStage.seconds || 15;
    round.gerbilTarget = currentStage.hits || 7;
    round.gerbilHoles = currentStage.holes || 9;
    round.gerbilIndex = Math.floor(Math.random() * round.gerbilHoles);
    if (!challengeArea) return;
    challengeArea.innerHTML = `
      <div class="challenge-intro"><span class="challenge-kicker">تحدّي السرعة</span>
        <h2>الجربوع في كل مكان!</h2><p>المسه ${toArabicNumerals(round.gerbilTarget)} مرات قبل انتهاء الوقت.</p></div>
      <div class="gerbil-scoreline"><span>اللمسات <strong id="gerbil-hit-count">٠</strong> / ${toArabicNumerals(round.gerbilTarget)}</span>
        <span class="game-clock" id="gerbil-clock">${toArabicNumerals(round.seconds)}</span></div>
      <div class="gerbil-board" id="gerbil-board" role="group" aria-label="ساحة الجربوع" style="--gerbil-columns:${round.gerbilHoles <= 9 ? 3 : 4}">
        ${Array.from({ length: round.gerbilHoles }, (_, index) => `<button class="gerbil-hole" type="button" data-gerbil-index="${index}" aria-label="مكان ${toArabicNumerals(index + 1)}">${index === round.gerbilIndex ? gerbilMarkup() : ""}</button>`).join("")}
      </div>
      <p class="game-hint">تابع حركته بسرعة. كل لمسة صحيحة تُحسب.</p>`;
    round.gerbilNextAt = Date.now();
  }

  function gerbilMarkup() {
    return `<span class="gerbil" aria-label="جربوع">
      <i class="gerbil-ear gerbil-ear-left"></i><i class="gerbil-ear gerbil-ear-right"></i>
      <i class="gerbil-eye gerbil-eye-left"></i><i class="gerbil-eye gerbil-eye-right"></i>
      <i class="gerbil-nose"></i><i class="gerbil-belly"></i></span>`;
  }

  function moveGerbil() {
    if (!round || round.finished || currentStage?.type !== "gerbil") return;
    let next = Math.floor(Math.random() * round.gerbilHoles);
    if (next === round.gerbilIndex) next = (next + 1 + Math.floor(Math.random() * (round.gerbilHoles - 1))) % round.gerbilHoles;
    round.gerbilIndex = next;
    const board = $("gerbil-board");
    if (!board) return;
    board.querySelectorAll(".gerbil-hole").forEach((hole, index) => {
      hole.innerHTML = index === next ? gerbilMarkup() : "";
      hole.classList.toggle("is-active", index === next);
    });
  }

  function beginGerbilTimer() {
    intervalId = window.setInterval(() => {
      if (!round || round.finished || currentStage?.type !== "gerbil") return;
      const now = Date.now();
      if (now - round.gerbilNextAt >= (currentStage.moveEvery || 580)) {
        round.gerbilNextAt = now;
        moveGerbil();
      }
      round.seconds = Math.max(0, (currentStage.seconds || 15) - Math.floor((now - round.startedAt) / 1000));
      setText("gerbil-clock", toArabicNumerals(round.seconds));
      if (round.seconds <= 0) finishStage(false, "انتهى الوقت! الجربوع يحيّيك للمحاولة من جديد.");
    }, 120);
  }

  function renderMaze() {
    if (!challengeArea) return;
    const config = currentStage.maze;
    round.maze = {
      cols: config.cols,
      rows: config.rows,
      start: config.start,
      goal: config.goal,
      walls: new Set(config.walls),
      x: config.start % config.cols,
      y: Math.floor(config.start / config.cols),
      steps: 0,
    };
    challengeArea.innerHTML = `
      <div class="challenge-intro"><span class="challenge-kicker">تحدّي الحركة</span>
        <h2>أوصل عبقر إلى البوابة</h2><p>${currentStage.description}</p></div>
      <p class="maze-stats">خطواتك: <strong id="maze-steps">٠</strong></p>
      <div class="maze-grid" id="maze-grid" role="grid" aria-label="متاهة البلور" style="--maze-columns:${config.cols}"></div>
      <div class="maze-controls" role="group" aria-label="أزرار حركة عبقر">
        <button type="button" data-move="up" aria-label="تحرّك إلى الأعلى">أعلى <span>↑</span></button>
        <button type="button" data-move="right" aria-label="تحرّك إلى اليمين">يمين <span>→</span></button>
        <button type="button" data-move="down" aria-label="تحرّك إلى الأسفل">أسفل <span>↓</span></button>
        <button type="button" data-move="left" aria-label="تحرّك إلى اليسار">يسار <span>←</span></button>
      </div>
      <p class="game-hint">استخدم الأسهم على الشاشة أو لوحة المفاتيح.</p>`;
    updateMaze();
  }

  function updateMaze() {
    const grid = $("maze-grid");
    if (!grid || !round) return;
    const { x, y, cols, rows, walls, goal } = round.maze;
    grid.innerHTML = Array.from({ length: cols * rows }, (_, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const wall = walls.has(index);
      const player = col === x && row === y;
      const isGoal = index === goal;
      const cellClass = `maze-cell${wall ? " is-wall" : ""}${isGoal ? " is-goal" : ""}${player ? " is-player" : ""}`;
      const content = player ? `<span class="maze-player" aria-label="عبقر">ع</span>` : isGoal ? `<span class="maze-gate" aria-label="البوابة">ب</span>` : "";
      return `<div class="${cellClass}" role="gridcell" aria-label="${player ? "مكان عبقر" : isGoal ? "بوابة النهاية" : wall ? "صخرة" : "ممر"}">${content}</div>`;
    }).join("");
    setText("maze-steps", toArabicNumerals(round.maze.steps));
  }

  function moveMaze(direction) {
    if (!round || round.finished || currentStage?.type !== "maze") return;
    const delta = {
      up: [0, -1],
      right: [1, 0],
      down: [0, 1],
      left: [-1, 0],
    }[direction];
    if (!delta) return;
    const nx = round.maze.x + delta[0];
    const ny = round.maze.y + delta[1];
    if (nx < 0 || nx >= round.maze.cols || ny < 0 || ny >= round.maze.rows) return announce("لا يوجد ممر في هذا الاتجاه.", "is-neutral");
    if (round.maze.walls.has(ny * round.maze.cols + nx)) return announce("صخرة تسدّ الطريق. جرّب اتجاهًا آخر.", "is-warning");
    round.maze.x = nx;
    round.maze.y = ny;
    round.maze.steps += 1;
    updateMaze();
    playTone(390, 0.045);
    if (ny * round.maze.cols + nx === round.maze.goal) finishStage(true);
  }

  function renderSequence() {
    round.sequence = Array.from({ length: currentStage.length || 4 }, () => Math.floor(Math.random() * COLORS.length));
    round.sequenceInput = [];
    round.sequenceReady = false;
    if (!challengeArea) return;
    challengeArea.innerHTML = `
      <div class="challenge-intro"><span class="challenge-kicker">تحدّي التركيز</span>
        <h2>تذكّر الأضواء</h2><p id="sequence-instruction">راقب الألوان، ثم اضغطها بالترتيب.</p></div>
      <div class="color-pads" id="color-pads" role="group" aria-label="أزرار الألوان">
        ${COLORS.map((color) => `<button type="button" class="color-pad pad-${color.id}" data-color="${color.id}" aria-label="${color.name}" disabled><span></span></button>`).join("")}
      </div>
      <p class="sequence-progress" id="sequence-progress">انتظر ظهور التسلسل</p>
      <button type="button" class="secondary-button" data-action="replay-sequence" id="replay-sequence" disabled>أعد عرض التسلسل</button>`;
  }

  function playColorSequence() {
    if (!round || currentStage?.type !== "sequence") return;
    const pads = [...document.querySelectorAll(".color-pad")];
    const instruction = $("sequence-instruction");
    const replay = $("replay-sequence");
    pads.forEach((pad) => {
      pad.disabled = true;
      pad.classList.remove("is-lit");
    });
    if (instruction) instruction.textContent = "شاهد ترتيب الأضواء، ثم أعده.";
    if (replay) replay.disabled = true;
    round.sequenceReady = false;
    round.sequenceInput = [];
    round.sequence.forEach((colorIndex, index) => {
      later(() => {
        const pad = pads.find((item) => item.dataset.color === COLORS[colorIndex].id);
        if (pad) pad.classList.add("is-lit");
        playTone([380, 440, 500, 560][colorIndex], 0.13);
        later(() => pad?.classList.remove("is-lit"), 300);
      }, 600 + index * 640);
    });
    later(() => {
      round.sequenceReady = true;
      pads.forEach((pad) => { pad.disabled = false; });
      if (instruction) instruction.textContent = "دورك الآن؛ أعد ترتيب الألوان نفسه.";
      if (replay) replay.disabled = false;
      setText("sequence-progress", `٠ من ${toArabicNumerals(round.sequence.length)}`);
    }, 600 + round.sequence.length * 640);
  }

  function renderObserve() {
    round.oddIndex = Math.floor(Math.random() * (currentStage.count || 9));
    const baseShape = currentStage.baseShape || "circle";
    const targetShape = currentStage.targetShape || "triangle";
    const shapes = Array.from({ length: currentStage.count || 9 }, (_, index) => index === round.oddIndex ? targetShape : baseShape);
    if (!challengeArea) return;
    challengeArea.innerHTML = `
      <div class="challenge-intro"><span class="challenge-kicker">تحدّي الملاحظة</span>
        <h2>أين الشكل المختلف؟</h2><p>${currentStage.description}</p></div>
      <div class="observe-board" role="group" aria-label="اختر الشكل المختلف" style="--observe-columns:${currentStage.columns || 3}">
        ${shapes.map((shape, index) => `<button class="observe-tile" type="button" data-answer="${index}" aria-label="شكل رقم ${index + 1}">
          <span class="shape-mark shape-${shape}" aria-hidden="true"></span></button>`).join("")}
      </div>
      <p class="game-hint">خذ لحظة لمقارنة الأشكال قبل الاختيار.</p>`;
  }

  function renderWritten() {
    if (!challengeArea) return;
    challengeArea.innerHTML = `
      <div class="challenge-intro"><span class="challenge-kicker">تحدّي التفكير</span>
        <h2>لغز العالم</h2><p>${currentStage.prompt}</p></div>
      <form id="riddle-form" class="riddle-form">
        <label for="riddle-answer">اكتب إجابتك</label>
        <div class="riddle-input-row"><input id="riddle-answer" name="answer" type="text" inputmode="numeric" autocomplete="off" placeholder="إجابتك" aria-describedby="riddle-feedback" required maxlength="24">
          <button class="primary-button" type="submit">تحقّق</button></div>
        <p class="game-hint" id="riddle-feedback">${currentStage.hint || "اكتب الإجابة التي توصّلت إليها."}</p>
      </form>`;
    const input = $("riddle-answer");
    if (input) later(() => input.focus({ preventScroll: true }), 50);
  }

  function renderWord() {
    round.wordTiles = shuffle([
      ...Array.from(currentStage.answer),
      ...(currentStage.distractors || []),
    ]).map((letter, id) => ({ id, letter }));
    round.wordSelection = [];
    if (!challengeArea) return;
    challengeArea.innerHTML = `
      <div class="challenge-intro"><span class="challenge-kicker">تحدّي الحروف</span>
        <h2>كوّن الكلمة</h2><p>${currentStage.description}</p></div>
      <div class="word-answer" id="word-answer" aria-label="حروف إجابتك"></div>
      <div class="word-bank" id="word-bank" role="group" aria-label="اختر الحروف"></div>
      <div class="word-actions">
        <button class="secondary-button" type="button" data-action="undo-word">تراجع</button>
        <button class="secondary-button" type="button" data-action="clear-word">امسح</button>
        <button class="primary-button" type="button" data-action="check-word">تحقّق</button>
      </div>
      <p class="game-hint">${currentStage.hint || "اضغط الحروف بالترتيب، ثم تحقّق من الكلمة."}</p>`;
    updateWordTiles();
  }

  function updateWordTiles() {
    const answer = $("word-answer");
    const bank = $("word-bank");
    if (!answer || !bank || !round) return;
    answer.innerHTML = Array.from(currentStage.answer).map((_, slot) => {
      const tileIndex = round.wordSelection[slot];
      const letter = tileIndex === undefined ? "·" : round.wordTiles[tileIndex].letter;
      return `<span class="word-slot ${tileIndex === undefined ? "is-empty" : "is-filled"}">${letter}</span>`;
    }).join("");
    bank.innerHTML = round.wordTiles.map((tile, index) => {
      const used = round.wordSelection.includes(index);
      return `<button class="letter-tile ${used ? "is-used" : ""}" type="button" data-letter-index="${index}" ${used ? "disabled" : ""} aria-label="حرف ${tile.letter}">${tile.letter}</button>`;
    }).join("");
  }

  function renderBalance() {
    round.selectedWeights = [];
    if (!challengeArea) return;
    challengeArea.innerHTML = `
      <div class="challenge-intro"><span class="challenge-kicker">تحدّي التوازن</span>
        <h2>وازن الكفّتين</h2><p>${currentStage.description}</p></div>
      <div class="balance-scale" id="balance-scale">
        <div class="balance-beam" aria-hidden="true"></div>
        <div class="balance-pans">
          <div class="balance-pan"><span>أوزانك</span><strong id="balance-total">٠</strong><small id="balance-picked">لم تختر وزنًا</small></div>
          <div class="balance-pan balance-target"><span>الوزن المطلوب</span><strong>${toArabicNumerals(currentStage.targetWeight)}</strong><small>ثابت</small></div>
        </div>
      </div>
      <p class="balance-status" id="balance-status" aria-live="polite">اختر أوزانًا لتعديل الميزان.</p>
      <div class="weight-bank" role="group" aria-label="الأوزان المتاحة">
        ${currentStage.weights.map((weight, index) => `<button class="weight-tile" type="button" data-weight-index="${index}" aria-pressed="false">${toArabicNumerals(weight)}</button>`).join("")}
      </div>
      <div class="word-actions">
        <button class="secondary-button" type="button" data-action="reset-balance">أعد الاختيار</button>
        <button class="primary-button" type="button" data-action="check-balance">تحقّق من الميزان</button>
      </div>
      <p class="game-hint">${currentStage.hint || "اضغط الأوزان لإضافتها أو إزالتها من كفّتك."}</p>`;
    updateBalance();
  }

  function updateBalance() {
    if (!round || !currentStage) return;
    const total = round.selectedWeights.reduce((sum, index) => sum + currentStage.weights[index], 0);
    const target = currentStage.targetWeight;
    setText("balance-total", toArabicNumerals(total));
    setText("balance-picked", round.selectedWeights.length
      ? `${toArabicNumerals(round.selectedWeights.length)} أوزان مختارة`
      : "لم تختر وزنًا");
    const scale = $("balance-scale");
    const status = $("balance-status");
    const diff = total - target;
    if (scale) {
      scale.classList.toggle("is-balanced", diff === 0);
      scale.style.setProperty("--balance-tilt", `${Math.max(-9, Math.min(9, diff * 1.2))}deg`);
    }
    if (status) {
      status.textContent = diff === 0
        ? "متوازن تمامًا! اضغط للتحقّق."
        : diff < 0
          ? `الكفّة أخفّ بمقدار ${toArabicNumerals(Math.abs(diff))}.`
          : `الكفّة أثقل بمقدار ${toArabicNumerals(diff)}.`;
    }
    document.querySelectorAll("[data-weight-index]").forEach((button) => {
      const selected = round.selectedWeights.includes(Number(button.dataset.weightIndex));
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function toggleLightState(lights, index, size) {
    const row = Math.floor(index / size);
    const col = index % size;
    [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dy, dx]) => {
      const nextRow = row + dy;
      const nextCol = col + dx;
      if (nextRow >= 0 && nextRow < size && nextCol >= 0 && nextCol < size) {
        const next = nextRow * size + nextCol;
        lights[next] = !lights[next];
      }
    });
  }

  function renderLights() {
    const size = currentStage.size || 3;
    round.lights = Array(size * size).fill(false);
    (currentStage.scramble || []).forEach((index) => toggleLightState(round.lights, index, size));
    round.lightMoves = 0;
    if (!challengeArea) return;
    challengeArea.innerHTML = `
      <div class="challenge-intro"><span class="challenge-kicker">تحدّي المنطق</span>
        <h2>أطفئ المصابيح</h2><p>${currentStage.description}</p></div>
      <p class="lights-moves">الحركات: <strong id="lights-moves">٠</strong></p>
      <div class="lights-board" role="group" aria-label="لوحة المصابيح" style="--lights-size:${size}">
        ${round.lights.map((lit, index) => `<button class="light-tile ${lit ? "is-lit" : ""}" type="button" data-light-index="${index}" aria-label="مصباح ${toArabicNumerals(index + 1)} ${lit ? "مضاء" : "مطفأ"}" aria-pressed="${lit}"><span></span></button>`).join("")}
      </div>
      <p class="game-hint">${currentStage.hint || "كل ضغطة تغيّر المصباح الذي لمسته وجيرانه."}</p>`;
  }

  function updateLights() {
    const board = document.querySelector(".lights-board");
    if (!board || !round) return;
    board.querySelectorAll("[data-light-index]").forEach((button) => {
      const lit = round.lights[Number(button.dataset.lightIndex)];
      button.classList.toggle("is-lit", lit);
      button.setAttribute("aria-pressed", String(lit));
      button.setAttribute("aria-label", `مصباح ${toArabicNumerals(Number(button.dataset.lightIndex) + 1)} ${lit ? "مضاء" : "مطفأ"}`);
    });
    setText("lights-moves", toArabicNumerals(round.lightMoves));
  }

  function buildSlidingBoard(size, directions) {
    const tiles = Array.from({ length: size * size }, (_, index) => (index + 1) % (size * size));
    let blank = tiles.length - 1;
    const applied = [];
    const delta = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    directions.forEach((direction) => {
      const [dx, dy] = delta[direction] || [0, 0];
      const x = blank % size;
      const y = Math.floor(blank / size);
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx >= size || ny < 0 || ny >= size) return;
      const next = ny * size + nx;
      [tiles[blank], tiles[next]] = [tiles[next], tiles[blank]];
      blank = next;
      applied.push(direction);
    });
    return { tiles, blank, scramble: applied };
  }

  function renderSliding() {
    const size = currentStage.size || 3;
    round.sliding = buildSlidingBoard(size, currentStage.scramble || []);
    round.slidingSize = size;
    if (!challengeArea) return;
    challengeArea.innerHTML = `
      <div class="challenge-intro"><span class="challenge-kicker">تحدّي الترتيب</span>
        <h2>${currentStage.name}</h2><p>${currentStage.description}</p></div>
      <div class="sliding-board" role="group" aria-label="مربعات الأرقام" style="--slide-size:${size}" id="sliding-board"></div>
      <p class="sliding-status" id="sliding-status">حرّك المربعات بجوار الخانة الفارغة.</p>
      <p class="game-hint">المربع الفارغ هو المساحة المتاحة للحركة.</p>`;
    updateSliding();
  }

  function updateSliding() {
    const board = $("sliding-board");
    if (!board || !round) return;
    board.innerHTML = round.sliding.tiles.map((value, index) => `<button class="slide-tile ${value === 0 ? "is-blank" : ""}" type="button" data-slide-index="${index}" ${value === 0 ? "disabled aria-label=\"الخانة الفارغة\"" : `aria-label="حرّك الرقم ${toArabicNumerals(value)}"`}>${value ? toArabicNumerals(value) : ""}</button>`).join("");
  }

  function renderPath() {
    round.pathProgress = 0;
    round.pathConfig = currentStage.path;
    if (!challengeArea) return;
    challengeArea.innerHTML = `
      <div class="challenge-intro"><span class="challenge-kicker">تحدّي المسار</span>
        <h2>${currentStage.name}</h2><p>${currentStage.description}</p></div>
      <p class="path-progress">خطوات المسار: <strong id="path-progress">١</strong> / ${toArabicNumerals(currentStage.path.route.length)}</p>
      <div class="path-board" id="path-board" role="group" aria-label="شبكة الطريق" style="--path-columns:${currentStage.path.cols}"></div>
      <p class="game-hint">اضغط الخانة المجاورة المسموح بها، وتجنّب الصخور الرمادية.</p>`;
    updatePath();
  }

  function updatePath() {
    const board = $("path-board");
    if (!board || !round) return;
    const { cols, rows, route, walls } = round.pathConfig;
    const current = route[round.pathProgress];
    const row = Math.floor(current / cols);
    const col = current % cols;
    const neighbors = [
      row > 0 ? current - cols : -1,
      row < rows - 1 ? current + cols : -1,
      col > 0 ? current - 1 : -1,
      col < cols - 1 ? current + 1 : -1,
    ];
    board.innerHTML = Array.from({ length: cols * rows }, (_, index) => {
      const isWall = walls.includes(index);
      const isStart = index === route[0];
      const isGoal = index === route[route.length - 1];
      const traced = route.indexOf(index) >= 0 && route.indexOf(index) <= round.pathProgress;
      const frontier = neighbors.includes(index) && !isWall && index !== current;
      const mark = isStart ? "ب" : isGoal && round.pathProgress === route.length - 1 ? "✓" : isGoal ? "★" : traced ? "·" : "";
      return `<button class="path-cell ${isWall ? "is-wall" : ""} ${traced ? "is-traced" : ""} ${frontier ? "is-frontier" : ""} ${isGoal ? "is-goal" : ""}" type="button" data-path-index="${index}" ${isWall ? "disabled" : ""} aria-label="${isWall ? "صخرة" : isStart ? "بداية الطريق" : isGoal ? "نهاية الطريق" : `خانة ${toArabicNumerals(index + 1)}`}">${mark}</button>`;
    }).join("");
    setText("path-progress", toArabicNumerals(round.pathProgress + 1));
  }

  function renderReaction() {
    round.reactionState = "idle";
    if (!challengeArea) return;
    challengeArea.innerHTML = `
      <div class="challenge-intro"><span class="challenge-kicker">تحدّي سرعة الاستجابة</span>
        <h2>${currentStage.name}</h2><p>${currentStage.description}</p></div>
      <button class="reaction-button" id="reaction-button" type="button" data-action="reaction-tap" aria-live="polite">ابدأ الاختبار</button>
      <p class="reaction-message" id="reaction-message" aria-live="polite">لا تضغط حتى تظهر الإشارة الزرقاء.</p>
      <p class="game-hint">اللمس قبل الإشارة يعيد الاختبار من البداية.</p>`;
  }

  function renderCode() {
    round.codeDigits = Array.from({ length: currentStage.code.length }, () => 0);
    if (!challengeArea) return;
    challengeArea.innerHTML = `
      <div class="challenge-intro"><span class="challenge-kicker">تحدّي الاستنتاج</span>
        <h2>${currentStage.name}</h2><p>${currentStage.description}</p></div>
      <ul class="code-clues">${currentStage.codeHints.map((hint) => `<li>${hint}</li>`).join("")}</ul>
      <div class="code-wheels" role="group" aria-label="أرقام القفل">
        ${round.codeDigits.map((digit, index) => `<div class="code-wheel">
          <button type="button" data-code-index="${index}" data-code-step="1" aria-label="زيادة الرقم ${index + 1}">＋</button>
          <output data-code-digit="${index}" aria-live="polite">٠</output>
          <button type="button" data-code-index="${index}" data-code-step="-1" aria-label="إنقاص الرقم ${index + 1}">−</button>
        </div>`).join("")}
      </div>
      <button class="primary-button code-submit" type="button" data-action="check-code">افتح القفل</button>
      <p class="game-hint">حرّك كل عجلة حتى تصل إلى الرمز الصحيح.</p>`;
  }

  function shuffle(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  function handleChoice(index) {
    if (!round || round.finished || !currentStage) return;
    if (currentStage.type === "choice") {
      if (Number(index) === currentStage.correctIndex) finishStage(true);
      else wrongAnswer("ليست الإجابة الصحيحة بعد. أعد قراءة التحدّي وابحث عن فكرته.");
      return;
    }
    if (currentStage.type === "observe") {
      if (Number(index) === round.oddIndex) finishStage(true);
      else wrongAnswer("هذا الشكل يشبه البقية. تفحّص اتجاه الأضلاع.");
    }
  }

  function handleSortMove(from, to) {
    if (!round || currentStage?.type !== "sort") return;
    if (from < 0 || to < 0 || from >= round.sortItems.length || to >= round.sortItems.length) return;
    [round.sortItems[from], round.sortItems[to]] = [round.sortItems[to], round.sortItems[from]];
    updateSortList();
  }

  function checkSort() {
    if (!round || currentStage?.type !== "sort") return;
    const correct = currentStage.order;
    if (round.sortItems.every((id, index) => id === correct[index])) finishStage(true);
    else wrongAnswer("اقتربت! راجع ترتيب العناصر وحاول مرة أخرى.");
  }

  function handleMemoryCard(index) {
    if (!round || currentStage?.type !== "memory" || round.finished) return;
    if (round.openCards.length >= 2 || round.matchedCards.includes(index) || round.openCards.includes(index)) return;
    round.openCards.push(index);
    updateMemoryCard(index, true);
    if (round.openCards.length !== 2) return;
    const [first, second] = round.openCards;
    const matches = round.cards[first].pair === round.cards[second].pair;
    if (matches) {
      round.matchedCards.push(first, second);
      round.openCards = [];
      updateMemoryCard(first, true, true);
      updateMemoryCard(second, true, true);
      const found = round.matchedCards.length / 2;
      setText("memory-progress", `الأزواج المكتشفة: ${toArabicNumerals(found)} من ${toArabicNumerals(round.pairCount)}`);
      playTone(590, 0.1);
      if (found === round.pairCount) finishStage(true);
    } else {
      round.mistakes += 1;
      announce("ليستا زوجًا متشابهًا. حاول تذكّر مكان كل شكل.", "is-neutral");
      later(() => {
        updateMemoryCard(first, false);
        updateMemoryCard(second, false);
        round.openCards = [];
      }, 800);
    }
  }

  function updateMemoryCard(index, reveal, matched = false) {
    const card = document.querySelector(`[data-card-index="${index}"]`);
    if (!card) return;
    card.classList.toggle("is-revealed", reveal);
    card.classList.toggle("is-matched", matched);
    card.setAttribute("aria-pressed", String(reveal));
    card.setAttribute("aria-label", matched ? "زوج مكتمل" : reveal ? "بطاقة مكشوفة" : "بطاقة مخفية");
  }

  function handleGerbilTap(index) {
    if (!round || currentStage?.type !== "gerbil" || round.finished) return;
    if (Number(index) !== round.gerbilIndex) {
      announce("الجربوع ليس هنا. راقب المكان الذي ظهر فيه.", "is-neutral");
      return;
    }
    round.hits += 1;
    setText("gerbil-hit-count", toArabicNumerals(round.hits));
    playTone(670, 0.06);
    if (round.hits >= round.gerbilTarget) {
      finishStage(true, `أمسكت بالجربوع ${toArabicNumerals(round.gerbilTarget)} مرات. سرعة رائعة!`);
      return;
    }
    moveGerbil();
    round.gerbilNextAt = Date.now();
  }

  function handleColor(colorId) {
    if (!round || currentStage?.type !== "sequence" || !round.sequenceReady || round.finished) return;
    const expected = COLORS[round.sequence[round.sequenceInput.length]]?.id;
    if (colorId !== expected) {
      round.mistakes += 1;
      round.sequenceInput = [];
      announce("بدأ التسلسل من جديد؛ راقب الألوان ثم جرّب ثانية.", "is-warning");
      playColorSequence();
      return;
    }
    round.sequenceInput.push(colorId);
    setText("sequence-progress", `${toArabicNumerals(round.sequenceInput.length)} من ${toArabicNumerals(round.sequence.length)}`);
    playTone([380, 440, 500, 560][COLORS.findIndex((color) => color.id === colorId)], 0.1);
    if (round.sequenceInput.length === round.sequence.length) finishStage(true);
  }

  function submitRiddle(input) {
    if (!round || currentStage?.type !== "written" || round.finished) return;
    const answer = normalizeAnswer(input);
    if ((currentStage.answers || []).some((candidate) => normalizeAnswer(candidate) === answer)) finishStage(true);
    else wrongAnswer(currentStage.hint || "جرّب مرة أخرى، وفكّر في كل كلمة من اللغز.", "riddle-feedback");
  }

  function normalizeAnswer(value) {
    return String(value || "").trim().toLowerCase().normalize("NFD").replace(/\p{M}/gu, "")
      .replace(/[أإآ]/g, "ا").replace(/ى/g, "ي")
      .replace(/[٠-٩]/g, (digit) => String(ARABIC_NUMERALS.indexOf(digit)))
      .replace(/[۰-۹]/g, (digit) => String(PERSIAN_NUMERALS.indexOf(digit)))
      .replace(/[،,.؛:!?؟\s]/g, "");
  }

  function handleWordTile(index) {
    if (!round || currentStage?.type !== "word" || round.finished) return;
    const tileIndex = Number(index);
    if (round.wordSelection.includes(tileIndex) || !round.wordTiles[tileIndex]) return;
    round.wordSelection.push(tileIndex);
    updateWordTiles();
  }

  function checkWord() {
    if (!round || currentStage?.type !== "word" || round.finished) return;
    const guess = round.wordSelection.map((index) => round.wordTiles[index].letter).join("");
    if (normalizeAnswer(guess) === normalizeAnswer(currentStage.answer)) finishStage(true);
    else wrongAnswer("الحروف لا تكوّن الكلمة بعد. أعد ترتيبها أو تراجع عن حرف.");
  }

  function handleBalanceWeight(index) {
    if (!round || currentStage?.type !== "balance" || round.finished) return;
    const weightIndex = Number(index);
    if (round.selectedWeights.includes(weightIndex)) {
      round.selectedWeights = round.selectedWeights.filter((item) => item !== weightIndex);
    } else {
      round.selectedWeights.push(weightIndex);
    }
    updateBalance();
  }

  function checkBalance() {
    if (!round || currentStage?.type !== "balance" || round.finished) return;
    const total = round.selectedWeights.reduce((sum, index) => sum + currentStage.weights[index], 0);
    if (total === currentStage.targetWeight) finishStage(true, "توازن دقيق! جمعت الأوزان الصحيحة.");
    else wrongAnswer(total < currentStage.targetWeight
      ? "الكفّة ما زالت أخفّ. أضف وزنًا أو بدّل اختيارك."
      : "الكفّة أثقل من المطلوب. أزل وزنًا ثم حاول مجددًا.");
  }

  function handleLight(index) {
    if (!round || currentStage?.type !== "lights" || round.finished) return;
    toggleLightState(round.lights, Number(index), currentStage.size);
    round.lightMoves += 1;
    updateLights();
    playTone(430 + Number(index) * 18, 0.06);
    if (!round.lights.some(Boolean)) finishStage(true, `أطفأت اللوحة في ${toArabicNumerals(round.lightMoves)} حركات.`);
  }

  function handleSlidingTile(index) {
    if (!round || currentStage?.type !== "sliding" || round.finished) return;
    const tileIndex = Number(index);
    const size = round.slidingSize;
    const blank = round.sliding.blank;
    const adjacent = Math.abs(tileIndex % size - blank % size) + Math.abs(Math.floor(tileIndex / size) - Math.floor(blank / size)) === 1;
    if (!adjacent) {
      announce("حرّك مربعًا مجاورًا للخانة الفارغة فقط.", "is-neutral");
      return;
    }
    [round.sliding.tiles[blank], round.sliding.tiles[tileIndex]] = [round.sliding.tiles[tileIndex], round.sliding.tiles[blank]];
    round.sliding.blank = tileIndex;
    round.slidingMoves = (round.slidingMoves || 0) + 1;
    updateSliding();
    if (round.sliding.tiles.every((value, position) => value === (position + 1) % round.sliding.tiles.length)) {
      finishStage(true, `رتّبت المربعات في ${toArabicNumerals(round.slidingMoves)} حركة.`);
    }
  }

  function handlePathTile(index) {
    if (!round || currentStage?.type !== "path" || round.finished) return;
    const route = round.pathConfig.route;
    const expected = route[round.pathProgress + 1];
    if (Number(index) !== expected) {
      wrongAnswer("هذه ليست الخطوة التالية. اتبع الخانات المتجاورة المفتوحة.");
      return;
    }
    round.pathProgress += 1;
    updatePath();
    playTone(450, 0.045);
    if (round.pathProgress === route.length - 1) finishStage(true, "وصلت إلى نهاية المسار من دون أن تضلّ الطريق.");
  }

  function cancelLater(timerId) {
    if (!timerId) return;
    window.clearTimeout(timerId);
    timeouts = timeouts.filter((id) => id !== timerId);
  }

  function startReaction() {
    if (!round || currentStage?.type !== "reaction" || round.finished || round.reactionState !== "idle") return;
    round.reactionState = "waiting";
    const button = $("reaction-button");
    if (button) {
      button.classList.remove("is-ready");
      button.textContent = "انتظر الإشارة…";
    }
    setText("reaction-message", "لا تلمس بعد؛ راقب الضوء.");
    const delay = (currentStage.minDelay || 1000) + Math.random() * ((currentStage.maxDelay || 2400) - (currentStage.minDelay || 1000));
    round.reactionWaitTimer = later(() => {
      if (!round || round.finished || currentStage?.type !== "reaction") return;
      round.reactionState = "ready";
      round.reactionStartedAt = Date.now();
      if (button) {
        button.classList.add("is-ready");
        button.textContent = "الآن! المس بسرعة";
      }
      setText("reaction-message", "ظهرت الإشارة! اضغط الآن.");
      playTone(640, 0.12);
      round.reactionFailTimer = later(() => finishStage(false, "انتهى وقت الإشارة. عبقر يدعوك لمحاولة جديدة."), currentStage.timeLimit || 8000);
    }, delay);
  }

  function handleReactionTap() {
    if (!round || currentStage?.type !== "reaction" || round.finished) return;
    if (round.reactionState === "idle") {
      startReaction();
      return;
    }
    const button = $("reaction-button");
    if (round.reactionState === "waiting") {
      cancelLater(round.reactionWaitTimer);
      round.reactionState = "idle";
      round.mistakes += 1;
      if (button) {
        button.classList.remove("is-ready");
        button.textContent = "حاول من جديد";
      }
      setText("reaction-message", "كانت لمسة مبكرة! انتظر ظهور الإشارة هذه المرة.");
      announce("لم تظهر الإشارة بعد. انتظر اللون الأزرق.", "is-warning");
      return;
    }
    cancelLater(round.reactionFailTimer);
    const elapsed = Date.now() - round.reactionStartedAt;
    if (elapsed <= currentStage.targetMs) {
      finishStage(true, `استجابتك مذهلة: ${toArabicNumerals(elapsed)} مللي ثانية!`);
      return;
    }
    round.mistakes += 1;
    round.reactionState = "idle";
    if (button) {
      button.classList.remove("is-ready");
      button.textContent = "حاول من جديد";
    }
    setText("reaction-message", `استغرقت ${toArabicNumerals(elapsed)} مللي ثانية. أعد الاختبار وحاول أن تكون أسرع.`);
  }

  function updateCodeDigit(index) {
    const output = document.querySelector(`[data-code-digit="${index}"]`);
    if (output) output.textContent = toArabicNumerals(round.codeDigits[index]);
  }

  function handleCodeStep(index, step) {
    if (!round || currentStage?.type !== "code" || round.finished) return;
    const digitIndex = Number(index);
    if (!Number.isInteger(digitIndex) || digitIndex < 0 || digitIndex >= round.codeDigits.length) return;
    round.codeDigits[digitIndex] = (round.codeDigits[digitIndex] + Number(step) + 10) % 10;
    updateCodeDigit(digitIndex);
  }

  function checkCode() {
    if (!round || currentStage?.type !== "code" || round.finished) return;
    if (round.codeDigits.join("") === currentStage.code) finishStage(true, "انفتح القفل! استنتاجك كان صحيحًا.");
    else wrongAnswer("الرمز غير صحيح. أعد فحص القرائن وعدّل العجلات.");
  }

  function wrongAnswer(message, targetId) {
    if (!round || round.finished) return;
    round.mistakes += 1;
    announce(message, "is-warning");
    const target = targetId ? $(targetId) : null;
    if (target) target.textContent = message;
    playTone(220, 0.1);
  }

  function finishStage(won, customMessage) {
    if (!round || round.finished) return;
    round.finished = true;
    clearTimers();
    const result = $("result-screen");
    if (!result) return;
    if (won) {
      const stars = round.mistakes === 0 ? 3 : round.mistakes <= 2 ? 2 : 1;
      const oldStars = saved.bestStars[currentStage.id] || 0;
      const firstClear = !saved.completed.includes(currentStage.id);
      if (firstClear) saved.completed.push(currentStage.id);
      const award = stars > oldStars
        ? currentStage.reward + Math.max(0, stars - 1) * 20
        : 0;
      if (stars > oldStars) {
        saved.bestStars[currentStage.id] = stars;
        saved.stars += stars - oldStars;
        saved.score += award;
      }
      saved.lastStage = currentStage.id;
      saveGame();
      playTone(720, 0.18);
      const next = STAGES.find((stage) => stage.id === currentStage.id + 1);
      const winMood = stars === 3 ? "joy" : "success";
      const winImage = `./assets/character/${winMood}.png`;
    result.innerHTML = `
        <div class="result-card result-win">
          <span class="result-eyebrow">إنجاز جديد</span>
          <div class="result-stars" aria-label="${stars} من ٣ نجوم">${"★".repeat(stars)}${"☆".repeat(3 - stars)}</div>
          <h2 id="result-title">أحسنت يا عبقري!</h2>
          <p id="result-message">${customMessage || "أتممت التحدي بذكاء. عبقر فخور بك!"}</p>
          <div class="result-reward"><span>نقاط المرحلة</span><strong>+${toArabicNumerals(award)}</strong></div>
          <p class="result-total">مجموعك الآن: ${toArabicNumerals(saved.score)} نقطة</p>
          <div class="result-actions">
            ${next ? `<button class="primary-button" type="button" data-action="next-stage">المرحلة التالية</button>` : `<button class="primary-button" type="button" data-action="show-map">استكشف العوالم</button>`}
            <button class="secondary-button" type="button" data-action="show-map">خريطة المراحل</button>
          </div>
          <img class="result-mascot" src="${winImage}" alt="عبقر يحتفل بالفوز">
        </div>`;
      setMascotMood(winMood);
    } else {
      playTone(180, 0.18);
      result.innerHTML = `
        <div class="result-card result-try-again">
          <span class="result-eyebrow">محاولة جديدة</span>
          <h2 id="result-title">لا بأس، المحاولة تعلّمنا!</h2>
          <p id="result-message">${customMessage || "خذ نفسًا، وجرّب التحدي مرة أخرى. عبقر معك."}</p>
          <div class="result-actions">
            <button class="primary-button" type="button" data-action="restart-stage">أعد المحاولة</button>
            <button class="secondary-button" type="button" data-action="show-map">خريطة المراحل</button>
          </div>
          <img class="result-mascot" src="./assets/character/sad.png" alt="عبقر يشجّع على المحاولة">
        </div>`;
      setMascotMood("sad");
    }
    updateStats();
    showScreen("result-screen");
  }

  function announce(message, kind = "") {
    const box = $("feedback-message");
    if (!box) return;
    box.textContent = message;
    box.className = `feedback-message ${kind}`;
    box.hidden = false;
    if (feedbackTimer !== null) window.clearTimeout(feedbackTimer);
    feedbackTimer = window.setTimeout(() => {
      box.hidden = true;
      feedbackTimer = null;
    }, 2600);
  }

  function toArabicNumerals(value) {
    return String(value).replace(/\d/g, (digit) => ARABIC_NUMERALS[Number(digit)]);
  }

  function playTone(frequency, duration) {
    if (!saved.sound) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.045, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + duration);
      oscillator.onended = () => context.close();
    } catch (error) {
      announce("الصوت غير متاح في هذا المتصفح.", "is-neutral");
    }
  }

  function handleAction(action, button) {
    if (action === "start-game") {
      const id = Number(button?.dataset.stage) || nextPlayableStage().id;
      startStage(id);
    } else if (action === "show-map") {
      openMap();
    } else if (action === "home") {
      clearTimers();
      setMascotMood("welcome");
      showScreen("home-screen");
    } else if (action === "back-map") {
      openMap();
    } else if (action === "sound") {
      saved.sound = !saved.sound;
      saveGame();
      updateStats();
      if (saved.sound) playTone(520, 0.1);
    } else if (action === "reset-progress") {
      if (window.confirm("هل تريد حذف كل النقاط والنجوم والمراحل المحفوظة؟ لا يمكن التراجع عن ذلك.")) {
        clearTimers();
        saved = freshSave();
        currentStage = null;
        saveGame();
        activeWorld = WORLD_DATA[0].id;
        refreshHome();
        setMascotMood("welcome");
        showScreen("home-screen");
        announce("تمت إعادة التقدم إلى البداية.", "is-neutral");
      }
    } else if (action === "restart-stage" && currentStage) {
      startStage(currentStage.id);
    } else if (action === "next-stage" && currentStage) {
      const next = STAGES.find((stage) => stage.id === currentStage.id + 1);
      if (next) startStage(next.id);
      else openMap();
    } else if (action === "check-sort") {
      checkSort();
    } else if (action === "replay-sequence") {
      playColorSequence();
    } else if (action === "undo-word" && round && currentStage?.type === "word") {
      round.wordSelection.pop();
      updateWordTiles();
    } else if (action === "clear-word" && round && currentStage?.type === "word") {
      round.wordSelection = [];
      updateWordTiles();
    } else if (action === "check-word") {
      checkWord();
    } else if (action === "reset-balance" && round && currentStage?.type === "balance") {
      round.selectedWeights = [];
      updateBalance();
    } else if (action === "check-balance") {
      checkBalance();
    } else if (action === "reaction-tap") {
      handleReactionTap();
    } else if (action === "check-code") {
      checkCode();
    }
  }

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const actionButton = target.closest("[data-action]");
    if (actionButton) {
      if (actionButton instanceof HTMLAnchorElement) event.preventDefault();
      handleAction(actionButton.dataset.action, actionButton);
      return;
    }
    const worldTab = target.closest("[data-world]");
    if (worldTab) {
      activeWorld = worldTab.dataset.world;
      renderWorldTabs();
      renderStageGrid();
      return;
    }
    const stageCard = target.closest("[data-stage]");
    if (stageCard) {
      startStage(stageCard.dataset.stage);
      return;
    }
    const answer = target.closest("[data-answer]");
    if (answer) {
      handleChoice(answer.dataset.answer);
      return;
    }
    const card = target.closest("[data-card-index]");
    if (card) {
      handleMemoryCard(Number(card.dataset.cardIndex));
      return;
    }
    const gerbil = target.closest("[data-gerbil-index]");
    if (gerbil) {
      handleGerbilTap(gerbil.dataset.gerbilIndex);
      return;
    }
    const move = target.closest("[data-move]");
    if (move) {
      moveMaze(move.dataset.move);
      return;
    }
    const colorPad = target.closest("[data-color]");
    if (colorPad) {
      handleColor(colorPad.dataset.color);
      return;
    }
    const sortMove = target.closest("[data-sort-move]");
    if (sortMove) {
      const from = Number(sortMove.dataset.sortMove);
      const to = from + Number(sortMove.dataset.direction);
      handleSortMove(from, to);
      return;
    }
    const letter = target.closest("[data-letter-index]");
    if (letter) {
      handleWordTile(letter.dataset.letterIndex);
      return;
    }
    const weight = target.closest("[data-weight-index]");
    if (weight) {
      handleBalanceWeight(weight.dataset.weightIndex);
      return;
    }
    const light = target.closest("[data-light-index]");
    if (light) {
      handleLight(light.dataset.lightIndex);
      return;
    }
    const slide = target.closest("[data-slide-index]");
    if (slide && !slide.disabled) {
      handleSlidingTile(slide.dataset.slideIndex);
      return;
    }
    const pathTile = target.closest("[data-path-index]");
    if (pathTile && !pathTile.disabled) {
      handlePathTile(pathTile.dataset.pathIndex);
      return;
    }
    const codeWheel = target.closest("[data-code-index]");
    if (codeWheel) {
      handleCodeStep(codeWheel.dataset.codeIndex, codeWheel.dataset.codeStep);
      return;
    }
    const sortTile = target.closest("[data-stage-tile]");
    if (sortTile && currentStage?.type === "sort" && !draggedSortItem) {
      const index = Number(sortTile.dataset.stageTile);
      if (round.sortSelected === undefined) {
        round.sortSelected = index;
        sortTile.classList.add("is-selected");
      } else if (round.sortSelected !== index) {
        handleSortMove(round.sortSelected, index);
        round.sortSelected = undefined;
      } else {
        round.sortSelected = undefined;
        sortTile.classList.remove("is-selected");
      }
    }
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || form.id !== "riddle-form") return;
    event.preventDefault();
    submitRiddle(new FormData(form).get("answer"));
  });

  document.addEventListener("pointerdown", (event) => {
    const tile = event.target instanceof Element ? event.target.closest("[data-stage-tile]") : null;
    if (!tile || currentStage?.type !== "sort") return;
    sortPointer = {
      from: Number(tile.dataset.stageTile),
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
      moved: false,
    };
  }, { passive: true });

  document.addEventListener("pointermove", (event) => {
    if (!sortPointer || sortPointer.pointerId !== event.pointerId) return;
    if (Math.hypot(event.clientX - sortPointer.x, event.clientY - sortPointer.y) > 12) {
      sortPointer.moved = true;
    }
  }, { passive: true });

  document.addEventListener("pointerup", (event) => {
    if (!sortPointer || sortPointer.pointerId !== event.pointerId) return;
    const pointer = sortPointer;
    sortPointer = null;
    if (!pointer.moved || currentStage?.type !== "sort") return;
    const destination = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-stage-tile]");
    if (destination) {
      handleSortMove(pointer.from, Number(destination.dataset.stageTile));
      draggedSortItem = true;
      window.setTimeout(() => { draggedSortItem = false; }, 0);
    }
  }, { passive: true });

  document.addEventListener("dragstart", (event) => {
    const tile = event.target instanceof Element ? event.target.closest("[data-stage-tile]") : null;
    if (!tile || !round) return;
    round.dragIndex = Number(tile.dataset.stageTile);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
  });

  document.addEventListener("dragover", (event) => {
    if (event.target instanceof Element && event.target.closest("[data-stage-tile]")) event.preventDefault();
  });

  document.addEventListener("drop", (event) => {
    const tile = event.target instanceof Element ? event.target.closest("[data-stage-tile]") : null;
    if (!tile || !round || round.dragIndex === undefined) return;
    event.preventDefault();
    handleSortMove(round.dragIndex, Number(tile.dataset.stageTile));
    round.dragIndex = undefined;
  });

  document.addEventListener("keydown", (event) => {
    if (currentStage?.type !== "maze" || !round || round.finished) return;
    const direction = {
      ArrowUp: "up",
      ArrowRight: "right",
      ArrowDown: "down",
      ArrowLeft: "left",
    }[event.key];
    if (direction) {
      event.preventDefault();
      moveMaze(direction);
    }
  });

  function init() {
    updateStats();
    refreshHome();
    if ($("world-tabs")) renderWorldTabs();
    if ($("stage-grid")) renderStageGrid();
    showScreen("home-screen");
  }

  init();
})();
