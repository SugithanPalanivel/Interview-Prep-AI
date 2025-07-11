const {GoogleGenAI}=require("@google/genai");

const {conceptExplainPrompt, questionAnswerPrompt}=require("../utils/prompts");

const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

// @desc Generate interview questions and answers using Gemini
// @route POST /api/ai/generate-questions
// @access private

// const generateInterviewQuestions=async(req,res)=>{
//     try {
//         const {role,experience,topicsToFocus,numberOfQuestions}=req.body;
//         if(!role || !experience || !topicsToFocus || !numberOfQuestions){
//             return res.status(400).json({message:"Missing required fields"});
//         }

//         const prompt=questionAnswerPrompt(role,experience,topicsToFocus,numberOfQuestions);;

//         const response=await ai.models.generateContent({
//             model:"gemini-2.0-flash-lite",
//             contents:prompt,
//         });
//         let rawText=response.text;
//         // Clean it:Remove '''json and ''' from beginning and end
//         const cleanedText=rawText
//         .replace(/^'''json\s*/,"")  //remove staring '''json
//         .replace(/'''$/,"") //remove ending '''
//         .trim();

//         // now safe to parse

//         const data=JSON.parse(cleanedText);

//         res.status(200).json(data);
//     } catch (error) {
//         res.status(500).json({massage:"failed to generate questions",error:error.message});
//         res.status(500).json({ error: "AI generation failed" });
//     }
// };
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    const rawText = response.text;

    // const cleanedText = rawText
    //   .replace(/^'''json\s*/, "")  // remove starting '''json
    //   .replace(/'''$/, "")        // remove ending '''
    //   .trim();

//     const cleanedText = rawText
//   .replace(/^'''json\s*/i, "")      // Remove '''json with optional spaces (case-insensitive)
//   .replace(/'''[\s\n]*$/, "")       // Remove ending ''' and trailing whitespace or newlines
//   .trim();
const cleanedText = rawText
  .replace(/^```json\s*/i, "")  // remove starting ```json
  .replace(/^'''json\s*/i, "")  // also handle '''json
  .replace(/```$/, "")          // remove ending ```
  .replace(/'''$/, "")          // remove ending '''
  .trim();



    const data = JSON.parse(cleanedText);

    return res.status(200).json(data); // ✅ use return here too
  } catch (error) {
    console.error("AI generation error:", error);
    return res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};


// @desc Generate explanation to a interview questions 
// @route POST /api/ai/generate-explanation
// @access private

const generateConceptExplanation=async(req,res)=>{
    try {
        const {question} =req.body;

        if(!question){
            return res.status(400).json({message:"Missing required fields"});
        }

        const prompt=conceptExplainPrompt(question);
        const response=await ai.models.generateContent({
            model:"gemini-2.0-flash-lite",
            contents:prompt,
        });
        let rawText=response.text;
        // Clean it:Remove '''json and ''' from beginning and end
        // const cleanedText=rawText
        // .replace(/^'''json\s*/,"")  //remove staring '''json
        // .replace(/'''$/,"") //remove ending '''
        // .trim();


        const cleanedText = rawText
  .replace(/^```json\s*/i, "")  // remove starting ```json
  .replace(/^'''json\s*/i, "")  // also handle '''json
  .replace(/```$/, "")          // remove ending ```
  .replace(/'''$/, "")          // remove ending '''
  .trim();

        // now safe to parse

        const data=JSON.parse(cleanedText);

        res.status(200).json(data);


    } catch (error) {
        res.status(500).json({massage:"failed to generate questions",error:error.message})

    }
}

module.exports={generateConceptExplanation,generateInterviewQuestions} 