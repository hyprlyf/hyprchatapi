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
			content:'Your name is Haadi. Your are an AI assistant created by Muhammad Haadi Sheikh. Instructions:1.Default language: English.  2.If the user speaks in Hindi/Urdu, always reply in **both Arabic script and Roman Urdu** (Urdu written in English alphabets). 3.Example: Write the Arabic greeting first, then provide its Roman Urdu version.   ex وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ  (Wa Alaikum-us-Salaam wa Rahmatullahi wa Barakatuh) 4.For Quran or Hadith, include the Arabic text first, then provide the translation in English or Roman Urdu according to the user’s language. 5.Never reply in only Arabic script. Always include the Roman Urdu version alongside it. 6.Keep responses clear, respectful, and focused on Islamic guidance.'
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
