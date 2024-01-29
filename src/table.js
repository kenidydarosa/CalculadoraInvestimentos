const isNonEmptyArray = (arrayElement) => {
  return Array.isArray(arrayElement) && arrayElement.lenght > 0;
};

export const createTable = (columnsArray, dataArray, tableId) => {
  if (
    !isNonEmptyArray(columnsArray) &&
    !isNonEmptyArray(dataArray) &&
    !tableId
  ) {
    throw new Error(
      'Para a correta execução, precisamos de um array com as colunas, outro com as informações das linhas e também o id do elemento tabela selecionado'
    );
  }
  const tableElement = document.getElementById('results-table');

  if (!tableElement && tableElement.nodeName !== 'TABLE') {
    throw new Error('Id informado não corresponde a nenhum elemento table');
  }
  createTableHeader(tableElement, columnsArray);
  createTableBody(tableElement, dataArray, columnsArray);
};

function createTableHeader(tableReference, columnsArray) {
  //Cria um cabeçalho caso a tabela ainda não tenha
  function createTheadElement(tableReference) {
    const thead = document.createElement('thead');
    tableReference.appendChild(thead);
    return thead;
  }
  //Verifica se a tabela contém um cabeçalho, caso não tenha chama a função de criação
  const tableHeaderReference =
    tableReference.querySelector('thead') ?? createTheadElement(tableReference);

  const headerRow = document.createElement('tr');
  ['bg-gray-700','text-slate-200','sticky','top-0'].forEach(cssClass => headerRow.classList.add(cssClass))
  for (const tableColumnObject of columnsArray) {
    const headerElement = /*html*/ `<th class= 'text-center'> ${tableColumnObject.columnsLabel}</th>`;
    headerRow.innerHTML += headerElement;
  }
  tableHeaderReference.appendChild(headerRow);
}

function createTableBody(tableReference, tableItens, columnsArray) {
  function createTbodyElement(tableReference) {
    const tbody = document.createElement('tbody');
    tableReference.appendChild(tbody);
    return tbody;
  }
  const tableBodyReference =
    tableReference.querySelector('tbody') ?? createTbodyElement(tableReference);

  for (const [itemIndex, tableItem] of tableItens.entries()) {
    const tableRow = document.createElement('tr');
    if(itemIndex % 2 !== 0 ){
      tableRow.classList.add('bg-gray-200')
    }
    for (const tableColumn of columnsArray) {
      const formarFn = tableColumn.format ?? ((info) => info);
      tableRow.innerHTML += /*html*/ `<td class ="text-center">${
        formarFn(tableItem[tableColumn.accessor])
      }</td>`;
    }
    tableBodyReference.appendChild(tableRow);
  }
}
