import { compressDocs } from './docs.js';
import { compressExcel } from './excel.js';
import { compressPDF } from './pdf.js';
import { compressImage } from './img.js';
import { compressPPTX } from './pptx.js';

export function getCompressor(fileName) {
  if (/\.docx?$/.test(fileName)) return compressDocs;
  if (/\.xlsx?$/.test(fileName)) return compressExcel;
  if (/\.pptx?$/.test(fileName)) return compressPPTX;
  if (/\.pdf$/.test(fileName)) return compressPDF;
  if (/\.(jpe?g|png|svg)$/i.test(fileName)) return compressImage;
  return null;
}