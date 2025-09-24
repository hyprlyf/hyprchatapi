require("dotenv").config();
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json({limit: '50mb'}));

app.post('/chittiApi', async (req, res)=>{
	try{
		const modelMap = {
			'hyprlyf/hyprV.1':'x-ai/grok-4-fast:free',
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
			content:'Your name is HyprChat. Your are an AI assistant created by Hyprlyf Technologies.'
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
