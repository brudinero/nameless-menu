<template>
    <div class="menu">
        <h1>{{ menuTitle }}</h1>
        <div class="menu-subtitle">{{ menuSubtitle }}</div>
        <div v-for="(item, index) in menuItems" :key="index" class="menu-item"
            :class="{ 'focused': index === focusedIndex }">
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
            <div v-if="item.type !== 'text' && item.type !== 'list'" class="menu-item-right"></div>
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
            menuId: '',
            menuTitle: '',
            menuSubtitle: '',
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
        onReceiveMenuData(menuData) {
            this.createMenu(menuData);
        },

        createMenu(menuData) {
            this.menuId = menuData.id;
            this.menuTitle = menuData.title;
            this.menuSubtitle = menuData.menuSubtitle;
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
        },




        onTextItemEnterPressed(eventData) {
            console.log(`Test item enter pressed: ${JSON.stringify({ ...eventData, menuId: this.menuId })}`);

            /*
            if ('alt' in window) {
                alt.emit('onTextItemEnterPressed', eventData);
            }
            */
        },

        onListItemValueChange(eventData) {
            console.log(`List item value change: ${JSON.stringify({ ...eventData, menuId: this.menuId })}`);
        },

        onInputItemEnterPressed(eventData) {
            console.log(`Input item enter pressed: ${JSON.stringify({ ...eventData, menuId: this.menuId })}`);
        },

        onCheckboxItemValueChange(eventData) {
            console.log(`Checkbox item enter pressed: ${JSON.stringify({ ...eventData, menuId: this.menuId })}`);
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

        /*
        if ('alt' in window) {
            alt.on('receiveMenuData', this.onReceiveMenuData);
        }
        */
    },

    unmounted() {
        window.removeEventListener('keydown', this.onKeyDown);
    },

    mounted() {
        // Testdaten zum Testen im Browser
        const testData = {
            id: 'MENUTEST_1',
            title: 'Inventar',
            menuSubtitle: 'Test Subtitle',
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
    outline: none;
    background-color: rgba(255, 255, 255, 0.5);
}

.menu {
    width: 400px;
    background-color: rgba(16, 16, 16, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    transform: perspective(2400px) rotateY(-15deg);
    margin: 10% auto;
    padding: 10px;
}

.menu-subtitle {
    color: white;
    border-bottom: 1px solid white;
    margin-bottom: 20px;
    text-align: center;
}

.menu h1 {
    color: white;
    margin: 0 0 10px;
    font-size: 28px;
    text-align: center;
}

.menu-subtitle.focused {
    background-color: rgba(255, 255, 255, 0.1);
}

.menu-item {
    margin-bottom: 5px;
    padding: 10px;
    border-radius: 5px;
    color: white;
    font-size: 20px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border-bottom: 1px solid white;
    border-width: 0 0 1px 0;
    border-color: white;
}
</style>