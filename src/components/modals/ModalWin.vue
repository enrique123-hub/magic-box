<template>
    <modal ref="modal" width="500px">
        <div class="modal-win">
            <div class="modal-win__header">
                <h1>Has ganado!!!!!!!!!</h1>
            </div>
            <div @click="closeModal()" class="modal-win__close">
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
    name: 'ModalWin',
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
.modal-win {
    padding: 15px;
    display: grid;
    grid-row-gap: rem(13px);
    border-radius: 15px;

    &__header {
        text-align: center;
        margin-top: 15px;
        margin-bottom: 25px;
        h1 {
            font-size: 35px;
            font-weight: bold;
            line-height: 22px;
        }
    }

    &__close {
        display: flex;
        justify-content: center;
        width: 100%;

        button {
            border-radius: 5px;
            border: 1px solid black;
            cursor: pointer;
            background-color: #D9D9F3;
            color: black;
            width: 250px;
            padding: 16px 12px;
            font-size: 15px;
        }
    }
    
}

</style>