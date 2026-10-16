/* ==========================================================
   عبقر ABQAR — characters.js
   رسومات الشخصيات الخمس بصيغة SVG (أصلية، دون أي ملفات صور)

   طريقة الاستخدام داخل الصفحة:
   <div data-char="abqar" data-size="100" data-mood="happy"></div>

   الأسماء: abqar | jarbou | fateen | lammah | lughz
   التعبيرات: happy | cheer | sad | think | wow

   الدوال المتاحة للملفات الأخرى:
   Characters.svg(name, size, mood)      ← يعيد نص SVG
   Characters.mount(root)                ← يملأ كل عناصر data-char داخل root
   Characters.set(el, name, mood, size)  ← يغيّر شخصية أو تعبير عنصر محدد
   Characters.INFO                       ← أسماء الشخصيات ووصفها
   ========================================================== */

(function () {
  'use strict';

  var INK = '#11284f';
  var MOODS = ['happy', 'cheer', 'sad', 'think', 'wow'];

  /* ---------- معلومات الشخصيات ---------- */
  var INFO = {
    abqar:  { name: 'عبقر',  role: 'العبقري الصغير صاحب الأفكار' },
    jarbou: { name: 'جربوع', role: 'المرح السريع' },
    fateen: { name: 'فطين',  role: 'محب المنطق والأرقام' },
    lammah: { name: 'لمّاح', role: 'صاحب الملاحظة الدقيقة' },
    lughz:  { name: 'لغز',   role: 'الغامض صاحب المفاجآت' }
  };

  /* ---------- أجزاء الوجه المشتركة ---------- */

  function eyes(lx, rx, y, mood, o) {
    o = o || {};
    var r = o.r || 9;
    if (mood === 'wow') { r += 2; }
    var ink = o.ink || INK;
    var pupilColor = o.pupil || INK;
    var white = o.white || '#ffffff';
    var ring = o.ring || INK;
    var brow = o.brow || INK;
    var out = '';
    var xs = [lx, rx];
    var i, x;

    // عيون مغمضة ضاحكة عند الاحتفال
    if (mood === 'cheer') {
      for (i = 0; i < xs.length; i++) {
        x = xs[i];
        out += '<path d="M' + (x - 8) + ' ' + (y + 3) + ' Q' + x + ' ' + (y - 9) + ' ' + (x + 8) + ' ' + (y + 3) +
               '" fill="none" stroke="' + ink + '" stroke-width="3.5" stroke-linecap="round"/>';
      }
      return out;
    }

    var dx = 0;
    var dy = 0;
    if (mood === 'think') { dx = -3; dy = -3; }
    if (mood === 'sad') { dy = 2.5; }

    for (i = 0; i < xs.length; i++) {
      x = xs[i];
      out += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + white + '" stroke="' + ring + '" stroke-width="1.5"/>';
      out += '<circle cx="' + (x + dx) + '" cy="' + (y + dy) + '" r="' + (r * 0.52) + '" fill="' + pupilColor + '"/>';
      out += '<circle cx="' + (x + dx + r * 0.2) + '" cy="' + (y + dy - r * 0.2) + '" r="' + (r * 0.18) + '" fill="#ffffff"/>';
    }

    // الحواجب
    var by = y - r - 5;
    var bs = 'fill="none" stroke="' + brow + '" stroke-width="3" stroke-linecap="round"';
    if (mood === 'sad') {
      out += '<path d="M' + (lx - 8) + ' ' + (by + 1) + ' L' + (lx + 6) + ' ' + (by - 4) + '" ' + bs + '/>';
      out += '<path d="M' + (rx - 6) + ' ' + (by - 4) + ' L' + (rx + 8) + ' ' + (by + 1) + '" ' + bs + '/>';
    } else if (mood === 'wow') {
      out += '<path d="M' + (lx - 7) + ' ' + by + ' Q' + lx + ' ' + (by - 7) + ' ' + (lx + 7) + ' ' + by + '" ' + bs + '/>';
      out += '<path d="M' + (rx - 7) + ' ' + by + ' Q' + rx + ' ' + (by - 7) + ' ' + (rx + 7) + ' ' + by + '" ' + bs + '/>';
    } else if (mood === 'think') {
      out += '<path d="M' + (lx - 7) + ' ' + by + ' L' + (lx + 7) + ' ' + by + '" ' + bs + '/>';
      out += '<path d="M' + (rx - 7) + ' ' + (by + 1) + ' Q' + rx + ' ' + (by - 8) + ' ' + (rx + 7) + ' ' + (by - 2) + '" ' + bs + '/>';
    }
    return out;
  }

  function mouth(x, y, mood, o) {
    o = o || {};
    var s = o.s || 1;
    var ink = o.ink || INK;
    var stroke = 'fill="none" stroke="' + ink + '" stroke-width="3.5" stroke-linecap="round"';

    if (mood === 'cheer') {
      return '<path d="M' + (x - 12 * s) + ' ' + (y - 2) + ' Q' + x + ' ' + (y + 20 * s) + ' ' + (x + 12 * s) + ' ' + (y - 2) +
             ' Z" fill="#7a1f2e" stroke="' + ink + '" stroke-width="2.5" stroke-linejoin="round"/>' +
             '<ellipse cx="' + x + '" cy="' + (y + 8 * s) + '" rx="' + (5 * s) + '" ry="' + (3 * s) + '" fill="#f58a8a"/>';
    }
    if (mood === 'sad') {
      return '<path d="M' + (x - 9 * s) + ' ' + (y + 5) + ' Q' + x + ' ' + (y - 5 * s) + ' ' + (x + 9 * s) + ' ' + (y + 5) + '" ' + stroke + '/>';
    }
    if (mood === 'think') {
      return '<path d="M' + (x - 8 * s) + ' ' + (y + 2) + ' L' + (x + 8 * s) + ' ' + (y - 2) + '" ' + stroke + '/>';
    }
    if (mood === 'wow') {
      return '<ellipse cx="' + x + '" cy="' + (y + 3) + '" rx="' + (6 * s) + '" ry="' + (8 * s) + '" fill="#7a1f2e" stroke="' + ink + '" stroke-width="2.5"/>';
    }
    // happy
    return '<path d="M' + (x - 10 * s) + ' ' + y + ' Q' + x + ' ' + (y + 10 * s) + ' ' + (x + 10 * s) + ' ' + y + '" ' + stroke + '/>';
  }

  function cheeks(lx, rx, y, mood) {
    if (mood !== 'happy' && mood !== 'cheer') { return ''; }
    return '<circle cx="' + lx + '" cy="' + y + '" r="6" fill="#ff9aa2" opacity="0.55"/>' +
           '<circle cx="' + rx + '" cy="' + y + '" r="6" fill="#ff9aa2" opacity="0.55"/>';
  }

  /* ---------- الشخصيات ---------- */

  // عبقر: رأس أزرق ووجه فاتح ومصباح فكرة ذهبي
  function abqar(m) {
    var sad = (m === 'sad');
    var bulb = sad ? '#b9c4da' : '#ffd95a';
    var rays = '';
    if (!sad) {
      rays = '<g stroke="#f5b800" stroke-width="3" stroke-linecap="round">' +
             '<path d="M60 3 V7"/><path d="M70.6 9.4 L73.4 6.6"/><path d="M49.4 9.4 L46.6 6.6"/>' +
             '<path d="M75 20 H79"/><path d="M45 20 H41"/></g>';
    }
    return rays +
      '<circle cx="21" cy="72" r="8" fill="#f5b800" stroke="#d99a00" stroke-width="2"/>' +
      '<circle cx="99" cy="72" r="8" fill="#f5b800" stroke="#d99a00" stroke-width="2"/>' +
      '<circle cx="60" cy="70" r="40" fill="#1e63d6" stroke="#0b3d91" stroke-width="3"/>' +
      '<ellipse cx="60" cy="74" rx="31" ry="28" fill="#f4f8ff"/>' +
      '<rect x="53" y="30" width="14" height="7" rx="2" fill="#9fb0d0"/>' +
      '<circle cx="60" cy="21" r="11" fill="' + bulb + '" stroke="#d99a00" stroke-width="2.5"/>' +
      '<path d="M55 21 Q60 14 65 21" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>' +
      eyes(47, 73, 70, m, { r: 9 }) +
      cheeks(38, 82, 83, m) +
      mouth(60, 90, m, { s: 1 });
  }

  // جربوع: قفّاز صحراوي بأذنين كبيرتين وذيل طويل
  function jarbou(m) {
    return '<path d="M94 96 Q117 100 112 76" fill="none" stroke="#c98d52" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="111" cy="72" r="6" fill="#8a5a2b"/>' +
      '<ellipse cx="38" cy="30" rx="11" ry="24" fill="#d9a066" stroke="#a8713a" stroke-width="2.5" transform="rotate(-12 38 30)"/>' +
      '<ellipse cx="38" cy="32" rx="5.5" ry="16" fill="#f4b6b6" transform="rotate(-12 38 30)"/>' +
      '<ellipse cx="82" cy="30" rx="11" ry="24" fill="#d9a066" stroke="#a8713a" stroke-width="2.5" transform="rotate(12 82 30)"/>' +
      '<ellipse cx="82" cy="32" rx="5.5" ry="16" fill="#f4b6b6" transform="rotate(12 82 30)"/>' +
      '<ellipse cx="44" cy="106" rx="11" ry="5" fill="#c98d52"/>' +
      '<ellipse cx="76" cy="106" rx="11" ry="5" fill="#c98d52"/>' +
      '<ellipse cx="60" cy="72" rx="36" ry="32" fill="#d9a066" stroke="#a8713a" stroke-width="3"/>' +
      '<ellipse cx="60" cy="81" rx="24" ry="19" fill="#f6dcb5"/>' +
      eyes(46, 74, 64, m, { r: 10 }) +
      '<g stroke="#a8713a" stroke-width="1.8" stroke-linecap="round">' +
        '<path d="M30 80 L43 81"/><path d="M30 86 L43 85"/>' +
        '<path d="M90 80 L77 81"/><path d="M90 86 L77 85"/></g>' +
      '<ellipse cx="60" cy="76" rx="4.5" ry="3.5" fill="#e58a8a"/>' +
      cheeks(40, 80, 80, m) +
      mouth(60, 87, m, { s: 0.8 });
  }

  // فطين: رأس فيروزي بنظارة وقبعة تخرّج وشارة حساب
  function fateen(m) {
    return '<rect x="22" y="34" width="76" height="70" rx="24" fill="#12a594" stroke="#0b6f64" stroke-width="3"/>' +
      '<rect x="30" y="48" width="60" height="50" rx="18" fill="#d9f5f0"/>' +
      '<path d="M40 44 V58 Q60 67 80 58 V44" fill="#1d3a73"/>' +
      '<polygon points="22,38 60,22 98,38 60,54" fill="#11284f" stroke="#07275e" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M98 38 V56" stroke="#f5b800" stroke-width="2.5" stroke-linecap="round"/>' +
      '<circle cx="98" cy="59" r="4" fill="#f5b800"/>' +
      eyes(46, 74, 68, m, { r: 8 }) +
      '<g fill="rgba(255,255,255,0.3)" stroke="#11284f" stroke-width="3">' +
        '<circle cx="46" cy="68" r="13"/><circle cx="74" cy="68" r="13"/></g>' +
      '<path d="M59 68 H61" stroke="#11284f" stroke-width="3" stroke-linecap="round"/>' +
      cheeks(35, 85, 86, m) +
      mouth(60, 89, m, { s: 0.9 }) +
      '<circle cx="24" cy="96" r="11" fill="#ffd95a" stroke="#d99a00" stroke-width="2"/>' +
      '<text x="24" y="102" text-anchor="middle" font-size="17" font-weight="900" fill="#11284f" font-family="Arial, sans-serif">+</text>';
  }

  // لمّاح: رأس برتقالي بعينين كبيرتين وعدسة مكبّرة
  function lammah(m) {
    return '<path d="M36 40 L42 14 L52 34 L60 10 L68 34 L78 14 L84 40 Z" fill="#f08a24" stroke="#b5600d" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<circle cx="60" cy="68" r="38" fill="#f08a24" stroke="#b5600d" stroke-width="3"/>' +
      '<ellipse cx="60" cy="72" rx="29" ry="26" fill="#ffe6c7"/>' +
      eyes(46, 74, 66, m, { r: 11 }) +
      cheeks(37, 83, 82, m) +
      mouth(54, 89, m, { s: 0.9 }) +
      '<circle cx="90" cy="90" r="15" fill="rgba(255,255,255,0.35)" stroke="#d99a00" stroke-width="5"/>' +
      '<path d="M82 85 Q85 80 91 79" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M101 101 L112 113" stroke="#8a5a2b" stroke-width="6" stroke-linecap="round"/>';
  }

  // لغز: غامض بقلنسوة بنفسجية وعلامة استفهام ذهبية
  function lughz(m) {
    var o = { r: 8, ink: '#ffd95a', pupil: '#6a3fb5', white: '#fff8d6', ring: 'none', brow: '#ffd95a' };
    return '<g stroke="#ffd95a" stroke-width="3" stroke-linecap="round">' +
        '<path d="M12 16 V30"/><path d="M5 23 H19"/>' +
        '<path d="M108 34 V44"/><path d="M103 39 H113"/></g>' +
      '<path d="M60 12 Q104 14 104 70 Q104 108 60 110 Q16 108 16 70 Q16 14 60 12 Z" fill="#4b2a8a" stroke="#2d1759" stroke-width="3"/>' +
      '<ellipse cx="60" cy="72" rx="29" ry="27" fill="#1b1240"/>' +
      '<ellipse cx="60" cy="72" rx="29" ry="27" fill="none" stroke="#ffd95a" stroke-width="2" opacity="0.7"/>' +
      '<text x="60" y="42" text-anchor="middle" font-size="26" font-weight="900" fill="#ffd95a" font-family="Arial, sans-serif">?</text>' +
      eyes(48, 72, 71, m, o) +
      mouth(60, 91, m, { s: 0.8, ink: '#ffd95a' });
  }

  var BUILDERS = {
    abqar: abqar,
    jarbou: jarbou,
    fateen: fateen,
    lammah: lammah,
    lughz: lughz
  };

  /* ---------- الدوال العامة ---------- */

  function svg(name, size, mood) {
    var build = BUILDERS[name] || BUILDERS.abqar;
    var info = INFO[name] || INFO.abqar;
    var m = (MOODS.indexOf(mood) !== -1) ? mood : 'happy';
    var s = parseInt(size, 10) || 80;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="' + s + '" height="' + s +
           '" role="img" aria-label="' + info.name + '" focusable="false">' + build(m) + '</svg>';
  }

  function fill(el) {
    var name = el.getAttribute('data-char');
    var size = el.getAttribute('data-size');
    var mood = el.getAttribute('data-mood');
    el.innerHTML = svg(name, size, mood);
  }

  function mount(root) {
    var scope = root || document;
    var list = scope.querySelectorAll('[data-char]');
    for (var i = 0; i < list.length; i++) {
      fill(list[i]);
    }
  }

  function set(el, name, mood, size) {
    if (!el) { return; }
    if (name) { el.setAttribute('data-char', name); }
    if (mood) { el.setAttribute('data-mood', mood); }
    if (size) { el.setAttribute('data-size', String(size)); }
    fill(el);
  }

  window.Characters = {
    INFO: INFO,
    MOODS: MOODS,
    svg: svg,
    mount: mount,
    set: set
  };

  // رسم كل الشخصيات الموجودة في الصفحة عند التحميل
  mount(document);
})();
