/* ==========================================================
   عبقر ABQAR — ads.js
   طبقة الإعلانات المكافِئة (Rewarded Ads)

   لا يحتوي هذا الملف على أي إعلان وهمي ولا معرّفات إعلانات.
   الحالة الافتراضية: provider = 'none' (الإعلانات غير مفعّلة).

   الواجهة التي سيستخدمها game.js:
     Ads.showRewarded()  ← يعيد Promise تنتهي بكائن:
        {
          status:    'completed' | 'dismissed' | 'unavailable' | 'error' | 'busy',
          completed: true فقط إذا اكتمل الإعلان فعلًا,
          message:   رسالة عربية جاهزة للعرض على اللاعب,
          simulated: true فقط في وضع الاختبار الداخلي (لم يُعرض إعلان حقيقي)
        }
     Ads.isConfigured()  ← هل تم اختيار مزوّد وإعداده؟
     Ads.describe()      ← معلومات عن الحالة الحالية
   ========================================================== */

(function () {
  'use strict';

  /* ======================================================
     الإعدادات — هنا فقط تغيّر ما يلزم عند ربط خدمة حقيقية
     ====================================================== */
  var CONFIG = {
    // 'none'   : لا إعلانات (الحالة الافتراضية)
    // 'h5'     : Google H5 Games Ads للويب (يحتاج حسابًا وموافقة، انظر الشرح)
    // 'native' : جسر إلى تطبيق Android (AdMob عبر غلاف أصلي لاحقًا)
    provider: 'none',

    // لمزوّد h5 فقط: معرّف الناشر الذي تعطيه لك Google، يبدأ بـ ca-pub-
    // اتركه فارغًا حتى تحصل على حساب حقيقي. لا تضع قيمة تخمينية.
    h5Client: '',

    // لمزوّد h5 فقط: وضع الإعلانات التجريبية الرسمي من Google.
    // اجعله true أثناء التطوير، و false عند النشر الفعلي.
    h5TestMode: true,

    // وضع الاختبار الداخلي: يسمح لك بتجربة منطق «التخطي» دون خدمة إعلانات.
    // لا يعرض أي إعلان ولا يحقق أي دخل. يجب أن يبقى false في النسخة المنشورة.
    devSimulate: false,

    // أقصى مدة انتظار لجاهزية الإعلان قبل اعتباره غير متوفر
    timeoutMs: 12000
  };

  /* ---------- الرسائل العربية ---------- */
  var MSG = {
    completed:   'اكتمل الإعلان، يمكنك تخطي هذا اللغز.',
    notConfigured: 'خدمة الإعلانات غير مفعّلة في هذه النسخة، لذلك لا يمكن التخطي الآن. جرّب حل اللغز!',
    unavailable: 'لا يتوفر إعلان الآن. جرّب بعد قليل أو حاول حل اللغز.',
    dismissed:   'أُغلق الإعلان قبل اكتماله، لذلك لم يُحتسب التخطي.',
    error:       'تعذّر عرض الإعلان. تأكد من اتصالك بالإنترنت ثم أعد المحاولة.',
    busy:        'الإعلان قيد التحضير، انتظر لحظة.',
    simulated:   'وضع الاختبار: لم يُعرض إعلان حقيقي. هذا للتجربة فقط.'
  };

  var busy = false;
  var h5Promise = null;

  function result(status, message, extra) {
    var r = {
      status: status,
      completed: (status === 'completed'),
      message: message
    };
    if (extra && extra.simulated) { r.simulated = true; }
    return r;
  }

  /* ======================================================
     مزوّد الويب: Google H5 Games Ads
     (يتطلب حساب AdSense معتمدًا وتفعيل H5 Games Ads له)
     ====================================================== */
  function h5Ready() {
    return typeof CONFIG.h5Client === 'string' && /^ca-pub-\d+$/.test(CONFIG.h5Client);
  }

  function loadH5() {
    if (h5Promise) { return h5Promise; }

    h5Promise = new Promise(function (resolve, reject) {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adBreak = window.adConfig = function (o) {
        window.adsbygoogle.push(o);
      };

      var s = document.createElement('script');
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' +
              encodeURIComponent(CONFIG.h5Client);
      s.setAttribute('data-ad-client', CONFIG.h5Client);
      if (CONFIG.h5TestMode) { s.setAttribute('data-adbreak-test', 'on'); }

      s.onload = function () {
        try {
          window.adConfig({ preloadAdBreaks: 'on', sound: 'on' });
        } catch (e) { /* نتجاهل خطأ الإعداد، وسيظهر لاحقًا عند الطلب */ }
        resolve();
      };
      s.onerror = function () {
        h5Promise = null; // نسمح بإعادة المحاولة لاحقًا
        reject(new Error('h5-script-failed'));
      };
      document.head.appendChild(s);
    });

    return h5Promise;
  }

  function showH5() {
    return loadH5().then(function () {
      return new Promise(function (resolve) {
        var finished = false;
        var viewed = false;
        var dismissed = false;
        var timer = null;

        function finish(status) {
          if (finished) { return; }
          finished = true;
          clearTimeout(timer);
          resolve(result(status, MSG[status === 'completed' ? 'completed' : status]));
        }

        // مهلة الانتظار تخص جاهزية الإعلان فقط، وتتوقف عند بدء العرض
        timer = setTimeout(function () { finish('unavailable'); }, CONFIG.timeoutMs);

        try {
          window.adBreak({
            type: 'reward',
            name: 'skip-puzzle',
            beforeReward: function (showAdFn) {
              clearTimeout(timer);
              showAdFn();
            },
            adViewed:    function () { viewed = true; },
            adDismissed: function () { dismissed = true; },
            adBreakDone: function (info) {
              var st = info && info.breakStatus;
              if (viewed || st === 'viewed') { finish('completed'); return; }
              if (dismissed || st === 'dismissed') { finish('dismissed'); return; }
              if (st === 'notReady' || st === 'noAdPreloaded' || st === 'frequencyCapped' ||
                  st === 'timeout' || st === 'ignored') {
                finish('unavailable'); return;
              }
              finish('error');
            }
          });
        } catch (e) {
          finish('error');
        }
      });
    }, function () {
      return result('error', MSG.error);
    });
  }

  /* ======================================================
     مزوّد Android: جسر لتطبيق أصلي (لاحقًا)
     التطبيق الأصلي يجب أن يوفّر الكائن التالي داخل صفحة اللعبة:
       window.AbqarNativeAds.showRewarded()  ← Promise<boolean>
       (true فقط إذا اكتمل الإعلان وحصل المستخدم على المكافأة)
     ====================================================== */
  function nativeReady() {
    return !!(window.AbqarNativeAds && typeof window.AbqarNativeAds.showRewarded === 'function');
  }

  function showNative() {
    if (!nativeReady()) {
      return Promise.resolve(result('unavailable', MSG.notConfigured));
    }
    return new Promise(function (resolve) {
      var done = false;
      var timer = setTimeout(function () {
        if (!done) { done = true; resolve(result('unavailable', MSG.unavailable)); }
      }, CONFIG.timeoutMs + 60000); // وقت إضافي لأن الإعلان قد يستغرق عرضه

      Promise.resolve()
        .then(function () { return window.AbqarNativeAds.showRewarded(); })
        .then(function (ok) {
          if (done) { return; }
          done = true; clearTimeout(timer);
          resolve(ok === true ? result('completed', MSG.completed) : result('dismissed', MSG.dismissed));
        })
        .catch(function () {
          if (done) { return; }
          done = true; clearTimeout(timer);
          resolve(result('error', MSG.error));
        });
    });
  }

  /* ======================================================
     الواجهة العامة
     ====================================================== */
  function isConfigured() {
    if (CONFIG.devSimulate) { return true; }
    if (CONFIG.provider === 'h5') { return h5Ready(); }
    if (CONFIG.provider === 'native') { return nativeReady(); }
    return false;
  }

  function showRewarded() {
    if (busy) { return Promise.resolve(result('busy', MSG.busy)); }

    // وضع الاختبار الداخلي: لا إعلان حقيقي
    if (CONFIG.devSimulate) {
      busy = true;
      if (window.console) { console.warn('[ABQAR] devSimulate مفعّل: لا يُعرض إعلان حقيقي. أوقفه قبل النشر.'); }
      return new Promise(function (resolve) {
        setTimeout(function () {
          busy = false;
          resolve(result('completed', MSG.simulated, { simulated: true }));
        }, 1200);
      });
    }

    if (!isConfigured()) {
      return Promise.resolve(result('unavailable', MSG.notConfigured));
    }

    busy = true;
    var p;
    if (CONFIG.provider === 'h5') { p = showH5(); }
    else if (CONFIG.provider === 'native') { p = showNative(); }
    else { p = Promise.resolve(result('unavailable', MSG.notConfigured)); }

    return p.then(function (r) { busy = false; return r; },
                  function ()  { busy = false; return result('error', MSG.error); });
  }

  function describe() {
    return {
      provider: CONFIG.provider,
      configured: isConfigured(),
      testMode: !!(CONFIG.h5TestMode && CONFIG.provider === 'h5'),
      devSimulate: !!CONFIG.devSimulate
    };
  }

  window.Ads = {
    showRewarded: showRewarded,
    isConfigured: isConfigured,
    describe: describe
  };
})();
