//Variables
let budgetInput = document.getElementById('budgetInput');
let expenseName = document.getElementById('expenseName');
let expenseInput = document.getElementById('expenseInput');
let totalBudget = document.getElementById('totalBudget');
let totalExpense = document.getElementById('totalExpense');
let balance = document.getElementById('balance');
let balancePar = document.getElementById('balancePar');
let expenseNameOut = document.getElementById('expenseNameOut');
let expenseQtyOut = document.getElementById('expenseQtyOut');
let expenseButtons = document.getElementById('edit');
let budgetWarning = document.getElementById('budgetWarning');
let expenseWarning = document.getElementById('expenseWarning');
const calculateBtn = document.getElementById('calculateBtn');
const expenseBtn = document.getElementById('expenseBtn');

let expenseObject = localStorage.hasOwnProperty('expenses') ? JSON.parse(localStorage['expenses']) : {};
let keys = localStorage.hasOwnProperty('expenses') ? Math.max(...Object.keys(JSON.parse(localStorage['expenses']))) + 1 : 0;
let id = keys === 0 ? 0 : keys;
let budgetParams = {
    'budget': 0,
    'expenses': 0,
    'balance': 0
}

//Classes
class Expense {
    constructor(name,amount) {
        if(UI.checkInput(name, expenseWarning) || 
        UI.checkInput(amount, expenseWarning)) {
            throw new Error('Expense fields cannot be empty');
        }
        else {
            this.name = name;
            this.amount = amount;
        }
    }
}

class UI {
    //Show all parameters on load from local storage
    static showHTML() {
        localStorage.getItem('budget') !== null ? budgetParams = JSON.parse(localStorage.getItem('budget')) : budgetParams;
        totalBudget.textContent = budgetParams['budget'];
        totalExpense.textContent = budgetParams['expenses'];
        balance.textContent = budgetParams['balance'];
        
        Object.values(JSON.parse(localStorage['expenses'])).forEach(object => {
            this.showExpense(object);
        })
    }

    //Add exepnse input to budget object and show on total expense on page
    addExpense(expenseObj, expenseOut) {
        budgetParams['expenses'] += parseInt(expenseObj.amount); 
        expenseOut.textContent = budgetParams['expenses'];
    }

    //Output expense name and amount on page
    static showExpense(expenseObj) {
        let html1= `
        <div class="${expenseObj.id} expenseRow">
            <p>${expenseObj.name}</p>
        </div>
        `;
        let html2= `
        <div class="${expenseObj.id} expenseRow">
            <p>$<span class="${expenseObj.id}a">${expenseObj.amount}</span></p>
        </div>
        `;
        let html3 = `
            <div class="${expenseObj.id} expenseRow">
                <button class="${expenseObj.id} btn editBtn" onclick="UI.editExpense(this)"><i class="fas fa-edit"></i></button>
                <button class="${expenseObj.id} btn deleteBtn" onclick="UI.deleteExpense(this)"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        expenseNameOut.innerHTML += html1;
        expenseQtyOut.innerHTML += html2;
        expenseButtons.innerHTML += html3;
    }

    //Store object in local storage
    storeExpense(expenseInstObj, expenseObj) {
        expenseObj[`${id}`] = expenseInstObj;
        expenseObj[`${id}`].id = id; 
        localStorage.setItem('expenses', JSON.stringify(expenseObj));
    }

    //Add input value to budget object and output on the page
    static enterBudget(inputVal, budget) {
        if(this.checkInput(inputVal.value, budgetWarning)) {
            throw new Error('Budget field cannot be empty');
        }
        else {
            budgetParams['budget'] = inputVal.value;
            budget.textContent = budgetParams['budget'];
        }    
    }

    //Check if input is empty and show a warning if it is
    static checkInput (input, warning) {
        if(input === '') {
            warning.style.display = 'inline-block';
            setTimeout(() => {
                warning.style.display = 'none';
            }, 2000);
            return true;
        }
        else {
            return false;
        }
    }

    //Show balance on page and add it to the budget object
    static showBalance(balanceP, balanceAmount) {
        let difference = budgetParams['budget'] - budgetParams['expenses'];
        budgetParams['balance'] = difference;

        if(difference >= 0) {
            balanceAmount.textContent = difference;
            balanceP.style.color = 'rgb(19, 100, 53)';
        }
        else if(difference < 0) {
            balanceAmount.textContent = difference;
            balanceP.style.color = 'rgb(128, 18, 18)';
        }
    }

    //Update local storage budget object
    static updateBudget(budget) {
        localStorage.setItem('budget', JSON.stringify(budget));
    }

    //Edit expense
    static editExpense(e) {
        let classList = e.classList[0];
        let elements = document.getElementsByClassName(classList);
        let name = elements[0].children[0];
        let value = elements[1].children[0].children[0];
        
        expenseName.value = name.textContent; 
        expenseInput.value = value.textContent;
        this.deleteExpense(e); 
    }

    //Delete expense
    static deleteExpense(e) {
        let classList = e.classList[0];
        let expAmount = document.getElementsByClassName(classList+'a')[0].textContent;
        expAmount = Number(expAmount);
        let elements = document.getElementsByClassName(classList);
        for(let i = elements.length - 1; i >= 0; i--) {
            elements[i].remove();
        }

        budgetParams['expenses'] -= expAmount;
        totalExpense.textContent = budgetParams['expenses'];
        
        delete expenseObject[classList];
        localStorage.setItem('expenses', JSON.stringify(expenseObject));
        
        this.showBalance(balancePar, balance); 
    }

    //Clear input fields
    static clearFields(...fields) {
        fields.forEach(field => {
            field.value = '';
        });
    }
}

//Event listeners
document.addEventListener('DOMContentLoaded', () => {
    UI.showHTML();
});

calculateBtn.addEventListener('click', () => {
    //Store budget input inside of budget params and show output
    UI.enterBudget(budgetInput, totalBudget);

    //Show balance
    UI.showBalance(balancePar, balance);

    //Update budget object in local storage
    UI.updateBudget(budgetParams);

    //Clear input field
    UI.clearFields(budgetInput);
});

expenseBtn.addEventListener('click', () => {
    //Instantiate expense class
    let expense = new Expense(expenseName.value, expenseInput.value);
    
    //Instantiate ui class
    let ui = new UI();

    //Store expense object in local storage
    ui.storeExpense(expense, expenseObject);

    //Store expense input inside of budget params and show output
    ui.addExpense(expense, totalExpense);

    //Output expense name and amount
    UI.showExpense(expense);
    id++;

    //Show balance
    UI.showBalance(balancePar, balance);

    //Update budget object in local storage
    UI.updateBudget(budgetParams);
    
    //Clear input fields
    UI.clearFields(expenseName, expenseInput);
});
