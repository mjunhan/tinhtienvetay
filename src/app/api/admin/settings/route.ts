import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SETTINGS_PATH = path.join(process.cwd(), 'data', 'settings.json');

export async function GET() {
    try {
        if (!fs.existsSync(SETTINGS_PATH)) {
            // Default settings if file doesn't exist
            return NextResponse.json({
                clean_zalo_link: "https://zalo.me/0912345678",
                registration_link: "https://kdhoangkim.com/user/register?sale=3955"
            });
        }
        const settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8'));
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const adminPassword = process.env.ADMIN_PASSWORD;
        const authHeader = request.headers.get('Authorization');

        if (authHeader !== `Bearer ${adminPassword}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Ensure directory exists
        const dir = path.dirname(SETTINGS_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(SETTINGS_PATH, JSON.stringify(body, null, 2));

        return NextResponse.json({ success: true, settings: body });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
