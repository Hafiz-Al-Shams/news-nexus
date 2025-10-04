import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import Review from "@/models/Review";

async function ensureDb() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    await ensureDb();

    const { rating, comment, articleUrl } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Valid rating (1-5) is required" },
        { status: 400 }
      );
    }

    const review = await Review.create({
      userEmail: session.user.email,
      rating,
      comment: comment?.trim() || "",
      articleUrl: articleUrl || "",
    });

    console.log(`⭐ Review submitted by ${session.user.email}: ${rating}/5`);

    return NextResponse.json({
      success: true,
      review: {
        id: review._id,
        rating: review.rating,
      },
    });

  } catch (error) {
    console.error("❌ Review submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}