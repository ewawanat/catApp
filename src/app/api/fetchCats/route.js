import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const breedId = searchParams.get('breedId');

    const url = breedId
        ? `https://api.thecatapi.com/v1/images/search?limit=10&has_breeds=1&breed_ids=${breedId}`
        : 'https://api.thecatapi.com/v1/images/search?limit=10&has_breeds=1';

    try {
        const response = await fetch(url, {
            headers: {
                'x-api-key': process.env.NEXT_PUBLIC_CAT_API_KEY || '',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
    }
}
