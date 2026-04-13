// Vibe Check - Content Script

(async function () {
  if (
    window.location.protocol === "chrome-extension:" ||
    window.location.protocol === "chrome:" ||
    window.location.protocol === "about:"
  ) return;

  let settings;
  try {
    settings = await chrome.runtime.sendMessage({ type: "getSettings" });
  } catch (e) { return; }

  if (!settings || !settings.enabled) return;

  // Extract visible text
  const bodyText = document.body?.innerText || "";
  if (!bodyText || bodyText.length < 50) return; // Skip near-empty pages

  // Tokenize
  const words = bodyText.toLowerCase().match(/\b[a-z']+\b/g) || [];
  if (words.length === 0) return;

  let posScore = 0;
  let negScore = 0;
  let posCount = 0;
  let negCount = 0;
  const topPositive = {};
  const topNegative = {};

  words.forEach((word) => {
    if (POSITIVE_WORDS[word]) {
      const weight = POSITIVE_WORDS[word];
      posScore += weight;
      posCount++;
      topPositive[word] = (topPositive[word] || 0) + weight;
    }
    if (NEGATIVE_WORDS[word]) {
      const weight = NEGATIVE_WORDS[word];
      negScore += weight;
      negCount++;
      topNegative[word] = (topNegative[word] || 0) + weight;
    }
  });

  // Calculate normalized score (-1 to 1)
  const totalSentiment = posScore + negScore;
  let score = 0;
  if (totalSentiment > 0) {
    score = (posScore - negScore) / totalSentiment;
  }

  // Get top words by total weight
  const sortedPos = Object.entries(topPositive).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const sortedNeg = Object.entries(topNegative).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Send to background
  try {
    chrome.runtime.sendMessage({
      type: "setVibe",
      data: {
        score,
        posScore,
        negScore,
        posCount,
        negCount,
        wordCount: words.length,
        topPositive: sortedPos.map(([w, s]) => ({ word: w, score: s })),
        topNegative: sortedNeg.map(([w, s]) => ({ word: w, score: s }))
      }
    });
  } catch (e) {}
})();
