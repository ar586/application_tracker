import Groq from "groq-sdk";

const schema = `{
  "company": "string",
  "role": "string",
  "skills": ["string"],
  "seniority": "string",
  "location": "string",
  "salaryRange": "string",
  "resumeBullets": ["string"]
}`;

export const parseJobDescription = async (jobDescription: string) => {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        // Return mock data for testing if no key provided
        return {
            company: "Mock Company Inc",
            role: "Software Engineer",
            skills: ["React", "Node.js", "TypeScript"],
            seniority: "Mid-level",
            location: "Remote",
            salaryRange: "$100,000 - $130,000",
            resumeBullets: [
                "Developed and maintained highly scalable web applications using React and Node.js.",
                "Collaborated with cross-functional teams to design architecture driving 20% performance increase.",
                "Implemented strictly typed APIs with TypeScript to reduce runtime errors by 40%.",
            ],
        };
    }

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            {
                role: "system",
                content: `You are an expert job application assistant. Extract structured information from job descriptions and generate tailored resume bullet points. 
Always respond with valid JSON matching this exact schema:
${schema}
Generate 3 to 5 highly specific resume bullet points that align with the role's requirements, using strong action verbs and quantifiable impact where relevant.`,
            },
            {
                role: "user",
                content: `Extract the information and generate resume bullet points for this job description:\n\n${jobDescription}`,
            },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) {
        throw new Error("Empty response from Groq");
    }

    return JSON.parse(text);
};
