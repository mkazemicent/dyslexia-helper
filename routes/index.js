const express = require('express');
const router = express.Router();
const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const textToSpeech = require('@google-cloud/text-to-speech');
const ttsClient = new textToSpeech.TextToSpeechClient();

// Function to read words from the CSV and return them as an array
function readWordsFromCSV() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path.resolve(__dirname, 'numbered_english.csv'))
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results.map(word => word[Object.keys(word)[1]])); // Adjust if your CSV structure is different
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Initialize a variable to hold your words array
let wordsArray = [];

// Function to load words from the CSV into the array
async function loadWords() {
  try {
    wordsArray = await readWordsFromCSV();
  } catch (error) {
    console.error('Error loading words from CSV:', error);
  }
}

// Load words when the server starts
loadWords();

// GET home page
router.get('/', (req, res) => {
  res.render('index', { title: 'Dyslexia Helper' });
});

// GET practice page
router.get('/practice', async (req, res) => {
  try {
    // Pick a random word from the array
    const randomIndex = Math.floor(Math.random() * wordsArray.length);
    const randomWord = wordsArray[randomIndex];

    // Fetch details for the random word from the API
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(randomWord)}`);
    const wordData = response.data[0];
    // Get the first definition of the word
    const definition = wordData.meanings[0].definitions[0].definition;


    // Render the practice view with the fetched word
    res.render('practice', { word: wordData.word, definition: definition });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Error fetching word details' });
  }
});
router.get('/practice/nextword', async (req, res) => {
    try {
      const randomIndex = Math.floor(Math.random() * wordsArray.length);
      const randomWord = wordsArray[randomIndex];
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(randomWord)}`);
      const wordData = response.data[0];
      const definition = wordData.meanings[0].definitions[0].definition;
  
      res.json({ word: randomWord, definition: definition });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching new word' });
    }
  });
router.post('/synthesize-speech', async (req, res) => {
    const text = req.body.text;

    const request = {
        input: { text: text },
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    try {
        const [response] = await ttsClient.synthesizeSpeech(request);
        const audioContent = response.audioContent;
        res.send(Buffer.from(audioContent, 'base64'));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error synthesizing speech');
    }
});

// Export the router
module.exports = router;
