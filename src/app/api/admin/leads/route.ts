import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        // Simple Auth Check
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== `Bearer ${adminPassword}`) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (!scriptUrl) {
            return NextResponse.json(
                { error: 'Server configuration error: GOOGLE_SCRIPT_URL not set' },
                { status: 500 }
            );
        }

        // Fetch data from Google Script (requires doGet to be deployed)
        const response = await fetch(scriptUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store' // Ensure fresh data
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch from Google Sheets' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error fetching leads:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
