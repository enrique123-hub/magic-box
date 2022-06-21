<template>
    <modal ref="modal" width="500px">
        <div class="modal-error">
            <div class="modal-error__header">
                <h1>Error al cargar el archivo</h1>
            </div>
            <div @click="closeModal()">
                <button>
                    Cerrar
                </button>
            </div>
        </div>
    </modal>
</template>
<script>
import Modal from '@/components/modal.vue'

export default {
    name: 'ModalError',
    components: {
        Modal
    },
    methods: {
        openModal() {
            this.$refs.modal.open();
        },
        closeModal() {
            this.$refs.modal.close();
        }
    }
}
</script>
<style scoped lang="scss">
.modal-error {
    padding: 21px;
    display: grid;
    grid-row-gap: rem(13px);

    &__header {
        background-color: red;
        margin-bottom: 25px;
        h1 {
            font-weight: bold;
            line-height: 22px;
        }
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

</style>