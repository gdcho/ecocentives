const fetch = require('node-fetch');

const endpoint = 'https://api.openai.com/v1/completions';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer API_KEY'
};

const prompt = "Generate a random task for me to do today.";
const data = JSON.stringify({
    prompt: prompt,
    temperature: 0.5,
    max_tokens: 50
});

fetch(endpoint, {
    method: 'POST',
    headers: headers,
    body: data
})
.then(response => response.json())
.then(data => {
    const task = data.choices[0].text.trim();
    const output = document.getElementById('output');
    output.innerHTML = `Your random task for today is: ${task}`;
})
.catch(error => console.error(error));
