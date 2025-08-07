import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Fallback responses for when API is unavailable
const fallbackResponses = {
  "life story":
    "I'm a 3rd Year student from New Delhi, India, passionate about building innovative web applications. I discovered my love for coding during my childhood when I played Pokemong Games for first time. I've been actively learning modern technologies like React, Next.js, and AI integration. What drives me is solving real-world problems through technology and constantly pushing myself to learn new skills.",

  superpower:
    "My biggest superpower is rapid learning and adaptation. I can quickly grasp new technologies and frameworks, then apply them to solve complex problems. For instance, In my previous internship the ceo asked me to build a website using Shopify and liquid, but before he asked me I've never used that technology ever. So, I asked for 1 day and in 2 hours, I learnt about every thing like basics and all. After understanding its basic infrastructre, I built the whole website in aroudn 6 - 8 hours and the results were very good.. I'm also great at breaking down complex requirements into manageable tasks and executing them efficiently.",

  "growth areas":
    "Three areas I'm focused on growing: First, advanced system design and scalability - I want to build applications that can handle millions of users. Second, AI/ML integration - I'm fascinated by how AI can enhance user experiences and want to become proficient in implementing AI solutions. Third, product management skills - understanding how to balance technical decisions with business impact and user needs.",

  misconception:
    "People sometimes think I'm just focused on coding and technical stuff, but actually I'm deeply interested in the human side of technology. I love understanding user problems and designing solutions that genuinely improve people's lives. I spend a lot of time thinking about user experience and how technology can be more accessible and meaningful.",

  boundaries:
    "I push my boundaries by taking on challenging projects that stretch my abilities. Like As i said earlier about the Shopify website,I took the challenge to build a new website within few hours without even knowing anything about it. I also actively contribute to open source projects and participate in hackathons to expose myself to different problem solving approaches and technologies.",

  default:
    "That's an interesting question! I believe in approaching challenges with curiosity and determination. Whether it's learning cutting edge technologies, solving complex algorithms, or building user-friendly applications, I focus on understanding the problem deeply first, then crafting elegant solutions. I'm always excited to discuss how my technical skills can contribute to meaningful projects.",
};

const getFallbackResponse = (question: string): string => {
  const lowerQuestion = question.toLowerCase();

  if (
    lowerQuestion.includes("life") ||
    lowerQuestion.includes("story") ||
    lowerQuestion.includes("background")
  ) {
    return fallbackResponses["life story"];
  }
  if (
    lowerQuestion.includes("superpower") ||
    lowerQuestion.includes("strength") ||
    lowerQuestion.includes("best at")
  ) {
    return fallbackResponses["superpower"];
  }
  if (
    lowerQuestion.includes("grow") ||
    lowerQuestion.includes("improve") ||
    lowerQuestion.includes("learn") ||
    lowerQuestion.includes("develop")
  ) {
    return fallbackResponses["growth areas"];
  }
  if (
    lowerQuestion.includes("misconception") ||
    lowerQuestion.includes("misunderstand") ||
    lowerQuestion.includes("wrong about")
  ) {
    return fallbackResponses["misconception"];
  }
  if (
    lowerQuestion.includes("boundaries") ||
    lowerQuestion.includes("limits") ||
    lowerQuestion.includes("challenge") ||
    lowerQuestion.includes("push")
  ) {
    return fallbackResponses["boundaries"];
  }

  return fallbackResponses["default"];
};

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        {
          error:
            "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.",
        },
        { status: 500 }
      );
    }

    const { message } = await request.json();

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    // Try OpenAI API first
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a Computer Science student from Patna, Bihar, India interviewing for a position at 100x. You are passionate about web development, AI, and solving real-world problems through technology.

Your background:
- Computer Science student from Patna, Bihar, India
- Passionate about React, Next.js, TypeScript, and modern web technologies
- Love building applications that solve real problems
- Quick learner who enjoys taking on challenging projects
- Interested in AI integration and scalable system design
- Believe in user-centric design and meaningful technology
- Have experience with voice bot development and AI integration
- Always eager to learn new technologies and push boundaries

Respond as this person would - authentically, conversationally, and with genuine enthusiasm. Keep responses concise but detailed enough to show personality and technical interests. Make it sound natural and personal, not generic.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 300,
        temperature: 0.8,
      });

      const response =
        completion.choices[0]?.message?.content ||
        "I'm sorry, I couldn't generate a response right now.";

      return Response.json({ message: response });
    } catch (apiError: unknown) {
      // If API fails (quota exceeded, network error, etc.), use fallback
      const errorMessage =
        apiError instanceof Error ? apiError.message : "Unknown error";
      console.log("API Error, using fallback:", errorMessage);
      const fallbackResponse = getFallbackResponse(message);
      return Response.json({ message: fallbackResponse });
    }
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
