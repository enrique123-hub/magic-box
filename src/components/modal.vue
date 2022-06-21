<template>
    <section v-if="isOpen" class="modal" ref="modal" :class="{ 'open': isOpen }" :key="key">
        <div class="modal__overlay" @click="!disableOverlayEvents && closeOnOverlay()"></div>
        <div class="modal__content" :style="{width: width}">
            <slot></slot>
        </div>
    </section>
</template>

<script>
const modal = {
    name: 'modal',
    props: {
        onClose: {
            type: Function
        },
        width: {
            type: String
        },
        disableOverlayEvents: {
            type: Boolean
        }
    },
    data() {
        return {
            key: null,
            isOpen: false
        }
    },
    methods: {
        open() {
            this.key = Math.floor(Math.random() * 2000) + 1;
            setTimeout(() => {
                this.isOpen = true;
            }, 100);
        },
        close() {
            if (!this.closeOnOverlay) window.scrollTo(0, 0);
            this.isOpen = false;
            this.onClose && this.onClose();
        },
        closeOnOverlay() {
            this.$emit('close');
        }
    }
};

export default modal;
</script>
<style scoped lang="scss">

.modal {
    position: fixed;
    width: 100%;
    height: 100%;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    opacity: 0;
    z-index: -1;
    display: grid;
    align-items: center;
    justify-items: center;

    &.open {
        opacity: 1;
        transition: opacity 0.3s ease-in;
        z-index: 1000;
    }

    .modal__overlay {
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(black, 0.7);
        width: 100%;
        height: 100%;
    }

    &__content {
        margin: 0 auto;
        max-height: 95%;
        max-width: 95%;
        right: 0;
        left: 0;
        position: absolute;
        overflow: auto;
        > div {
            background-color: white;
            border-radius: rem(3px);
            -moz-border-radius: rem(3px);
            -webkit-border-radius: rem(3px);
        }
    }
}
</style>