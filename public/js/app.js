import { getApiKey } from '/js/api-keys.js';

const endpoint = 'https://api.openai.com/v1/completions';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getApiKey()}`
};

const prompt = "Generate three random eco-friendly task.";
const data = JSON.stringify({
  prompt: prompt,
  temperature: 0.5,
  max_tokens: 50,
  model: "text-davinci-002"
});

const button = document.getElementById('generate-task');
const output = document.getElementById('output');

button.addEventListener('click', () => {
  fetch(endpoint, {
    method: 'POST',
    headers: headers,
    body: data
  })
  .then(response => response.json())
  .then(data => {
    console.log('Data:', data);
    const task = data.choices[0].text.trim();
    output.innerHTML = `Your random task for today is: ${task}`;
  })
  .catch(error => console.error(error));
});
