(function () {
  const root = document.documentElement;
  const toggle = document.querySelector("[data-language-toggle]");

  if (!toggle) {
    return;
  }

  const storageKey = "site-language";

  function readStoredLanguage() {
    try {
      return window.localStorage.getItem(storageKey) === "es" ? "es" : "en";
    } catch (error) {
      return "en";
    }
  }

  function storeLanguage(language) {
    try {
      window.localStorage.setItem(storageKey, language);
    } catch (error) {
      // The toggle still works when storage is unavailable.
    }
  }

  function applyLanguage(language, persist = true) {
    const isSpanish = language === "es";

    root.lang = language;
    root.dataset.language = language;
    toggle.setAttribute("aria-pressed", String(isSpanish));
    toggle.setAttribute("aria-label", isSpanish ? "Switch to English" : "Cambiar a español");

    document.querySelectorAll("[data-en][data-es]").forEach(element => {
      element.textContent = isSpanish ? element.dataset.es : element.dataset.en;
    });

    document.querySelectorAll("[data-aria-label-en][data-aria-label-es]").forEach(element => {
      element.setAttribute(
        "aria-label",
        isSpanish ? element.dataset.ariaLabelEs : element.dataset.ariaLabelEn
      );
    });

    if (root.dataset.titleEn && root.dataset.titleEs) {
      document.title = isSpanish ? root.dataset.titleEs : root.dataset.titleEn;
    }

    if (persist) {
      storeLanguage(language);
    }

    document.dispatchEvent(new CustomEvent("site-language-change", {
      detail: { language }
    }));
  }

  toggle.addEventListener("click", () => {
    applyLanguage(root.dataset.language === "es" ? "en" : "es");
  });

  applyLanguage(readStoredLanguage(), false);
})();
