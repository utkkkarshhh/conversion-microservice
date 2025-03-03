const FormatCheck = require("./../utils/commonUtils/formatCheck");
const ImageConverter = require("../services/ImageConverter");
const DocumentConverter = require("../services/DocumentConverter");
const Messages = require("../constants/messages");

class DocumentConversionFactory {
  static async getConverter(document) {
    if (!document || !document.format) {
      throw new Error(Messages.VALIDATION.DOCUMENT_ID_FORMAT_OBJECT);
    }

    console.log(
      `Processing conversion request - Document: ${document.document_id}, User: ${document.user_id}, Format: ${document.format}, Convert to: ${document.convert_format}`
    );

    const documentType = FormatCheck.getDocumentType(document.format);

    if (!documentType) {
      throw new Error(Messages.VALIDATION.UNSUPPORTED_FORMAT);
    }

    console.log(`Document type identified: ${documentType}`);

    switch (documentType) {
      case "image":
        return new ImageConverter();
      case "document":
        return new DocumentConverter();
      default:
        throw new Error(Messages.VALIDATION.UNSUPPORTED_FORMAT);
    }
  }
}

module.exports = { DocumentConversionFactory };
