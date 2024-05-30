<template>
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md w-100 row justify-center">
        <div class="col q-mt-xxl"></div>
        <div class="col-12 row justify-center items-center">
          <img src="/logo.jpg">
        </div>
        <div class="col-6 row justify-center">
          <q-input
          outlined
          type="text"
          v-model="form.name"
          label="管理者帳號"
          lazy-rules
          class="col-12 input"
          clearable
        clear-icon="close"

        />
        <q-input
          outlined
          :type="isPwd ? 'password' : 'text'"
          v-model="form.password"
          label="管理者密碼"
          lazy-rules
          class="col-12 input"
          clearable
          clear-icon="close"
        >
        <template v-slot:prepend>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
        </q-input>
        <div class="col-12 row  justify-center q-mt-xl">

          <!-- <q-btn label="註冊" color="secondary" to="/register" size="25px" class="btnbtn q-mx-md"/> -->
          <q-btn label="登入" color="primary" @click="login" size="25px" class="btnbtn"/>
        </div>

        </div>

      </q-form>

      <!-- <q-btn
      outline
        class="register1"
        label="未註冊帳號"
        type="button"
        color="primary"
        to="/register"
      /> -->

</template>

<script setup>
// import { useQuasar } from 'quasar'
import { reactive, ref } from 'vue'
import { useUserStore } from 'src/stores/user'
import { useRouter } from 'vue-router'
// import { api } from 'src/boot/axios'

const isPwd = ref(true)
const router = useRouter()
// const $q = useQuasar()
const user = useUserStore()
const formShit = reactive({
  username: 'Hpuser',
  password: 'Hu1314666'
})
const form = reactive({
  name: '',
  password: ''
})
const login = async () => {
  await user.login(formShit)
  await user.loginShit(form)
  if (user.tokens.length !== 0) {
    router.push('/index')
  }
}

if (user.isLogin) {
  router.push('/index')
}

</script>

<style lang="scss" scoped>
.q-mt-xxl{

  margin-top: 200px;
}

.input{
  width: 420px !important;
  margin-top: 70px;
}
.btnbtn{
  width: 150px;
  height: 60px;
}
</style>
