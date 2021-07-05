//--------------------------------------------------------
// When i say the formula i'm reffering to something like this
// formula = ["25", "+", "9", "x", "9", "-", "4", "/", "2"]


let radio1 = document.querySelector("#radio1");
let radio2 = document.querySelector("#radio2");
let radio3 = document.querySelector("#radio3");
let display = document.querySelector("#display");
let body = document.body;
let btn = document.querySelectorAll(".btn");
let btnDelete = document.querySelector(".btn-del");
let btnReset = document.querySelector(".btn-reset");
let btnEqual = document.querySelector(".btn-equal");
let formula = [], operators = 0, displayValue = "";
let dot = ".", isOperatorSet = false;

// The following three function will change the theme of the page
// according to desired theme selected by user 1, 2 or 3

// THEME 1

radio1.addEventListener("change", function () {
    if(radio1.checked){
        body.classList.remove("theme2", "theme3");
        body.classList.add("theme1");
    }
});

// THEME 2

radio2.addEventListener("change", function () {
    if(radio2.checked){
        body.classList.remove("theme1", "theme3");
        body.classList.add("theme2");
    }
});

// THEME 3

radio3.addEventListener("change", function () {
    if(radio3.checked){
        body.classList.remove("theme1", "theme2");
        body.classList.add("theme3");
    }
});

// This will loop through the buttons that has class named "btn"
// and each of those butttons contains values from 0 - 9 and the operators / * - +
// and the dot. when you click on those button this is what happen:
// 1 condition - check if the value is an operator, if it is an operator, will push it the formula,
// and create a space for the next operand.
// 2 condition - check if the value is a dot, if it is, if the value is empty it will
// append a 0 before the dot otherwise it will append after the number.
// 3 condition - check if the formula position or index exist. if does we create it.
// 4 condition - check if the value is a number and not an operator. if both condition satisfied it will append the value.
//
// Finally it will display the formula on screen

for (let index = 0; index < btn.length; index++) {
    btn[index].addEventListener("click", function () {
        let value = this.value;

        if(isOperator(value) && formula[formula.length - 1] != "" && formula.length > 0){
            formula.push(value);
            operators += 2;
        }

        if(formula[operators] == undefined){
            formula.push("");
        }

        if(value == "."){
            if(formula[operators] == ""){
                formula[operators] += "0" + value;
            }
            
            if(!checkDotExist(formula[operators])){
                formula[operators] += value;
            }
        }

        if(value in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] && !isOperator(value)){
            formula[operators] += value;
        }

        displayValues(formula)
    });
}

// Deletes the formula and erase values the screen

btnReset.addEventListener("click", function () {
    display.innerHTML = "";
    formula = [];
    displayValue = "";
});

// Will delete single digit in the formula.
// If the formula position is empty will pop out the position or index

btnDelete.addEventListener("click", function () {
    if(formula.length > 0){
        if(formula[formula.length - 1].length == 0){
            formula.pop();
        }

        let last = formula[formula.length - 1].length;

        if(last > 0){
            let number = formula[formula.length - 1];
            number = number.split("");
            number.pop();
            number = number.join("");
            formula[formula.length - 1] = number;
    
            if(formula[formula.length - 1].length == 0){
                formula.pop();
                operators = formula.length;
            }
        }
    }

    displayValues(formula)
});

// Executes the formula.
// 1 - if the formula last position is empty will insert a zero

btnEqual.addEventListener("click", function () {
    if(formula.length > 2){
        if(formula[formula.length - 1] == ""){
            formula[formula.length - 1] = "0";
        }
    
        let result = calculate(formula);
        displayValues(result)
        
        formula = [];
        formula.push(result[0]);
        operators = 0;
    }
});

// Display the formula on the screen, and formatting the values to display commas in the decimal values

function displayValues(array) {
    let formattedArray = [];

    for (let index = 0; index < array.length; index++) {
        if(isOperator(array[index]) || array[index] == ""){
            formattedArray.push(array[index]);
        }else{
            if(array[index][array[index].length - 1] == "."){
                formattedArray.push((parseFloat(array[index]).toLocaleString("en-US")).toString() + ".");
            }else{
                let [beforeDot, afterDot] = array[index].split(".");

                if(afterDot != undefined && beforeDot != undefined){
                    beforeDot = parseFloat(beforeDot).toLocaleString("en-US");

                    formattedArray.push(beforeDot.toString() + "." + afterDot.toString());
                }else{
                    formattedArray.push(parseFloat(array[index]).toLocaleString("en-US"));
                }
            }
        }
    }

    displayValue = formattedArray.join("")
    display.innerHTML = `${displayValue}`;
}

// checks if the value dot already exist in a value

function checkDotExist(value) {
    let count = 0;

    if(value == ""){
        return false;
    }

    for (let index = 0; index < value.length; index++) {
        if(value[index] == "."){
            count++;
        }
    }

    if(count == 1){
        return true;
    }

    return false;
}

// Check if the value is an operator

function isOperator(value) {
    if (value == "") {
        return false;
    }

    switch (value) {
        case "/": 
            return true;
            break;
        case "x": 
            return true;
            break;
        case "+": 
            return true;
            break;
        case "-": 
            return true;
            break;
    
        default:
            return false;
            break;
    }
}

// Calculte the formula, following the mathmatics logic.
// First the multiplication and division and then addittion and subtraction 

function calculate(array) {
    array = multiAndDiv(array);
    array = addAndSub(array);
    return array;
}

// Executes multiplication and division in a formula

function multiAndDiv(array) {
    let locations = [];
    for (let index = 0; index < array.length; index++) {
        if(array[index] == "x" || array[index] == "/"){
            locations.push(array[index]);
        }        
    }

    locations.sort();

    for (let index = 0; index < locations.length; index++) {
        let l = array.indexOf(locations[index]);
        let num1 = array[l-1], num2 = array[l+1];
        let result;

        if(array[l] == "x"){
            result = parseFloat(num1) * parseFloat(num2);
        }else if(array[l] == "/"){
            result = parseFloat(num1) / parseFloat(num2);
        }
        
        array[l - 1] = result.toString();
        let oldArray = array;
        let ar1 = oldArray.slice(0, l);
        let ar2 = oldArray.slice(l + 2, array.length);
        array = ar1.concat(ar2);
    }
    return array;
}

// Executes addition and subtraction in a formula

function addAndSub(array) {
    let locations = [];

    for (let index = 0; index < array.length; index++) {
        if(array[index] == "+" || array[index] == "-"){
            locations.push(array[index]);
        }        
    }

    for (let index = 0; index < locations.length; index++) {
        let l = array.indexOf(locations[index]);

        let num1 = array[l-1], num2 = array[l+1];
        let result;

        if(array[l] == "+"){
            result = parseFloat(num1) + parseFloat(num2);
        }else if(array[l] == "-"){
            result = parseFloat(num1) - parseFloat(num2);
        }
        
        array[l - 1] = result.toString();
        let oldArray = array;
        let ar1 = oldArray.slice(0, l);
        let ar2 = oldArray.slice(l + 2, array.length);
        array = ar1.concat(ar2);
    }
    return array;
}