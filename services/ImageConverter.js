class ImageConverter {
  async convert(documentLink, targetFormat) {
    if (!documentLink) {
      throw new Error("Document link is required");
    }

    console.log(`Converting image from ${documentLink} to ${targetFormat}`);
    try {
      const convertedUrl = await this.processImageConversion(
        documentLink,
        targetFormat
      );
      return convertedUrl;
    } catch (error) {
      throw new Error(`Image conversion failed: ${error.message}`);
    }
  }

  async processImageConversion(documentLink, targetFormat) {
    return `https://converted-storage.example.com/${Date.now()}_converted.${targetFormat}`;
  }
}

module.exports = ImageConverter;
