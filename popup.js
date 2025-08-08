import { parseFileList } from './core/fileManager.js';
import { isUnderLimit, getLimitText } from './core/sizeManager.js';
import { compressFiles } from './core/controller.js';

let selectedFiles = [];
let processBtn = null;
let downloadBtn = null;

const dropArea = document.getElementById('drop-area');
const fileElem = document.getElementById('fileElem');
const fileSelect = document.getElementById('fileSelect');
const fileList = document.getElementById('file-list');
const totalSizeDiv = document.getElementById('total-size') || (() => {
  const div = document.createElement('div');
  div.id = 'total-size';
  document.body.insertBefore(div, fileList.nextSibling);
  return div;
})();

let warningDiv = null;
function showWarning(msg) {
  if (!warningDiv) {
    warningDiv = document.createElement('div');
    warningDiv.id = 'warning-msg';
    warningDiv.style.color = '#d70022';
    warningDiv.style.marginTop = '8px';
    document.body.insertBefore(warningDiv, fileList);
  }
  warningDiv.textContent = msg;
}

function showProcessButton() {
  if (!processBtn) {
    processBtn = document.createElement('button');
    processBtn.id = 'process-btn';
    processBtn.textContent = 'Start Process';
    processBtn.addEventListener('click', startProcess);
    document.body.appendChild(processBtn);
  }
  processBtn.style.display = 'block';
}
function hideProcessButton() {
  if (processBtn) processBtn.style.display = 'none';
}
function showDownloadButton() {
  if (!downloadBtn) {
    downloadBtn = document.createElement('button');
    downloadBtn.id = 'download-btn';
    downloadBtn.textContent = 'Download Compressed File(s)';
    downloadBtn.addEventListener('click', downloadFiles);
    document.body.appendChild(downloadBtn);
  }
  downloadBtn.style.display = 'block';
}
function hideDownloadButton() {
  if (downloadBtn) downloadBtn.style.display = 'none';
}

function updateTotalSizeDisplay() {
  const total = selectedFiles.reduce((sum, f) => sum + f.size, 0);
  totalSizeDiv.textContent = getLimitText(total);
  totalSizeDiv.style.color = isUnderLimit(total) ? '#333' : '#d70022';
  isUnderLimit(total) ? hideProcessButton() : showProcessButton();
}

function renderFileList() {
  fileList.innerHTML = '';
  selectedFiles.forEach((file, idx) => {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.innerHTML = `
      <span>${file.name} (${(file.size / 1024).toFixed(2)} KB)</span>
      <span class="file-actions">
        <button class="action-btn remove" data-idx="${idx}">Remove</button>
      </span>
    `;
    fileList.appendChild(item);
  });
  fileList.querySelectorAll('.action-btn.remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      selectedFiles.splice(idx, 1);
      renderFileList();
      updateTotalSizeDisplay();
      hideDownloadButton();
    });
  });
}

function handleFiles(fileList) {
  selectedFiles = parseFileList(fileList);
  renderFileList();
  updateTotalSizeDisplay();
  showWarning('');
}

async function startProcess() {
  processBtn.textContent = 'Processing...';
  processBtn.disabled = true;
  hideDownloadButton();
  showWarning('');

  const { files: processedFiles, totalSize, failed } = await compressFiles(selectedFiles);

  if (isUnderLimit(totalSize)) {
    selectedFiles = processedFiles;
    renderFileList();
    updateTotalSizeDisplay();
    showDownloadButton();
    showWarning('Compression successful!');
  } else {
    showWarning('Total compressed size is still over 3MB. Try removing files or compressing further.');
  }

  if (failed.length > 0) {
    showWarning('Could not compress: ' + failed.join(', '));
  }

  processBtn.textContent = 'Start Process';
  processBtn.disabled = false;
}

async function downloadFiles() {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  selectedFiles.forEach(file => zip.file(file.name, file));

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'compressed_files.zip';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

// Event binding
['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, e => {
    e.preventDefault();
    dropArea.classList.add('highlight');
  });
});
['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, e => {
    e.preventDefault();
    dropArea.classList.remove('highlight');
  });
});
dropArea.addEventListener('drop', e => handleFiles(e.dataTransfer.files));
fileSelect.addEventListener('click', () => fileElem.click());
fileElem.addEventListener('change', e => handleFiles(e.target.files));
