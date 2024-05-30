<template>
  <div class="slider-verification">
      <div class="slider-bar" @mousedown="startDrag">
          <div class="slider-button" :style="{ left: `${buttonPosition}px` }"></div>
      </div>
      <span class="slider-text">拖動滑塊以驗證</span>
  </div>
  </template>

  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';

  const buttonPosition = ref(0);
  const isDragging = ref(false);
  let sliderBar = null;

  const startDrag = (event) => {
      isDragging.value = true;
      updateButtonPosition(event);
  };

  const updateButtonPosition = (event) => {
      if (!isDragging.value || !sliderBar) return;
      const newLeft = event.clientX - sliderBar.getBoundingClientRect().left - 20; // 20 是滑塊寬度的一半
      buttonPosition.value = Math.max(0, Math.min(newLeft, sliderBar.offsetWidth - 40)); // 40 是滑塊的寬度
  };

  const stopDrag = () => {
      if (!isDragging.value) return;
      isDragging.value = false;
      if (buttonPosition.value >= sliderBar.offsetWidth - 40) {
          console.log('驗證成功');
          buttonPosition.value = 0;
          // 驗證成功的邏輯
      } else {
        console.log('驗證失敗');
          buttonPosition.value = 0; // 重置滑塊
      }
  };

  onMounted(() => {
      sliderBar = document.querySelector('.slider-bar');
      document.addEventListener('mousemove', updateButtonPosition);
      document.addEventListener('mouseup', stopDrag);
  });

  onUnmounted(() => {
      document.removeEventListener('mousemove', updateButtonPosition);
      document.removeEventListener('mouseup', stopDrag);
  });
  </script>
<style lang="scss" scoped>
.slider-verification {
    width: 300px;
    user-select: none;
}

.slider-bar {
    width: 100%;
    height: 40px;
    background-color: #e0e0e0;
    // border-radius: 20px;
    position: relative;
}

.slider-button {
    width: 40px;
    height: 40px;
    background-color: #007bff;
    // border-radius: 20px;
    position: absolute;
    left: 0;
    cursor: pointer;
    transition: left 0.3s;
}

.slider-text {
    text-align: center;
    color: #666;
    margin-top: 10px;
    font-size: 14px;
}

</style>

