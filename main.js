import { generateReturnArrays } from './investimentsGoals.js';

const form = document.getElementById('investment-form');
// Poderia pegar o form e adicionar um evento de submit ou adicionar o "type"=submit no botão

const calculateButton = document.getElementById('calculate-results');
const clearFormButton = document.getElementById('clear-form');

export function renderProgression(evento) {
  evento.preventDefault();
  //   const startingAmount = Number(
  // document.getElementById('starting-amount').value
  //   );

  if (document.querySelector('.error')) {
    return;
  }
  const startingAmount = Number(form['starting-amount'].value); //Outra forma de acessar os elementos dentro de um form
  const adicionalContribution = Number(
    document.getElementById('adition-contibution').value
  );
  const timeAmount = Number(document.getElementById('time-amount').value);
  const timeAmountPeriod = document.getElementById('time-amount-period').value;
  const returnRate = Number(document.getElementById('return-rate').value);
  const returnRatePeriod = document.getElementById('evaluation-period').value;
  const taxRate = Number(document.getElementById('tax-rate').value);

  const returnsArray = generateReturnArrays(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    adicionalContribution,
    returnRate,
    returnRatePeriod
  );
  console.log(returnsArray);
}

function clearForm() {
  for (const element of form) {
    if (element.tagName === 'INPUT' && element.hasAttribute('name')) {
      element.value = '';
    }
    const errorInputContainers = document.querySelectorAll('.error');
    for (const errorInputContainer of errorInputContainers) {
      errorInputContainer.classList.remove('error');
      errorInputContainer.parentElement.querySelector('p').remove();
    }
  }
}
function validateInput(event) {
  if (event.target.value == '') {
    return;
  }

  const { parentElement } = event.target;
  const grandParentElement = event.target.parentElement.parentElement;
  const inputValue = event.target.value.replace(',', '.');

  const errorTextElement = document.createElement('p');

  if (
    isNaN(inputValue) ||
    (Number(inputValue) <= 0 && !parentElement.classList.contains('error'))
  ) {
    errorTextElement.classList.add('text-red-500');
    errorTextElement.innerText = 'Insira um valor númerico maior que 0!';
    parentElement.classList.add('error');
    grandParentElement.appendChild(errorTextElement);
  } else if (
    parentElement.classList.contains('error') &&
    !isNaN(inputValue) &&
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove('error');
    grandParentElement.querySelector('p').remove();
  }
}
for (const formElement of form) {
  if (formElement.tagName === 'INPUT' && formElement.hasAttribute('name')) {
    formElement.addEventListener('blur', validateInput);
  }
}

calculateButton.addEventListener('click', renderProgression);
clearFormButton.addEventListener('click', clearForm);
