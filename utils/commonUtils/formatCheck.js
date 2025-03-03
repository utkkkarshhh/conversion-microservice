const {
  SupportedTypeMapping,
  SupportedFormatMapping,
} = require("../../constants/constants");

class FormatCheck {
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
  static checkFormatCompatability(currentFormat, targetFormat) {
    if (!currentFormat || !targetFormat) {
      throw new Error("Both current and target format are required!");
    }
    const normalizedCurrentFormat = currentFormat.toLowerCase().trim();
    const normalizedTargetFormat = targetFormat.toLowerCase().trim();
    const compatibleFormats = SupportedFormatMapping[normalizedCurrentFormat];
    if (!compatibleFormats) {
      throw new Error("Unsupported Format");
    }
    if (compatibleFormats.includes(normalizedTargetFormat)) {
      return true;
    }
    return false;
  }
}

module.exports = FormatCheck;
