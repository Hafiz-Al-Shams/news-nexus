// src/app/api/bulletins/24hrs/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import BulletinCache from '@/models/BulletinCache';
import { generate24HrsBulletin } from '@/utils/bulletinGenerator';

export async function GET(request) {
    try {
        // Check authentication
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized - Please login' },
                { status: 401 }
            );
        }

        await connectDB();

        // Check for valid cached bulletin
        const cachedBulletin = await BulletinCache.findOne({
            timeframe: '24hrs',
            expiresAt: { $gt: new Date() }
        }).sort({ generatedAt: -1 });

        if (cachedBulletin) {
            // Serve from cache
            return NextResponse.json({
                success: true,
                bullets: cachedBulletin.bullets,
                cachedAt: cachedBulletin.generatedAt,
                fromCache: true
            });
        }

        // No valid cache - generate new bulletin
        // NOTE: In production, this should ONLY be called by cron job
        // For development, we allow manual generation
        console.log('No cached bulletin found - generating new one...');

        const bulletinData = await generate24HrsBulletin();

        // Save to cache (expires in 1 hour)
        const newBulletin = await BulletinCache.create({
            timeframe: '24hrs',
            bullets: bulletinData.bullets,
            sourceArticles: bulletinData.sourceArticles,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            generationMetadata: bulletinData.metadata
        });

        return NextResponse.json({
            success: true,
            bullets: newBulletin.bullets,
            cachedAt: newBulletin.generatedAt,
            fromCache: false
        });

    } catch (error) {
        console.error('Bulletin fetch error:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch bulletin',
                message: error.message
            },
            { status: 500 }
        );
    }
}

// For cron job to trigger generation
export async function POST(request) {
    try {
        // Verify cron secret (add to .env.local)
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        console.log('Cron job triggered - generating bulletin...');

        const bulletinData = await generate24HrsBulletin();

        // Save to cache
        const newBulletin = await BulletinCache.create({
            timeframe: '24hrs',
            bullets: bulletinData.bullets,
            sourceArticles: bulletinData.sourceArticles,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
            generationMetadata: bulletinData.metadata
        });

        return NextResponse.json({
            success: true,
            message: 'Bulletin generated successfully',
            bulletinId: newBulletin._id,
            generatedAt: newBulletin.generatedAt
        });

    } catch (error) {
        console.error('Cron bulletin generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate bulletin', message: error.message },
            { status: 500 }
        );
    }
}



