## Compressor Chrome Extension

This extension compresses files (Excel, Docs, PDF, Images) before attaching them to emails or uploading, helping users stay under file size limits (e.g., Outlook).

### How It Works

1. User selects files via the extension popup.
2. The extension compresses files using built-in logic for each format.
3. Compressed files are made available for download or direct attachment.

### Features

- Compress Excel (.xlsx, .xls) files
- Compress Word (.doc, .docx) files
- Compress PDF files
- Compress image files (JPG, PNG, SVG)
- Show original and compressed file sizes
- Download compressed files
- Basic rules for file size limits (configurable)

### Project Structure

```
Compressor/
├── manifest.json
├── popup.html
├── popup.js
├── background.js
├── content.js
├── compress/
│   ├── excel.js
│   ├── docs.js
│   ├── pdf.js
│   └── img.js
├── assets/
│   ├── icon.png
│   ├── icon.png
│   └── icon.png
├── styles/
│   └── popup.css
├── utils/
│   └── fileUtils.js
└── README.md
```

### Logic Flow

1. **User Action**: User opens the extension popup and drags & drops a file (Excel, Docs, PDF, or image).
2. **File Detection**: The popup.js script detects the file type and passes it to the appropriate compression module (e.g., compress/excel.js for Excel files).
3. **Compression**: The selected module compresses the file locally using JavaScript libraries, without sending data to any server.
4. **Result Handling**: The extension calculates the original and compressed file sizes, then displays them in the popup UI.
5. **Download**: The user is provided with a button to download the compressed file directly to their device.
6. **Storage (Optional)**: Compressed files or settings may be cached locally using Chrome's storage API for quick access.

### Example Scenario

**User attaches an Excel file:**

1. User opens the extension and drags an Excel file into the popup window.
2. The extension identifies the file as an Excel document and calls `compress/excel.js`.
3. The file is compressed locally in the browser (e.g., by removing unnecessary metadata, optimizing content, or using zip compression).
4. The popup displays both the original and reduced file sizes.
5. A "Download Compressed File" button appears; the user clicks it to save the smaller file.
6. No data leaves the user's device; all processing is local.

**Output to User:**
- Compressed file ready for download
- Size reduction information
- Error messages if compression fails or file type is unsupported

