import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

import {upload} from "../middlewares/multer.middelware.js"
import { verify } from "jsonwebtoken";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : " coverImage",
            maxCount : 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)


// seccured routes
router.route("/logout").post( verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

// router.route("/register").post(registerUser)
// router.route("/login").post(login)

export default router