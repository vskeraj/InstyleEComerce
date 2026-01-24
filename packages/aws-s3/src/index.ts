import AWS from 'aws-sdk';

class S3Client {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1'
    });
  }

  async uploadFile(bucketName: string, key: string, body: Buffer | string, contentType?: string) {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType
    };

    try {
      const result = await this.s3.upload(params).promise();
      return result.Location;
    } catch (error) {
      console.error('S3 upload error:', error);
      throw error;
    }
  }

  async getFile(bucketName: string, key: string) {
    const params = {
      Bucket: bucketName,
      Key: key
    };

    try {
      const result = await this.s3.getObject(params).promise();
      return result.Body;
    } catch (error) {
      console.error('S3 download error:', error);
      throw error;
    }
  }

  async deleteFile(bucketName: string, key: string) {
    const params = {
      Bucket: bucketName,
      Key: key
    };

    try {
      await this.s3.deleteObject(params).promise();
      return true;
    } catch (error) {
      console.error('S3 delete error:', error);
      throw error;
    }
  }

  generatePresignedUrl(bucketName: string, key: string, expiresIn: number = 3600) {
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: expiresIn
    };

    return this.s3.getSignedUrl('getObject', params);
  }
}

export const s3Client = new S3Client();
