// Vibe Check - Background Service Worker

const VIBES = [
  { min: 0.6,  emoji: "🔥", label: "Fire", desc: "This page radiates joy" },
  { min: 0.3,  emoji: "😊", label: "Good Vibes", desc: "Positive energy here" },
  { min: 0.1,  emoji: "🙂", label: "Chill", desc: "Easy going" },
  { min: -0.1, emoji: "😐", label: "Meh", desc: "Neutral territory" },
  { min: -0.3, emoji: "😕", label: "Kinda Off", desc: "Something's not great" },
  { min: -0.6, emoji: "😬", label: "Rough", desc: "Heavy stuff on this page" },
  { min: -Infinity, emoji: "💀", label: "Yikes", desc: "Abandon hope" }
];

function getVibe(score) {
  return VIBES.find((v) => score >= v.min) || VIBES[VIBES.length - 1];
}

chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get(["enabled"]);
  await chrome.storage.local.set({
    enabled: data.enabled !== undefined ? data.enabled : true
  });
});

const tabData = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getSettings") {
    chrome.storage.local.get(["enabled"]).then(sendResponse);
    return true;
  }

  if (message.type === "setVibe") {
    const tabId = sender.tab?.id;
    if (tabId) {
      tabData[tabId] = message.data;

      const vibe = getVibe(message.data.score);
      chrome.action.setBadgeText({ text: vibe.emoji, tabId });
      chrome.action.setBadgeBackgroundColor({ color: "#00000000", tabId });
    }
    sendResponse({ ok: true });
    return true;
  }

  if (message.type === "getVibe") {
    const tabId = message.tabId;
    const data = tabData[tabId];
    if (data) {
      const vibe = getVibe(data.score);
      sendResponse({ ...data, vibe });
    } else {
      sendResponse(null);
    }
    return true;
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabData[tabId];
});
