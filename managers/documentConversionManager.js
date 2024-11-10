// managers/documentConversionManager.js
const express = require("express");
const app = express();
const { models } = require("../../docuvault-database");
const Messages = require("../constants/messages");
const Constants = require("../constants/constants");
const ImageConverter = require("../services/ImageConverter");
const DocumentConverter = require("../services/documentConverter");
const { storage } = require("../utils/firebase/firebase");
const { ref, getDownloadURL } = require("firebase/storage");


app.use(express.json());

class DocumentConversionFactory {
  static async getConverter(document) {
    const fileRef = ref(storage, document.document_link);
    const downloadURL = await getDownloadURL(fileRef);
    const documentType = 'document';

    console.log(`TYPE:-> ${documentType}`);
    if (documentType === "image") {
      return new ImageConverter();
    } else if (documentType === "document") {
      return new DocumentConverter();
    } else {
      throw new Error("Unsupported document type");
    }
  }
}

module.exports = { DocumentConversionFactory };
