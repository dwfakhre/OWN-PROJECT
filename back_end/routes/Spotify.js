import express, { Router } from "express";
import { create_token, authenticate_user, is_auth } from "../controllers/spotify_controllers.js";

const router = express.Router();

router.post("/create-token", create_token);
router.get("/authen", authenticate_user);
router.get("/is-auth", is_auth);


export default router;