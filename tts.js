const synth = window.speechSynthesis;

const inputForm = document.querySelector('form');
const inputTxt = document.getElementById('sayThis');
const savePhraseBtn = document.getElementById('savePhraseBtn');
const voiceSelect = document.getElementById('voiceSelect');
const history = document.getElementById('history');
const saved = document.getElementById('saved');

let voices;

function loadVoices() {
  voices = synth.getVoices();
  voiceSelect.innerHTML = '';
  for (let i = 0; i < voices.length; i++) {
    const option = document.createElement('option');
    option.textContent = `${voices[i].name} (${voices[i].lang})`;
    option.value = i;
    voiceSelect.appendChild(option);
  }
}

function sayThis(text) {
  synth.cancel();
  const utterThis = new SpeechSynthesisUtterance(text);
  utterThis.voice = voices[voiceSelect.value];
  synth.speak(utterThis);
}

// in Google Chrome the voices are not ready on page load
if ('onvoiceschanged' in synth) {
  loadVoices();
  synth.onvoiceschanged = loadVoices;
} else {
  loadVoices();
}

inputForm.onsubmit = (event) => {
  event.preventDefault();
  
  const inputText = inputTxt.value;

  sayThis(inputText);
  
  const p = document.createElement('p');
  p.innerText = inputText;
  p.addEventListener('click', () => { sayThis(inputText) });
  history.prepend(p);

  inputTxt.value = '';
  inputTxt.focus();
}

savePhraseBtn.addEventListener('click', (event) => {
  event.preventDefault();
  const inputText = inputTxt.value;

  const p = document.createElement('p');
  p.innerText = inputText;
  p.addEventListener('click', () => { sayThis(inputText) });
  saved.append(p);
});
