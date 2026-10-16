
"use strict";

/* =========================================
   عبقر ABQAR — محرك اللعبة
   الإصدار الأول
========================================= */

const $ = (id) => document.getElementById(id);

const STORAGE_KEY = "abqar_game_save_v1";
const TOTAL_STAGES = 20;

/* ---------- بنك الألغاز ---------- */

const puzzles = [
  {
    id: 1,
    category: "numbers",
    type: "متتاليات عددية",
    icon: "🔢",
    title: "اكتشف العدد التالي",
    question: "2، 4، 6، 8، ؟",
    answers: ["10", "١٠", "عشرة"],
    hint: "أضف العدد نفسه في كل مرة.",
    explanation: "نضيف 2 في كل خطوة، لذلك العدد التالي هو 10.",
    difficulty: 1
  },
  {
    id: 2,
    category: "logic",
    type: "تفكير منطقي",
    icon: "🧠",
    title: "من الأكبر؟",
    question: "أحمد أطول من خالد، وخالد أطول من فهد. من الأقصر؟",
    answers: ["فهد", "فهد هو الأقصر"],
    hint: "رتّب الأشخاص حسب الطول من الأكبر إلى الأصغر.",
    explanation: "أحمد أطول من خالد، وخالد أطول من فهد؛ إذن فهد هو الأقصر.",
    difficulty: 1
  },
  {
    id: 3,
    category: "patterns",
    type: "اكتشاف الأنماط",
    icon: "🔷",
    title: "ما الشكل التالي؟",
    question: "🔵 🔴 🔵 🔴 🔵 ؟",
    answers: ["🔴", "احمر", "أحمر", "الدائرة الحمراء"],
    hint: "لاحظ أن اللونين يتناوبان.",
    explanation: "يتكرر الأزرق ثم الأحمر؛ لذلك التالي أحمر.",
    difficulty: 1
  },
  {
    id: 4,
    category: "riddles",
    type: "لغز ذكي",
    icon: "💡",
    title: "فكّر خارج الصندوق",
    question: "ما الشيء الذي كلما أخذت منه كبر؟",
    answers: ["الحفرة", "حفرة"],
    hint: "يمكنك حفره في الأرض.",
    explanation: "الحفرة تكبر كلما أزلت المزيد من التراب منها.",
    difficulty: 1
  },
  {
    id: 5,
    category: "numbers",
    type: "متتاليات عددية",
    icon: "➗",
    title: "تحدي الأرقام",
    question: "5، 10، 15، 20، ؟",
    answers: ["25", "٢٥", "خمسة وعشرون"],
    hint: "كم نضيف إلى كل عدد؟",
    explanation: "نضيف 5 في كل مرة، فيكون العدد التالي 25.",
    difficulty: 1
  },
  {
    id: 6,
    category: "logic",
    type: "تفكير منطقي",
    icon: "🐑",
    title: "عدّ الحيوانات",
    question: "في مزرعة 3 دجاجات، ولكل دجاجة رجلان. كم عدد أرجل الدجاجات؟",
    answers: ["6", "٦", "ستة"],
    hint: "لكل دجاجة رجلان.",
    explanation: "3 × 2 = 6 أرجل.",
    difficulty: 1
  },
  {
    id: 7,
    category: "patterns",
    type: "اكتشاف الأنماط",
    icon: "⭐",
    title: "تتابع النجوم",
    question: "⭐ ⭐⭐ ⭐⭐⭐ ؟",
    answers: ["4", "٤", "اربع", "أربع", "أربع نجوم", "⭐⭐⭐⭐"],
    hint: "يزداد عدد النجوم واحدة في كل مجموعة.",
    explanation: "المجموعة التالية تحتوي على أربع نجوم.",
    difficulty: 1
  },
  {
    id: 8,
    category: "riddles",
    type: "لغز ذكي",
    icon: "🕰️",
    title: "لغز الوقت",
    question: "كم دقيقة في ساعتين؟",
    answers: ["120", "١٢٠", "مئة وعشرون", "مائة وعشرون"],
    hint: "الساعة الواحدة فيها 60 دقيقة.",
    explanation: "60 × 2 = 120 دقيقة.",
    difficulty: 1
  },
  {
    id: 9,
    category: "numbers",
    type: "متتاليات عددية",
    icon: "🔢",
    title: "أكمل النمط",
    question: "1، 3، 5، 7، ؟",
    answers: ["9", "٩", "تسعة"],
    hint: "الأعداد فردية وتزيد بمقدار 2.",
    explanation: "العدد الفردي التالي بعد 7 هو 9.",
    difficulty: 1
  },
  {
    id: 10,
    category: "logic",
    type: "استنتاج",
    icon: "📚",
    title: "ترتيب الكتب",
    question: "كتاب قبل القاموس، والقاموس قبل الدفتر. ما الشيء الذي يأتي أخيرًا؟",
    answers: ["الدفتر", "دفتر"],
    hint: "رتّب الأشياء حسب الجملتين.",
    explanation: "الكتاب ثم القاموس ثم الدفتر.",
    difficulty: 1
  },
  {
    id: 11,
    category: "numbers",
    type: "متتاليات عددية",
    icon: "🔢",
    title: "ما العدد المفقود؟",
    question: "3، 6، 12، 24، ؟",
    answers: ["48", "٤٨", "ثمانية واربعون", "ثمانية وأربعون"],
    hint: "كل عدد يساوي ضعف العدد السابق.",
    explanation: "24 × 2 = 48.",
    difficulty: 2
  },
  {
    id: 12,
    category: "riddles",
    type: "لغز ذكي",
    icon: "📖",
    title: "لغز الكلمات",
    question: "شيء تملكه أنت، لكن الآخرين يستخدمونه أكثر منك. ما هو؟",
    answers: ["اسمك", "الاسم", "اسمي"],
    hint: "يناديك الناس به.",
    explanation: "اسمك؛ فالآخرون يستخدمونه عند مناداتك.",
    difficulty: 2
  },
  {
    id: 13,
    category: "logic",
    type: "تفكير منطقي",
    icon: "🐈",
    title: "لغز القطط",
    question: "إذا كان أمام قطة قطتان، وخلفها قطتان، وبينها قطة واحدة، فما أقل عدد ممكن من القطط في صف واحد؟",
    answers: ["3", "٣", "ثلاث", "ثلاثة"],
    hint: "تخيّل ثلاث قطط مصطفّة: واحدة في الوسط.",
    explanation: "ثلاث قطط في صف واحد تكفي: واحدة في الوسط وواحدة على كل طرف.",
    difficulty: 2
  },
  {
    id: 14,
    category: "patterns",
    type: "اكتشاف الأنماط",
    icon: "🔺",
    title: "تسلسل الأشكال",
    question: "🔺 🔺🔺 🔺🔺🔺 ؟",
    answers: ["6", "٦", "ستة", "ستة مثلثات", "🔺🔺🔺🔺🔺🔺"],
    hint: "كل مجموعة تزيد مثلثًا واحدًا.",
    explanation: "المجموعة التالية فيها ستة مثلثات.",
    difficulty: 2
  },
  {
    id: 15,
    category: "numbers",
    type: "حساب ذهني",
    icon: "➕",
    title: "احسب بسرعة",
    question: "إذا كان 4 + 4 = 8، فكم يساوي 8 + 8؟",
    answers: ["16", "١٦", "ستة عشر"],
    hint: "ضاعف العدد 8.",
    explanation: "8 + 8 = 16.",
    difficulty: 2
  },
  {
    id: 16,
    category: "logic",
    type: "استنتاج",
    icon: "🌧️",
    title: "طقس غريب",
    question: "خرج شخص تحت المطر بلا مظلة ولم يبتل شعره. كيف؟",
    answers: ["أصلع", "كان أصلع", "ليس لديه شعر", "ما عنده شعر"],
    hint: "فكّر في حالة شعره.",
    explanation: "لأنه أصلع، فلا يوجد شعر على رأسه ليبتل.",
    difficulty: 2
  },
  {
    id: 17,
    category: "numbers",
    type: "متتاليات عددية",
    icon: "🔢",
    title: "تحدي المتتالية",
    question: "1، 4، 9، 16، ؟",
    answers: ["25", "٢٥", "خمسة وعشرون"],
    hint: "هذه مربعات الأعداد: 1²، 2²، 3²، 4².",
    explanation: "العدد التالي هو 5²، أي 25.",
    difficulty: 3
  },
  {
    id: 18,
    category: "riddles",
    type: "لغز ذكي",
    icon: "🗺️",
    title: "لغز البلدان",
    question: "ما الشيء الذي فيه مدن بلا بيوت، وأنهار بلا ماء، وجبال بلا حجارة؟",
    answers: ["الخريطة", "خارطة", "خريطة"],
    hint: "تستخدمه لمعرفة الطرق والأماكن.",
    explanation: "الخريطة تعرض رموز المدن والأنهار والجبال.",
    difficulty: 3
  },
  {
    id: 19,
    category: "logic",
    type: "تفكير منطقي",
    icon: "🍎",
    title: "تقسيم التفاح",
    question: "لديك 6 تفاحات، وأردت تقسيمها بالتساوي على 3 أشخاص. كم تفاحة لكل شخص؟",
    answers: ["2", "٢", "اثنتان", "اثنين", "تفاحتان"],
    hint: "اقسم 6 على 3.",
    explanation: "6 ÷ 3 = 2 تفاحتين لكل شخص.",
    difficulty: 2
  },
  {
    id: 20,
    category: "numbers",
    type: "تحدي الأرقام",
    icon: "🏆",
    title: "اختبار العبقرية",
    question: "2، 6، 12، 20، 30، ؟",
    answers: ["42", "٤٢", "اثنان واربعون", "اثنان وأربعون"],
    hint: "الفروق هي 4، ثم 6، ثم 8، ثم 10. ما الفرق التالي؟",
    explanation: "نضيف 12 إلى 30، فيكون الناتج 42.",
    difficulty: 3
  }
];

/* ---------- الإنجازات ---------- */

const achievementDefinitions = [
  {
    id: "first",
    icon: "🌱",
    title: "البداية",
    description: "أكمل أول مرحلة.",
    condition: (s) => s.completed.length >= 1
  },
  {
    id: "five",
    icon: "🔥",
    title: "خطوات ثابتة",
    description: "أكمل خمس مراحل.",
    condition: (s) => s.completed.length >= 5
  },
  {
    id: "ten",
    icon: "🧠",
    title: "عقل متقد",
    description: "أكمل عشر مراحل.",
    condition: (s) => s.completed.length >= 10
  },
  {
    id: "twenty",
    icon: "🏆",
    title: "بطل عبقر",
    description: "أكمل جميع المراحل المتاحة.",
    condition: (s) => s.completed.length >= TOTAL_STAGES
  },
  {
    id: "stars",
    icon: "⭐",
    title: "جامع النجوم",
    description: "اجمع 30 نجمة.",
    condition: (s) => Object.values(s.stars).reduce((a, b) => a + b, 0) >= 30
  },
  {
    id: "points",
    icon: "💎",
    title: "رصيد ذهبي",
    description: "اجمع 500 نقطة.",
    condition: (s) => s.points >= 500
  }
];

/* ---------- الحالة والحفظ ---------- */

function createDefaultState() {
  return {
    points: 0,
    completed: [],
    stars: {},
    unlocked: 1,
    bestStreak: 0,
    currentStreak: 0,
    achievements: [],
    settings: {
      sound: true,
      vibration: true,
      reducedMotion: false
    }
  };
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return createDefaultState();

    const parsed = JSON.parse(saved);
    const defaults = createDefaultState();

    return {
      ...defaults,
      ...parsed,
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      stars: parsed.stars && typeof parsed.stars === "object" ? parsed.stars : {},
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
      settings: {
        ...defaults.settings,
        ...(parsed.settings || {})
      }
    };
  } catch (error) {
    console.warn("تعذر تحميل الحفظ السابق.", error);
    return createDefaultState();
  }
}

let state = loadState();
let currentStage = 1;
let currentPuzzle = null;
let attempts = 0;
let hintUsed = false;
let answeredCorrectly = false;
let lastEarnedPoints = 0;
let lastEarnedStars = 0;
let lastCategory = null;
let isSubmitting = false;

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("تعذر حفظ التقدم على الجهاز.", error);
  }
}

/* ---------- أدوات مساعدة ---------- */

function normalizeAnswer(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/[.,،!?؟]/g, "")
    .replace(/\s+/g, " ");
}

function isCorrectAnswer(value, puzzle) {
  const answer = normalizeAnswer(value);
  return puzzle.answers.some((candidate) => normalizeAnswer(candidate) === answer);
}

function getPuzzle(stage) {
  return puzzles.find((puzzle) => puzzle.id === stage) || null;
}

function getCompletedCount() {
  return state.completed.length;
}

function getTotalStars() {
  return Object.values(state.stars).reduce((total, stars) => total + stars, 0);
}

function buzz(pattern = 25) {
  if (!state.settings.vibration) return;
  if ("vibrate" in navigator) navigator.vibrate(pattern);
}

function showFeedback(message, kind = "") {
  const box = $("feedbackMessage");
  if (!box) return;
  box.textContent = message;
  box.className = "feedback-message";
  if (kind) box.classList.add(kind);
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.id === screenId);
  });

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.screen === screenId);
  });

  window.scrollTo({
    top: 0,
    behavior: state.settings.reducedMotion ? "auto" : "smooth"
  });

  if (screenId === "homeScreen") renderHome();
  if (screenId === "mapScreen") renderMap();
  if (screenId === "achievementsScreen") renderAchievements();
}

/* ---------- الصفحة الرئيسية ---------- */

function renderHome() {
  $("headerPoints").textContent = state.points;
  $("completedCount").textContent = getCompletedCount();
  $("totalStars").textContent = getTotalStars();
  $("bestStreak").textContent = state.bestStreak;

  const nextStage = Math.min(state.unlocked, TOTAL_STAGES);
  $("continueButton").disabled = false;

  const continueText = $("continueButton").querySelector("span");
  if (continueText) {
    continueText.textContent =
      state.completed.length >= TOTAL_STAGES ? "أعد التحدي" : "ابدأ التحدي";
  }

  const title = $("mapProgressTitle");
  const text = $("mapProgressText");

  if (title && text) {
    title.textContent =
      state.completed.length >= TOTAL_STAGES ? "أكملت الرحلة!" : `المرحلة ${nextStage}`;
    text.textContent =
      state.completed.length >= TOTAL_STAGES
        ? "يمكنك إعادة لعب أي مرحلة مفتوحة."
        : "واصل التقدم وافتح مراحل جديدة.";
  }
}

/* ---------- خريطة المراحل ---------- */

function renderMap() {
  const grid = $("stageGrid");
  grid.replaceChildren();

  for (let stage = 1; stage <= TOTAL_STAGES; stage++) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "stage-button";

    const isCompleted = state.completed.includes(stage);
    const isUnlocked = stage <= state.unlocked;
    const stars = Number(state.stars[stage] || 0);

    if (isCompleted) button.classList.add("completed");
    if (stage === state.unlocked && !isCompleted) button.classList.add("current");
    if (!isUnlocked) button.classList.add("locked");

    const number = document.createElement("span");
    number.className = "stage-number";
    number.textContent = isUnlocked ? String(stage) : "🔒";

    const status = document.createElement("small");
    status.className = "stage-stars";
    status.textContent = isCompleted ? "★".repeat(stars) + "☆".repeat(3 - stars) : isUnlocked ? "ابدأ" : "مقفلة";

    button.append(number, status);
    button.disabled = !isUnlocked;

    button.addEventListener("click", () => {
      if (isUnlocked) startStage(stage);
    });

    grid.appendChild(button);
  }

  $("stageCountText").textContent =
    `${getCompletedCount()} من ${TOTAL_STAGES} مرحلة مكتملة`;

  $("mapProgressTitle").textContent =
    state.completed.length >= TOTAL_STAGES ? "رحلة مكتملة" : `المرحلة ${state.unlocked}`;

  $("mapProgressText").textContent =
    `جمعت ${getTotalStars()} نجمة حتى الآن.`;
}

/* ---------- بدء المرحلة ---------- */

function startStage(stage, category = null) {
  if (stage < 1 || stage > TOTAL_STAGES) return;
  if (stage > state.unlocked) return;

  currentStage = stage;
  currentPuzzle = getPuzzle(stage);
  if (!currentPuzzle) return;

  attempts = 0;
  hintUsed = false;
  answeredCorrectly = false;
  lastEarnedPoints = 0;
  lastEarnedStars = 0;
  lastCategory = category;

  $("stageLabel").textContent = `المرحلة ${stage}`;
  $("puzzleNumber").textContent = `التحدي ${String(stage).padStart(2, "0")}`;
  $("puzzleType").textContent = currentPuzzle.type;
  $("puzzleTitle").textContent = currentPuzzle.title;
  $("puzzleQuestion").textContent = currentPuzzle.question;
  $("puzzleIllustration").textContent = currentPuzzle.icon;
  $("gamePoints").textContent = state.points;
  $("gameProgressFill").style.width =
    `${((stage - 1) / TOTAL_STAGES) * 100}%`;

  $("answerInput").value = "";
  $("answerInput").disabled = false;
  $("submitAnswer").disabled = false;
  $("submitAnswer").textContent = "تحقّق من الإجابة";
  $("hintButton").disabled = false;
  $("hintBox").hidden = true;
  $("hintText").textContent = currentPuzzle.hint;
  $("attemptsText").textContent = "فكّر بهدوء قبل أن تجيب";

  showFeedback("");
  showScreen("gameScreen");

  setTimeout(() => {
    if ($("gameScreen").classList.contains("active")) {
      $("answerInput").focus({ preventScroll: true });
    }
  }, 150);
}

/* ---------- التحقق من الإجابة ---------- */

function submitAnswer() {
  if (!currentPuzzle || isSubmitting || answeredCorrectly) return;

  const input = $("answerInput");
  const value = input.value.trim();

  if (!value) {
    showFeedback("اكتب إجابتك أولًا.", "error");
    input.focus();
    return;
  }

  attempts++;

  if (!isCorrectAnswer(value, currentPuzzle)) {
    state.currentStreak = 0;
    saveState();
    showFeedback("ليست الإجابة الصحيحة بعد. حاول مرة أخرى!", "error");
    $("attemptsText").textContent = `عدد المحاولات: ${attempts}`;
    buzz([25, 40, 25]);
    return;
  }

  isSubmitting = true;
  answeredCorrectly = true;

  const stars = hintUsed ? 2 : attempts === 1 ? 3 : 2;
  const basePoints = currentPuzzle.difficulty === 1 ? 30 :
    currentPuzzle.difficulty === 2 ? 45 : 60;
  const bonus = attempts === 1 && !hintUsed ? 10 : 0;
  const earned = basePoints + bonus;

  lastEarnedPoints = earned;
  lastEarnedStars = stars;

  state.points += earned;
  state.currentStreak++;
  state.bestStreak = Math.max(state.bestStreak, state.currentStreak);

  if (!state.completed.includes(currentStage)) {
    state.completed.push(currentStage);
  }

  state.stars[currentStage] = Math.max(
    Number(state.stars[currentStage] || 0),
    stars
  );

  state.unlocked = Math.min(
    TOTAL_STAGES,
    Math.max(state.unlocked, currentStage + 1)
  );

  checkAchievements();
  saveState();

  $("answerInput").disabled = true;
  $("submitAnswer").disabled = true;
  $("hintButton").disabled = true;
  $("submitAnswer").textContent = "أحسنت!";

  showFeedback(
    `إجابة صحيحة! ${currentPuzzle.explanation}`,
    "success"
  );

  $("gamePoints").textContent = state.points;
  $("attemptsText").textContent = `+${earned} نقطة · ${stars} نجوم`;
  $("gameProgressFill").style.width =
    `${(currentStage / TOTAL_STAGES) * 100}%`;

  buzz([35, 50, 70]);

  setTimeout(() => {
    isSubmitting = false;
    showResult();
  }, 1200);
}

/* ---------- التلميحات ---------- */

function useHint() {
  if (!currentPuzzle || hintUsed || answeredCorrectly) return;

  hintUsed = true;
  $("hintText").textContent = currentPuzzle.hint;
  $("hintBox").hidden = false;
  $("hintButton").disabled = true;
  $("attemptsText").textContent = "استخدمت التلميح؛ يمكنك إكمال الحل.";

  buzz(20);
}

/* ---------- شاشة النتيجة ---------- */

function showResult() {
  $("resultMedal").textContent =
    lastEarnedStars === 3 ? "🏆" : lastEarnedStars === 2 ? "🥇" : "🎯";

  $("resultEyebrow").textContent =
    lastEarnedStars === 3 ? "أداء رائع!" : "أحسنت!";
  $("resultTitle").textContent = "حللت اللغز بنجاح";
  $("resultMessage").textContent = currentPuzzle.explanation;
  $("resultStars").textContent =
    "★".repeat(lastEarnedStars) + "☆".repeat(3 - lastEarnedStars);
  $("earnedPoints").textContent = lastEarnedPoints;
  $("resultCorrect").textContent = "1";

  const nextButton = $("nextStageButton");

  if (currentStage >= TOTAL_STAGES) {
    nextButton.textContent = "عد إلى المراحل";
    nextButton.onclick = () => showScreen("mapScreen");
  } else {
    nextButton.textContent = "المرحلة التالية ←";
    nextButton.onclick = () => {
      const next = currentStage + 1;
      if (next <= state.unlocked) {
        startStage(next);
      } else {
        showScreen("mapScreen");
      }
    };
  }

  showScreen("resultScreen");
}

/* ---------- الإنجازات ---------- */

function checkAchievements() {
  for (const achievement of achievementDefinitions) {
    if (
      !state.achievements.includes(achievement.id) &&
      achievement.condition(state)
    ) {
      state.achievements.push(achievement.id);
    }
  }
}

function renderAchievements() {
  checkAchievements();
  saveState();

  const list = $("achievementsList");
  list.replaceChildren();

  for (const achievement of achievementDefinitions) {
    const unlocked = state.achievements.includes(achievement.id);

    const item = document.createElement("article");
    item.className = "achievement-item";
    if (unlocked) item.classList.add("unlocked");

    const icon = document.createElement("div");
    icon.className = "achievement-icon";
    icon.textContent = achievement.icon;

    const copy = document.createElement("div");
    copy.className = "achievement-copy";

    const title = document.createElement("strong");
    title.textContent = achievement.title;

    const description = document.createElement("p");
    description.textContent = achievement.description;

    copy.append(title, description);

    const status = document.createElement("span");
    status.className = "achievement-status";
    status.textContent = unlocked ? "تم الفتح ✓" : "مقفول";

    item.append(icon, copy, status);
    list.appendChild(item);
  }

  $("achievementCount").textContent =
    `${state.achievements.length} / ${achievementDefinitions.length}`;
}

/* ---------- الإعدادات ---------- */

function syncSettings() {
  $("soundToggle").checked = state.settings.sound;
  $("vibrationToggle").checked = state.settings.vibration;
  $("motionToggle").checked = state.settings.reducedMotion;

  document.documentElement.style.scrollBehavior =
    state.settings.reducedMotion ? "auto" : "smooth";
}

function bindSettings() {
  $("soundToggle").addEventListener("change", (event) => {
    state.settings.sound = event.target.checked;
    saveState();
  });

  $("vibrationToggle").addEventListener("change", (event) => {
    state.settings.vibration = event.target.checked;
    saveState();
  });

  $("motionToggle").addEventListener("change", (event) => {
    state.settings.reducedMotion = event.target.checked;
    syncSettings();
    saveState();
  });

  $("resetProgressButton").addEventListener("click", () => {
    const confirmed = window.confirm(
      "هل تريد إعادة ضبط جميع النقاط والمراحل والإنجازات؟ لا يمكن التراجع عن ذلك."
    );

    if (!confirmed) return;

    state = createDefaultState();
    saveState();
    syncSettings();
    renderHome();
    renderMap();
    renderAchievements();
    showScreen("homeScreen");
  });
}

/* ---------- ربط الأزرار ---------- */

function bindNavigation() {
  document.querySelectorAll("[data-screen]").forEach((button) => {
    button.addEventListener("click", () => {
      showScreen(button.dataset.screen);
    });
  });

  $("settingsButton").addEventListener("click", () => {
    showScreen("settingsScreen");
  });

  $("continueButton").addEventListener("click", () => {
    const stage = state.completed.length >= TOTAL_STAGES
      ? TOTAL_STAGES
      : state.unlocked;
    startStage(stage);
  });

  $("exitGameButton").addEventListener("click", () => {
    showScreen("mapScreen");
  });

  $("submitAnswer").addEventListener("click", submitAnswer);
  $("hintButton").addEventListener("click", useHint);

  $("answerInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") submitAnswer();
  });

  $("retryButton").addEventListener("click", () => {
    startStage(currentStage);
  });

  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;
      const matchingPuzzle = puzzles.find(
        (puzzle) =>
          puzzle.category === category &&
          puzzle.id <= state.unlocked
      );

      if (matchingPuzzle) {
        startStage(matchingPuzzle.id, category);
      } else {
        showScreen("mapScreen");
      }
    });
  });
}

/* ---------- التشغيل ---------- */

function initGame() {
  bindNavigation();
  bindSettings();
  syncSettings();

  checkAchievements();
  saveState();

  renderHome();
  renderMap();
  renderAchievements();

  showScreen("homeScreen");

  console.info("عبقر: تم تشغيل اللعبة.");
}

document.addEventListener("DOMContentLoaded", initGame);

