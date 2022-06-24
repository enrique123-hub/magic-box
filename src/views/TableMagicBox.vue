<template>

  <div class="container">
    <div class="container__control-table" >
      <div class="table-empty" v-show="tableEmpty()">
        <span>Agregar Archivo</span>
      </div>
      <div class="table-box" v-show="!tableEmpty()">
        <ul v-for="(number, index) in numbers " :key="index">
          <li v-if="number == 0" class="numberList"> {{ number }} </li>
          <li v-else > {{ number }} </li>
        </ul>
      </div>
      <div class="buttons">
        <label class="text-reader">
           Subir archivo
          <input class="addNumber" type="file" ref="text" @change="addNumber()" :key="txtFile" :disabled="disableAddFile" />
        </label>
        <button class="orderNumber" @click="orderNumber()">
          Ordenar Numeros
        </button>
        <button @click="cleanTable" :disabled="disableCleanTable">
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
    ModalWin,
  },
  data() {
    return {
      initNumber: [],
      numbers: null,
      goalState: [1, 2, 3, 4, 5, 6, 7, 8, 0],
      localData: null,
      file: null,
      error: false,
      txtFile: 0,
      size: 0,
      counted: 0,
      hast: {},
      values: ''
    }
  },
  mounted() {
    this.getNumbers();
  },
  computed: {
    disableAddFile() {
      return this.numbers != null
    },
    disableCleanTable() {
      return this.numbers == null
    }
  },
  methods: {
    addNumber() {
      this.file = this.$refs.text.files[0];
      const reader = new FileReader();
      if (this.file.name.includes(".txt")) {
        reader.onload = (res) => {
          this.error = false;
          this.initNumber = this.replaceCaracters(res);
          console.log(this.initNumber)
          let vari = res.target.result.replaceAll(/\s+/g, "");
          this.localData = vari.replaceAll(/,/g, '');
          localStorage.setItem('localData', this.localData);
          this.getNumbers();
        };
        reader.readAsText(this.file);
      } else {
        this.txtFile++;
        this.$refs.modalError.openModal()
      }
    },
    replaceCaracters(res) {
      let fin = []
      let arr = []
      const obj = res.target.result;
      const array = Array.from(obj);
      array.forEach(element => {
        fin.push(parseInt(element));
      })
      fin.forEach((k) => {
        if (k || k == 0) {
          arr.push(parseInt(k));
        }
      })
      return arr;
    },
    getNumbers() {
      this.numbers = localStorage.getItem('localData');
    },
    cleanTable() {
      this.txtFile++;
      localStorage.removeItem('localData');
      this.error = false;
      location.reload()
      this.getNumbers();
    },
    tableEmpty() {
      return this.numbers == null
    },
    orderNumber() {
      let goalState = this.goalState;
      var puzzle = this.generatePuzzle(goalState);
      var result = this.bfs(puzzle, goalState);

      if (result) {
        this.viewArray(result);
      }
      
      console.log(result);
    },
    viewArray(result) {
      var delay = 0
      result.forEach(elem => {
        setTimeout(() => {
          this.numbers = elem
          console.log(this.numbers)
        }, 1000 + delay)
        delay += 1000;
      })
    },
    generatePuzzle(state) {
      let _state = state.slice();
      if (!this.checkSolvable(_state)) {
        this.$refs.modalErrorResult.openModal();
      }
      _state = this.initNumber;
      console.log(_state);
      return _state;
    },
    bfs(state, goalState) {
      this.values = new Array(1000000);
      state.prev = null;
      this.values[0] = state;
      this.size++;
      for (var i = 0; i < this.size; i++) {
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
    // Verificar si el puzzle tiene solucion
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
      var successors = [];
      var pos = state.indexOf(0);
      var row = Math.floor(pos / 3);
      var col = pos % 3;
      //move up
      if (row > 0) {
        this.move(state, successors, pos, -3);
      }
      //move left
      if (col > 0) {
        this.move(state, successors, pos, -1);
      }
      //move down
      if (row < 2) {
        this.move(state, successors, pos, 3);
      }
      //move right
      if (col < 2) {
        this.move(state, successors, pos, 1);
      }
      return successors;
    },
    move(state, successors, pos, steps) {
      var newState, _state;
      newState = state.slice();
      this.swap(newState, pos, pos + steps);
      if (!this.compare(newState, state.prev)) {
          _state = this.hashState(newState);
          if (typeof this.hast[_state] === 'undefined') {
            this.hast[_state] = newState;
            newState.prev = state;
            successors.push(newState);
          }
        }
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
  background-color: var(--meet);

  &__control-table{

    .table-empty {
      width: 750px;
      height: 750px;
      display: grid;
      justify-content: center;
      align-content: center;
      border: 1px solid var(--black);
      border-radius: 15px;
      font-size: 25px;
      font: 200% sans-seref;
    }

    .table-box {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      width: 750px;
      height: 750px;
      justify-items: center;
      align-items: center;
      background-color: var(--gray);
      border: 1px solid var(--black);
      padding: 10px;
      border-radius: 15px;

      .numberList {
        color: var(--gray);
        background-color: var(--gray);
        border: none;
        border-radius: 0px;
      }

      ul {
        display: flex;
        flex-wrap: wrap;
        list-style-type: none;
        font-family: 'Audiowide';
        background-color: white;
        border-radius: 15px;
      }

      ul:nth-child(2n + 1) {
        background-color: var(--limon);
      }

      li{
        border-radius: 15px;
      }
      
      ul li {
        width: 230px;
        height: 230px;
        border: 1px solid var(--black);
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
        border: none;
        border-radius: 5px;
        padding: 16px 12px;
        cursor: pointer;
        background-color: var(--bouse);
        color: var(--black);
        width: 150px;
        text-align: center;
        font-size: 15px;
        font: 100% sans-seref;
      }
      .text-reader input {
        position: absolute;
        opacity: 0;
      }

      button:disabled {
        background-color: var(--grid-layer);
      }

      button {
        border-radius: 5px;
        border: none;
        cursor: pointer;
        background-color: var(--bouse);
        color: white;
        width: 150px;
        padding: 16px 12px;
        font-size: 15px;
        color: var(--black);
        font: 100% sans-seref;
      }
    }

  }

}

</style>
