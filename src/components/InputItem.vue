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
        callback: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            inputValue: '',

        };
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
                name: this.name,
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
.input-field {
    background: 0;
    white-space: nowrap;
    border: none;
    outline: 2px solid rgba(10, 20, 28, 0.2);
    color: rgb(10, 20, 28);
    text-align: right;
    align-items: center;
    animation: menuItemAnimation 0.2s 0s both;
    font-family: "Inter", sans-serif;
    cursor: pointer;
}
</style>
