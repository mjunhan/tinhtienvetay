import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

        if (!scriptUrl) {
            return NextResponse.json(
                { error: 'Server configuration error: GOOGLE_SCRIPT_URL not set' },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { products, bot_check, ...commonData } = body;

        // Honeypot Check: If bot_check is incorrectly filled, reject silently or with error
        if (bot_check) {
            console.warn('Bot detected via honeypot:', { bot_check, ip: request.headers.get('x-forwarded-for') });
            // Return success to fool the bot, or 400. Let's return 400 for now or just fake success.
            // Faking success is better to waste their time, but 400 is clearer for debugging if something goes wrong.
            return NextResponse.json({ success: false, error: 'Spam detected' }, { status: 400 });
        }

        const productList = Array.isArray(products) ? products : [];

        const WAREHOUSE_MAP: Record<string, string> = {
            'HN': 'Hà Nội',
            'HCM': 'Tp. Hồ Chí Minh'
        };

        const METHOD_MAP: Record<string, string> = {
            'TMDT': 'Thương mại điện tử (TMĐT)',
            'TieuNgach': 'Ngạch đi bộ (Tiêu ngạch)',
            'ChinhNgach': 'Chính ngạch (VAT)'
        };

        const localizedCommonData = {
            ...commonData,
            warehouse: WAREHOUSE_MAP[commonData.warehouse as string] || commonData.warehouse,
            method: METHOD_MAP[commonData.method as string] || commonData.method,
        };

        if (productList.length === 0) {
            // Fallback if no products (shouldn't happen with validation)
            const response = await fetch(scriptUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(localizedCommonData),
            });
            return NextResponse.json(await response.json());
        }

        // Send one request per product
        const results = await Promise.all(productList.map(async (product, index) => {
            const rowData = {
                ...localizedCommonData,
                products: [product], // Hack: Script expects array for joining links, so we wrap single product
                // Override totals if needed, or keeping total_landed_cost same for all rows?
                // Usually user wants split cost per product, OR simply 1 row per product with same Order Total
                // Per user request: "tách dòng" -> implied 1 row per product.
                // We keep the "Header" info (Customer, Total Order Cost) duplicated or maybe split costs?
                // For simplicity/safety: Copy Customer info, Duplicate Total Cost (or maybe mark as part of same order)
                // Let's pass the single product as if it were the only one for formatting in script
            };

            // But wait, the script does: `data.products.map(p => p.link).join(", ")`
            // So if we pass `products: [product]`, it will just list that one link. Perfect.

            return fetch(scriptUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rowData),
            }).then(res => res.json());
        }));

        return NextResponse.json({ success: true, count: results.length });

    } catch (error) {
        console.error('Error submitting lead:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
