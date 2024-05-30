<template>
  <div>
    <q-table
      :rows="member"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :rows-per-page-options="[10]"
      style="font-size: 22px"
    >
      <template v-slot:top>
        <div class="q-pb-lg toolbar row w-100 items-center">
          <div class="col w-40px text-white q-mx-md q-ml-xl">搜尋</div>
          <!-- <q-btn color="black" icon="question_mark" rounded class="q-mx-md">
            <q-tooltip>
              複製：複製除姓名及手機以外的會員資料
              新訂單：以此會員資料新增一筆訂單
            </q-tooltip>
          </q-btn> -->
          <q-input
            standout="bg-pink-2"
            v-model="filters.filter_payment_company"
            label="公司"
            class="q-mx-xs col inputradius"
          />
          <q-input
            standout="bg-pink-2"
            v-model="filters.filter_name"
            label="姓名"
            class="q-mx-xs col inputradius"
          />
          <q-input
            standout="bg-pink-2"
            v-model="filters.filter_phone"
            label="手機或市話"
            class="q-mx-xs col inputradius"
          />

          <q-input
            outlined
            v-model="filters.filter_payment_tin"
            label="統編"
            class="q-mx-xs col inputradius"
          />
          <q-btn
            round flat
            icon="restart_alt"
            color="white bg-transparent"
            @click="reset()"
            class="q-mx-md"
            size="lg"
          />
          <div class="col"></div>

          <q-btn
            outline
            label="快速新增會員(總部用)"
            color="warning"
            to="member/create"
            style="color: $warning"
            size="lg"
            class="q-mx-md"
          />
          <q-btn
            outline
            label="新增會員"
            color="warning"
            @click="newmemberadd()"
            size="lg"
            class="q-mx-md"
          />
        </div>
      </template>
      <template v-slot:header="props">
        <q-tr>
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            :style="{ 'font-size': '16px' }"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body-cell-payment_company="props">
        <q-td auto-width :props="props">
          {{ truncate(props.row.payment_company, 15) }}
        </q-td>
      </template>
      <template v-slot:body-cell-edit="props">
        <q-td auto-width :props="props">
          <q-fab
            color="warning"
            push
            text-color="black"
            icon="keyboard_arrow_left"
            direction="left"
          >
            <q-btn
              size="lg"
              color="warning"
              text-color="black"
              round
              :to="`/member/${props.row.id}`"
              icon="edit"
            />
            <q-btn
              size="lg"
              color="warning"
              text-color="black"
              icon="content_copy"
              round
              @click="copydetail(props.row)"
            />
          </q-fab>
        </q-td>
      </template>
      <!-- <template v-slot:body-cell-copy="props">
        <q-td auto-width :props="props">

        </q-td>
      </template> -->
      <template v-slot:body-cell-copy="props">
        <q-td auto-width :props="props">
          <q-btn
            size="lg"
            color="accent"
            icon="add"
            round
            dense
            @click="copymember(props.row.id)"
          />
        </q-td>
      </template>
      <template v-slot:bottom>
        <div class="row w-100 justify-end">
          <q-pagination
          v-model="pagination.page"
          :max="pagination.pages"
          :max-pages="6"
          direction-links
          boundary-links
          icon-first="skip_previous"
          icon-last="skip_next"
          icon-prev="fast_rewind"
          icon-next="fast_forward"
          active-color="pink-5"
          color="black"
        />
        </div>

      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, reactive, watchEffect } from 'vue'
import { apiAuth } from 'src/boot/axios'
import { UseMemberStore } from 'src/stores/member.js'
import { UseSearchStore } from 'src/stores/search.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const members = UseMemberStore()
const search = UseSearchStore()
const filter = ref('')
const pagination = reactive({
  page: 1,
  rowsPerPage: 10, // change this to control how many rows you want to display per page
  pages: 10
})

// const membertatus = reactive([
//   { label: '未確認', value: 101 },
//   { label: '已確認', value: 103 },
//   { label: '已確待配', value: 116 },
//   { label: '未結清', value: 117 },
//   { label: '已結案', value: 118 },
//   { label: '作廢', value: 115 }
// ]) // 訂單狀態
const truncate = (string, value) => {
  if (string === null || string === undefined || typeof string !== 'string') {
    return ''
  }
  return string.length > value ? string.substring(0, value) + '...' : string
}
const columns = [
  {
    name: 'id',
    required: true,
    label: '會員編號',
    align: 'left',
    field: 'id',
    style: 'font-size: 18px;'
  },
  {
    name: 'name',
    required: true,
    label: '姓名',
    align: 'left',
    field: 'name',
    style: 'font-size: 22px;'
  },
  {
    name: 'mobile',
    required: true,
    label: '手機',
    align: 'left',
    field: 'mobile',
    style: 'font-size: 22px;'
  },
  {
    name: 'payment_company',
    required: true,
    label: '公司',
    align: 'left',
    field: 'payment_company',
    style: 'font-size: 22px;'
  },
  {
    name: 'ID',
    required: true,
    label: '統編',
    align: 'left',
    field: 'payment_tin',
    style: 'font-size: 22px;'
  },
  {
    name: 'created_at',
    required: true,
    label: '市話',
    align: 'left',
    field: 'telephone',
    style: 'font-size: 22px;'
  },
  // {
  //   name: 'detail',
  //   required: true,
  //   label: '複製',
  //   align: 'left',
  //   field: 'id',
  //   sortable: false,
  //   style: 'font-size: 18px;'
  // },
  {
    name: 'copy',
    required: true,
    label: '新訂單',
    align: 'center',
    field: 'delete',
    sortable: false,
    style: 'font-size: 22px;'
  },
  {
    name: 'edit',
    required: true,
    label: '功能',
    align: 'left',
    field: 'id',
    sortable: false,
    style: 'font-size: 22px;'
  }
]

const member = ref([])

const filters = reactive({
  filter_payment_tin: '',
  filter_name: '',
  filter_phone: '',
  filter_payment_company: ''
})

// function clearFilters () {
async function fetchmember () {
  try {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v != null && v !== '')
    )
    if (cleanedFilters.filter_status_id) {
      cleanedFilters.filter_status_id = cleanedFilters.filter_status_id.value
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
    const response = await apiAuth.get('member/member', {
      params: {
        page: pagination.page,
        ...cleanedFilters
      }
    })
    member.value = response.data.data
    pagination.pages = response.data.last_page
  } catch (error) {
    console.error(error)
  }
}
watchEffect(fetchmember)
// -------------------------------------
async function fetchfirst () {
  try {
    const response = await apiAuth.get('member/member', {
      params: {
        page: pagination.page
      }
    })
    member.value = response.data.data
    pagination.pages = response.data.last_page
  } catch (error) {
    console.error(error)
  }
}
watchEffect(fetchfirst)
// ------------------------------
const copymember = async (val) => {
  console.log(val)
  await members.getmemberdetail(val)
  members.shouldAddPerson = true
  router.push('/Order')
}
const newmemberadd = async () => {
  members.addpersontel(
    filters.filter_phone,
    filters.filter_payment_tin,
    filters.filter_name,
    filters.filter_payment_company,
    filters.filter_telephone
  )
  members.shouldAddPerson = true
  await router.push('/Order')
}
const copydetail = async (val) => {
  console.log(val)
  members.shouldCopyPerson = true
  members.justcopy(
    val.telephone,
    val.payment_tin,
    val.shipping_road,
    val.payment_company,
    val.shipping_address1,
    val.shipping_city_id,
    val.shipping_state_id
  )
  await router.push('/Order')
}
// --------------------------------------------
// 訂單頁跳過來
if (search.shouldSearch === true) {
  setTimeout(() => {
    filters.filter_phone = search.searchPhone
    filters.filter_name = search.searchName
    filters.filter_telephone = search.searchTele
    filters.filter_payment_company = search.searchCompany

    search.shouldSearch = false
  }, 1500)
}
const reset = () => {
  fetchfirst()
  filters.filter_phone = ''
  filters.filter_name = ''
  filters.filter_telephone = ''
  filters.filter_payment_company = ''
}
</script>

<style lang="scss" scoped>
.q-input {
  width: 150px;
}
.w-120px {
  max-width: 200px;
}

.w-40px {
  max-width: 50px !important;
  font-size: 14px;
}
</style>
