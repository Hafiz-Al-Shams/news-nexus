// src/app/api/bulletins/expand/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import BulletinCache from '@/models/BulletinCache';
import User from '@/models/User';
import { expandBulletsToDetails } from '@/utils/bulletinGenerator';

export async function POST(request) {
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

        const { bullets } = await request.json();

        if (!bullets || !Array.isArray(bullets) || bullets.length !== 12) {
            return NextResponse.json(
                { error: 'Invalid bullets - must be array of 12 strings' },
                { status: 400 }
            );
        }

        // Check if details already cached for these bullets
        const cachedBulletin = await BulletinCache.findOne({
            bullets: { $all: bullets },
            'detailedCards.0': { $exists: true }, // Has detailed cards
            expiresAt: { $gt: new Date() }
        });

        if (cachedBulletin && cachedBulletin.detailedCards.length > 0) {
            // Serve from cache
            return NextResponse.json({
                success: true,
                cards: cachedBulletin.detailedCards,
                fromCache: true
            });
        }

        // Check user's daily limit (10 expansions per day)
        const user = await User.findOne({ email: session.user.email });
        const today = new Date().toISOString().split('T')[0];

        if (!user.dailyLimits) {
            user.dailyLimits = {};
        }
        if (!user.dailyLimits[today]) {
            user.dailyLimits[today] = { bulletinExpansions: 0 };
        }

        if (user.dailyLimits[today].bulletinExpansions >= 10) {
            return NextResponse.json(
                {
                    error: 'Daily limit reached',
                    message: 'You can only expand bulletin details 10 times per day'
                },
                { status: 429 }
            );
        }

        // Generate detailed cards
        console.log('Generating detailed cards...');
        const cards = await expandBulletsToDetails(bullets);

        // Update cache with detailed cards
        await BulletinCache.updateOne(
            { bullets: { $all: bullets } },
            {
                $set: {
                    detailedCards: cards,
                    'generationMetadata.detailsGeneratedAt': new Date()
                }
            }
        );

        // Increment user's daily count
        user.dailyLimits[today].bulletinExpansions += 1;
        await user.save();

        return NextResponse.json({
            success: true,
            cards,
            fromCache: false,
            remainingExpansions: 10 - user.dailyLimits[today].bulletinExpansions
        });

    } catch (error) {
        console.error('Bulletin expansion error:', error);
        return NextResponse.json(
            {
                error: 'Failed to expand bulletin',
                message: error.message
            },
            { status: 500 }
        );
    }
}