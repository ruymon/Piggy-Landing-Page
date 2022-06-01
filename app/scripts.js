const modal = {
  open() {
    document
      .querySelector('.modal-overlay')
      .classList.add('active');
  },
  close() {
    document
      .querySelector('.modal-overlay')
      .classList.remove('active');
  }
};

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("piggy:transaction")) || [];
  },

  set(transactions) {
    localStorage.setItem("piggy:transaction", JSON.stringify(transactions));
  },
};

const AudioFile = {
  audio: new Audio('assets/cash-register.mp3'),

  play() {
    AudioFile.audio.play();
  },
};

const Transaction = {
  all: Storage.get(),

  add(transaction) {
    AudioFile.play();
    Transaction.all.push(transaction);
    App.reload();
  },

  remove(index) {
    Transaction.all.splice(index, 1);
    Utility.successAlert('Entry removed successfully. | Transação excluída com sucesso!');
    App.reload();
  },

  incomes() {
    let income = 0;
    Transaction.all.forEach(transaction => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      };
    });
    return income;
  },

  expenses() {
    let expense = 0;
    Transaction.all.forEach(transaction => {
      if (transaction.amount < 0) {
        expense += transaction.amount;
      };
    });
    return expense;
  },

  total() {
    return Transaction.incomes() + Transaction.expenses();
  },
};

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense";

    const amount = Utility.formatCurrency(transaction.amount);

    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td>
      <td>${transaction.date}</td>
      <td>
          <a>
              <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
          </a>
      </td>
      `;

    return html;
  },

  updateBalance() {
    document
      .getElementById('incomeDisplay')
      .innerHTML = Utility.formatCurrency(Transaction.incomes());

    document
      .getElementById('expenseDisplay')
      .innerHTML = Utility.formatCurrency(Transaction.expenses());

    document
      .getElementById('totalDisplay')
      .innerHTML = Utility.formatCurrency(Transaction.total());
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = "";
  },
};

const Utility = {
  formatAmount(value) {
    value = Number(value);
    return value;
  },

  formatDate(date) {
    const splittedDate = date.split("-");
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },

  formatCurrency(value) {
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return value;
  },

  successAlert(message) {
    Swal.fire({
      icon: 'success',
      title: '<span style="font-weight:400;">Sucesso!</span>',
      text: message,
      footer: '<span style="opacity: 0.6;font-weight: 400;">Piggy - Seu Porquinho Digital</span>',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  },

  errorAlert(message) {
    Swal.fire({
      icon: 'error',
      title: '<span style="font-weight:400;">Oops!</span>',
      text: message,
      footer: '<span style="opacity: 0.6;font-weight: 400;">Piggy - Seu Porquinho Digital</span>',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  },
};

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },

  validateField() {
    const { description, amount, date } = Form.getValues();

    if (description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === "") {
      throw new Error("Por favor, preencha todos os campos.");
    };
  },

  formatValues() {
    let { description, amount, date } = Form.getValues();
    amount = Utility.formatAmount(amount);
    date = Utility.formatDate(date);

    return {
      description,
      amount,
      date
    };
  },

  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  submit(event) {
    event.preventDefault();

    try {
      Form.validateField();
      const transaction = Form.formatValues();
      Transaction.add(transaction);
      Form.clearFields();
      modal.close();
      Utility.successAlert('Transação criada com êxito!');
    } catch (error) {
      Utility.errorAlert(error.message);
    };
  },
};

const App = {
  init() {
    Transaction.all.forEach(DOM.addTransaction);
    DOM.updateBalance();
    Storage.set(Transaction.all);
  },

  reload() {
    DOM.clearTransactions();
    App.init();
  },
};

App.init();