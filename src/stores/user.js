import { defineStore } from 'pinia'
import { useQuasar } from 'quasar'
import { ref, computed } from 'vue'
import { apiAuth, apiShit } from 'src/boot/axios' // api,

// import { useRouter } from 'src/router'
export const useUserStore = defineStore(
  'user',
  () => {
    const tokens = ref('')
    const tokenslimit = ref('')
    const name = ref('')
    const isLogin = computed(() => {
      return tokenslimit.value.length > 0
    })
    const role = ref(0)
    const permission = ref(['index'])
    const limit = ref(100)
    const $q = useQuasar()

    const login = async (form) => {
      try {
        const data = await apiAuth.post('/login', form)
        console.log(data)
        tokens.value = data.data.token
        // $q.notify({
        //   color: 'green-4',
        //   textColor: 'white',
        //   icon: 'cloud_done',
        //   message: '登入成功'
        // })
      } catch (error) {
        $q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'info',
          message: '登入失敗'
        })
      }
    }
    const loginShit = async (form) => {
      try {
        const { data } = await apiShit.post('/login/login', form)
        console.log(data)
        tokenslimit.value = data.result.token
        role.value = data.result.role
        name.value = data.result.name
        permission.value = data.result.permission
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
    const logoutShit = async () => {
      try {
        await apiShit.delete('/login/logout')
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
          icon: 'cloud_done',
          message: error.message
        })
      }
      tokenslimit.value = ''
      role.value = 0
      permission.value = ['index']
    }

    return {

      tokens,
      login,
      isLogin,
      limit,
      tokenslimit,
      loginShit,
      role,
      logoutShit,
      name,
      permission
      // logout

    }
  },
  {
    persist: {
      key: 'bingpos',
      paths: ['tokens', 'isLogin', 'limit', 'tokenslimit', 'role', 'permission']
    }
  },
  {}
)
