// controllers/documentConversionController.js
const express = require("express");
const app = express();
const { models } = require("docuvault-database");
const Messages = require("../constants/messages");
const Constants = require("../constants/constants");
const { storage } = require("../utils/firebase/firebase");
const {
  DocumentConversionFactory,
} = require("../managers/documentConversionManager");

app.use(express.json());

const conversion = async (req, res) => {
  const { document_id, user_id, format, metadata, correlationId } = req.body;
  try {
    if (!document_id || !format || !user_id) {
      return res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: Messages.VALIDATION.DOCUMENT_ID_FORMAT_OBJECT,
        correlationId,
      });
    }

    const document = await models.documents.findOne({
      where: { document_id: document_id },
    });

    if (!document) {
      return res.status(Constants.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Document not found",
        correlationId,
      });
    }

    try {
      // Use the factory to get the right converter
      const converter = DocumentConversionFactory.getConverter(document);
      // const convertedURL = await converter.convert(downloadURL, format);

      return res.status(Constants.STATUS_CODES.OK).json({
        success: true,
        data: converter,
        correlationId,
      });
    } catch (conversionError) {
      console.error(`[${correlationId}] Conversion error:`, conversionError);
      return res.status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Error converting document",
      });
    }
  } catch (error) {
    console.error(`[${correlationId}] Unexpected server error:`, error);
    return res.status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Unexpected server error",
    });
  }
};

module.exports = conversion;
