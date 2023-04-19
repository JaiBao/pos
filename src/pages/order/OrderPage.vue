<template>
<div class="orderMenucontainer">
  <!-- 聯絡人區 -->
<div class="row person">

    <q-form
    @submit="onSubmit" @reset="onReset"
      class="person-form q-gutter-md row items-start justify-center"
      >
      <table  border="1" cellpadding="5" style="width: 100%;table-layout:fixed;word-break:break-all;background:#f2f2f2">
        <tr >
          <td  >
            <q-input
              outlined
              label="訂購日期"
              :input-style="{ fontSize: '18px' }"
              v-model="personForm.checkDate"
              mask="date"
              readonly
            >
              <template v-slot:append>
                <q-icon name="calendar_today" class="cursor-pointer" style="width: 10px;">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="checkDate" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="確定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

          </td>

          <td >
            <q-select
            outlined
            v-model="personForm.pick"
            label="取貨方式"
            :options="picks"
            :rules="[val => !!val || '請選擇取貨方式']"
            style="padding: 0;font-size: 20px;"
            />
          </td>
          <td >
            <q-input
              outlined
              label="送達日期"
              :input-style="{ fontSize: '18px' }"
              v-model="personForm.getDate"
              mask="date"
              style="padding: 0;"
              :rules="[(val) => (val && val >= personForm.checkDate) || '需大於等於訂購日期']"
            >
              <template v-slot:append>
                <q-icon name="calendar_today" class="cursor-pointer" style="width: 10px;">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="personForm.getDate" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="確定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

          </td>
          <td width="100">
            <q-input v-model="personForm.week"
            outlined
            label="星期"
            :input-style="{ fontSize: '20px' }"
            readonly/>
          </td>
          <td >
            <q-input v-model="personForm.time" outlined type="time" label="送達時間" :input-style="{ fontSize: '17px' }"/>
          </td>

          <td>
            <q-input
            outlined
             v-model="personForm.company"
             type="text"
             label="訂購公司"
             :input-style="{ fontSize: '20px' }"
             style="padding: 0;"/>
          </td>
          <td>
            <q-input
            outlined
             v-model="personForm.compilation"
             type="text"
             label="統編"
             style="padding: 0;"
             :input-style="{ fontSize: '20px' }"
             :rules="[(val) => (val && val.length == 8) || '需為8位數']"/>
          </td>
          <td>
            <q-input
            outlined
             v-model="personForm.getCompany"
             type="text"
             label="送達公司"
             :input-style="{ fontSize: '20px' }" />
          </td>
        </tr>
        <tr>
          <td>
            <q-input
            outlined
            v-model="personForm.name"
            label="訂購人"
            :input-style="{ fontSize: '20px' }"/>
          </td>
          <td>
            <q-input
            outlined
             v-model="personForm.tel"
             type="tel"
             label="訂購人電話"
             :input-style="{ fontSize: '20px' }" />

          </td>
          <td>
            <q-input
            outlined
             v-model="personForm.hometel"
             type="tel"
             label="室內電話"
             :input-style="{ fontSize: '20px' }"/>

          </td>
          <td rowspan="2" colspan="5">
            <div class="row">
              <div class="row"
              style="display: flex;
              align-items: center;">
        <div style="flex: 1;">
        <h5 style="margin: auto;">地址</h5>
        </div>
  <div class="row">

            <q-select

              style="padding: 2px;
              width: 120px;"
              type="text"
              outlined
              v-model="personForm.address"
              label="縣市"
            :options="addresss"
            />
            <q-select

              style="padding: 2px;width: 120px;"
              outlined
              v-model="personForm.address2"
              label="區"
              :options="address2Options"
            />
            <q-input
            style="padding: 2px;width: 490px;"
            id="road"
            outlined
             v-model="personForm.road"
             type="text"
             label="路"
             clearable
             :input-style="{ fontSize: '20px' }"
              />
        <h5 class="row justify-center" style="font-size: 1.2rem; margin: 0 5px;align-items: center;padding: 0;">輔助按鍵</h5>
            <q-btn
            style="padding: 2px;width: 70px;font-size: 20px;border:#000000 1px solid;height: 15px;"
            color="primary"
            @click="run('巷')"
            class="q-mt-md"
             label="巷"/>
             <q-btn
            style="padding: 2px;width: 70px;font-size: 20px;border:#000000 1px solid;height: 15px;"
            color="primary"
            @click="run('弄')"
            class="q-mt-md"
             label="弄"/>
             <q-btn
            style="padding: 2px;width: 70px;font-size: 20px;border:#000000 1px solid;height: 15px;"
            color="primary"
            @click="run('衖')"
            class="q-mt-md"
             label="衖"/>
             <q-btn
            style="padding: 2px;width: 70px;font-size: 20px;border:#000000 1px solid;height: 15px;"
            color="primary"
            @click="run('號')"
            class="q-mt-md"
             label="號"/>
             <q-btn
            style="padding: 2px;width: 70px;font-size: 20px;border:#000000 1px solid;height: 15px;"
            color="primary"
            @click="run('棟')"
            class="q-mt-md"
             label="棟"/>
             <q-btn
            style="padding: 2px;width: 70px;font-size: 20px;border:#000000 1px solid;height: 15px;"
            color="primary"
            @click="run('樓')"
            class="q-mt-md"
             label="樓"/>
             <q-btn
            style="padding: 2px;width: 70px;font-size: 20px;border:#000000 1px solid;height: 15px;"
            color="primary"
            @click="run('大樓')"
            class="q-mt-md"
             label="大樓"/>
             <q-btn
            style="padding: 2px;width: 70px;font-size: 20px;border:#000000 1px solid;height: 15px;"
            color="primary"
            @click="run('房')"
            class="q-mt-md"
             label="房"/>
             <q-btn
            style="padding: 2px;width: 70px;font-size: 20px;border:#000000 1px solid;height: 15px;"
            color="primary"
            @click="run('室')"
            class="q-mt-md"
             label="室"/>

            </div>
          </div>
        </div>
  </td>
        </tr>
        <tr>
          <td colspan="2">
            <q-input
            outlined
             v-model="personForm.email"
             type="email"
             label="電子郵件"
             :input-style="{ fontSize: '20px' }" />

</td>
          <td >
            <div class="row" style="font-size: 20px; display: flex; justify-content: space-around;">
        <div >
      <q-checkbox
      size="xs"
      v-model="personForm.sameOrderCustomer"
      val="xs"
      label="同訂購人"
      />
    </div>
    <div >
      <q-checkbox
      size="xs"
      v-model="personForm.sameOrderCompany"
      val="xs"
      label="同訂購公司"
      />
    </div>
  </div>

          </td>

        </tr>
        <tr>
          <td>
            <q-input
            outlined
            v-model="personForm.recipient"
            type="text"
            label="收件人"
            :input-style="{ fontSize: '20px' }"/>

          </td>
          <td>
            <q-input
            outlined
             v-model="personForm.recipientTel"
             type="tel"
             label="收件人電話"
             :input-style="{ fontSize: '20px' }" />

          </td>
          <td>
            <div class="row" style="font-size: 20px; display: flex; justify-content: space-around;">

              <q-radio
              v-model="personForm.gender"
              val="gentleman"
              label="先生" />
              <q-radio

              v-model="personForm.gender"
              val="lady"
              label="女士" />
            </div>
            </td>

          <td colspan="5">
            <q-input
            outlined
             v-model="personForm.event"
             type="text"
             label="活動事件"
             :input-style="{ fontSize: '20px' }" />

          </td>
        </tr>
        <tr>
          <td colspan="8">
            <div class="row">

              <div class="row justify-start  col-8">
                <q-input
                outlined
                style="width:100%;margin-left: 20px;"
                v-model="personForm.remark"
                type="text"
                label="客戶備註"
                :input-style="{ fontSize: '20px' }"
                @input="showDialog2"
                />

              </div>
              <!-- 客戶備註 -->
              <q-dialog v-model="dialogVisible2" persistent>
      <q-card>
        <q-card-section>
          <q-input
            v-model="searchTerm2"
            placeholder="搜尋..."
            dense
            class="q-mb-md"
          />
          <q-item
            v-for="option2 in filteredOption2s"
            :key="option2"
            clickable
            @click="selectOption2(option2)"
          >
            <q-item-section>
              <q-item-label>{{ option2 }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="取消" color="primary" @click="closeDialog2" />
        </q-card-actions>
      </q-card>
    </q-dialog>
              <div class="row justify-end  col-2">
                <q-select
                outlined
                v-model="personForm.orderStatu"
                label="訂單狀態"
                :options="orderStatus"
                lazy-rules
                :rules="[val => !!val || '請選擇取貨方式']"
                style="padding: 0;width: 100%;font-size: 20px;"
            />
            </div>
              <div class="row justify-end  col-2">
        <q-btn
              label="清除"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
              />
              <q-btn label="送出" type="submit" color="primary"  />
            </div>
          </div>
          </td>
        </tr>

      </table>

  </q-form>

</div>

    <!-- 點單按鈕 -->
    <div class="row menu text-left" data-order-panel>
  <h5>請選擇餐點</h5>
  <q-btn
    @click="openbangdong"
    color="blue"
    >便當</q-btn>

        <q-btn
          color="blue"
          label="盒餐"
          @click="openlunchBox"

        />
        <q-btn
          color="blue"
          label="單點"
          @click="opensolo"

        />
        <q-btn
          color="blue"
          label="客製便當"
          @click="openCustomBangdong"

        />
        <q-btn
          color="blue"
          label="客製盒餐"
          @click="openCustomLunchBox"
        />
        <q-btn
          color="green"
          @click="logout"
          label="加入訂單"

        />

        <!-- 便當dailog -->
        <q-dialog v-model="showbangdong" class="lunchBoxdailog" >
        <q-card class="  items-start " id="dialogbtnCard">
          <!-- 便當按鈕 -->
          <div class="  items-center" id="lunchboxbtn" >
            <q-btn color="blue" label="招牌便當"  @click="showbangdong1 = true; showbangdong=false" />
            <q-btn color="blue" label="雞腿便當"  @click="showbangdong2 = true; showbangdong=false" />
            <q-btn color="blue" label="雞胸便當"  @click="showbangdong3 = true; showbangdong=false" />
            <q-btn color="blue" label="滷牛便當"  @click="showbangdong4 = true; showbangdong=false" />
          </div>
         <div  class="row justify-end q-ma-lg"> <q-btn color="red" label="取消" class="q-mt-md" @click="showbangdong = false" />
          </div>
        </q-card>
      </q-dialog>
      <!-- 招牌便當dialog -->
        <q-dialog v-model="showbangdong1"  >
          <q-card class="q-gutter-md row items-start  word-break " id="bangdongcard">
            <div>
            <h5>主餐</h5>
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              style="width: 130px;"
              v-model="bangdong1Form.bangdong1Vegetable"
              label="鮮蔬(全)"

            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              style="width: 130px;"
              v-model="bangdong1Form.bangdong1Egg"
              label="鮮蔬(蛋)"

            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              style="width: 130px;"
              v-model="bangdong1Form.bangdong1Potato"
              label="薯泥"

            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              style="width: 130px;"
              v-model="bangdong1Form.bangdong1Shrimp"
              label="炸蝦"

            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              style="width: 130px;"
              v-model="bangdong1Form.bangdong1Chicken"
              label="炒雞"

            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              style="width: 130px;"
              v-model="bangdong1Form.bangdong1Fish"
              label="酥魚"

            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              style="width: 130px;"
              v-model="bangdong1Form.bangdong1Pig"
              label="培根"

            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              style="width: 130px;"
              v-model="bangdong1Form.bangdong1Meet"
              label="滷肉"

            />
          </div>
            <div>

            <h5>附餐</h5>
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              style="width: 130px;"
              v-model="bangdong1Form.bangdong1Drumstick"
              label="雞腿"

            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              style="width: 130px;"
              v-model="bangdong1Form.bangdong1Breast"
              label="雞胸"

            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              style="width: 130px;"
              v-model="bangdong1Form.bangdong1Beef"
              label="滷牛"

            />
          </div>

          <div>
            <h5>飲料</h5>
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              style="width: 130px;"
              v-model="bangdong1Form.bangdong1SugarZero"
              label="無豆"

            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              style="width: 130px;"
              v-model="bangdong1Form.bangdong1SugarSome"
              label="微豆"

            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              style="width: 130px;"
              v-model="bangdong1Form.bangdong1BlackTea"
              label="紅茶"

            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              style="width: 130px;"
              v-model="bangdong1Form.bangdong1MilkTea"
              label="奶茶"

            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              style="width: 130px;"
              v-model="bangdong1Form.bangdong1Sweetsoup"
              label="甜湯"

            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              style="width: 130px;"
              v-model="bangdong1Form.bangdong1Soup"
              label="濃湯"

            />
          </div>
          <div>
          <h5>招牌便當</h5>

<q-input
  outlined
  type="number"
  :input-style="{ fontSize: '20px' }"
  style="width: 130px;"
  v-model="bangdong1Form.bangdong1Quantity"
  label="數量總計"
  :rules="[val => !!val || '此欄位為必填']"
  readonly
/>
</div>
  <!-- <div style="width:100%;padding: 0;margin: 0;height: 30px;">
    <h5 style="line-height: 0;">配菜</h5>
  </div>
  <div class="row">
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="bangdong1Form.tomato"
        label="梅汁番茄"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="bangdong1Form.egg"
        label="鹽水煮蛋"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="bangdong1Form.vegetable"
        label="季節時蔬"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="bangdong1Form.fried_mushroom"
        label="酥炸菇菇"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="bangdong1Form.braised_dried"
        label="滷豆干"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="bangdong1Form.oil_rice"
        label="油飯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="bangdong1Form.fried_potato"
        label="炸地瓜"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="bangdong1Form.eggtart"
        label="手工蛋塔"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="bangdong1Form.shortbread"
        label="香蔥酥餅"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="bangdong1Form.chicken_wing"
        label="香滷雞翅"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="bangdong1Form.fruit"
        label="水果"
        style="width: 130px;"
      />

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="bangdong1Form.bake_potato"
        label="烤地瓜"
        style="width: 130px;"
      />
    </div> -->
          <div class="row justify-end" style="width: 100%;">
            <q-btn
              color="primary"
              label="送出"
              type="submit"
              class="q-mt-md"
              @click="submitBandong1Form"
            />
            <q-btn
              color="red"
              label="取消"
              @click="showbangdong1 = false"
              class="q-mt-md"
            />

          </div >

          </q-card>
      </q-dialog>
      <!-- 雞腿便當dailog -->
      <q-dialog v-model="showbangdong2"  >
  <q-card class="q-gutter-md row items-start  word-break " id="bangdongcard">
    <div>
    <h5>主餐</h5>
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong2Form.bangdong1Vegetable"
      label="鮮蔬(全)"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong2Form.bangdong1Egg"
      label="鮮蔬(蛋)"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong2Form.bangdong1Potato"
      label="薯泥"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong2Form.bangdong1Shrimp"
      label="炸蝦"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong2Form.bangdong1Chicken"
      label="炒雞"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong2Form.bangdong1Fish"
      label="酥魚"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong2Form.bangdong1Pig"
      label="培根"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong2Form.bangdong1Meet"
      label="滷肉"

    />
  </div>
    <div>

    <h5>附餐</h5>
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong2Form.bangdong1Drumstick"
      label="雞腿"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong2Form.bangdong1Breast"
      label="雞胸"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong2Form.bangdong1Beef"
      label="滷牛"

    />
  </div>

  <div>
    <h5>飲料</h5>
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong2Form.bangdong1SugarZero"
      label="無豆"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong2Form.bangdong1SugarSome"
      label="微豆"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong2Form.bangdong1BlackTea"
      label="紅茶"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong2Form.bangdong1MilkTea"
      label="奶茶"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong2Form.bangdong1Sweetsoup"
      label="甜湯"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong2Form.bangdong1Soup"
      label="濃湯"

    />
  </div>
  <div>
  <h5>雞腿便當</h5>

<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="bangdong2Form.bangdong1Quantity"
label="數量總計"
:rules="[val => !!val || '此欄位為必填']"
readonly
/>
</div>
<!-- <div style="width:100%;padding: 0;margin: 0;height: 30px;">
<h5 style="line-height: 0;">配菜</h5>
</div>
<div class="row">
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong2Form.tomato"
label="梅汁番茄"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong2Form.egg"
label="鹽水煮蛋"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong2Form.vegetable"
label="季節時蔬"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong2Form.fried_mushroom"
label="酥炸菇菇"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong2Form.braised_dried"
label="滷豆干"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong2Form.oil_rice"
label="油飯"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong2Form.fried_potato"
label="炸地瓜"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong2Form.eggtart"
label="手工蛋塔"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong2Form.shortbread"
label="香蔥酥餅"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong2Form.chicken_wing"
label="香滷雞翅"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong2Form.fruit"
label="水果"
style="width: 130px;"
/>

<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong2Form.bake_potato"
label="烤地瓜"
style="width: 130px;"
/>
</div> -->
  <div class="row justify-end" style="width: 100%;">
    <q-btn
      color="primary"
      label="送出"
      type="submit"
      class="q-mt-md"
      @click="submitForm"
    />
    <q-btn
      color="red"
      label="取消"
      @click="showbangdong2 = false"
      class="q-mt-md"
    />

  </div >

  </q-card>
</q-dialog>
      <!-- 雞胸便當dailog -->
      <q-dialog v-model="showbangdong3"  >
  <q-card class="q-gutter-md row items-start  word-break " id="bangdongcard">
    <div>
    <h5>主餐</h5>
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong3Form.bangdong1Vegetable"
      label="鮮蔬(全)"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong3Form.bangdong1Egg"
      label="鮮蔬(蛋)"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong3Form.bangdong1Potato"
      label="薯泥"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong3Form.bangdong1Shrimp"
      label="炸蝦"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong3Form.bangdong1Chicken"
      label="炒雞"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong3Form.bangdong1Fish"
      label="酥魚"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong3Form.bangdong1Pig"
      label="培根"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong3Form.bangdong1Meet"
      label="滷肉"

    />
  </div>
    <div>

    <h5>附餐</h5>
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong3Form.bangdong1Drumstick"
      label="雞腿"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong3Form.bangdong1Breast"
      label="雞胸"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong3Form.bangdong1Beef"
      label="滷牛"

    />
  </div>

  <div>
    <h5>飲料</h5>
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong3Form.bangdong1SugarZero"
      label="無豆"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong3Form.bangdong1SugarSome"
      label="微豆"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong3Form.bangdong1BlackTea"
      label="紅茶"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong3Form.bangdong1MilkTea"
      label="奶茶"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong3Form.bangdong1Sweetsoup"
      label="甜湯"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong3Form.bangdong1Soup"
      label="濃湯"

    />
  </div>
  <div>
  <h5>雞胸便當</h5>

<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="bangdong3Form.bangdong1Quantity"
label="數量總計"
:rules="[val => !!val || '此欄位為必填']"
readonly
/>
</div>
<!-- <div style="width:100%;padding: 0;margin: 0;height: 30px;">
<h5 style="line-height: 0;">配菜</h5>
</div>
<div class="row">
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong3Form.tomato"
label="梅汁番茄"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong3Form.egg"
label="鹽水煮蛋"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong3Form.vegetable"
label="季節時蔬"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong3Form.fried_mushroom"
label="酥炸菇菇"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong3Form.braised_dried"
label="滷豆干"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong3Form.oil_rice"
label="油飯"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong3Form.fried_potato"
label="炸地瓜"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong3Form.eggtart"
label="手工蛋塔"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong3Form.shortbread"
label="香蔥酥餅"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong3Form.chicken_wing"
label="香滷雞翅"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong3Form.fruit"
label="水果"
style="width: 130px;"
/>

<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong3Form.bake_potato"
label="烤地瓜"
style="width: 130px;"
/>
</div> -->
  <div class="row justify-end" style="width: 100%;">
    <q-btn
      color="primary"
      label="送出"
      type="submit"
      class="q-mt-md"
      @click="submitForm"
    />
    <q-btn
      color="red"
      label="取消"
      @click="showbangdong3 = false"
      class="q-mt-md"
    />

  </div >

  </q-card>
</q-dialog>
       <!-- 滷牛便當dailog -->
       <q-dialog v-model="showbangdong4"  >
  <q-card class="q-gutter-md row items-start  word-break " id="bangdongcard">
    <div>
    <h5>主餐</h5>
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong4Form.bangdong1Vegetable"
      label="鮮蔬(全)"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong4Form.bangdong1Egg"
      label="鮮蔬(蛋)"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong4Form.bangdong1Potato"
      label="薯泥"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong4Form.bangdong1Shrimp"
      label="炸蝦"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong4Form.bangdong1Chicken"
      label="炒雞"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong4Form.bangdong1Fish"
      label="酥魚"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong4Form.bangdong1Pig"
      label="培根"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong4Form.bangdong1Meet"
      label="滷肉"

    />
  </div>
    <div>

    <h5>附餐</h5>
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong4Form.bangdong1Drumstick"
      label="雞腿"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong4Form.bangdong1Breast"
      label="雞胸"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong4Form.bangdong1Beef"
      label="滷牛"

    />
  </div>

  <div>
    <h5>飲料</h5>
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong4Form.bangdong1SugarZero"
      label="無豆"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong4Form.bangdong1SugarSome"
      label="微豆"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong4Form.bangdong1BlackTea"
      label="紅茶"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong4Form.bangdong1MilkTea"
      label="奶茶"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong4Form.bangdong1Sweetsoup"
      label="甜湯"

    />
    <q-input
      outlined
      type="number"
      :input-style="{ fontSize: '20px' }"
      style="width: 130px;"
      v-model="bangdong4Form.bangdong1Soup"
      label="濃湯"

    />
  </div>
  <div>
  <h5>滷牛便當</h5>

<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="bangdong4Form.bangdong1Quantity"
label="數量總計"
:rules="[val => !!val || '此欄位為必填']"
readonly
/>
</div>
<!-- <div style="width:100%;padding: 0;margin: 0;height: 30px;">
<h5 style="line-height: 0;">配菜</h5>
</div>
<div class="row">
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong4Form.tomato"
label="梅汁番茄"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong4Form.egg"
label="鹽水煮蛋"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong4Form.vegetable"
label="季節時蔬"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong4Form.fried_mushroom"
label="酥炸菇菇"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong4Form.braised_dried"
label="滷豆干"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong4Form.oil_rice"
label="油飯"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong4Form.fried_potato"
label="炸地瓜"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong4Form.eggtart"
label="手工蛋塔"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong4Form.shortbread"
label="香蔥酥餅"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong4Form.chicken_wing"
label="香滷雞翅"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong4Form.fruit"
label="水果"
style="width: 130px;"
/>

<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="bangdong4Form.bake_potato"
label="烤地瓜"
style="width: 130px;"
/>
</div> -->
  <div class="row justify-end" style="width: 100%;">
    <q-btn
      color="primary"
      label="送出"
      type="submit"
      class="q-mt-md"
      @click="submitForm"
    />
    <q-btn
      color="red"
      label="取消"
      @click="showbangdong4 = false"
      class="q-mt-md"
    />

  </div >

  </q-card>
</q-dialog>
      <!-- 盒餐dailog -->
      <q-dialog v-model="showlunchBox" class="lunchBoxdailog" >
  <q-card class="  items-start " id="dialogbtnCard">
    <!-- 盒餐按鈕 -->
    <div class="col  items-center" id="lunchboxbtn" >
      <q-btn color="blue" label="經濟盒餐"  @click="showlunchBox1 = true; showlunchBox=false" />
      <q-btn color="blue" label="會議盒餐"  @click="showlunchBox2 = true; showlunchBox=false" />
      <q-btn color="blue" label="貴賓盒餐"  @click="showlunchBox3 = true; showlunchBox=false" />
      <q-btn color="blue" label="首席盒餐"  @click="showlunchBox4 = true; showlunchBox=false" />
    </div>
   <div  class="row justify-end q-ma-lg"> <q-btn color="red" label="取消" class="q-mt-md" @click="showlunchBox = false" />
    </div>
  </q-card>
</q-dialog>

      <!-- 經濟盒餐dailog -->
      <q-dialog v-model="showlunchBox1"   full-width >
        <q-card >
          <div class="q-gutter-xs row items-start justify-center" id="lunchbox">

          <div >
              <h5>全素薯泥</h5>

            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.vegetablePotato"
              label="數量"
              :rules="[val => !!val || '此欄位為必填']"
              style="width: 130px;"
            />

            <h>飲料</h>
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.vegetablePotato_sugarZero"
              label="無豆"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.vegetablePotato_sugarSome"
              label="微豆"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.vegetablePotato_blackTea"
              label="紅茶"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.vegetablePotato_milkTea"
              label="奶茶"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.vegetablePotato_sweetsoup"
              label="甜湯"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.vegetablePotato_soup"
              label="濃湯"
              style="width: 130px;"
            />
          </div>
          <div>
              <h5>蛋素薯泥</h5>

            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.eggPotato"
              label="數量"
              :rules="[val => !!val || '此欄位為必填']"
              style="width: 130px;"
            />

            <h>飲料</h>
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.eggPotato_sugarZero"
              label="無豆"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.eggPotato_sugarSome"
              label="微豆"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.eggPotato_blackTea"
              label="紅茶"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.eggPotato_milkTea"
              label="奶茶"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.eggPotato_sweetsoup"
              label="甜湯"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.eggPotato_soup"
              label="濃湯"
              style="width: 130px;"
            />
          </div>
          <div>
              <h5>薯泥</h5>

            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.potato"
              label="數量"
              :rules="[val => !!val || '此欄位為必填']"
              style="width: 130px;"

            />

            <h>飲料</h>
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.potato_sugarZero"
              label="無豆"
              style="width: 130px;"

            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.potato_sugarSome"
              label="微豆"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.potato_blackTea"
              label="紅茶"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.potato_milkTea"
              label="奶茶"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.potato_sweetsoup"
              label="甜湯"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.potato_soup"
              label="濃湯"
              style="width: 130px;"
            />
          </div>
          <div>
              <h5>炸蝦</h5>

            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.shrimp"
              label="數量"
              :rules="[val => !!val || '此欄位為必填']"
              style="width: 130px;"
            />

            <h>飲料</h>
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.shrimp_sugarZero"
              label="無豆"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.shrimp_sugarSome"
              label="微豆"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.shrimp_blackTea"
              label="紅茶"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.shrimp_milkTea"
              label="奶茶"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.shrimp_sweetsoup"
              label="甜湯"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.shrimp_soup"
              label="濃湯"
              style="width: 130px;"
            />
          </div>
          <div>
              <h5>炒雞</h5>

            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.chicken"
              label="數量"
              :rules="[val => !!val || '此欄位為必填']"
              style="width: 130px;"
            />

            <h>飲料</h>
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.chicken_sugarZero"
              label="無豆"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.chicken_sugarSome"
              label="微豆"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.chicken_blackTea"
              label="紅茶"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.chicken_milkTea"
              label="奶茶"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.chicken_sweetsoup"
              label="甜湯"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.chicken_soup"
              label="濃湯"
              style="width: 130px;"
            />
          </div>
          <div>
              <h5>酥魚</h5>

            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.fish"
              label="數量"
              :rules="[val => !!val || '此欄位為必填']"
              style="width: 130px;"
            />

            <h>飲料</h>
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.fish_sugarZero"
              label="無豆"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.fish_sugarSome"
              label="微豆"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.fish_blackTea"
              label="紅茶"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.fish_milkTea"
              label="奶茶"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.fish_sweetsoup"
              label="甜湯"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.fish_soup"
              label="濃湯"
              style="width: 130px;"
            />
          </div>
          <div>
              <h5>培根</h5>

            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.pig"
              label="數量"
              :rules="[val => !!val || '此欄位為必填']"
              style="width: 130px;"
            />

            <h>飲料</h>
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.pig_sugarZero"
              label="無豆"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.pig_sugarSome"
              label="微豆"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.pig_blackTea"
              label="紅茶"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.pig_milkTea"
              label="奶茶"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.pig_sweetsoup"
              label="甜湯"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.pig_soup"
              label="濃湯"
              style="width: 130px;"
            />
          </div>
          <div>
              <h5>滷肉</h5>

            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.meet"
              label="數量"
              :rules="[val => !!val || '此欄位為必填']"
              style="width: 130px;"
            />

            <h>飲料</h>
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.meet_sugarZero"
              label="無豆"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.meet_sugarSome"
              label="微豆"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.meet_blackTea"
              label="紅茶"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.meet_milkTea"
              label="奶茶"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.meet_sweetsoup"
              label="甜湯"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.meet_soup"
              label="濃湯"
              style="width: 130px;"
            />
          </div>

          <div class="row q-mr-lg q-mb-auto justify-center flex-wrap" style="width: 100%; gap: 16px; ">
            <h>配菜</h>
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.fried_potato"
              label="炸地瓜"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.eggtart"
              label="手工蛋塔"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.shortbread"
              label="香蔥酥餅"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.chicken_wing"
              label="香滷雞翅"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.fruit"
              label="水果"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.fried_mushroom"
              label="酥炸菇菇"
              style="width: 130px;"
            />
            <q-input
              outlined
              type="number"
              :input-style="{ fontSize: '20px' }"
              v-model="lunchbox1Form.bake_potato"
              label="烤地瓜"
              style="width: 130px;"
            />

          </div>

          <div class="row justify-end" style="width: 100%;">

            <q-btn
            color="primary"
            label="送出"
            type="submit"
            class="q-mt-md"
            @click="submitForm"
            />
            <q-btn
            color="red"
            label="取消"
            @click="showlunchBox1 = false"
            class="q-mt-md"
            />
          </div>
        </div>

</q-card>
    </q-dialog>

    <!-- 會議盒餐dailog -->
    <q-dialog v-model="showlunchBox2"   full-width >
  <q-card >
    <div class="q-gutter-xs row items-start justify-center" id="lunchbox">

    <div >
        <h5>全素薯泥</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.vegetablePotato"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"
      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.vegetablePotato_sugarZero"
        label="無豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.vegetablePotato_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.vegetablePotato_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.vegetablePotato_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.vegetablePotato_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.vegetablePotato_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>
    <div>
        <h5>蛋素薯泥</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.eggPotato"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"
      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.eggPotato_sugarZero"
        label="無豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.eggPotato_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.eggPotato_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.eggPotato_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.eggPotato_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.eggPotato_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>
    <div>
        <h5>薯泥</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.potato"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"

      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.potato_sugarZero"
        label="無豆"
        style="width: 130px;"

      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.potato_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.potato_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.potato_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.potato_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.potato_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>
    <div>
        <h5>炸蝦</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.shrimp"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"
      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.shrimp_sugarZero"
        label="無豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.shrimp_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.shrimp_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.shrimp_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.shrimp_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.shrimp_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>
    <div>
        <h5>炒雞</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.chicken"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"
      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.chicken_sugarZero"
        label="無豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.chicken_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.chicken_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.chicken_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.chicken_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.chicken_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>
    <div>
        <h5>酥魚</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.fish"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"
      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.fish_sugarZero"
        label="無豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.fish_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.fish_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.fish_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.fish_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.fish_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>
    <div>
        <h5>培根</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.pig"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"
      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.pig_sugarZero"
        label="無豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.pig_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.pig_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.pig_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.pig_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.pig_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>
    <div>
        <h5>滷肉</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.meet"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"
      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.meet_sugarZero"
        label="無豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.meet_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.meet_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.meet_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.meet_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.meet_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>

    <div class="row q-mr-lg q-mb-auto justify-center flex-wrap" style="width: 100%; gap: 16px; ">
      <h>配菜</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.fried_potato"
        label="炸地瓜"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.eggtart"
        label="手工蛋塔"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.shortbread"
        label="香蔥酥餅"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.chicken_wing"
        label="香滷雞翅"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.fruit"
        label="水果"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.fried_mushroom"
        label="酥炸菇菇"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox2Form.bake_potato"
        label="烤地瓜"
        style="width: 130px;"
      />

    </div>

    <div class="row justify-end" style="width: 100%;">

      <q-btn
      color="primary"
      label="送出"
      type="submit"
      class="q-mt-md"
      @click="submitForm"
      />
      <q-btn
      color="red"
      label="取消"
      @click="showlunchBox2 = false"
      class="q-mt-md"
      />
    </div>
  </div>

</q-card>
    </q-dialog>
        <!-- 貴賓盒餐dailog -->
        <q-dialog v-model="showlunchBox3"   full-width >
  <q-card >
    <div class="q-gutter-xs row items-start justify-center" id="lunchbox">

    <div >
        <h5>全素薯泥</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.vegetablePotato"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"
      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.vegetablePotato_sugarZero"
        label="無豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.vegetablePotato_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.vegetablePotato_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.vegetablePotato_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.vegetablePotato_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.vegetablePotato_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>
    <div>
        <h5>蛋素薯泥</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.eggPotato"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"
      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.eggPotato_sugarZero"
        label="無豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.eggPotato_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.eggPotato_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.eggPotato_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.eggPotato_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.eggPotato_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>
    <div>
        <h5>薯泥</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.potato"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"

      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.potato_sugarZero"
        label="無豆"
        style="width: 130px;"

      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.potato_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.potato_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.potato_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.potato_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.potato_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>
    <div>
        <h5>炸蝦</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.shrimp"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"
      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.shrimp_sugarZero"
        label="無豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.shrimp_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.shrimp_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.shrimp_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.shrimp_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.shrimp_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>
    <div>
        <h5>炒雞</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.chicken"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"
      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.chicken_sugarZero"
        label="無豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.chicken_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.chicken_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.chicken_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.chicken_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.chicken_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>
    <div>
        <h5>酥魚</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.fish"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"
      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.fish_sugarZero"
        label="無豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.fish_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.fish_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.fish_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.fish_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.fish_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>
    <div>
        <h5>培根</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.pig"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"
      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.pig_sugarZero"
        label="無豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.pig_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.pig_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.pig_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.pig_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.pig_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>
    <div>
        <h5>滷肉</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.meet"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"
      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.meet_sugarZero"
        label="無豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.meet_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.meet_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.meet_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.meet_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.meet_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>

    <div class="row q-mr-lg q-mb-auto justify-center flex-wrap" style="width: 100%; gap: 16px; ">
      <h>配菜</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.fried_potato"
        label="炸地瓜"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.eggtart"
        label="手工蛋塔"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.shortbread"
        label="香蔥酥餅"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.chicken_wing"
        label="香滷雞翅"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.fruit"
        label="水果"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.fried_mushroom"
        label="酥炸菇菇"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox3Form.bake_potato"
        label="烤地瓜"
        style="width: 130px;"
      />

    </div>

    <div class="row justify-end" style="width: 100%;">

      <q-btn
      color="primary"
      label="送出"
      type="submit"
      class="q-mt-md"
      @click="submitForm"
      />
      <q-btn
      color="red"
      label="取消"
      @click="showlunchBox3 = false"
      class="q-mt-md"
      />
    </div>
  </div>

</q-card>
        </q-dialog>
            <!-- 首席盒餐dailog -->
            <q-dialog v-model="showlunchBox4"   full-width >
  <q-card >
    <div class="q-gutter-xs row items-start justify-center" id="lunchbox">

    <div >
        <h5>全素薯泥</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.vegetablePotato"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"
      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.vegetablePotato_sugarZero"
        label="無豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.vegetablePotato_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.vegetablePotato_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.vegetablePotato_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.vegetablePotato_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.vegetablePotato_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>
    <div>
        <h5>蛋素薯泥</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.eggPotato"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"
      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.eggPotato_sugarZero"
        label="無豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.eggPotato_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.eggPotato_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.eggPotato_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.eggPotato_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.eggPotato_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>
    <div>
        <h5>薯泥</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.potato"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"

      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.potato_sugarZero"
        label="無豆"
        style="width: 130px;"

      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.potato_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.potato_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.potato_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.potato_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.potato_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>
    <div>
        <h5>炸蝦</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.shrimp"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"
      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.shrimp_sugarZero"
        label="無豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.shrimp_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.shrimp_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.shrimp_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.shrimp_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.shrimp_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>
    <div>
        <h5>炒雞</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.chicken"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"
      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.chicken_sugarZero"
        label="無豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.chicken_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.chicken_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.chicken_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.chicken_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.chicken_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>
    <div>
        <h5>酥魚</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.fish"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"
      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.fish_sugarZero"
        label="無豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.fish_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.fish_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.fish_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.fish_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.fish_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>
    <div>
        <h5>培根</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.pig"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"
      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.pig_sugarZero"
        label="無豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.pig_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.pig_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.pig_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.pig_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.pig_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>
    <div>
        <h5>滷肉</h5>

      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.meet"
        label="數量"
        :rules="[val => !!val || '此欄位為必填']"
        style="width: 130px;"
      />

      <h>飲料</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.meet_sugarZero"
        label="無豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.meet_sugarSome"
        label="微豆"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.meet_blackTea"
        label="紅茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.meet_milkTea"
        label="奶茶"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.meet_sweetsoup"
        label="甜湯"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.meet_soup"
        label="濃湯"
        style="width: 130px;"
      />
    </div>

    <div class="row q-mr-lg q-mb-auto justify-center flex-wrap" style="width: 100%; gap: 16px; ">
      <h>配菜</h>
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.fried_potato"
        label="炸地瓜"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.eggtart"
        label="手工蛋塔"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.shortbread"
        label="香蔥酥餅"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.chicken_wing"
        label="香滷雞翅"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.fruit"
        label="水果"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.fried_mushroom"
        label="酥炸菇菇"
        style="width: 130px;"
      />
      <q-input
        outlined
        type="number"
        :input-style="{ fontSize: '20px' }"
        v-model="lunchbox4Form.bake_potato"
        label="烤地瓜"
        style="width: 130px;"
      />

    </div>

    <div class="row justify-end" style="width: 100%;">

      <q-btn
      color="primary"
      label="送出"
      type="submit"
      class="q-mt-md"
      @click="submitForm"
      />
      <q-btn
      color="red"
      label="取消"
      @click="showlunchBox4 = false"
      class="q-mt-md"
      />
    </div>
  </div>

</q-card>
          </q-dialog>

        <!-- 單點dailog -->

      <q-dialog v-model="showsolo" >
        <q-card class="q-gutter-md row items-start  word-break " id="solocard" >
            <div >
              <h5>6吋潤餅</h5>

            <q-input
              outlined
              v-model="soloForm.vegetablePotato"
              type="number"
              label="全素薯"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.eggPotato"
              label="蛋素薯"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.Potato"
              label="薯泥"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.shrimp"
              label="炸蝦"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.chicken"
              label="炒雞"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.fish"
              label="酥魚"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.pig"
              label="培根"
              type="number"
              style="width: 130px;"
            />

          </div>
            <div>
              <h5>3吋潤餅</h5>

            <q-input
              outlined
              v-model="soloForm.vegetablePotatoHalf"
              label="全素薯"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.eggPotatoHalf"
              label="蛋素薯"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.PotatoHalf"
              label="薯泥"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.shrimpHalf"
              label="炸蝦"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.chickenHalf"
              label="炒雞"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.fishHalf"
              label="酥魚"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.pigHalf"
              label="培根"
              type="number"
              style="width: 130px;"
            />

          </div>

            <div>
              <h5></h5>

          </div>
          <div>
            <h5>飲料</h5>
            <q-input
              outlined
              v-model="soloForm.sugarZero"
              label="無豆"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.sugarSome"
              label="微豆"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.blackTea"
              label="紅茶"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.milkTea"
              label="奶茶"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.sweetsoup"
              label="甜湯"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.soup"
              label="濃湯"
              type="number"
              style="width: 130px;"
            />
          </div>
          <div style="word-break: break-all;">
            <h5>環保袋</h5>
            <q-input
              outlined
              v-model="soloForm.smallBag"
              label="環保袋(小)"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.bigBag"
              label="環保袋(大)"
              type="number"
              style="width: 130px;"
            />
            </div>
            <h5 style="width: 100%;">配菜</h5>
            <q-input
              outlined
              v-model="soloForm.tomato"
              label="梅汁番茄"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.egg"
              label="鹽水煮蛋"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.vegetable"
              label=" 蒜香時蔬"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.fried_mushroom"
              label="酥炸菇菇"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.braised_dried"
              label="香滷豆干"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.oil_rice"
              label="香菇油飯"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.fried_potato"
              label="炸地瓜"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.eggtart"
              label="手作蛋塔"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.shortbread"
              label="香蔥酥餅"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.chicken_wing"
              label="香滷雞翅"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.fruit"
              label="水果"
              type="number"
              style="width: 130px;"
            />
            <q-input
              outlined
              v-model="soloForm.bake_potato"
              label="水果"
              type="number"
              style="width: 130px;"
            />

          <div class="row justify-end" style="width: 100%;">
            <q-btn
              color="primary"
              label="送出"
              type="submit"
              class="q-mt-md"
              @click="submitForm"
            />
            <q-btn
              color="red"
              label="取消"
              @click="showsolo = false"
              class="q-mt-md"
            />
          </div >

          </q-card>
      </q-dialog>

              <!-- 客製便當dailog -->
              <q-dialog v-model="showCustomBangdong" class="lunchBoxdailog" >
        <q-card class="  items-start " id="dialogbtnCard">
          <!-- 客製便當按鈕 -->
          <div class="  items-center" id="lunchboxbtn" >
            <q-btn color="blue" label="招牌便當"  @click="showCustomBangdong1 = true; showCustomBangdong=false" />
            <q-btn color="blue" label="雞腿便當"  @click="showCustomBangdong2 = true; showCustomBangdong=false" />
            <q-btn color="blue" label="雞胸便當"  @click="showCustomBangdong3 = true; showCustomBangdong=false" />
            <q-btn color="blue" label="滷牛便當"  @click="showCustomBangdong4 = true; showCustomBangdong=false" />
          </div>
         <div  class="row justify-end q-ma-lg"> <q-btn color="red" label="取消" class="q-mt-md" @click="showCustomBangdong = false" />
          </div>
        </q-card>
      </q-dialog>
      <!-- 客製招牌便當dialog -->
        <q-dialog v-model="showCustomBangdong1"  >
          <q-card class="q-gutter-md row items-start  word-break " id="customBangdongcard">
  <div>
  <h5>主餐</h5>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    style="width: 130px;"
    v-model="customBangdong1Form.bangdong1Vegetable"
    label="鮮蔬(全)"

  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    style="width: 130px;"
    v-model="customBangdong1Form.bangdong1Egg"
    label="鮮蔬(蛋)"

  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    style="width: 130px;"
    v-model="customBangdong1Form.bangdong1Potato"
    label="薯泥"

  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    style="width: 130px;"
    v-model="customBangdong1Form.bangdong1Shrimp"
    label="炸蝦"

  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    style="width: 130px;"
    v-model="customBangdong1Form.bangdong1Chicken"
    label="炒雞"

  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    style="width: 130px;"
    v-model="customBangdong1Form.bangdong1Fish"
    label="酥魚"

  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    style="width: 130px;"
    v-model="customBangdong1Form.bangdong1Pig"
    label="培根"

  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    style="width: 130px;"
    v-model="customBangdong1Form.bangdong1Meet"
    label="滷肉"

  />
</div>
  <div>

  <h5>附餐</h5>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    style="width: 130px;"
    v-model="customBangdong1Form.bangdong1Drumstick"
    label="雞腿"

  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    style="width: 130px;"
    v-model="customBangdong1Form.bangdong1Breast"
    label="雞胸"

  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    style="width: 130px;"
    v-model="customBangdong1Form.bangdong1Beef"
    label="滷牛"

  />
</div>

<div>
  <h5>飲料</h5>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    style="width: 130px;"
    v-model="customBangdong1Form.bangdong1SugarZero"
    label="無豆"

  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    style="width: 130px;"
    v-model="customBangdong1Form.bangdong1SugarSome"
    label="微豆"

  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    style="width: 130px;"
    v-model="customBangdong1Form.bangdong1BlackTea"
    label="紅茶"

  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    style="width: 130px;"
    v-model="customBangdong1Form.bangdong1MilkTea"
    label="奶茶"

  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    style="width: 130px;"
    v-model="customBangdong1Form.bangdong1Sweetsoup"
    label="甜湯"

  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    style="width: 130px;"
    v-model="customBangdong1Form.bangdong1Soup"
    label="濃湯"

  />
</div>
<div>
<h5>招牌便當</h5>

<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong1Form.bangdong1Quantity"
label="數量總計"
:rules="[val => !!val || '此欄位為必填']"
readonly
/>
</div>
<div style="width:100%;padding: 0;margin: 0;height: 30px;">
<h5 style="line-height: 0;">配菜</h5>
</div>
<div class="row">
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong1Form.tomato"
label="梅汁番茄"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong1Form.egg"
label="鹽水煮蛋"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong1Form.vegetable"
label="季節時蔬"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong1Form.fried_mushroom"
label="酥炸菇菇"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong1Form.braised_dried"
label="滷豆干"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong1Form.oil_rice"
label="油飯"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong1Form.fried_potato"
label="炸地瓜"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong1Form.eggtart"
label="手工蛋塔"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong1Form.shortbread"
label="香蔥酥餅"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong1Form.chicken_wing"
label="香滷雞翅"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong1Form.fruit"
label="水果"
style="width: 130px;"
/>

<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong1Form.bake_potato"
label="烤地瓜"
style="width: 130px;"
/>
</div>
<div class="row justify-end" style="width: 100%;">
  <q-btn
    color="primary"
    label="送出"
    type="submit"
    class="q-mt-md"
    @click="submitForm"
  />
  <q-btn
    color="red"
    label="取消"
    @click="showCustomBangdong1 = false"
    class="q-mt-md"
  />

</div >

</q-card>
      </q-dialog>
      <!-- 客製雞腿便當dailog -->
      <q-dialog v-model="showCustomBangdong2"  >
  <q-card class="q-gutter-md row items-start  word-break " id="customBangdongcard">
<div>
<h5>主餐</h5>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong2Form.bangdong1Vegetable"
label="鮮蔬(全)"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong2Form.bangdong1Egg"
label="鮮蔬(蛋)"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong2Form.bangdong1Potato"
label="薯泥"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong2Form.bangdong1Shrimp"
label="炸蝦"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong2Form.bangdong1Chicken"
label="炒雞"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong2Form.bangdong1Fish"
label="酥魚"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong2Form.bangdong1Pig"
label="培根"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong2Form.bangdong1Meet"
label="滷肉"

/>
</div>
<div>

<h5>附餐</h5>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong2Form.bangdong1Drumstick"
label="雞腿"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong2Form.bangdong1Breast"
label="雞胸"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong2Form.bangdong1Beef"
label="滷牛"

/>
</div>

<div>
<h5>飲料</h5>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong2Form.bangdong1SugarZero"
label="無豆"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong2Form.bangdong1SugarSome"
label="微豆"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong2Form.bangdong1BlackTea"
label="紅茶"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong2Form.bangdong1MilkTea"
label="奶茶"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong2Form.bangdong1Sweetsoup"
label="甜湯"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong2Form.bangdong1Soup"
label="濃湯"

/>
</div>
<div>
<h5>雞腿便當</h5>

<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong2Form.bangdong1Quantity"
label="數量總計"
:rules="[val => !!val || '此欄位為必填']"
readonly
/>
</div>
<div style="width:100%;padding: 0;margin: 0;height: 30px;">
<h5 style="line-height: 0;">配菜</h5>
</div>
<div class="row">
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong2Form.tomato"
label="梅汁番茄"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong2Form.egg"
label="鹽水煮蛋"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong2Form.vegetable"
label="季節時蔬"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong2Form.fried_mushroom"
label="酥炸菇菇"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong2Form.braised_dried"
label="滷豆干"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong2Form.oil_rice"
label="油飯"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong2Form.fried_potato"
label="炸地瓜"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong2Form.eggtart"
label="手工蛋塔"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong2Form.shortbread"
label="香蔥酥餅"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong2Form.chicken_wing"
label="香滷雞翅"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong2Form.fruit"
label="水果"
style="width: 130px;"
/>

<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong2Form.bake_potato"
label="烤地瓜"
style="width: 130px;"
/>
</div>
<div class="row justify-end" style="width: 100%;">
<q-btn
color="primary"
label="送出"
type="submit"
class="q-mt-md"
@click="submitForm"
/>
<q-btn
color="red"
label="取消"
@click="showCustomBangdong2 = false"
class="q-mt-md"
/>

</div >

</q-card>
</q-dialog>
        <!-- 客製雞腿便當dailog -->
        <q-dialog v-model="showCustomBangdong3"  >
  <q-card class="q-gutter-md row items-start  word-break " id="customBangdongcard">
<div>
<h5>主餐</h5>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong3Form.bangdong1Vegetable"
label="鮮蔬(全)"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong3Form.bangdong1Egg"
label="鮮蔬(蛋)"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong3Form.bangdong1Potato"
label="薯泥"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong3Form.bangdong1Shrimp"
label="炸蝦"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong3Form.bangdong1Chicken"
label="炒雞"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong3Form.bangdong1Fish"
label="酥魚"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong3Form.bangdong1Pig"
label="培根"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong3Form.bangdong1Meet"
label="滷肉"

/>
</div>
<div>

<h5>附餐</h5>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong3Form.bangdong1Drumstick"
label="雞腿"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong3Form.bangdong1Breast"
label="雞胸"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong3Form.bangdong1Beef"
label="滷牛"

/>
</div>

<div>
<h5>飲料</h5>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong3Form.bangdong1SugarZero"
label="無豆"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong3Form.bangdong1SugarSome"
label="微豆"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong3Form.bangdong1BlackTea"
label="紅茶"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong3Form.bangdong1MilkTea"
label="奶茶"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong3Form.bangdong1Sweetsoup"
label="甜湯"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong3Form.bangdong1Soup"
label="濃湯"

/>
</div>
<div>
<h5>雞胸便當</h5>

<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong3Form.bangdong1Quantity"
label="數量總計"
:rules="[val => !!val || '此欄位為必填']"
readonly
/>
</div>
<div style="width:100%;padding: 0;margin: 0;height: 30px;">
<h5 style="line-height: 0;">配菜</h5>
</div>
<div class="row">
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong3Form.tomato"
label="梅汁番茄"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong3Form.egg"
label="鹽水煮蛋"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong3Form.vegetable"
label="季節時蔬"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong3Form.fried_mushroom"
label="酥炸菇菇"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong3Form.braised_dried"
label="滷豆干"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong3Form.oil_rice"
label="油飯"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong3Form.fried_potato"
label="炸地瓜"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong3Form.eggtart"
label="手工蛋塔"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong3Form.shortbread"
label="香蔥酥餅"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong3Form.chicken_wing"
label="香滷雞翅"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong3Form.fruit"
label="水果"
style="width: 130px;"
/>

<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong3Form.bake_potato"
label="烤地瓜"
style="width: 130px;"
/>
</div>
<div class="row justify-end" style="width: 100%;">
<q-btn
color="primary"
label="送出"
type="submit"
class="q-mt-md"
@click="submitForm"
/>
<q-btn
color="red"
label="取消"
@click="showCustomBangdong3 = false"
class="q-mt-md"
/>

</div >

</q-card>
</q-dialog>
       <!-- 客製滷牛便當dailog -->
       <q-dialog v-model="showCustomBangdong4"  >
  <q-card class="q-gutter-md row items-start  word-break " id="customBangdongcard">
<div>
<h5>主餐</h5>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong4Form.bangdong1Vegetable"
label="鮮蔬(全)"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong4Form.bangdong1Egg"
label="鮮蔬(蛋)"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong4Form.bangdong1Potato"
label="薯泥"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong4Form.bangdong1Shrimp"
label="炸蝦"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong4Form.bangdong1Chicken"
label="炒雞"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong4Form.bangdong1Fish"
label="酥魚"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong4Form.bangdong1Pig"
label="培根"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong4Form.bangdong1Meet"
label="滷肉"

/>
</div>
<div>

<h5>附餐</h5>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong4Form.bangdong1Drumstick"
label="雞腿"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong4Form.bangdong1Breast"
label="雞胸"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong4Form.bangdong1Beef"
label="滷牛"

/>
</div>

<div>
<h5>飲料</h5>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong4Form.bangdong1SugarZero"
label="無豆"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong4Form.bangdong1SugarSome"
label="微豆"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong4Form.bangdong1BlackTea"
label="紅茶"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong4Form.bangdong1MilkTea"
label="奶茶"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong4Form.bangdong1Sweetsoup"
label="甜湯"

/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong4Form.bangdong1Soup"
label="濃湯"

/>
</div>
<div>
<h5>滷牛便當</h5>

<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="customBangdong4Form.bangdong1Quantity"
label="數量總計"
:rules="[val => !!val || '此欄位為必填']"
readonly
/>
</div>
<div style="width:100%;padding: 0;margin: 0;height: 30px;">
<h5 style="line-height: 0;">配菜</h5>
</div>
<div class="row">
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong4Form.tomato"
label="梅汁番茄"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong4Form.egg"
label="鹽水煮蛋"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong4Form.vegetable"
label="季節時蔬"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong4Form.fried_mushroom"
label="酥炸菇菇"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong4Form.braised_dried"
label="滷豆干"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong4Form.oil_rice"
label="油飯"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong4Form.fried_potato"
label="炸地瓜"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong4Form.eggtart"
label="手工蛋塔"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong4Form.shortbread"
label="香蔥酥餅"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong4Form.chicken_wing"
label="香滷雞翅"
style="width: 130px;"
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong4Form.fruit"
label="水果"
style="width: 130px;"
/>

<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
v-model="customBangdong4Form.bake_potato"
label="烤地瓜"
style="width: 130px;"
/>
</div>
<div class="row justify-end" style="width: 100%;">
<q-btn
color="primary"
label="送出"
type="submit"
class="q-mt-md"
@click="submitForm"
/>
<q-btn
color="red"
label="取消"
@click="showCustomBangdong4 = false"
class="q-mt-md"
/>

</div >

</q-card>
</q-dialog>

            <!-- 客製盒餐dailog -->
            <q-dialog v-model="showCustomLunchBox" class="lunchBoxdailog" >
  <q-card class="  items-start " id="dialogbtnCard">
    <!-- 客製盒餐按鈕 -->
    <div class="col  items-center" id="lunchboxbtn" >
      <q-btn color="blue" label="經濟盒餐"  @click="showCustomLunchBox1 = true; showCustomLunchBox=false" />
      <q-btn color="blue" label="會議盒餐"  @click="showCustomLunchBox2 = true; showCustomLunchBox=false" />
      <q-btn color="blue" label="貴賓盒餐"  @click="showCustomLunchBox3 = true; showCustomLunchBox=false" />
      <q-btn color="blue" label="首席盒餐"  @click="showCustomLunchBox4 = true; showCustomLunchBox=false" />
    </div>
   <div  class="row justify-end q-ma-lg"> <q-btn color="red" label="取消" class="q-mt-md" @click="showCustomLunchBox = false" />
    </div>
  </q-card>
</q-dialog>

      <!-- 經濟盒餐dailog -->
      <q-dialog v-model="showCustomLunchBox1"   full-width >
        <q-card >
          <div class="q-gutter-xs row items-start justify-center" id="customLunchbox">

<div >
    <h5>全素薯泥</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.vegetablePotato"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.vegetablePotato_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.vegetablePotato_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.vegetablePotato_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.vegetablePotato_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.vegetablePotato_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.vegetablePotato_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>蛋素薯泥</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.eggPotato"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.eggPotato_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.eggPotato_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.eggPotato_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.eggPotato_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.eggPotato_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.eggPotato_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>薯泥</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.potato"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"

  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.potato_sugarZero"
    label="無豆"
    style="width: 130px;"

  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.potato_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.potato_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.potato_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.potato_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.potato_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>炸蝦</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.shrimp"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.shrimp_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.shrimp_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.shrimp_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.shrimp_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.shrimp_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.shrimp_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>炒雞</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.chicken"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.chicken_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.chicken_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.chicken_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.chicken_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.chicken_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.chicken_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>酥魚</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.fish"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.fish_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.fish_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.fish_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.fish_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.fish_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.fish_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>培根</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.pig"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.pig_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.pig_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.pig_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.pig_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.pig_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.pig_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>滷肉</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.meet"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.meet_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.meet_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.meet_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.meet_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.meet_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.meet_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>

<div class="row q-mr-lg q-mb-auto justify-center flex-wrap" style="width: 100%; gap: 16px; ">
  <h>配菜</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.fried_potato"
    label="炸地瓜"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.eggtart"
    label="手工蛋塔"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.shortbread"
    label="香蔥酥餅"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.chicken_wing"
    label="香滷雞翅"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.fruit"
    label="水果"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.fried_mushroom"
    label="酥炸菇菇"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox1Form.bake_potato"
    label="烤地瓜"
    style="width: 130px;"
  />

</div>

<div class="row justify-end" style="width: 100%;">

  <q-btn
  color="primary"
  label="送出"
  type="submit"
  class="q-mt-md"
  @click="submitForm"
  />
  <q-btn
  color="red"
  label="取消"
  @click="showCustomLunchBox1 = false"
  class="q-mt-md"
  />
</div>
</div>

</q-card>
    </q-dialog>

    <!-- 會議盒餐dailog -->
    <q-dialog v-model="showCustomLunchBox2"  full-width>
      <q-card >
        <div class="q-gutter-xs row items-start justify-center" id="customLunchbox">

<div >
    <h5>全素薯泥</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.vegetablePotato"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.vegetablePotato_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.vegetablePotato_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.vegetablePotato_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.vegetablePotato_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.vegetablePotato_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.vegetablePotato_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>蛋素薯泥</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.eggPotato"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.eggPotato_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.eggPotato_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.eggPotato_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.eggPotato_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.eggPotato_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.eggPotato_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>薯泥</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.potato"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"

  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.potato_sugarZero"
    label="無豆"
    style="width: 130px;"

  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.potato_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.potato_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.potato_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.potato_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.potato_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>炸蝦</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.shrimp"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.shrimp_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.shrimp_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.shrimp_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.shrimp_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.shrimp_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.shrimp_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>炒雞</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.chicken"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.chicken_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.chicken_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.chicken_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.chicken_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.chicken_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.chicken_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>酥魚</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.fish"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.fish_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.fish_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.fish_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.fish_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.fish_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.fish_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>培根</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.pig"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.pig_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.pig_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.pig_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.pig_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.pig_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.pig_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>滷肉</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.meet"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.meet_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.meet_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.meet_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.meet_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.meet_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.meet_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>

<div class="row q-mr-lg q-mb-auto justify-center flex-wrap" style="width: 100%; gap: 16px; ">
  <h>配菜</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.fried_potato"
    label="炸地瓜"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.eggtart"
    label="手工蛋塔"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.shortbread"
    label="香蔥酥餅"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.chicken_wing"
    label="香滷雞翅"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.fruit"
    label="水果"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.fried_mushroom"
    label="酥炸菇菇"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox2Form.bake_potato"
    label="烤地瓜"
    style="width: 130px;"
  />

</div>

<div class="row justify-end" style="width: 100%;">

  <q-btn
  color="primary"
  label="送出"
  type="submit"
  class="q-mt-md"
  @click="submitForm"
  />
  <q-btn
  color="red"
  label="取消"
  @click="showCustomLunchBox2 = false"
  class="q-mt-md"
  />
</div>
</div>

</q-card>
    </q-dialog>
        <!-- 貴賓盒餐dailog -->
        <q-dialog v-model="showCustomLunchBox3"  full-width>
          <q-card >
            <div class="q-gutter-xs row items-start justify-center" id="customLunchbox">

<div >
    <h5>全素薯泥</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.vegetablePotato"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.vegetablePotato_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.vegetablePotato_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.vegetablePotato_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.vegetablePotato_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.vegetablePotato_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.vegetablePotato_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>蛋素薯泥</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.eggPotato"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.eggPotato_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.eggPotato_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.eggPotato_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.eggPotato_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.eggPotato_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.eggPotato_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>薯泥</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.potato"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"

  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.potato_sugarZero"
    label="無豆"
    style="width: 130px;"

  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.potato_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.potato_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.potato_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.potato_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.potato_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>炸蝦</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.shrimp"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.shrimp_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.shrimp_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.shrimp_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.shrimp_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.shrimp_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.shrimp_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>炒雞</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.chicken"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.chicken_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.chicken_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.chicken_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.chicken_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.chicken_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.chicken_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>酥魚</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.fish"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.fish_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.fish_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.fish_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.fish_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.fish_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.fish_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>培根</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.pig"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.pig_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.pig_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.pig_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.pig_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.pig_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.pig_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>滷肉</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.meet"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.meet_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.meet_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.meet_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.meet_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.meet_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.meet_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>

<div class="row q-mr-lg q-mb-auto justify-center flex-wrap" style="width: 100%; gap: 16px; ">
  <h>配菜</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.fried_potato"
    label="炸地瓜"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.eggtart"
    label="手工蛋塔"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.shortbread"
    label="香蔥酥餅"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.chicken_wing"
    label="香滷雞翅"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.fruit"
    label="水果"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.fried_mushroom"
    label="酥炸菇菇"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox3Form.bake_potato"
    label="烤地瓜"
    style="width: 130px;"
  />

</div>

<div class="row justify-end" style="width: 100%;">

  <q-btn
  color="primary"
  label="送出"
  type="submit"
  class="q-mt-md"
  @click="submitForm"
  />
  <q-btn
  color="red"
  label="取消"
  @click="showCustomLunchBox3 = false"
  class="q-mt-md"
  />
</div>
</div>

</q-card>
    </q-dialog>
            <!-- 首席盒餐dailog -->
            <q-dialog v-model="showCustomLunchBox4"  full-width>
              <q-card >
                <div class="q-gutter-xs row items-start justify-center" id="customLunchbox">

<div >
    <h5>全素薯泥</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.vegetablePotato"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.vegetablePotato_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.vegetablePotato_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.vegetablePotato_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.vegetablePotato_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.vegetablePotato_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.vegetablePotato_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>蛋素薯泥</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.eggPotato"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.eggPotato_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.eggPotato_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.eggPotato_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.eggPotato_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.eggPotato_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.eggPotato_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>薯泥</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.potato"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"

  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.potato_sugarZero"
    label="無豆"
    style="width: 130px;"

  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.potato_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.potato_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.potato_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.potato_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.potato_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>炸蝦</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.shrimp"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.shrimp_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.shrimp_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.shrimp_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.shrimp_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.shrimp_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.shrimp_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>炒雞</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.chicken"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.chicken_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.chicken_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.chicken_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.chicken_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.chicken_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.chicken_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>酥魚</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.fish"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.fish_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.fish_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.fish_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.fish_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.fish_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.fish_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>培根</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.pig"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.pig_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.pig_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.pig_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.pig_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.pig_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.pig_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>
<div>
    <h5>滷肉</h5>

  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.meet"
    label="數量"
    :rules="[val => !!val || '此欄位為必填']"
    style="width: 130px;"
  />

  <h>飲料</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.meet_sugarZero"
    label="無豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.meet_sugarSome"
    label="微豆"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.meet_blackTea"
    label="紅茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.meet_milkTea"
    label="奶茶"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.meet_sweetsoup"
    label="甜湯"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.meet_soup"
    label="濃湯"
    style="width: 130px;"
  />
</div>

<div class="row q-mr-lg q-mb-auto justify-center flex-wrap" style="width: 100%; gap: 16px; ">
  <h>配菜</h>
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.fried_potato"
    label="炸地瓜"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.eggtart"
    label="手工蛋塔"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.shortbread"
    label="香蔥酥餅"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.chicken_wing"
    label="香滷雞翅"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.fruit"
    label="水果"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.fried_mushroom"
    label="酥炸菇菇"
    style="width: 130px;"
  />
  <q-input
    outlined
    type="number"
    :input-style="{ fontSize: '20px' }"
    v-model="customLunchbox4Form.bake_potato"
    label="烤地瓜"
    style="width: 130px;"
  />

</div>

<div class="row justify-end" style="width: 100%;">

  <q-btn
  color="primary"
  label="送出"
  type="submit"
  class="q-mt-md"
  @click="submitForm"
  />
  <q-btn
  color="red"
  label="取消"
  @click="showCustomLunchBox4 = false"
  class="q-mt-md"
  />
</div>
</div>

</q-card>
    </q-dialog>
  </div>
<!-- 訂單區 -->
    <div class="row">
      <!-- 訂單顯示 -->
      <div class="col p-4 slider" data-order-lists>
        <!-- table訂單區域 -->

        <div class="row justify-center">
          <div class="col-12">
            <div class="q-pa-md " >
              <q-table
      style="max-height:35vh;"
      title="商品訂單"
      :rows="rows"
      :columns="columns"
      row-key="fat"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      id="sliderTable"
    >
    <template v-slot:top>
              <q-toolbar>
                <q-toolbar-title>訂單</q-toolbar-title>
                <q-space />
         <h>訂購人:{{personForm.name}}
          訂購人電話:{{personForm.tel}}</h>

              </q-toolbar>
            </template>
            <template v-slot:body-cell-actions="props">

            <div class="text-center q-gutter-x-sm" :props="props">

              <q-btn
              icon="edit"
              color="info"
              fab-mini unelevated size="sm"
              @click="editRow(props.rowKey)" />
              <q-btn
              icon="delete"
              color="red"
              fab-mini unelevated
              @click="deleteRow(props.row)" />
            </div>

        </template>
              </q-table>
            </div>
          </div>
        </div>
        <!-- 商品備註 -->
        <div class="row justify-start">
          <q-input
      style="width: 97%; margin-left: 20px; background-color: white;"
      v-model="mealRemark"
      type="text"
      label="餐點備註"
      :input-style="{ fontSize: '20px' }"
      @input="showDialog"
    />
  </div>
    <q-dialog v-model="dialogVisible" persistent>
      <q-card>
        <q-card-section>
          <q-input
            v-model="searchTerm"
            placeholder="搜尋..."
            dense
            class="q-mb-md"
          />
          <q-item
            v-for="option in filteredOptions"
            :key="option"
            clickable
            @click="selectOption(option)"
          >
            <q-item-section>
              <q-item-label>{{ option }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="取消" color="primary" @click="closeDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>

        <!-- 結帳金額區域 -->
        <div class="row justify-center">
          <tbody><tr>
          <td colspan="2">
            <span style="font-weight:bolder">已付清</span> 或
            <span style="font-weight:bolder">尚有欠款</span>
             </td>
             </tr>
             <tr>
               <td>付款方式：&nbsp;
                 <input type="radio" id="input-payment-method-cash" name="payment-method" value="cash">
                 <label for="input-payment-method-cash">現金</label>&nbsp;

               <input type="radio" id="input-payment-method-wire" name="payment-method" value="wire">
               <label for="input-payment-method-wire">電匯</label>&nbsp;

               <input type="radio" id="input-payment-method-credit" name="payment-method" value="credit">
               <label for="input-payment-method-credit">信用卡</label>&nbsp;

               <input type="radio" id="input-payment-method-withindays30" name="payment-method" value="withindays30">
               <label for="input-payment-method-withindays30">收貨後30天</label>&nbsp;

              </td>
              <td>
                總金額：<input type="text" id="input-payment-total" value="0" style="width:80px" readonly="">&nbsp;&nbsp; &nbsp;&nbsp;
                已付金額： <input type="text" id="input-payment-paid" name="payment-paid" value="0" style="width:80px">&nbsp;&nbsp;
                未付餘額： <input type="text" id="input-payment-unpaid" name="payment-unpaid" value="0" style="width:80px" readonly="">&nbsp;&nbsp;

              </td>
            </tr>

              </tbody>
        </div>
      </div>

</div>
</div>

</template>

<script setup>
import { ref, watch, computed, reactive } from 'vue'
// import { useQuasar } from 'quasar'
// import { apiAuth } from 'src/boot/axios'
// import { useRouter } from 'vue-router'

// const router = useRouter()
// const $q = useQuasar()

// 聯絡人區
// 路名輔助按鈕
function run (message) {
  personForm.road += message
}
// 訂購日期自動導入

const personForm = reactive({
  checkDate: '',
  formattedDate: '', // 日期抓取
  pick: '', // 取貨方式
  weekday: '', // 星期抓取
  getDate: '', // 送達日期
  week: '', // 星期
  companyClass: '', // 公司類別
  company: '', // 訂購公司
  compilation: '', // 統編
  name: '', // 訂購人
  tel: '', // 訂購人電話
  hometel: '', // 訂購人住家電話
  address: '', // 縣市
  address2: '', // 區域
  road: '', // 路名
  // xian: '', // 巷
  // non: '', // 弄
  // hao: '', // 號
  // lo: '', // 樓
  // room: '', // 室
  // replenishAdress: '', // 補充地址
  recipient: '', // 收件人
  recipientTel: '', // 收件人電話
  gender: '', // 性別
  sameOrderCustomer: false, // 訂購人與收件人相同
  sameOrderCompany: false, // 訂購公司與收件公司相同
  getCompany: '', // 收件公司
  event: '', // 活動
  remark: '', // 備註
  orderStatu: ''// 訂單狀態
})
const picks = reactive(['自取', '外送'])
const addresss = reactive(['台北市', '新北市'])

// 抓取當日日期
function updateDateTime () {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
  const date = now.getDate()
  personForm.formattedDate = `${year}/${month}/${date}`
}
setInterval(updateDateTime, 1000)
// 導入訂購日期的值
watch(() => personForm.formattedDate, (newValue) => {
  personForm.checkDate = newValue
})

// 偵測getDate後抓取星期自動導入

watch(() => personForm.getDate, (newVal) => {
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const date = new Date(newVal)
  const dayOfWeek = days[date.getDay()]
  personForm.weekday = dayOfWeek
  personForm.week = personForm.weekday
  // console.log(weekday)
})
// watch(() => personForm.weekday, (newValue) => {
//   personForm.week = newValue
// })

// 選擇縣市後，區域的選項會改變
const address2s = [
  ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'],
  ['板橋區', '中和區', '永和區', '土城區', '樹林區', '三峽區', '鶯歌區', '三重區', '新莊區', '泰山區', '林口區', '蘆洲區', '五股區', '八里區', '淡水區', '三芝區', '石門區']
]

const address2Options = computed(() => {
  if (personForm.address === '台北市') {
    return address2s[0]
  } else if (personForm.address === '新北市') {
    return address2s[1]
  } else {
    return []
  }
})

const orderStatus = reactive([
  '未確認', '待配餐', '已確認', '未結清', '已結案', '作廢'
])// 訂單狀態

function onReset () {
  // 將表單的資料都重置為初始值
  personForm.checkDate = ''
  personForm.formattedDate = ''// 日期抓取
  personForm.pick = ''// 取貨方式
  personForm.weekday = ''// 星期抓取
  personForm.getDate = ''// 送達日期
  personForm.week = ''// 星期
  personForm.companyClass = ''// 公司類別
  personForm.company = ''// 訂購公司
  personForm.compilation = ''// 統編
  personForm.name = ''// 訂購人
  personForm.tel = ''// 訂購人電話
  personForm.email = ''// 訂購人電子信箱
  personForm.hometel = ''// 訂購人住家電話
  personForm.address = ''// 縣市
  personForm.address2 = ''// 區域
  personForm.road = ''// 路名
  personForm.xian = ''// 巷
  personForm.non = ''// 弄
  personForm.hao = ''// 號
  personForm.lo = ''// 樓
  personForm.room = ''// 室
  personForm.replenishAdress = ''// 補充地址
  personForm.recipient = ''// 收件人
  personForm.recipientTel = ''// 收件人電話
  personForm.gender = ''// 性別
  personForm.sameOrderCustomer = false// 訂購人與收件人相同
  personForm.sameOrderCompany = false// 訂購公司與收件公司personForm.相同
  personForm.getCompany = ''// 收件公司
  personForm.event = ''// 活動
  personForm.remark = ''// 備註
  personForm.orderStatu = ''// 訂單狀態
  // 重設其它狀態
  // ...
}
const dialogVisible2 = ref(false)
const option2s = ref(['一樓管理室', '二樓停屍間', '地下室'])
const searchTerm2 = ref('')
const filteredOption2s = computed(() =>
  option2s.value.filter(option2 =>
    option2.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
)
watch(() => personForm.remark, (newVal) => {
  if (newVal.includes('..')) {
    showDialog2()
  }
})

function showDialog2 () {
  searchTerm.value = ''
  dialogVisible2.value = true
}
function closeDialog2 () {
  dialogVisible2.value = false
}

function selectOption2 (option2) {
  personForm.remark += option2
  personForm.remark = personForm.remark.replace('..', '')
  closeDialog2()
}
// 客戶備註

// 餐點備註
const mealRemark = ref('')
const dialogVisible = ref(false)
const options = ref(['不要蛋', '不要豆干', '不要袋子'])
const searchTerm = ref('')
const filteredOptions = computed(() =>
  options.value.filter(option =>
    option.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
)

watch(mealRemark, (newVal) => {
  if (newVal.includes('..')) {
    showDialog()
  }
})

function showDialog () {
  searchTerm.value = ''
  dialogVisible.value = true
}

function closeDialog () {
  dialogVisible.value = false
}

function selectOption (option) {
  mealRemark.value += option
  mealRemark.value = mealRemark.value.replace('..', '')
  closeDialog()
}
// 便當盒餐開關
const showbangdong = ref(false)

const openbangdong = () => {
  showbangdong.value = true
}
// 招牌便當

const bangdong1Form = reactive({
  bangdong1Quantity: 0, // 便當數量
  bangdong1Drumstick: 0, // 雞腿
  bangdong1Breast: 0, // 雞胸
  bangdong1Beef: 0, // 滷牛肉
  bangdong1Vegetable: 0, // 蔬菜
  bangdong1Egg: 0, // 蛋
  bangdong1Potato: 0, // 薯泥
  bangdong1Shrimp: 0, // 炸蝦
  bangdong1Chicken: 0, // 炒雞
  bangdong1Fish: 0, // 酥魚
  bangdong1Pig: 0, // 培根
  bangdong1Meet: 0, // 滷肉
  // tomato: 0, // 番茄
  // egg: 0, // 鹽水煮蛋
  // vegetable: 0, // 蔬菜
  // fried_mushroom: 0, // 炸菇
  // braised_dried: 0, // 滷豆干
  // oil_rice: 0, // 油飯
  // fried_potato: 0, // 炸地瓜
  // eggtart: 0, // 蛋撻
  // shortbread: 0, // 酥餅
  // chicken_wing: 0, // 雞翅
  // fruit: 0, // 水果
  // bake_potato: 0, // 烤地瓜
  bangdong1SugarZero: 0, // 無糖
  bangdong1SugarSome: 0, // 微糖
  bangdong1BlackTea: 0, // 紅茶
  bangdong1MilkTea: 0, // 奶茶
  bangdong1Sweetsoup: 0, // 甜湯
  bangdong1Soup: 0// 湯

})

function totalbangdong1 () {
  return parseInt(bangdong1Form.bangdong1Vegetable) +
    parseInt(bangdong1Form.bangdong1Egg) +
    parseInt(bangdong1Form.bangdong1Potato) +
    parseInt(bangdong1Form.bangdong1Shrimp) +
    parseInt(bangdong1Form.bangdong1Chicken) +
    parseInt(bangdong1Form.bangdong1Fish) +
    parseInt(bangdong1Form.bangdong1Pig) +
    parseInt(bangdong1Form.bangdong1Meet)
}
// console.log(totalbangdong1())

watch(() => totalbangdong1(), (newValue) => {
  bangdong1Form.bangdong1Quantity = newValue
})
// // 蛋素招牌自動補配菜
// watch(() => bangdong1Form.bangdong1Egg, (newValue, oldValue) => {
//   const increment = newValue - oldValue // 每多1的變化量
//   bangdong1Form.tomato += increment
//   bangdong1Form.egg += increment
//   bangdong1Form.vegetable += increment
//   bangdong1Form.fried_mushroom += increment
//   bangdong1Form.braised_dried += increment
//   bangdong1Form.fried_potato += increment
//   bangdong1Form.bake_potato += increment
// })
// // 全素招牌自動補配菜
// watch(() => bangdong1Form.bangdong1Vegetable, (newValue, oldValue) => {
//   const increment = newValue - oldValue // 每多1的變化量
//   bangdong1Form.tomato += increment
//   bangdong1Form.egg += increment
//   bangdong1Form.vegetable += increment
//   bangdong1Form.fried_mushroom += increment
//   bangdong1Form.braised_dried += increment
//   bangdong1Form.fried_potato += increment
//   bangdong1Form.bake_potato += increment
// })
// // 薯泥自動補配菜
// watch(() => bangdong1Form.bangdong1Potato, (newValue, oldValue) => {
//   const increment = newValue - oldValue // 每多1的變化量
//   bangdong1Form.tomato += increment
//   bangdong1Form.egg += increment
//   bangdong1Form.vegetable += increment
//   bangdong1Form.fried_mushroom += increment
//   bangdong1Form.braised_dried += increment
//   bangdong1Form.fried_potato += increment
//   bangdong1Form.bake_potato += increment
// })
// 雞腿便當

const bangdong2Form = reactive({
  bangdong1Quantity: 0, // 便當數量
  bangdong1Drumstick: 0, // 雞腿
  bangdong1Breast: 0, // 雞胸
  bangdong1Beef: 0, // 滷牛肉
  bangdong1Vegetable: 0, // 蔬菜
  bangdong1Egg: 0, // 蛋
  bangdong1Potato: 0, // 薯泥
  bangdong1Shrimp: 0, // 炸蝦
  bangdong1Chicken: 0, // 炒雞
  bangdong1Fish: 0, // 酥魚
  bangdong1Pig: 0, // 培根
  bangdong1Meet: 0, // 滷肉
  // tomato: 0, // 番茄
  // egg: 0, // 鹽水煮蛋
  // vegetable: 0, // 蔬菜
  // fried_mushroom: 0, // 炸菇
  // braised_dried: 0, // 滷豆干
  // oil_rice: 0, // 油飯
  // fried_potato: 0, // 炸地瓜
  // eggtart: 0, // 蛋撻
  // shortbread: 0, // 酥餅
  // chicken_wing: 0, // 雞翅
  // fruit: 0, // 水果
  // bake_potato: 0, // 烤地瓜
  bangdong1SugarZero: 0, // 無糖
  bangdong1SugarSome: 0, // 微糖
  bangdong1BlackTea: 0, // 紅茶
  bangdong1MilkTea: 0, // 奶茶
  bangdong1Sweetsoup: 0, // 甜湯
  bangdong1Soup: 0// 湯

})

function totalbangdong2 () {
  return parseInt(bangdong2Form.bangdong1Vegetable) +
    parseInt(bangdong2Form.bangdong1Egg) +
    parseInt(bangdong2Form.bangdong1Potato) +
    parseInt(bangdong2Form.bangdong1Shrimp) +
    parseInt(bangdong2Form.bangdong1Chicken) +
    parseInt(bangdong2Form.bangdong1Fish) +
    parseInt(bangdong2Form.bangdong1Pig) +
    parseInt(bangdong2Form.bangdong1Meet)
}
// console.log(totalbangdong2())

watch(() => totalbangdong2(), (newValue) => {
  bangdong2Form.bangdong1Quantity = newValue
})

// 雞胸便當

const bangdong3Form = reactive({
  bangdong1Quantity: 0, // 便當數量
  bangdong1Drumstick: 0, // 雞腿
  bangdong1Breast: 0, // 雞胸
  bangdong1Beef: 0, // 滷牛肉
  bangdong1Vegetable: 0, // 蔬菜
  bangdong1Egg: 0, // 蛋
  bangdong1Potato: 0, // 薯泥
  bangdong1Shrimp: 0, // 炸蝦
  bangdong1Chicken: 0, // 炒雞
  bangdong1Fish: 0, // 酥魚
  bangdong1Pig: 0, // 培根
  bangdong1Meet: 0, // 滷肉
  // tomato: 0, // 番茄
  // egg: 0, // 鹽水煮蛋
  // vegetable: 0, // 蔬菜
  // fried_mushroom: 0, // 炸菇
  // braised_dried: 0, // 滷豆干
  // oil_rice: 0, // 油飯
  // fried_potato: 0, // 炸地瓜
  // eggtart: 0, // 蛋撻
  // shortbread: 0, // 酥餅
  // chicken_wing: 0, // 雞翅
  // fruit: 0, // 水果
  // bake_potato: 0, // 烤地瓜
  bangdong1SugarZero: 0, // 無糖
  bangdong1SugarSome: 0, // 微糖
  bangdong1BlackTea: 0, // 紅茶
  bangdong1MilkTea: 0, // 奶茶
  bangdong1Sweetsoup: 0, // 甜湯
  bangdong1Soup: 0// 湯

})

function totalbangdong3 () {
  return parseInt(bangdong3Form.bangdong1Vegetable) +
    parseInt(bangdong3Form.bangdong1Egg) +
    parseInt(bangdong3Form.bangdong1Potato) +
    parseInt(bangdong3Form.bangdong1Shrimp) +
    parseInt(bangdong3Form.bangdong1Chicken) +
    parseInt(bangdong3Form.bangdong1Fish) +
    parseInt(bangdong3Form.bangdong1Pig) +
    parseInt(bangdong3Form.bangdong1Meet)
}
// console.log(totalbangdong3())

watch(() => totalbangdong3(), (newValue) => {
  bangdong3Form.bangdong1Quantity = newValue
})

// 滷牛便當

const bangdong4Form = reactive({
  bangdong1Quantity: 0, // 便當數量
  bangdong1Drumstick: 0, // 雞腿
  bangdong1Breast: 0, // 雞胸
  bangdong1Beef: 0, // 滷牛肉
  bangdong1Vegetable: 0, // 蔬菜
  bangdong1Egg: 0, // 蛋
  bangdong1Potato: 0, // 薯泥
  bangdong1Shrimp: 0, // 炸蝦
  bangdong1Chicken: 0, // 炒雞
  bangdong1Fish: 0, // 酥魚
  bangdong1Pig: 0, // 培根
  bangdong1Meet: 0, // 滷肉
  // tomato: 0, // 番茄
  // egg: 0, // 鹽水煮蛋
  // vegetable: 0, // 蔬菜
  // fried_mushroom: 0, // 炸菇
  // braised_dried: 0, // 滷豆干
  // oil_rice: 0, // 油飯
  // fried_potato: 0, // 炸地瓜
  // eggtart: 0, // 蛋撻
  // shortbread: 0, // 酥餅
  // chicken_wing: 0, // 雞翅
  // fruit: 0, // 水果
  // bake_potato: 0, // 烤地瓜
  bangdong1SugarZero: 0, // 無糖
  bangdong1SugarSome: 0, // 微糖
  bangdong1BlackTea: 0, // 紅茶
  bangdong1MilkTea: 0, // 奶茶
  bangdong1Sweetsoup: 0, // 甜湯
  bangdong1Soup: 0// 湯

})

function totalbangdong4 () {
  return parseInt(bangdong4Form.bangdong1Vegetable) +
    parseInt(bangdong4Form.bangdong1Egg) +
    parseInt(bangdong4Form.bangdong1Potato) +
    parseInt(bangdong4Form.bangdong1Shrimp) +
    parseInt(bangdong4Form.bangdong1Chicken) +
    parseInt(bangdong4Form.bangdong1Fish) +
    parseInt(bangdong4Form.bangdong1Pig) +
    parseInt(bangdong4Form.bangdong1Meet)
}
// console.log(totalbangdong4())

watch(() => totalbangdong4(), (newValue) => {
  bangdong4Form.bangdong1Quantity = newValue
})

// 盒餐開關
const showlunchBox = ref(false)

const openlunchBox = () => {
  showlunchBox.value = true
}

// 經濟盒餐
const lunchbox1Form = reactive({
  vegetablePotato: 0, // 全素薯泥
  vegetablePotato_sugarZero: 0, // 全素薯泥無糖豆漿
  vegetablePotato_sugarSome: 0, // 全素薯泥微糖豆漿
  vegetablePotato_blackTea: 0, // 全素薯泥紅茶
  vegetablePotato_milkTea: 0, // 全素薯泥奶茶
  vegetablePotato_sweetsoup: 0, // 全素薯泥甜湯
  vegetablePotato_soup: 0, // 全素薯泥湯
  eggPotato: 0, // 蛋薯泥
  eggPotato_sugarZero: 0, // 蛋薯泥無糖豆漿
  eggPotato_sugarSome: 0, // 蛋薯泥微糖豆漿
  eggPotato_blackTea: 0, // 蛋薯泥紅茶
  eggPotato_milkTea: 0, // 蛋薯泥奶茶
  eggPotato_sweetsoup: 0, // 蛋薯泥甜湯
  eggPotato_soup: 0, // 蛋薯泥湯
  potato: 0, // 薯泥
  potato_sugarZero: 0, // 薯泥無糖豆漿
  potato_sugarSome: 0, // 薯泥微糖豆漿
  potato_blackTea: 0, // 薯泥紅茶
  potato_milkTea: 0, // 薯泥奶茶
  potato_sweetsoup: 0, // 薯泥甜湯
  potato_soup: 0, // 薯泥湯
  shrimp: 0, // 炸蝦
  shrimp_sugarZero: 0, // 炸蝦無糖豆漿
  shrimp_sugarSome: 0, // 炸蝦微糖豆漿
  shrimp_blackTea: 0, // 炸蝦紅茶
  shrimp_milkTea: 0, // 炸蝦奶茶
  shrimp_sweetsoup: 0, // 炸蝦甜湯
  shrimp_soup: 0, // 炸蝦湯
  chicken: 0, // 炒雞
  chicken_sugarZero: 0, // 炒雞無糖豆漿
  chicken_sugarSome: 0, // 炒雞微糖豆漿
  chicken_blackTea: 0, // 炒雞紅茶
  chicken_milkTea: 0, // 炒雞奶茶
  chicken_sweetsoup: 0, // 炒雞甜湯
  chicken_soup: 0, // 炒雞湯
  fish: 0, // 酥魚
  fish_sugarZero: 0, // 酥魚無糖豆漿
  fish_sugarSome: 0, // 酥魚微糖豆漿
  fish_blackTea: 0, // 酥魚紅茶
  fish_milkTea: 0, // 酥魚奶茶
  fish_sweetsoup: 0, // 酥魚甜湯
  fish_soup: 0, // 酥魚湯
  pig: 0, // 培根
  pig_sugarZero: 0, // 培根無糖豆漿
  pig_sugarSome: 0, // 培根微糖豆漿
  pig_blackTea: 0, // 培根紅茶
  pig_milkTea: 0, // 培根奶茶
  pig_sweetsoup: 0, // 培根甜湯
  pig_soup: 0, // 培根湯
  meet: 0, // 滷肉
  meet_sugarZero: 0, // 滷肉無糖豆漿
  meet_sugarSome: 0, // 滷肉微糖豆漿
  meet_blackTea: 0, // 滷肉紅茶
  meet_milkTea: 0, // 滷肉奶茶
  meet_sweetsoup: 0, // 滷肉甜湯
  meet_soup: 0, // 滷肉湯
  fried_potato: 0, // 炸地瓜
  eggtart: 0, // 蛋撻
  shortbread: 0, // 酥餅
  chicken_wing: 0, // 雞翅
  fruit: 0, // 水果
  fried_mushroom: 0, // 炸菇
  bake_potato: 0 // 烤地瓜

})
// 會議盒餐
const lunchbox2Form = reactive({
  vegetablePotato: 0, // 全素薯泥
  vegetablePotato_sugarZero: 0, // 全素薯泥無糖豆漿
  vegetablePotato_sugarSome: 0, // 全素薯泥微糖豆漿
  vegetablePotato_blackTea: 0, // 全素薯泥紅茶
  vegetablePotato_milkTea: 0, // 全素薯泥奶茶
  vegetablePotato_sweetsoup: 0, // 全素薯泥甜湯
  vegetablePotato_soup: 0, // 全素薯泥湯
  eggPotato: 0, // 蛋薯泥
  eggPotato_sugarZero: 0, // 蛋薯泥無糖豆漿
  eggPotato_sugarSome: 0, // 蛋薯泥微糖豆漿
  eggPotato_blackTea: 0, // 蛋薯泥紅茶
  eggPotato_milkTea: 0, // 蛋薯泥奶茶
  eggPotato_sweetsoup: 0, // 蛋薯泥甜湯
  eggPotato_soup: 0, // 蛋薯泥湯
  potato: 0, // 薯泥
  potato_sugarZero: 0, // 薯泥無糖豆漿
  potato_sugarSome: 0, // 薯泥微糖豆漿
  potato_blackTea: 0, // 薯泥紅茶
  potato_milkTea: 0, // 薯泥奶茶
  potato_sweetsoup: 0, // 薯泥甜湯
  potato_soup: 0, // 薯泥湯
  shrimp: 0, // 炸蝦
  shrimp_sugarZero: 0, // 炸蝦無糖豆漿
  shrimp_sugarSome: 0, // 炸蝦微糖豆漿
  shrimp_blackTea: 0, // 炸蝦紅茶
  shrimp_milkTea: 0, // 炸蝦奶茶
  shrimp_sweetsoup: 0, // 炸蝦甜湯
  shrimp_soup: 0, // 炸蝦湯
  chicken: 0, // 炒雞
  chicken_sugarZero: 0, // 炒雞無糖豆漿
  chicken_sugarSome: 0, // 炒雞微糖豆漿
  chicken_blackTea: 0, // 炒雞紅茶
  chicken_milkTea: 0, // 炒雞奶茶
  chicken_sweetsoup: 0, // 炒雞甜湯
  chicken_soup: 0, // 炒雞湯
  fish: 0, // 酥魚
  fish_sugarZero: 0, // 酥魚無糖豆漿
  fish_sugarSome: 0, // 酥魚微糖豆漿
  fish_blackTea: 0, // 酥魚紅茶
  fish_milkTea: 0, // 酥魚奶茶
  fish_sweetsoup: 0, // 酥魚甜湯
  fish_soup: 0, // 酥魚湯
  pig: 0, // 培根
  pig_sugarZero: 0, // 培根無糖豆漿
  pig_sugarSome: 0, // 培根微糖豆漿
  pig_blackTea: 0, // 培根紅茶
  pig_milkTea: 0, // 培根奶茶
  pig_sweetsoup: 0, // 培根甜湯
  pig_soup: 0, // 培根湯
  meet: 0, // 滷肉
  meet_sugarZero: 0, // 滷肉無糖豆漿
  meet_sugarSome: 0, // 滷肉微糖豆漿
  meet_blackTea: 0, // 滷肉紅茶
  meet_milkTea: 0, // 滷肉奶茶
  meet_sweetsoup: 0, // 滷肉甜湯
  meet_soup: 0, // 滷肉湯
  fried_potato: 0, // 炸地瓜
  eggtart: 0, // 蛋撻
  shortbread: 0, // 酥餅
  chicken_wing: 0, // 雞翅
  fruit: 0, // 水果
  fried_mushroom: 0, // 炸菇
  bake_potato: 0 // 烤地瓜

})

// 貴賓盒餐
const lunchbox3Form = reactive({
  vegetablePotato: 0, // 全素薯泥
  vegetablePotato_sugarZero: 0, // 全素薯泥無糖豆漿
  vegetablePotato_sugarSome: 0, // 全素薯泥微糖豆漿
  vegetablePotato_blackTea: 0, // 全素薯泥紅茶
  vegetablePotato_milkTea: 0, // 全素薯泥奶茶
  vegetablePotato_sweetsoup: 0, // 全素薯泥甜湯
  vegetablePotato_soup: 0, // 全素薯泥湯
  eggPotato: 0, // 蛋薯泥
  eggPotato_sugarZero: 0, // 蛋薯泥無糖豆漿
  eggPotato_sugarSome: 0, // 蛋薯泥微糖豆漿
  eggPotato_blackTea: 0, // 蛋薯泥紅茶
  eggPotato_milkTea: 0, // 蛋薯泥奶茶
  eggPotato_sweetsoup: 0, // 蛋薯泥甜湯
  eggPotato_soup: 0, // 蛋薯泥湯
  potato: 0, // 薯泥
  potato_sugarZero: 0, // 薯泥無糖豆漿
  potato_sugarSome: 0, // 薯泥微糖豆漿
  potato_blackTea: 0, // 薯泥紅茶
  potato_milkTea: 0, // 薯泥奶茶
  potato_sweetsoup: 0, // 薯泥甜湯
  potato_soup: 0, // 薯泥湯
  shrimp: 0, // 炸蝦
  shrimp_sugarZero: 0, // 炸蝦無糖豆漿
  shrimp_sugarSome: 0, // 炸蝦微糖豆漿
  shrimp_blackTea: 0, // 炸蝦紅茶
  shrimp_milkTea: 0, // 炸蝦奶茶
  shrimp_sweetsoup: 0, // 炸蝦甜湯
  shrimp_soup: 0, // 炸蝦湯
  chicken: 0, // 炒雞
  chicken_sugarZero: 0, // 炒雞無糖豆漿
  chicken_sugarSome: 0, // 炒雞微糖豆漿
  chicken_blackTea: 0, // 炒雞紅茶
  chicken_milkTea: 0, // 炒雞奶茶
  chicken_sweetsoup: 0, // 炒雞甜湯
  chicken_soup: 0, // 炒雞湯
  fish: 0, // 酥魚
  fish_sugarZero: 0, // 酥魚無糖豆漿
  fish_sugarSome: 0, // 酥魚微糖豆漿
  fish_blackTea: 0, // 酥魚紅茶
  fish_milkTea: 0, // 酥魚奶茶
  fish_sweetsoup: 0, // 酥魚甜湯
  fish_soup: 0, // 酥魚湯
  pig: 0, // 培根
  pig_sugarZero: 0, // 培根無糖豆漿
  pig_sugarSome: 0, // 培根微糖豆漿
  pig_blackTea: 0, // 培根紅茶
  pig_milkTea: 0, // 培根奶茶
  pig_sweetsoup: 0, // 培根甜湯
  pig_soup: 0, // 培根湯
  meet: 0, // 滷肉
  meet_sugarZero: 0, // 滷肉無糖豆漿
  meet_sugarSome: 0, // 滷肉微糖豆漿
  meet_blackTea: 0, // 滷肉紅茶
  meet_milkTea: 0, // 滷肉奶茶
  meet_sweetsoup: 0, // 滷肉甜湯
  meet_soup: 0, // 滷肉湯
  fried_potato: 0, // 炸地瓜
  eggtart: 0, // 蛋撻
  shortbread: 0, // 酥餅
  chicken_wing: 0, // 雞翅
  fruit: 0, // 水果
  fried_mushroom: 0, // 炸菇
  bake_potato: 0 // 烤地瓜

})
// 首席盒餐
const lunchbox4Form = reactive({
  vegetablePotato: 0, // 全素薯泥
  vegetablePotato_sugarZero: 0, // 全素薯泥無糖豆漿
  vegetablePotato_sugarSome: 0, // 全素薯泥微糖豆漿
  vegetablePotato_blackTea: 0, // 全素薯泥紅茶
  vegetablePotato_milkTea: 0, // 全素薯泥奶茶
  vegetablePotato_sweetsoup: 0, // 全素薯泥甜湯
  vegetablePotato_soup: 0, // 全素薯泥湯
  eggPotato: 0, // 蛋薯泥
  eggPotato_sugarZero: 0, // 蛋薯泥無糖豆漿
  eggPotato_sugarSome: 0, // 蛋薯泥微糖豆漿
  eggPotato_blackTea: 0, // 蛋薯泥紅茶
  eggPotato_milkTea: 0, // 蛋薯泥奶茶
  eggPotato_sweetsoup: 0, // 蛋薯泥甜湯
  eggPotato_soup: 0, // 蛋薯泥湯
  potato: 0, // 薯泥
  potato_sugarZero: 0, // 薯泥無糖豆漿
  potato_sugarSome: 0, // 薯泥微糖豆漿
  potato_blackTea: 0, // 薯泥紅茶
  potato_milkTea: 0, // 薯泥奶茶
  potato_sweetsoup: 0, // 薯泥甜湯
  potato_soup: 0, // 薯泥湯
  shrimp: 0, // 炸蝦
  shrimp_sugarZero: 0, // 炸蝦無糖豆漿
  shrimp_sugarSome: 0, // 炸蝦微糖豆漿
  shrimp_blackTea: 0, // 炸蝦紅茶
  shrimp_milkTea: 0, // 炸蝦奶茶
  shrimp_sweetsoup: 0, // 炸蝦甜湯
  shrimp_soup: 0, // 炸蝦湯
  chicken: 0, // 炒雞
  chicken_sugarZero: 0, // 炒雞無糖豆漿
  chicken_sugarSome: 0, // 炒雞微糖豆漿
  chicken_blackTea: 0, // 炒雞紅茶
  chicken_milkTea: 0, // 炒雞奶茶
  chicken_sweetsoup: 0, // 炒雞甜湯
  chicken_soup: 0, // 炒雞湯
  fish: 0, // 酥魚
  fish_sugarZero: 0, // 酥魚無糖豆漿
  fish_sugarSome: 0, // 酥魚微糖豆漿
  fish_blackTea: 0, // 酥魚紅茶
  fish_milkTea: 0, // 酥魚奶茶
  fish_sweetsoup: 0, // 酥魚甜湯
  fish_soup: 0, // 酥魚湯
  pig: 0, // 培根
  pig_sugarZero: 0, // 培根無糖豆漿
  pig_sugarSome: 0, // 培根微糖豆漿
  pig_blackTea: 0, // 培根紅茶
  pig_milkTea: 0, // 培根奶茶
  pig_sweetsoup: 0, // 培根甜湯
  pig_soup: 0, // 培根湯
  meet: 0, // 滷肉
  meet_sugarZero: 0, // 滷肉無糖豆漿
  meet_sugarSome: 0, // 滷肉微糖豆漿
  meet_blackTea: 0, // 滷肉紅茶
  meet_milkTea: 0, // 滷肉奶茶
  meet_sweetsoup: 0, // 滷肉甜湯
  meet_soup: 0, // 滷肉湯
  fried_potato: 0, // 炸地瓜
  eggtart: 0, // 蛋撻
  shortbread: 0, // 酥餅
  chicken_wing: 0, // 雞翅
  fruit: 0, // 水果
  fried_mushroom: 0, // 炸菇
  bake_potato: 0 // 烤地瓜

})

const showlunchBox1 = ref(false)
const showlunchBox2 = ref(false)
const showlunchBox3 = ref(false)
const showlunchBox4 = ref(false)
const showbangdong1 = ref(false)
const showbangdong2 = ref(false)
const showbangdong3 = ref(false)
const showbangdong4 = ref(false)
// 單點開關
const showsolo = ref(false)

const opensolo = () => {
  showsolo.value = true
}
const soloForm = reactive({
  vegetablePotato: 0, // 全素薯泥
  eggPotato: 0, // 蛋薯泥
  Potato: 0, // 薯泥
  shrimp: 0, // 炸蝦
  chicken: 0, // 炒雞
  fish: 0, // 酥魚
  pig: 0, // 培根
  vegetablePotatoHalf: 0, // 全素薯泥3吋
  eggPotatoHalf: 0, // 蛋薯泥3吋
  PotatoHalf: 0, // 薯泥3吋
  shrimpHalf: 0, // 炸蝦3吋
  chickenHalf: 0, // 炒雞3吋
  fishHalf: 0, // 酥魚3吋
  pigHalf: 0, // 培根3吋
  sugarZero: 0, // 無糖豆漿
  sugarSome: 0, // 微糖豆漿
  blackTea: 0, // 紅茶
  milkTea: 0, // 奶茶
  sweetsoup: 0, // 甜湯
  soup: 0, // 湯
  smallBag: 0, // 小袋
  bigBag: 0, // 大袋
  tomato: 0, // 番茄
  egg: 0, // 鹽水煮蛋
  vegetable: 0, // 蔬菜
  fried_mushroom: 0, // 炸菇
  braised_dried: 0, // 滷豆干
  oil_rice: 0, // 油飯
  fried_potato: 0, // 炸地瓜
  eggtart: 0, // 蛋撻
  shortbread: 0, // 酥餅
  chicken_wing: 0, // 雞翅
  fruit: 0, // 水果
  bake_potato: 0 // 烤地瓜
})
// 客製便當開關
const showCustomBangdong = ref(false)
const openCustomBangdong = () => {
  showCustomBangdong.value = true
}

// 客製招牌便當

const customBangdong1Form = reactive({
  bangdong1Quantity: 0, // 便當數量
  bangdong1Drumstick: 0, // 雞腿
  bangdong1Breast: 0, // 雞胸
  bangdong1Beef: 0, // 滷牛肉
  bangdong1Vegetable: 0, // 蔬菜
  bangdong1Egg: 0, // 蛋
  bangdong1Potato: 0, // 薯泥
  bangdong1Shrimp: 0, // 炸蝦
  bangdong1Chicken: 0, // 炒雞
  bangdong1Fish: 0, // 酥魚
  bangdong1Pig: 0, // 培根
  bangdong1Meet: 0, // 滷肉
  tomato: 0, // 番茄
  egg: 0, // 鹽水煮蛋
  vegetable: 0, // 蔬菜
  fried_mushroom: 0, // 炸菇
  braised_dried: 0, // 滷豆干
  oil_rice: 0, // 油飯
  fried_potato: 0, // 炸地瓜
  eggtart: 0, // 蛋撻
  shortbread: 0, // 酥餅
  chicken_wing: 0, // 雞翅
  fruit: 0, // 水果
  bake_potato: 0, // 烤地瓜
  bangdong1SugarZero: 0, // 無糖
  bangdong1SugarSome: 0, // 微糖
  bangdong1BlackTea: 0, // 紅茶
  bangdong1MilkTea: 0, // 奶茶
  bangdong1Sweetsoup: 0, // 甜湯
  bangdong1Soup: 0// 湯

})
function totalCustombangdong1 () {
  return parseInt(customBangdong1Form.bangdong1Vegetable) +
    parseInt(customBangdong1Form.bangdong1Egg) +
    parseInt(customBangdong1Form.bangdong1Potato) +
    parseInt(customBangdong1Form.bangdong1Shrimp) +
    parseInt(customBangdong1Form.bangdong1Chicken) +
    parseInt(customBangdong1Form.bangdong1Fish) +
    parseInt(customBangdong1Form.bangdong1Pig) +
    parseInt(customBangdong1Form.bangdong1Meet)
}
// console.log(totalbangdong1())

watch(() => totalCustombangdong1(), (newValue) => {
  customBangdong1Form.bangdong1Quantity = newValue
})
// 客製雞腿便當

const customBangdong2Form = reactive({
  bangdong1Quantity: 0, // 便當數量
  bangdong1Drumstick: 0, // 雞腿
  bangdong1Breast: 0, // 雞胸
  bangdong1Beef: 0, // 滷牛肉
  bangdong1Vegetable: 0, // 蔬菜
  bangdong1Egg: 0, // 蛋
  bangdong1Potato: 0, // 薯泥
  bangdong1Shrimp: 0, // 炸蝦
  bangdong1Chicken: 0, // 炒雞
  bangdong1Fish: 0, // 酥魚
  bangdong1Pig: 0, // 培根
  bangdong1Meet: 0, // 滷肉
  tomato: 0, // 番茄
  egg: 0, // 鹽水煮蛋
  vegetable: 0, // 蔬菜
  fried_mushroom: 0, // 炸菇
  braised_dried: 0, // 滷豆干
  oil_rice: 0, // 油飯
  fried_potato: 0, // 炸地瓜
  eggtart: 0, // 蛋撻
  shortbread: 0, // 酥餅
  chicken_wing: 0, // 雞翅
  fruit: 0, // 水果
  bake_potato: 0, // 烤地瓜
  bangdong1SugarZero: 0, // 無糖
  bangdong1SugarSome: 0, // 微糖
  bangdong1BlackTea: 0, // 紅茶
  bangdong1MilkTea: 0, // 奶茶
  bangdong1Sweetsoup: 0, // 甜湯
  bangdong1Soup: 0// 湯

})
function totalCustombangdong2 () {
  return parseInt(customBangdong2Form.bangdong1Vegetable) +
    parseInt(customBangdong2Form.bangdong1Egg) +
    parseInt(customBangdong2Form.bangdong1Potato) +
    parseInt(customBangdong2Form.bangdong1Shrimp) +
    parseInt(customBangdong2Form.bangdong1Chicken) +
    parseInt(customBangdong2Form.bangdong1Fish) +
    parseInt(customBangdong2Form.bangdong1Pig) +
    parseInt(customBangdong2Form.bangdong1Meet)
}

watch(() => totalCustombangdong2(), (newValue) => {
  customBangdong2Form.bangdong1Quantity = newValue
})
// 客製雞胸便當

const customBangdong3Form = reactive({
  bangdong1Quantity: 0, // 便當數量
  bangdong1Drumstick: 0, // 雞腿
  bangdong1Breast: 0, // 雞胸
  bangdong1Beef: 0, // 滷牛肉
  bangdong1Vegetable: 0, // 蔬菜
  bangdong1Egg: 0, // 蛋
  bangdong1Potato: 0, // 薯泥
  bangdong1Shrimp: 0, // 炸蝦
  bangdong1Chicken: 0, // 炒雞
  bangdong1Fish: 0, // 酥魚
  bangdong1Pig: 0, // 培根
  bangdong1Meet: 0, // 滷肉
  tomato: 0, // 番茄
  egg: 0, // 鹽水煮蛋
  vegetable: 0, // 蔬菜
  fried_mushroom: 0, // 炸菇
  braised_dried: 0, // 滷豆干
  oil_rice: 0, // 油飯
  fried_potato: 0, // 炸地瓜
  eggtart: 0, // 蛋撻
  shortbread: 0, // 酥餅
  chicken_wing: 0, // 雞翅
  fruit: 0, // 水果
  bake_potato: 0, // 烤地瓜
  bangdong1SugarZero: 0, // 無糖
  bangdong1SugarSome: 0, // 微糖
  bangdong1BlackTea: 0, // 紅茶
  bangdong1MilkTea: 0, // 奶茶
  bangdong1Sweetsoup: 0, // 甜湯
  bangdong1Soup: 0// 湯

})
function totalCustombangdong3 () {
  return parseInt(customBangdong3Form.bangdong1Vegetable) +
    parseInt(customBangdong3Form.bangdong1Egg) +
    parseInt(customBangdong3Form.bangdong1Potato) +
    parseInt(customBangdong3Form.bangdong1Shrimp) +
    parseInt(customBangdong3Form.bangdong1Chicken) +
    parseInt(customBangdong3Form.bangdong1Fish) +
    parseInt(customBangdong3Form.bangdong1Pig) +
    parseInt(customBangdong3Form.bangdong1Meet)
}

watch(() => totalCustombangdong3(), (newValue) => {
  customBangdong3Form.bangdong1Quantity = newValue
})

// 客製滷牛便當

const customBangdong4Form = reactive({
  bangdong1Quantity: 0, // 便當數量
  bangdong1Drumstick: 0, // 雞腿
  bangdong1Breast: 0, // 雞胸
  bangdong1Beef: 0, // 滷牛肉
  bangdong1Vegetable: 0, // 蔬菜
  bangdong1Egg: 0, // 蛋
  bangdong1Potato: 0, // 薯泥
  bangdong1Shrimp: 0, // 炸蝦
  bangdong1Chicken: 0, // 炒雞
  bangdong1Fish: 0, // 酥魚
  bangdong1Pig: 0, // 培根
  bangdong1Meet: 0, // 滷肉
  tomato: 0, // 番茄
  egg: 0, // 鹽水煮蛋
  vegetable: 0, // 蔬菜
  fried_mushroom: 0, // 炸菇
  braised_dried: 0, // 滷豆干
  oil_rice: 0, // 油飯
  fried_potato: 0, // 炸地瓜
  eggtart: 0, // 蛋撻
  shortbread: 0, // 酥餅
  chicken_wing: 0, // 雞翅
  fruit: 0, // 水果
  bake_potato: 0, // 烤地瓜
  bangdong1SugarZero: 0, // 無糖
  bangdong1SugarSome: 0, // 微糖
  bangdong1BlackTea: 0, // 紅茶
  bangdong1MilkTea: 0, // 奶茶
  bangdong1Sweetsoup: 0, // 甜湯
  bangdong1Soup: 0// 湯

})
function totalCustombangdong4 () {
  return parseInt(customBangdong4Form.bangdong1Vegetable) +
    parseInt(customBangdong4Form.bangdong1Egg) +
    parseInt(customBangdong4Form.bangdong1Potato) +
    parseInt(customBangdong4Form.bangdong1Shrimp) +
    parseInt(customBangdong4Form.bangdong1Chicken) +
    parseInt(customBangdong4Form.bangdong1Fish) +
    parseInt(customBangdong4Form.bangdong1Pig) +
    parseInt(customBangdong4Form.bangdong1Meet)
}

watch(() => totalCustombangdong4(), (newValue) => {
  customBangdong4Form.bangdong1Quantity = newValue
})
// 客製餐盒開關
const showCustomLunchBox = ref(false)
const openCustomLunchBox = () => {
  showCustomLunchBox.value = true
}
const showCustomLunchBox1 = ref(false)
const showCustomLunchBox2 = ref(false)
const showCustomLunchBox3 = ref(false)
const showCustomLunchBox4 = ref(false)
const showCustomBangdong1 = ref(false)
const showCustomBangdong2 = ref(false)
const showCustomBangdong3 = ref(false)
const showCustomBangdong4 = ref(false)

// 客製經濟盒餐
const customLunchbox1Form = reactive({
  vegetablePotato: 0, // 全素薯泥
  vegetablePotato_sugarZero: 0, // 全素薯泥無糖豆漿
  vegetablePotato_sugarSome: 0, // 全素薯泥微糖豆漿
  vegetablePotato_blackTea: 0, // 全素薯泥紅茶
  vegetablePotato_milkTea: 0, // 全素薯泥奶茶
  vegetablePotato_sweetsoup: 0, // 全素薯泥甜湯
  vegetablePotato_soup: 0, // 全素薯泥湯
  eggPotato: 0, // 蛋薯泥
  eggPotato_sugarZero: 0, // 蛋薯泥無糖豆漿
  eggPotato_sugarSome: 0, // 蛋薯泥微糖豆漿
  eggPotato_blackTea: 0, // 蛋薯泥紅茶
  eggPotato_milkTea: 0, // 蛋薯泥奶茶
  eggPotato_sweetsoup: 0, // 蛋薯泥甜湯
  eggPotato_soup: 0, // 蛋薯泥湯
  potato: 0, // 薯泥
  potato_sugarZero: 0, // 薯泥無糖豆漿
  potato_sugarSome: 0, // 薯泥微糖豆漿
  potato_blackTea: 0, // 薯泥紅茶
  potato_milkTea: 0, // 薯泥奶茶
  potato_sweetsoup: 0, // 薯泥甜湯
  potato_soup: 0, // 薯泥湯
  shrimp: 0, // 炸蝦
  shrimp_sugarZero: 0, // 炸蝦無糖豆漿
  shrimp_sugarSome: 0, // 炸蝦微糖豆漿
  shrimp_blackTea: 0, // 炸蝦紅茶
  shrimp_milkTea: 0, // 炸蝦奶茶
  shrimp_sweetsoup: 0, // 炸蝦甜湯
  shrimp_soup: 0, // 炸蝦湯
  chicken: 0, // 炒雞
  chicken_sugarZero: 0, // 炒雞無糖豆漿
  chicken_sugarSome: 0, // 炒雞微糖豆漿
  chicken_blackTea: 0, // 炒雞紅茶
  chicken_milkTea: 0, // 炒雞奶茶
  chicken_sweetsoup: 0, // 炒雞甜湯
  chicken_soup: 0, // 炒雞湯
  fish: 0, // 酥魚
  fish_sugarZero: 0, // 酥魚無糖豆漿
  fish_sugarSome: 0, // 酥魚微糖豆漿
  fish_blackTea: 0, // 酥魚紅茶
  fish_milkTea: 0, // 酥魚奶茶
  fish_sweetsoup: 0, // 酥魚甜湯
  fish_soup: 0, // 酥魚湯
  pig: 0, // 培根
  pig_sugarZero: 0, // 培根無糖豆漿
  pig_sugarSome: 0, // 培根微糖豆漿
  pig_blackTea: 0, // 培根紅茶
  pig_milkTea: 0, // 培根奶茶
  pig_sweetsoup: 0, // 培根甜湯
  pig_soup: 0, // 培根湯
  meet: 0, // 滷肉
  meet_sugarZero: 0, // 滷肉無糖豆漿
  meet_sugarSome: 0, // 滷肉微糖豆漿
  meet_blackTea: 0, // 滷肉紅茶
  meet_milkTea: 0, // 滷肉奶茶
  meet_sweetsoup: 0, // 滷肉甜湯
  meet_soup: 0, // 滷肉湯
  fried_potato: 0, // 炸地瓜
  eggtart: 0, // 蛋撻
  shortbread: 0, // 酥餅
  chicken_wing: 0, // 雞翅
  fruit: 0, // 水果
  fried_mushroom: 0, // 炸菇
  bake_potato: 0 // 烤地瓜

})
// 客製會議盒餐
const customLunchbox2Form = reactive({
  vegetablePotato: 0, // 全素薯泥
  vegetablePotato_sugarZero: 0, // 全素薯泥無糖豆漿
  vegetablePotato_sugarSome: 0, // 全素薯泥微糖豆漿
  vegetablePotato_blackTea: 0, // 全素薯泥紅茶
  vegetablePotato_milkTea: 0, // 全素薯泥奶茶
  vegetablePotato_sweetsoup: 0, // 全素薯泥甜湯
  vegetablePotato_soup: 0, // 全素薯泥湯
  eggPotato: 0, // 蛋薯泥
  eggPotato_sugarZero: 0, // 蛋薯泥無糖豆漿
  eggPotato_sugarSome: 0, // 蛋薯泥微糖豆漿
  eggPotato_blackTea: 0, // 蛋薯泥紅茶
  eggPotato_milkTea: 0, // 蛋薯泥奶茶
  eggPotato_sweetsoup: 0, // 蛋薯泥甜湯
  eggPotato_soup: 0, // 蛋薯泥湯
  potato: 0, // 薯泥
  potato_sugarZero: 0, // 薯泥無糖豆漿
  potato_sugarSome: 0, // 薯泥微糖豆漿
  potato_blackTea: 0, // 薯泥紅茶
  potato_milkTea: 0, // 薯泥奶茶
  potato_sweetsoup: 0, // 薯泥甜湯
  potato_soup: 0, // 薯泥湯
  shrimp: 0, // 炸蝦
  shrimp_sugarZero: 0, // 炸蝦無糖豆漿
  shrimp_sugarSome: 0, // 炸蝦微糖豆漿
  shrimp_blackTea: 0, // 炸蝦紅茶
  shrimp_milkTea: 0, // 炸蝦奶茶
  shrimp_sweetsoup: 0, // 炸蝦甜湯
  shrimp_soup: 0, // 炸蝦湯
  chicken: 0, // 炒雞
  chicken_sugarZero: 0, // 炒雞無糖豆漿
  chicken_sugarSome: 0, // 炒雞微糖豆漿
  chicken_blackTea: 0, // 炒雞紅茶
  chicken_milkTea: 0, // 炒雞奶茶
  chicken_sweetsoup: 0, // 炒雞甜湯
  chicken_soup: 0, // 炒雞湯
  fish: 0, // 酥魚
  fish_sugarZero: 0, // 酥魚無糖豆漿
  fish_sugarSome: 0, // 酥魚微糖豆漿
  fish_blackTea: 0, // 酥魚紅茶
  fish_milkTea: 0, // 酥魚奶茶
  fish_sweetsoup: 0, // 酥魚甜湯
  fish_soup: 0, // 酥魚湯
  pig: 0, // 培根
  pig_sugarZero: 0, // 培根無糖豆漿
  pig_sugarSome: 0, // 培根微糖豆漿
  pig_blackTea: 0, // 培根紅茶
  pig_milkTea: 0, // 培根奶茶
  pig_sweetsoup: 0, // 培根甜湯
  pig_soup: 0, // 培根湯
  meet: 0, // 滷肉
  meet_sugarZero: 0, // 滷肉無糖豆漿
  meet_sugarSome: 0, // 滷肉微糖豆漿
  meet_blackTea: 0, // 滷肉紅茶
  meet_milkTea: 0, // 滷肉奶茶
  meet_sweetsoup: 0, // 滷肉甜湯
  meet_soup: 0, // 滷肉湯
  fried_potato: 0, // 炸地瓜
  eggtart: 0, // 蛋撻
  shortbread: 0, // 酥餅
  chicken_wing: 0, // 雞翅
  fruit: 0, // 水果
  fried_mushroom: 0, // 炸菇
  bake_potato: 0 // 烤地瓜

})

// 客製貴賓盒餐
const customLunchbox3Form = reactive({
  vegetablePotato: 0, // 全素薯泥
  vegetablePotato_sugarZero: 0, // 全素薯泥無糖豆漿
  vegetablePotato_sugarSome: 0, // 全素薯泥微糖豆漿
  vegetablePotato_blackTea: 0, // 全素薯泥紅茶
  vegetablePotato_milkTea: 0, // 全素薯泥奶茶
  vegetablePotato_sweetsoup: 0, // 全素薯泥甜湯
  vegetablePotato_soup: 0, // 全素薯泥湯
  eggPotato: 0, // 蛋薯泥
  eggPotato_sugarZero: 0, // 蛋薯泥無糖豆漿
  eggPotato_sugarSome: 0, // 蛋薯泥微糖豆漿
  eggPotato_blackTea: 0, // 蛋薯泥紅茶
  eggPotato_milkTea: 0, // 蛋薯泥奶茶
  eggPotato_sweetsoup: 0, // 蛋薯泥甜湯
  eggPotato_soup: 0, // 蛋薯泥湯
  potato: 0, // 薯泥
  potato_sugarZero: 0, // 薯泥無糖豆漿
  potato_sugarSome: 0, // 薯泥微糖豆漿
  potato_blackTea: 0, // 薯泥紅茶
  potato_milkTea: 0, // 薯泥奶茶
  potato_sweetsoup: 0, // 薯泥甜湯
  potato_soup: 0, // 薯泥湯
  shrimp: 0, // 炸蝦
  shrimp_sugarZero: 0, // 炸蝦無糖豆漿
  shrimp_sugarSome: 0, // 炸蝦微糖豆漿
  shrimp_blackTea: 0, // 炸蝦紅茶
  shrimp_milkTea: 0, // 炸蝦奶茶
  shrimp_sweetsoup: 0, // 炸蝦甜湯
  shrimp_soup: 0, // 炸蝦湯
  chicken: 0, // 炒雞
  chicken_sugarZero: 0, // 炒雞無糖豆漿
  chicken_sugarSome: 0, // 炒雞微糖豆漿
  chicken_blackTea: 0, // 炒雞紅茶
  chicken_milkTea: 0, // 炒雞奶茶
  chicken_sweetsoup: 0, // 炒雞甜湯
  chicken_soup: 0, // 炒雞湯
  fish: 0, // 酥魚
  fish_sugarZero: 0, // 酥魚無糖豆漿
  fish_sugarSome: 0, // 酥魚微糖豆漿
  fish_blackTea: 0, // 酥魚紅茶
  fish_milkTea: 0, // 酥魚奶茶
  fish_sweetsoup: 0, // 酥魚甜湯
  fish_soup: 0, // 酥魚湯
  pig: 0, // 培根
  pig_sugarZero: 0, // 培根無糖豆漿
  pig_sugarSome: 0, // 培根微糖豆漿
  pig_blackTea: 0, // 培根紅茶
  pig_milkTea: 0, // 培根奶茶
  pig_sweetsoup: 0, // 培根甜湯
  pig_soup: 0, // 培根湯
  meet: 0, // 滷肉
  meet_sugarZero: 0, // 滷肉無糖豆漿
  meet_sugarSome: 0, // 滷肉微糖豆漿
  meet_blackTea: 0, // 滷肉紅茶
  meet_milkTea: 0, // 滷肉奶茶
  meet_sweetsoup: 0, // 滷肉甜湯
  meet_soup: 0, // 滷肉湯
  fried_potato: 0, // 炸地瓜
  eggtart: 0, // 蛋撻
  shortbread: 0, // 酥餅
  chicken_wing: 0, // 雞翅
  fruit: 0, // 水果
  fried_mushroom: 0, // 炸菇
  bake_potato: 0 // 烤地瓜

})
// 客製首席盒餐
const customLunchbox4Form = reactive({
  vegetablePotato: 0, // 全素薯泥
  vegetablePotato_sugarZero: 0, // 全素薯泥無糖豆漿
  vegetablePotato_sugarSome: 0, // 全素薯泥微糖豆漿
  vegetablePotato_blackTea: 0, // 全素薯泥紅茶
  vegetablePotato_milkTea: 0, // 全素薯泥奶茶
  vegetablePotato_sweetsoup: 0, // 全素薯泥甜湯
  vegetablePotato_soup: 0, // 全素薯泥湯
  eggPotato: 0, // 蛋薯泥
  eggPotato_sugarZero: 0, // 蛋薯泥無糖豆漿
  eggPotato_sugarSome: 0, // 蛋薯泥微糖豆漿
  eggPotato_blackTea: 0, // 蛋薯泥紅茶
  eggPotato_milkTea: 0, // 蛋薯泥奶茶
  eggPotato_sweetsoup: 0, // 蛋薯泥甜湯
  eggPotato_soup: 0, // 蛋薯泥湯
  potato: 0, // 薯泥
  potato_sugarZero: 0, // 薯泥無糖豆漿
  potato_sugarSome: 0, // 薯泥微糖豆漿
  potato_blackTea: 0, // 薯泥紅茶
  potato_milkTea: 0, // 薯泥奶茶
  potato_sweetsoup: 0, // 薯泥甜湯
  potato_soup: 0, // 薯泥湯
  shrimp: 0, // 炸蝦
  shrimp_sugarZero: 0, // 炸蝦無糖豆漿
  shrimp_sugarSome: 0, // 炸蝦微糖豆漿
  shrimp_blackTea: 0, // 炸蝦紅茶
  shrimp_milkTea: 0, // 炸蝦奶茶
  shrimp_sweetsoup: 0, // 炸蝦甜湯
  shrimp_soup: 0, // 炸蝦湯
  chicken: 0, // 炒雞
  chicken_sugarZero: 0, // 炒雞無糖豆漿
  chicken_sugarSome: 0, // 炒雞微糖豆漿
  chicken_blackTea: 0, // 炒雞紅茶
  chicken_milkTea: 0, // 炒雞奶茶
  chicken_sweetsoup: 0, // 炒雞甜湯
  chicken_soup: 0, // 炒雞湯
  fish: 0, // 酥魚
  fish_sugarZero: 0, // 酥魚無糖豆漿
  fish_sugarSome: 0, // 酥魚微糖豆漿
  fish_blackTea: 0, // 酥魚紅茶
  fish_milkTea: 0, // 酥魚奶茶
  fish_sweetsoup: 0, // 酥魚甜湯
  fish_soup: 0, // 酥魚湯
  pig: 0, // 培根
  pig_sugarZero: 0, // 培根無糖豆漿
  pig_sugarSome: 0, // 培根微糖豆漿
  pig_blackTea: 0, // 培根紅茶
  pig_milkTea: 0, // 培根奶茶
  pig_sweetsoup: 0, // 培根甜湯
  pig_soup: 0, // 培根湯
  meet: 0, // 滷肉
  meet_sugarZero: 0, // 滷肉無糖豆漿
  meet_sugarSome: 0, // 滷肉微糖豆漿
  meet_blackTea: 0, // 滷肉紅茶
  meet_milkTea: 0, // 滷肉奶茶
  meet_sweetsoup: 0, // 滷肉甜湯
  meet_soup: 0, // 滷肉湯
  fried_potato: 0, // 炸地瓜
  eggtart: 0, // 蛋撻
  shortbread: 0, // 酥餅
  chicken_wing: 0, // 雞翅
  fruit: 0, // 水果
  fried_mushroom: 0, // 炸菇
  bake_potato: 0 // 烤地瓜

})

// const valid = ref(false)
// const loading = ref(false)

// const onSubmit = async () => {
//   await apiAuth.post('/users', form)
//   await apiAuth.post('/orders', form)
//   // if (!valid.value) return
//   // loading.value = true
//   try {
//     await $q.notify({
//       color: 'green-4',
//       textColor: 'white  ',
//       icon: 'check-circle',
//       message: '新增訂單聯絡人，請繼續點餐'
//     })
//   } catch (error) {
//     $q.notify({
//       color: 'red-4',
//       textColor: 'white',
//       icon: 'error',
//       message: error.message || '發生錯誤'
//     })
//   }
//   loading.value = false
// }

const columns = [
  {
    name: 'index',
    label: '#',
    field: 'index'
  },
  {
    name: 'name',
    required: true,
    label: '商品名稱',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'calories',
    align: 'center',
    label: '主餐',
    field: 'calories',
    sortable: true
  },
  {
    name: 'fat',
    label: '飲料',
    align: 'center',
    field: 'fat',
    sortable: true
  },
  {
    name: 'carbs',
    label: '金額',
    align: 'center',
    field: 'carbs'
  },
  {
    name: 'actions',
    label: '操作',
    field: 'actions',
    align: 'center'
  }
]

// const seed = [
//   {
//     name: '招牌便當X9',
//     calories: '全素X3、炒雞X3、酥魚X3',
//     fat: '無豆X3、紅茶X3、濃湯X3',
//     carbs: 900

//   },
//   {
//     name: '經濟盒餐X9',
//     calories: '全素X3、炒雞X3、酥魚X3',
//     fat: '無豆X3、紅茶X3、甜湯X3',
//     carbs: 900

//   },
//   {
//     name: '客製招牌便當X9',
//     calories: '全素X3、炒雞X3、酥魚X4',
//     fat: '無豆X3、奶茶X3、濃湯X3',
//     carbs: 1800

//   }
// ]

// // we generate lots of rows here
// let rows = []
// for (let i = 1; i < 20; i++) {
//   rows = rows.concat(seed.slice(0).map(r => ({ ...r })))
// }
// rows.forEach((row, index) => {
//   row.index = index + 1
// })
// 招牌便當推入表格
const rows = reactive([])
const submitBandong1Form = () => {
  const currentIndex = rows.length + 1
  const calories = []
  const fat = []

  // 主餐
  if (bangdong1Form.bangdong1Vegetable > 0) {
    calories.push('全素X' + bangdong1Form.bangdong1Vegetable)
  }
  if (bangdong1Form.bangdong1Egg > 0) {
    calories.push('蛋素X' + bangdong1Form.bangdong1Egg)
  }
  if (bangdong1Form.bangdong1Potato > 0) {
    calories.push('薯泥X' + bangdong1Form.bangdong1Potato)
  }
  if (bangdong1Form.bangdong1Shrimp > 0) {
    calories.push('炸蝦X' + bangdong1Form.bangdong1Shrimp)
  }
  if (bangdong1Form.bangdong1Chicken > 0) {
    calories.push('炒雞X' + bangdong1Form.bangdong1Chicken)
  }
  if (bangdong1Form.bangdong1Fish > 0) {
    calories.push('酥魚X' + bangdong1Form.bangdong1Fish)
  }
  if (bangdong1Form.bangdong1Pig > 0) {
    calories.push('培根X' + bangdong1Form.bangdong1Pig)
  }
  if (bangdong1Form.bangdong1Meet > 0) {
    calories.push('滷肉X' + bangdong1Form.bangdong1Meet)
  }

  // 飲料
  if (bangdong1Form.bangdong1SugarZero > 0) {
    fat.push('無豆' + bangdong1Form.bangdong1SugarZero + '杯' + '、')
  }
  if (bangdong1Form.bangdong1SugarSome > 0) {
    fat.push('微豆' + bangdong1Form.bangdong1SugarSome + '杯' + '、')
  }
  if (bangdong1Form.bangdong1BlackTea > 0) {
    fat.push('紅茶' + bangdong1Form.bangdong1BlackTea + '杯' + '、')
  }
  if (bangdong1Form.bangdong1MilkTea > 0) {
    fat.push('奶茶' + bangdong1Form.bangdong1MilkTea + '杯' + '、')
  }
  if (bangdong1Form.bangdong1Sweetsoup > 0) {
    fat.push('甜湯' + bangdong1Form.bangdong1Sweetsoup + '碗' + '、')
  }
  if (bangdong1Form.bangdong1Soup > 0) {
    fat.push('濃湯' + bangdong1Form.bangdong1Soup + '碗' + '、')
  }
  console.log(fat)
  console.log(calories)

  rows.push({
    index: currentIndex,
    name: '招牌便當X' + bangdong1Form.bangdong1Quantity,
    calories
    fat
  })
  console.log(rows)

  // 清空表單資料
  bangdong1Form.bangdong1Quantity = 0
  bangdong1Form.bangdong1Vegetable = 0
  bangdong1Form.bangdong1Egg = 0
  bangdong1Form.bangdong1Potato = 0
  bangdong1Form.bangdong1Shrimp = 0
  bangdong1Form.bangdong1Chicken = 0
  bangdong1Form.bangdong1Fish = 0
  bangdong1Form.bangdong1Pig = 0
  bangdong1Form.bangdong1Meet = 0
  bangdong1Form.bangdong1Breast = 0
  bangdong1Form.bangdong1Beef = 0
  bangdong1Form.bangdong1SugarZero = 0
  bangdong1Form.bangdong1SugarSome = 0
  bangdong1Form.bangdong1BlackTea = 0
  bangdong1Form.bangdong1MilkTea = 0
  bangdong1Form.bangdong1Sweetsoup = 0
  bangdong1Form.bangdong1Sweetsoup = 0
  bangdong1Form.bangdong1Soup = 0
  showbangdong1.value = 'false'
}
const deleteRow = (row) => {
  // 在這裡處理刪除 row 的操作
  // 可以使用 row 參數來取得要刪除的資料

  // 假設 tableData 是您的資料表格的資料陣列
  // 使用 Array.findIndex 找到要刪除的資料的索引
  const index = rows.findIndex(item => item === row)

  if (index !== -1) {
    // 使用 Array.splice 刪除該資料
    rows.splice(index, 1)
  }
}

// function  editRow(index) {
//       // TODO: 在表單中顯示要編輯的資料，並保存變更
//     }
</script >

<style lang="scss" scoped>
.mainMenu{
text-align: center;
 position: relative;
  top: 50%;
  transform: translate(0, 20%);
width: 100vw;

.q-btn{
width: 300px;
height: 300px;
margin: 20px;
margin-top: 50px;
font-size: 50px!important;
}
}
.orderMenucontainer{
  height: 950px;
}

.container {
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 3px;
  width: 1280px;
  height: 1024px;

}
.nav{
  display: flex!important;
  justify-content: space-around!important;
}
.nav button{
  width: 176px;
  height: 176px;
  background: #477DE7;
  color: #FFFFFF;
  font-size: 28px;
  box-shadow: 10px 10px 0px 2px #1564ad;

}

.menu{
  // margin-top: 10px;
  // margin-left: 30px;
  height: 85px;
  margin:25px 30px 0 5px ;
  text-align: center;
  h5{
    font-size: 30px;
  }
  // position: relative;
  // top: 50%;
  // transform: translate(0, -50%);
  .q-btn{
    width: 160px;
  height: 40px;
  background: #477DE7;
  color: #FFFFFF;
  margin: 9px;
  margin-top: 20px;
  /* margin-top: 20px; */
  font-size: 27px;
  box-shadow: 10px 10px 0px 2px #1564ad;
  }

}
.menu .card-body {
  cursor: pointer;
}

.menu .card:hover {
  box-shadow: 0px 0px 10px 1px rgba(255,255,255,0.8);
}

#cancel{
  box-shadow: 10px 10px 0px 0px #f94633;

}

.row {
  max-height: 600px;
}

.slider {
  height: 440px;
  width: 1260px;
  overflow-y: auto;
  background: #dadde0;
  // margin: 10px;
  margin-top: 20px;

   th{
    font-size: 20px!important;
   }
}

#sliderTable{
  .q-table__middle{
        th{
    font-size: 2rem!important;
   }
  }
  }

#fine{

  background: rgb(19 207 107);
  color: #FFFFFF;
  /* margin-top: 20px; */

}

.modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 173%;
    height: 920px;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0,0,0,.2);
    border-radius: 0.3rem;
    outline: 0;
}

.bandongbtn{
  width: 300px;
height: 270px;
  background: #477DE7;
  color: #FFFFFF;
  margin: 52px;
  /* margin-top: 20px; */
  font-size: 40px;
  box-shadow: 10px 10px 0px 2px #1564ad;

}

.bangdongFooterBtn{
    background: red;
    width: 120px;
    height: 66px;
    font-size: 27px;
    color: #FFFFFF;
}
.person{
  height: 369px;
  width:100%;
  margin:0 5px;
  .person-form{
    width: 100%;
  }

}

#bangdongcard{
  width: 630px!important;
  height: 720px;
  .q-input{
    margin-top: 10px;
  }

}
#customBangdongcard{
  width: 700px!important;
  height: 930px;
  h5{
    line-height: 0;
  }
  .q-input{
    margin-top: 10px;
  }

}
#dialogbtnCard{
  width: 650px!important;
  height: 680px;
  overflow: hidden;
  .q-input{
    margin-top: 10px;
  }

}
#solocard{
  width: 50vw!important;
  max-height: 900px;
  // overflow: hidden;
  display: flex;
  overflow-wrap: break-word;
  .q-input{
    margin-top: 3px;
  }

}

.q-dialog__inner--minimized > div {
    max-width: 1270px;
    max-height: 1000px;
}

// .q-dialog--inner--minimized > div[data-v-11ce7a88] {
//     max-width: 1180px;
// }

table,table td,table th{
  border:1px solid #0c0c0c;
  border-collapse:collapse;
  width: 157.7px;
  padding: 7px;
  }
  table{
    height: 314px;

  }
  #lunchbox{
    max-height: 900px;
    .h{
      font-size: 20px;
    }
    h5{
    line-height: 0;
  }
  }
  #customLunchbox{
    max-height: 900px;
    .h{
      font-size: 20px;
    }
    h5{
    line-height: 0;
  }
  }

  #lunchboxbtn{
    width: 657px!important;
    height: 600px;
    .q-btn{
    width: 260px;
    height: 260px;
    margin: 34px;
    // margin-top: 50px;
    font-size: 50px;
    }

  }

</style>
