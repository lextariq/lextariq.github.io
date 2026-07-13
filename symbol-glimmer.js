(function () {
  const initialDelayRange = [0, 0];
  const glimmerDelayRange = [2500, 4500];
  const backgroundSymbols = [
    "⊹", "✱", "⟡", "✦", "☼", "❋", "₊", "✷", "∷", "✵",
    "✹", "⁂", "⁕", "✲", "⁙", "⋆", "+", "✶", "*", "✧",
    "⁑", "✮", "×", "✺", ".•*", "⭒", "⁘", "፨", "☆"
  ];

  function randomDelay([minimum, maximum]) {
    return minimum + Math.random() * (maximum - minimum);
  }

  function shuffle(items) {
    const shuffled = [...items];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  function randomizePageSymbols() {
    const symbols = [...document.querySelectorAll("[data-randomize-symbols] .symbol-text")];

    if (symbols.length === 0) {
      return;
    }

    const storageKey = `symbol-layout:${window.location.pathname}`;
    let previousLayout = [];

    try {
      previousLayout = JSON.parse(window.sessionStorage.getItem(storageKey)) || [];
    } catch (error) {
      previousLayout = [];
    }

    const nextLayout = [];

    symbols.forEach((symbol, index) => {
      const candidates = backgroundSymbols.filter(candidate =>
        candidate !== previousLayout[index] &&
        candidate !== nextLayout[index - 1] &&
        candidate !== nextLayout[index - 2]
      );
      const selectedSymbol = candidates[Math.floor(Math.random() * candidates.length)];
      symbol.textContent = selectedSymbol;
      nextLayout.push(selectedSymbol);
    });

    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(nextLayout));
    } catch (error) {
      // Randomization still works when session storage is unavailable.
    }
  }

  function startSymbolGlimmers() {
    randomizePageSymbols();

    const allSymbols = [...document.querySelectorAll(".symbol-text")];
    const useEverySymbol = Boolean(document.querySelector("[data-glimmer-all]"));
    const eligibleSymbols = allSymbols.filter(
      (symbol, index) => useEverySymbol || index % 2 === 1
    );

    if (eligibleSymbols.length === 0) {
      return;
    }

    function scheduleNext(delayRange) {
      window.setTimeout(() => {
        if (document.hidden) {
          scheduleNext(glimmerDelayRange);
          return;
        }

        const availableSymbols = eligibleSymbols.filter(
          symbol => !symbol.classList.contains("is-glimmering")
        );
        const batchSize = Math.min(
          24,
          Math.max(6, Math.ceil(eligibleSymbols.length * 0.2)),
          availableSymbols.length
        );
        const batch = shuffle(availableSymbols).slice(0, batchSize);

        batch.forEach((symbol, index) => {
          symbol.style.setProperty("--glimmer-delay", `${index * 0.08}s`);
          symbol.classList.add("is-glimmering");
          symbol.addEventListener("animationend", () => {
            symbol.classList.remove("is-glimmering");
            symbol.style.removeProperty("--glimmer-delay");
          }, { once: true });
        });

        scheduleNext(glimmerDelayRange);
      }, randomDelay(delayRange));
    }

    scheduleNext(initialDelayRange);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startSymbolGlimmers, { once: true });
  } else {
    startSymbolGlimmers();
  }
})();
