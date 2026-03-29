import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MinioService } from '../../../storage/application/service/minio.service';
import { PrismaService } from '../../../../config/prisma.service';

@Injectable()
export class AiImagingService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(
        private readonly minioService: MinioService,
        private readonly prisma: PrismaService
    ) {
        const apiKey = process.env.GEMINI_API_KEY || '';
        this.genAI = new GoogleGenerativeAI(apiKey);
        // NANO BANANA 2: Trying the newer preview version as 2.5 might have hit a quota ceiling
        this.model = this.genAI.getGenerativeModel({ model: "gemini-3.1-flash-image-preview" }); 
    }

    public async generateCarImage(data: { type: string, brand: string, model: string, color: string }) {
        console.log(`[AiImagingService] Generating image for: ${data.brand} ${data.model}...`);

        const prompt = `Professional automotive studio photography of a ${data.type} ${data.brand} ${data.model} in ${data.color} color. 
        Pure white clean studio background, minimalist setting, sharp floor shadows, realistic reflections on the car body, 
        commercial advertising lighting, 8k resolution, photorealistic, sharp focus.`;

        let finalUrl = '';
        let isAiGenerated = false;

        try {
            const result = await (this.model as any).generateContent(prompt);
            const candidates = result.response.candidates;
            
            if (!candidates?.[0]?.content?.parts?.[0]?.inlineData) {
                throw new Error("No image data returned from AI");
            }

            const imgBuffer = Buffer.from(candidates[0].content.parts[0].inlineData.data, 'base64');
            const filename = `ai-gen/${data.brand.toLowerCase()}-${data.model.toLowerCase()}-${Date.now()}.png`;
            finalUrl = await this.minioService.uploadBuffer(imgBuffer, filename, 'image/png');
            isAiGenerated = true;

        } catch (error) {
            console.warn('[AiImagingService] AI Quota hit or error. Using Premium Fallback for demo.', error.message);
            const fallbacks = [
                'aston_martin_valiant_silver_studio.png',
                'audi_rs6_performance_gray_studio.png',
                'bentley_batur_blue_studio.png',
                'ferrari_purosangue_red_studio.png',
                'lambo_revuelto_white_studio.png',
                'porsche_911_gt3_blue_studio.png'
            ];
            const randomImg = fallbacks[Math.floor(Math.random() * fallbacks.length)];
            finalUrl = `${process.env.MINIO_PUBLIC_URL || 'http://localhost:10210/apexdrive-assets'}/${randomImg}`;
        }

        // --- DATABASE REGISTRATION ---
        // Generate a random plate (e.g., AD-123-XY)
        const plate = `AD-${Math.floor(100 + Math.random() * 899)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
        
        // Define a base price based on type
        const prices: Record<string, number> = {
            'HYPERCAR': 285000,
            'DEPORTIVO': 95000,
            'SUV': 55000,
            'CAMIONETA': 48000,
            'SEDAN LUXE': 75000,
            'OFF-ROAD': 62000
        };
        const basePrice = prices[data.type.toUpperCase()] || 45000;

        try {
            const newCar = await this.prisma.car.create({
                data: {
                    brand: data.brand,
                    model: data.model,
                    color: data.color,
                    type: data.type,
                    year: new Date().getFullYear(),
                    plate,
                    basePrice,
                    images: [finalUrl],
                    description: `AI Generated ${data.type} vehicle. High-fidelity rendering.`,
                    status: 'AVAILABLE'
                }
            });

            console.log(`[AiImagingService] Vehicle registered in DB: ${newCar.id}`);

            return {
                id: newCar.id,
                url: finalUrl,
                promptUsed: prompt,
                success: true,
                isAiGenerated,
                plate: newCar.plate,
                price: newCar.basePrice
            };
        } catch (dbError) {
            console.error('[AiImagingError] Database registration failed:', dbError.message);
            throw dbError;
        }
    }
}
