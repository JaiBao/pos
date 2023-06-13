import { defineStore } from 'pinia'
import { useQuasar } from 'quasar'
import { ref, computed } from 'vue'
import { apiAuth } from 'src/boot/axios' // api,

export const useUserStore = defineStore(
  'user',
  () => {
    const tokens = ref('')
    const isLogin = computed(() => {
      return tokens.value.length > 0
    })

    const $q = useQuasar()
    const login = async (form) => {
      try {
        const data = await apiAuth.post('/login', form)
        tokens.value = data.data.token
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: '登入成功'
        })
      } catch (error) {
        $q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'info',
          message: '登入失敗'
        })
      }
    }
    // router 要改成function
    const logout = async () => {
      try {
        await apiAuth.delete('/users/logout')
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: '登出成功'
        })
      } catch (error) {
        $q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'cloud_off',
          message: error.message
        })
      }
      tokens.value = ''
    }
    return {

      tokens,

      login,
      isLogin,

      logout

    }
  },
  {
    persist: {
      key: '20230201',
      paths: ['tokens']
    }
  },
  {}
)
