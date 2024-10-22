import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs"

dotenv.config()
// AAM = Ayban's Answering Machine 

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/", express.static("public"));
app.use(express.json())

app.post("/inputs", async (req, res)=>{
    const { input } = req.body;
    AAM(input, res)
})

app.listen(PORT, ()=>{
    console.log("Listening at PORT", PORT);
})

const AAM = async (input, res) => {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
    history: [
        {
        role: "user",
        parts: [{ text: `Hello, I will provide a knowledge base text, and I want you to carefully read through it.
         Your task is to answer my questions by directly retrieving the exact information from the knowledge base. 
         Do not rephrase, modify, or shorten the answers—simply extract and provide them as they are. 
         If the question isn't related to the knowledge base content, kindly inform the user that the topic is outside your expertise. 
         If the question is relevant but the answer isn't found in the knowledge base, ask them to inform Ayban to add the missing information to the knowledge base. 
         Also, I you see a link provided in the answer, put it inside an <a> tag's href and add a relevant label to it. Thank you!` }],
        },
        {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
    ],
    });

    fs.readFile('db/knowledgeBase.text', 'utf8', async (error, knowledgeBase)=>{
        if(error){
            console.log("Error is", error);
            return;
        }
        let result = await chat.sendMessage(`Here's the knowledge base: ${knowledgeBase}`);
        result = await chat.sendMessage(input);
        res.status(200).json({message: result.response.text()})
        
    })
}

