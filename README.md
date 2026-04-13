# Vibe Check ✨

A Chrome extension that analyzes the sentiment of any webpage and shows a mood emoji in the toolbar. Fire or yikes — find out instantly.

## How It Works

1. Visit any page
2. The extension scans visible text and scores it against 400+ positive and negative words
3. A mood emoji appears on the toolbar badge
4. Click for a full breakdown: sentiment gauge, word counts, and top positive/negative words

## Vibe Tiers

- 🔥 **Fire** — This page radiates joy
- 😊 **Good Vibes** — Positive energy here
- 🙂 **Chill** — Easy going
- 😐 **Meh** — Neutral territory
- 😕 **Kinda Off** — Something's not great
- 😬 **Rough** — Heavy stuff on this page
- 💀 **Yikes** — Abandon hope

## Features

- Instant sentiment analysis on every page
- Mood emoji badge updates per tab
- Visual sentiment gauge from negative to positive
- Positive and negative word counts
- Top 5 positive and negative words found
- Share button to copy the vibe score
- 400+ weighted sentiment words (no API calls, fully local)

## Install

Available on the [Chrome Web Store](#) *(link coming soon)*

**Manual install:**
1. Download or clone this repo
2. Go to `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked" and select this folder

## Permissions

- **Host permissions (all URLs)** — Read page text for analysis
- **storage** — Save your enabled preference locally

No data is collected, stored, or transmitted. See the [privacy policy](https://galaxi5098.github.io/vibe-check/privacy.html).

## License

MIT
