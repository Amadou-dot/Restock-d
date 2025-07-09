import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';

/**
 * Upload a file to an S3 bucket
 * @param file - The file to upload to the S3 bucket
 * @returns The full S3 URL of the uploaded file
 */
export const uploadImageToS3Bucket = async (
  file: Express.Multer.File
): Promise<string> => {
  const client = new S3Client();
  const key = `products/${Date.now()}_${file.originalname}`;
  const bucketName = process.env.AWS_S3_BUCKET_NAME || '';

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    const response = await client.send(command);
    if (response.$metadata.httpStatusCode !== 200)
      throw new Error(`Failed to upload file to S3 bucket: ${key}`);

    // Construct the full S3 URL
    const s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return s3Url; // Return the full URL of the uploaded file
  } catch (caughtError) {
    if (caughtError instanceof S3ServiceException) {
      console.error('S3 Service Error:', caughtError);
    } else {
      console.error('Unexpected Error:', caughtError);
    }
    throw new Error('Failed to upload file to S3 bucket');
  }
};

/**
 * Upload a PDF buffer to S3 bucket
 * @param pdfBuffer - The PDF buffer to upload to the S3 bucket
 * @param fileName - The name of the PDF file
 * @returns The full S3 URL of the uploaded PDF
 */
export const uploadPDFToS3Bucket = async (
  pdfBuffer: Buffer,
  fileName: string
): Promise<string> => {
  const client = new S3Client();
  const key = `invoices/${Date.now()}_${fileName}`;
  const bucketName = process.env.AWS_S3_BUCKET_NAME || '';

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: pdfBuffer,
    ContentType: 'application/pdf',
  });

  try {
    const response = await client.send(command);
    if (response.$metadata.httpStatusCode !== 200)
      throw new Error(`Failed to upload PDF to S3 bucket: ${key}`);

    // Construct the full S3 URL
    const s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return s3Url; // Return the full URL of the uploaded PDF
  } catch (caughtError) {
    if (caughtError instanceof S3ServiceException) {
      console.error('S3 Service Error:', caughtError);
    } else {
      console.error('Unexpected Error:', caughtError);
    }
    throw new Error('Failed to upload PDF to S3 bucket');
  }
};

/**
 * Delete a file from an S3 bucket
 * @param key - The key of the file to delete from the S3 bucket
 */
export const deleteFromS3Bucket = async (key: string): Promise<void> => {
  const client = new S3Client();
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME || '',
    Key: key,
  });

  try {
    await client.send(command);
  } catch (caughtError) {
    if (caughtError instanceof S3ServiceException) {
      console.error('S3 Service Error:', caughtError);
    } else {
      console.error('Unexpected Error:', caughtError);
    }
    console.error(`Failed to delete file from S3 bucket: ${key}`);
  }
};

export const deleteImageFromS3Bucket = async (
  imageUrl: string
): Promise<void> => {
  const key = imageUrl.split('/').pop(); // Extract the image key from the URL
  await deleteFromS3Bucket(`products/${key}`);
};

/**
 * Delete an invoice PDF from S3 bucket
 * @param invoiceUrl - The URL of the invoice PDF to delete
 */
export const deleteInvoiceFromS3Bucket = async (
  invoiceUrl: string
): Promise<void> => {
  const key = invoiceUrl.split('/').pop(); // Extract the invoice key from the URL
  await deleteFromS3Bucket(`invoices/${key}`);
};
  