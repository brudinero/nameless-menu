<template>
    <div class="text-item">
        <span class="left">{{ leftTitle }}</span>
        <span class="right">{{ rightTitle }}</span>
    </div>
</template>

<script>
export default {
    name: 'TextItem',
    props: {
        name: {
            type: String,
            default: "TextItem"
        },  
        leftTitle: {
            type: String,
            default: '',
        },
        rightTitle: {
            type: String,
            default: '',
        },
        callback: {
            type: String, 
            default: '',
        },
        submenuitems: {
            type: Array,
            default: null,
        }
    },
    data() {
        return {
        
        };
    },
    methods: {
        onEnterKeyPressed() {
            this.$emit('enter-pressed', {
                name: this.name,
                leftTitle: this.leftTitle,
                rightTitle: this.rightTitle,
                callback: this.callback,
                refName: this.$vnode.data.ref,
                submenuitems: this.submenuitems
            });
        },
    },
};
</script>

<style scoped>
.text-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.text-item .right {
    text-align: right;
}
</style>
