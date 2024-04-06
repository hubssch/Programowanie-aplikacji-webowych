import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <input id="proverb"></input>
      <button id="save">Save</button>
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

const proverb = document.querySelector<HTMLInputElement>('#proverb');
const saveButton = document.querySelector("#save");

saveButton.addEventListener('click', () => {
  const proverbsString = localStorage.getItem("proverbs");
  if(proverbsString)
    {
      const parsedProverbsArr = JSON.parse(proverbsString);
      const proverbSentence = proverb?.value;
      parsedProverbsArr.push(proverbSentence);
      localStorage.setItem("proverbs", JSON.stringify(parsedProverbsArr));
    }
    else
    {
      const parsedProverbsArr = [];
      const proverbSentence = proverb?.value;
      parsedProverbsArr.push(proverbSentence);
      localStorage.setItem("proverbs", JSON.stringify(parsedProverbsArr));
    }
    
})
// proverb?.addEventListener('input', function() {
//   console.log("Coś tam:: ", proverb!.value.toString())
//     localStorage.setItem("1", proverb!.value.toString() );
// })