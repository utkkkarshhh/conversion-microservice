const FormatCheck = require("../utils/commonUtils/formatCheck");
const { Constants } = require("./../constants/constants");

class DocumentConverter {
  async convert(documentLink, currentFormat, targetFormat) {
    if (!documentLink) {
      throw new Error("Document link is required");
    }

    console.log(`Converting document from ${documentLink} to ${targetFormat}`);
    try {
      const convertedUrl = await this.processDocumentConversion(
        documentLink,
        currentFormat,
        targetFormat
      );
      return convertedUrl;
    } catch (error) {
      throw new Error(`Document conversion failed: ${error.message}`);
    }
  }

  async processDocumentConversion(documentLink, currentFormat, targetFormat) {
    const conversionPossible = FormatCheck.checkFormatCompatability(
      currentFormat,
      targetFormat
    );
    if (!conversionPossible) {
      return res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: `{currentFormat} cannot be converted to ${targetFormat}`,
      });
    }
    return `https://converted-storage.example.com/${Date.now()}_converted.${targetFormat}`;
  }
}

module.exports = DocumentConverter;
