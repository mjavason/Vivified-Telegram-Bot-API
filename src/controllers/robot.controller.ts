const { containerBootstrap } = require('@nlpjs/core-loader');
const { Nlp } = require('@nlpjs/nlp');
const { LangEn } = require('@nlpjs/lang-en-min');
const fs = require('fs');

let nlp: any;

export async function initiateBot() {
  const container = await containerBootstrap();
  container.use(Nlp);
  container.use(LangEn);
  nlp = container.get('nlp');

  // Set the fallback response in the NLP settings
  nlp.settings.autoSave = true;
  nlp.settings.fallbackResponse = 'Could you please rephrase that?';

  nlp.addLanguage('en');

  // Load training data with intents and answers from an external JSON file
  const trainingData = JSON.parse(fs.readFileSync('public/training/vivified.json', 'utf8'));

  // Iterate through intents and add training examples and answers
  for (const intentData of trainingData.intents) {
    const { intent, utterances, answers } = intentData;
    for (let i = 0; i < utterances.length; i++) {
      nlp.addDocument('en', utterances[i], intent);
      nlp.addAnswer('en', intent, answers[i]);
    }
  }

  // Train the NLP model
  await nlp.train();
}

export async function converse(userInput: string) {
  // Process user input
  const response = await nlp.process('en', userInput);

  if (!response || response.intent === 'None') {
    // If no intent was detected use the fallback intent
    return await getFallbackResponse();
  }

  // Otherwise, use the response from the detected intent
  console.log(response.answer);
  if (!response) return false;
  return response.answer;
}

async function getFallbackResponse() {
  // Implement logic to select a response from the "Fallback" intent
  const fallbackResponses = [
    'Could you please rephrase that?',
    "I didn't quite understand. Can you try again?",
    "I'm sorry, I couldn't understand your request.",
  ];
  const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  return randomResponse;
}
