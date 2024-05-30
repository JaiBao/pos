<template>
  <div>
    <input v-model="inputValue" />
    <div id="virtual-keyboard">
      <button v-for="symbol in bopomofo" :key="symbol" @click="appendSymbol(symbol)">{{ symbol }}</button>
      <button @click="backspace">退格</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      inputValue: '',
      bopomofo: ['ㄅ', 'ㄆ', 'ㄇ', 'ㄈ', 'ㄉ', 'ㄊ', 'ㄋ', 'ㄌ', 'ㄍ', 'ㄎ', 'ㄏ', 'ㄐ', 'ㄑ', 'ㄒ', 'ㄓ', 'ㄔ', 'ㄕ', 'ㄖ', 'ㄗ', 'ㄘ', 'ㄙ', 'ㄧ', 'ㄨ', 'ㄩ', 'ㄚ', 'ㄛ', 'ㄜ', 'ㄝ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ', 'ㄦ']
    }
  },
  methods: {
    appendSymbol (symbol) {
      this.inputValue += symbol
    },
    backspace () {
      this.inputValue = this.inputValue.slice(0, -1)
    }
  }
}
</script>

<style>
#virtual-keyboard {
  display: flex;
  flex-wrap: wrap;
  width: 200px;
}

#virtual-keyboard button {
  width: 30px;
  height: 30px;
  margin: 2px;
}
</style>
