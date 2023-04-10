

<template>
    <div v-if="showMenu" class="menu" tabindex="0">
        <h1>{{ menuTitle }}</h1>
        <div class="menu-subtitle">{{ menuSubtitle }}</div>
        <div v-for="(item, index) in menuItems" :key="index" class="menu-item"
            :class="{ 'focused': index === focusedIndex }">
            <div v-if="item.type === 'spacer'" :class="spacerClass"></div>
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
/* eslint-disable */
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
            showMenu: false,
            spacerClass: 'spacer'
        };
    },

    computed: {
        focusedItem() {
            return this.menuItems[this.focusedIndex];
        },

        debug() {
            return false;
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
                    return { ...item, refName: `checkboxItem-${index}`, callback: item.callback, };
                }
                if (item.type === 'input') {
                    return { ...item, refName: `inputItem-${index}`, callback: item.callback };
                }
                if (item.type === 'text') {
                    const id = `text-${Date.now()}-${index}`; // eindeutige ID generieren
                    const refName = `textItem-${id}`; // ref-Name mit Typ und ID generieren
                    return { ...item, refName, callback: item.callback, };
                }
                return { ...item, callback: item.callback };
            });


            this.showMenu = true;
            setTimeout(() => {
                this.$el.classList.add('show');
            }, 0);
        },

        closeMenu() {
            this.$el.classList.remove('show');
            setTimeout(() => {
                this.showMenu = false;
            }, 500);
        },

        onTextItemEnterPressed(eventData) {
            console.log(`Test item enter pressed: ${JSON.stringify({ ...eventData, menuId: this.menuId })}`);

            if (!this.debug) {
               if ('alt' in window) {
                alt.emit('menu:onTextItemEnterPressed', this.menuId, eventData);
                
               }
            }
        },

        onListItemValueChange(eventData) {
            console.log(`List item value change: ${JSON.stringify({ ...eventData, menuId: this.menuId })}`);

            if (!this.debug) {
                if ('alt' in window) {
                    alt.emit('menu:onListItemValueChange', this.menuId, eventData);
                }
            }
        },

        onInputItemEnterPressed(eventData) {
            console.log(`Input item enter pressed: ${JSON.stringify({ ...eventData, menuId: this.menuId })}`);

            if (!this.debug) {
                if ('alt' in window) {
                    alt.emit('menu:onInputItemEnterPressed', this.menuId, eventData);
                }
            }
        },

        onCheckboxItemValueChange(eventData) {
            console.log(`Checkbox2 item enter pressed: ${JSON.stringify({ ...eventData, menuId: this.menuId })}`);

            if (!this.debug) {
                if ('alt' in window) {
                    alt.emit('menu:onCheckboxItemValueChange', this.menuId, eventData);
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
            }

            if (this.menuItems[previousFocusedIndex]?.type === 'input') {
                this.$refs[this.menuItems[previousFocusedIndex].refName][0].blurInput();
            }

            if (this.menuItems[this.focusedIndex]?.type === 'input') {
                this.$refs[this.menuItems[this.focusedIndex].refName][0].focusInput();
            }
        },


        testMenu() {
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
                        subtitle: 'Hier ist ein Untertitel'
                    },
                    {
                        type: 'text',
                        leftTitle: 'Wasser',
                        rightTitle: '2x',
                        callback: 'textItem2Callback',
                        subtitle: 'Hier ist ein Untertitel2'

                    },
                    {
                        type: 'input',
                        leftTitle: 'Suche',
                        callback: 'textItemINPUTCallback',
                        subtitle: ''

                    },
                    {
                        type: 'spacer',
                        height: '10px',
                        color: 'white',
                        style: {
                            height: '2px',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            margin: '10px 0'
                        },
                        subtitle: ''

                    },
                    {
                        type: 'checkbox',
                        leftTitle: 'Option A',
                        initialChecked: true,
                        callback: 'textItemCHECKBOXCallback',
                        subtitle: ''


                    },
                    {
                        type: 'list',
                        leftTitle: 'Oberteile',
                        numbers: [1, 2, 4, 5, 6],
                        callback: 'textItemLISTCallback',
                        subtitle: ''


                    }
                ],
            };

            this.createMenu(testData);
        },
    },

    created() {
        window.addEventListener('keydown', this.onKeyDown);

        // Debug 

        if (this.debug === true) {
            this.testMenu();
        } else {
            if ('alt' in window) {
                alt.on('createMenu', (data) => {
                    this.createMenu(data)
                }
                );
                alt.on('closeMenu', this.closeMenu);
            }
        }


    },
    unmounted() {
        window.removeEventListener('keydown', this.onKeyDown);
    },

    updated() {
        if (this.showMenu)
            this.$el.focus();
    }

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
    /*transform: perspective(2400px) rotateY(-15deg); */

    transition: transform 0.5s ease;
    transform: perspective(2400px) translateX(100%);

    margin: 10% auto;
    padding: 10px;

    position: fixed;
    top: -5vw;
    right: 1vw;
}

.menu.show {
    transform: perspective(2400px) translateX(0%);
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

.spacer-class {
    height: 2px;
    background-color: rgba(255, 255, 255, 0.2);
    margin: 10px 0;
}
</style>