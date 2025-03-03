const Constants = {
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },
  TABLES: {
    USERS: "users",
  },
  AUTH: {
    SALT_ROUNDS: 10,
  },
};

const SupportedTypeMapping = {
  document: ["pdf", "doc", "docx", "xls", "xlsx", "csv"],
  image: ["jpeg", "jpg", "png", "svg"],
};

const SupportedFormatMapping = {
  // Documents
  csv: ["xls", "xlsx"],
  xls: ["csv", "xlsx"],
  xlsx: ["csv", "xls"],
  doc: ["pdf", "docx"],
  docx: ["pdf", "doc"],
  // Images
  pdf: ["doc", "docx"],
  jpeg: ["jpg", "png", "svg"],
  jpg: ["jpeg", "png", "svg"],
  png: ["jpeg", "jpg", "svg"],
  svg: ["jpeg", "jpg", "png"],
};

module.exports = {
  Constants,
  SupportedTypeMapping,
  SupportedFormatMapping,
};
