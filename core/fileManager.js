export function parseFileList(fileList) {
  return [...fileList].sort((a, b) => b.size - a.size);
}

export function toFileListDisplay(files) {
  return files.map(f => `${f.name} (${(f.size / 1024).toFixed(1)} KB)`);
}