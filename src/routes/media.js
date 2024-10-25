const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const path = require('path');
const { logger } = require('../lib/logger');
const upload = require('../lib/upload');

// メディアファイルのアップロード
router.post('/upload', async (req, res) => {
  try {
    const form = formidable({
      maxFileSize: upload.maxSize,
      uploadDir: upload.directory,
      keepExtensions: true,
      filter: ({ mimetype }) => upload.allowedTypes.includes(mimetype)
    });

    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${path.basename(file.newFilename)}`;
    
    res.json({
      url: fileUrl,
      name: file.originalFilename,
      type: file.mimetype,
      size: file.size
    });
  } catch (error) {
    logger.error('Failed to upload file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// メディアファイルの削除
router.delete('/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(upload.directory, filename);

  try {
    require('fs').unlinkSync(filePath);
    res.status(204).send();
  } catch (error) {
    logger.error('Failed to delete file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;