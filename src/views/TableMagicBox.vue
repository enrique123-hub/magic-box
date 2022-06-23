<template>

  <div class="container">
    <div class="container__control-table" >
      <div class="error" v-show="showError()">
        <label for=""> Error al cargar el archivo </label>
      </div>
      <div class="table-empty" v-show="tableEmpty()">
        <span>Tabla vacia</span>
      </div>
      <div class="table-box">
        <ul v-for="(number, index) in numbers" :key="index">
            <li> {{number}} </li>
        </ul>
    </div>
      <div class="buttons">
        <label class="text-reader">
           Subir archivo
          <input class="addNumber" type="file" ref="text" @change="addNumber()" :key="txtFile" />
        </label>
        <button class="orderNumber" @click="orderNumber()">
          Ordenar Numeros
        </button>
        <button @click="cleanTable">
          Limpiar tabla
        </button>
      </div>
    </div>
    <modal-error ref="modalError"></modal-error>
    <modal-win ref="modalWin"></modal-win>
  </div>
</template>
<script>
import ModalError from '@/components/modals/ModalError'
import ModalWin from '@/components/modals/ModalWin.vue'

export default {
  name: 'TableMagicBox',
  components: {
    ModalError,
    ModalWin
  },
  data() {
    return {
      initNumber: [],
      numbers: null,
      goalState: [1, 2, 3, 4, 5, 6, 7, 8, 0],
      numbersArr: [5,7,3,6,1,2,4,8,0],
      localData: null,
      file: null,
      error: false,
      txtFile: 0,
      size: 0,
      counter: 1000,
      counted: 0,
      allSuc: [],
      hast: {},
      values: ''
    }
  },
  mounted() {
    this.getNumbers();
  },
  computed: {

  },
  methods: {
    addNumber() {
      this.file = this.$refs.text.files[0];
      const reader = new FileReader();
      if (this.file.name.includes(".txt")) {
        reader.onload = (res) => {
          this.error = false;
          const obj = res.target.result;
          this.initNumber = Object.assign({}, obj);
          console.log(this.initNumber)
          console.log(this.goalState)
          console.log(this.numbersArr)
          this.localData = res.target.result.replaceAll(/,/g, "");
          localStorage.setItem('localData', this.localData);
          this.getNumbers();
        };
        reader.readAsText(this.file);
      } else {
        this.txtFile++;
        this.$refs.modalError.openModal()
      }
    },
    getNumbers() {
      this.numbers = localStorage.getItem('localData');
    },
    cleanTable() {
      this.txtFile++;
      localStorage.removeItem('localData');
      this.error = false;
      this.getNumbers();
    },
    showError() {
      return this.error == true
    },
    tableEmpty() {
      return this.numbers == null
    },
    orderNumber() {
      let goalState = this.goalState;
      var puzzle = this.generatePuzzle(goalState);
      var result = this.bfs(puzzle, goalState);
      this.numbers = result.pop();
      console.log(result);
    },
    generatePuzzle(state) {
      let firstElement, secondElement;
      let _state = state.slice();
      this.shuffle(_state);
      if (!this.checkSolvable(_state)) {
        firstElement = _state[0] !== 0 ? 0 : 3;
        secondElement = _state[1] !== 0 ? 1 : 3;
        this.swap(_state, firstElement, secondElement);
      }
      _state = this.initNumber; //32 steps
      console.log('Puzzle to solve: [' + _state + ']');
      return _state;
    },
    bfs(state, goalState) {
      this.values = new Array(1000000);
      state.prev = null;
      this.values[0] = state;
      this.size++;
      for (var i = 0; i < this.size; i++) {
        this.statesPerSecond();
        if (this.compare(goalState, this.values[i])) {
          return this.collateStates(i);
        } else {
          var _successors = this.getSuccessors(this.values[i]);
          for (var k = 0; k < _successors.length; k++) {
            this.values[this.size] = _successors[k];
            this.size++;
          }
        }
      }
    },
    shuffle(array) {
      var size = array.length;
      var rand;
      for (var i = 1; i < size; i+= 1) {
        rand = Math.round(Math.random() * i);
        this.swap(array, rand, i);
      }
    },
    checkSolvable(state) {
      var pos = state.indexOf(0);
      var _state = state.slice();
      _state.splice(pos, 1);
      var count = 0;
      for (var i = 0; i < _state.length; i++ ) {
        for (var j = i + 1; j < _state.length; j++ ) {
          if (_state[i] > _state[j]) {
            count++;
          }
        }
      }
      return count % 2 === 0;
    },
    swap(state, from, to) {
      var _ = state[from];
      state[from] = state[to];
      state[to] = _;
    },
    statesPerSecond() {
      var now = new Date();
      var startTime = new Date();
      if (now.getTime() - startTime.getTime() >= this.counter) {
        this.counted = this.allSuc.length;
        this.counter += 1000;
      }
    },
    compare(arr1, arr2) {
      if (!arr1 || !arr2) {
        return false;
      }

      for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
          return false;
        }
      }
      return true;
    },
    collateStates(i) {
      var _ = this.values[i].prev;
      var result = [this.values[i]];
      while (_) {
        for (var j = 0; j < this.size; j++) {
          if (this.compare(_, this.values[j])) {
            _ = this.values[j].prev;
            result.push(this.values[j]);
            break;
          }
        }
      }
      return result.reverse();
    },
    getSuccessors(state) {
      console.log(state)
      var newState, _state;
      var successors = [];
      var pos = state.indexOf(0);
      var row = Math.floor(pos / 3);
      var col = pos % 3;
      if (row > 0) {
        //move up
        newState = this.move(state, successors, pos, -3);
        console.log('up: ' + newState)
        if (!this.compare(newState, state.prev)) {
          _state = this.hashState(newState);
          if (typeof this.hast[_state] === 'undefined') {
            this.hast[_state] = newState;
            newState.prev = state;
            successors.push(newState);
          }
        }
      }
      if (col > 0) {
        //move left
        newState = this.move(state, successors, pos, -1);
        console.log('left: ' + newState)
        if (!this.compare(newState, state.prev)) {
          _state = this.hashState(newState);
          if (typeof this.hast[_state] === 'undefined') {
            this.hast[_state] = newState;
            newState.prev = state;
            successors.push(newState);
          }
        }
      }
      if (row < 2) {
        //move down
        newState = this.move(state, successors, pos, 3);
        console.log('down: ' + newState)
        if (!this.compare(newState, state.prev)) {
          _state = this.hashState(newState);
          if (typeof this.hast[_state] === 'undefined') {
            this.hast[_state] = newState;
            newState.prev = state;
            successors.push(newState);
          }
        }
      }
      if (col < 2) {
        //move right
        newState = this.move(state, successors, pos, 1);
        console.log('rigth: ' + newState)
        if (!this.compare(newState, state.prev)) {
          _state = this.hashState(newState);
          if (typeof this.hast[_state] === 'undefined') {
            this.hast[_state] = newState;
            newState.prev = state;
            successors.push(newState);
          }
        }
      }
      return successors;
    },
    move(state, successors, pos, steps) {
      var newState;
      newState = state.slice();
      this.swap(newState, pos, pos + steps);
      return newState;
    },
    hashState(state) {
      var stateLength = state.length;
      var hash = 0;
      for(var i = 0; i < stateLength; i++) {
          hash += state[i] * Math.pow(stateLength, i);
      }
      return hash;
    }
  }
}
</script>

<style lang="scss" scoped>

.container{
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  &__control-table{

    .table-empty {
      width: 750px;
      height: 750px;
      display: grid;
      justify-content: center;
      align-content: center;
      border: 1px solid black;
    }

    .table-box {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);

      ul {
        display: flex;
        flex-wrap: wrap;
        list-style-type: none;
        font-family: 'Audiowide';
      }
      ul li {
        width: 250px;
        height: 250px;
        border: 1px solid black;
        font-size: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }    

    .buttons {
      margin-top: 15px;
      widows: 100%;
      height: 50px;
      display: flex;
      justify-content: space-around;

      .text-reader {
        position: relative;
        overflow: hidden;
        display: inline-block;
        border: 1px solid black;
        border-radius: 5px;
        padding: 16px 12px;
        cursor: pointer;
        background-color: blue;
        color: white;
        width: 150px;
        text-align: center;
        font-size: 15px;
      }
      .text-reader input {
        position: absolute;
        opacity: 0;
      }

      button {
        border-radius: 5px;
        border: 1px solid black;
        cursor: pointer;
        background-color: blue;
        color: white;
        width: 150px;
        padding: 16px 12px;
        font-size: 15px;
      }
    }

  }

}

</style>
