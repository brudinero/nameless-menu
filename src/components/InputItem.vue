<template>
    <div class="input-item">
        <span class="left">{{ leftTitle }}</span>
        <span class="right">
            <input class="input-field" type="text" ref="input" v-model="inputValue" @keydown.enter="onEnterKeyPressed" />
        </span>
    </div>
</template>

<script>
export default {
    name: 'InputItem',
    props: {
        leftTitle: {
            type: String,
            default: '',
        },
    },

    methods: {
        focusInput() {
            this.$refs.input.focus();
        },

        blurInput() {
            this.$refs.input.blur();
        },


        onEnterKeyPressed() {
            this.$emit('enter-pressed', {
                leftTitle: this.leftTitle,
                value: this.inputValue,
                callback: this.callback,
                refName: this.refName,
            });
        },



    }
};
</script>

<style scoped>
.input-item {
    display: flex;
    justify-content: space-between;
}
</style>
