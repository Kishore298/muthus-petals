import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  region: 'auto',
  forcePathStyle: true,
});

export const uploadToR2 = async (fileBuffer, fileName, mimeType) => {
  const bucketName = process.env.R2_BUCKET_NAME || 'petals';
  
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  await s3.send(command);

  const publicUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;
  return publicUrl;
};
