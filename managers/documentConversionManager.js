const { SupportedTypeMapping } = require("../constants/constants");
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

    const documentType = this.getDocumentType(document.format);

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

  static getDocumentType(format) {
    if (!format) return null;

    const normalizedFormat = format.toLowerCase().trim();

    for (const [type, formats] of Object.entries(SupportedTypeMapping)) {
      if (formats.includes(normalizedFormat)) {
        return type;
      }
    }
    return null;
  }
}

module.exports = { DocumentConversionFactory };
