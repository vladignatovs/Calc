var textRow = document.getElementById("textRow");
var resultRow = document.getElementById("resultRow");
var insideBrackets = false;
var insideBracketsCounter = 0;

function deleteHistoryRow(historyRowText) {
    var enterPosition = historyRowText.lastIndexOf('=');
    var history = JSON.parse(localStorage.getItem('history')) || [];

    var expression = historyRowText.substring(0, enterPosition).trim();
    var result = historyRowText.substring(enterPosition + 1).trim();
    
    var index = history.findIndex(item => 
        item.expression === expression && 
        item.result === Number(result)
    );

    if (index !== -1) {
        history.splice(index, 1);

        localStorage.setItem('history', JSON.stringify(history));
        fillHistory();
    }
}
function fillHistory() {
    var history = JSON.parse(localStorage.getItem("history")) || [];
    var historyDiv = document.getElementById("history");
    
    historyDiv.innerHTML = ''; 

    for(var i = 0; i < history.length; i++) {
        var div = document.createElement("div");

        var p = document.createElement("p");
        p.innerText = history[i].expression + "=" + history[i].result;
        var text = history[i].expression + "=" + history[i].result;
        var deleteButton = document.createElement("button");
        deleteButton.addEventListener('click', () => {
            deleteHistoryRow(text)
        });

        div.style.display = "flex";
        div.style.flexDirection = "row";
        div.style.gap = "5px";

        deleteButton.style.width = "20px";
        deleteButton.style.height = "20px";
        deleteButton.style.backgroundColor = "red"; 
        deleteButton.style.color = "white";
        deleteButton.style.borderRadius = "10px";
        deleteButton.style.border = "none";
        deleteButton.style.cursor = "pointer";

        div.appendChild(p);
        div.appendChild(deleteButton);

        historyDiv.appendChild(div);
    }
}

fillHistory()

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
            // textRow.innerText = text.slice(0, lastBracketPosition - 1) + button.value + text.slice(lastBracketPosition)
            textRow.innerText = text.slice(0, -insideBracketsCounter) + button.value + text.slice(-insideBracketsCounter);
        } else {
            // textRow.innerText = text.slice(0, lastBracketPosition) + button.value + text.slice(lastBracketPosition);
            textRow.innerText = text.slice(0, -insideBracketsCounter) + button.value + text.slice(-insideBracketsCounter)
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
    var text = textRow.innerText;

    if(insideBracketsCounter === 0) {
        textRow.innerText += '()';
        insideBrackets = true;
    } else {
        textRow.innerText = text.slice(0, -insideBracketsCounter) + '()' + text.slice(-insideBracketsCounter);
    }

    insideBracketsCounter++;
    console.log(insideBracketsCounter);
}
function closeBrackets() {
    if(insideBrackets) {
        insideBracketsCounter--;
        if(insideBracketsCounter === 0) {
            insideBrackets = false;
        }
    }
}
function execute() {
    var expression = textRow.innerText;
    var expressionLastSymbol = expression[expression.length - 1];
    if(isNaN(expressionLastSymbol) && expressionLastSymbol != '(' && expressionLastSymbol != ')') {
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
    if(!(result === undefined)) {
        resultRow.innerText = result === undefined ? "" : result;
        saveHistory(expression, result);
    }
}


function clearEntry() {
    textRow.innerText = "";
    resultRow.innerText = '';

    insideBrackets = false;
    insideBracketsCounter = 0 ;
}

function allClear() {
    textRow.innerText = "";
    resultRow.innerText = '';

    insideBrackets = false;
    insideBracketsCounter = 0 ;

    clearHistory()
}


function saveHistory(expression, result) {
    let history = JSON.parse(localStorage.getItem('history')) || [];

    var newHistoryElement = {
        expression: expression,
        result: result
    };

    history.push(newHistoryElement);

    localStorage.setItem('history', JSON.stringify(history));
    fillHistory()
}

function clearHistory() {
    localStorage.removeItem('history');
    
    var historyDiv = document.getElementById('history');
    historyDiv.innerHTML = ''; 
}