# Tariff Dashboard

A self-updating dashboard that tracks tariff-related headlines from the WTO RSS feed. The site is hosted on GitHub Pages and refreshes automatically after the daily update workflow runs.

View it live at `https://<USER>.github.io/<REPO>/`.

To add more feeds edit the `FEEDS` array in `fetchFeeds.mjs`.

## Run locally
```
npm install
npm start
```
This serves the static site. GitHub Pages updates automatically after the daily workflow commits new `data.json`.
