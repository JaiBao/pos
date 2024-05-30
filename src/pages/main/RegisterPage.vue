<template>
  <q-tabs v-model="tab" class="bg-dark text-white">
    <q-tab name="manage" label="管理" />
    <q-tab name="register" label="註冊" />
  </q-tabs>
  <div id="sm" class="row w-100 q-pa-md justify-center">
    <q-tab-panels v-model="tab" animated class="w-100">
      <q-tab-panel name="manage" class="w-75">
        <q-table :rows="rows" :columns="columns" row-key="name" class="w-100">
          <template v-slot:body-cell-edit="props">
            <q-td :props="props">
              <q-btn color="primary" label="儲存" @click="save(props.row)" />
            </q-td>
          </template>
          <template v-slot:body-cell-name="props">
            <q-td key="name" :props="props">
              {{ props.row.name }}
              <q-popup-edit
                v-model="props.row.name"
                title="帳號"
                buttons
                persistent
                v-slot="scope"
              >
                <q-input type="number" v-model="scope.value" dense autofocus />
              </q-popup-edit>
            </q-td>
          </template>
          <template v-slot:body-cell-number="props">
            <q-td key="number" :props="props">
              {{ props.row.number }}
              <q-popup-edit
                v-model="props.row.number"
                title="工號"
                buttons
                persistent
                v-slot="scope"
              >
                <q-input type="number" v-model="scope.value" dense autofocus />
              </q-popup-edit>
            </q-td>
          </template>
          <template v-slot:body-cell-depart="props">
            <q-td key="depart" :props="props">
              {{ props.row.depart }}
              <q-popup-edit
                v-model="props.row.depart"
                title="組別"
                buttons
                persistent
                v-slot="scope"
              >
                <q-input type="number" v-model="scope.value" dense autofocus />
              </q-popup-edit>
            </q-td>
          </template>
          <template v-slot:body-cell-permission="props">
            <q-td key="permission" :props="props">
                <q-select
                  type="text"
                  v-model="props.row.permission"
                  dense
                  autofocus
                  use-chips
                  multiple
                  :options="permissionOption"
                  emit-value
                  map-options
                />

            </q-td>
          </template>
          <template v-slot:body-cell-delete="props">
            <q-td key="role" :props="props">
              <q-btn
                @click="deletemem(props.row._id)"
                color="info"
                icon="delete"
              ></q-btn>
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
      <q-tab-panel name="register" class="row w-100 justify-center">
        <div class="col-xs-12 col-md-8 text-center w-75 q-ma-auto" id="regis">
          <h5>註冊</h5>
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md w-100">
            <q-input
              outlined
              type="text"
              v-model="form.name"
              label="帳號"
              lazy-rules
              :rules="[(val) => (val && val.length >= 2) || '請輸入全名']"
            />
            <q-input
              outlined
              type="text"
              v-model="form.number"
              label="工號"
              lazy-rules
              :rules="[(val) => (val && val.length >= 4) || '最少4位數以上']"
            />
            <q-input
              outlined
              type="password"
              v-model="form.password"
              label="密碼"
              lazy-rules
              :rules="[(val) => (val && val.length >= 4) || '最少4位數以上']"
            />
            <q-input
              outlined
              type="text"
              v-model="form.depart"
              label="備註"
              lazy-rules
            />
            <q-select
                  type="text"
                  v-model="form.permission"
                  outlined
                  autofocus
                  use-chips
                  multiple
                  :options="permissionOption"
                  emit-value
                  label="權限"
                  map-options
                />
            <div>
              <q-btn
                label="清除"
                type="reset"
                color="primary"
                flat
                class="q-ml-sm"
              />
              <q-btn label="送出" type="submit" color="primary" />
            </div>
          </q-form>
        </div>
      </q-tab-panel>
      <!-- </q-card> -->
    </q-tab-panels>
  </div>
  <div class="row w-100 justify-center">
    <q-btn
      id="register1"
      label="返回"
      type="button"
      color="secondary"
      to="/"
      size="26px"
      outlined
    />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref, reactive, onMounted } from 'vue'
import { apiShit } from 'src/boot/axios'
// import { useRouter } from 'vue-router'

const rows = ref([])
// const router = useRouter()
const $q = useQuasar()
const tab = ref('manage')
const permissionOption = ref([
  { label: '主畫面', value: 'index' },
  { label: '訂單', value: 'order' },
  { label: '控單', value: 'control' },
  { label: '用戶', value: 'users' },
  { label: '會員', value: 'member' },
  { label: '財務(含發票)', value: 'payment' }
])
const form = reactive({
  name: '',
  number: '',
  password: '',
  depart: '',
  role: '',
  permission: ['index']
})
// const roleoptions = [
//   {
//     label: '用戶',
//     value: 1
//   },
//   {
//     label: '含財務',
//     value: 2
//   },
//   {
//     label: '最高',
//     value: 3
//   }
// ]
const valid = ref(false)
const loading = ref(false)
const get = async () => {
  const { data } = await apiShit.get('/login/find')
  rows.value = data
}
const onSubmit = async () => {
  await apiShit.post('/login/register', form)
  // if (!valid.value) return
  // loading.value = true
  try {
    await $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'check_circle',
      message: '創建成功，請登入'
    })
    // router.push('/')
  } catch (error) {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'error',
      message: error.message || '發生錯誤'
    })
  }
  loading.value = false
}

function onReset () {
  form.name = ''
  form.account = ''
  form.password = ''
  form.phone = ''
  valid.value = false
}

const columns = [
  {
    name: 'name',
    align: 'left',
    label: '名字',
    field: 'name',
    sortable: true
  },
  {
    name: 'number',
    align: 'left',
    label: '工號',
    field: 'number',
    sortable: true
  },
  {
    name: 'depart',
    align: 'left',
    label: '組別',
    field: 'depart',
    sortable: true
  },

  {
    name: 'permission',
    align: 'right',
    label: '權限 ',
    field: 'permission',
    sortable: true
  },
  {
    name: 'edit',
    align: 'center',
    label: '編輯',
    field: 'edit',
    sortable: false
  },
  {
    name: 'delete',
    align: 'right',
    label: 'delete',
    field: 'delete',
    sortable: true
  },
  { name: '_id', align: 'right', label: '_id', field: '_id', sortable: true }
]
const save = async (row) => {
  console.log(row)
  const sentform = {
    name: row.name,
    number: row.number,
    // password: row.password,
    depart: row.depart,
    role: row.role,
    _id: row._id,
    permission: row.permission
  }
  const { data } = await apiShit.post('/login/edit', sentform)
  console.log(data)
  await get()
}
const deletemem = async (id) => {
  const { data } = await apiShit.delete(`/login/delete/${id}`)
  console.log(data)
  await get()
}
onMounted(async () => {
  await get()
})
</script>

<style lang="scss" scoped>
#register1 {
  margin-top: 30px;
  margin-left: 40px;
}
#sm {
  width: 100vw;
  margin-top: 50px;
  .col-md-6 {
    margin: auto;
    padding: 12px;
  }
}
#regis {
  background: #eeeeee;
  padding: 20px;
  border: 5px solid #eeeeee;
  border-radius: 5%;
}
@media screen and (min-width: 768px) {
  #regis {
    background: #eeeeee;
    padding: 20px;
    border: 5px solid #eeeeee;
    border-radius: 5%;
  }
}
</style>
