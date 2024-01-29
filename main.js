import { generateReturnArrays } from './investimentsGoals.js';
import { Chart } from 'chart.js/auto';
import { createTable } from './src/table.js';

const form = document.getElementById('investment-form');
// Poderia pegar o form e adicionar um evento de submit ou adicionar o "type"=submit no botão

const finalMoneyChart = document.getElementById('final-money-distribution');
const progressionChart = document.getElementById('progression');
const calculateButton = document.getElementById('calculate-results');
const clearFormButton = document.getElementById('clear-form');
let doughtChartReference = {};
let progressionChartReference = {};

const columnsArray = [
  { columnsLabel: 'Mês', accessor: 'month' },
  {
    columnsLabel: 'Total Investido',
    accessor: 'investedAmount',
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnsLabel: 'Rendimento Mensal',
    accessor: 'interestReturns',
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnsLabel: 'Rendimento Total',
    accessor: 'totalInterestReturns',
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnsLabel: 'Quantia Total',
    accessor: 'totalAmount',
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
];

function formatCurrencyToTable(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function formatCurrencyToGraph(value) {
  return value.toFixed(2);
}

export function renderProgression(evento) {
  evento.preventDefault(); //cancelar o comportamento padrão de elementos em eventos específicos
  //Tira o comportamento padrão do formulário ao perder o preenchimento.
  if (document.querySelector('.error')) {
    return;
  }
  resetCharts();
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

  const finalInvestimentObject = returnsArray[returnsArray.length - 1];
  doughtChartReference = new Chart(finalMoneyChart, {
    type: 'doughnut',
    data: {
      labels: ['Total investido', 'Rendimento', 'Imposto'],
      datasets: [
        {
          // label: 'My First Dataset',
          data: [
            formatCurrencyToGraph(finalInvestimentObject.investedAmount),
            formatCurrencyToGraph(
              finalInvestimentObject.totalInterestReturns * (1 - taxRate / 100)
            ),
            formatCurrencyToGraph(
              (finalInvestimentObject.totalInterestReturns * taxRate) / 100
            ),
          ],
          backgroundColor: [
            'rgb(255,99,132)',
            'rgb(54,162,235)',
            'rgb(255,205,86)',
          ],
          hoverOffset: 4,
        },
      ],
    },
    options:{
      plugins:{
        legend:{
          position:'center',
          align:'start'
        }
      }
    }
  });
  progressionChartReference = new Chart(progressionChart, {
    type: 'bar',
    data: {
      labels: returnsArray.map((investmentObject) => investmentObject.month),
      datasets: [
        {
          label: 'Total investido',
          data: returnsArray.map((investmentObject) =>
            formatCurrencyToGraph(investmentObject.investedAmount)
          ),
          backgroundColor: 'rgb(255,99,132)',
        },
        {
          label: 'Retorno do investimento',
          data: returnsArray.map((investmentObject) =>
            formatCurrencyToGraph(investmentObject.totalInterestReturns)
          ),
          backgroundColor: 'rgb(54,162,235)',
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
      plugins:{
        legend:{
          position:'bottom',
          align:'center'
        }
      }
    },
  });
  createTable(columnsArray, returnsArray, 'results-table');
}
function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}
function resetCharts() {
  if (
    !isObjectEmpty(progressionChartReference) &&
    !isObjectEmpty(doughtChartReference)
  ) {
    progressionChartReference.destroy();
    doughtChartReference.destroy();
  }
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
  resetCharts();
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
const mainEl = document.querySelector('main');
const carouselEl = document.getElementById('carousel');
const nextButton = document.getElementById('slide-arrow-next');
const previousButton = document.getElementById('slide-arrow-previous');

nextButton.addEventListener('click', () => {
  carouselEl.scrollLeft += mainEl.clientWidth;
});
previousButton.addEventListener('click', () => {
  carouselEl.scrollLeft -= mainEl.clientWidth;
});
calculateButton.addEventListener('click', renderProgression);
clearFormButton.addEventListener('click', clearForm);
