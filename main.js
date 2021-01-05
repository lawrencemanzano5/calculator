$(document).ready(function() {
    console.log("Everything loaded")

    $(".grid-item:not(#results-display)").click(function() {
        let val = $(this).text();
        if (["CE", "AC"].includes(val)) {
            backspaceResultDisplay();
        }
        else if (val === "=") {
            evaluateEquation();
        }
        else if (val === "Ans") {
            updateEquation(answer.toString(), true);
        }
        else {
            updateEquation(val);
        }
    });

    let bottomResultDisplay = $("#res-bottom");
    let topResultDisplay = $("#res-top");

    let equation = "0";
    let answer = 0;
    let afterCalculationFlag = true;
    let showingPrevAnswer = false;
    let calcError = false;
    let afterAns = false;

    let updateResultDisplay = function(resBottomStr, resTopStr) {
        if (resBottomStr !== undefined) {
            bottomResultDisplay.text(resBottomStr);
        }
        if (resTopStr != undefined) {
            topResultDisplay.text(resTopStr);
        }
    };

    let updateEquation = function(val, isAns = false) {
        if (calcError) {
            equation = "0"
            calcError = false;
        }

        if (equation === "0") {
            equation += (" " + val);
            if ($.isNumeric(val) || ["(", ")", ".", "Infinity"].includes(val)) {
                equation = val;
            }
        }
        else {
            let lastCharEqtn = equation.slice(-1);
            let newEqtnStr = equation + " " + val;
            if (($.isNumeric(lastCharEqtn) || [".", "y"].includes(lastCharEqtn)) && ($.isNumeric(val) || [".", "Infinity"].includes(val))) {
                newEqtnStr = equation + val;
                if (isAns) {
                    newEqtnStr = val;
                }
                else if (afterAns) {
                    let lastSpaceIdx = equation.lastIndexOf(" ");
                    if (lastSpaceIdx === -1) {
                        newEqtnStr = val;
                    }
                    else {
                        newEqtnStr = equation.slice(0, lastSpaceIdx + 1) + val;
                    }
                }
            }
            equation = newEqtnStr;

            if (afterCalculationFlag && $.isNumeric(val)) {
                equation = val;
            }
        }

        if (afterCalculationFlag) {
            afterCalculation(false);
        }

        if (afterAns) {
            afterAns = false;
        }

        if (isAns) {
            afterAns = true;
        }

        let ansToDisplay;
        if (!showingPrevAnswer) {
            ansToDisplay = "Ans = " + answer;
            showingPrevAnswer = true;
        }
        updateResultDisplay(equation, ansToDisplay);
    }

    let backspaceResultDisplay = function() {
        let ansToDisplay;
        let eqtnLength = equation.length;
        if (eqtnLength > 1 && !afterCalculationFlag) {
            let afterInfinityResult = false;
            let upperCharIdxToDelete = -1;
            if(equation.charAt(eqtnLength - 2) === " ") {
                upperCharIdxToDelete = -2;
            }
            else if (eqtnLength > 8 && (equation.lastIndexOf("Infinity") === (eqtnLength - 8))) {
                upperCharIdxToDelete = -9;
            }

            if (equation === "Infinity") {
                afterInfinityResult = true;
            }

            equation = afterInfinityResult ? "0" : equation.slice(0, upperCharIdxToDelete);
        }
        else {
            if (equation !== "0" || calcError) {
                equation = "0";
                calcError = false;
            }

            if (afterCalculationFlag) {
                ansToDisplay = "Ans = " + answer;
                showingPrevAnswer = true;
                afterCalculation(false);
            }
        }
        updateResultDisplay(equation, ansToDisplay);
    };

    let afterCalculation = function(toggleVal) {
        afterCalculationFlag = toggleVal;
        let clearBtn = $("#clear");

        if (afterCalculationFlag) {
            clearBtn.text("AC");
        }
        else {
            clearBtn.text("CE");
        }
    }

    let evaluateEquation = function() {
        let equationToEval = equation;
        if (equation.includes("x")) {
            equationToEval = equation.replace(/x/g, "*");
        }

        let evalAns;
        try {
            evalAns = eval(equationToEval);
        }
        catch(err) {
            evalAns = "Error";
            calcError = true;
        }

        let ansToDisplay = evalAns;
        if (!isNaN(evalAns) && evalAns !== "Error") {
            answer = evalAns;
        }
        else {
            calcError = true;
        }

        afterCalculation(true);
        updateResultDisplay(ansToDisplay, equation + " =");
        showingPrevAnswer = false;
        equation = answer.toString();
    }
});