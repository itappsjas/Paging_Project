import { NextResponse } from "next/server";

// Language code mapping for MyMemory API
const languageCodeMap: { [key: string]: string } = {
  English: "en",
  Mandarin: "zh-CN",
  Arabic: "ar",
  Japanese: "ja",
  Korean: "ko",
  French: "fr",
  German: "de",
  Spanish: "es",
  Thai: "th",
  Vietnamese: "vi",
};

export async function POST(request: Request) {
  try {
    const { text, targetLanguage } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: "Text and target language are required" },
        { status: 400 }
      );
    }

    // Get language code
    const targetLangCode = languageCodeMap[targetLanguage] || targetLanguage;

    // Use MyMemory Translation API (FREE, no API key needed)
    const encodedText = encodeURIComponent(text);
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=id|${targetLangCode}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Translation API returned ${response.status}`);
    }

    const data = await response.json();

    // Check if translation was successful
    if (data.responseStatus !== 200) {
      throw new Error(data.responseDetails || "Translation failed");
    }

    return NextResponse.json({
      translatedText: data.responseData.translatedText,
      from: "id",
      to: targetLangCode,
    });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      {
        error: "Translation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
