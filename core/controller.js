import { getCompressor } from '../compress/index.js';
import { getTotalSize } from '../utils/fileUtils.js';

export async function compressFiles(files) {
  const processed = [];
  const failed = [];

  for (const file of files) {
    const compressor = getCompressor(file.name);
    if (!compressor) {
      failed.push(file.name);
      continue;
    }
    try {
      const result = await compressor(file);
      result ? processed.push(result) : failed.push(file.name);
    } catch (_) {
      failed.push(file.name);
    }
  }

  return {
    files: processed,
    totalSize: getTotalSize(processed),
    failed
  };
}