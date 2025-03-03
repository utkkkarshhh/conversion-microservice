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
    if (!document_id || !format || !user_id || !convert_format) {
      return res.status(Constants.Constants.STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: Messages.VALIDATION.DOCUMENT_ID_FORMAT_OBJECT,
        correlationId,
      });
    }

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
      // const fileName =
      //   "629c8c87-6563-473b-b5ee-3b243ba2fa95-Ericsson Cover.pdf";
      const fileName = documentObject.name;
      console.log(`--------------${fileName}`)

      const fileRef = ref(storage, fileName);
      const downloadURL = await getDownloadURL(fileRef);

      console.log(`Download URL: ${downloadURL}`);

      const converter = await DocumentConversionFactory.getConverter(document);

      const convertedURL = await converter.convert(
        downloadURL,
        format,
        convert_format.convert_to
      );

      console.log(`Converted URL: ${convertedURL}`);

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
