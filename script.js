"use strict"; //строгий режим

//класс математических операций
class CalculatorMath {
	sum(FirstOperand, SecondOperand) {
		var result = Number(FirstOperand) + Number(SecondOperand);
		return result;
	}

	minus(FirstOperand, SecondOperand) {
		var result = Number(FirstOperand) - Number(SecondOperand);
		return result;
	}

	mult(FirstOperand, SecondOperand) {
		var result = Number(FirstOperand) * Number(SecondOperand);
		return result;
	}

	dev(FirstOperand, SecondOperand) {
		var result = Number(FirstOperand) / Number(SecondOperand);
		return result;
	}

	sqrt(FirstOperand) {
		var result = Number(FirstOperand) ** 0.5;
		return result;
	}
}

//вывод информации
class CalculatorOut {
	currentNumField = null;
	resultField = null;

	constructor(CurrentNumField, ResultField) {
		this.currentNumField = CurrentNumField;
		this.resultField = ResultField;
	}

	viewCurrentNum(Value) {
		this.currentNumField.value = Value;
	}

	resetCurrentNum() {
		this.currentNumField.value = '';
	}

	addToOperations(Value, NeedNewLine) {
		this.resultField.value += Value;
		if (NeedNewLine) {
			this.addNewLine();
			this.resultField.scrollTop = this.resultField.scrollHeight;
		}
	}


	addNewLine() {
		this.resultField.value += '\r\n';
	}

	resetResult() {
		this.resultField.value = '';
	}
}

//действия при нажатии кнопок
class CalculatorLogic {
	calculatorCore;

	constructor(core) {
		this.calculatorCore = core;
		this.initNumButtons();
		this.initOperatorsWithTwoOperands();
		this.initOperatorsWithOneOperand();
		this.initActions();
	}

	initNumButtons() {
		document.querySelectorAll('.calculatorButtonRow__buttonNum').forEach(item => {
			if (item.textContent >= 0 && item.textContent <= 9) {
				item.addEventListener('click', event => {
					this.calculatorCore.updateCurrentOperand(item.textContent);
				})
			}
		})
	}

	initOperatorsWithTwoOperands() {
		document.querySelectorAll('.calculatorButtonRow__buttonOperator_twoOperators').forEach(item => {
			item.addEventListener('click', event => {
				if (this.calculatorCore.getCurrentOperand() !== null) {
					this.calculatorCore.setOperator(item.textContent, true);
				}
			})
		})
	}

	initOperatorsWithOneOperand() {
		document.querySelectorAll('.calculatorButtonRow__buttonOperator_oneOperator').forEach(item => {
			item.addEventListener('click', event => {
				this.calculatorCore.calculateOneOperator(item.textContent);
			})
		})
	}

	turnOffOperators() {
		document.querySelectorAll('.calculatorButtonRow__buttonOperator_twoOperators').forEach(item => {
			item.disabled = true;
		})

		document.querySelectorAll('.calculatorButtonRow__buttonOperator_oneOperator').forEach(item => {
			item.disabled = true;
		})
	}

	turnOnOperators() {
		document.querySelectorAll('.calculatorButtonRow__buttonOperator_twoOperators').forEach(item => {
			item.disabled = false;
		})

		document.querySelectorAll('.calculatorButtonRow__buttonOperator_oneOperator').forEach(item => {
			item.disabled = false;
		})
	}

	//действия
	initActions() {

		document.querySelector('.calculatorButtonRow__buttonAction_reset').addEventListener('click', event => {
			this.calculatorCore.calculatorReset();
		})

		document.querySelector('.calculatorButtonRow__buttonAction_calc').addEventListener('click', event => {
			if (this.calculatorCore.getCurrentOperand() !== null && this.calculatorCore.getLastOperand() !== null) {
				this.calculatorCore.calculateTwoOperands();
			}
		})
	}

}

//ядро логики
class CalculatorCore {
	result = null;
	lastOperand = null;
	currentOperand = null;
	operator = null;
	calculatorOut;
	calculatorLogic;
	calculatorMath;

	constructor() {
		this.calculatorLogic = new CalculatorLogic(this);
		this.calculatorOut = new CalculatorOut(document.querySelector('.calculatorScreen__screen_viewOperand_disabled'), document.querySelector('.calculatorScreen_screen_viewResult_disabled'));
		this.calculatorMath = new CalculatorMath();
	}

	getOperator() {
		return this.operator;
	}

	setOperator(Operator, NeedNewLine) {
		if (this.currentOperand != null) {
			this.setLastOperand();
			this.operator = Operator;
			this.calculatorOut.addToOperations(Operator, NeedNewLine);
			this.calculatorLogic.turnOffOperators();
		}
	}

	getCurrentOperand() {
		return this.currentOperand;
	}

	getLastOperand() {
		return this.lastOperand;
	}

	setLastOperand() {
		this.lastOperand = this.currentOperand;
		this.currentOperand = null;
		this.calculatorOut.resetCurrentNum();
		this.calculatorOut.addToOperations(this.lastOperand, true);
	}

	updateCurrentOperand(number) {
		if (this.currentOperand == null) {
			this.currentOperand = number;
		} else {
			this.addToOperandEnd(number);
		}
		this.calculatorOut.viewCurrentNum(this.currentOperand);
	}

	addToOperandEnd(number) {
		try {
			var tmpStr = String(this.currentOperand);
			tmpStr += number;
			this.currentOperand = Number(tmpStr);
		} catch (error) {}
	}

	calculatorReset() {
		this.result = null;
		this.operator = null;
		this.currentOperand = null;
		this.lastOperand = null;
		this.calculatorOut.resetResult();
		this.calculatorOut.resetCurrentNum();
		this.calculatorLogic.turnOnOperators();
	}

	calculateTwoOperands() {
		var result = null;

		if (this.operator != null) {
			try {
				switch (this.operator) {
					case '+':
						result = this.calculatorMath.sum(this.lastOperand, this.currentOperand);
						break;
					case '-':
						result = this.calculatorMath.minus(this.lastOperand, this.currentOperand);
						break;
					case '*':
						result = this.calculatorMath.mult(this.lastOperand, this.currentOperand);
						break;
					case '/':
						result = this.calculatorMath.dev(this.lastOperand, this.currentOperand);
						break;
					default:
						result = null;
				}
				if (result !== null) {
					this.setResultTwoOperands(result);
				} else {
					throw error;
				}
			} catch (error) {
				this.calculatorOut.viewCurrentNum('Произошла ошибка');
			}
		}
	}

	setResultTwoOperands(Result) {
		if (this.lastOperand !== null) {
			this.calculatorOut.addToOperations(this.currentOperand, true);
		}
		this.calculatorOut.addToOperations('=', true);
		this.operator = null;
		this.currentOperand = Result;
		this.calculatorOut.viewCurrentNum(this.currentOperand);
		this.lastOperand = null;
		this.calculatorLogic.turnOnOperators();
	}

	calculateOneOperator(Operator) {
		var result = null;
		this.operator = Operator;

		if (this.operator != null) {
			try {
				switch (this.operator) {
					case 'sqrt':
						result = this.calculatorMath.sqrt(this.currentOperand);
						break;
					default:
						result = null;
				}
				if (result !== null) {
					this.setResultOneOperands(result, this.currentOperand, this.operator);
				} else {
					throw error;
				}
			} catch (error) {
				this.calculatorTablou.viewCurrentNum('Ошибка вычисления');
			}
		}
	}

	setResultOneOperands(Result, Operand, Operation) {
		this.calculatorOut.addToOperations(Operation + '(' + Operand + ')', true);
		this.calculatorOut.addToOperations('=', true);
		this.operator = null;
		this.currentOperand = Result;
		this.calculatorOut.viewCurrentNum(this.currentOperand);
		this.lastOperand = null;
		this.calculatorLogic.turnOnOperators();
	}
}

var calculator = new CalculatorCore();