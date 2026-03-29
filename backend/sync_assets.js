const Minio = require('minio');
const fs = require('fs');
const path = require('path');

const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 10210,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
});

const bucket = 'apexdrive-assets';
const sourceDir = '/home/jsojo/Documentos/quanticarch/apexdrive-hackaton/frontend/public/images/';

async function sync() {
    console.log('🚀 Iniciando sincronización de assets a MinIO...');
    
    // Asegurar que el bucket existe
    try {
        const exists = await minioClient.bucketExists(bucket);
        if (!exists) {
            await minioClient.makeBucket(bucket, 'us-east-1');
            console.log(`✅ Bucket ${bucket} creado.`);
        }
    } catch (e) {
        await minioClient.makeBucket(bucket, 'us-east-1');
    }

    // Configurar política de acceso público
    const policy = {
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Principal: { AWS: ["*"] },
                Action: ["s3:GetBucketLocation", "s3:ListBucket"],
                Resource: [`arn:aws:s3:::${bucket}`]
            },
            {
                Effect: "Allow",
                Principal: { AWS: ["*"] },
                Action: ["s3:GetObject"],
                Resource: [`arn:aws:s3:::${bucket}/*`]
            }
        ]
    };
    await minioClient.setBucketPolicy(bucket, JSON.stringify(policy));

    // Subir cada imagen .png
    const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.png'));
    
    for (const file of files) {
        const filePath = path.join(sourceDir, file);
        const fileStream = fs.createReadStream(filePath);
        
        await minioClient.putObject(bucket, file, fileStream);
        console.log(`⬆️  Sincronizado: ${file}`);
    }

    console.log('🏁 Sincronización completada con éxito.');
}

sync().catch(console.error);
