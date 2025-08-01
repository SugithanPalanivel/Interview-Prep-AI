const Question=require("../models/Question");
const Session=require("../models/Session");

// @desc Add additional questions to an existing session
// @route POST /api/questions/add
// @access private
const addQuestionsToSession=async(req,res)=>{
    try {
        const {sessionId,questions}=req.body;

        if(!sessionId || !questions || !Array.isArray(questions)){
            return res.status(401).json({message:"Invalid input data"})
        }

        const session=await Session.findById(sessionId);

        if(!session){
            return res.status(401).json({message:"Session not found"});

        }

        // create new questions

        const createdQuestions=await Question.insertMany(
            questions.map((q)=>({
                session:sessionId,
                question:q.question,
                answer:q.answer,
            }))
        );

        // Update session to include new question IDs

        session.questions.push(...createdQuestions.map((q)=> q._id));

        await session.save();

        res.status(201).json(createdQuestions);
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
};

// @desc pin or unpin a question
// @route POST /api/questions/:id/pin
// @access private
const togglePinQuestion=async(req,res)=>{ 
    try {
        const question=await Question.findById(req.params.id);

        if(!question){
            return res.status(404).json({success:false,message:"Question not found"})
        }

        question.isPinned=!question.isPinned;

        await question.save();

        res.status(201).json({success:true,question});
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
};

// @desc Update note for a question
// @route POST /api/questions/:id/note
// @access private
const updateQuestionNote=async(req,res)=>{
    try {
        const {note} = req.body;

        const question=await Question.findById(req.params.id);

        if(!question){
            return res.status(404).json({success:false,message:"Question not found"});
        }

        question.note=note || "";
        await question.save();

        res.status(200).json({success:true,question});
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
};



module.exports={togglePinQuestion,updateQuestionNote,addQuestionsToSession}