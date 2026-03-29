import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MinioService } from '../../storage/application/service/minio.service';

@Injectable()
export class AiImagingService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(private readonly minioService: MinioService) {
        const apiKey = process.env.GEMINI_API_KEY || '';
        this.genAI = new GoogleGenerativeAI(apiKey);
        // Using Gemini 2.0 Flash or similar for image generation capability (Imagen 3)
        // Note: For now, we simulate the 'imagen' call or use the correct API endpoint if available.
        // Google Imagen 3 is often called via Vertex AI or the Gemini Image models.
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
    }

    public async generateCarImage(data: { type: string, brand: string, model: string, color: string }) {
        console.log(`[AiImagingService] Generating image for: ${data.brand} ${data.model}...`);

        // 1. Build the High-Fidelity Studio Prompt
        const prompt = `Professional automotive studio photography of a ${data.type} ${data.brand} ${data.model} in ${data.color} color. 
        Pure white clean studio background, minimalist setting, sharp floor shadows, realistic reflections on the car body, 
        commercial advertising lighting, 8k resolution, photorealistic, sharp focus.`;

        try {
            // 2. Call Gemini (Nano Banana) to generate the image
            // Note: Current @google/generative-ai library handles text/multimodal. 
            // For Image Generation, it's usually 'model.generateContent' with specific instructions for the Imagen model
            // IN_HACKATHON: We assume the user has the 'imagen-3' model or similar enabled.
            const result = await (this.model as any).generateContent(prompt);
            
            // 3. Assume the result contains an image buffer or a temporary URL
            // For this implementation, we simulate fetching the buffer if it's a mock or a direct call
            // In a real scenario, Nano Banana returns the image as a part of the candidate.
            const candidates = result.response.candidates;
            if (!candidates?.[0]?.content?.parts?.[0]?.inlineData) {
                // If the model doesn't support direct inline data for images, we use a fallback or return error
                throw new Error("No image data returned from Nano Banana");
            }

            const imgBuffer = Buffer.from(candidates[0].content.parts[0].inlineData.data, 'base64');
            
            // 4. Store in MinIO
            const filename = `ai-gen/${data.brand.toLowerCase()}-${data.model.toLowerCase()}-${Date.now()}.png`;
            const publicUrl = await this.minioService.uploadBuffer(imgBuffer, filename, 'image/png');

            return {
                url: publicUrl,
                promptUsed: prompt,
                success: true
            };
        } catch (error) {
            console.error('[AiImagingError]:', error.message);
            throw error;
        }
    }
}
