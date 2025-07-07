<script>
import ModalWrapperChoice from "./ModalWrapperChoice";
import PrimaryButton from "../PrimaryButton";
import SliderComponent from "../SliderComponent";

// Operator definitions with improved clarity and efficiency
const OPERATORS = [
  {
    symbol: "+",
    requiresBrackets: false,
    operation: (a, b) => a + b,
    generateOperands: result => {
      const operand1 = getRandomInteger(result);
      return [operand1, result - operand1];
    },
    canGenerate: result => result > 1,
    precedence: 0
  },
  {
    symbol: "-",
    requiresBrackets: true,
    operation: (a, b) => a - b,
    generateOperands: result => {
      const operand2 = getRandomInteger(20, 1);
      return [operand2 + result, operand2];
    },
    canGenerate: () => true,
    precedence: 0
  },
  {
    symbol: "×",
    requiresBrackets: false,
    operation: (a, b) => a * b,
    generateOperands: result => {
      const factors = [];
      for (let i = 2; i <= Math.sqrt(result); i++) {
        if (result % i === 0) factors.push([i, result / i]);
      }
      return factors.length > 0 
        ? factors[getRandomInteger(factors.length)] 
        : [result, 1];
    },
    canGenerate: result => {
      if (result <= 1) return false;
      for (let i = 2; i <= Math.sqrt(result); i++) {
        if (result % i === 0) return true;
      }
      return false;
    },
    precedence: 1
  },
  {
    symbol: "/",
    requiresBrackets: true,
    operation: (a, b) => a / b,
    precedence: 1,
    generateOperands: result => {
      const divisor = getRandomInteger(10, 2);
      return [divisor * result, divisor];
    },
    canGenerate: result => result > 0,
  },
  {
    symbol: "^",
    requiresBrackets: false,
    operation: (a, b) => Math.pow(a, b),
    precedence: 2,
    generateOperands: result => {
      if (result === 0) return [0, getRandomInteger(10, 1)];
      if (result === 1) {
        return Math.random() < 0.5 
          ? [1, getRandomInteger(10)] 
          : [getRandomInteger(10), 0];
      }
      if (Number.isInteger(Math.sqrt(result))) return [Math.sqrt(result), 2];
      if (Number.isInteger(Math.cbrt(result))) return [Math.cbrt(result), 3];
      return [result, 1];
    },
    canGenerate: () => true,
  }
];

// Helper functions
const getRandomInteger = (max, min = 0) => 
  Math.floor(Math.random() * (max - min)) + min;

const getRandomBooleanWithProbability = probability => 
  Math.random() < 1 / probability;

// Equation generation functions
function generateBaseEquation(expectedResult = getRandomInteger(10)) {
  if (Math.random() > 0.1) {
    return {
      expression: expectedResult.toString(),
      value: expectedResult,
      precedence: Number.MAX_SAFE_INTEGER
    };
  }

  const validOperators = OPERATORS.filter(op => op.canGenerate(expectedResult));
  const selectedOperator = validOperators.randomElement();
  const operands = selectedOperator.generateOperands(expectedResult);
  
  return {
    expression: operands.map(op => op >= 0 ? op : `(${op})`).join(selectedOperator.symbol),
    value: selectedOperator.operation(...operands),
    precedence: selectedOperator.precedence
  };
};

function generateComplexEquation(expectedResult = getRandomInteger(10)) {
  if (getRandomBooleanWithProbability(8)) {
    return {
      expression: expectedResult.toString(),
      value: expectedResult,
      precedence: Number.MAX_SAFE_INTEGER
    };
  }

  const validOperators = OPERATORS.filter(op => op.canGenerate(expectedResult));
  const selectedOperator = validOperators.randomElement();
  const [operand1, operand2] = selectedOperator.generateOperands(expectedResult);
  
  const leftExpression = generateBaseEquation(operand1);
  const rightExpression = generateBaseEquation(operand2);

  // Apply brackets based on precedence rules
  if (selectedOperator.precedence > leftExpression.precedence ||
      (selectedOperator.precedence === leftExpression.precedence && selectedOperator.precedence >= 2)) {
    leftExpression.expression = `(${leftExpression.expression})`;
  }

  if (selectedOperator.precedence > rightExpression.precedence ||
      (selectedOperator.requiresBrackets && selectedOperator.precedence === rightExpression.precedence)) {
    rightExpression.expression = `(${rightExpression.expression})`;
  }

  return {
    expression: `${leftExpression.expression}${selectedOperator.symbol}${rightExpression.expression}`,
    value: selectedOperator.operation(leftExpression.value, rightExpression.value),
    precedence: selectedOperator.precedence
  };
}

function generatePuzzle(maxResult = 9, minResult = 1, maxLength = 10, minLength = 6) {
  const minAnswer = minLength <= 6 ? 1 : 0;
  const targetValue = getRandomInteger(maxResult + 1, Math.max(minResult, minAnswer));
  const MAX_ATTEMPTS = 100;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const leftExpression = generateComplexEquation(targetValue);
    const rightExpression = generateComplexEquation(targetValue);
    const equation = `${leftExpression.expression}=${rightExpression.expression}`;
    
    if (leftExpression.expression !== rightExpression.expression && 
        equation.length >= minLength && 
        equation.length <= maxLength) {
      return equation;
    }
  }
  
  // Fallback if no valid equation found
  return "1+1=2";
}

// Calculation and validation
function safeEvaluate(expression) {
  try {
    const sanitized = expression
      .replace(/×/g, "*")
      .replace(/\^/g, "**")
      .replace(/--/g, "+")
      .replace(/\d+/g, match => parseInt(match, 10).toString());
    
    const result = new Function(`return ${sanitized}`)();
    return Number.isFinite(result) ? Math.round(result * 1e8) / 1e8 : NaN;
  } catch {
    return NaN;
  }
}

function isValidEquation(equation) {
  const charArr = equation.split("");
  if (charArr.countWhere(c => c === "=") !== 1) return false;
  if (["/×", "×/", "//", "××"].some(invalid => equation.includes(invalid))) return false;
  
  const [left, right] = equation.split("=");
  return safeEvaluate(left) === safeEvaluate(right);
}

export default {
  name: "NumberleModal",
  components: { ModalWrapperChoice, PrimaryButton, SliderComponent },
  
  data() {
    return {
      puzzle: "",
      gameBoard: [[]],
      currentRow: 0,
      renderKey: 0,
      gameStage: GAME_STAGES.IN_PROGRESS,
      maxResult: 9,
      minResult: 1,
      maxLength: 10,
      minLength: 6,
      totalRows: 6,
      notification: null
    };
  },
  
  computed: {
    inputLayout() {
      return [
        ["0", "1", "2", "3", "4", "+", "-", "(", ")", "Del"],
        ["5", "6", "7", "8", "9", "×", "/", "=", "^", "✓"]
      ];
    },
    
    hasDLC() {
      return player.hasFakeDLC;
    },
    
    puzzleLength() {
      return this.puzzle.length;
    },
    
    isCompleted() {
      return this.gameStage === GAME_STAGES.COMPLETED;
    },
    
    isFailed() {
      return this.gameStage === GAME_STAGES.FAILED;
    },
    
    modalTitle() {
      return this.hasDLC ? "Numberle Mini-game" : "Enable DLC";
    },
    
    sliderConfig() {
      return {
        interval: 1,
        width: "100%",
        tooltip: false,
        valueInDot: true,
        dotClass: "c-exchange__slider-handle",
        bgClass: "c-exchange__slider-bg",
        processClass: "c-exchange__slider-process"
      };
    }
  },
  
  watch: {
    maxResult(newVal) {
      if (!this.hasDLC) return;
      player.numberle.options.maxResult = Math.max(newVal, this.minResult);
    },
    
    minResult(newVal) {
      if (!this.hasDLC) return;
      player.numberle.options.minResult = Math.min(newVal, this.maxResult);
    },
    
    maxLength(newVal) {
      if (!this.hasDLC) return;
      player.numberle.options.maxLength = Math.max(newVal, this.minLength);
    },
    
    minLength(newVal) {
      if (!this.hasDLC) return;
      player.numberle.options.minLength = Math.min(newVal, this.maxLength);
    },
    
    totalRows(newVal) {
      if (!this.hasDLC) return;
      player.numberle.options.row = newVal;
    }
  },
  
  methods: {
    handleInput(inputChar) {
      if (this.gameStage !== GAME_STAGES.IN_PROGRESS) return;
      
      const currentRow = this.gameBoard[this.currentRow];
      if (!currentRow) {
        this.endGame(GAME_STAGES.FAILED);
        return;
      }

      this.renderKey++;
      
      if (inputChar === "✓") {
        this.submitRow(currentRow);
        return;
      }
      
      if (inputChar === "Del") {
        this.deleteLastCharacter(currentRow);
        return;
      }
      
      this.addCharacter(currentRow, inputChar);
    },
    
    submitRow(currentRow) {
      const userInput = currentRow.filter(c => c !== "").join("");
      
      if (userInput.length !== this.puzzleLength) {
        this.showNotification("Equation is too short");
        return;
      }
      
      if (userInput === this.puzzle) {
        this.endGame(GAME_STAGES.COMPLETED);
        return;
      }
      
      if (!isValidEquation(userInput)) {
        this.showNotification("Invalid equation");
        return;
      }
      
      if (this.currentRow + 1 >= this.totalRows) {
        this.endGame(GAME_STAGES.FAILED);
        return;
      }
      
      this.currentRow++;
      player.numberle.currentRow = this.currentRow;
    },
    
    deleteLastCharacter(currentRow) {
      const nonEmptyChars = currentRow.filter(c => c !== "");
      if (nonEmptyChars.length === 0) return;
      
      nonEmptyChars.pop();
      this.updateRow(currentRow, nonEmptyChars);
    },
    
    addCharacter(currentRow, char) {
      const nonEmptyChars = currentRow.filter(c => c !== "");
      if (nonEmptyChars.length === this.puzzleLength) return;
      
      nonEmptyChars.push(char);
      this.updateRow(currentRow, nonEmptyChars);
    },
    
    updateRow(rowArray, newValues) {
      const paddedRow = Array(this.puzzleLength).fill("")
        .map((_, i) => newValues[i] || "");
      
      rowArray.splice(0, rowArray.length, ...paddedRow);
      player.numberle.rows[this.currentRow] = [...paddedRow];
    },
    
    endGame(stage) {
      this.gameStage = stage;
      player.numberle.stage = stage;
    },
    
    getBlockId(rowIndex, colIndex) {
      return this.puzzleLength * rowIndex + colIndex;
    },
    
    showNotification(message) {
      this.notification = message;
    },
    
    clearNotification() {
      this.notification = null;
    },
    
    getBlockClass(char, row, rowIndex, colIndex) {
      // Skip styling for future rows
      if (rowIndex > this.currentRow || !this.isCompleted && rowIndex === this.currentRow) return "";
      
      // Correct position
      if (char === this.puzzle[colIndex]) {
        return "c-game-block--correct";
      }
      
      // Check for partial match (correct char in wrong position)
      const charOccurrences = this.puzzle.split("").filter(c => c === char).length;
      const correctPositions = row.filter((c, i) => c === char && c === this.puzzle[i]).length;
      const incorrectPositions = row.slice(0, colIndex).filter((c, i) => 
        c === char && c !== this.puzzle[i]).length;
      
      if (correctPositions + incorrectPositions < charOccurrences) {
        return "c-game-block--partial";
      }
      
      return "c-game-block--incorrect";
    },
    
    getButtonClass(char) {
      if (["Del", "✓"].includes(char)) return "";
      
      // Find the most relevant status for this button
      for (let i = this.currentRow - 1; i >= 0; i--) {
        const row = this.gameBoard[i];
        for (let j = row.length - 1; j >= 0; j--) {
          if (row[j] !== char) continue;
          return this.getBlockClass(char, row, i, j);
        }
      }
      
      return "";
    },
    
    getButtonStyle(index) {
      return `filter: hue-rotate(${index * 3}deg) saturate(${1 + index * 0.01});`;
    },
    
    restartGame() {
      Puzzles.numberle.reset();
      this.initializeGame();
    },
    
    initializeGame() {
      if (this.hasDLC) {
        const options = player.numberle.options || {};
        this.maxResult = options.maxResult ?? 9;
        this.minResult = options.minResult ?? 1;
        this.maxLength = options.maxLength ?? 10;
        this.minLength = options.minLength ?? 6;
        this.totalRows = options.row ?? 6;
      }
      
      if (player.numberle.rows) {
        this.puzzle = player.numberle.question;
        this.gameBoard = player.numberle.rows.map(row => [...row]);
        this.currentRow = player.numberle.currentRow;
        this.gameStage = player.numberle.stage;
      } else {
        if (this.minResult === 0 && this.maxLength === 6) {
          this.showNotification("Cannot start with min result 0 and max length 6");
          return;
        }
        
        this.currentRow = 0;
        this.puzzle = generatePuzzle(this.maxResult, this.minResult, this.maxLength, this.minLength);
        this.gameBoard = Array.from({ length: this.totalRows }, () => 
          Array(this.puzzle.length).fill(""));
        this.gameStage = GAME_STAGES.IN_PROGRESS;
        
        player.numberle = player.numberle || {};
        player.numberle.question = this.puzzle;
        player.numberle.rows = this.gameBoard.map(row => [...row]);
        player.numberle.stage = this.gameStage;
        player.numberle.currentRow = this.currentRow;
      }
    },
    
    updateSlider(value, property) {
      this[property] = value;
    },
    
    completeGame() {
      this.restartGame();
      if (this.hasDLC) return;
      player.hasFakeDLC = true;
    }
  },
  
  created() {
    this.initializeGame();
  }
};
</script>

<template>
  <ModalWrapperChoice
    :key="renderKey"
    :showConfirm="isCompleted"
    :showCancel="isFailed"
    @confirm="completeGame"
    class="l-numberle-modal"
  >
    <template #header>
      {{ modalTitle }}
    </template>
    
    <div
      class="c-game-container"
      @click="clearNotification"
    >
      <transition name="a-game-notify-modal">
        <div
          v-if="notification"
          class="l-game-notify-modal">
          {{ notification }}<br>(Click to hide)
        </div>
      </transition>
      
      <div 
        v-for="(row, rowIndex) in gameBoard" 
        :key="rowIndex" 
        class="c-game-block-row"
      >
        <div 
          v-for="(char, colIndex) in row" 
          :key="getBlockId(rowIndex, colIndex)"
          class="c-game-block"
          :class="getBlockClass(char, row, rowIndex, colIndex)"
          :style="getButtonStyle(rowIndex + colIndex)"
        >
          {{ char }}
        </div>
      </div>
      
      <br>
      
      <div 
        v-for="(row, rowIndex) in inputLayout" 
        :key="'input-' + rowIndex" 
        class="c-game-block-row"
      >
        <div
          v-for="(char, colIndex) in row"
          :key="'input-' + rowIndex + '-' + colIndex"
          class="c-game-block c-game-block--small"
          :class="getButtonClass(char)"
          @click.stop="handleInput(char)"
        >
          {{ char }}
        </div>
      </div>
      
      <div
        v-if="hasDLC"
        class="c-game-options-container"
      >
        <b>Game Options</b>
        <PrimaryButton 
          class="c-restart-game-btn" 
          @click.stop="restartGame"
        >
          Restart
        </PrimaryButton>
        
        <div class="c-game-options-progress-bar">
          <div class="c-options-labels">
            <div>Min Length:</div>
            <div>Max Length:</div>
            <div>Min Result:</div>
            <div>Max Result:</div>
            <div>Rows:</div>
          </div>
          
          <div class="c-options-sliders">
            <SliderComponent
              v-bind="sliderConfig"
              :value="minLength"
              :min="6"
              :max="10"
              @input="updateSlider($event, 'minLength')"
            />
            <SliderComponent
              v-bind="sliderConfig"
              :value="maxLength"
              :min="6"
              :max="10"
              @input="updateSlider($event, 'maxLength')"
            />
            <SliderComponent
              v-bind="sliderConfig"
              :value="minResult"
              :min="0"
              :max="30"
              @input="updateSlider($event, 'minResult')"
            />
            <SliderComponent
              v-bind="sliderConfig"
              :value="maxResult"
              :min="0"
              :max="30"
              @input="updateSlider($event, 'maxResult')"
            />
            <SliderComponent
              v-bind="sliderConfig"
              :value="totalRows"
              :min="3"
              :max="8"
              @input="updateSlider($event, 'totalRows')"
            />
          </div>
        </div>
      </div>
    </div>
  </ModalWrapperChoice>
</template>

<style scoped>
.c-game-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: auto;
}

.c-game-block-row {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

.c-game-block {
  width: 6rem;
  height: 6rem;
  text-align: center;
  line-height: 6rem;
  background-color: #aaccff80;
  border: 0.3rem solid #aaccff;
  font-weight: bold;
  font-size: 3.5rem;
  margin: 0.3rem;
  transition-duration: 0.2s;
  border-radius: var(--var-border-radius, 0.5rem);

  box-shadow: 0 0 1rem 0.05rem #aaccff inset;
}

.c-game-block--correct {
  background-color: #21ecb180;
  border-color: #21ecb1;
  box-shadow: 0 0 1rem 0.05rem #21ecb1 inset;
}

.c-game-block--partial {
  background-color: #ffcc8880;
  border-color: #ffcc88;
  box-shadow: 0 0 1rem 0.05rem #ffcc88 inset;
}

.c-game-block--incorrect {
  background-color: #cccccc80;
  border-color: #cccccc;
  box-shadow: 0 0 1rem 0.05rem #cccccc inset;
}

.c-game-block--small {
  width: 5rem;
  height: 5rem;
  line-height: 5rem;
  font-size: 2.5rem;
  cursor: pointer;
}

.o-primary-btn--subtab-option--minigame {
  border-color: var(--color-numberle);
  box-shadow: 0.1rem 0.1rem 0.5rem var(--color-logic);
}

.o-primary-btn--subtab-option--minigame:hover {
  background-color: var(--color-numberle);
}

.c-game-options-container {
  margin: 1rem 0;
  padding: 2rem;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.l-numberle-modal {
  min-width: 84rem;
  font-size: 1.6rem;
  overflow: hidden;
  position: relative;
}

.c-restart-game-btn {
  height: 5rem;
  padding: 1rem 2rem;
  margin: 2rem;
  font-size: 2rem;
}

.c-game-options-progress-bar {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: row;
}

.c-game-options-progress-bar > div {
  display: flex;
  justify-content: center;
  text-align: right;
  flex-direction: column;
  width: 50%;
}

.c-game-options-progress-bar > div > div {
  height: 3rem;
  max-width: 30rem;
}

.l-game-notify-modal {
  position: absolute;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  left: 50%;
  top: 50%;
  width: 50rem;
  height: 30rem;
  padding: 3rem 5rem;
  background-color: #aaccff;
  font-size: 2rem;
  font-weight: bold;
  margin-top: -15rem;
  margin-left: -25rem;
  background: linear-gradient(#aaccffcc, #88aacccc);
  border: 0.3rem solid #88aacc;
  transition-duration: 0.2s;
  border-radius: var(--var-border-radius, 1.2rem);
  box-shadow: 0 0 1rem 0.05rem #aaccff inset;
  backdrop-filter: blur(0.6rem);
  opacity: 1;
  z-index: 6;
}

.a-game-notify-modal-enter-active,
.a-game-notify-modal-leave-active {
  transition: opacity 0.2s;
}

.a-game-notify-modal-enter,
.a-game-notify-modal-leave-to {
  opacity: 0;
}
</style>