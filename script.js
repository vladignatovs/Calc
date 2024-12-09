var textRow = document.getElementById("textRow");
var resultRow = document.getElementById("resultRow");
function addValue(button) {
    var text = textRow.innerText;
    var lastSymbol = text[text.length - 1];
    console.log(lastSymbol != button.value);
    console.log(!isNaN(lastSymbol));
    
    // if lastSymbol is not a number AND button value (symbol to be added) is not a number, then rewrite last symbol, otherwise add it
    isNaN(lastSymbol) && isNaN(button.value)
        ? textRow.innerText = text.slice(0, -1) + button.value 
        : textRow.innerText += button.value;
} 

function execute() {
    var expression = textRow.innerText;
    if(isNaN(expression[expression.length - 1])) {
        return;
    }
    var result = new Function(`return ${expression}`)();
    resultRow.innerText = result === undefined ? "" : result;
}


function clearEntry() {
    textRow.innerText = "";
}

//TODO: clear memory
function allClear() {
    textRow.innerText = "";
}