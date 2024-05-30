<template>
  <div class="keypad">
    <div class="keypad-row" v-for="row in keypad" :key="'row' + row">
      <q-btn
        class="keypad-button"
        v-for="item in row"
        :key="'item' + item"
        @click="handleClick(item)"
        color="#bebebe"
      >
        {{ item === 'backspace' ? '<' : item }}
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const keypad = ref([
  [1, 2, 3, '*'],
  [4, 5, 6, ','],
  [7, 8, 9, '#'],
  ['backspace', 0, ':', '-']
])

const emit = defineEmits(['keypadInput'])

const handleClick = (item) => {
  if (item === 'backspace') {
    emit('keypadInput', 'backspace')
  } else {
    emit('keypadInput', item)
  }
}
</script>

<style lang="scss" scoped>
.keypad {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  margin: 0
}

.keypad-row {
  display: flex;
  justify-content: center;
}

.keypad-button {
  padding: 10px;
  font-size: 20px;
  width: 60px;
  height:60px;
  margin: 5px;
  background-color: #bebebe;
}
</style>
