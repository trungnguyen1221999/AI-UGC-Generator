import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_CLOUD_API_KEY,
});

export default ai;
