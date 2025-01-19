const express = require("express");
const app = express();
const {
  sequelize,
  models: { documents: Document },
} = require("docuvault-database");
const Messages = require("../constants/messages");
const Constants = require("../constants/constants");
const { storage, ref, getDownloadURL } = require("../utils/firebase/firebase");
const {
  DocumentConversionFactory,
} = require("../managers/documentConversionManager");

app.use(express.json());

const conversion = async (req, res) => {
  const { document_id, user_id, format, convert_format, correlationId } =
    req.body;

  try {
    // Input validation
    if (!document_id || !format || !user_id || !convert_format) {
      return res.status(Constants.Constants.STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: Messages.VALIDATION.DOCUMENT_ID_FORMAT_OBJECT,
        correlationId,
      });
    }

    // Create document object
    const document = {
      document_id,
      user_id,
      format,
      convert_format,
      correlationId,
    };

    try {
      const documentObject = await Document.findOne({
        where: { id: document_id },
      });
      const fileName =
        "c715c4c6-2d28-4f67-bd78-b0ac2ae4361c-Ericsson Cover.pdf";

      const fileRef = ref(storage, fileName);
      const downloadURL = await getDownloadURL(fileRef);

      console.log(`Download URL: ${downloadURL}`);

      // Get appropriate converter
      const converter = await DocumentConversionFactory.getConverter(document);

      // Perform conversion
      const convertedURL = await converter.convert(
        downloadURL,
        convert_format.convert_to
      );

      console.log(`Converted URL: ${convertedURL}`); // Log for debugging

      // Add explicit check for convertedURL
      if (!convertedURL) {
        throw new Error("Conversion completed but URL was not generated");
      }

      return res.status(Constants.Constants.STATUS_CODES.OK).json({
        success: true,
        data: {
          convertedUrl: convertedURL,
        },
        correlationId,
      });
      
    } catch (conversionError) {
      console.error(`[${correlationId}] Conversion error:`, conversionError);
      return res
        .status(Constants.Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: conversionError.message || "Error converting document",
          correlationId,
        });
    }
  } catch (error) {
    console.error(`[${correlationId}] Unexpected server error:`, error);
    return res
      .status(Constants.Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: "Unexpected server error",
        correlationId,
      });
  }
};

module.exports = conversion;
