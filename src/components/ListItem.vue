<template>
    <div class="list-item">
        <span class="left">{{ leftTitle }}</span>
        <span class="right">
            <span class="arrow">&#60;</span>
            {{ numbers[selectedIndex] }}
            <span class="arrow">&#62;</span>
        </span>
    </div>
</template>


<script>
export default {
    name: 'ListItem',
    props: {
        leftTitle: {
            type: String,
            default: '',
        },
        numbers: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            selectedIndex: 0,
        };
    },
    methods: {
        changeIndex(offset) {
            const newIndex = this.selectedIndex + offset;

            if (newIndex >= 0 && newIndex < this.numbers.length) {
                this.selectedIndex = newIndex;

                this.$emit('value-change', {
                    leftTitle: this.leftTitle,
                    value: this.numbers[newIndex],
                    callback: this.callback,
                });
            }
        }

    },
};
</script>

<style scoped>
.list-item {
    display: flex;
    justify-content: space-between;
}

.arrow {
    margin: 0 5px;
}
</style>

