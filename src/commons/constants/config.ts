import 'dotenv/config';

export const ENV_VALUE = {
  APP_PORT: process.env.APP_PORT,
  DB_ADMIN_USERNAME: process.env.DB_ADMIN_USERNAME,
  DB_ADMIN_PASSWORD: process.env.DB_ADMIN_PASSWORD,
  DB_HOST_NAME: process.env.DB_HOST_NAME,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  WEBSITE_URL: process.env.WEBSITE_URL,
  MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_SECRET_EXPIRES: process.env.JWT_SECRET_EXPIRES,
  JWT_REFRESH_SECRET_EXPIRES: process.env.JWT_REFRESH_SECRET_EXPIRES,

  JWT_SECRET_EXPIRES_MOBILE: process.env.JWT_SECRET_EXPIRES_MOBILE, // 100 year

  S3_ID: process.env.S3_ID,
  S3_SECRET: process.env.S3_SECRET,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  API_KEY_MODEL_CAR: process.env.API_KEY_MODEL_CAR,
}

export const STATUS_COMMON = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
}

export const STATUS_PAYMENT = {
  IN_PROGRESS_CHECKOUT: 'in_progress_checkout',
  IN_PROGRESS_PAYMENT: 'in_progress_payment',
  COMPLETED: 'completed',
}

export const COUPON_TYPE = {
  EXPIRED_DATE: 1,
  NBR_USED: 2
}

export const INTENT_PAYMENT_STRIPE_STATUS = {
  requires_action: 'requires_action',
  succeeded: 'succeeded'
}

export const PAGE_SIZE = {
  COMMON: 10,
}

export const FolderPath = {
  uploadProductPath: "./uploads/image_products",
  uploadLogsPath: "./uploads/logs-dev",
  uploadBinsPath: "./uploads/data_bins",
  uploadPath: "./uploads",
  downloadBinsPath: '/uploads/data_bins',
  downloadProductPath: '/uploads/image_products',
  downloadLogsPath: '/uploads/logs-dev',
  product: "product",
  bin: "data_bins",
  logsDev: "logs-dev",
  file: "file",
};

export const UserRole = {
  USER: 'user',
  ADMIN: 'admin'
}

export const UPLOAD_TYPE = {
  ProductImage: 1
};

export const LICENSE_STATUS = {
  UNASSIGNED: 'UNASSIGNED',
  ASSIGNED: 'ASSIGNED',
}

export const FIRMWARE_LIST = [
  { ASCIIFirmware: '60U85', Location: '0x14D4C' },
  { ASCIIFirmware: '60U80', Location: '0x14D4C' },
  { ASCIIFirmware: '60U81', Location: '0x14D4C' },
  { ASCIIFirmware: '60U82', Location: '0x14D4C' },
  { ASCIIFirmware: '60U83', Location: '0x14D4C' },
  { ASCIIFirmware: '60U84', Location: '0x14D4C' },
  { ASCIIFirmware: '60A73', Location: '0xDCF8' },
  { ASCIIFirmware: '60J10', Location: '0xDCF8' },
  { ASCIIFirmware: '60K60', Location: '0xDCF8' },
  { ASCIIFirmware: '60K61', Location: '0xDCF8' },
  { ASCIIFirmware: '60K62', Location: '0xDCF8' },
  { ASCIIFirmware: '60P10', Location: '0xDCF8' },
  { ASCIIFirmware: '60L10', Location: '0xDCF8' },
]

export const READ_FILE_BIN = [
  { type: '60U85', file: '60U85 Back to Stock - No License - Encoded.bin' }
]
export const STATUS_VERIFIED = {
  ACTIVE: 1,
  INACTIVE: 0
}

export const COMMON_STATUS = {
  Active: 'active',
  Inactive: 'inactive'
}
