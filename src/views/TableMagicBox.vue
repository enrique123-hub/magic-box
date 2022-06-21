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
        <button class="orderNumber">
          Ordenar Numeros
        </button>
        <button @click="cleanTable">
          Limpiar tabla
        </button>
      </div>
    </div>
    <modal-error ref="modalError"></modal-error>
  </div>
</template>
<script>
import ModalError from '@/components/modals/ModalError'

export default {
  name: 'TableMagicBox',
  components: {
    ModalError
  },
  data() {
    return {
      numbers: null,
      localData: null,
      file: null,
      error: false,
      txtFile: 0
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
          this.localData = res.target.result.replaceAll(/,/g, "");
          localStorage.setItem('localData', this.localData);
          this.getNumbers();
        };
        reader.readAsText(this.file);
      } else {
        this.txtFile++;
        this.openModalError()
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
    openModalError() {
      this.$refs.modalError.openModal()
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
