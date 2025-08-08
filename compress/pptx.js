import JSZip from 'jszip';
import { compressImage } from './img.js';

export async function compressPPTX(file) {
  const zip = await JSZip.loadAsync(file);
  const mediaFolder = zip.folder('ppt/media');
  if (!mediaFolder) return null;

  const mediaFiles = [];
  mediaFolder.forEach((path, fileObj) => {
    mediaFiles.push({ path, file: fileObj });
  });

  for (const media of mediaFiles) {
    const blob = await media.file.async('blob');
    const compressed = await compressImage(blob);
    zip.file(media.path, compressed);
  }

  const newZip = await zip.generateAsync({ type: 'blob' });
  return new File([newZip], file.name, { type: file.type });
}
