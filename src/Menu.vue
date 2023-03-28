<template>
    <div class="menu">
        <h1>{{ menuTitle }}</h1>
        <div v-for="(item, index) in menuItems" :key="index" :class="{ 'focused': index === focusedIndex }">
            <text-item v-if="item.type === 'text'" :left-title="item.leftTitle" :right-title="item.rightTitle"
                :callback="item.callback" @enter-pressed="onTextItemEnterPressed" :ref="`textItem-${index}`"></text-item>
            <list-item v-else-if="item.type === 'list'" :left-title="item.leftTitle" :numbers="item.numbers"
                :ref="`listItem-${index}`" :callback="item.callback" @value-change="onListItemValueChange"></list-item>
            <input-item v-else-if="item.type === 'input'" :left-title="item.leftTitle" :ref="`inputItem-${index}`"
                :callback="item.callback" @enter-pressed="onInputItemEnterPressed"
                @focus="focusedIndex = index"></input-item>
            <checkbox-item v-else-if="item.type === 'checkbox'" :left-title="item.leftTitle"
                :initial-checked="item.initialChecked" :ref="`checkboxItem-${index}`" :callback="item.callback"
                @value-change="onCheckboxItemValueChange"></checkbox-item>
        </div>
    </div>
</template>

<script>
import TextItem from './components/TextItem.vue';
import ListItem from './components/ListItem.vue';
import InputItem from './components/InputItem.vue';
import CheckboxItem from './components/CheckboxItem.vue';

export default {
    name: 'MenuComponent',
    components: {
        TextItem,
        ListItem,
        InputItem,
        CheckboxItem,
    },
    data() {
        return {
            menuTitle: '',
            menuItems: [],
            focusedIndex: 0,


        };
    },

    computed: {
        focusedItem() {
            return this.menuItems[this.focusedIndex];
        }
    },
    methods: {
        createMenu(menuData) {
            this.menuTitle = menuData.title;
            this.menuItems = menuData.items.map((item, index) => {
                if (item.type === 'list') {
                    return { ...item, refName: `listItem-${index}`, callback: item.callback };
                }
                if (item.type === 'checkbox') {
                    return { ...item, refName: `checkboxItem-${index}`, callback: item.callback };
                }
                if (item.type === 'input') {
                    return { ...item, refName: `inputItem-${index}`, callback: item.callback };
                }
                if (item.type === 'text') {
                    const id = `text-${Date.now()}-${index}`; // eindeutige ID generieren
                    const refName = `textItem-${id}`; // ref-Name mit Typ und ID generieren
                    return { ...item, refName, callback: item.callback, onEnterKeyPressed: () => this.onTextItemEnterPressed({ leftTitle: item.leftTitle, rightTitle: item.rightTitle, callback: item.callback, refName }) };
                }
                return { ...item, callback: item.callback };
            });
            // Hier wird focusedItem aktualisiert
            this.focusedItem = this.menuItems[this.focusedIndex];
        },




        onTextItemEnterPressed(eventData) {
            console.log(`Test item enter pressed: ${JSON.stringify(eventData)}`);
        },

        onListItemValueChange(eventData) {
            console.log(`List item value change: ${JSON.stringify(eventData)}`);
        },

        onInputItemEnterPressed(eventData) {
            console.log(`Input item enter pressed: ${JSON.stringify(eventData)}`);
        },

        onCheckboxItemValueChange(eventData) {
            console.log(`Checkbox item enter pressed: ${JSON.stringify(eventData)}`);
        },

        executeCallback() {
            const focusedItem = this.focusedItem;
            if (focusedItem && focusedItem.type === 'text' && focusedItem.callback) {
                // send to alt:V server
                console.log(`Callback für ${focusedItem.type}: `, focusedItem.callback);

                if (this.$refs[focusedItem.refName]) {
                    this.$refs[focusedItem.refName].$emit('enter-pressed', {
                        leftTitle: focusedItem.leftTitle,
                        rightTitle: focusedItem.rightTitle,
                        callback: focusedItem.callback,
                    });
                }
            }
        },



        onKeyDown(event) {
            const previousFocusedIndex = this.focusedIndex;

            if (event.key === 'ArrowUp') {
                if (this.focusedIndex > 0) {
                    this.focusedIndex--;
                }
            } else if (event.key == 'ArrowDown') {
                if (this.focusedIndex < this.menuItems.length - 1) {
                    this.focusedIndex++;
                }
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                const focusedItem = this.menuItems[this.focusedIndex];

                if (focusedItem.type === 'list') {
                    const offset = event.key === 'ArrowLeft' ? -1 : 1;
                    this.$refs[focusedItem.refName][0].changeIndex(offset);
                }
            } else if (event.key === 'Enter') {
                const focusedItem = this.menuItems[this.focusedIndex];

                if (focusedItem.type === 'checkbox') {
                    this.$refs[focusedItem.refName][0].toggleChecked();
                }

                this.focusedItem = focusedItem;

                if (focusedItem.type === 'text') {
                    this.onTextItemEnterPressed({
                        leftTitle: focusedItem.leftTitle,
                        rightTitle: focusedItem.rightTitle,
                        callback: focusedItem.callback,
                        refName: focusedItem.refName,
                    });
                }

                this.executeCallback();
            }

            if (this.menuItems[previousFocusedIndex]?.type === 'input') {
                this.$refs[this.menuItems[previousFocusedIndex].refName][0].blurInput();
            }

            if (this.menuItems[this.focusedIndex]?.type === 'input') {
                this.$refs[this.menuItems[this.focusedIndex].refName][0].focusInput();
            }
        }
    },

    created() {
        window.addEventListener('keydown', this.onKeyDown);
    },

    unmounted() {
        window.removeEventListener('keydown', this.onKeyDown);
    },

    mounted() {
        // Testdaten zum Testen im Browser
        const testData = {
            title: 'Inventar',
            items: [
                {
                    type: 'text',
                    leftTitle: 'Burger',
                    rightTitle: '1x',
                    callback: 'textItem1Callback',
                },
                {
                    type: 'text',
                    leftTitle: 'Wasser',
                    rightTitle: '2x',
                    callback: 'textItem2Callback',

                },
                {
                    type: 'input',
                    leftTitle: 'Suche',
                    callback: 'textItemINPUTCallback',

                },
                {
                    type: 'checkbox',
                    leftTitle: 'Option A',
                    initialChecked: true,
                    callback: 'textItemCHECKBOXCallback',

                },
                {
                    type: 'list',
                    leftTitle: 'Oberteile',
                    numbers: [1, 2, 4, 5, 6],
                    callback: 'textItemLISTCallback',

                }
            ],
        };
        this.$el.focus();

        this.createMenu(testData);
    },

};
</script>

<style scoped>
.focused {
    background-color: rgba(255, 255, 100, 0.4);
}

.menu {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotateX(45deg);
    border: 2px solid #fff;
    background-color: rgba(0, 0, 0, 0.75);
    padding: 10px;
    width: 350px;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #fff;
}

.menu-title {
    text-align: center;
    font-size: 24px;
    margin-bottom: 10px;
}

.menu-items {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 350px;
    overflow-y: scroll;
}

.menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.2);
    padding: 0 10px;
    border-radius: 5px;
    transition: background-color 0.2s ease;
    cursor: pointer;
}

.menu-item:hover {
    background-color: rgba(255, 255, 255, 0.3);

}

.menu-item.focused {}

.menu-item-label {
    flex: 1;
}

.menu-item-value {
    flex: 0 0 auto;
}
</style>
