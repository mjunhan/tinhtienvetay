import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PRICING_FILE_PATH = path.join(process.cwd(), 'data', 'pricing.json');

export async function GET() {
    try {
        if (!fs.existsSync(PRICING_FILE_PATH)) {
            return NextResponse.json({ error: 'Pricing configuration not found' }, { status: 404 });
        }
        const fileContent = fs.readFileSync(PRICING_FILE_PATH, 'utf-8');
        const data = JSON.parse(fileContent);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error reading pricing config:', error);
        return NextResponse.json({ error: 'Failed to load pricing configuration' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation could go here

        fs.writeFileSync(PRICING_FILE_PATH, JSON.stringify(body, null, 2), 'utf-8');
        return NextResponse.json({ success: true, message: 'Settings saved successfully' });
    } catch (error) {
        console.error('Error saving pricing config:', error);
        return NextResponse.json({ error: 'Failed to save pricing configuration' }, { status: 500 });
    }
}
