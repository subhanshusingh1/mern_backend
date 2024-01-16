/// import modules
import express from "express";

const router = express.Router()

// import files
import {
    userRegister,
    userOtpGenerate,
    userLogin,
    getProfileById,
    getAllProfile,
    updatUser,
    deleteUser
} from '../controller/userController.js'
//auth middlewares
import protect from "../middleware/authMiddleware.js";

router.post('/', userRegister)

router.get('/otp-generate', userOtpGenerate)

router.post("/login", protect, userLogin)

router.get("/profile/:id", protect, getProfileById)

router.get("/allProfile",protect,  getAllProfile);

router.put("/profile/:id",protect,  updatUser)

router.delete("/profile/:id",protect, deleteUser)


export default router;