module.exports = {
  '**/*.ts?(x)': () => 'npm run ts-check',
  '*.{ts,tsx,js,jsx,json}': 'npm run lint',
}
