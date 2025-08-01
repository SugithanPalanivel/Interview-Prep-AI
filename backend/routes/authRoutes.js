const express=require("express");
const {registerUser,getUserProfile,loginUser}=require("../controllers/authController");
const {protect}=require("../middleware/authMiddleware");
const upload=require("../middleware/uploadMiddleware");

const router=express.Router();

// Auth Routes
router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/profile",protect,getUserProfile);

router.post("/upload-image",upload.single("image"),(req,res)=>{
    if(!req.file){
        return res.status(400).json({message:"no file uploaded"});

    }
    const imageUrl=`${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
    }`;
    res.status(200).json({imageUrl});
})

module.exports=router;

