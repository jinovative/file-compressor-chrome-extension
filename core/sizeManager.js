const LIMIT = 3 * 1024 * 1024;

export function isUnderLimit(bytes) {
  return bytes <= LIMIT;
}

export function getLimitText(bytes) {
  const ratio = (bytes / LIMIT) * 100;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB / 3.00 MB (${ratio.toFixed(1)}%)`;
}
