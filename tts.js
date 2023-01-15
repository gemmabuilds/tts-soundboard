const synth = window.speechSynthesis;

const inputForm = document.querySelector('form');
const inputTxt = document.getElementById('sayThis');
const savePhraseBtn = document.getElementById('savePhraseBtn');
const voiceSelect = document.getElementById('voiceSelect');
const history = document.getElementById('history');
const saved = document.getElementById('saved');

let voices;

function createPhraseButton(phrase) {
  const container = document.createElement('div');
  const textEl = document.createElement('div');
  const delBtn  = document.createElement('button');

  container.classList.add('phrase-btn');

  textEl.classList.add('clickable');
  textEl.innerText = phrase;
  textEl.addEventListener('click', () => { sayThis(phrase) });
  container.append(textEl);

  delBtn.innerText = 'Delete';
  delBtn.addEventListener('click', () => { container.remove(); });
  container.append(delBtn);

  return container;
}

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

  history.prepend(createPhraseButton(inputText));

  inputTxt.value = '';
  inputTxt.focus();
}

savePhraseBtn.addEventListener('click', (event) => {
  event.preventDefault();
  const inputText = inputTxt.value;

  saved.append(createPhraseButton(inputText));

  inputTxt.value = '';
  inputTxt.focus();
});
