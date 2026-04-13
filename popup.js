document.addEventListener("DOMContentLoaded", async () => {
  const enabledToggle = document.getElementById("enabledToggle");
  const content = document.getElementById("content");
  const toast = document.getElementById("toast");

  // Load settings
  const settings = await chrome.storage.local.get(["enabled"]);
  enabledToggle.checked = settings.enabled !== false;

  enabledToggle.addEventListener("change", () => {
    chrome.storage.local.set({ enabled: enabledToggle.checked });
  });

  // Get vibe for current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  const result = await chrome.runtime.sendMessage({ type: "getVibe", tabId: tab.id });

  if (!result || !result.vibe) {
    content.innerHTML = `
      <div class="no-data">
        <span class="big-emoji">🤷</span>
        No vibe data for this page.<br>
        Try reloading the page.
      </div>
    `;
    return;
  }

  const { score, posScore, negScore, posCount, negCount, wordCount, topPositive, topNegative, vibe } = result;

  // Score to gauge position (0-100%)
  const gaugePos = Math.round(((score + 1) / 2) * 100);

  // Render
  content.innerHTML = `
    <div class="vibe-section">
      <div class="vibe-emoji">${vibe.emoji}</div>
      <div class="vibe-label" style="color: ${getVibeColor(score)}">${vibe.label}</div>
      <div class="vibe-desc">${vibe.desc}</div>
    </div>

    <div class="gauge-section">
      <div class="gauge-bar">
        <div class="gauge-marker" style="left: ${gaugePos}%"></div>
      </div>
      <div class="gauge-labels">
        <span>Negative</span>
        <span>Neutral</span>
        <span>Positive</span>
      </div>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="stat-value pos">${posCount}</div>
        <div class="stat-label">Positive</div>
      </div>
      <div class="stat">
        <div class="stat-value neg">${negCount}</div>
        <div class="stat-label">Negative</div>
      </div>
      <div class="stat">
        <div class="stat-value total">${wordCount.toLocaleString()}</div>
        <div class="stat-label">Total Words</div>
      </div>
    </div>

    <div class="words-section">
      <div class="words-row">
        <div class="words-col">
          <div class="words-title pos">Top Positive</div>
          ${topPositive.length > 0
            ? topPositive.map((w) => `<div class="word-item"><span class="w">${w.word}</span><span class="s">×${w.score}</span></div>`).join("")
            : '<div class="word-item" style="color:#333">None found</div>'
          }
        </div>
        <div class="words-col">
          <div class="words-title neg">Top Negative</div>
          ${topNegative.length > 0
            ? topNegative.map((w) => `<div class="word-item"><span class="w">${w.word}</span><span class="s">×${w.score}</span></div>`).join("")
            : '<div class="word-item" style="color:#333">None found</div>'
          }
        </div>
      </div>
    </div>

    <div class="share-section">
      <button class="share-btn" id="shareBtn">${vibe.emoji} Share this page's vibe</button>
    </div>
  `;

  // Share
  document.getElementById("shareBtn").addEventListener("click", async () => {
    const text = `This page's vibe: ${vibe.emoji} ${vibe.label} — "${vibe.desc}"\nPositive: ${posCount} | Negative: ${negCount}\n\n— Vibe Check for Chrome`;
    await navigator.clipboard.writeText(text);
    showToast("Copied!");
  });

  function getVibeColor(s) {
    if (s >= 0.6) return "#22bb66";
    if (s >= 0.3) return "#a0d468";
    if (s >= 0.1) return "#c8d468";
    if (s >= -0.1) return "#888";
    if (s >= -0.3) return "#ff8c00";
    if (s >= -0.6) return "#ff6b4a";
    return "#ff4757";
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.className = "toast visible";
    setTimeout(() => toast.classList.remove("visible"), 1500);
  }
});
