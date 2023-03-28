<template>
    <div class="checkbox-item">
        <span class="left">{{ leftTitle }}</span>
        <input class="right" type="checkbox" v-model="isChecked" />
    </div>
</template>

<script>
export default {
    name: 'CheckboxItem',
    props: {
        leftTitle: {
            type: String,
            default: '',
        },
        initialChecked: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            isChecked: this.initialChecked,
        };
    },

    methods: {
        toggleChecked() {
            this.isChecked = !this.isChecked;
            this.$emit('value-change', {
                leftTitle: this.leftTitle,
                value: this.isChecked,
                callback: this.callback,
            });
        },
    }
};
</script>

<style scoped>
.checkbox-item {
    display: flex;
    justify-content: space-between;
}
</style>
