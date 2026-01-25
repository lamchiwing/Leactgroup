(() => {
  // ===== CONFIG =====
  // Your Apps Script Web App URL (exec)
  const WEB_APP_BASE =
    "https://script.google.com/macros/s/AKfycbwpsL4RKmIOFkVIxqdGfT4FxaH2Fp3zmNrCY2_cgrsMiO4jblAj_oEFNYNOrPQuU9ZJeA/exec?t=leactrent";

  // Default tenant: from meta tag <meta name="leact-tenant-default" content="leactrent">
  function getDefaultTenant() {
    const meta = document.querySelector('meta[name="leact-tenant-default"]');
    return meta ? String(meta.getAttribute("content") || "").trim() : "";
  }

  // Tenant can be overridden by URL query: ?t=clientA
  function getTenantFromQuery() {
    const u = new URL(location.href);
    const t = (u.searchParams.get("t") || "").trim();
    return t;
  }

  function buildFormUrl() {
    const t = getTenantFromQuery() || getDefaultTenant();
    if (!t) return WEB_APP_BASE; // fallback (still works for single-tenant)
    // Ensure we pass tenant_id into doGet() => inject token
    const url = new URL(WEB_APP_BASE);
    url.searchParams.set("t", t);
    return url.toString();
  }

  function openForm() {
    const url = buildFormUrl();
    if (!url || url.includes("REPLACE_WITH")) {
      alert("Contact form is not configured yet. Please set WEB_APP_BASE.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=800");
  }

  // ===== i18n =====
  const i18n = {
    zh: {
      pageTitle: "KACH & Partner Automation",
      tools: "TOOLS",
      consultant: "CONSULTANT",
      pricing: "PRICING",
      getStarted: "Get Started",

      monthly: "每月租用詳情",
      consultNow: "即刻諮詢",

      c1_title: "Lead Intake & Routing",
      c1_desc: "所有查詢集中一個入口，自動分類派發。",
      c1_1: "集中全平台查詢入口",
      c1_2: "智能自動分類",
      c1_3: "精準派位予合適團隊",
      c1_4: "確保零漏單、极速回覆",

      c2_title: "Internal Ops Automation",
      c2_desc: "行政流程自動化，減少重覆人手。",
      c2_1: "自動化重覆行政流程",
      c2_2: "大幅減少人為錯誤",
      c2_3: "節省 40% 以上行政工時",
      c2_4: "標準化內部協作",

      c3_title: "Customer Support Automation",
      c3_desc: "用流程處理常見客服，保持穩定回覆。",
      c3_1: "7x24 自動處理常見問題",
      c3_2: "減少 60% 真人對話量",
      c3_3: "保持 100% 統一回覆口徑",
      c3_4: "無縫對接人工客服升級",

      c4_title: "Reporting & Monitoring",
      c4_desc: "營運數據自動整理，異常即時提醒。",
      c4_1: "數據自動同步與整合",
      c4_2: "視覺化即時儀表板",
      c4_3: "異常狀態即時 Alert",
      c4_4: "平日無憂，有事必應",

      c5_title: "Compliance / Guardrails",
      c5_desc: "系統強制流程，保留完整紀錄。",
      c5_1: "系統級強制流程守則",
      c5_2: "防止人為疏忽操作",
      c5_3: "完整審核紀錄保留",
      c5_4: "自動生成合規報表",

      ai_text: "唔知邊款岩你？話比我哋聽，AI 專家即刻為你推薦最合適方案。"
    },

    sv: {
      pageTitle: "KACH & Partner Automation",
      tools: "VERKTYG",
      consultant: "KONSULT",
      pricing: "PRISER",
      getStarted: "Get Started",

      monthly: "Månadspris",
      consultNow: "Kontakta oss",

      c1_title: "Lead Intake & Routing",
      c1_desc: "Samla alla förfrågningar i en ingång och routa automatiskt.",
      c1_1: "En central ingång",
      c1_2: "Automatisk klassificering",
      c1_3: "Rätt team direkt",
      c1_4: "Inga förlorade leads",

      c2_title: "Intern Processautomation",
      c2_desc: "Automatisera administrativa flöden och minska manuellt arbete.",
      c2_1: "Automatisera repetitiva flöden",
      c2_2: "Minska mänskliga fel",
      c2_3: "Spara tid och kostnader",
      c2_4: "Standardisera samarbete",

      c3_title: "Kundsupport-automation",
      c3_desc: "Hantera vanliga frågor med stabila svar och eskalering vid behov.",
      c3_1: "24/7 hantering av FAQ",
      c3_2: "Minska behovet av manuella svar",
      c3_3: "Enhetlig svarston",
      c3_4: "Sömlös överlämning till människa",

      c4_title: "Rapportering & Övervakning",
      c4_desc: "Automatisera uppföljning av drift och få larm vid avvikelser.",
      c4_1: "Datainsamling och synk",
      c4_2: "Dashboard i realtid",
      c4_3: "Larm vid avvikelse",
      c4_4: "Trygg drift, snabb respons",

      c5_title: "Compliance / Guardrails",
      c5_desc: "Tvinga processer, logga allt och säkra spårbarhet.",
      c5_1: "Regelstyrda flöden",
      c5_2: "Förhindra felsteg",
      c5_3: "Fullständig loggning",
      c5_4: "Automatiska compliance-rapporter",

      ai_text: "Osäker på vilken lösning som passar? Prata med vår AI-expert så rekommenderar vi rätt upplägg."
    }
  };

  function setLang(lang) {
    const dict = i18n[lang] || i18n.zh;
    document.documentElement.lang = (lang === "sv") ? "sv" : "zh-Hant";

    document.querySelectorAll("[data-key]").forEach(el => {
      const k = el.getAttribute("data-key");
      if (dict[k] !== undefined) el.textContent = dict[k];
    });

    document.querySelectorAll('.lang button[data-action="lang"]').forEach(b => b.classList.remove("active"));
    const btn = document.querySelector(`.lang button[data-action="lang"][data-lang="${lang}"]`);
    if (btn) btn.classList.add("active");

    try { localStorage.setItem("leact_lang", lang); } catch (e) {}
  }

  function initLang() {
    let lang = "zh";
    try {
      const saved = localStorage.getItem("leact_lang");
      if (saved === "zh" || saved === "sv") lang = saved;
    } catch (e) {}
    setLang(lang);
  }

  // ===== bind UI events =====
  function bind() {
    // Language buttons
    document.querySelectorAll('[data-action="lang"]').forEach(btn => {
      btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang")));
    });

    // Open form buttons
    document.querySelectorAll('[data-action="openForm"]').forEach(btn => {
      btn.addEventListener("click", openForm);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLang();
    bind();
  });
})();
