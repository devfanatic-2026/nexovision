import { json, error, typedRoute, f } from '@float.js/core';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'crypto';

export const POST = typedRoute({
    body: f.object({
        image: f.string(), // base64 string
        filename: f.string().optional(),
    })
}, async (req) => {
    try {
        const { image, filename } = req.validated.body;

        // Ensure uploads directory exists
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Decode base64
        const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        if (!matches || matches.length !== 3) {
            return error('Invalid image data', 400);
        }

        const type = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const extension = type.split('/')[1] || 'png';

        const finalFilename = filename
            ? `${path.basename(filename, path.extname(filename))}-${Date.now()}.${extension}`
            : `${randomUUID()}.${extension}`;

        const filePath = path.join(uploadsDir, finalFilename);

        fs.writeFileSync(filePath, buffer);

        return json({
            success: true,
            url: `/uploads/${finalFilename}`
        });

    } catch (err: any) {
        console.error('Upload error:', err);
        return error(err.message, 500);
    }
});
