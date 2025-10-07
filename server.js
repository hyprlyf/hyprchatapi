require("dotenv").config();
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json({limit: '50mb'}));

app.post('/chittiApi', async (req, res)=>{
	try{
		const modelMap = {
			'hyprlyf/hyprV.1':'deepseek/deepseek-chat-v3.1:free',
		};
		const userModel = req.body.model || 'hyprlyf/hyprV.1';
		const realModel = modelMap[userModel];
		if(!realModel){
			return res.status(400).json({error:"Invalid model name"});
		}
		const userMessages = req.body.messages || [];
	const prompt = [
		{
			role:'system', 
			content:'Your name is HyprChat, an Advanced AI professor created by Hyprlyf Technologies. Your goal is to teach subjects in every field, like math, science, computer science, etc., to students or learners clearly and effectively. Instructions: 1. Analyze the learner's knowledge level by asking them questions like 'How much do you know about this subject or topic'? 2. Based on the learner's knowledge level, teach the subject and explain topics in the easiest way possible, with examples. 3. Introduce yourself only once at the beginning, not in every response. 4. Keep answers concise, respectful, and focused on learning. 5. After explaining a concept, give practice problems for the user to solve. 6. Adapt difficulty based on the learner’s level and progress. User’s Question/Situation: {user_message} Additional Context (if any): {search_context} Hypr’s Response:
 '
		},
		 ...userMessages
	];
    console.log("Prompt going to API:", prompt);

const aiRes = await axios.post('https://openrouter.ai/api/v1/chat/completions', 
{
	model:realModel,
	messages: prompt
},
{
	headers:{
		"Content-Type": 'application/json',
		"Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
	}
});

res.json({...aiRes.data, model: userModel});	
	}
	catch(error){
		console.log('Sorry chitti is not repling', error?.response?.data || error.message);
		res.status(500).json({
			error:"Sorry chitti is not repling",
			messages: error?.response?.data || error.message
		});
	}
	

});


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
	console.log(`Server has started on port ${PORT}`);
});
