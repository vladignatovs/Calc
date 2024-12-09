var textRow = document.getElementById("textRow");
var resultRow = document.getElementById("resultRow");
var insideBrackets = false;

function addValue(button) {
    var text = textRow.innerText;

    // the point of this if statement is to decide whether or not the last value should be replaced
    // IF lastSymbol is not a number 
    // AND button value (symbol to be added) is not a number
    // AND lastSymbol is not a closing bracket (basically not insideBrackets)
    // THEN replace last symbol, otherwise add it
    if(insideBrackets) {
        var lastBracketPosition = text.lastIndexOf(')');
        var lastSymbolBeforeBracket = text[lastBracketPosition - 1];
        // if lastSymbol is not a number and button value is not a number, then replace last symbol
        if(lastSymbolBeforeBracket != '(' && isNaN(lastSymbolBeforeBracket) && (isNaN(button.value))) {
            textRow.innerText = text.slice(0, lastBracketPosition - 1) + button.value + text.slice(lastBracketPosition)
        } else {
            textRow.innerText = text.slice(0, lastBracketPosition) + button.value + text.slice(lastBracketPosition);
        }
    } else {
        var lastSymbol = text[text.length - 1];
        if(lastSymbol != ')' && isNaN(lastSymbol) && (isNaN(button.value))) {
            textRow.innerText = text.slice(0, -1) + button.value 
        } else {
            textRow.innerText += button.value
        }
    }
} 

function openBrackets() {
    textRow.innerText += '()';
    insideBrackets = true;
}
function closeBrackets() {
    insideBrackets = false;
}
function execute() {
    var expression = textRow.innerText;
    if(isNaN(expression[expression.length - 1])) {
        return;
    }

    // annoying regex explanation:
    /*
    first half
        / and /g - beginning and ending of regex, g means global search, taking every existing match into account
        (\d+) - matches any digit (0-9) one or more times, brackets remember the result for further processing
        \( - escape sequence with an opening bracket, which is after the remembered result
    ^^^^ this will work on: 5(... , 0(...) ... 3(... , and etc.
        
    second half:
        $1 - uses the remembered result, and uses it here, 1 serves as an index of the result (aka first rememebered)
        *( - is a simple string fragment to replace first half with
    ^^^^ this will work as: 5(... -> 5*(... , 0(...) ... 3(... -> 0*(...) ... 3*(...
    */
    expression = expression.replace(/(\d+)\(/g, '$1*(');

    console.log(expression);
    var result = new Function(`return ${expression}`)();
    resultRow.innerText = result === undefined ? "" : result;
}


function clearEntry() {
    textRow.innerText = "";
    insideBrackets = false;
}

function allClear() {
    textRow.innerText = "";
    insideBrackets = false;
}