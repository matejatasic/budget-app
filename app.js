//Variables
let budgetInput = document.getElementById('budgetInput');
let expenseName = document.getElementById('expenseName');
let expenseInput = document.getElementById('expenseInput');
let budgetAmount = document.getElementById('budgetAmount');
let expenseAmount = document.getElementById('expenseAmount');
let balance = document.getElementById('balance');
let expenseNameOut = document.getElementById('expenseNameOut');
let expenseQtyOut = document.getElementById('expenseQtyOut');
let edit = document.getElementById('edit');
let budgetWarning = document.getElementById('budgetWarning');
let expensetWarning = document.getElementById('expenseWarning');
const calculateBtn = document.getElementById('calculateBtn');
const expenseBtn = document.getElementById('expenseBtn');

let expenseNum = 0;
let count = 0;

//Event listeners
calculateBtn.addEventListener('click', enterBudget);
expenseBtn.addEventListener('click', addExpense);

//Functions
function enterBudget() {
    let inputVal = budgetInput.value;
    let expenseVal = expenseAmount.textContent;

    showWarning(inputVal, budgetWarning);

    budgetAmount.textContent = inputVal;
    budgetInput.value = '';
    showBalance(inputVal,expenseVal);
}

//Adds the amount to total expense
function addExpense() {
    let expenseNameVal = expenseName.value;
    let expenseVal = expenseInput.value;
    
    showWarning(expenseNameVal, expenseWarning);
    showWarning(expenseVal, expenseWarning);
    showExpense(expenseNameVal, expenseVal);

    expenseName.value = '';
    expenseInput.value = '';
    expenseNum += parseInt(expenseVal); 
    expenseAmount.textContent = expenseNum;
    showBalance(budgetAmount.textContent, expenseAmount.textContent);
}

//Calculates the balance according to budget and total expense
function showBalance(budget, expense) {
    let difference = budget - expense;
    let prevSib = document.getElementsByClassName('fa-dollar-sign');
    
    if(difference >= 0) {
        balance.textContent = difference;
        prevSib[0].nextElementSibling.style.color = 'rgb(19, 100, 53)';
    }
    else if(difference < 0) {
        balance.textContent = difference;
        prevSib[0].nextElementSibling.style.color = 'rgb(128, 18, 18)';
    }
}

//Outputs the name of the expense and the amount
function showExpense(name, value) {
    let html1= `
    <div class="${count} expenseRow">
        <p>${name}</p>
    </div>
    `;
    let html2= `
    <div class="${count} expenseRow">
        <p>$<span class="${count}a">${value}</span></p>
    </div>
    `;
    let html3 = `
        <div class="${count} expenseRow">
            <button class="${count} btn editBtn" onclick="editExp(this)"><i class="fas fa-edit"></i></button>
            <button class="${count} btn deleteBtn" onclick="deleteExp(this)"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    expenseNameOut.innerHTML += html1;
    expenseQtyOut.innerHTML += html2;
    edit.innerHTML += html3;
    count++;
}

//Show warning if empty input fields
function showWarning(input, warning) {
    if(input.length === 0) {
        warning.style.display = 'block';
        setTimeout(() => {
            warning.style.display = 'none';
        }, 4000);
    }
}

//Edit one expense and update balance
function editExp(e) {
    let classList = e.classList[0];
    let elements = document.getElementsByClassName(classList);
    let name = elements[0].children[0];
    let value = elements[1].children[0].children[0];
    expenseName.value = name.textContent; 
    expenseInput.value = value.textContent;
    deleteExp(e); 
}

//Delete one expense and update balance
function deleteExp(e) { 
    let classList = e.classList[0];
    let expAmount = document.getElementsByClassName(classList+'a')[0].textContent;
    expAmount = Number(expAmount);
    let elements = document.getElementsByClassName(classList);
    for(let i = elements.length - 1; i >= 0; i--) {
        elements[i].remove();
    }
    
    expenseNum -= expAmount;
    expenseAmount.textContent = expenseNum;
    showBalance(budgetAmount.textContent, expenseAmount.textContent); 
}