

<template>
    <div v-if="showMenu" class="menu" tabindex="0">
        <h1>{{ menuTitle }}</h1>
        <div class="menu-subtitle">{{ menuSubtitle }}</div>
        <div v-for="(item, index) in menuItems" :key="index" class="menu-item"
            :class="{ 'focused': index === focusedIndex }" >
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
            return true;
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
                    return { ...item, refName: `textItem-${index}`, callback: item.callback, };
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

            console.log(eventData.submenuitems);

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
                        callback: '',                     
                        submenuitems: [
                            {
                                type: 'text',
                                leftTitle: 'Burger',
                                rightTitle: '1x',
                                callback: '',
                                subtitle: ''
                            }
                        ]
                    },
                    {
                        type: 'text',
                        leftTitle: 'Wasser',
                        rightTitle: '2x',
                        callback: '',
                        submenuitems: [
                            {
                                type: 'text',
                                leftTitle: 'Burger',
                                rightTitle: '1x',
                                callback: '',
                                subtitle: ''
                            }
                        ]

                    },
                    {
                        type: 'text',
                        leftTitle: 'Wasser',
                        rightTitle: '2x',
                        callback: '',
                        submenuitems: [
                            {
                                type: 'text',
                                leftTitle: 'Burger',
                                rightTitle: '1x',
                                callback: '',
                                subtitle: ''
                            }
                        ]

                    },
                    {
                        type: 'text',
                        leftTitle: 'Wasser',
                        rightTitle: '2x',
                        callback: '',
                        submenuitems: [
                            {
                                type: 'text',
                                leftTitle: 'Burger',
                                rightTitle: '1x',
                                callback: '',
                                subtitle: ''
                            }
                        ]

                    },
                    {
                        type: 'text',
                        leftTitle: 'Wasser',
                        rightTitle: '2x',
                        callback: '',
                        submenuitems: [
                            {
                                type: 'text',
                                leftTitle: 'Burger',
                                rightTitle: '1x',
                                callback: '',
                                subtitle: ''
                            }
                        ]

                    },
                    {
                        type: 'text',
                        leftTitle: 'Wasser',
                        rightTitle: '2x',
                        callback: '',
                        submenuitems: [
                            {
                                type: 'text',
                                leftTitle: 'Burger',
                                rightTitle: '1x',
                                callback: '',
                                subtitle: ''
                            }
                        ]

                    },
                    {
                        type: 'text',
                        leftTitle: 'Wasser',
                        rightTitle: '2x',
                        callback: '',
                        submenuitems: [
                            {
                                type: 'text',
                                leftTitle: 'Burger',
                                rightTitle: '1x',
                                callback: '',
                                subtitle: ''
                            }
                        ]

                    },
                    {
                        type: 'text',
                        leftTitle: 'Wasser',
                        rightTitle: '2x',
                        callback: '',
                        submenuitems: [
                            {
                                type: 'text',
                                leftTitle: 'Burger',
                                rightTitle: '1x',
                                callback: '',
                                subtitle: ''
                            }
                        ]

                    },
                    {
                        type: 'text',
                        leftTitle: 'Wasser',
                        rightTitle: '2x',
                        callback: '',
                        submenuitems: [
                            {
                                type: 'text',
                                leftTitle: 'Burger',
                                rightTitle: '1x',
                                callback: '',
                                subtitle: ''
                            }
                        ]

                    },
                    {
                        type: 'text',
                        leftTitle: 'Wasser',
                        rightTitle: '2x',
                        callback: '',
                        submenuitems: [
                            {
                                type: 'text',
                                leftTitle: 'Burger',
                                rightTitle: '1x',
                                callback: '',
                                subtitle: ''
                            }
                        ]

                    },
                    {
                        type: 'text',
                        leftTitle: 'Wasser',
                        rightTitle: '2x',
                        callback: '',
                        submenuitems: [
                            {
                                type: 'text',
                                leftTitle: 'Burger',
                                rightTitle: '1x',
                                callback: '',
                                subtitle: ''
                            }
                        ]

                    },
                    {
                        type: 'text',
                        leftTitle: 'Wasser',
                        rightTitle: '2x',
                        callback: '',
                        submenuitems: [
                            {
                                type: 'text',
                                leftTitle: 'Burger',
                                rightTitle: '1x',
                                callback: '',
                                subtitle: ''
                            }
                        ]

                    },
                    {
                        type: 'text',
                        leftTitle: 'Wasser',
                        rightTitle: '2x',
                        callback: '',
                        submenuitems: [
                            {
                                type: 'text',
                                leftTitle: 'Burger',
                                rightTitle: '1x',
                                callback: '',
                                subtitle: ''
                            }
                        ]

                    },
                    {
                        type: 'text',
                        leftTitle: 'Wasser',
                        rightTitle: '2x',
                        callback: '',
                        submenuitems: [
                            {
                                type: 'text',
                                leftTitle: 'Burger',
                                rightTitle: '1x',
                                callback: '',
                                subtitle: ''
                            }
                        ]

                    },
                    {
                        type: 'text',
                        leftTitle: 'Wasser',
                        rightTitle: '2x',
                        callback: '',
                        submenuitems: [
                            {
                                type: 'text',
                                leftTitle: 'Burger',
                                rightTitle: '1x',
                                callback: '',
                                subtitle: ''
                            }
                        ]

                    },
                    {
                        type: 'text',
                        leftTitle: 'Wasser',
                        rightTitle: '2x',
                        callback: '',
                        submenuitems: [
                            {
                                type: 'text',
                                leftTitle: 'Burger',
                                rightTitle: '1x',
                                callback: '',
                                subtitle: ''
                            }
                        ]

                    },
                    {
                        type: 'text',
                        leftTitle: 'Wasser',
                        rightTitle: '2x',
                        callback: '',
                        submenuitems: [
                            {
                                type: 'text',
                                leftTitle: 'Burger',
                                rightTitle: '1x',
                                callback: '',
                                subtitle: ''
                            }
                        ]

                    },
                    {
                        type: 'text',
                        leftTitle: 'Wasser',
                        rightTitle: '2x',
                        callback: '',
                        submenuitems: [
                            {
                                type: 'text',
                                leftTitle: 'Burger',
                                rightTitle: '1x',
                                callback: '',
                                subtitle: ''
                            }
                        ]

                    },
                    {
                        type: 'input',
                        leftTitle: 'Suche',
                        callback: '',

                    },
                    {
                        type: 'checkbox',
                        leftTitle: 'Option A',
                        initialChecked: true,
                        callback: '',


                    },
                    {
                        type: 'list',
                        leftTitle: 'Oberteile',
                        numbers: [1, 2, 4, 5, 6],
                        callback: '',
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



.menu {
    --menu-bg: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 1.0) 100%
     );
    --menu-border: rgba(0, 0, 0, 0.08);
    --item-border: rgba(0, 0, 0, 0.1);
    --item-color: rgb(10, 20, 28);
    --item-bg-hover: rgba(10, 20, 28, 0.09);
    background: var(--menu-bg);
    backdrop-filter: blur(5px);
    transition: transform 0.5s ease;
     transform: perspective(2400px) translateX(100%); 
     
    list-style: none;
    flex-direction: column;
    z-index: 999999999;
    box-shadow: 0 0 0 1px var(--menu-border), 0 2px 2px rgba(0, 0, 0, 0.03), 0 4px 4px rgba(0, 0, 0, 0.04), 0 10px 8px rgba(0, 0, 0, 0.05), 0 15px 15px rgba(0, 0, 0, 0.06), 0 30px 30px rgba(0, 0, 0, 0.07), 0 70px 65px rgba(0, 0, 0, 0.09);
    /* transform: translate(-50%, -50%); */
    z-index: 2;
    pointer-events: none;
    padding: 2vw;
    border-radius: 1vw;
    width: 400px;
    margin: 10% auto;
    padding: 10px;
    position: fixed;
    top: -5vw;
    right: 1vw;
    font-family: 'Roboto Mono', monospace;
    max-height: 500px;
    overflow-y: scroll;
}
.menu:focus {

    outline: none;
}
.menu.show {
    transform: perspective(2400px) translateX(0%);
}

.menu-subtitle {
    color: rgb(10, 20, 28);
    border-bottom: 1px solid rgb(10, 20, 28);
    margin-bottom: 20px;
    text-align: center;
}

.menu h1 {
    color: rgb(10, 20, 28);
    margin: 0 0 10px;
    font-size: 28px;
    text-align: center;
}


.menu-item {
  justify-content: space-between;
  align-items: center;
  color: var(--item-color);
  background: 0;
  border: 0;
  white-space: nowrap;
  border-radius: 4px;
  padding: 6px 24px 6px 7px;
  font-size: 20px;
  animation: menuItemAnimation 0.2s 0s both;
  font-family: "Inter", sans-serif;
  cursor: pointer;

}

.menu-item-label {
  margin-right: 10px; /* optional spacing between label and input */
}



.focused {
    background-color: var(--item-bg-hover);

}


.spacer-class {
    height: 2px;
    background-color: rgba(255, 255, 255, 0.2);
    margin: 10px 0;
}

@keyframes menuAnimation {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    height: var(--height);
    opacity: 1;
    border-radius: 8px;
    transform: scale(1);
  }
} 
@keyframes menuAnimationclose {
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
  0% {
    height: var(--height);
    opacity: 1;
    border-radius: 8px;
    transform: scale(1);
  }
} 
@keyframes menuItemAnimation {
  0% {
    opacity: 0;
    transform: translateX(-10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
.menu::-webkit-scrollbar {
  display: none;
}
</style>