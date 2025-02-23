let memory = 0;
let history = document.getElementById('history');
let display = document.getElementById('display');

function addToDisplay(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = '';
    history.value = '';
}

function backspace() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        history.value = display.value + ' =';
        let result = eval(display.value);
        
        // 결과가 너무 크거나 작은 경우 지수 표기법 사용
        if (Math.abs(result) > 1e9 || (Math.abs(result) < 1e-9 && result !== 0)) {
            display.value = result.toExponential(4);
        } else {
            // 소수점 자리수 제한
            display.value = Number(result.toFixed(8));
        }
    } catch (error) {
        display.value = 'Error';
        setTimeout(clearDisplay, 1500);
    }
}

function calculateSin() {
    try {
        history.value = `sin(${display.value})`;
        display.value = Math.sin(display.value * Math.PI / 180).toFixed(8);
    } catch (error) {
        display.value = 'Error';
        setTimeout(clearDisplay, 1500);
    }
}

function calculateCos() {
    try {
        history.value = `cos(${display.value})`;
        display.value = Math.cos(display.value * Math.PI / 180).toFixed(8);
    } catch (error) {
        display.value = 'Error';
        setTimeout(clearDisplay, 1500);
    }
}

function calculateTan() {
    try {
        history.value = `tan(${display.value})`;
        display.value = Math.tan(display.value * Math.PI / 180).toFixed(8);
    } catch (error) {
        display.value = 'Error';
        setTimeout(clearDisplay, 1500);
    }
}

function calculateLog() {
    try {
        history.value = `log(${display.value})`;
        display.value = Math.log10(eval(display.value)).toFixed(8);
    } catch (error) {
        display.value = 'Error';
        setTimeout(clearDisplay, 1500);
    }
}

function calculateLn() {
    try {
        history.value = `ln(${display.value})`;
        display.value = Math.log(eval(display.value)).toFixed(8);
    } catch (error) {
        display.value = 'Error';
        setTimeout(clearDisplay, 1500);
    }
}

function calculateSqrt() {
    try {
        history.value = `√(${display.value})`;
        display.value = Math.sqrt(eval(display.value)).toFixed(8);
    } catch (error) {
        display.value = 'Error';
        setTimeout(clearDisplay, 1500);
    }
}

function calculatePi() {
    display.value += Math.PI;
}

// 메모리 기능
function clearMemory() {
    memory = 0;
}

function memoryRecall() {
    display.value = memory;
}

function memoryAdd() {
    try {
        memory += eval(display.value);
    } catch (error) {
        display.value = 'Error';
        setTimeout(clearDisplay, 1500);
    }
}

function memorySub() {
    try {
        memory -= eval(display.value);
    } catch (error) {
        display.value = 'Error';
        setTimeout(clearDisplay, 1500);
    }
}

// 키보드 입력 지원
document.addEventListener('keydown', function(event) {
    if (event.key >= '0' && event.key <= '9' || event.key === '.') {
        addToDisplay(event.key);
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        addToDisplay(event.key);
    } else if (event.key === 'Enter') {
        calculate();
    } else if (event.key === 'Backspace') {
        backspace();
    } else if (event.key === 'Escape') {
        clearDisplay();
    }
});
