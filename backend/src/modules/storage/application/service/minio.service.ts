import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
    private client: Minio.Client;
    private readonly bucketName = 'apexdrive-assets';

    constructor() {
        this.client = new Minio.Client({
            endPoint: process.env.MINIO_ENDPOINT || 'localhost',
            port: parseInt(process.env.MINIO_PORT || '10210'),
            useSSL: false,
            accessKey: process.env.MINIO_ROOT_USER || 'minioadmin',
            secretKey: process.env.MINIO_ROOT_PASSWORD || 'minioadmin',
        });
    }

    async onModuleInit() {
        // Ensure bucket exists
        const exists = await this.client.bucketExists(this.bucketName);
        if (!exists) {
            await this.client.makeBucket(this.bucketName, 'us-east-1');
            // Make bucket public for easy access to images (Dev profile)
            const policy = {
                Version: "2012-10-17",
                Statement: [{
                    Action: ["s3:GetBucketLocation", "s3:ListBucket"],
                    Effect: "Allow",
                    Principal: { AWS: ["*"] },
                    Resource: [`arn:aws:s3:::${this.bucketName}`]
                }, {
                    Action: ["s3:GetObject"],
                    Effect: "Allow",
                    Principal: { AWS: ["*"] },
                    Resource: [`arn:aws:s3:::${this.bucketName}/*`]
                }]
            };
            await this.client.setBucketPolicy(this.bucketName, JSON.stringify(policy));
        }
    }

    async uploadBuffer(buffer: Buffer, filename: string, contentType: string): Promise<string> {
        await this.client.putObject(this.bucketName, filename, buffer, buffer.length, {
            'Content-Type': contentType,
        });
        
        // Construct the public URL
        const endpoint = process.env.MINIO_PUBLIC_URL || `http://localhost:10210/${this.bucketName}`;
        return `${endpoint}/${filename}`;
    }
}
