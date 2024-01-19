import { generateReturnArrays } from './investimentsGoals.js';

const form = document.getElementById('investment-form'); 
// Poderia pegar o form e adicionar um evento de submit ou adicionar o "type"=submit no botão

const calculateButton = document.getElementById('calculate-results');

export function renderProgression(evento) {
  evento.preventDefault();
//   const startingAmount = Number(
    // document.getElementById('starting-amount').value
//   );
    const startingAmount = Number(form['starting-amount'].value) //Outra forma de acessar os elementos dentro de um form
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
// form.addEventListener('submit', renderProgression);
calculateButton.addEventListener('click', renderProgression);
