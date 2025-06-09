# Tariff Tracker

This project monitors trade-related news feeds and publishes a small dashboard.
It automatically fetches RSS updates and displays weekly activity on a line
chart.

## Setup

- [Node.js](https://nodejs.org/) 16+

```bash
npm install
```

To fetch the latest articles locally run:

```bash
node fetchFeeds.mjs
```

Open `index.html` directly or use any static server to view the dashboard.

## Automation

A GitHub Actions workflow runs every day at 01:00 UTC. It executes
`npm ci && node fetchFeeds.mjs` and commits the updated `data.json` back to the
`main` branch using `GITHUB_TOKEN`. This keeps the dashboard data up to date
without manual intervention.

## GitHub Pages

Enable GitHub Pages in the repository settings with branch **main** and folder
**/** (root). The dashboard will then be available at
`https://<username>.github.io/<repo>/`.
