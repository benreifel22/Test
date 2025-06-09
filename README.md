# Tariff Tracker

A minimal dashboard that tracks news items from trade RSS feeds.

## Prerequisites
- [Node.js](https://nodejs.org/) 18+

## Setup
```bash
npm install
```

To update the feed data manually run:
```bash
npm run fetch
```
This populates `data.json`.

Start a local server with:
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Continuous Updates
The repository contains a workflow that runs daily at 01:00 UTC. It installs
dependencies and executes `node fetchFeeds.mjs` to refresh `data.json`. Any
changes are committed back to `main` automatically using the `GITHUB_TOKEN`.

## GitHub Pages
Enable GitHub Pages from the repository settings and choose the `main` branch with root `/`.
The dashboard will then be available on your GitHub Pages site.

## Testing
```bash
npm test
```
