require("dotenv").config();
const express=require("express");
const path=require("path");
const cors=require("cors");
const connectDB=require("./config/db")

const authRoutes=require("./routes/authRoutes");
const sessionRoutes=require("./routes/sessionRoutes");
const questionRoutes=require("./routes/questionRoutes");
const {generateConceptExplanation,generateInterviewQuestions}=require("./controllers/aiController");

const {protect}=require("./middleware/authMiddleware");


const app=express();

// Middleware to handle CORS
app.use(
    cors({
        origin:"*",
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"]
    })
);
connectDB();
// Middleware
app.use(express.json());

// Routes
app.use("/api/auth",authRoutes);
app.use("/api/sessions",sessionRoutes);
app.use("/api/question",questionRoutes);

app.use("/api/ai/generate-question",protect,generateInterviewQuestions);
app.use("/api/ai/generate-explanation",protect,generateConceptExplanation);


// serve uploads folder
app.use("/uploads",express.static(path.join(__dirname,"uploads"),{}))

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=> console.log(`Server running on port ${PORT}`))
