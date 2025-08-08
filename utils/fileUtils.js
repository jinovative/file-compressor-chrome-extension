export function formatSize(bytes) {
  const kb = 1024;
  const mb = kb * 1024;
  if (bytes > mb) return (bytes / mb).toFixed(2) + ' MB';
  if (bytes > kb) return (bytes / kb).toFixed(1) + ' KB';
  return bytes + ' B';
}

export function getTotalSize(files) {
  return files.reduce((acc, file) => acc + file.size, 0);
}