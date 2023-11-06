// Example JavaScript code to interact with the front end

document.addEventListener('DOMContentLoaded', () => {
    // Check for browser support
const synth = window.speechSynthesis;
document.getElementById('speak').addEventListener('click', function () {
    if (synth) {
        const utterance = new SpeechSynthesisUtterance(document.getElementById('word').textContent);
        synth.speak(utterance);
    } else {
        alert("Sorry, your browser does not support text-to-speech!");
    }
});
// document.getElementById('speak').addEventListener('click', function () {
//     const text = document.getElementById('word').textContent;
//     fetch('/synthesize-speech', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ text: text }),
//     })
//     .then(response => response.blob())
//     .then(blob => {
//         const audioURL = window.URL.createObjectURL(blob);
//         new Audio(audioURL).play();
//     })
//     .catch(error => console.error('Error:', error));
// });

document.getElementById('check').addEventListener('click', function () {
    const correctSpelling = document.getElementById('word').textContent;
    const userSpelling = document.getElementById('userInput').value;
    
    if (userSpelling.toLowerCase() === correctSpelling.toLowerCase()) {
        document.getElementById('result').textContent = 'Correct!';
    } else {
        document.getElementById('result').textContent = 'Try again!';
    }
});
document.getElementById('nextWord').addEventListener('click', function () {
    fetch('/practice/nextword')
      .then(response => response.json())
      .then(data => {
          document.getElementById('word').textContent = data.word;
          document.getElementById('definition').textContent = data.definition; // Update the definition
          document.getElementById('userInput').value = '';
          document.getElementById('result').textContent = '';
      })
      .catch(error => console.error('Error:', error));
  });
  


});