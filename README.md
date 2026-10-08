# Daily Budget

A simple app that tells you how much you can spend today — and over the next 3 days.

## How it works

- Choose the day your monthly period starts (e.g. 25th to 25th, or 30th to 30th).
- Enter your recurring income (salary, etc.) and recurring expenses (rent, bills, subscriptions, savings, etc.).
- Track your expenses as you go.
- The amount remaining for the period is divided evenly across the remaining days:
    - Spend less today and your budget for tomorrow increases.
    - Overspend and the excess is spread out over the following days.

## Screens

- **Today** — amount available for the day, forecast for the next 3 days, today's expenses, period summary
- **History** — all transactions, organized by day and period
- **Budget** — recurring income and expenses
- **Settings** — period start day, reset (light/dark theme automatically follows your device)

## Data

Data is stored locally on your device (or in the browser on the web).

No account, no cross-device synchronization.

## Tech

Expo + Expo Router, TypeScript, NativeWind, React Native Reusables, Zustand + AsyncStorage.

See `CLAUDE.md` for the architecture and calculation rules.

Built with Draftbit, Expo, and React Native.
