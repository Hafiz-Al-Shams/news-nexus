import { NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/gemini";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    console.log("Generating AI response for:", message);

    // Generate AI response
    const aiResponse = await generateChatResponse(message, history || []);

    console.log("AI Response:", aiResponse);

    return NextResponse.json({
      success: true,
      response: aiResponse,
    });
  } catch (error) {
    console.error("AI Chat Error:", error);
    console.error("Error details:", error.message);
    
    return NextResponse.json(
      { 
        error: "Failed to generate response", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}