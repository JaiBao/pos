<template>
  <div class="orderMenucontainer q-pa-lg-lg">
    <q-dialog v-model="showPersonDialog" maximized>
      <div class="q-pa-xs bg-white">
        <div class="text-h6 w-100 orderWho">訂購人資料</div>
        <div class="row w-100 items-center">
          <div class="col-12 row items-center">
            <q-input
              standout="bg-pink-2 text-black"
              class="q-ma-xs checkdate"
              label="訂購日期"
              :input-style="{ fontSize: '20px', color: 'black' }"
              v-model="personForm.checkDate"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer q-mr-xs">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                    v-model="showDatePicker2"
                  >
                    <q-date
                      v-model="personForm.checkDate"
                      @input="$emit('close')"
                      color="accent"
                      mask="YYYY-MM-DD"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input
              standout="bg-pink-2 text-black"
              class="phoneInput"
              v-model="personForm.tel"
              label="訂購人手機"
              @focus="setActiveField(personForm, 'tel')"
              :input-style="{ fontSize: '20px', color: 'black' }"
              :loading="loading"
            />
            <q-input
              class="col q-ml-xs statusSelect"
              standout="bg-pink-2 text-black"
              v-model="personForm.name"
              :input-style="{ fontSize: '17px', color: 'black' }"
              :loading="loading"
              label="訂購人名字"
            />
            <q-option-group
              :options="optionsGender"
              type="radio"
              v-model="personForm.gender"
              dense
              class="optionGroup"
            />
            <q-btn color="accent" class="q-ml-md btndelivery"
              ><div v-show="!personForm.getDate">送達日</div>
              {{ personForm.getDate }}
              <q-popup-proxy
                cover
                v-model="showDatePicker"
                transition-show="scale"
                transition-hide="scale"
                style="width: 800px"
              >
                <q-date
                  v-model="personForm.getDate"
                  @input="$emit('close')"
                  color="accent"
                  mask="YYYY-MM-DD"
                >
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="取消" color="dark" v-close-popup />
                    <q-btn
                      label="確認"
                      color="primary"
                      @click="save"
                      v-close-popup
                    />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>
            <q-input
              class="col q-mr-xs weekday"
              v-model="personForm.week"
              standout="bg-pink-2 text-black"
              label="星期"
              :input-style="{ fontSize: '20px', color: 'black' }"
              readonly
            />
            <q-input
              standout="bg-pink-2 text-black"
              class="q-ma-xs col statusSelect"
              v-model="personForm.time"
              label="送達時間範圍"
              @focus="setActiveField(personForm, 'time')"
              mask="####-####"
              :input-style="{ fontSize: '20px', color: 'black' }"
            />

            <div class="text-h6 phoneH6">市話</div>
            <q-input
              class="col q-ml-xs w-150px"
              standout="bg-pink-2 text-black"
              v-model="personForm.prefix"
              type="text"
              label="區碼"
              @focus="setActiveField(personForm, 'prefix')"
              :input-style="{ fontSize: '20px', color: 'black' }"
            />
            <q-input
              class="col q-ml-xs statusSelect"
              standout="bg-pink-2 text-black"
              type="text"
              ref="hometelRef"
              v-model="personForm.hometel"
              label="市內電話"
              @focus="setActiveField(personForm, 'hometel')"
              :input-style="{ fontSize: '20px', color: 'black' }"
            />
            <q-input
              class="col q-ml-xs w-150px"
              standout="bg-pink-2 text-black"
              v-model="personForm.hometel2"
              type="text"
              label="分機"
              @focus="setActiveField(personForm, 'hometel2')"
              :input-style="{ fontSize: '20px', color: 'black' }"
            />
          </div>
        </div>
        <div class="text-h6 w-100 orderWho2 q-mt-md">收件人資料</div>
        <div class="row w-100 items-center q-mt-md">
          <q-select
            class="col q-ma-xs statusSelect"
            standout="bg-pink-2 text-black"
            v-model="personForm.pick"
            label="取貨方式"
            :options="picks"
            emit-value
            map-options
            :input-style="{ fontSize: '18px', color: 'black' }"
          />
          <q-checkbox
            label="同訂購人資料"
            v-model="personForm.sameOrderCustomer"
            class="q-mr-md"
          />
          <q-option-group
            :options="optionsTaxid"
            type="radio"
            dense
            class="q-mx-md"
            v-model="personForm.noCompilation"
          />
          <q-input
            class="col q-pa-xs statusSelect2"
            standout="bg-pink-2 text-black"
            v-model="personForm.compilation"
            label="統編"
            @focus="setActiveField(personForm, 'compilation')"
            :input-style="{ fontSize: '20px', color: 'black' }"
            :readonly="isCompilationReadonly"
            :loading="invoiceIDfinding"
          />
          <q-input
            class="col q-mx-xs w-100"
            standout="bg-pink-2 text-black "
            v-model="personForm.getCompany"
            label="送達公司"
            :input-style="{ fontSize: '20px', color: 'black' }"
          />
          <q-input
            class="col q-pa-xs"
            standout="bg-pink-2 text-black"
            v-model="personForm.department"
            type="text"
            label="部門"
            :input-style="{ fontSize: '20px', color: 'black' }"
          />
        </div>
        <div class="row w-100 items-center q-mt-md">
          <div class="col-4 q-pa-xs row">
            <q-input
              :input-style="{ fontSize: '20px', color: 'black' }"
              label="收件人"
              v-model="personForm.recipient"
              standout="bg-pink-2 text-black"
              class="col q-ma-xs statusSelect"
            />
            <q-option-group
              :options="optionsGender"
              type="radio"
              v-model="personForm.gender2"
              dense
              class="optionGroup"
            />
            <q-input
              class="statusSelect2"
              standout="bg-pink-2 text-black"
              v-model="personForm.recipientTel"
              @focus="setActiveField(personForm, 'recipientTel')"
              label="收件人手機"
              :input-style="{ fontSize: '20px', color: 'black' }"
            />
          </div>
          <div class="col-8 row items-center">
            <div class="text-h6 q-px-md">送達地址</div>
            <q-select
              class="col q-ma-xs addressSelect"
              standout="bg-pink-2 text-black"
              v-model="personForm.address"
              label="縣市"
              emit-value
              map-options
              :options="address.state"
              :input-style="{ fontSize: '16px', color: 'black' }"
            >
              <template v-if="personForm.address" v-slot:prepend>
                <q-icon
                  name="cancel"
                  @click.stop.prevent="personForm.address = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-select>
            <q-select
              class="col q-ma-xs addressSelect"
              standout="bg-pink-2 text-black"
              v-model="personForm.address2"
              label="區"
              emit-value
              map-options
              :options="address.city"
              :input-style="{ fontSize: '20px', color: 'black' }"
            >
              <template v-if="personForm.address2" v-slot:prepend>
                <q-icon
                  name="cancel"
                  @click.stop.prevent="personForm.address2 = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-select>
            <q-input
              standout="bg-pink-2 text-black"
              class="col q-ma-xs road2input"
              v-model="personForm.road"
              label="路名"
              ref="roadRef"
              nofocus
              @update:model-value="debouncedFetchRoadData()"
              :input-style="{ fontSize: '20px', color: 'black' }"
            >
              <template v-if="personForm.road" v-slot:prepend>
                <q-icon
                  name="cancel"
                  @click.stop.prevent="personForm.road = ''"
                  class="cursor-pointer"
                />
              </template>
              <template v-if="personForm.address" v-slot:append>
                <q-btn
                  v-if="personForm.address"
                  round
                  dense
                  flat
                  icon="add"
                  @click="
                    opendialogRoad(
                      personForm.address,
                      personForm.address2,
                      personForm.road
                    )
                  "
                />
              </template>
              <q-menu no-focus no-parent-event v-model="menuState">
                <div
                  v-if="road.roadselect.length > 0"
                  class="row w-100 items-start"
                >
                  <q-item
                    v-for="road1 of road.roadselect"
                    :key="road1.id"
                    clickable
                    class="q-ma-xs col-1 roadBtn"
                    v-close-popup
                    @click="onItemClick(road1.value, road1.label)"
                  >
                    <q-item-section>
                      <span v-if="personForm.address2"> {{ road1.value }}</span>
                      <span v-else> {{ road1.label }} </span>
                    </q-item-section>
                  </q-item>
                </div>
                <q-spinner
                  v-else
                  color="primary"
                  size="3rem"
                  class="q-ma-xl"
                  :thickness="10"
                />
              </q-menu>
            </q-input>
          </div>
        </div>

        <div class="row w-100 items-center q-mt-md">
          <div class="col-4 row q-pa-md">
            <div v-show="personForm.memberId" class="arrow_box w-100 text-h6">
              會員備註 :
              <q-editor v-model="personForm.comment" min-height="5rem" />
            </div>
          </div>
          <div class="col-8 column">
            <!-- <q-input
              v-if="personForm.memberId!== '' "
              class="col q-ma-xs road2input"
              label="門牌號碼"
              standout="bg-pink-2 text-black"
              v-model="personForm.road2"
              type="text"
              ref="inputRef"
              @focus="setActiveField(personForm, 'road2')"
              :input-style="{ fontSize: '20px', color: 'black' }"
            /> -->
            <div class="col-12 row justify-end items-end text-center">
              <q-input
                class="col"
                standout="bg-pink-2"
                v-model="addressForm.lane"
                label=""
                ref="inputRef"
                :input-style="{ fontSize: '20px' }"
              />
              <div class="text-h6 col">巷</div>
              <q-input
                class="col"
                standout="bg-pink-2"
                v-model="addressForm.alley"
                label=""
                ref="inputRef"
                :input-style="{ fontSize: '20px' }"
              />
              <div class="text-h6 col">弄</div>

              <q-input
                class="col"
                standout="bg-pink-2"
                v-model="addressForm.no"
                label=""
                ref="inputRef"
                :input-style="{ fontSize: '20px' }"
              />
              <div class="text-h6 col">號</div>

              <q-input
                class="col"
                standout="bg-pink-2"
                v-model="addressForm.floor"
                label=""
                ref="inputRef"
                :input-style="{ fontSize: '20px' }"
              />
              <div class="text-h6 col">樓</div>
              <div class="text-h6 col">之</div>
              <q-input
                class="col"
                standout="bg-pink-2"
                v-model="addressForm.at"
                label=""
                ref="inputRef"
                :input-style="{ fontSize: '20px' }"
              />

              <q-input
                class="col"
                standout="bg-pink-2"
                v-model="addressForm.room"
                label=""
                ref="inputRef"
                :input-style="{ fontSize: '20px' }"
              />
              <div class="text-h6 col">室</div>
            </div>
            <div class="col-12 row items-center q-mt-md q-gutter-x-md">
              <q-select
                standout="bg-pink-2 text-black"
                v-model="personForm.find_us"
                label="哪裡得知"
                :options="findUsOptions"
                emit-value
                map-options
                option-value="code"
                option-label="name"
                class="col"
              />

              <q-select
                standout="bg-pink-2 text-black"
                class="col"
                v-model="personForm.event"
                multiple
                :options="eventOptions"
                use-chips
                stack-label
                label="訂單分類"
                emit-value
                map-options
                use-input
              />
              <q-input
                standout="bg-pink-2 text-black"
                v-model="personForm.fuck"
                label="控單表"
                lazy-rules
                class="col"
              />
              <!-- <q-select
                standout="bg-pink-2 text-black"
                v-model="personForm.locationId"
                label="店家選擇"
                :options="locationIds"
                lazy-rules
                class="selectLocation col w-130px"
              /> -->
              <q-input
                class="col"
                standout="bg-pink-2 text-black"
                v-model="personForm.delivery_date_hi"
                label="出餐時間"
                @focus="setActiveField(personForm, 'delivery_date_hi')"
                :input-style="{ fontSize: '20px', color: 'black' }"
              />
            </div>
          </div>
        </div>

        <div class="row w-100 q-mt-md">
          <div class="col-2"></div>
        </div>
        <div class="row w-100 items-center">
          <div class="row w-100 items-center">
            <div class="col-4 row items-center"></div>
            <div class="col-8 row items-center justify-end"></div>
          </div>
        </div>
        <div class="row w-100 items-center q-mt-md">
          <div class="col-12 row items-center">
            <q-input
              standout="bg-pink-2 text-black"
              v-model="personForm.remark"
              label="訂單備註"
              @focus="setActiveField(personForm, 'remark')"
              :input-style="{ fontSize: '20px', color: 'black' }"
              @input="showDialog2"
              class="col q-mx-xs"
            />
            <q-input
              standout="bg-pink-2 text-black"
              class="col q-mx-xs"
              v-model="mealRemark"
              label="餐點備註"
              @input="showDialog"
            />
          </div>
        </div>
        <div class="row w-100 justify-end btnSubmit">
          <SmallKeypad
            v-show="keypad"
            @keypadInput="handleKeypadInput"
            class="col-3"
          />
          <div class="col-1">
            <q-btn icon="keyboard" @click="keypad = !keypad" round size="md" />
          </div>

          <q-btn
            outline
            class="col-1 submitBtn q-mx-xs"
            label="退出表單"
            @click="showPersonDialog = false"
            to="/search"
          />
          <q-btn
            outline
            class="col-1 submitBtn q-mx-xs"
            @click="addOrderFirst()"
            label="保留單"
          />
          <q-btn
            outline
            class="col-1 submitBtn q-mx-xs"
            @click="onReset()"
            label="清除表格"
          />
          <q-btn
            outline
            class="col-1 submitBtn"
            color="accent"
            @click="memerSave"
            label="下一步"
          />
        </div>
        <div class="row w-100 justify-end">
          <!--
                <SmallKeypad @keypadInput="handleKeypadInput" />
                <div class="genderRadio col-2">
                    <q-btn
                      label="送達開始"
                      color="primary"
                      style="width: 100px; height: 40px"
                    >
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time
                          format24h
                          v-model="personForm.time1"
                          @input="$emit('close')"
                          color="orange"
                        >
                        </q-time>
                      </q-popup-proxy>
                    </q-btn>
                    <q-btn
                      label="送達結束"
                      color="secondary"
                      style="width: 100px; height: 40px"
                    >
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time
                          format24h
                          v-model="personForm.time2"
                          @input="$emit('close')"
                          color="green"
                        >
                        </q-time>
                      </q-popup-proxy>
                    </q-btn>
                  </div> -->
        </div>
      </div>
    </q-dialog>
    <!-- 點單按鈕 -->
    <div class="row w-100 justify-start items-center q-pa-md bg-dark">
      <div v-show="!meal.id" class="q-ma-none text-h5 col-1 text-white">
        建立訂單
      </div>
      <div v-show="meal.id" class="q-ma-none text-h5 col-1 text-white">
        修改訂單
      </div>
      <p v-show="meal.id" class="q-ma-none col-2 text-white">
        訂單編號: {{ meal.id }}
      </p>
      <div class="col"></div>
      <div class="col-8 tableMember items-center justify-end row">
        <p v-show="personForm.memberId">會員編號: {{ personForm.memberId }}</p>
        <p v-show="personForm.name">訂購人: {{ personForm.name }}</p>
        <p v-show="personForm.tel">訂購人電話: {{ personForm.tel }}</p>
        <p v-show="personForm.hometel">
          訂購人室內電話: {{ personForm.prefix }} {{ personForm.hometel }} #{{
            personForm.hometel2
          }}
        </p>
      </div>
      <div class="col-1">
        <q-btn
          v-show="!meal.id"
          color="warning"
          round
          size="16px"
          @click="addPerson"
          icon="edit"
          class="q-mx-md"
          text-color="black"
        />
      </div>
    </div>
    <div

      class="row menu text-left w-100 items-center q-mb-md"
      data-order-panel
    >
      <q-select
        filled
        v-model="personForm.orderStatu"
        label="訂單狀態"
        :options="orderStatus"
        emit-value
        map-options
        color="accent"
        class="q-mx-lg w-300px col-2"
      />
      <div class="col-1"></div>
      <h5>開始點餐</h5>
      <q-btn
        @click="openbangdong"
        text-color="black"
        color="warning"
        label="便當"
        class="col"
      />
      <q-btn
        color="warning"
        label="盒餐"
        text-color="black"
        @click="openlunchBox"
        class="col"
      />
      <q-btn
        color="warning"
        label="單點"
        text-color="black"
        @click="opensolo"
        class="col"
      />
      <q-btn
        color="warning"
        label="客製便當"
        @click="openCustomBangdong"
        class="col"
        text-color="black"
      />
      <q-btn
        color="warning"
        label="客製盒餐"
        @click="openCustomLunchBox"
        class="col"
        text-color="black"
      />

      <!-- 便當 dailog -->
      <q-dialog v-model="showbangdong">
        <q-card class="column" id="dialogbtnBangdongCard">
          <div class="col-2 row justify-end h-40px q-my-md">
            <div class="col-1">
              <q-btn
                @click="showbangdong = false"
                round
                icon="close"
                color="dark"
              />
            </div>
          </div>
          <!-- 便當按鈕 -->
          <div class="items-center justify-center row w-100 q-ma-auto col-10">
            <q-btn
              color="dark"
              class="col-5 btnBangdong"
              :label="bangdong1Name"
              @click="
                showbangdong1 = true;
                showbangdong = false;
              "
            />
            <q-btn
              color="dark"
              class="col-5 btnBangdong"
              :label="bangdong2Name"
              @click="
                showbangdong2 = true;
                showbangdong = false;
              "
            />
            <q-btn
              color="dark"
              class="col-5 btnBangdong"
              :label="bangdong3Name"
              @click="
                showbangdong3 = true;
                showbangdong = false;
              "
            />
            <q-btn
              color="dark"
              class="col-5 btnBangdong"
              :label="bangdong4Name"
              @click="
                showbangdong4 = true;
                showbangdong = false;
              "
            />
            <q-btn
              color="dark"
              class="col-5 btnBangdong"
              :label="bangdongVegetarian1Name"
              @click="
                showbangdongVegetarian1 = true;
                showbangdong = false;
              "
            />
            <q-btn
              color="dark"
              class="col-5 btnBangdong"
              :label="bangdongVegetarian2Name"
              @click="
                showbangdongVegetarian2 = true;
                showbangdong = false;
              "
            />
            <q-btn
              color="dark"
              class="col-5 btnBangdong"
              :label="bangdongSalmonName"
              @click="
                showbangdongSalmon = true;
                showbangdong = false;
              "
            />
            <div class="btnBangdong col-5"></div>
            <!--    @click="showbangdong = false" -->
          </div>
        </q-card>
      </q-dialog>
        <!-- 招牌便當 dialog -->
      <q-dialog v-model="showbangdong1" maximized>
        <q-card
          class="items-start word-break q-pa-none q-ma-none"
          id="bangdongcard"
        >
          <div class="color2 bangdongdialog row items-center text-white">
            <div class="text-h5 col-1">{{ bangdong1Name }}</div>
            <div class="text-h5 q-ml-md col-2 row items-center">
              總計
              <q-input
                filled
                type="number"
                class="w-110px q-ml-lg"
                :input-style="{ fontSize: '20px' }"
                v-model.number="bangdong1TotalQuantity"
                :bg-color="getInputColor(bangdong1TotalQuantity)"
                label="數量總計"
                min="0"
              />
            </div>
            <div class="col"></div>
            <q-input
              filled
              type="number"
              label-color="white"
              class="q-ma-xs w-110px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong1Arbitrarily"
              label="任意搭配"
              min="0"
            />
            <q-input
              min="0"
              filled
              label-color="white"
              class="q-ma-xs w-110px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong1Price"
              label="商品單價"
              readonly
            />
            <q-input
              filled
              label-color="white"
              class="q-ma-xs w-150px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong1TotalQuantityPrice"
              label="餐點總計"
              readonly
              min="0"
            />
            <q-input
              filled
              label-color="white"
              class="q-ma-xs w-150px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong1optionPrice"
              label="選項總計"
              readonly
              min="0"
            />
            <q-input
              filled
              label-color="white"
              class="q-ma-xs w-150px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong1finalTotal"
              label="總計"
              readonly
              min="0"
            />
          </div>
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">{{ bangdong1MainName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdong1Main, index) in bangdong1Mains"
                :key="index"
                class="flex-auto q-ma-none q-pa-none"
              >
                <q-input
                  v-model.number="bangdong1Main.quantity"
                  :label="bangdong1Main.shortname"
                  :bg-color="getInputColor(bangdong1Main.quantity)"
                  class="q-ma-xs w-110px"
                  filled
                  type="number"
                  :input-style="{
                    fontSize: '20px',
                    margin: '0',
                    color: 'black',
                  }"
                  :label-style="{ fontSize: '20px' }"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 飲料 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">{{ bangdong1DrinkName }}</h5>
            <div class="row items-center" style="height: 100%">
              <q-item
                v-for="(bangdong1Drink, index) in bangdong1Drinks"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdong1Drink.quantity"
                  :label="bangdong1Drink.name"
                  :bg-color="getInputColor(bangdong1Drink.quantity)"
                  class="q-ma-xs w-110px"
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 配菜 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">{{ bangdong1SideDishName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdong1SideDish, index) in bangdong1SideDishes"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdong1SideDish.quantity"
                  :label="bangdong1SideDish.name"
                  :bg-color="getInputColor(bangdong1SideDish.quantity)"
                  filled
                  type="number"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 總計 -->

          <!-- 備註 -->
          <div class="color1 w-100 q-pa-xs q-mx-lg q-mt-xl">
            <div class="row w-100 justify-between">
              <q-input
                :bg-color="inputColor"
                outlined
                v-model="bangdong1Comment"
                label="商品備註"
                class="col-8"
              />

              <q-btn
                color="dark"
                label="取消"
                size="25px"
                @click="Resetbangdong1"
                class="q-mx-xs btnSubmitCancel"
              />
              <q-btn
                color="primary"
                label="送出"
                type="submit"
                size="25px"
                class="q-mx-xs btnSubmitCancel"
                @click="submitBangdong1"
              />
            </div>
          </div>
        </q-card>
      </q-dialog>
      <!-- 招牌便當 dialog -->
      <q-dialog v-model="showbangdong1" maximized>
        <q-card
          class="items-start word-break q-pa-none q-ma-none"
          id="bangdongcard"
        >
          <div class="color2 bangdongdialog row items-center text-white">
            <div class="text-h5 col-1">{{ bangdong1Name }}</div>
            <div class="text-h5 q-ml-md col-2 row items-center">
              總計
              <q-input
                filled
                type="number"
                class="w-110px q-ml-lg"
                :input-style="{ fontSize: '20px' }"
                v-model.number="bangdong1TotalQuantity"
                :bg-color="getInputColor(bangdong1TotalQuantity)"
                label="數量總計"
                min="0"
              />
            </div>
            <div class="col"></div>
            <q-input
              filled
              type="number"
              label-color="white"
              class="q-ma-xs w-110px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong1Arbitrarily"
              label="任意搭配"
              min="0"
            />
            <q-input
              min="0"
              filled
              label-color="white"
              class="q-ma-xs w-110px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong1Price"
              label="商品單價"
              readonly
            />
            <q-input
              filled
              label-color="white"
              class="q-ma-xs w-150px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong1TotalQuantityPrice"
              label="餐點總計"
              readonly
              min="0"
            />
            <q-input
              filled
              label-color="white"
              class="q-ma-xs w-150px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong1optionPrice"
              label="選項總計"
              readonly
              min="0"
            />
            <q-input
              filled
              label-color="white"
              class="q-ma-xs w-150px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong1finalTotal"
              label="總計"
              readonly
              min="0"
            />
          </div>
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">{{ bangdong1MainName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdong1Main, index) in bangdong1Mains"
                :key="index"
                class="flex-auto q-ma-none q-pa-none"
              >
                <q-input
                  v-model.number="bangdong1Main.quantity"
                  :label="bangdong1Main.shortname"
                  :bg-color="getInputColor(bangdong1Main.quantity)"
                  class="q-ma-xs w-110px"
                  filled
                  type="number"
                  :input-style="{
                    fontSize: '20px',
                    margin: '0',
                    color: 'black',
                  }"
                  :label-style="{ fontSize: '20px' }"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 飲料 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">{{ bangdong1DrinkName }}</h5>
            <div class="row items-center" style="height: 100%">
              <q-item
                v-for="(bangdong1Drink, index) in bangdong1Drinks"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdong1Drink.quantity"
                  :label="bangdong1Drink.name"
                  :bg-color="getInputColor(bangdong1Drink.quantity)"
                  class="q-ma-xs w-110px"
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 配菜 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">{{ bangdong1SideDishName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdong1SideDish, index) in bangdong1SideDishes"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdong1SideDish.quantity"
                  :label="bangdong1SideDish.name"
                  :bg-color="getInputColor(bangdong1SideDish.quantity)"
                  filled
                  type="number"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 總計 -->

          <!-- 備註 -->
          <div class="color1 w-100 q-pa-xs q-mx-lg q-mt-xl">
            <div class="row w-100 justify-between">
              <q-input
                :bg-color="inputColor"
                outlined
                v-model="bangdong1Comment"
                label="商品備註"
                class="col-8"
              />

              <q-btn
                color="dark"
                label="取消"
                size="25px"
                @click="Resetbangdong1"
                class="q-mx-xs btnSubmitCancel"
              />
              <q-btn
                color="primary"
                label="送出"
                type="submit"
                size="25px"
                class="q-mx-xs btnSubmitCancel"
                @click="submitBangdong1"
              />
            </div>
          </div>
        </q-card>
      </q-dialog>
      <!-- 雞胸便當 dailog -->
      <q-dialog v-model="showbangdong2" maximized>
        <q-card
          class="items-start word-break q-pa-none q-ma-none"
          id="bangdongcard"
        >
          <div class="color2 bangdongdialog row items-center text-white">
            <div class="text-h5 col-1">{{ bangdong2Name }}</div>
            <div class="text-h5 q-ml-md col-2 row items-center">
              總計
              <q-input
                filled
                type="number"
                class="w-110px q-ml-lg"
                :input-style="{ fontSize: '20px' }"
                v-model.number="bangdong2TotalQuantity"
                :bg-color="getInputColor(bangdong2TotalQuantity)"
                label="數量總計"
                min="0"
              />
            </div>
            <div class="col"></div>
            <q-input
              filled
              type="number"
              label-color="white"
              class="q-ma-xs w-110px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong2Arbitrarily"
              label="任意搭配"
              min="0"
            />
            <q-input
              min="0"
              type="number"
              filled
              label-color="white"
              class="q-ma-xs w-110px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong2Price"
              label="商品單價"
              readonly
            />
            <q-input
              filled
              type="number"
              label-color="white"
              class="q-ma-xs w-150px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong2TotalQuantityPrice"
              label="餐點總計"
              readonly
              min="0"
            />
            <q-input
              filled
              label-color="white"
              class="q-ma-xs w-150px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong2optionPrice"
              label="選項總計"
              readonly
              min="0"
            />
            <q-input
              filled
              label-color="white"
              class="q-ma-xs w-150px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong2finalTotal"
              label="總計"
              readonly
              min="0"
            />
          </div>
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">{{ bangdong2MainName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdong2Main, index) in bangdong2Mains"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdong2Main.quantity"
                  :bg-color="getInputColor(bangdong2Main.quantity)"
                  :label="bangdong2Main.shortname"
                  filled
                  class="q-ma-xs w-110px"
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 飲料 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">{{ bangdong2DrinkName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdong2Drink, index) in bangdong2Drinks"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdong2Drink.quantity"
                  :bg-color="getInputColor(bangdong2Drink.quantity)"
                  :label="bangdong2Drink.name"
                  filled
                  type="number"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 副主餐 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">{{ bangdong2BentoMainName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdong2BentoMain, index) in bangdong2BentoMains"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdong2BentoMain.quantity"
                  :bg-color="getInputColor(bangdong2BentoMain.quantity)"
                  :label="bangdong2BentoMain.name"
                  filled
                  type="number"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 配菜 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">{{ bangdong2SideDishName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdong2SideDish, index) in bangdong2SideDishes"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdong2SideDish.quantity"
                  :label="bangdong2SideDish.name"
                  :bg-color="getInputColor(bangdong2SideDish.quantity)"
                  filled
                  type="number"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 總計 -->
          <div class="color1 bangdongdialog">
            <!-- 按鈕 -->
            <div class="row q-mt-xl w-100 items-center justify-between">
              <q-input
                outlined
                :bg-color="inputColor"
                v-model="bangdong2Comment"
                label="商品備註"
                class="col-8"
              />
              <q-btn
                color="dark"
                label="取消"
                size="25px"
                class="q-mx-xs btnSubmitCancel"
                @click="Resetbangdong2"
              />
              <q-btn
                color="primary"
                label="送出"
                type="submit"
                size="25px"
                class="q-mx-xs btnSubmitCancel"
                @click="submitBangdong2"
              />
            </div>
          </div>
        </q-card>
      </q-dialog>
      <!-- 雞腿便當 dailog -->
      <q-dialog v-model="showbangdong3" maximized>
        <q-card
          class="items-start word-break q-pa-none q-ma-none"
          id="bangdongcard"
        >
          <div class="color2 bangdongdialog row items-center text-white">
            <div class="text-h5 col-1">{{ bangdong3Name }}</div>
            <div class="text-h5 q-ml-md col-2 row items-center">
              總計
              <q-input
                filled
                type="number"
                class="w-110px q-ml-lg"
                :input-style="{ fontSize: '20px' }"
                v-model.number="bangdong3TotalQuantity"
                :bg-color="getInputColor(bangdong3TotalQuantity)"
                label="數量總計"
                min="0"
              />
            </div>
            <div class="col"></div>
            <q-input
              filled
              type="number"
              label-color="white"
              class="q-ma-xs w-110px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong3Arbitrarily"
              label="任意搭配"
              min="0"
            />
            <q-input
              min="0"
              filled
              label-color="white"
              class="q-ma-xs w-110px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong3Price"
              label="商品單價"
              readonly
            />
            <q-input
              filled
              label-color="white"
              class="q-ma-xs w-150px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong3TotalQuantityPrice"
              label="餐點總計"
              readonly
              min="0"
            />
            <q-input
              filled
              label-color="white"
              class="q-ma-xs w-150px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong3optionPrice"
              label="選項總計"
              readonly
              min="0"
            />
            <q-input
              filled
              label-color="white"
              class="q-ma-xs w-150px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong3finalTotal"
              label="總計"
              readonly
              min="0"
            />
          </div>
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">{{ bangdong3MainName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdong3Main, index) in bangdong3Mains"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdong3Main.quantity"
                  :label="bangdong3Main.shortname"
                  filled
                  type="number"
                  :bg-color="getInputColor(bangdong3Main.quantity)"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 飲料 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">{{ bangdong3DrinkName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdong3Drink, index) in bangdong3Drinks"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdong3Drink.quantity"
                  :label="bangdong3Drink.name"
                  filled
                  :bg-color="getInputColor(bangdong3Drink.quantity)"
                  type="number"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 副主餐 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">{{ bangdong3BentoMainName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdong3BentoMain, index) in bangdong3BentoMains"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdong3BentoMain.quantity"
                  :label="bangdong3BentoMain.name"
                  filled
                  :bg-color="getInputColor(bangdong3BentoMain.quantity)"
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '40px' }"
                  class="q-ma-xs w-110px"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 配菜 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">{{ bangdong3SideDishName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdong3SideDish, index) in bangdong3SideDishes"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdong3SideDish.quantity"
                  :label="bangdong3SideDish.name"
                  :bg-color="getInputColor(bangdong3SideDish.quantity)"
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  class="q-ma-xs w-110px"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 總計 -->
          <div class="color1 w-100 q-pa-xs q-mx-lg q-mt-xl">
            <div class="row w-100 justify-between">
              <q-input
                :bg-color="inputColor"
                v-model="bangdong3Comment"
                label="商品備註"
                outlined
                class="col-8"
              />
              <q-btn
                color="dark"
                label="取消"
                @click="Resetbangdong3"
                class="q-mx-xs btnSubmitCancel"
                size="25px"
              />
              <q-btn
                color="primary"
                label="送出"
                type="submit"
                class="q-mx-xs btnSubmitCancel"
                size="25px"
                @click="submitBangdong3"
              />
            </div>
          </div>
        </q-card>
      </q-dialog>
      <!-- 滷牛便當 dailog -->
      <q-dialog v-model="showbangdong4" maximized>
        <q-card
          class="items-start word-break q-pa-none q-ma-none"
          id="bangdongcard"
        >
          <div class="color2 bangdongdialog row items-center text-white">
            <div class="text-h5 col-1">{{ bangdong4Name }}</div>
            <div class="text-h5 q-ml-md col-2 row items-center">
              總計
              <q-input
                filled
                type="number"
                class="w-110px q-ml-lg"
                :input-style="{ fontSize: '20px' }"
                v-model.number="bangdong4TotalQuantity"
                :bg-color="getInputColor(bangdong4TotalQuantity)"
                label="數量總計"
                min="0"
              />
            </div>
            <div class="col"></div>
            <q-input
              filled
              type="number"
              label-color="white"
              class="q-ma-xs w-110px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong4Arbitrarily"
              label="任意搭配"
              min="0"
            />
            <q-input
              min="0"
              filled
              label-color="white"
              class="q-ma-xs w-110px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong4Price"
              label="商品單價"
              readonly
            />
            <q-input
              filled
              label-color="white"
              class="q-ma-xs w-150px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong4TotalQuantityPrice"
              label="餐點總計"
              readonly
              min="0"
            />
            <q-input
              filled
              label-color="white"
              class="q-ma-xs w-150px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong4optionPrice"
              label="選項總計"
              readonly
              min="0"
            />
            <q-input
              filled
              label-color="white"
              class="q-ma-xs w-150px text-white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdong4finalTotal"
              label="總計"
              readonly
              min="0"
            />
          </div>

          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">{{ bangdong4MainName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdong4Main, index) in bangdong4Mains"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdong4Main.quantity"
                  :label="bangdong4Main.shortname"
                  filled
                  :bg-color="getInputColor(bangdong4Main.quantity)"
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  class="q-ma-xs w-110px"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 飲料 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">{{ bangdong4DrinkName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdong4Drink, index) in bangdong4Drinks"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdong4Drink.quantity"
                  :label="bangdong4Drink.name"
                  :bg-color="getInputColor(bangdong4Drink.quantity)"
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  class="q-ma-xs w-110px"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 副主餐 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">{{ bangdong4BentoMainName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdong4BentoMain, index) in bangdong4BentoMains"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdong4BentoMain.quantity"
                  :label="bangdong4BentoMain.name"
                  filled
                  type="number"
                  :bg-color="getInputColor(bangdong4BentoMain.quantity)"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  class="q-ma-xs w-110px"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 配菜 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">{{ bangdong4SideDishName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdong4SideDish, index) in bangdong4SideDishes"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdong4SideDish.quantity"
                  :label="bangdong4SideDish.name"
                  filled
                  type="number"
                  :bg-color="getInputColor(bangdong4SideDish.quantity)"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  class="q-ma-xs w-110px"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 總計 -->
          <!-- 按鈕 -->
          <div class="row items-center q-ml-md w-100 q-mt-xl">
            <q-input
              v-model="bangdong4Comment"
              label="商品備註"
              outlined
              :bg-color="inputColor"
              class="col-9"
            />
            <q-btn
              color="dark"
              label="取消"
              @click="Resetbangdong4"
              size="25px"
              class="q-mx-xs btnSubmitCancel"
            />
            <q-btn
              color="primary"
              label="送出"
              size="25px"
              class="q-mx-xs btnSubmitCancel"
              @click="submitBangdong4"
            />
          </div>
        </q-card>
      </q-dialog>
      <!-- 鮭魚 dialog -->
      <q-dialog v-model="showbangdongSalmon" maximized>
        <q-card
          class="items-start word-break q-pa-none q-ma-none"
          id="bangdongcard"
        >
          <div class="color2 bangdongdialog row items-center text-white">
            <div class="text-h5 col-1">{{ bangdongSalmonName }}</div>
            <div class="text-h5 q-ml-md col-2 row items-center">
              總計
              <q-input
                filled
                type="number"
                class="w-110px q-ml-lg"
                :input-style="{ fontSize: '20px' }"
                v-model.number="bangdongSalmonTotalQuantity"
                :bg-color="getInputColor(bangdongSalmonTotalQuantity)"
                label="數量總計"
                min="0"
              />
            </div>
            <div class="col"></div>
            <q-input
              filled
              type="number"
              :input-style="{ fontSize: '20px', color: 'white' }"
              label-color="white"
              v-model.number="bangdongSalmonArbitrarily"
              label="任意搭配"
              class="q-ma-xs w-110px text-white"
              min="0"
            />
            <q-input
              min="0"
              filled
              type="number"
              label-color="white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdongSalmonPrice"
              label="商品單價"
              class="q-ma-xs w-110px"
              readonly
            />
            <q-input
              filled
              type="number"
              :input-style="{ fontSize: '20px', color: 'white' }"
              class="q-ma-xs w-150px text-white"
              v-model.number="bangdongSalmonTotalQuantityPrice"
              label="餐點總計"
              label-color="white"
              readonly
              min="0"
            />
            <q-input
              filled
              type="number"
              :input-style="{ fontSize: '20px', color: 'white' }"
              class="q-ma-xs w-150px text-white"
              v-model.number="bangdongSalmonoptionPrice"
              label="選項總計"
              label-color="white"
              readonly
              min="0"
            />
            <q-input
              filled
              type="number"
              :input-style="{ fontSize: '20px', color: 'white' }"
              class="q-ma-xs w-150px text-white"
              v-model.number="bangdongSalmonfinalTotal"
              label="總計"
              label-color="white"
              readonly
              min="0"
            />
          </div>
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">{{ bangdongSalmonMainName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdongSalmonMain, index) in bangdongSalmonMains"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdongSalmonMain.quantity"
                  :label="bangdongSalmonMain.shortname"
                  filled
                  :bg-color="getInputColor(bangdongSalmonMain.quantity)"
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  class="q-ma-xs w-110px"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 飲料 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">{{ bangdongSalmonDrinkName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdongSalmonDrink, index) in bangdongSalmonDrinks"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdongSalmonDrink.quantity"
                  :label="bangdongSalmonDrink.name"
                  filled
                  type="number"
                  :bg-color="getInputColor(bangdongSalmonDrink.quantity)"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  class="q-ma-xs w-110px"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 副主餐 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">
              {{ bangdongSalmonBentoMainName }}
            </h5>
            <div class="row items-center">
              <q-item
                v-for="(
                  bangdongSalmonBentoMain, index
                ) in bangdongSalmonBentoMains"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdongSalmonBentoMain.quantity"
                  :label="bangdongSalmonBentoMain.name"
                  filled
                  type="number"
                  :bg-color="getInputColor(bangdongSalmonBentoMain.quantity)"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  class="q-ma-xs w-110px"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 配菜 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">
              {{ bangdongSalmonSideDishName }}
            </h5>
            <div class="row items-center">
              <q-item
                v-for="(
                  bangdongSalmonSideDish, index
                ) in bangdongSalmonSideDishes"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdongSalmonSideDish.quantity"
                  :label="bangdongSalmonSideDish.name"
                  filled
                  type="number"
                  :bg-color="getInputColor(bangdongSalmonSideDish.quantity)"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  class="q-ma-xs w-110px"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 總計 -->
          <div class="color1 bangdongdialog">
            <div class="row"></div>
          </div>
          <!-- 按鈕 -->
          <div class="row items-center q-ml-md" style="width: 100%">
            <q-input
              v-model="bangdongSalmonComment"
              label="商品備註"
              :bg-color="inputColor"
              outlined
              class="col-9"
            />
            <q-btn
              color="dark"
              label="取消"
              size="25px"
              @click="ResetbangdongSalmon"
              class="q-mx-xs btnSubmitCancel"
            />
            <q-btn
              color="primary"
              label="送出"
              type="submit"
              size="25px"
              class="q-mx-xs btnSubmitCancel"
              @click="submitBangdongSalmon"
            />
          </div>
        </q-card>
      </q-dialog>
      <!-- 素食便當 125dialog -->
      <q-dialog v-model="showbangdongVegetarian1" maximized>
        <q-card
          class="items-start word-break q-pa-none q-ma-none"
          id="bangdongcard"
        >
          <div class="color2 bangdongdialog row items-center text-white">
            <div class="text-h5 col-1">{{ bangdongVegetarian1Name }}</div>
            <div class="text-h5 q-ml-md col-2 row items-center">
              總計
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px' }"
                v-model="bangdongVegetarian1TotalQuantity"
                :bg-color="getInputColor(bangdongVegetarian1TotalQuantity)"
                label="數量總計"
                class="q-ma-xs w-110px"
                min="0"
              />
            </div>
            <div class="col"></div>
            <q-input
              filled
              type="number"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdongVegetarian1Arbitrarily"
              label="任意搭配"
              label-color="white"
              class="q-ma-xs w-110px text-white"
              min="0"
            />
            <q-input
              min="0"
              filled
              type="number"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdongVegetarian1Price"
              label="商品單價"
              label-color="white"
              class="q-ma-xs w-110px text-white"
              readonly
            />
            <q-input
              filled
              type="number"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdongVegetarian1TotalQuantityPrice"
              label="餐點總計"
              readonly
              label-color="white"
              class="q-ma-xs w-150px text-white"
              min="0"
            />
            <q-input
              filled
              type="number"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdongVegetarian1optionPrice"
              label="選項總計"
              readonly
              label-color="white"
              class="q-ma-xs w-150px text-white"
              min="0"
            />
            <q-input
              filled
              type="number"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdongVegetarian1finalTotal"
              label="總計"
              readonly
              label-color="white"
              class="q-ma-xs w-150px text-white"
              min="0"
            />
          </div>
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">
              {{ bangdongVegetarian1MainName }}
            </h5>
            <div class="row items-center">
              <q-item
                v-for="(
                  bangdongVegetarian1Main, index
                ) in bangdongVegetarian1Mains"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdongVegetarian1Main.quantity"
                  :bg-color="getInputColor(bangdongVegetarian1Main.quantity)"
                  :label="bangdongVegetarian1Main.shortname"
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  class="q-ma-xs w-110px"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 飲料 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">
              {{ bangdongVegetarian1DrinkName }}
            </h5>
            <div class="row items-center">
              <q-item
                v-for="(
                  bangdongVegetarian1Drink, index
                ) in bangdongVegetarian1Drinks"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdongVegetarian1Drink.quantity"
                  :bg-color="getInputColor(bangdongVegetarian1Drink.quantity)"
                  :label="bangdongVegetarian1Drink.name"
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  class="q-ma-xs w-110px"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 副主餐 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">
              {{ bangdongVegetarian1BentoMainName }}
            </h5>
            <div class="row items-center">
              <q-item
                v-for="(
                  bangdongVegetarian1BentoMain, index
                ) in bangdongVegetarian1BentoMains"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdongVegetarian1BentoMain.quantity"
                  :bg-color="
                    getInputColor(bangdongVegetarian1BentoMain.quantity)
                  "
                  :label="bangdongVegetarian1BentoMain.name"
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  class="q-ma-xs w-110px"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 配菜 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">
              {{ bangdongVegetarian1SideDishName }}
            </h5>
            <div class="row items-center">
              <q-item
                v-for="(
                  bangdongVegetarian1SideDish, index
                ) in bangdongVegetarian1SideDishes"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdongVegetarian1SideDish.quantity"
                  :label="bangdongVegetarian1SideDish.name"
                  :bg-color="
                    getInputColor(bangdongVegetarian1SideDish.quantity)
                  "
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  class="q-ma-xs w-110px"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 總計 -->
          <div class="color1 bangdongdialog">
            <div class="row"></div>
          </div>
          <div class="row items-center q-ml-md" style="width: 100%">
            <q-input
              v-model="bangdongVegetarian1Comment"
              label="商品備註"
              :bg-color="inputColor"
              class="col-9"
              outlined
            />
            <q-btn
              color="dark"
              label="取消"
              size="25px"
              @click="ResetbangdongVegetarian1"
              class="q-mx-xs btnSubmitCancel"
            />
            <q-btn
              color="primary"
              label="送出"
              type="submit"
              class="q-mx-xs btnSubmitCancel"
              size="25px"
              @click="submitBangdongVegetarian1"
            />
          </div>
        </q-card>
      </q-dialog>
      <!-- 素食便當 150dialog -->
      <q-dialog v-model="showbangdongVegetarian2" maximized>
        <q-card
          class="items-start word-break q-pa-none q-ma-none"
          id="bangdongcard"
        >
          <div class="color2 bangdongdialog row items-center text-white">
            <div class="text-h5 col-1">{{ bangdongVegetarian2Name }}</div>
            <div class="text-h5 q-ml-md col-2 row items-center">
              總計
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px' }"
                v-model.number="bangdongVegetarian2TotalQuantity"
                :bg-color="getInputColor(bangdongVegetarian2TotalQuantity)"
                label="數量總計"
                class="w-110px q-ml-lg"
                min="0"
              />
            </div>
            <div class="col"></div>
            <q-input
              filled
              type="number"
              label-color="white"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdongVegetarian2Arbitrarily"
              label="任意搭配"
              class="q-ma-xs w-110px text-white"
              min="0"
            />
            <q-input
              min="0"
              filled
              type="number"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdongVegetarian2Price"
              label="商品單價"
              class="q-ma-xs w-110px text-white"
              readonly
            />
            <q-input
              filled
              type="number"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdongVegetarian2TotalQuantityPrice"
              label="餐點總計"
              class="q-ma-xs w-150px text-white"
              readonly
              min="0"
            />
            <q-input
              filled
              type="number"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdongVegetarian2optionPrice"
              label="選項總計"
              class="q-ma-xs w-150px text-white"
              readonly
              min="0"
            />
            <q-input
              filled
              type="number"
              :input-style="{ fontSize: '20px', color: 'white' }"
              v-model.number="bangdongVegetarian2finalTotal"
              label="總計"
              class="q-ma-xs w-150px text-white"
              readonly
              min="0"
            />
          </div>
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">
              {{ bangdongVegetarian2MainName }}
            </h5>
            <div class="row items-center">
              <q-item
                v-for="(
                  bangdongVegetarian2Main, index
                ) in bangdongVegetarian2Mains"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdongVegetarian2Main.quantity"
                  :label="bangdongVegetarian2Main.shortname"
                  :bg-color="getInputColor(bangdongVegetarian2Main.quantity)"
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  class="q-ma-xs w-110px"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 飲料 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">
              {{ bangdongVegetarian2DrinkName }}
            </h5>
            <div class="row items-center">
              <q-item
                v-for="(
                  bangdongVegetarian2Drink, index
                ) in bangdongVegetarian2Drinks"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdongVegetarian2Drink.quantity"
                  :label="bangdongVegetarian2Drink.name"
                  filled
                  :bg-color="getInputColor(bangdongVegetarian2Drink.quantity)"
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  class="q-ma-xs w-110px"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 副主餐 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">
              {{ bangdongVegetarian2BentoMainName }}
            </h5>
            <div class="row items-center">
              <q-item
                v-for="(
                  bangdongVegetarian2BentoMain, index
                ) in bangdongVegetarian2BentoMains"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdongVegetarian2BentoMain.quantity"
                  :label="bangdongVegetarian2BentoMain.name"
                  filled
                  :bg-color="
                    getInputColor(bangdongVegetarian2BentoMain.quantity)
                  "
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  class="q-ma-xs w-110px"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 配菜 -->
          <div class="color1 bangdongdialog">
            <h5 style="margin: 0; padding: 0">
              {{ bangdongVegetarian2SideDishName }}
            </h5>
            <div class="row items-center">
              <q-item
                v-for="(
                  bangdongVegetarian2SideDish, index
                ) in bangdongVegetarian2SideDishes"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="bangdongVegetarian2SideDish.quantity"
                  :bg-color="
                    getInputColor(bangdongVegetarian2SideDish.quantity)
                  "
                  :label="bangdongVegetarian2SideDish.name"
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  class="q-ma-xs w-110px"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 總計 -->
          <div class="row items-center q-ml-md" style="width: 100%">
            <q-input
              v-model="bangdongVegetarian2Comment"
              label="商品備註"
              :bg-color="inputColor"
              class="col-9"
              outlined
            />
            <q-btn
              color="dark"
              label="取消"
              size="25px"
              @click="ResetbangdongVegetarian2"
              class="q-mx-xs btnSubmitCancel"
            />
            <q-btn
              color="primary"
              label="送出"
              type="submit"
              class="q-mx-xs btnSubmitCancel"
              size="25px"
              @click="submitBangdongVegetarian2"
            />
          </div>
        </q-card>
      </q-dialog>
      <!-- 盒餐 dailog -->
      <q-dialog v-model="showlunchBox" class="lunchBoxdailog">
        <q-card class="column" id="dialogbtnLunchBoxCard">
          <div class="w-100 col row justify-end h-40px q-my-md">
            <div class="col-1">
              <q-btn
                @click="showlunchBox = false"
                round
                icon="close"
                color="dark"
              />
            </div>
          </div>
          <!-- 盒餐按鈕 -->
          <div class="items-center justify-center row w-100 col">
            <q-btn
              color="dark"
              class="col-5 btnLunchbox"
              :label="lunchBox2Name"
              @click="
                showlunchBox2 = true;
                showlunchBox = false;
              "
            />
            <q-btn
              color="dark"
              class="col-5 btnLunchbox"
              :label="lunchBox3Name"
              @click="
                showlunchBox3 = true;
                showlunchBox = false;
              "
            />

            <q-btn
              color="dark"
              class="col-5 btnLunchbox"
              :label="lunchBox4Name"
              @click="
                showlunchBox4 = true;
                showlunchBox = false;
              "
            />
            <q-btn
              color="dark"
              class="col-5 btnLunchbox"
              :label="lunchBox1Name"
              @click="
                showlunchBox1 = true;
                showlunchBox = false;
              "
            />
            <q-btn
              color="dark"
              class="col-5 btnLunchbox"
              :label="lunchBox214Name"
              @click="
                showlunchBox214 = true;
                showlunchBox = false;
              "
            />
            <div
              class="col-5 btnLunchbox bg-white"
            />
          </div>
        </q-card>
      </q-dialog>

      <!-- 經濟盒餐 dailog -->
      <q-dialog v-model="showlunchBox1" maximized>
        <!-- 主餐 -->
        <q-card style="overflow-x: hidden">
          <div class="row items-start justify-center" id="lunchbox1">
            <div class="color2 bangdongdialog row items-center text-white">
              <h5 style="margin: 0; padding: 0">{{ lunchBox1Name }} 總計</h5>
              <q-input
                filled
                type="number"
                :bg-color="getInputColor(lunchBox1TotalQuantity)"
                class="q-mx-md w-110px"
                :input-style="{ fontSize: '20px' }"
                v-model.number="lunchBox1TotalQuantity"
                label="數量總計"
                min="0"
              />
              <div class="col"></div>
              <div class="row">
                <q-input
                  filled
                  type="number"
                  label-color="white"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  v-model.number="lunchBox1Arbitrarily"
                  label="任意搭配"
                  min="0"
                />
                <q-input
                  min="0"
                  filled
                  type="number"
                  class="q-ma-xs w-110px"
                  label-color="white"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  v-model.number="lunchBox1Price"
                  label="商品單價"
                  readonly
                />
                <q-input
                  filled
                  type="number"
                  label-color="white"
                  class="q-ma-xs w-150px"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  v-model.number="lunchBox1TotalQuantityPrice"
                  label="餐點總計"
                  readonly
                  min="0"
                />
                <q-input
                  filled
                  type="number"
                  label-color="white"
                  class="q-ma-xs w-150px"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  v-model.number="lunchBox1optionPrice"
                  label="選項總計"
                  readonly
                  min="0"
                />
                <q-input
                  filled
                  type="number"
                  label-color="white"
                  class="q-ma-xs w-150px"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  v-model.number="lunchbox1finalTotal"
                  label="總計"
                  readonly
                  min="0"
                />
              </div>
            </div>
            <div v-for="(lunchBox1Main, index) in lunchBox1Mains" :key="index">
              <h6 style="margin: 0; padding: 0">
                {{ lunchBox1Main.shortname }}
              </h6>
              <q-input
                v-model.number="lunchBox1Main.quantity"
                :label="lunchBox1Main.shortname"
                filled
                type="number"
                :bg-color="getInputColor(lunchBox1Main.quantity)"
                class="q-ma-xs w-110px"
                :input-style="{ fontSize: '20px', margin: '0' }"
                :label-style="{ fontSize: '20px' }"
                min="0"
              />
            </div>
            <!-- <h5 style="margin: 0; padding: 0">{{ lunchBox1DrinkName }}</h5>
              <div
                v-for="(lunchBox1Drink, drinkIndex) in lunchBox1Main.drinks"
                :key="drinkIndex"
              >
                <q-input
                  v-model.number="lunchBox1Drink.quantity"
                  :label="lunchBox1Drink.name"
                  filled
                  type="number"
                  :bg-color="getInputColor(lunchBox1Drink.quantity)"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                />
              </div>
            </div>
          </div>

          <div class="color1 lunchbox11">
            <h5 style="margin: 0; padding: 0">{{ lunchBox1SideDishName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(lunchBox1SideDish, index) in lunchBox1SideDishes"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="lunchBox1SideDish.quantity"
                  :label="lunchBox1SideDish.name"
                  filled
                  :bg-color="getInputColor(lunchBox1SideDish.quantity)"
                  class="q-ma-xs w-110px"
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  min="0"
                />
              </q-item>
            </div>-->
          </div>
          <!-- 總計 -->
          <div class="color1 lunchbox11 justify-center q-mt-xl"></div>
          <div class="row items-center" style="width: 100%">
            <q-input
              v-model="lunchbox1Comment"
              label="商品備註"
              :bg-color="inputColor"
              class="q-ml-lg col-8"
            />

            <q-btn
              color="dark"
              label="取消"
              size="30px"
              @click="Resetlunchbox1"
              class="q-ma-lg col-1"
            />
            <q-btn
              color="primary"
              label="送出"
              type="submit"
              class="q-ma-lg col-1"
              size="30px"
              @click="submitLunchbox1"
            />
          </div>
        </q-card>
      </q-dialog>

      <!-- 會議盒餐 dailog -->
      <q-dialog v-model="showlunchBox2" maximized>
        <!-- 主餐 -->
        <q-card style="overflow-x: hidden">
          <div class="row items-start justify-center" id="lunchbox2">
            <div class="color2 bangdongdialog row items-center text-white">
              <h5 style="margin: 0; padding: 0">{{ lunchBox2Name }}</h5>
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px' }"
                :bg-color="getInputColor(lunchBox2TotalQuantity)"
                v-model.number="lunchBox2TotalQuantity"
                label="數量總計"
                class="q-ma-xs w-110px"
                min="0"
              />
              <div class="col"></div>
              <div class="row">
                <q-input
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  label-color="white"
                  v-model.number="lunchBox2Arbitrarily"
                  label="任意搭配"
                  class="w-110px q-ma-xs"
                  min="0"
                />
                <q-input
                  min="0"
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  label-color="white"
                  v-model.number="lunchBox2Price"
                  label="商品單價"
                  class="q-ma-xs w-110px"
                  readonly
                />
                <q-input
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  label-color="white"
                  v-model.number="lunchBox2TotalQuantityPrice"
                  label="餐點總計"
                  class="q-ma-xs w-150px"
                  readonly
                  min="0"
                />
                <q-input
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  label-color="white"
                  v-model.number="lunchBox2optionPrice"
                  label="選項總計"
                  class="q-ma-xs w-150px"
                  readonly
                  min="0"
                />
                <q-input
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  label-color="white"
                  v-model.number="lunchbox2finalTotal"
                  label="總計"
                  class="q-ma-xs w-150px"
                  readonly
                  min="0"
                />
              </div>
            </div>
            <div v-for="(lunchBox2Main, index) in lunchBox2Mains" :key="index">
              <h6 style="margin: 0; padding: 0">
                {{ lunchBox2Main.shortname }}
              </h6>
              <q-input
                v-model.number="lunchBox2Main.quantity"
                :label="lunchBox2Main.shortname"
                filled
                type="number"
                :input-style="{ fontSize: '20px', margin: '0' }"
                :label-style="{ fontSize: '20px' }"
                :bg-color="getInputColor(lunchBox2Main.quantity)"
                class="w-110px q-ma-xs"
                min="0"
              />
              <h5 style="margin: 0; padding: 0">{{ lunchBox2DrinkName }}</h5>
              <div
                v-for="(lunchBox2Drink, drinkIndex) in lunchBox2Main.drinks"
                :key="drinkIndex"
              >
                <q-input
                  v-model.number="lunchBox2Drink.quantity"
                  :label="lunchBox2Drink.name"
                  filled
                  type="number"
                  :bg-color="getInputColor(lunchBox2Drink.quantity)"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  class="w-110px"
                />
              </div>
            </div>
          </div>
          <!-- 配菜 -->
          <div class="color1 lunchbox11">
            <h5 style="margin: 0; padding: 0">{{ lunchBox2SideDishName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(lunchBox2SideDish, index) in lunchBox2SideDishes"
                :key="index"
                class="flex-auto"
                :bg-color="inputColor"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="lunchBox2SideDish.quantity"
                  :label="lunchBox2SideDish.name"
                  filled
                  type="number"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  :bg-color="getInputColor(lunchBox2SideDish.quantity)"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 總計 -->
          <div class="color1 lunchbox11">
            <!-- 按鈕 -->
          </div>
          <div class="row items-center w-100 q-ml-md">
            <q-input
              v-model="lunchbox2Comment"
              label="商品備註"
              :bg-color="inputColor"
              class="col-9"
            />
            <q-btn
              color="dark"
              label="取消"
              size="30px"
              @click="Resetlunchbox2"
              class="q-ma-lg"
            />
            <q-btn
              color="primary"
              label="送出"
              type="submit"
              class="q-ma-lg"
              size="30px"
              @click="submitLunchbox2"
            />
          </div>
        </q-card>
      </q-dialog>
      <!-- 貴賓盒餐 dailog -->
      <q-dialog v-model="showlunchBox3" maximized>
        <!-- 主餐 -->
        <q-card style="overflow-x: hidden">
          <div class="row items-start justify-center" id="lunchbox3">
            <div class="color2 bangdongdialog row items-center text-white">
              <h5 style="margin: 0; padding: 0">{{ lunchBox3Name }}</h5>
              <q-input
                filled
                type="number"
                :bg-color="getInputColor(lunchBox3TotalQuantity)"
                :input-style="{ fontSize: '20px' }"
                class="q-ma-xs w-110px"
                v-model.number="lunchBox3TotalQuantity"
                label="數量總計"
                min="0"
              />
              <div class="col"></div>
              <div class="row">
                <q-input
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  label-color="white"
                  v-model.number="lunchBox3Arbitrarily"
                  label="任意搭配"
                  class="q-ma-xs w-110px"
                  min="0"
                />
                <q-input
                  min="0"
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  label-color="white"
                  v-model.number="lunchBox3Price"
                  label="商品單價"
                  class="q-ma-xs w-110px"
                  readonly
                />
                <q-input
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  label-color="white"
                  v-model.number="lunchBox3TotalQuantityPrice"
                  label="餐點總計"
                  class="q-ma-xs w-150px"
                  readonly
                  min="0"
                />
                <q-input
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  label-color="white"
                  v-model.number="lunchBox3optionPrice"
                  label="選項總計"
                  class="q-ma-xs w-150px"
                  readonly
                  min="0"
                />
                <q-input
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  label-color="white"
                  v-model.number="lunchbox3finalTotal"
                  label="總計"
                  class="q-ma-xs w-150px"
                  readonly
                  min="0"
                />
              </div>
            </div>
            <div v-for="(lunchBox3Main, index) in lunchBox3Mains" :key="index">
              <h6 style="margin: 0; padding: 0">
                {{ lunchBox3Main.shortname }}
              </h6>
              <q-input
                v-model.number="lunchBox3Main.quantity"
                :label="lunchBox3Main.shortname"
                filled
                :bg-color="getInputColor(lunchBox3Main.quantity)"
                type="number"
                :input-style="{ fontSize: '20px', margin: '0' }"
                :label-style="{ fontSize: '20px' }"
                class="w-110px q-ma-xs"
                min="0"
              />
              <h5 style="margin: 0; padding: 0">{{ lunchBox3DrinkName }}</h5>
              <div
                v-for="(lunchBox3Drink, drinkIndex) in lunchBox3Main.drinks"
                :key="drinkIndex"
              >
                <q-input
                  v-model.number="lunchBox3Drink.quantity"
                  :label="lunchBox3Drink.name"
                  filled
                  :bg-color="getInputColor(lunchBox3Drink.quantity)"
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  min="0"
                  class="w-110px"
                />
              </div>
            </div>
          </div>
          <!-- 配菜 -->
          <div class="color1 lunchbox11">
            <h5 style="margin: 0; padding: 0">{{ lunchBox3SideDishName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(lunchBox3SideDish, index) in lunchBox3SideDishes"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="lunchBox3SideDish.quantity"
                  :label="lunchBox3SideDish.name"
                  filled
                  :bg-color="getInputColor(lunchBox3SideDish.quantity)"
                  type="number"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 總計 -->
          <div class="color1 lunchbox11"></div>
          <!-- 按鈕 -->
          <div class="row items-center q-ml-md">
            <q-input
              v-model="lunchbox3Comment"
              label="商品備註"
              :bg-color="inputColor"
              class="col-9"
            />
            <q-btn
              color="dark"
              label="取消"
              @click="Resetlunchbox3"
              class="q-ma-lg"
              size="30px"
            />
            <q-btn
              color="primary"
              label="送出"
              type="submit"
              class="q-ma-lg"
              @click="submitLunchbox3"
              size="30px"
            />
          </div>
        </q-card>
      </q-dialog>
      <!-- 首席盒餐 dailog -->
      <q-dialog v-model="showlunchBox4" maximized>
        <!-- 主餐 -->
        <q-card style="overflow-x: hidden">
          <div class="row items-start justify-center" id="lunchbox4">
            <div class="color2 bangdongdialog row items-center text-white">
              <h5 style="margin: 0; padding: 0">{{ lunchBox4Name }}</h5>
              <q-input
                filled
                type="number"
                class="q-ma-xs w-110px"
                :input-style="{ fontSize: '20px' }"
                :bg-color="getInputColor(lunchBox4TotalQuantity)"
                v-model.number="lunchBox4TotalQuantity"
                label="數量總計"
                min="0"
              />
              <div class="col"></div>
              <div class="row">
                <q-input
                  filled
                  type="number"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  label-color="white"
                  v-model.number="lunchBox4Arbitrarily"
                  label="任意搭配"
                  min="0"
                />
                <q-input
                  min="0"
                  filled
                  type="number"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  label-color="white"
                  v-model.number="lunchBox4Price"
                  label="商品單價"
                  readonly
                />
                <q-input
                  filled
                  type="number"
                  class="q-ma-xs w-150px"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  label-color="white"
                  v-model.number="lunchBox4TotalQuantityPrice"
                  label="餐點總計"
                  readonly
                  min="0"
                />
                <q-input
                  filled
                  type="number"
                  class="q-ma-xs w-150px"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  label-color="white"
                  v-model.number="lunchBox4optionPrice"
                  label="選項總計"
                  readonly
                  min="0"
                />
                <q-input
                  filled
                  type="number"
                  class="q-ma-xs w-150px"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  label-color="white"
                  v-model.number="lunchbox4finalTotal"
                  label="金額總計"
                  readonly
                  min="0"
                />
              </div>
            </div>
            <div v-for="(lunchBox4Main, index) in lunchBox4Mains" :key="index">
              <h6 style="margin: 0; padding: 0">
                {{ lunchBox4Main.shortname }}
              </h6>
              <q-input
                v-model.number="lunchBox4Main.quantity"
                :label="lunchBox4Main.shortname"
                filled
                class="q-ma-xs w-110px"
                :bg-color="getInputColor(lunchBox4Main.quantity)"
                type="number"
                :input-style="{ fontSize: '20px', margin: '0' }"
                :label-style="{ fontSize: '20px' }"
                min="0"
              />
              <h5 style="margin: 0; padding: 0">{{ lunchBox4DrinkName }}</h5>
              <div
                v-for="(lunchBox4Drink, drinkIndex) in lunchBox4Main.drinks"
                :key="drinkIndex"
              >
                <q-input
                  v-model.number="lunchBox4Drink.quantity"
                  :label="lunchBox4Drink.name"
                  filled
                  :bg-color="getInputColor(lunchBox4Drink.quantity)"
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  min="0"
                  class="w-110px"
                />
              </div>
            </div>
          </div>
          <!-- 配菜 -->
          <div class="color1 lunchbox11">
            <h5 style="margin: 0; padding: 0">{{ lunchBox4SideDishName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(lunchBox4SideDish, index) in lunchBox4SideDishes"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="lunchBox4SideDish.quantity"
                  :label="lunchBox4SideDish.name"
                  filled
                  class="q-ma-xs w-110px"
                  type="number"
                  :bg-color="getInputColor(lunchBox4SideDish.quantity)"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 總計 -->
          <div class="color1 lunchbox11"></div>
          <!-- 按鈕 -->
          <div class="row items-center w-100 q-ml-md">
            <q-input
              v-model="lunchbox4Comment"
              label="商品備註"
              :bg-color="inputColor"
              class="col-9"
            />

            <q-btn
              color="dark"
              label="取消"
              size="30px"
              @click="Resetlunchbox4"
              class="q-ma-lg"
            />
            <q-btn
              color="primary"
              label="送出"
              type="submit"
              class="q-ma-lg"
              size="30px"
              @click="submitLunchbox4"
            />
          </div>
        </q-card>
      </q-dialog>
      <!--214盒餐 dailog -->
      <q-dialog v-model="showlunchBox214" maximized>
        <!-- 主餐 -->
        <q-card style="overflow-x: hidden">
          <div class="row items-start justify-center" id="lunchbox4">
            <div class="color2 bangdongdialog row items-center text-white">
              <h5 style="margin: 0; padding: 0">{{ lunchBox214Name }}</h5>
              <q-input
                filled
                type="number"
                class="q-ma-xs w-110px"
                :input-style="{ fontSize: '20px' }"
                :bg-color="getInputColor(lunchBox214TotalQuantity)"
                v-model.number="lunchBox214TotalQuantity"
                label="數量總計"
                min="0"
              />
              <div class="col"></div>
              <div class="row">
                <q-input
                  filled
                  type="number"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  label-color="white"
                  v-model.number="lunchBox214Arbitrarily"
                  label="任意搭配"
                  min="0"
                />
                <q-input
                  min="0"
                  filled
                  type="number"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  label-color="white"
                  v-model.number="lunchBox214Price"
                  label="商品單價"
                  readonly
                />
                <q-input
                  filled
                  type="number"
                  class="q-ma-xs w-150px"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  label-color="white"
                  v-model.number="lunchBox214TotalQuantityPrice"
                  label="餐點總計"
                  readonly
                  min="0"
                />
                <q-input
                  filled
                  type="number"
                  class="q-ma-xs w-150px"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  label-color="white"
                  v-model.number="lunchBox214optionPrice"
                  label="選項總計"
                  readonly
                  min="0"
                />
                <q-input
                  filled
                  type="number"
                  class="q-ma-xs w-150px"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  label-color="white"
                  v-model.number="lunchbox214finalTotal"
                  label="金額總計"
                  readonly
                  min="0"
                />
              </div>
            </div>
            <div
              v-for="(lunchBox214Main, index) in lunchBox214Mains"
              :key="index"
            >
              <h6 style="margin: 0; padding: 0">
                {{ lunchBox214Main.shortname }}
              </h6>
              <q-input
                v-model.number="lunchBox214Main.quantity"
                :label="lunchBox214Main.shortname"
                filled
                class="q-ma-xs w-110px"
                :bg-color="getInputColor(lunchBox214Main.quantity)"
                type="number"
                :input-style="{ fontSize: '20px', margin: '0' }"
                :label-style="{ fontSize: '20px' }"
                min="0"
              />
              <h5 style="margin: 0; padding: 0">{{ lunchBox214DrinkName }}</h5>
              <div
                v-for="(lunchBox214Drink, drinkIndex) in lunchBox214Main.drinks"
                :key="drinkIndex"
              >
                <q-input
                  v-model.number="lunchBox214Drink.quantity"
                  :label="lunchBox214Drink.name"
                  filled
                  :bg-color="getInputColor(lunchBox214Drink.quantity)"
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  min="0"
                  class="w-110px"
                />
              </div>
            </div>
          </div>
          <!-- 配菜 -->
          <div class="color1 lunchbox11">
            <h5 style="margin: 0; padding: 0">{{ lunchBox214SideDishName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(lunchBox214SideDish, index) in lunchBox214SideDishes"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  v-model.number="lunchBox214SideDish.quantity"
                  :label="lunchBox214SideDish.name"
                  filled
                  class="q-ma-xs w-110px"
                  type="number"
                  :bg-color="getInputColor(lunchBox214SideDish.quantity)"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  min="0"
                />
              </q-item>
            </div>
          </div>
          <!-- 總計 -->
          <div class="color1 lunchbox11"></div>
          <!-- 按鈕 -->
          <div class="row items-center w-100 q-ml-md">
            <q-input
              v-model="lunchbox214Comment"
              label="商品備註"
              :bg-color="inputColor"
              class="col-9"
            />

            <q-btn
              color="dark"
              label="取消"
              size="30px"
              @click="Resetlunchbox214"
              class="q-ma-lg"
            />
            <q-btn
              color="primary"
              label="送出"
              type="submit"
              class="q-ma-lg"
              size="30px"
              @click="submitLunchbox214"
            />
          </div>
        </q-card>
      </q-dialog>
      <!-- 單點 dailog -->
      <q-dialog v-model="showbangdongSolo" maximized>
        <q-card class="q-pa-md row items-start word-break">
          <!-- 6 吋潤餅 -->
          <div class="color1 w-100 q-pa-none q-ma-none">
            <h5 style="margin: 0; padding: 0">{{ bangdongSolo6inchName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdongSolo6inch, index) in bangdongSolo6inchs"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  min="0"
                  v-model.number="bangdongSolo6inch.quantity"
                  :label="bangdongSolo6inch.name"
                  filled
                  type="number"
                  :bg-color="getInputColor(bangdongSolo6inch.quantity)"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                />
              </q-item>
            </div>
          </div>
          <!-- 3 吋潤餅 -->
          <div class="color1 w-100 q-pa-none q-ma-none">
            <h5 style="margin: 0; padding: 0">{{ bangdongSolo3inchName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdongSolo3inch, index) in bangdongSolo3inchs"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  min="0"
                  v-model.number="bangdongSolo3inch.quantity"
                  :label="bangdongSolo3inch.name"
                  filled
                  type="number"
                  class="q-ma-xs w-110px"
                  :bg-color="getInputColor(bangdongSolo3inch.quantity)"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                />
              </q-item>
            </div>
          </div>
          <!-- 飲料 -->
          <div class="color1 w-100 q-pa-none q-ma-none">
            <h5 style="margin: 0; padding: 0">{{ bangdongSoloDrinkName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdongSoloDrink, index) in bangdongSoloDrinks"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  min="0"
                  v-model.number="bangdongSoloDrink.quantity"
                  :label="bangdongSoloDrink.name"
                  filled
                  type="number"
                  class="q-ma-xs w-110px"
                  :bg-color="getInputColor(bangdongSoloDrink.quantity)"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                />
              </q-item>
            </div>
          </div>
          <!-- 副主餐 -->
          <div class="color1 w-100 q-pa-none q-ma-none">
            <h5 style="margin: 0; padding: 0">
              {{ bangdongSoloBentoMainName }}
            </h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdongSoloBentoMain, index) in bangdongSoloBentoMains"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  min="0"
                  v-model.number="bangdongSoloBentoMain.quantity"
                  :label="bangdongSoloBentoMain.name"
                  filled
                  :bg-color="getInputColor(bangdongSoloBentoMain.quantity)"
                  type="number"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                />
              </q-item>
            </div>
          </div>
          <!-- 配菜 -->
          <div class="color1 w-100 q-pa-none q-ma-none">
            <h5 style="margin: 0; padding: 0">
              {{ bangdongSoloSideDishName }}
            </h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdongSoloSideDish, index) in bangdongSoloSideDishes"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  min="0"
                  v-model.number="bangdongSoloSideDish.quantity"
                  :label="bangdongSoloSideDish.name"
                  filled
                  type="number"
                  :bg-color="getInputColor(bangdongSoloSideDish.quantity)"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                />
              </q-item>
            </div>
          </div>
          <!-- 環保袋 -->
          <div class="color1 w-100 q-pa-none q-ma-none">
            <h5 style="margin: 0; padding: 0">{{ bangdongSoloEcoBagName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdongSoloEcoBag, index) in bangdongSoloEcoBags"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  min="0"
                  v-model.number="bangdongSoloEcoBag.quantity"
                  :label="bangdongSoloEcoBag.name"
                  filled
                  type="number"
                  :bg-color="getInputColor(bangdongSoloEcoBag.quantity)"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                />
              </q-item>
            </div>
          </div>
          <!-- 總計 -->
          <div class="color1 w-100 q-pa-none q-ma-none">
            <h5 style="margin: 0; padding: 0">{{ bangdongSoloName }}</h5>

            <div class="row">
              <q-input
                min="0"
                filled
                type="number"
                :input-style="{ fontSize: '20px' }"
                :bg-color="inputColor"
                class="q-ma-xs w-110px"
                v-model.number="bangdongSoloTotalQuantity"
                label="數量總計"
              />

              <q-input
                min="0"
                filled
                type="number"
                :input-style="{ fontSize: '20px' }"
                :bg-color="inputColor"
                class="q-ma-xs w-150px"
                v-model.number="bangdongSoloTotalQuantityPrice"
                label="金額總計"
                readonly
              />
            </div>
          </div>
          <!-- 按鈕 -->
          <div class="row w-100 items-center q-ml-md">
            <q-input
              v-model="bangdongSoloComment"
              label="商品備註"
              :bg-color="inputColor"
              class="col-9"
            />

            <q-btn
              color="dark"
              label="取消"
              @click="ResetbangdongSolo"
              class="q-ma-lg"
              size="30px"
            />
            <q-btn
              color="primary"
              label="送出"
              type="submit"
              class="q-ma-lg"
              size="30px"
              @click="submitBangdongSolo"
            />
          </div>
        </q-card>
      </q-dialog>

      <!-- 客製便當 dailog -->
      <q-dialog v-model="showbangdongCustom1" class="lunchBoxdailog" maximized>
        <q-card
          class="items-start word-break q-pa-none q-ma-none"
          id="bangdongcard"
        >
          <div class="color2 bangdongdialog row items-center text-white">
            <h5 style="margin: 0; padding: 0">{{ bangdongCustom1Name }}</h5>
            <q-input
              min="0"
              filled
              type="number"
              :input-style="{ fontSize: '20px' }"
              class="w-110px q-ml-lg"
              :bg-color="getInputColor(bangdongCustom1TotalQuantity)"
              v-model.number="bangdongCustom1TotalQuantity"
              label="數量總計"
            />
            <div class="col"></div>
            <div class="row">
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px' }"
                v-model.number="bangdongCustom1Arbitrarily"
                label="任意搭配"
                label-color="white"
                class="q-ma-xs w-110px"
                min="0"
              />

              <q-input
                min="0"
                filled
                type="number"
                :input-style="{ fontSize: '20px' }"
                class="q-ma-xs w-110px"
                label-color="white"
                v-model.number="bangdongCustom1Price"
                label="商品單價"
              />
              <q-input
                min="0"
                filled
                type="number"
                :input-style="{ fontSize: '20px' }"
                v-model.number="bangdongCustom1TotalQuantityPrice"
                label="餐點總計"
                label-color="white"
                class="q-ma-xs w-150px"
                readonly
              />
              <q-input
                min="0"
                filled
                type="number"
                :input-style="{ fontSize: '20px' }"
                v-model.number="bangdongCustom1optionPrice"
                label="選項總計"
                label-color="white"
                class="q-ma-xs w-150px"
                readonly
              />
              <q-input
                min="0"
                filled
                type="number"
                :input-style="{ fontSize: '20px' }"
                v-model.number="bangdongCustom1finaltotal"
                label="總計"
                label-color="white"
                class="q-ma-xs w-150px"
                readonly
              />
            </div>
          </div>
          <!-- 主餐 -->
          <div class="color1 w-100 q-pa-none q-ma-none">
            <h5 style="margin: 0; padding: 0">{{ bangdongCustom1MainName }}</h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdongCustom1Main, index) in bangdongCustom1Mains"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  min="0"
                  v-model.number="bangdongCustom1Main.quantity"
                  :label="bangdongCustom1Main.shortname"
                  filled
                  type="number"
                  :bg-color="getInputColor(bangdongCustom1Main.quantity)"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                />
              </q-item>
            </div>
          </div>
          <!-- 飲料 -->
          <div class="color1 w-100 q-pa-none q-ma-none">
            <h5 style="margin: 0; padding: 0">
              {{ bangdongCustom1DrinkName }}
            </h5>
            <div class="row items-center">
              <q-item
                v-for="(bangdongCustom1Drink, index) in bangdongCustom1Drinks"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  min="0"
                  v-model.number="bangdongCustom1Drink.quantity"
                  :label="bangdongCustom1Drink.name"
                  filled
                  type="number"
                  :bg-color="getInputColor(bangdongCustom1Drink.quantity)"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                />
              </q-item>
            </div>
          </div>
          <!-- 副主餐 -->
          <div class="color1 w-100 q-pa-none q-ma-none">
            <h5 style="margin: 0; padding: 0">
              {{ bangdongCustom1BentoMainName }}
            </h5>
            <div class="row items-center">
              <q-item
                v-for="(
                  bangdongCustom1BentoMain, index
                ) in bangdongCustom1BentoMains"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  min="0"
                  v-model.number="bangdongCustom1BentoMain.quantity"
                  :label="bangdongCustom1BentoMain.name"
                  filled
                  type="number"
                  :bg-color="getInputColor(bangdongCustom1BentoMain.quantity)"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                />
              </q-item>
            </div>
          </div>
          <!-- 配菜 -->
          <div class="color1 w-100 q-pa-none q-ma-none">
            <h5 style="margin: 0; padding: 0">
              {{ bangdongCustom1SideDishName }}
            </h5>
            <div class="row items-center">
              <q-item
                v-for="(
                  bangdongCustom1SideDish, index
                ) in bangdongCustom1SideDishes"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  min="0"
                  v-model.number="bangdongCustom1SideDish.quantity"
                  :label="bangdongCustom1SideDish.name"
                  filled
                  type="number"
                  :bg-color="getInputColor(bangdongCustom1SideDish.quantity)"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                />
              </q-item>
            </div>
          </div>
          <!-- 總計 -->
          <div class="color1 w-100 q-pa-none q-ma-none"></div>
          <!-- 按鈕 -->
          <div class="row w-100 items-center">
            <q-input
              v-model="bangdongCustom1Comment"
              label="商品備註"
              :bg-color="inputColor"
              class="col-9"
            />

            <q-btn
              color="dark"
              label="取消"
              @click="ResetbangdongCustom1"
              class="q-mx-lg"
              size="30px"
            />
            <q-btn
              color="primary"
              label="送出"
              type="submit"
              class="q-mx-lg"
              size="30px"
              @click="submitBangdongCustom1"
            />
          </div>
        </q-card>
      </q-dialog>

      <!-- 客製盒餐 dailog -->
      <q-dialog v-model="showLunchBoxCustom1" class="lunchBoxdailog" maximized>
        <!-- 主餐 -->
        <q-card class="q-pa-xs" style="overflow-x: hidden">
          <div class="color2 bangdongdialog row items-center text-white">
            <h5 style="margin: 0; padding: 0">{{ lunchBoxCustom1Name }}</h5>
            <q-input
              min="0"
              filled
              type="number"
              :input-style="{ fontSize: '20px' }"
              :bg-color="getInputColor(lunchBoxCustom1TotalQuantity)"
              class="q-ma-xs w-110px"
              v-model.number="lunchBoxCustom1TotalQuantity"
              label="數量總計"
            />
            <div class="col"></div>
            <div class="row">
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px' }"
                v-model.number="lunchBoxCustom1Arbitrarily"
                label="任意搭配"
                label-color="white"
                class="q-ma-xs w-110px"
                min="0"
              />
              <q-input
                min="0"
                filled
                type="number"
                :input-style="{ fontSize: '20px' }"
                v-model.number="lunchBoxCustom1Price"
                label="商品單價"
                label-color="white"
                class="q-ma-xs w-110px"
              />
              <q-input
                min="0"
                filled
                type="number"
                :input-style="{ fontSize: '20px' }"
                v-model.number="lunchBoxCustom1TotalQuantityPrice"
                label="餐點總計"
                label-color="white"
                class="q-ma-xs w-150px"
                readonly
              />
              <q-input
                min="0"
                filled
                type="number"
                :input-style="{ fontSize: '20px' }"
                v-model.number="lunchBoxCustom1optionPrice"
                label="選項總計"
                label-color="white"
                class="q-ma-xs w-150px"
              />
              <q-input
                min="0"
                filled
                type="number"
                :input-style="{ fontSize: '20px' }"
                v-model.number="lunchBoxCustom1finaltotal"
                label="總計"
                label-color="white"
                class="q-ma-xs w-150px"
                readonly
              />
            </div>
          </div>
          <div class="row items-start justify-center" id="lunchboxCustom1">
            <div
              v-for="(lunchBoxCustom1Main, index) in lunchBoxCustom1Mains"
              :key="index"
            >
              <h6 style="margin: 0; padding: 0">
                {{ lunchBoxCustom1Main.shortname }}
              </h6>
              <q-input
                min="0"
                v-model.number="lunchBoxCustom1Main.quantity"
                :label="lunchBoxCustom1Main.shortname"
                filled
                type="number"
                :bg-color="getInputColor(lunchBoxCustom1Main.quantity)"
                class="q-mx-xs w-110px"
                :input-style="{ fontSize: '20px', margin: '0' }"
                :label-style="{ fontSize: '20px' }"
              />
              <h5 style="margin: 0; padding: 0">
                {{ lunchBoxCustom1DrinkName }}
              </h5>
              <div
                v-for="(
                  lunchBoxCustom1Drink, drinkIndex
                ) in lunchBoxCustom1Main.drinks"
                :key="drinkIndex"
              >
                <q-input
                  min="0"
                  v-model.number="lunchBoxCustom1Drink.quantity"
                  :label="lunchBoxCustom1Drink.name"
                  filled
                  type="number"
                  :bg-color="getInputColor(lunchBoxCustom1Drink.quantity)"
                  class="q-mx-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                />
              </div>
            </div>
          </div>
          <!-- 6inch -->
          <div class="color1 w-100 q-pa-none q-ma-none">
            <h5 style="margin: 0; padding: 0">
              {{ lunchBoxCustom1Burrito6inchName }}
            </h5>
            <div class="row items-center">
              <q-item
                v-for="(
                  lunchBoxCustom1Burrito6inch, index
                ) in lunchBoxCustom1Burrito6inchs"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  min="0"
                  v-model.number="lunchBoxCustom1Burrito6inch.quantity"
                  :label="lunchBoxCustom1Burrito6inch.name"
                  filled
                  type="number"
                  :bg-color="
                    getInputColor(lunchBoxCustom1Burrito6inch.quantity)
                  "
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                />
              </q-item>
            </div>
          </div>
          <!-- 配菜 -->
          <div class="color1 w-100 q-pa-none q-ma-none">
            <h5 style="margin: 0; padding: 0">
              {{ lunchBoxCustom1SideDishName }}
            </h5>
            <div class="row items-center">
              <q-item
                v-for="(
                  lunchBoxCustom1SideDish, index
                ) in lunchBoxCustom1SideDishes"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  min="0"
                  v-model.number="lunchBoxCustom1SideDish.quantity"
                  :label="lunchBoxCustom1SideDish.name"
                  filled
                  type="number"
                  :bg-color="getInputColor(lunchBoxCustom1SideDish.quantity)"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                />
              </q-item>
            </div>
          </div>
          <!-- 副主餐 -->
          <div class="color1 w-100 q-pa-none q-ma-none">
            <h5 style="margin: 0; padding: 0">
              {{ lunchBoxCustom1BentoMainName }}
            </h5>
            <div class="row items-center">
              <q-item
                v-for="(
                  lunchBoxCustom1BentoMain, index
                ) in lunchBoxCustom1BentoMains"
                :key="index"
                class="flex-auto"
                style="margin: 0; padding: 0"
              >
                <q-input
                  min="0"
                  v-model.number="lunchBoxCustom1BentoMain.quantity"
                  :label="lunchBoxCustom1BentoMain.name"
                  filled
                  type="number"
                  :bg-color="getInputColor(lunchBoxCustom1BentoMain.quantity)"
                  class="q-ma-xs w-110px"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                />
              </q-item>
            </div>
          </div>

          <!-- 總計 -->
          <div class="color1 w-100 q-pa-none q-ma-none">
            <div class="row"></div>
          </div>
          <!-- 按鈕 -->
          <div class="row items-center w-100 q-mt-md">
            <q-input
              v-model="lunchboxCustom1Comment"
              label="商品備註"
              :bg-color="inputColor"
              class="col-9"
            />

            <q-btn
              color="dark"
              label="取消"
              @click="ResetLunchBoxCustom1"
              class="q-mx-lg"
              size="30px"
            />
            <q-btn
              color="primary"
              label="送出"
              type="submit"
              class="q-mx-lg"
              size="30px"
              @click="submitLunchboxCustom1"
            />
          </div>
        </q-card>
      </q-dialog>
    </div>
    <!-- 訂單區 -->
    <div class="row">
      <!-- 訂單顯示 -->
      <div class="col p-4 slider" data-order-lists>
        <!-- table 訂單區域 -->
        <div class="row justify-center">
          <div class="col-12">
            <div class="q-pa-xs">
              <q-table
                :rows="tableRows"
                :style="{ maxHeight: show ? 'calc(30vh)' : 'calc(70vh)' }"
                row-key="id"
                virtual-scroll
                v-model:pagination="pagination"
                :rows-per-page-options="[0]"
                id="sliderTable"
                no-data-label="目前沒有餐點"
                v-model:expanded="expanded"
              >
                <template #header>
                  <q-tr>
                    <q-th class="w-100px"> 順序 </q-th>
                    <q-th class="w-300px"> 商品 </q-th>
                    <q-th class="w-300px"> 潤餅 </q-th>
                    <q-th class="w-300px"> 飲料 </q-th>
                    <q-th class="w-300px"> 副主餐 </q-th>
                    <q-th class="w-100px"> 金額 </q-th>
                    <q-th class="w-130px"> 操作 </q-th>
                    <q-th class=""> 備註 </q-th>
                  </q-tr>
                </template>
                <template #body="props">
                  <q-tr :props="props">
                    <q-td class="tdId">{{ props.row.id }}</q-td>
                    <q-td class="tdname">
                      <div v-html="props.row.name"></div>
                      <div
                        v-for="(input, index) in props.row.inputs"
                        :key="index"
                        class="tdname"
                      >
                        <input
                          type="hidden"
                          :name="input.name"
                          v-model="input.value"
                        />
                      </div>
                    </q-td>
                    <!-- 如果 drinks 存在，顯示 Main 的欄位 -->
                    <q-td v-if="props.row.drinks" class="tdmain">
                      <div v-html="props.row.Main"></div>
                    </q-td>
                    <!-- 如果 drinks 存在，顯示 drinks 的欄位 -->
                    <q-td v-if="props.row.drinks" class="tdmain">
                      <div v-html="props.row.drinks"></div>
                    </q-td>
                    <!-- 如果 drinks 不存在，那麼 Main 的欄位擴展為 2 列 -->
                    <q-td v-else colspan="2" class="tdmain2x">
                      <div v-html="props.row.Main"></div>
                    </q-td>
                    <q-td class="tdmain"
                      ><div v-html="props.row.bentoMains"></div
                    ></q-td>
                    <q-td class="tdmain"
                      >{{ props.row.price }}
                      <div
                        v-for="(productInput, index) in props.row.productInputs"
                        :key="index"
                        class="tdname"
                      >
                        <input
                          type="hidden"
                          :name="productInput.name"
                          v-model="productInput.value"
                        />
                      </div>
                    </q-td>
                    <q-td class="tdedit">
                      <div class="row w-100">
                        <div class="col">
                          <q-btn
                            icon="delete"
                            color="warning"
                            text-color="black"
                            size="lg"
                            round
                            @click="deleteRow(props.row.id)"
                          />
                          <q-btn
                            icon="edit"
                            round
                            size="lg"
                            color="warning"
                            text-color="black"
                            class="q-ml-xs"
                            @click="editRowDialog(props.row)"
                          />
                        </div>
                      </div>
                    </q-td>
                    <q-td auto-width>
                      <q-toggle
                        color="accent"
                        v-model="props.expand"
                        checked-icon="add"
                        unchecked-icon="remove"
                      />
                    </q-td>
                  </q-tr>
                  <q-tr v-show="props.expand" :props="props">
                    <q-td colspan="100%">
                      <div class="text-left">
                        <q-input readonly v-model="props.row.comment"></q-input>
                      </div>
                    </q-td>
                  </q-tr>
                </template>
                <template v-slot:no-data="{ message }">
                  <div
                    class="full-width row flex-center text-blue-grey-7 q-gutter-sm"
                  >
                    <q-icon size="2em" name="restaurant"></q-icon>
                    <span style="font-size: 22px">
                      {{ message }}
                    </span>
                  </div>
                </template>
              </q-table>
            </div>
          </div>
        </div>
        <!-- 招牌便當修改 dialog -->
        <q-dialog v-model="editDialog1" maximized>
          <q-card
            class="items-start word-break q-pa-none q-ma-none"
            id="bangdongcard"
          >
            <div class="color2 bangdongdialog row items-center text-white">
              <div class="text-h5 col-1">{{ bangdong1Name }}</div>
              <div class="text-h5 q-ml-md col-2 row items-center">
                總計
                <q-input
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px' }"
                  class="w-110px q-ml-lg"
                  v-model.number="bangdong1EditTotalQuantity"
                  label="數量總計"
                  :bg-color="getInputColor(bangdong1EditTotalQuantity)"
                  min="0"
                />
              </div>
              <div class="col"></div>
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                label-color="white"
                class="q-ma-xs w-110px text-white"
                v-model.number="bangdong1EditArbitrarily"
                label="任意搭配"
                min="0"
              />
              <q-input
                min="0"
                filled
                type="number"
                class="q-ma-xs w-110px text-white"
                :input-style="{ fontSize: '20px', color: 'white' }"
                v-model.number="bangdong1EditPrice"
                label="商品單價"
                label-color="white"
                readonly
              />
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-150px text-white"
                v-model.number="bangdong1EditTotalQuantityPrice"
                label="餐點總計"
                label-color="white"
                readonly
                min="0"
              />
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-150px text-white"
                v-model.number="bangdong1EditoptionPrice"
                label="選項總計"
                label-color="white"
                readonly
                min="0"
              />
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-150px text-white"
                v-model.number="bangdong1EditfinalTotal"
                label="總計"
                label-color="white"
                readonly
                min="0"
              />
            </div>
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">{{ bangdong1MainName }}</h5>
              <div class="row items-center">
                <q-item
                  v-for="(bangdong1EditMain, index) in bangdong1EditMains"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdong1EditMain.quantity"
                    :bg-color="getInputColor(bangdong1EditMain.quantity)"
                    :label="bangdong1EditMain.shortname"
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    min="0"
                    class="w-110px q-ma-xs"
                  />
                </q-item>
              </div>
            </div>
            <!-- 飲料 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">{{ bangdong1DrinkName }}</h5>
              <div class="row items-center">
                <q-item
                  v-for="(bangdong1EditDrink, index) in bangdong1EditDrinks"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdong1EditDrink.quantity"
                    :label="bangdong1EditDrink.name"
                    filled
                    type="number"
                    :bg-color="getInputColor(bangdong1EditDrink.quantity)"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="w-110px q-ma-xs"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 配菜 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">{{ bangdong1SideDishName }}</h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdong1EditSideDish, index
                  ) in bangdong1EditSideDishes"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdong1EditSideDish.quantity"
                    :label="bangdong1EditSideDish.name"
                    filled
                    :bg-color="getInputColor(bangdong1EditSideDish.quantity)"
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="w-110px q-ma-xs"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 總計 -->
            <div class="color1 bangdongdialog">
              <div class="row"></div>
              <!-- 按鈕 -->
            </div>
            <div class="row items-center" style="width: 100%">
              <q-input
                v-model="bangdong1Comment"
                outlined
                label="商品備註"
                class="color1 col-9"
                :bg-color="inputColor"
              />
              <q-btn
                label="取消"
                color="dark"
                size="25px"
                @click="closeEditDialog1"
                class="q-mx-xs btnSubmitCancel"
              />
              <q-btn
                label="儲存"
                color="primary"
                size="25px"
                @click="saveEditDialog1"
                class="q-mx-xs btnSubmitCancel"
              />
            </div>
          </q-card>
        </q-dialog>

        <!-- 雞胸便當修改 dialog -->
        <q-dialog v-model="editDialog2" maximized>
          <q-card
            class="items-start word-break q-pa-none q-ma-none"
            id="bangdongcard"
          >
            <div class="color2 bangdongdialog row items-center text-white">
              <div class="text-h5 col-1">{{ bangdong2Name }}</div>
              <div class="text-h5 q-ml-md col-2 row items-center">
                總計
                <q-input
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px' }"
                  class="w-110px q-ml-lg"
                  :bg-color="getInputColor(bangdong2EditTotalQuantity)"
                  v-model.number="bangdong2EditTotalQuantity"
                  label="數量總計"
                  min="0"
                />
              </div>
              <div class="col"></div>
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-110px text-white"
                label-color="white"
                v-model.number="bangdong2EditArbitrarily"
                label="任意搭配"
                min="0"
              />
              <q-input
                min="0"
                filled
                type="number"
                label-color="white"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-110px text-white"
                v-model.number="bangdong2EditPrice"
                label="商品單價"
                readonly
              />
              <q-input
                filled
                type="number"
                label-color="white"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-150px text-white"
                v-model.number="bangdong2EditTotalQuantityPrice"
                label="餐點總計"
                readonly
                min="0"
              />
              <q-input
                filled
                type="number"
                label-color="white"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-150px text-white"
                v-model.number="bangdong2EditoptionPrice"
                label="選項總計"
                readonly
                min="0"
              />
              <q-input
                filled
                type="number"
                label-color="white"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-150px text-white"
                v-model.number="bangdong2EditfinalTotal"
                label="總計"
                readonly
                min="0"
              />
            </div>
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">{{ bangdong2MainName }}</h5>
              <div class="row items-center">
                <q-item
                  v-for="(bangdong2EditMain, index) in bangdong2EditMains"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdong2EditMain.quantity"
                    :label="bangdong2EditMain.shortname"
                    filled
                    type="number"
                    :bg-color="getInputColor(bangdong2EditMain.quantity)"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="w-110px q-ma-xs"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 飲料 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">{{ bangdong2DrinkName }}</h5>
              <div class="row items-center">
                <q-item
                  v-for="(bangdong2EditDrink, index) in bangdong2EditDrinks"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdong2EditDrink.quantity"
                    :bg-color="getInputColor(bangdong2EditDrink.quantity)"
                    :label="bangdong2EditDrink.name"
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="w-110px q-ma-xs"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 副主餐 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdong2BentoMainName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdong2EditBentoMain, index
                  ) in bangdong2EditBentoMains"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdong2EditBentoMain.quantity"
                    :label="bangdong2EditBentoMain.name"
                    filled
                    type="number"
                    :bg-color="getInputColor(bangdong2EditBentoMain.quantity)"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="w-110px q-ma-xs"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 配菜 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">{{ bangdong2SideDishName }}</h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdong2EditSideDish, index
                  ) in bangdong2EditSideDishes"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdong2EditSideDish.quantity"
                    :label="bangdong2EditSideDish.name"
                    filled
                    type="number"
                    :bg-color="getInputColor(bangdong2EditSideDish.quantity)"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="w-110px q-ma-xs"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 總計 -->
            <div class="color1 bangdongdialog">
              <div class="row"></div>
            </div>
            <!-- 按鈕 -->
            <div class="row items-center" style="width: 100%">
              <q-input
                v-model="bangdong2Comment"
                outlined
                label="商品備註"
                class="col-8"
                :bg-color="inputColor"
              />
              <q-btn
                label="取消"
                color="dark"
                size="25px"
                class="q-mx-xs btnSubmitCancel"
                @click="closeEditDialog2"
              />
              <q-btn
                label="儲存"
                color="primary"
                size="25px"
                @click="saveEditDialog2"
                class="q-mx-xs btnSubmitCancel"
              />
            </div>
          </q-card>
        </q-dialog>

        <!-- 雞腿便當修改 dialog -->
        <q-dialog v-model="editDialog3" maximized>
          <q-card
            class="items-start word-break q-pa-none q-ma-none"
            id="bangdongcard"
          >
            <div class="color2 bangdongdialog row items-center text-white">
              <div class="text-h5 col-1">{{ bangdong3Name }}</div>
              <div class="text-h5 q-ml-md col-2 row items-center">
                總計
                <q-input
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px' }"
                  class="w-110px q-ml-lg"
                  v-model.number="bangdong3EditTotalQuantity"
                  label="數量總計"
                  :bg-color="getInputColor(bangdong3EditTotalQuantity)"
                  min="0"
                />
              </div>
              <div class="col"></div>
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-110px text-white"
                v-model.number="bangdong3EditArbitrarily"
                label="任意搭配"
                label-color="white"
                min="0"
              />
              <q-input
                min="0"
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-110px text-white"
                v-model.number="bangdong3EditPrice"
                label="商品單價"
                label-color="white"
                readonly
              />
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-150px text-white"
                v-model.number="bangdong3EditTotalQuantityPrice"
                label="餐點總計"
                label-color="white"
                readonly
                min="0"
              />
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-150px text-white"
                v-model.number="bangdong3EditoptionPrice"
                label="選項總計"
                label-color="white"
                readonly
                min="0"
              />
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-150px text-white"
                v-model.number="bangdong3EditfinalTotal"
                label="總計"
                label-color="white"
                readonly
                min="0"
              />
            </div>
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">{{ bangdong3MainName }}</h5>
              <div class="row items-center">
                <q-item
                  v-for="(bangdong3EditMain, index) in bangdong3EditMains"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdong3EditMain.quantity"
                    :label="bangdong3EditMain.shortname"
                    filled
                    type="number"
                    :bg-color="getInputColor(bangdong3EditMain.quantity)"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="w-110px q-ma-xs"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 飲料 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">{{ bangdong3DrinkName }}</h5>
              <div class="row items-center">
                <q-item
                  v-for="(bangdong3EditDrink, index) in bangdong3EditDrinks"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdong3EditDrink.quantity"
                    :label="bangdong3EditDrink.name"
                    filled
                    :bg-color="getInputColor(bangdong3EditDrink.quantity)"
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="w-110px q-ma-xs"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 副主餐 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdong3BentoMainName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdong3EditBentoMain, index
                  ) in bangdong3EditBentoMains"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdong3EditBentoMain.quantity"
                    :bg-color="getInputColor(bangdong3EditBentoMain.quantity)"
                    :label="bangdong3EditBentoMain.name"
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="w-110px q-ma-xs"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 配菜 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0; margin: 0">
                {{ bangdong3SideDishName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdong3EditSideDish, index
                  ) in bangdong3EditSideDishes"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdong3EditSideDish.quantity"
                    :label="bangdong3EditSideDish.name"
                    filled
                    type="number"
                    :bg-color="getInputColor(bangdong3EditSideDish.quantity)"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="w-110px q-ma-xs"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 總計 -->
            <div class="color1 bangdongdialog">
              <!-- 按鈕 -->
              <div class="row items-center" style="width: 100%">
                <q-input
                  :bg-color="inputColor"
                  v-model="bangdong3Comment"
                  outlined
                  label="商品備註"
                  class="col-8"
                />
                <q-btn
                  color="dark"
                  label="取消"
                  @click="closeEditDialog3"
                  size="25px"
                  class="q-mx-xs btnSubmitCancel"
                />
                <q-btn
                  color="primary"
                  label="送出"
                  type="submit"
                  size="25px"
                  class="q-mx-xs btnSubmitCancel"
                  @click="saveEditDialog3"
                />
              </div>
            </div>
          </q-card>
        </q-dialog>

        <!-- 滷牛修改 dialog -->
        <q-dialog v-model="editDialog4" maximized>
          <q-card
            class="items-start word-break q-pa-none q-ma-none"
            id="bangdongcard"
          >
            <div class="color2 bangdongdialog row items-center text-white">
              <div class="text-h5 col-1">{{ bangdong4Name }}</div>
              <div class="text-h5 q-ml-md col-2 row items-center">
                總計
                <q-input
                  filled
                  type="number"
                  class="w-110px q-ml-lg"
                  :input-style="{ fontSize: '20px' }"
                  v-model.number="bangdong4EditTotalQuantity"
                  :bg-color="getInputColor(bangdong4EditTotalQuantity)"
                  label="數量總計"
                  min="0"
                />
              </div>
              <div class="col"></div>
              <q-input
                filled
                type="number"
                label-color="white"
                class="q-ma-xs w-110px text-white"
                :input-style="{ fontSize: '20px', color: 'white' }"
                v-model.number="bangdong4EditArbitrarily"
                label="任意搭配"
                min="0"
              />
              <q-input
                min="0"
                filled
                label-color="white"
                class="q-ma-xs w-110px text-white"
                :input-style="{ fontSize: '20px', color: 'white' }"
                v-model.number="bangdong4EditPrice"
                label="商品單價"
                readonly
              />
              <q-input
                filled
                label-color="white"
                class="q-ma-xs w-150px text-white"
                :input-style="{ fontSize: '20px', color: 'white' }"
                v-model.number="bangdong4EditTotalQuantityPrice"
                label="餐點總計"
                readonly
                min="0"
              />
              <q-input
                filled
                label-color="white"
                class="q-ma-xs w-150px text-white"
                :input-style="{ fontSize: '20px', color: 'white' }"
                v-model.number="bangdong4EditoptionPrice"
                label="選項金額"
                readonly
                min="0"
              />
              <q-input
                filled
                label-color="white"
                class="q-ma-xs w-150px text-white"
                :input-style="{ fontSize: '20px', color: 'white' }"
                v-model.number="bangdong4EditfinalTotal"
                label="總計"
                readonly
                min="0"
              />
            </div>
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">{{ bangdong4MainName }}</h5>
              <div class="row items-center">
                <q-item
                  v-for="(bangdong4EditMain, index) in bangdong4EditMains"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdong4EditMain.quantity"
                    :label="bangdong4EditMain.shortname"
                    filled
                    type="number"
                    :bg-color="getInputColor(bangdong4EditMain.quantity)"
                    class="q-pa-xs w-110px"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 飲料 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">{{ bangdong4DrinkName }}</h5>
              <div class="row items-center">
                <q-item
                  v-for="(bangdong4EditDrink, index) in bangdong4EditDrinks"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdong4EditDrink.quantity"
                    :label="bangdong4EditDrink.name"
                    filled
                    type="number"
                    :bg-color="getInputColor(bangdong4EditDrink.quantity)"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 副主餐 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdong4BentoMainName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdong4EditBentoMain, index
                  ) in bangdong4EditBentoMains"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdong4EditBentoMain.quantity"
                    :bg-color="getInputColor(bangdong4EditBentoMain.quantity)"
                    :label="bangdong4EditBentoMain.name"
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 配菜 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">{{ bangdong4SideDishName }}</h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdong4EditSideDish, index
                  ) in bangdong4EditSideDishes"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdong4EditSideDish.quantity"
                    :label="bangdong4EditSideDish.name"
                    filled
                    :bg-color="getInputColor(bangdong4EditSideDish.quantity)"
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 總計 -->
            <div class="color1 bangdongdialog">
              <!-- 按鈕 -->
              <div class="row items-center q-ml-md" style="width: 100%">
                <q-input
                  v-model="bangdong4Comment"
                  outlined
                  label="商品備註"
                  class="color1 col-8"
                  :bg-color="inputColor"
                />
                <q-btn
                  label="取消"
                  color="dark"
                  @click="closeEditDialog4"
                  size="25px"
                  class="q-mx-xs btnSubmitCancel"
                />
                <q-btn
                  label="儲存"
                  color="primary"
                  @click="saveEditDialog4"
                  size="25px"
                  class="q-mx-xs btnSubmitCancel"
                />
              </div>
            </div>
          </q-card>
        </q-dialog>
        <!-- salmon -->
        <q-dialog v-model="editDialogSalmon" maximized>
          <q-card
            class="items-start word-break q-pa-none q-ma-none"
            id="bangdongcard"
          >
            <div class="color2 bangdongdialog row items-center text-white">
              <div class="text-h5 col-1">{{ bangdongSalmonName }}</div>
              <div class="text-h5 q-ml-md col-2 row items-center">
                總計
                <q-input
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px' }"
                  class="w-110px q-ml-lg"
                  v-model.number="bangdongSalmonEditTotalQuantity"
                  label="數量總計"
                  :bg-color="getInputColor(bangdongSalmonEditTotalQuantity)"
                  min="0"
                />
              </div>
              <div class="col"></div>
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                label-color="white"
                class="q-ma-xs w-110px text-white"
                v-model.number="bangdongSalmonEditArbitrarily"
                label="任意搭配"
                min="0"
              />
              <q-input
                min="0"
                filled
                type="number"
                class="q-ma-xs w-110px text-white"
                :input-style="{ fontSize: '20px', color: 'white' }"
                v-model.number="bangdongSalmonEditPrice"
                label="商品單價"
                label-color="white"
                readonly
              />
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-150px text-white"
                v-model.number="bangdongSalmonEditTotalQuantityPrice"
                label="餐點總計"
                label-color="white"
                readonly
                min="0"
              />
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-150px text-white"
                v-model.number="bangdongSalmonEditoptionPrice"
                label="選項總計"
                label-color="white"
                readonly
                min="0"
              />
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-150px text-white"
                v-model.number="bangdongSalmonEditfinalTotal"
                label="總計"
                label-color="white"
                readonly
                min="0"
              />
            </div>
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdongSalmonMainName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongSalmonEditMain, index
                  ) in bangdongSalmonEditMains"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdongSalmonEditMain.quantity"
                    :label="bangdongSalmonEditMain.name"
                    filled
                    type="number"
                    :bg-color="getInputColor(bangdongSalmonEditMain.quantity)"
                    class="q-pa-xs w-110px"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 飲料 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdongSalmonDrinkName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongSalmonEditDrink, index
                  ) in bangdongSalmonEditDrinks"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdongSalmonEditDrink.quantity"
                    :label="bangdongSalmonEditDrink.name"
                    filled
                    type="number"
                    :bg-color="getInputColor(bangdongSalmonEditDrink.quantity)"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 副主餐 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdongSalmonBentoMainName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongSalmonEditBentoMain, index
                  ) in bangdongSalmonEditBentoMains"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdongSalmonEditBentoMain.quantity"
                    :bg-color="
                      getInputColor(bangdongSalmonEditBentoMain.quantity)
                    "
                    :label="bangdongSalmonEditBentoMain.name"
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 配菜 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdongSalmonSideDishName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongSalmonEditSideDish, index
                  ) in bangdongSalmonEditSideDishes"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdongSalmonEditSideDish.quantity"
                    :label="bangdongSalmonEditSideDish.name"
                    filled
                    :bg-color="
                      getInputColor(bangdongSalmonEditSideDish.quantity)
                    "
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 總計 -->
            <div class="color1 bangdongdialog">
              <!-- 按鈕 -->
              <div class="row items-center q-ml-md" style="width: 100%">
                <q-input
                  v-model="bangdongSalmonComment"
                  outlined
                  label="商品備註"
                  class="color1 col-8"
                  :bg-color="inputColor"
                />
                <q-btn
                  label="取消"
                  color="dark"
                  @click="closeEditDialogSalmon"
                  size="25px"
                  class="q-mx-xs btnSubmitCancel"
                />
                <q-btn
                  label="儲存"
                  color="primary"
                  @click="saveEditDialogSalmon"
                  size="25px"
                  class="q-mx-xs btnSubmitCancel"
                />
              </div>
            </div>
          </q-card>
        </q-dialog>
        <!-- 素食便當 125 修改 dialog -->
        <q-dialog v-model="editDialogV1" maximized>
          <q-card
            class="items-start word-break q-pa-none q-ma-none"
            id="bangdongcard"
          >
            <div class="color2 bangdongdialog row items-center text-white">
              <div class="text-h5 col-1">{{ bangdongVegetarian1Name }}</div>
              <div class="text-h5 q-ml-md col-2 row items-center">
                總計
                <q-input
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px' }"
                  class="w-110px q-ml-lg"
                  v-model.number="bangdongVegetarian1EditTotalQuantity"
                  label="數量總計"
                  :bg-color="
                    getInputColor(bangdongVegetarian1EditTotalQuantity)
                  "
                  min="0"
                />
              </div>
              <div class="col"></div>
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                label-color="white"
                class="q-ma-xs w-110px text-white"
                v-model.number="bangdongVegetarian1EditArbitrarily"
                label="任意搭配"
                min="0"
              />
              <q-input
                min="0"
                filled
                type="number"
                class="q-ma-xs w-110px text-white"
                :input-style="{ fontSize: '20px', color: 'white' }"
                v-model.number="bangdongVegetarian1EditPrice"
                label="商品單價"
                label-color="white"
                readonly
              />
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-150px text-white"
                v-model.number="bangdongVegetarian1EditTotalQuantityPrice"
                label="餐點總計"
                label-color="white"
                readonly
                min="0"
              />
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-150px text-white"
                v-model.number="bangdongVegetarian1EditoptionPrice"
                label="選項總計"
                label-color="white"
                readonly
                min="0"
              />
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-150px text-white"
                v-model.number="bangdongVegetarian1EditfinalTotal"
                label="總計"
                label-color="white"
                readonly
                min="0"
              />
            </div>
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdongVegetarian1MainName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongVegetarian1EditMain, index
                  ) in bangdongVegetarian1EditMains"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdongVegetarian1EditMain.quantity"
                    :label="bangdongVegetarian1EditMain.shortname"
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                    :bg-color="
                      getInputColor(bangdongVegetarian1EditMain.quantity)
                    "
                  />
                </q-item>
              </div>
            </div>
            <!-- 飲料 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdongVegetarian1DrinkName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongVegetarian1EditDrink, index
                  ) in bangdongVegetarian1EditDrinks"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdongVegetarian1EditDrink.quantity"
                    :bg-color="
                      getInputColor(bangdongVegetarian1EditDrink.quantity)
                    "
                    :label="bangdongVegetarian1EditDrink.name"
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 副主餐 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdongVegetarian1BentoMainName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongVegetarian1EditBentoMain, index
                  ) in bangdongVegetarian1EditBentoMains"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdongVegetarian1EditBentoMain.quantity"
                    :label="bangdongVegetarian1EditBentoMain.name"
                    :bg-color="
                      getInputColor(bangdongVegetarian1EditBentoMain.quantity)
                    "
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 配菜 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdongVegetarian1SideDishName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongVegetarian1EditSideDish, index
                  ) in bangdongVegetarian1EditSideDishes"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdongVegetarian1EditSideDish.quantity"
                    :label="bangdongVegetarian1EditSideDish.name"
                    :bg-color="
                      getInputColor(bangdongVegetarian1EditSideDish.quantity)
                    "
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 總計 -->
            <div class="color1 bangdongdialog">
              <!-- 按鈕 -->
              <div class="row items-center" style="width: 100%">
                <q-input
                  v-model="bangdongVegetarian1Comment"
                  outlined
                  label="商品備註"
                  class="color1 col-8"
                  :bg-color="inputColor"
                />
                <q-btn
                  label="取消"
                  color="dark"
                  @click="closeEditDialogV1"
                  size="25px"
                  class="q-mx-xs btnSubmitCancel"
                />
                <q-btn
                  label="儲存"
                  color="primary"
                  @click="saveEditDialogV1"
                  size="25px"
                  class="q-mx-xs btnSubmitCancel"
                />
              </div>
            </div>
          </q-card>
        </q-dialog>
        <!-- 素食便當 150 修改 dialog -->
        <q-dialog v-model="editDialogV2" maximized>
          <q-card
            class="items-start word-break q-pa-none q-ma-none"
            id="bangdongcard"
          >
            <div class="color2 bangdongdialog row items-center text-white">
              <div class="text-h5 col-1">{{ bangdongVegetarian2Name }}</div>
              <div class="text-h5 q-ml-md col-2 row items-center">
                總計
                <q-input
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px' }"
                  class="w-110px q-ml-lg"
                  v-model.number="bangdongVegetarian2EditTotalQuantity"
                  label="數量總計"
                  :bg-color="
                    getInputColor(bangdongVegetarian2EditTotalQuantity)
                  "
                  min="0"
                />
              </div>
              <div class="col"></div>
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                label-color="white"
                class="q-ma-xs w-110px text-white"
                v-model.number="bangdongVegetarian2EditArbitrarily"
                label="任意搭配"
                min="0"
              />
              <q-input
                min="0"
                filled
                type="number"
                class="q-ma-xs w-110px text-white"
                :input-style="{ fontSize: '20px', color: 'white' }"
                v-model.number="bangdongVegetarian2EditPrice"
                label="商品單價"
                label-color="white"
                readonly
              />
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-150px text-white"
                v-model.number="bangdongVegetarian2EditTotalQuantityPrice"
                label="餐點總計"
                label-color="white"
                readonly
                min="0"
              />
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-150px text-white"
                v-model.number="bangdongVegetarian2EditoptionPrice"
                label="選項總計"
                label-color="white"
                readonly
                min="0"
              />
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-150px text-white"
                v-model.number="bangdongVegetarian2EditfinalTotal"
                label="總計"
                label-color="white"
                readonly
                min="0"
              />
            </div>
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdongVegetarian2MainName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongVegetarian2EditMain, index
                  ) in bangdongVegetarian2EditMains"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdongVegetarian2EditMain.quantity"
                    :label="bangdongVegetarian2EditMain.shortname"
                    filled
                    type="number"
                    :bg-color="
                      getInputColor(bangdongVegetarian2EditMain.quantity)
                    "
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 飲料 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdongVegetarian2DrinkName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongVegetarian2EditDrink, index
                  ) in bangdongVegetarian2EditDrinks"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdongVegetarian2EditDrink.quantity"
                    :label="bangdongVegetarian2EditDrink.name"
                    filled
                    type="number"
                    :bg-color="
                      getInputColor(bangdongVegetarian2EditDrink.quantity)
                    "
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 副主餐 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdongVegetarian2BentoMainName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongVegetarian2EditBentoMain, index
                  ) in bangdongVegetarian2EditBentoMains"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdongVegetarian2EditBentoMain.quantity"
                    :label="bangdongVegetarian2EditBentoMain.name"
                    filled
                    type="number"
                    :bg-color="
                      getInputColor(bangdongVegetarian2EditBentoMain.quantity)
                    "
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 配菜 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdongVegetarian2SideDishName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongVegetarian2EditSideDish, index
                  ) in bangdongVegetarian2EditSideDishes"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdongVegetarian2EditSideDish.quantity"
                    :label="bangdongVegetarian2EditSideDish.name"
                    filled
                    type="number"
                    :bg-color="
                      getInputColor(bangdongVegetarian2EditSideDish.quantity)
                    "
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 總計 -->
            <div class="color1 bangdongdialog">
              <!-- 按鈕 -->
              <div class="row items-center" style="width: 100%">
                <q-input
                  v-model="bangdongVegetarian2Comment"
                  outlined
                  label="商品備註"
                  class="color1 col-8"
                  :bg-color="inputColor"
                />
                <q-btn
                  label="取消"
                  color="dark"
                  @click="closeEditDialogV2"
                  size="25px"
                  class="q-mx-xs btnSubmitCancel"
                />
                <q-btn
                  label="儲存"
                  color="primary"
                  @click="saveEditDialogV2"
                  size="25px"
                  class="q-mx-xs btnSubmitCancel"
                />
              </div>
            </div>
          </q-card>
        </q-dialog>
        <!-- 客製招牌便當修改 dialog -->
        <q-dialog v-model="editDialog9" maximized>
          <q-card
            class="items-start word-break q-pa-none q-ma-none"
            id="bangdongcard"
          >
            <div class="color2 bangdongdialog row items-center text-white">
              <div class="text-h5 col-1">{{ bangdongCustom1Name }}</div>
              <div class="text-h5 q-ml-md col-2 row items-center">
                總計
                <q-input
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px' }"
                  class="w-110px q-ml-lg"
                  v-model.number="bangdongCustom1EditTotalQuantity"
                  :bg-color="getInputColor(bangdongCustom1EditTotalQuantity)"
                  label="數量總計"
                  min="0"
                />
              </div>
              <div class="col"></div>
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-110px text-white"
                v-model.number="bangdongCustom1EditArbitrarily"
                label-color="white"
                label="任意搭配"
                min="0"
              />

              <q-input
                min="0"
                filled
                type="number"
                label-color="white"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-110px text-white"
                v-model.number="bangdongCustom1EditPrice"
                label="商品單價"
              />
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-150px text-white"
                v-model.number="bangdongCustom1EditTotalQuantityPrice"
                label-color="white"
                label="餐點總計"
                readonly
                min="0"
              />
              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-150px text-white"
                v-model.number="bangdongCustom1EditoptionPrice"
                label-color="white"
                label="選項總計"
                min="0"
              />

              <q-input
                filled
                type="number"
                :input-style="{ fontSize: '20px', color: 'white' }"
                class="q-ma-xs w-150px text-white"
                v-model.number="bangdongCustom1EditfinalTotal"
                label-color="white"
                label="總計"
                readonly
                min="0"
              />
            </div>
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdongCustom1MainName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongCustom1EditMain, index
                  ) in bangdongCustom1EditMains"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdongCustom1EditMain.quantity"
                    :label="bangdongCustom1EditMain.name"
                    filled
                    type="number"
                    :bg-color="getInputColor(bangdongCustom1EditMain.quantity)"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 飲料 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdongCustom1DrinkName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongCustom1EditDrink, index
                  ) in bangdongCustom1EditDrinks"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdongCustom1EditDrink.quantity"
                    :label="bangdongCustom1EditDrink.name"
                    filled
                    type="number"
                    :bg-color="getInputColor(bangdongCustom1EditDrink.quantity)"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 副主餐 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdongCustom1BentoMainName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongCustom1EditBentoMain, index
                  ) in bangdongCustom1EditBentoMains"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdongCustom1EditBentoMain.quantity"
                    :label="bangdongCustom1EditBentoMain.name"
                    filled
                    type="number"
                    :bg-color="
                      getInputColor(bangdongCustom1EditBentoMain.quantity)
                    "
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 配菜 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdongCustom1SideDishName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongCustom1EditSideDish, index
                  ) in bangdongCustom1EditSideDishes"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="bangdongCustom1EditSideDish.quantity"
                    :label="bangdongCustom1EditSideDish.name"
                    filled
                    type="number"
                    :bg-color="
                      getInputColor(bangdongCustom1EditSideDish.quantity)
                    "
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 總計 -->
            <div class="color1 bangdongdialog">
              <!-- 按鈕 -->
              <div class="row items-center" style="width: 100%">
                <q-input
                  v-model="bangdongCustom1Comment"
                  outlined
                  label="商品備註"
                  class="color1 col-8"
                  :bg-color="inputColor"
                />
                <q-btn
                  label="取消"
                  color="dark"
                  @click="closeEditDialog9"
                  size="25px"
                  class="q-mx-xs btnSubmitCancel"
                />
                <q-btn
                  label="儲存"
                  color="primary"
                  @click="saveEditDialog9"
                  size="25px"
                  class="q-mx-xs btnSubmitCancel"
                />
              </div>
            </div>
          </q-card>
        </q-dialog>
        <!-- 經濟盒餐修改 dialog -->
        <q-dialog v-model="editDialog5" maximized>
          <q-card>
            <div class="row items-start justify-center" id="lunchbox1">
              <div class="color2 bangdongdialog row items-center text-white">
                <h5 style="margin: 0; padding: 0">
                  {{ lunchBox1EditName }} 總計
                </h5>
                <q-input
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px' }"
                  class="q-pa-xs w-110px"
                  v-model.number="lunchBox1EditTotalQuantity"
                  label="數量總計"
                  :bg-color="getInputColor(lunchBox1EditTotalQuantity)"
                  min="0"
                />
                <div class="col"></div>
                <div class="row">
                  <q-input
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px', color: 'white' }"
                    class="q-pa-xs w-110px"
                    v-model.number="lunchBox1EditArbitrarily"
                    label="任意搭配"
                    label-color="white"
                    min="0"
                  />
                  <q-input
                    min="0"
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px', color: 'white' }"
                    class="q-pa-xs w-110px"
                    label-color="white"
                    v-model.number="lunchBox1EditPrice"
                    label="商品單價"
                    readonly
                  />
                  <q-input
                    filled
                    type="number"
                    class="q-pa-xs w-150px"
                    v-model.number="lunchBox1EditTotalQuantityPrice"
                    :input-style="{ fontSize: '20px', color: 'white' }"
                    label="餐點總計"
                    label-color="white"
                    readonly
                    min="0"
                  />
                  <q-input
                    filled
                    type="number"
                    class="q-pa-xs w-150px"
                    v-model.number="lunchBox1EditoptionPrice"
                    :input-style="{ fontSize: '20px', color: 'white' }"
                    label="選項總計"
                    label-color="white"
                    readonly
                    min="0"
                  />
                  <q-input
                    filled
                    type="number"
                    class="q-pa-xs w-150px"
                    v-model.number="lunchbox1EditfinalTotal"
                    :input-style="{ fontSize: '20px', color: 'white' }"
                    label="總計"
                    label-color="white"
                    readonly
                    min="0"
                  />
                </div>
              </div>

              <div
                v-for="(lunchBox1EditMain, index) in lunchBox1EditMains"
                :key="index"
              >
                <h6 style="margin: 0; padding: 0">
                  {{ lunchBox1EditMain.shortname }}
                </h6>
                <q-input
                  v-model.number="lunchBox1EditMain.quantity"
                  :label="lunchBox1EditMain.shortname"
                  filled
                  type="number"
                  :bg-color="getInputColor(lunchBox1EditMain.quantity)"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  class="q-pa-xs w-110px"
                  min="0"
                />
              </div>
            </div>
            <div class="row items-center" style="width: 100%">
              <q-input
                v-model="lunchbox1Comment"
                outlined
                label="商品備註"
                class="color1 col-9 q-mx-lg"
                :bg-color="inputColor"
              />
              <q-btn
                color="dark"
                label="取消"
                @click="closeEditDialog5"
                size="30px"
                class="q-ma-xs col-1"
              />
              <q-btn
                color="primary"
                label="儲存"
                type="submit"
                size="30px"
                class="q-ma-xs col-1"
                @click="saveEditDialog5"
              />
            </div>
          </q-card>
        </q-dialog>
        <!-- 會議盒餐 -->
        <q-dialog v-model="editDialog6" maximized>
          <q-card>
            <div class="row items-start justify-center" id="lunchbox2Edit">
              <div class="color2 bangdongdialog row items-center text-white">
                <h5 style="margin: 0; padding: 0">{{ lunchBox2EditName }}</h5>
                <q-input
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px' }"
                  class="q-pa-xs w-110px"
                  v-model.number="lunchBox2EditTotalQuantity"
                  label="數量總計"
                  :bg-color="getInputColor(lunchBox2EditTotalQuantity)"
                  min="0"
                />
                <div class="col"></div>
                <div class="row">
                  <q-input
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px', color: 'white' }"
                    label-color="white"
                    class="q-pa-xs w-110px"
                    v-model.number="lunchBox2EditArbitrarily"
                    label="任意搭配"
                    min="0"
                  />
                  <q-input
                    min="0"
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px', color: 'white' }"
                    label-color="white"
                    class="q-pa-xs w-110px"
                    v-model.number="lunchBox2EditPrice"
                    label="商品單價"
                    readonly
                  />
                  <q-input
                    filled
                    type="number"
                    class="q-pa-xs w-150px"
                    v-model.number="lunchBox2EditTotalQuantityPrice"
                    :input-style="{ fontSize: '20px', color: 'white' }"
                    label="餐點總計"
                    label-color="white"
                    readonly
                    min="0"
                  />
                  <q-input
                    filled
                    type="number"
                    class="q-pa-xs w-150px"
                    v-model.number="lunchBox2EditoptionPrice"
                    :input-style="{ fontSize: '20px', color: 'white' }"
                    label="選項總計"
                    label-color="white"
                    readonly
                    min="0"
                  />
                  <q-input
                    filled
                    type="number"
                    class="q-pa-xs w-150px"
                    v-model.number="lunchbox2EditfinalTotal"
                    :input-style="{ fontSize: '20px', color: 'white' }"
                    label="總計"
                    label-color="white"
                    readonly
                    min="0"
                  />
                </div>
              </div>
              <div
                v-for="(lunchBox2EditMain, index) in lunchBox2EditMains"
                :key="index"
              >
                <h6 style="margin: 0; padding: 0">
                  {{ lunchBox2EditMain.shortname }}
                </h6>
                <q-input
                  v-model.number="lunchBox2EditMain.quantity"
                  :label="lunchBox2EditMain.shortname"
                  filled
                  type="number"
                  :bg-color="getInputColor(lunchBox2EditMain.quantity)"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  class="q-pa-xs w-110px"
                  min="0"
                />
                <h5 style="margin: 0; padding: 0">
                  {{ lunchBox2EditDrinkName }}
                </h5>
                <div
                  v-for="(
                    lunchBox2EditDrink, drinkIndex
                  ) in lunchBox2EditMain.drinks"
                  :key="drinkIndex"
                >
                  <q-input
                    v-model.number="lunchBox2EditDrink.quantity"
                    :label="lunchBox2EditDrink.name"
                    filled
                    type="number"
                    :bg-color="getInputColor(lunchBox2EditDrink.quantity)"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </div>
              </div>
            </div>
            <!-- 配菜 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ lunchBox2EditSideDishName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    lunchBox2EditSideDish, index
                  ) in lunchBox2EditSideDishes"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="lunchBox2EditSideDish.quantity"
                    :label="lunchBox2EditSideDish.name"
                    filled
                    type="number"
                    :bg-color="getInputColor(lunchBox2EditSideDish.quantity)"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 總計 -->
            <div class="color1 bangdongdialog">
              <!-- 按鈕 -->
              <div class="row items-center" style="width: 100%">
                <q-input
                  v-model="lunchbox2Comment"
                  outlined
                  label="商品備註"
                  class="color1 col-9 q-mx-lg"
                  :bg-color="inputColor"
                />

                <q-btn
                  color="dark"
                  label="取消"
                  @click="closeEditDialog6"
                  size="30px"
                  class="q-ma-xs"
                />
                <q-btn
                  color="primary"
                  label="儲存"
                  type="submit"
                  size="30px"
                  class="q-ma-xs"
                  @click="saveEditDialog6"
                />
              </div>
            </div>
          </q-card>
        </q-dialog>
        <!-- 貴賓盒餐 -->
        <q-dialog v-model="editDialog7" maximized>
          <q-card>
            <div
              class="row items-start justify-center q-gutter-xs"
              id="lunchbox3Edit"
            >
              <div class="color2 bangdongdialog row items-center text-white">
                <h5 style="margin: 0; padding: 0">{{ lunchBox3EditName }}</h5>
                <q-input
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px' }"
                  class="q-pa-xs w-110px"
                  v-model.number="lunchBox3EditTotalQuantity"
                  label="數量總計"
                  :bg-color="getInputColor(lunchBox3EditTotalQuantity)"
                  min="0"
                />
                <div class="col"></div>
                <div class="row">
                  <q-input
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    v-model.number="lunchBox3EditArbitrarily"
                    label="任意搭配"
                    min="0"
                  />
                  <q-input
                    min="0"
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    v-model.number="lunchBox3EditPrice"
                    label="商品單價"
                    readonly
                  />
                  <q-input
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-150px"
                    v-model.number="lunchBox3EditTotalQuantityPrice"
                    label="餐點總計"
                    readonly
                    min="0"
                  />
                  <q-input
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-150px"
                    v-model.number="lunchBox3EditoptionPrice"
                    label="選項總計"
                    readonly
                    min="0"
                  />
                  <q-input
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-150px"
                    v-model.number="lunchbox3EditfinalTotal"
                    label="總計"
                    readonly
                    min="0"
                  />
                </div>
              </div>
              <div
                v-for="(lunchBox3EditMain, index) in lunchBox3EditMains"
                :key="index"
              >
                <h6 style="margin: 0; padding: 0">
                  {{ lunchBox3EditMain.shortname }}
                </h6>
                <q-input
                  v-model.number="lunchBox3EditMain.quantity"
                  :label="lunchBox3EditMain.shortname"
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :label-style="{ fontSize: '20px' }"
                  class="q-pa-xs w-110px"
                  :bg-color="getInputColor(lunchBox3EditMain.quantity)"
                  min="0"
                />
                <h5 style="margin: 0; padding: 0">
                  {{ lunchBox3EditDrinkName }}
                </h5>
                <div
                  v-for="(
                    lunchBox3EditDrink, drinkIndex
                  ) in lunchBox3EditMain.drinks"
                  :key="drinkIndex"
                >
                  <q-input
                    v-model.number="lunchBox3EditDrink.quantity"
                    :label="lunchBox3EditDrink.name"
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    :bg-color="getInputColor(lunchBox3EditDrink.quantity)"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </div>
              </div>
            </div>
            <!-- 配菜 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ lunchBox3EditSideDishName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    lunchBox3EditSideDish, index
                  ) in lunchBox3EditSideDishes"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="lunchBox3EditSideDish.quantity"
                    :label="lunchBox3EditSideDish.name"
                    filled
                    type="number"
                    :bg-color="getInputColor(lunchBox3EditSideDish.quantity)"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 總計 -->
            <div class="color1 bangdongdialog">
              <!-- 按鈕 -->
              <div class="row items-center" style="width: 100%">
                <q-input
                  v-model="lunchbox3Comment"
                  outlined
                  label="商品備註"
                  class="color1 col-9 q-mx-lg"
                  :bg-color="inputColor"
                />

                <q-btn
                  color="dark"
                  label="取消"
                  @click="closeEditDialog7"
                  size="30px"
                  class="q-ma-xs col-1"
                />
                <q-btn
                  color="primary"
                  label="儲存"
                  type="submit"
                  size="30px"
                  class="q-ma-xs col-1"
                  @click="saveEditDialog7"
                />
              </div>
            </div>
          </q-card>
        </q-dialog>
        <!-- 首席盒餐 -->
        <q-dialog v-model="editDialog8" maximized>
          <q-card>
            <div class="row items-start justify-center" id="lunchbox1Edit">
              <div class="color2 bangdongdialog row items-center text-white">
                <h5 style="margin: 0; padding: 0">{{ lunchBox214EditName }}</h5>
                <q-input
                  filled
                  type="number"
                  label-color="white"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  class="q-pa-xs w-110px"
                  v-model.number="lunchBox4EditTotalQuantity"
                  label="數量總計"
                  :bg-color="getInputColor(lunchBox4EditTotalQuantity)"
                  min="0"
                />
                <div class="row">
                  <q-input
                    filled
                    type="number"
                    class="q-pa-xs w-110px"
                    v-model.number="lunchBox4EditArbitrarily"
                    label="任意搭配"
                    label-color="white"
                    :input-style="{ fontSize: '20px', color: 'white' }"
                    min="0"
                  />

                  <q-input
                    min="0"
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    v-model.number="lunchBox4EditPrice"
                    label="商品單價"
                    readonly
                  />
                  <q-input
                    filled
                    type="number"
                    label-color="white"
                    :input-style="{ fontSize: '20px', color: 'white' }"
                    class="q-pa-xs w-150px"
                    v-model.number="lunchBox4EditTotalQuantityPrice"
                    label="餐點總計"
                    readonly
                    min="0"
                  />
                  <q-input
                    filled
                    type="number"
                    label-color="white"
                    :input-style="{ fontSize: '20px', color: 'white' }"
                    class="q-pa-xs w-150px"
                    v-model.number="lunchBox4EditoptionPrice"
                    label="選項總計"
                    readonly
                    min="0"
                  />
                  <q-input
                    filled
                    type="number"
                    label-color="white"
                    :input-style="{ fontSize: '20px', color: 'white' }"
                    class="q-pa-xs w-150px"
                    v-model.number="lunchbox4EditfinalTotal"
                    label="總計"
                    readonly
                    min="0"
                  />
                </div>
              </div>
              <div
                v-for="(lunchBox4EditMain, index) in lunchBox4EditMains"
                :key="index"
              >
                <h6 style="margin: 0; padding: 0">
                  {{ lunchBox4EditMain.shortname }}
                </h6>
                <q-input
                  v-model.number="lunchBox4EditMain.quantity"
                  :label="lunchBox4EditMain.shortname"
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :bg-color="getInputColor(lunchBox4EditMain.quantity)"
                  :label-style="{ fontSize: '20px' }"
                  class="q-pa-xs w-110px"
                  min="0"
                />
                <h5 style="margin: 0; padding: 0">
                  {{ lunchBox4EditDrinkName }}
                </h5>
                <div
                  v-for="(
                    lunchBox4EditDrink, drinkIndex
                  ) in lunchBox4EditMain.drinks"
                  :key="drinkIndex"
                >
                  <q-input
                    v-model.number="lunchBox4EditDrink.quantity"
                    :label="lunchBox4EditDrink.name"
                    filled
                    type="number"
                    :bg-color="getInputColor(lunchBox4EditDrink.quantity)"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </div>
              </div>
            </div>
            <!-- 配菜 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ lunchBox4EditSideDishName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    lunchBox4EditSideDish, index
                  ) in lunchBox4EditSideDishes"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="lunchBox4EditSideDish.quantity"
                    :label="lunchBox4EditSideDish.name"
                    filled
                    :bg-color="getInputColor(lunchBox4EditSideDish.quantity)"
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 總計 -->
            <div class="color1 bangdongdialog">
              <!-- 按鈕 -->
              <div class="row items-center" style="width: 100%">
                <q-input
                  v-model="lunchbox4Comment"
                  outlined
                  label="商品備註"
                  class="color1 col-9 q-mx-lg"
                  :bg-color="inputColor"
                />

                <q-btn
                  color="dark"
                  label="取消"
                  @click="closeEditDialog8"
                  size="30px"
                  class="q-ma-xs col-1"
                />
                <q-btn
                  color="primary"
                  label="儲存"
                  type="submit"
                  size="30px"
                  class="q-ma-xs col-1"
                  @click="saveEditDialog8"
                />
              </div>
            </div>
          </q-card>
        </q-dialog>
        <!-- 214盒餐修改 -->
        <q-dialog v-model="editDialog214" maximized>
          <q-card>
            <div class="row items-start justify-center" id="lunchbox1Edit">
              <div class="color2 bangdongdialog row items-center text-white">
                <h5 style="margin: 0; padding: 0">{{ lunchBox214EditName }}</h5>
                <q-input
                  filled
                  type="number"
                  label-color="white"
                  :input-style="{ fontSize: '20px', color: 'white' }"
                  class="q-pa-xs w-110px"
                  v-model.number="lunchBox214EditTotalQuantity"
                  label="數量總計"

                  min="0"
                />
                <div class="col"></div>
                  <q-input
                    filled
                    type="number"
                    class="q-pa-xs w-110px"
                    v-model.number="lunchBox214EditArbitrarily"
                    label="任意搭配"
                    label-color="white"
                    :input-style="{ fontSize: '20px', color: 'white' }"
                    min="0"
                  />

                  <q-input
                    min="0"
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    v-model.number="lunchBox214EditPrice"
                    label="商品單價"
                    readonly
                  />
                  <q-input
                    filled
                    type="number"
                    label-color="white"
                    :input-style="{ fontSize: '20px', color: 'white' }"
                    class="q-pa-xs w-150px"
                    v-model.number="lunchBox214EditTotalQuantityPrice"
                    label="餐點總計"
                    readonly
                    min="0"
                  />
                  <q-input
                    filled
                    type="number"
                    label-color="white"
                    :input-style="{ fontSize: '20px', color: 'white' }"
                    class="q-pa-xs w-150px"
                    v-model.number="lunchBox214EditoptionPrice"
                    label="選項總計"
                    readonly
                    min="0"
                  />
                  <q-input
                    filled
                    type="number"
                    label-color="white"
                    :input-style="{ fontSize: '20px', color: 'white' }"
                    class="q-pa-xs w-150px"
                    v-model.number="lunchbox214EditfinalTotal"
                    label="總計"
                    readonly
                    min="0"
                  />

              </div>
              <div
                v-for="(lunchBox214EditMain, index) in lunchBox214EditMains"
                :key="index"
              >
                <h6 style="margin: 0; padding: 0">
                  {{ lunchBox214EditMain.shortname }}
                </h6>
                <q-input
                  v-model.number="lunchBox214EditMain.quantity"
                  :label="lunchBox214EditMain.shortname"
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :bg-color="getInputColor(lunchBox214EditMain.quantity)"
                  :label-style="{ fontSize: '20px' }"
                  class="q-pa-xs w-110px"
                  min="0"
                />
                <h5 style="margin: 0; padding: 0">
                  {{ lunchBox214EditDrinkName }}
                </h5>
                <div
                  v-for="(
                    lunchBox214EditDrink, drinkIndex
                  ) in lunchBox214EditMain.drinks"
                  :key="drinkIndex"
                >
                  <q-input
                    v-model.number="lunchBox214EditDrink.quantity"
                    :label="lunchBox214EditDrink.name"
                    filled
                    type="number"
                    :bg-color="getInputColor(lunchBox214EditDrink.quantity)"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </div>
              </div>
            </div>
            <!-- 配菜 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ lunchBox214EditSideDishName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    lunchBox214EditSideDish, index
                  ) in lunchBox214EditSideDishes"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="lunchBox214EditSideDish.quantity"
                    :label="lunchBox214EditSideDish.name"
                    filled
                    :bg-color="getInputColor(lunchBox214EditSideDish.quantity)"
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- 總計 -->
            <div class="color1 bangdongdialog">
              <!-- 按鈕 -->
              <div class="row items-center" style="width: 100%">
                <q-input
                  v-model="lunchbox214Comment"
                  outlined
                  label="商品備註"
                  class="color1 col-9 q-mx-lg"
                  :bg-color="inputColor"
                />

                <q-btn
                  color="dark"
                  label="取消"
                  @click="closeEditDialog214"
                  size="30px"
                  class="q-ma-xs col-1"
                />
                <q-btn
                  color="primary"
                  label="儲存"
                  type="submit"
                  size="30px"
                  class="q-ma-xs col-1"
                  @click="saveEditDialog214"
                />
              </div>
            </div>
          </q-card>
        </q-dialog>
        <!-- 客製盒餐修改 dialog -->
        <q-dialog v-model="editDialog0" maximized>
          <q-card>
            <div
              class="row items-start justify-center"
              id="lunchBoxCustom1Edit"
            >
              <div class="color2 bangdongdialog row items-center text-white">
                <h5 style="margin: 0; padding: 0">
                  {{ lunchBoxCustom1EditName }}
                </h5>
                <q-input
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px' }"
                  class="q-pa-xs w-110px"
                  v-model.number="lunchBoxCustom1EditTotalQuantity"
                  label="數量總計"
                  :bg-color="getInputColor(lunchBoxCustom1EditTotalQuantity)"
                  min="0"
                />
                <div class="col"></div>
                <div class="row">
                  <q-input
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    v-model.number="lunchBoxCustom1EditArbitrarily"
                    label="任意搭配"
                    label-color="white"
                    min="0"
                  />

                  <q-input
                    min="0"
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    v-model.number="lunchBoxCustom1EditPrice"
                    label="商品單價"
                    label-color="white"
                  />
                  <q-input
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-150px"
                    v-model.number="lunchBoxCustom1EditTotalQuantityPrice"
                    label="選項總計"
                    label-color="white"
                    readonly
                    min="0"
                  />
                  <q-input
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-150px"
                    v-model.number="lunchboxCustom1EditoptionPrice"
                    label="餐點總計"
                    label-color="white"
                    readonly
                    min="0"
                  />

                  <q-input
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-150px"
                    v-model.number="lunchBoxCustom1Editfinaltotal"
                    label="總計"
                    label-color="white"
                    readonly
                    min="0"
                  />
                </div>
              </div>
              <div
                v-for="(
                  lunchBoxCustom1EditMain, index
                ) in lunchBoxCustom1EditMains"
                :key="index"
              >
                <h6 style="margin: 0; padding: 0">
                  {{ lunchBoxCustom1EditMain.shortname }}
                </h6>
                <q-input
                  v-model.number="lunchBoxCustom1EditMain.quantity"
                  :label="lunchBoxCustom1EditMain.shortname"
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px', margin: '0' }"
                  :bg-color="getInputColor(lunchBoxCustom1EditMain.quantity)"
                  :label-style="{ fontSize: '20px' }"
                  class="q-pa-xs w-110px"
                  min="0"
                />
                <h5 style="margin: 0; padding: 0">
                  {{ lunchBoxCustom1EditDrinkName }}
                </h5>
                <div
                  v-for="(
                    lunchBoxCustom1EditDrink, drinkIndex
                  ) in lunchBoxCustom1EditMain.drinks"
                  :key="drinkIndex"
                >
                  <q-input
                    v-model.number="lunchBoxCustom1EditDrink.quantity"
                    :label="lunchBoxCustom1EditDrink.name"
                    filled
                    type="number"
                    :bg-color="getInputColor(lunchBoxCustom1EditDrink.quantity)"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </div>
              </div>
            </div>
            <!-- 6inch -->
            <div class="color1 w-100 q-pa-none q-ma-none">
              <h5 style="margin: 0; padding: 0">
                {{ lunchBoxCustom1Burrito6inchName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    lunchBoxCustom1Burrito6inch, index
                  ) in lunchBoxCustom1Burrito6inchs"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    min="0"
                    v-model.number="lunchBoxCustom1Burrito6inch.quantity"
                    :label="lunchBoxCustom1Burrito6inch.name"
                    filled
                    type="number"
                    :bg-color="
                      getInputColor(lunchBoxCustom1Burrito6inch.quantity)
                    "
                    class="q-ma-xs w-110px"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                  />
                </q-item>
              </div>
            </div>
            <!-- 配菜 -->
            <div class="color1 dialogtitle">
              <h5 style="margin: 0; padding: 0">
                {{ lunchBoxCustom1EditSideDishName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    lunchBoxCustom1EditSideDish, index
                  ) in lunchBoxCustom1EditSideDishes"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    v-model.number="lunchBoxCustom1EditSideDish.quantity"
                    :label="lunchBoxCustom1EditSideDish.name"
                    filled
                    type="number"
                    :bg-color="
                      getInputColor(lunchBoxCustom1EditSideDish.quantity)
                    "
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                    min="0"
                  />
                </q-item>
              </div>
            </div>
            <!-- bentomain -->
            <div class="color1 w-100 bangdongdialog">
              <h5 style="margin: 0; padding: 0">副主餐</h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    lunchBoxCustom1EditBentoMain, index
                  ) in lunchBoxCustom1EditBentoMains"
                  :key="index"
                  class="flex-start"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    min="0"
                    v-model.number="lunchBoxCustom1EditBentoMain.quantity"
                    :label="lunchBoxCustom1EditBentoMain.name"
                    filled
                    type="number"
                    :bg-color="
                      getInputColor(lunchBoxCustom1EditBentoMain.quantity)
                    "
                    class="q-ma-xs w-110px"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                  />
                </q-item>
              </div>
            </div>
            <!-- 總計 -->
            <div class="color1 bangdongdialog">
              <!-- 按鈕 -->
              <div class="row items-center" style="width: 100%">
                <q-input
                  v-model="lunchboxCustom1Comment"
                  outlined
                  label="商品備註"
                  class="color1 col-9 q-mx-lg"
                  :bg-color="inputColor"
                />

                <q-btn
                  color="dark"
                  label="取消"
                  @click="closeEditDialog0"
                  size="30px"
                  class="q-ma-xs col-1"
                />
                <q-btn
                  color="primary"
                  label="儲存"
                  type="submit"
                  size="30px"
                  class="q-ma-xs col-1"
                  @click="saveEditDialog0"
                />
              </div>
            </div>
          </q-card>
        </q-dialog>
        <!-- 單點修改 dialog -->
        <q-dialog v-model="editDialog10" maximized>
          <q-card class="q-gutter-md row items-start word-break">
            <!-- 6 吋潤餅 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">{{ bangdongSolo6inchName }}</h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongSoloEdit6inch, index
                  ) in bangdongSoloEdit6inchs"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    min="0"
                    v-model.number="bangdongSoloEdit6inch.quantity"
                    :bg-color="getInputColor(bangdongSoloEdit6inch.quantity)"
                    :label="bangdongSoloEdit6inch.name"
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                  />
                </q-item>
              </div>
            </div>
            <!-- 3 吋潤餅 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">{{ bangdongSolo3inchName }}</h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongSoloEdit3inch, index
                  ) in bangdongSoloEdit3inchs"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    min="0"
                    v-model.number="bangdongSoloEdit3inch.quantity"
                    :bg-color="getInputColor(bangdongSoloEdit3inch.quantity)"
                    :label="bangdongSoloEdit3inch.name"
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                  />
                </q-item>
              </div>
            </div>
            <!-- 飲料 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">{{ bangdongSoloDrinkName }}</h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongSoloEditDrink, index
                  ) in bangdongSoloEditDrinks"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    min="0"
                    v-model.number="bangdongSoloEditDrink.quantity"
                    :bg-color="getInputColor(bangdongSoloEditDrink.quantity)"
                    :label="bangdongSoloEditDrink.name"
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                  />
                </q-item>
              </div>
            </div>
            <!-- 副主餐 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdongSoloBentoMainName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongSoloEditBentoMain, index
                  ) in bangdongSoloEditBentoMains"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    min="0"
                    v-model.number="bangdongSoloEditBentoMain.quantity"
                    :bg-color="
                      getInputColor(bangdongSoloEditBentoMain.quantity)
                    "
                    :label="bangdongSoloEditBentoMain.name"
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                  />
                </q-item>
              </div>
            </div>
            <!-- 配菜 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdongSoloSideDishName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongSoloEditSideDish, index
                  ) in bangdongSoloEditSideDishes"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    min="0"
                    v-model.number="bangdongSoloEditSideDish.quantity"
                    :label="bangdongSoloEditSideDish.name"
                    :bg-color="getInputColor(bangdongSoloEditSideDish.quantity)"
                    filled
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                  />
                </q-item>
              </div>
            </div>
            <!-- 環保袋 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">
                {{ bangdongSoloEcoBagName }}
              </h5>
              <div class="row items-center">
                <q-item
                  v-for="(
                    bangdongSoloEditEcoBag, index
                  ) in bangdongSoloEditEcoBags"
                  :key="index"
                  class="flex-auto"
                  style="margin: 0; padding: 0"
                >
                  <q-input
                    min="0"
                    v-model.number="bangdongSoloEditEcoBag.quantity"
                    :label="bangdongSoloEditEcoBag.name"
                    filled
                    :bg-color="getInputColor(bangdongSoloEditEcoBag.quantity)"
                    type="number"
                    :input-style="{ fontSize: '20px', margin: '0' }"
                    :label-style="{ fontSize: '20px' }"
                    class="q-pa-xs w-110px"
                  />
                </q-item>
              </div>
            </div>
            <!-- 總計 -->
            <div class="color1 bangdongdialog">
              <h5 style="margin: 0; padding: 0">{{ bangdongSoloName }}</h5>
              <div class="row">
                <q-input
                  min="0"
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px' }"
                  class="q-pa-xs w-110px"
                  v-model.number="bangdongSoloEditTotalQuantity"
                  label="數量總計"
                  :bg-color="inputColor"
                />

                <q-input
                  min="0"
                  filled
                  type="number"
                  :input-style="{ fontSize: '20px' }"
                  class="q-pa-xs w-150px"
                  v-model.number="bangdongSoloEditTotalQuantityPrice"
                  label="金額總計"
                  :bg-color="inputColor"
                  readonly
                />
              </div>
              <!-- 按鈕 -->
              <div class="row items-cetner" style="width: 100%">
                <q-input
                  v-model="bangdongSoloComment"
                  outlined
                  label="商品備註"
                  class="color1 col-9 q-mx-lg"
                  :bg-color="inputColor"
                />

                <q-btn
                  color="dark"
                  label="取消"
                  @click="closeEditDialog10"
                  size="30px"
                  class="q-ma-xs col-1"
                />
                <q-btn
                  color="primary"
                  label="儲存"
                  type="submit"
                  size="30px"
                  class="q-ma-xs col-1"
                  @click="saveEditDialog10"
                />
              </div>
            </div>
          </q-card>
        </q-dialog>
        <!-- 商品備註 -->

        <!-- 結帳金額區域 -->
        <div class="row q-mt-md border1px justify-center w-100">
          <div
            class="col-1 bg-dark text-center row items-center w-100 justify-center"
          >
            <div class="text-h6 text-white">付款方式</div>
          </div>
          <div class="col-5 items-center row">
            <div class="q-pa-xs row col justify-around items-center">
              <q-radio
                v-model="paymentMethod"
                val="cash"
                label="現金"
                class="radio-option"
              />
              <!-- <q-radio
                v-model="paymentMethod"
                val="wire"
                label="轉帳"
                class="radio-option"
              /> -->
              <!-- <q-radio
                v-model="paymentMethod"
                val="credit"
                label="預收款"
                class="radio-option"
              /> -->
              <q-radio
                v-model="paymentMethod"
                val="debt"
                label="記帳"
                class="radio-option"
              />
              <q-radio
                v-model="paymentMethod"
                val="uber"
                label="uber"
                class="radio-option"
              />
              <q-input
                v-if="
                  paymentMethod === 'debt' ||
                  paymentMethod === 'wire' ||
                  paymentMethod === 'credit'
                "
                v-model="getMoneyDate"
                filled
                style="width: 150px"
                label="預計收款日"
                :input-style="{ fontSize: '16px' }"
              >
                <template v-slot:append>
                  <q-icon
                    name="calendar_today"
                    class="cursor-pointer"
                    style="width: 10px"
                  >
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="getMoneyDate"
                        today-btn
                        color="accent"
                        style="width: 800px"
                        mask="YYYY-MM-DD"
                      >
                        <div class="row items-center justify-end">
                          <q-btn label="取消" color="dark" v-close-popup />
                          <q-btn v-close-popup label="確定" color="primary" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div
            class="col-1 bg-dark text-center row items-center w-100 justify-center"
          >
            <div class="text-h6 text-white">折扣</div>
          </div>
          <div class="col-2 text-center">
            <q-input
              filled
              v-model.number="discount"
              style="width: 90px"
              min="0"
            />
          </div>
          <div
            class="col-1 bg-dark text-center row items-center w-100 justify-center"
          >
            <div class="text-h6 text-white">運費</div>
          </div>
          <div class="col-2 text-center">
            <q-input
              filled
              v-model.number="freight"
              style="width: 90px"
              min="0"
            />
          </div>
        </div>
        <div class="row border1px justify-center w-100">
          <div
            class="col-1 bg-dark text-center row items-center w-100 justify-center"
          >
            <div class="text-h6 text-white">總金額</div>
          </div>
          <div class="col-9 row q-px-lg">
            <div class="q-field row no-wrap items-center">
              <div class="col-auto" style="font-size: 20px">總金額</div>
              <q-input
                filled
                v-model.number="total"
                style="width: 90px"
                min="0"
              />
            </div>
            <div class="q-field row no-wrap items-center">
              <div class="col-auto" style="font-size: 20px">已付金額</div>
              <q-input filled v-model.number="paid" style="width: 90px" />
            </div>
            <div class="q-field row no-wrap items-center">
              <div class="col-auto text-accent" style="font-size: 20px">
                未付金額
              </div>
              <q-input
                filled
                v-model.number="unpaid"
                style="width: 90px"
                input-class="text-accent"
              />
            </div>
          </div>
          <div class="col-2 row justify-end"></div>
        </div>
        <div class="row justify-end w-100 q-mt-md">
          <q-btn
            outline
            v-if="!meal.id"
            color="accent"
            @click="alreadyCheck"
            :disabled="isSubmitting"
            label="完成訂單填寫，加入訂單"
            class="col-7 h-100px"
          />
          <q-btn
            outline
            v-if="meal.id"
            color="accent"
            :disabled="isSubmitting"
            label="完成修改訂單，儲存並覆蓋訂單"
            @click="alreadyCheck"
            class="col-7 h-100px"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- 備註 dialog -->
  <q-dialog v-model="mealDialog">
    <q-card>
      <q-card-section>
        <q-item
          v-for="Meal in optionsMeal"
          :key="Meal"
          clickable
          @click="selectOption(Meal)"
        >
          <q-item-section>
            <q-item-label>{{ Meal }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-pagination
          v-if="totalPagesMeal > 0"
          v-model="currentPagemeal"
          :min="1"
          :max="totalPagesMeal"
          :input="true"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="取消" color="primary" @click="closeDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- 備註 dialog -->
  <q-dialog v-model="dialogVisible2" persistent>
    <q-card>
      <q-card-section>
        <q-item
          v-for="option2 in option2s"
          :key="option2"
          clickable
          @click="selectOption2(option2)"
        >
          <q-item-section>
            <q-item-label>{{ option2 }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-pagination
          v-if="totalPage2s > 1"
          v-model="currentPage2"
          :min="1"
          :max="totalPage2s"
          :input="true"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="取消" color="primary" @click="closeDialog2" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- 路名 -->
  <q-dialog v-model="dialogRoad" persistent full-width>
    <q-card>
      <q-card-section>
        <div class="row w-100 items-center">
          <q-input
            v-model="searchTerm"
            placeholder="搜尋..."
            dense
            class="q-mb-md col-10"
          />
          <div class="col-2">
            <q-btn
              label="取消"
              class="q-pl-md"
              color="dark"
              @click="dialogRoad = false"
            />
          </div>
        </div>
        <div class="row w-100 items-center" style="max-height: 100vh">
          <q-btn
            color="primary"
            v-for="road in roads"
            class="col-1 q-ma-xs"
            size="xl"
            :key="road.id"
            clickable
            @click="
              UseRoadStore().getRoadFull(
                personForm.address,
                personForm.address2,
                road.value
              )
            "
          >
            {{ road.value }}
          </q-btn>
          <div class="row w-100 items-baseline">
            <q-btn
              v-for="road in road.roadsFull"
              :key="road.id"
              clickable
              class="fwordbtn q-ma-xs"
              color="primary"
              @click="copyroad(road.value)"
            >
              {{ road.value }}
            </q-btn>
          </div>
        </div>
        <q-pagination
          v-if="totalPages > 0"
          v-model="currentPage"
          :min="1"
          :max="totalPages"
          :input="true"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
  <!-- 確認 -->
  <q-dialog v-model="confirm" persistent>
    <q-card>
      <q-card-section class="row items-center w-100 justify-center">
        <div class="q-ma-md q-pa-md text-h4">確定餐點與配菜數量正確嗎？？</div>
      </q-card-section>

      <div class="row w-100 justify-center">
        <q-btn
          label="再檢查"
          color="dark"
          v-close-popup
          size="20px"
          class="col q-ma-md"
        />
        <q-btn
          v-if="!meal.id"
          label="我確定"
          color="accent"
          size="20px"
          class="col q-ma-md"
          v-close-popup
          @click="addOrder()"
        />
        <q-btn
          v-if="meal.id"
          label="我確定喔"
          color="accent"
          size="20px"
          class="col q-ma-md"
          v-close-popup
          @click="editOrder"
        />
      </div>
    </q-card>
  </q-dialog>
</template>
<!-- --------------------------------------------------- -->
<script setup>
import { ref, watch, computed, reactive } from 'vue'
import { useQuasar, debounce } from 'quasar'
import { apiAuth } from 'src/boot/axios'
// import { UseSearchStore } from 'src/stores/search.js'
import { UseMemberStore } from 'src/stores/member'
import { UseAddressStore } from 'src/stores/address.js'
import SmallKeypad from 'src/components/SmallKeypad.vue'
import { DateTime } from 'luxon'
import { UseMealStore } from 'src/stores/meal.js'
import { UseRoadStore } from 'src/stores/road.js'
import { useTagStore } from 'src/stores/tag.js'
import { onBeforeRouteLeave } from 'vue-router'

// ------------------------------------
const meal = UseMealStore()
const members = UseMemberStore()
const tag = useTagStore()
tag.getTags()
const $q = useQuasar()
const road = UseRoadStore()
const keypad = ref(false)
const address = UseAddressStore()
const inputColor = 'grey-4'

const confirm = ref(false)
// const accept = ref(false)
const menuState = ref(false)
const today = DateTime.now().toFormat('yyyy-MM-dd')
const picks = reactive([
  { label: '外送', value: 'shipping_delivery' },
  { label: '自取', value: 'shipping_pickup' }
])
const eventOptions = ref(tag.tag)
const orderStatus = reactive([
  { label: '未確認', value: 'Pending' },
  { label: '已確認', value: 'Confirmed' },
  { label: '已確認待配餐', value: 'CCP' },
  { label: '作廢', value: 'Void' }
]) // 訂單狀態
// const locationIds = reactive([
//   { label: '重慶南', value: 1 },
//   { label: '和平', value: 2 }
// ]) // 和平店

// 小鍵盤
const activeObject = ref('')
const activeKey = ref('')

const setActiveField = (obj, key) => {
  activeObject.value = obj
  activeKey.value = key
}

// const showNumKeypad = ref(false)
const handleKeypadInput = (input) => {
  console.log('Received value:', typeof input)
  // 處理非數字和特殊字符
  if (
    typeof input === 'string' &&
    isNaN(Number(input)) &&
    !['backspace', '*', ',', '+', ':', '-'].includes(input)
  ) {
    return
  }
  if (activeObject.value && activeKey.value) {
    const key = activeKey.value
    let currentVal = activeObject.value[key]
    // 檢查可能為 undefined, null 或其他非字符串的情況
    currentVal =
      currentVal !== undefined && currentVal !== null ? String(currentVal) : ''

    if (input === 'backspace') {
      // 刪除最後一個字符
      activeObject.value[key] = currentVal.slice(0, -1)
    } else if (['*', '=', '+', ':', '-'].includes(input)) {
      activeObject.value[key] = currentVal + input
    } else {
      // 其他數字和字符
      activeObject.value[key] = currentVal + input
    }
  }
}

// -------------------------------------------
function getInputColor (quantity) {
  return quantity === 0 ? inputColor : 'orange-3'
}

const optionsTaxid = [
  { label: '需要統編', value: 1 },
  { label: '不要統編', value: 0 }
]
// 聯絡人區
const showPersonDialog = ref(false)
function addPerson () {
  showPersonDialog.value = true
}
const inputRef = ref(null)
const hometelRef = ref(null)
const roadRef = ref(null)
// 路名輔助按鈕
// function run2(message) {
//   personForm.road2 += message;
//   inputRef.value.focus();
// }
const optionsGender = [
  { label: '先生', value: 17 },
  { label: '小姐', value: 18, color: 'green' }
]
const addressForm = ref({
  lane: '', // 巷
  alley: '', // 弄
  no: '', // 號
  floor: '', // 樓
  at: '', // 之幾
  room: '' // 室
})
// 取得區域選項
const personForm = reactive({
  checkDate: '',
  formattedDate: '', // 日期抓取
  pick: '', // 取貨方式
  weekday: '', // 星期抓取
  getDate: '', // 送達日期
  week: '', // 星期
  companyClass: '', // 公司類別
  company: '', // 訂購公司
  department: '', // 訂購部門
  compilation: '', // 統編
  name: '', // 訂購人
  tel: '', // 訂購人電話
  prefix: '', // 訂購人區碼
  hometel: '', // 訂購人住家電話
  hometel2: '', // 訂購人分機
  address: '', // 縣市
  address2: '', // 區域
  road: '', // 路名
  road2: '', // 門牌
  recipient: '', // 收件人
  recipientTel: '', // 收件人電話
  gender: 18, // 性別
  gender2: 18,
  sameOrderCustomer: false, // 訂購人與收件人相同
  sameOrderCompany: false, // 訂購公司與收件公司相同
  noCompilation: 1, // 統編勾選
  getCompany: '', // 收件公司
  event: [], // 活動
  remark: '', // 備註
  orderStatu: '請選擇', // 訂單狀態
  memberId: '', // 會員 ID
  locationId: '和平', // 店家代號
  delivery_date_hi: '',
  time: '',
  time1: '',
  time2: '',
  comment: '',
  shipping_road_abbr: '',
  find_us: ''
})
address.getstate()
watch(
  () => personForm.address,
  (val) => {
    address.getcity(val)
  }
)

// 訂購日期自動導入
watch(
  () => personForm.getDate,
  async (newVal, oldVal) => {
    const date = DateTime.fromFormat(newVal, 'yyyy-MM-dd').setZone(
      'Asia/Taipei'
    )
    personForm.week = date.weekdayLong
    getMoneyDate.value = personForm.getDate
    showDatePicker.value = false
  }
)
// copy function
const copy = async () => {
  showPersonDialog.value = true
  if (!members.memberdetail[0]) {
    personForm.tel = members.persontel
    personForm.name = members.personname
    personForm.compilation = members.persontin
    personForm.hometel = members.persontele
    personForm.road = members.personaddress
  } else {
    console.log(members.memberdetail[0].mobile)
    personForm.tel = await members.memberdetail[0].mobile
  }
  members.shouldAddPerson = false
  // members.memberdetail = [];
}
// ----------------------------------------------------------------
const justcopy = async () => {
  showPersonDialog.value = true
  const [hometel, hometel2] = members.persontele.split('#') // 使用 split () 方法將字符串按 "#" 分割
  personForm.hometel = hometel // 將 "#" 前面的内容赋给 personForm.hometel
  personForm.hometel2 = hometel2 // 將 "#" 后面的内容赋给 personForm.hometel2
  personForm.road = members.personroad
  personForm.road2 = members.personaddress1
  personForm.getCompany = members.personcompany
  personForm.address = members.personstateid
  personForm.address2 = members.personcityid
  personForm.compilation = members.persontin

  let stateObject = address.state.find(
    (item) => item.value === members.personstateid
  )

  if (stateObject === undefined) {
    stateObject = address.state.find(
      (item) => item.label === members.personstateid
    )
  }

  await address.getcity(stateObject.value)
  personForm.address = stateObject.label
  // 導入舊資料區域
  let cities = address.city.find((item) => item.value === members.personcityid)
  if (cities === undefined) {
    cities = address.city.find((item) => item.label === members.personcityid)
  }
  personForm.address2 = cities.label

  members.shouldCopyPerson = false
  members.memberdetail = []
}
// -------------------
if (members.shouldAddPerson === true) {
  setTimeout(() => {
    copy()
  }, 2000)
} else if (members.shouldCopyPerson === true) {
  justcopy()
}
// 統編勾選變成唯讀並且清空
// bangdong comment
const findUsOptions = ref([])
const getFindus = async () => {
  const { data } = await apiAuth.get(
    '/common/term?filter_taxonomy_code=member_how_to_find_us'
  )
  const findus = await data.data.filter(
    (res) => res.taxonomy_code === 'member_how_to_find_us'
  )
  console.log(findus)
  for (let i = 0; i < findus.length; i++) {
    findUsOptions.value.push(findus[i])
  }
}
getFindus()
const bangdong1Comment = ref('')
const bangdong2Comment = ref('')
const bangdong3Comment = ref('')
const bangdong4Comment = ref('')
const bangdongVegetarian1Comment = ref('')
const bangdongVegetarian2Comment = ref('')
const bangdongSalmonComment = ref('')
const lunchbox1Comment = ref('')
const lunchbox2Comment = ref('')
const lunchbox3Comment = ref('')
const lunchbox4Comment = ref('')
const lunchbox214Comment = ref('')
const bangdongSoloComment = ref('')
const bangdongCustom1Comment = ref('')
const lunchboxCustom1Comment = ref('')
//
const isCompilationReadonly = computed(() => personForm.noCompilation === '1')

// 結帳區
const tableRows = reactive([])
const expanded = ref([])
const paymentMethod = ref('')
const paid = ref(0)
const total = ref(0)
const freight = ref(0)
const discount = ref(0)
const unpaid = ref(0)
const getMoneyDate = ref(personForm.getDate)
const totalPrice = computed(() => {
  return (
    tableRows.reduce((accumulator, row) => accumulator + row.price, 0) -
    parseInt(discount.value) +
    parseInt(freight.value)
  )
})
const productPrice = computed(() => {
  return tableRows.reduce((accumulator, row) => accumulator + row.price, 0)
})

watch(totalPrice, (newTotalPrice) => {
  console.log('totalprice!')
  total.value = newTotalPrice
  unpaid.value = newTotalPrice
})

watch(paid.value, (newVal) => {
  unpaid.value = total.value - newVal
})
// 抓取當日日期
function updateDateTime () {
  const now = DateTime.now()
  const year = now.year
  const month = now.month.toString().padStart(2, '0')
  const date = now.day.toString().padStart(2, '0')
  personForm.formattedDate = `${year}-${month}-${date}`
}
setInterval(updateDateTime, 1000)
// 導入訂購日期的值
watch(
  () => personForm.formattedDate,
  (newValue) => {
    personForm.checkDate = DateTime.now().toFormat('yyyy-MM-dd')
  }
)

// 偵測 getDate 後抓取星期自動導入

function onReset () {
  // 將表單的資料都重置為初始值
  personForm.checkDate = ''
  personForm.formattedDate = '' // 日期抓取
  personForm.pick = '' // 取貨方式
  personForm.weekday = '' // 星期抓取
  personForm.getDate = '' // 送達日期
  personForm.week = '' // 星期
  personForm.companyClass = '' // 公司類別
  personForm.company = '' // 訂購公司
  personForm.department = '' // 訂購部門
  personForm.compilation = '' // 統編
  personForm.name = '' // 訂購人
  personForm.tel = '' // 訂購人電話
  // personForm.email = ''// 訂購人電子信箱
  personForm.prefix = '' // 訂購人區碼
  personForm.hometel = '' // 訂購人住家電話
  personForm.hometel2 = '' // 訂購人分機
  personForm.address = '' // 縣市
  personForm.address2 = '' // 區域
  personForm.road2 = ''
  personForm.road = '' // 路名
  personForm.recipient = '' // 收件人
  personForm.recipientTel = '' // 收件人電話
  personForm.gender = 18 // 性別
  personForm.sameOrderCustomer = false // 訂購人與收件人相同
  personForm.sameOrderCompany = false // 訂購公司與收件公司 personForm. 相同
  personForm.getCompany = '' // 收件公司
  personForm.event = [] // 活動
  personForm.remark = '' // 備註
  personForm.orderStatu = '請選擇' // 訂單狀態
  personForm.locationId = '和平' // 店家代號
  // 重設其它狀態
  // ...
  personForm.memberId = '' // 會員 ID
  personForm.time = '' // 時段
  personForm.noCompilation = 1
}
// 縣市
// 取得縣市選項
// 獲取初始的縣市列表
// 監聽獲取區域
watch(
  () => personForm.address,
  async (newValue, oldValue) => {
    // 清空区域和路名
    let stateId = address.state.find((item) => item.value === newValue)
    if (stateId === undefined) {
      stateId = address.state.find((item) => item.label === newValue)
    }
    await address.getcity(stateId)
    await road.getRoad(personForm.address, personForm.address2)
  }
)

// 監聽變化獲取路名
watch(
  () => [personForm.address2],
  async () => {
    await road.getRoadSelect(personForm.address, personForm.address2) // 请确保 road 对象和 getroadselect 方法正确定义和可用
    await road.getRoad(personForm.address, personForm.address2)
  }
)
async function fetchRoadData () {
  try {
    const containsChinese = /[\u4e00-\u9fa5]/.test(personForm.road)
    if (containsChinese) {
      await road.getRoadSelectFilter(
        personForm.address,
        personForm.address2,
        personForm.road
      )
    }
    if (personForm.road.length > 0 && personForm.road.length < 3) {
      menuState.value = true
      roadLoading.value = false
    }
    // roadRef.value.focus();
  } catch (error) {
    console.error('Error occurred:', error)
  }
}
const debouncedFetchRoadData = debounce(fetchRoadData, 2000) //
const roadLoading = ref(false)
watch(
  () => [personForm.road],
  () => {
    if (personForm.road === '') {
      console.log('this is a bullshit')
      menuState.value = false
    } else {
      roadLoading.value = true
      // if (!personForm.road.length > 0 && !personForm.road.length < 3) {
      //   roadLoading.value = false
      // // debouncedFetchRoadData();
      // }
    }
  }
)

// 同訂購人按鈕
watch(
  () => [personForm.company, personForm.sameOrderCustomer, personForm.name],
  (
    [newCompany, newSameOrderCustomer, newName],
    [prevCompany, prevSameOrderCustomer, prevName]
  ) => {
    if (newSameOrderCustomer === true) {
      personForm.company = personForm.getCompany
      personForm.recipient = personForm.name
      personForm.recipientTel = personForm.tel
    }
  },
  { deep: true }
)
// watch time
watch(
  () => [personForm.time1, personForm.time2],
  (newVal) => {
    personForm.time = personForm.time1 + '-' + personForm.time2
  }
)

// 原本的 watch，專門監控 sameOrderCompany

// 統編搜尋帶入公司名稱
// 在用戶更改統編的時候，將 isCompilationUserInput 設置為 true
watch(
  () => personForm.compilation,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      isCompilationUserInput.value = true
    }
  }
)
const invoiceIDfinding = ref(false)
watch(
  () => personForm.compilation,
  async (newVal) => {
    if (newVal && newVal.length === 8 && isCompilationUserInput.value) {
      invoiceIDfinding.value = true
      apiAuth.get(`localization/tax_id_num/${newVal}`).then((res) => {
        if (res.data.tax_id_num) {
          // Set the company name
          personForm.getCompany = res.data.name
          invoiceIDfinding.value = false
          // Check if the address should be overwritten
        } else {
          $q.notify({
            color: 'red-4',
            textColor: 'white',
            icon: 'cloud_off',
            position: 'center',
            message: '統編找不到公司'
          })
          invoiceIDfinding.value = false
        }
      })
    }
  }
)
// 電話號碼搜尋自動導入其他
const isCompilationUserInput = ref(true)
let timeoutId = null
// 搜尋後更改表單
watch(
  // 監聽 personForm.tel 的變化
  () => personForm.tel,
  (newVal, oldVal) => {
    // 如果 tel 為空，清空表單中的其他資料
    if (newVal === oldVal) {
      return
    } else if (newVal.length <= 9) {
      personForm.memberId = ''
    }
    if (newVal.length > 9) {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(async () => {
        try {
          // 延遲請求的時間（以毫秒為單位）
          const delay = 100

          // 延遲指定的時間
          await new Promise((resolve) => setTimeout(resolve, delay))
          // 發送 API 請求獲取資料
          const { data } = await apiAuth.get(
            `/member/member?filter_phone=${newVal}`
          )
          if (data.data.length > 0 && data.data.length < 2) {
            // 如果找到對應的資料，填入表單中
            personForm.name = data.data[0].name
            // personForm.email = data.data[0].email
            personForm.road = data.data[0].shipping_road
            personForm.road2 = data.data[0].shipping_address1
            personForm.prefix = data.data[0].telephone_prefix
            const telephone = data.data[0].telephone // 獲取電話號碼
            const [hometel, hometel2] = telephone.split('#') // 使用 split () 方法將字符串按 "#" 分割
            personForm.hometel = hometel // 將 "#" 前面的内容赋给 personForm.hometel
            personForm.hometel2 = hometel2 // 將 "#" 后面的内容赋给 personForm.hometel2
            personForm.hometel = personForm.hometel.replace(/-/g, '')
            personForm.memberId = data.data[0].id
            personForm.compilation = data.data[0].payment_tin
            personForm.getCompany = data.data[0].payment_company
            personForm.department = data.data[0].payment_department
            personForm.gender = data.data[0].salutation_id
            personForm.comment = data.data[0].comment
            isCompilationUserInput.value = false

            // 導入舊資料縣市
            const stateObject = await apiAuth
              .get('localization/division/state')
              .then((response) =>
                response.data.find(
                  (item) => item.id === data.data[0].shipping_state_id
                )
              )

            personForm.address = stateObject.id
            // 導入舊資料區域
            const cities = await apiAuth
              .get(
                `localization/division/city?equal_parent_id=${stateObject.id}`
              )
              .then((response) =>
                response.data.find(
                  (item) => item.city_id === data.data[0].shipping_city_id
                )
              )

            personForm.address2 = cities.city_id
            const addressParts = await address.parseAddress(
              data.data[0].shipping_address1
            )
            addressForm.value.lane = addressParts.lane
            addressForm.value.alley = addressParts.alley
            addressForm.value.no = addressParts.no
            addressForm.value.floor = addressParts.floor
            addressForm.value.at = addressParts.at
            addressForm.value.room = addressParts.room
          } else {
            personForm.tel = newVal
          }
        } catch (error) {
          // 處理錯誤
          console.error(error)
        }
      }, 100)
    }
  }
)
// 客戶備註
const dialogVisible2 = ref(false)
const option2s = ref([])
let totalPage2s
const getExtraComments2 = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get(
      '/sale/order/phrases/phrase_order_comment',
      {
        params: {
          page: currentPage2.value
        }
      }
    )
    const extraComments = response.data.data
    totalPage2s = response.data.last_page
    option2s.value = []
    for (let i = 0; i < extraComments.length; i++) {
      option2s.value.push(extraComments[i].name)
    }
  } catch (error) {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'cloud_off',
      message: error.message
    })
  }
}

getExtraComments2()

// const ITEMS_PER_PAGE2 = 10
const currentPage2 = ref(1)

watch(
  () => personForm.remark,
  (newVal) => {
    if (newVal.includes(',,')) {
      showDialog2()
    }
  }
)

function showDialog2 () {
  currentPage2.value = 1
  dialogVisible2.value = true
}
function closeDialog2 () {
  dialogVisible2.value = false
}

function selectOption2 (option2) {
  if (personForm.remark === ',,') {
    personForm.remark = ''
    personForm.remark = option2
  } else {
    personForm.remark += ' ' + option2
  }

  personForm.remark = personForm.remark.replace(',,', '')
  closeDialog2()
}
watch(currentPage2, async (newPage, oldPage) => {
  if (newPage !== oldPage) {
    currentPage2.value = newPage // 使用 .value 來更新 ref 的值
    await getExtraComments2() // 重新獲取數據
  }
})
// 餐點備註
const mealRemark = ref('')
const mealDialog = ref(false)
const searchTermMeal = ref('')
const optionsMeal = ref([])
const currentPagemeal = ref(1)
let totalPagesMeal
const getExtraComments = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get(
      '/sale/order/phrases/phrase_order_extra_comment',
      {
        params: {
          page: currentPagemeal.value
        }
      }
    )
    const extraComments = response.data.data
    totalPagesMeal = response.data.last_page
    optionsMeal.value = []
    for (let i = 0; i < extraComments.length; i++) {
      optionsMeal.value.push(extraComments[i].name)
    }
  } catch (error) {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'cloud_off',
      message: error.message
    })
  }
}
getExtraComments()

function showDialog () {
  searchTermMeal.value = ''
  currentPagemeal.value = 1
  mealDialog.value = true
}
watch(mealRemark, (newVal, oldVal) => {
  if (newVal.includes(',,')) {
    showDialog()
  } else {
    closeDialog()
  }
})

function closeDialog () {
  mealDialog.value = false
}

function selectOption (option) {
  mealRemark.value = mealRemark.value.replace(',,', '')
  mealRemark.value += ' ' + option
  mealDialog.value = false
}
// eslint-disable-next-line
const ITEMS_PER_PAGEmeal = 10;
watch(currentPagemeal, async (newPage, oldPage) => {
  if (newPage !== oldPage) {
    // 使用 .value 來更新 ref 的值
    currentPagemeal.value = newPage // 使用 .value 來更新 ref 的值
    await getExtraComments() // 重新獲取數據
  }
})
const generateAddress = async () => {
  console.log(addressForm.value)
  personForm.road2 =
    `${addressForm.value.lane !== '' ? addressForm.value.lane + '巷' : ''}` +
    `${addressForm.value.alley !== '' ? addressForm.value.alley + '弄' : ''}` +
    `${addressForm.value.no !== '' ? addressForm.value.no + '號' : ''}` +
    `${addressForm.value.floor !== '' ? addressForm.value.floor + '樓' : ''}` +
    `${addressForm.value.at !== '' ? '之' + addressForm.value.at : ''}` +
    `${addressForm.value.room !== '' ? addressForm.value.room + '室' : ''}`
}
// --------------------------------------------------
const memerSave = async () => {
  if (!personForm.pick) {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'error',
      message: '請選擇送達方式'
    })
    return
  }
  if (!personForm.getDate) {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'error',
      message: '請選擇送達日期'
    })
    return
  }
  if (!personForm.tel && !personForm.hometel) {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'error',
      message: '市話或手機請擇一'
    })
    return
  }
  try {
    // 如果沒有輸入地址，轉空白
    // 對於 state
    let state = address.state.find((item) => item.label === personForm.address)
    if (state === undefined) {
      state = address.state.find((item) => item.value === personForm.address)
    }

    if (state !== undefined) {
      personForm.address = state.value
      await address.getcity(state.value)
    } else {
      personForm.address = ''
    }

    // 對於 city
    let city = address.city.find((item) => item.label === personForm.address2)
    if (city === undefined) {
      city = address.city.find((item) => item.value === personForm.address2)
    }
    personForm.address2 =
      city !== undefined && typeof city.value !== 'undefined' ? city.value : ''

    if (personForm.prefix == null) {
      personForm.prefix = ''
    }
    if (personForm.hometel2 == null) {
      personForm.hometel2 = ''
    }
    if (personForm.hometel == null) {
      personForm.hometel = ''
    }
    if (personForm.time1 !== '' && personForm.time2 !== '') {
      personForm.time = personForm.time1 + '-' + personForm.time2
      console.log(personForm.time)
    }
    const memberId = personForm.memberId || ''
    await generateAddress()
    // 如果已經存在客戶資料，就更新它
    await apiAuth
      .post('/member/member/save', {
        member_id: memberId, // id
        telephone_prefix: personForm.prefix,
        telephone: personForm.hometel + '#' + personForm.hometel2, // 家電
        name: personForm.name, // 訂購人
        mobile: personForm.tel, // 訂購人電話
        // email: personForm.email, // 訂購人 email
        shipping_personal_name: personForm.recipient, // 收件人
        shipping_phone: personForm.recipientTel, // 收件人電話
        payment_tin: personForm.compilation, // 統編
        payment_company: personForm.getCompany, // 公司名稱
        payment_department: personForm.department, // 部門
        shipping_company: personForm.getCompany, // 取貨公司
        shipping_state_id: personForm.address, // 縣市 id
        shipping_city_id: personForm.address2, // 區域 id
        shipping_road: personForm.road, // 路名
        shipping_address1: personForm.road2, // 地址
        salutation_id: parseInt(personForm.gender), // 稱謂
        find_us: personForm.find_us,
        comment: personForm.comment
      })
      .then((response) => {
        personForm.memberId = response.data.member_id

        if (memberId !== '') {
          $q.notify({
            color: 'accent',
            textColor: 'white',
            message: '是老客戶，已更新資料'
          })
        } else {
          $q.notify({
            color: 'accent',
            textColor: 'white',
            message: '是新客戶，已加入資料'
          })
        }
      })

    showPersonDialog.value = false
    // Display the original address name on the interface
  } catch (error) {
    console.error(error)
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'error',
      message: 'An error occurred: ' + error.message
    })
  }
}

/// 任意搭配 update//
const checkVegetable = (row) => {
  for (let i = 0; i < row.inputs.length; i++) {
    if (row.inputs[i].name.includes('素')) {
      row.name += '(含素)'
      break
    }
  }
}
// 便當

const bangdong1TotalQuantity = ref(0)
const bangdong1Arbitrarily = ref(0)
const bangdong2TotalQuantity = ref(0)
const bangdong2Arbitrarily = ref(0)
const bangdong3TotalQuantity = ref(0)
const bangdong3Arbitrarily = ref(0)
const bangdong4TotalQuantity = ref(0)
const bangdong4Arbitrarily = ref(0)
const bangdongSalmonTotalQuantity = ref(0)
const bangdongSalmonArbitrarily = ref(0)
const bangdongVegetarian1Arbitrarily = ref(0)
const bangdongVegetarian1TotalQuantity = ref(0)
const bangdongVegetarian2Arbitrarily = ref(0)
const bangdongVegetarian2TotalQuantity = ref(0)
// ----------------------------------------------------------------
const bangdong1EditArbitrarily = ref(0)
const bangdong1EditTotalQuantity = ref(0)
const bangdong2EditArbitrarily = ref(0)
const bangdong2EditTotalQuantity = ref(0)
const bangdong3EditArbitrarily = ref(0)
const bangdong3EditTotalQuantity = ref(0)
const bangdong4EditArbitrarily = ref(0)
const bangdong4EditTotalQuantity = ref(0)
const bangdongSalmonEditArbitrarily = ref(0)
const bangdongSalmonEditTotalQuantity = ref(0)
const bangdongVegetarian1EditArbitrarily = ref(0)
const bangdongVegetarian1EditTotalQuantity = ref(0)
const bangdongVegetarian2EditArbitrarily = ref(0)
const bangdongVegetarian2EditTotalQuantity = ref(0)
// 盒餐
const lunchBox1Arbitrarily = ref(0)
const lunchBox1EditArbitrarily = ref(0)
const lunchBox1TotalQuantity = ref(0)
const lunchBox2Arbitrarily = ref(0)
const lunchBox2EditArbitrarily = ref(0)
const lunchBox2TotalQuantity = ref(0)
const lunchBox3Arbitrarily = ref(0)
const lunchBox3EditArbitrarily = ref(0)
const lunchBox3TotalQuantity = ref(0)
const lunchBox4Arbitrarily = ref(0)
const lunchBox4EditArbitrarily = ref(0)
const lunchBox4TotalQuantity = ref(0)
const lunchBox214Arbitrarily = ref(0)
const lunchBox214EditArbitrarily = ref(0)
const lunchBox214TotalQuantity = ref(0)

const lunchBox1EditTotalQuantity = ref(0)
const lunchBox2EditTotalQuantity = ref(0)
const lunchBox3EditTotalQuantity = ref(0)

const lunchBox4EditTotalQuantity = ref(0)
const lunchBox214EditTotalQuantity = ref(0)
// 客製便當
const bangdongCustom1EditTotalQuantity = ref(0)
const bangdongCustom1TotalQuantity = ref(0)
const bangdongCustom1Arbitrarily = ref(0)
const bangdongCustom1EditArbitrarily = ref(0)
// 客製盒餐
const lunchBoxCustom1Arbitrarily = ref(0)
const lunchBoxCustom1EditArbitrarily = ref(0)
// 單點
// const bangdongSoloArbitrarily = ref(0)
// const bangdongSoloEditArbitrarily = ref(0)
/// /////////////// 便當盒餐 /////////////////////
const loading = ref(false)
// 便當盒餐開關
const showbangdong = ref(false)

// 是否已經抓取過招牌便當資料的狀態變數
const isBangdong1Loaded = ref(false)
const isBangdong2Loaded = ref(false)
const isBangdong3Loaded = ref(false)
const isBangdong4Loaded = ref(false)
const isBangdongVegetarian1Loaded = ref(false)
const isBangdongVegetarian2Loaded = ref(false)
const isBangdongSalmonLoaded = ref(false)

const loadbangdongall = () => {
  if (!isBangdong1Loaded.value) {
    loadBangdong1()
    loadBangdong1Edit()
    isBangdong1Loaded.value = true
  }
  if (!isBangdong2Loaded.value) {
    loadBangdong2()
    loadBangdong2Edit()
    isBangdong2Loaded.value = true
  }
  if (!isBangdong3Loaded.value) {
    loadBangdong3()
    loadBangdong3Edit()
    isBangdong3Loaded.value = true
  }
  if (!isBangdong4Loaded.value) {
    loadBangdong4()
    loadBangdong4Edit()
    isBangdong4Loaded.value = true
  }
  if (!isBangdongVegetarian1Loaded.value) {
    loadBangdongVegetarian1()
    loadBangdongVegetarian1Edit()
    isBangdongVegetarian1Loaded.value = true
  }
  if (!isBangdongVegetarian2Loaded.value) {
    loadBangdongVegetarian2()
    loadBangdongVegetarian2Edit()
    isBangdongVegetarian2Loaded.value = true
  }
  if (!isBangdongSalmonLoaded.value) {
    loadBangdongSalmon()
    loadBangdongSalmonEdit()
    isBangdongSalmonLoaded.value = true
  }
}

const openbangdong = () => {
  showbangdong.value = true
  loadbangdongall()
  // 其他邏輯...
}

// 招牌便當
const bangdong1Mains = reactive([])
const bangdong1MainName = ref('')
const bangdong1Drinks = reactive([])
const bangdong1DrinkName = ref('')
const bangdong1SideDishes = reactive([])
const bangdong1SideDishName = ref('')
const bangdong1Name = ref('')
const bangdong1Price = ref(0)
const bangdong1ProductId = ref('')
const bangdong1MainMealId = ref('')
const bangdong1DrinkId = ref('')
const bangdong1SideDishId = ref('')
// const editDialog = ref(false)
// 抓取招牌便當主餐形成 input
const loadBangdong1 = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1001')
    const productOptions = response.data.product_options
    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values

    for (const mainMealValue of mainMealValues) {
      bangdong1Mains.push({
        id: mainMealValue.id,
        name: mainMealValue.name,
        shortname: mainMealValue.short_name,
        quantity: 0
      })
    }
    // 飲料
    const Drink = productOptions.drink
    const DrinkValues = Drink.product_option_values

    for (const DrinkValue of DrinkValues) {
      bangdong1Drinks.push({
        id: DrinkValue.id,
        name: DrinkValue.name,
        quantity: 0,
        price: DrinkValue.price
      })
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values

    for (const sideDishValue of sideDishValues) {
      bangdong1SideDishes.push({
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      })
    }
    // 監聽主餐的數量變化

    bangdong1Name.value = response.data.name
    bangdong1MainName.value = mainMeal.name
    bangdong1DrinkName.value = Drink.name
    bangdong1SideDishName.value = sideDish.name
    bangdong1Price.value = parseInt(response.data.price)
    bangdong1ProductId.value = response.data.id
    bangdong1MainMealId.value = mainMeal.id
    bangdong1DrinkId.value = Drink.id
    bangdong1SideDishId.value = sideDish.id
    bangdong1Mains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            // 配菜的數量跟著主餐的數量變化
            bangdong1SideDishes.forEach((sideDish) => {
              const diff = Number(newVal) - Number(oldVal)
              console.log(diff)
              if (sideDish.is_default === 1) {
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
        }
      )
    })
    bangdong1Drinks.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdong1SideDishes.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
  } catch (error) {
    console.error(error)
  }
}

// 計算任配

watch(bangdong1Mains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity || 0)
  }, 0)
  console.log(newMains)
  bangdong1Arbitrarily.value = Math.max(
    0,
    parseInt(bangdong1TotalQuantity.value || 0) - mainQuantityTotal
  )
})

// 計算總價格
const bangdong1TotalQuantityPrice = computed(() => {
  const totalPrice = bangdong1TotalQuantity.value * bangdong1Price.value
  return totalPrice
})
// 選項總計
const bangdong1optionPrice = computed(() => {
  let totalPrice = 0
  bangdong1Drinks.forEach((drink) => {
    totalPrice += drink.quantity * drink.price
  })
  bangdong1SideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
// 全部總計
const bangdong1finalTotal = computed(() => {
  const totalPrice =
    bangdong1optionPrice.value + bangdong1TotalQuantityPrice.value
  return totalPrice
})
// 將資料推進 tableRows
const submitBangdong1 = () => {
  if (bangdong1TotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  // 檢查總數量是否匹配
  const calculatedTotalQuantity = bangdong1Mains.reduce(
    (acc, main) => acc + (main.quantity || 0),
    0
  )
  console.log(calculatedTotalQuantity, bangdong1TotalQuantity.value)
  if (calculatedTotalQuantity !== parseInt(bangdong1TotalQuantity.value, 10)) {
    alert('主餐總數量與輸入的總數量不搭！')
    return
  }
  const nextId =
    tableRows.length > 0 ? tableRows[tableRows.length - 1].id + 1 : 1

  const row = {
    bentoType: 1,
    id: nextId,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    sideDishDefault: '',
    quantity: '',
    price: bangdong1finalTotal.value,
    optionPrice: bangdong1optionPrice.value,
    totalPrice: bangdong1TotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: bangdong1Comment.value
  }
  row.quantity = bangdong1TotalQuantity.value

  const totalQuantity = bangdong1TotalQuantity.value
  for (const bangdong1Main of bangdong1Mains) {
    if (bangdong1Main.quantity > 0) {
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: bangdong1MainMealId.value,
        productTypeName: bangdong1MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      row.Main +=
        bangdong1Main.name +
        ' x ' +
        parseInt(bangdong1Main.quantity).toString() +
        '<br>'

      const input = {
        id: bangdong1Main.id,
        name: bangdong1Main.name,
        value: parseInt(bangdong1Main.quantity),
        type: 1
      }

      row.inputs.push(input)
      bangdong1Main.quantity = 0
    }
  }
  for (const bangdong1Drink of bangdong1Drinks) {
    if (bangdong1Drink.quantity > 0) {
      row.drinks +=
        bangdong1Drink.name +
        '  x  ' +
        parseInt(bangdong1Drink.quantity).toString() +
        '<br>'
      // 保留飲料名稱、飲料 ID
      const productInput = {
        productTypeName: bangdong1DrinkName.value,
        productTypeId: bangdong1DrinkId.value,
        productType: 'options_with_qty',
        type: 2
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdong1Drink.id,
        name: bangdong1Drink.name,
        value: parseInt(bangdong1Drink.quantity),
        type: 2
      }
      row.inputs.push(input)
      bangdong1Drink.quantity = 0
    }
  }

  for (const bangdong1SideDish of bangdong1SideDishes) {
    if (bangdong1SideDish.quantity > 0) {
      if (row.sideDishes !== '') {
        row.sideDishes += ','
      }
      row.sideDishes +=
        bangdong1SideDish.name +
        'x' +
        parseInt(bangdong1SideDish.quantity).toString() +
        '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: bangdong1SideDishName.value,
        productTypeId: bangdong1SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      row.sideDishDefault += bangdong1SideDish.is_default + ' '
      const input = {
        id: bangdong1SideDish.id,
        name: bangdong1SideDish.name,
        value: parseInt(bangdong1SideDish.quantity),
        is_default: bangdong1SideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
      bangdong1SideDish.quantity = 0
    }
  }
  // 保留 招牌便當、1001、數量
  const productInput = {
    id: bangdong1ProductId.value,
    name: bangdong1Name.value,
    value: parseInt(totalQuantity),
    price: bangdong1Price.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: bangdong1Comment.value
  }
  console.log(productInput)
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (bangdong1Arbitrarily.value > 0) {
    row.Main +=
      '任意搭配' + 'x' + parseInt(bangdong1Arbitrarily.value).toString()
    const input = {
      id: 'bangdong1Arbitrarily',
      value: bangdong1Arbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = bangdong1Name.value + totalQuantity + '份'
  checkVegetable(row)
  // 將這個 row 推進 tableRows 中
  tableRows.push(row)
  console.log(row)
  showbangdong1.value = false
  bangdong1Arbitrarily.value = 0
}
const Resetbangdong1 = () => {
  bangdong1Mains.forEach((bangdong1Main) => {
    bangdong1Main.quantity = 0
  })
  bangdong1Drinks.forEach((bangdong1Drink) => {
    bangdong1Drink.quantity = 0
  })
  bangdong1SideDishes.forEach((bangdong1SideDish) => {
    bangdong1SideDish.quantity = 0
  })
  bangdong1TotalQuantity.value = 0
  bangdong1Arbitrarily.value = 0
  showbangdong1.value = false
}
// 修改欄位導入
const bangdong1EditMains = reactive([])
const bangdong1EditDrinks = reactive([])
const bangdong1EditSideDishes = reactive([])
const bangdong1EditBentoMains = reactive([])
const loadBangdong1Edit = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100
    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1001')
    const productOptions = response.data.product_options
    // 主餐
    const mainMeal = productOptions.main_meal
    const values = mainMeal.product_option_values

    for (const value of values) {
      const bangdong1EditMain = {
        id: value.id,
        name: value.name,
        shortname: value.short_name,
        quantity: 0,
        hidenquantity: 0
      }
      bangdong1EditMains.push(bangdong1EditMain)
    }
    // 飲料
    const Drink = productOptions.drink
    const DrinkValues = Drink.product_option_values
    for (const DrinkValue of DrinkValues) {
      const bangdong1EditDrink = {
        id: DrinkValue.id,
        name: DrinkValue.name,
        quantity: 0,
        hidenquantity: 0,
        price: DrinkValue.price
      }
      bangdong1EditDrinks.push(bangdong1EditDrink)
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values
    for (const sideDishValue of sideDishValues) {
      const bangdong1EditSideDish = {
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        hidenquantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      }
      bangdong1EditSideDishes.push(bangdong1EditSideDish)
    }
    // 修改修改欄位配菜跟著變
    bangdong1MainName.value = mainMeal.name
    bangdong1DrinkName.value = Drink.name
    bangdong1SideDishName.value = sideDish.name
    bangdong1Price.value = parseInt(response.data.price)
    bangdong1EditMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            // 使用 setTimeout 來延遲配菜數量的更新
            // 配菜的數量跟著主餐的數量變化
            bangdong1EditSideDishes.forEach((sideDish) => {
              const diff = Number(newVal) - Number(oldVal)
              console.log(diff)
              if (sideDish.is_default === 1) {
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
        }
      )
    })

    bangdong1EditDrinks.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdong1EditSideDishes.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
  } catch (error) {
    console.error(error)
  }
}

// 雞胸便當
const bangdong2Mains = reactive([])
const bangdong2MainName = ref('')
const bangdong2Drinks = reactive([])
const bangdong2DrinkName = ref('')
const bangdong2SideDishes = reactive([])
const bangdong2SideDishName = ref('')
const bangdong2BentoMains = reactive([])
const bangdong2BentoMainName = ref('')
const bangdong2Name = ref('')
const bangdong2ProductId = ref('')
const bangdong2MainMealId = ref('')
const bangdong2DrinkId = ref('')
const bangdong2SideDishId = ref('')
const bangdong2BentoMainId = ref('')
const bangdong2Price = ref(0)
// 抓取雞胸便當主餐形成 input
const loadBangdong2 = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1002')
    const productOptions = response.data.product_options
    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values

    for (const mainMealValue of mainMealValues) {
      bangdong2Mains.push({
        id: mainMealValue.id,
        name: mainMealValue.name,
        shortname: mainMealValue.short_name,
        quantity: 0
      })
    }
    // 飲料
    const Drink = productOptions.drink
    const DrinkValues = Drink.product_option_values

    for (const DrinkValue of DrinkValues) {
      bangdong2Drinks.push({
        id: DrinkValue.id,
        name: DrinkValue.name,
        quantity: 0,
        price: DrinkValue.price
      })
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values

    for (const sideDishValue of sideDishValues) {
      bangdong2SideDishes.push({
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      })
    }
    // 副主餐
    const bentoMain = productOptions.bento_main
    const bentoMainValues = bentoMain.product_option_values
    for (const bentoMainValue of bentoMainValues) {
      // bangdong2BentoMainId.value = bentoMainValue.id;
      console.log(bentoMainValue.id, bangdong2BentoMainId.value)
      bangdong2BentoMains.push({
        id: bentoMainValue.id,
        name: bentoMainValue.name,
        quantity: 0,
        is_default: bentoMainValue.is_default
      })
    }
    // 監聽主餐的數量變化

    bangdong2Name.value = response.data.name
    bangdong2MainName.value = mainMeal.name
    bangdong2DrinkName.value = Drink.name
    bangdong2SideDishName.value = sideDish.name
    bangdong2BentoMainName.value = bentoMain.name
    bangdong2Price.value = parseInt(response.data.price)
    bangdong2ProductId.value = response.data.id
    bangdong2MainMealId.value = mainMeal.id
    bangdong2DrinkId.value = Drink.id
    bangdong2SideDishId.value = sideDish.id
    bangdong2BentoMainId.value = bentoMain.id
    bangdong2Mains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            // 配菜的數量跟著主餐的數量變化
            bangdong2SideDishes.forEach((sideDish) => {
              const diff = Number(newVal) - Number(oldVal)
              if (sideDish.is_default) {
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
          // 副主餐的數量跟著主餐的數量變化
          bangdong2BentoMains.forEach((bentoMain) => {
            const diff = Number(newVal) - Number(oldVal)
            if (bentoMain.is_default) {
              const newQuantity = Number(bentoMain.quantity) + diff
              // 確保副主餐數量不會變成負數
              bentoMain.quantity = newQuantity >= 0 ? newQuantity : 0
            }
          })
        }
      )
    })
    bangdong2Drinks.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdong2SideDishes.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdong2BentoMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
  } catch (error) {
    console.error(error)
  }
}

// 計算總數量
watch(bangdong2Mains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  bangdong2Arbitrarily.value = Math.max(
    0,
    parseInt(bangdong2TotalQuantity.value) - mainQuantityTotal
  )
})

// 計算總價格
const bangdong2TotalQuantityPrice = computed(() => {
  const totalPrice = bangdong2TotalQuantity.value * bangdong2Price.value
  return totalPrice
})
const bangdong2optionPrice = computed(() => {
  let totalPrice = 0
  bangdong2Drinks.forEach((drink) => {
    totalPrice += drink.quantity * drink.price
  })
  bangdong2SideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
const bangdong2finalTotal = computed(() => {
  const totalPrice =
    bangdong2optionPrice.value + bangdong2TotalQuantityPrice.value
  return totalPrice
})
// 將資料推進 tableRows
const submitBangdong2 = () => {
  if (bangdong2TotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  // 檢查總數量是否匹配
  const calculatedTotalQuantity = bangdong2Mains.reduce(
    (acc, main) => acc + (main.quantity || 0),
    0
  )
  console.log(calculatedTotalQuantity, bangdong2TotalQuantity.value)
  if (calculatedTotalQuantity !== parseInt(bangdong2TotalQuantity.value, 10)) {
    alert('主餐總數量與輸入的總數量不搭！')
    return
  }
  const nextId =
    tableRows.length > 0 ? tableRows[tableRows.length - 1].id + 1 : 1

  const row = {
    bentoType: 2,
    id: nextId,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    quantity: '',
    sideDishDefault: '',
    price: bangdong2finalTotal.value,
    optionPrice: bangdong2optionPrice.value,
    totalPrice: bangdong2TotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: bangdong2Comment.value
  }
  row.quantity = bangdong2TotalQuantity.value
  const totalQuantity = bangdong2TotalQuantity.value
  // 主餐
  for (const bangdong2Main of bangdong2Mains) {
    if (bangdong2Main.quantity > 0) {
      row.Main +=
        bangdong2Main.name +
        '  x  ' +
        parseInt(bangdong2Main.quantity).toString() +
        '<br>'
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: bangdong2MainMealId.value,
        productTypeName: bangdong2MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)

      const input = {
        id: bangdong2Main.id,
        name: bangdong2Main.name,
        value: parseInt(bangdong2Main.quantity),
        type: 1
      }
      row.inputs.push(input)
      bangdong2Main.quantity = 0
    }
  }
  // 飲料
  for (const bangdong2Drink of bangdong2Drinks) {
    if (bangdong2Drink.quantity > 0) {
      row.drinks +=
        bangdong2Drink.name +
        'x' +
        parseInt(bangdong2Drink.quantity).toString() +
        '<br>'
      // 保留飲料名稱、飲料 ID
      const productInput = {
        productTypeName: bangdong2DrinkName.value,
        productTypeId: bangdong2DrinkId.value,
        productType: 'options_with_qty',
        type: 2
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdong2Drink.id,
        name: bangdong2Drink.name,
        value: parseInt(bangdong2Drink.quantity),
        type: 2
      }
      row.inputs.push(input)
      bangdong2Drink.quantity = 0
    }
  }
  // 配菜
  for (const bangdong2SideDish of bangdong2SideDishes) {
    if (bangdong2SideDish.quantity > 0) {
      row.sideDishes +=
        bangdong2SideDish.name +
        'x' +
        parseInt(bangdong2SideDish.quantity).toString() +
        '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: bangdong2SideDishName.value,
        productTypeId: bangdong2SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      row.sideDishDefault += bangdong2SideDish.is_default + ' '
      const input = {
        id: bangdong2SideDish.id,
        name: bangdong2SideDish.name,
        value: parseInt(bangdong2SideDish.quantity),
        is_default: bangdong2SideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
      bangdong2SideDish.quantity = 0
    }
  }
  // 副主餐
  for (const bangdong2BentoMain of bangdong2BentoMains) {
    if (bangdong2BentoMain.quantity > 0) {
      row.bentoMains +=
        bangdong2BentoMain.name +
        ' x ' +
        parseInt(bangdong2BentoMain.quantity).toString() +
        '<br>'
      // 保留副主餐名稱、副主餐 ID
      const productInput = {
        productTypeName: bangdong2BentoMainName.value,
        productTypeId: bangdong2BentoMainId.value,
        productType: 'options_with_qty',
        type: 4
      }
      row.productInputs.push(productInput)

      const input = {
        id: bangdong2BentoMain.id,
        name: bangdong2BentoMain.name,
        value: parseInt(bangdong2BentoMain.quantity),
        type: 4
      }
      row.inputs.push(input)
      bangdong2BentoMain.quantity = 0
    }
  }
  // 保留 雞胸便當、1002、數量
  const productInput = {
    id: bangdong2ProductId.value,
    name: bangdong2Name.value,
    value: parseInt(totalQuantity),
    price: bangdong2Price.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: bangdong2Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (bangdong2Arbitrarily.value > 0) {
    if (row.Main !== '') {
      row.Main += ' , '
    }
    row.Main +=
      '任意搭配' + 'x' + parseInt(bangdong2Arbitrarily.value).toString()
    const input = {
      id: 'bangdong2Arbitrarily',
      value: bangdong2Arbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = bangdong2Name.value + totalQuantity + '份'
  checkVegetable(row)
  // 將這個 row 推進 tableRows 中
  tableRows.push(row)
  console.log(row)
  meal.tableRows2.push(row)
  showbangdong2.value = false
  bangdong2Arbitrarily.value = 0
}
// -----------------------------------------
const Resetbangdong2 = () => {
  bangdong2Mains.forEach((bangdong2Main) => {
    bangdong2Main.quantity = 0
  })
  bangdong2Drinks.forEach((bangdong2Drink) => {
    bangdong2Drink.quantity = 0
  })
  bangdong2SideDishes.forEach((bangdong2SideDish) => {
    bangdong2SideDish.quantity = 0
  })
  bangdong2BentoMains.forEach((bangdong2BentoMain) => {
    bangdong2BentoMain.quantity = 0
  })
  bangdong2TotalQuantity.value = 0
  bangdong2Arbitrarily.value = 0
  showbangdong2.value = false
}
// 修改欄位
const bangdong2EditMains = reactive([])
const bangdong2EditDrinks = reactive([])
const bangdong2EditSideDishes = reactive([])
const bangdong2EditBentoMains = reactive([])
const loadBangdong2Edit = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1002')
    const productOptions = response.data.product_options

    // 主餐
    const mainMeal = productOptions.main_meal
    const values = mainMeal.product_option_values

    for (const value of values) {
      const bangdong2EditMain = {
        id: value.id,
        name: value.name,
        quantity: 0,
        hidenquantity: 0,
        shortname: value.short_name
      }
      bangdong2EditMains.push(bangdong2EditMain)
    }
    // 飲料
    const Drink = productOptions.drink
    const DrinkValues = Drink.product_option_values
    for (const DrinkValue of DrinkValues) {
      const bangdong2EditDrink = {
        id: DrinkValue.id,
        name: DrinkValue.name,
        quantity: 0,
        hidenquantity: 0,
        price: DrinkValue.price
      }
      bangdong2EditDrinks.push(bangdong2EditDrink)
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values
    for (const sideDishValue of sideDishValues) {
      const bangdong2EditSideDish = {
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        hidenquantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      }
      bangdong2EditSideDishes.push(bangdong2EditSideDish)
    }
    // 副主餐
    const bentoMain = productOptions.bento_main
    const bentoMainValues = bentoMain.product_option_values
    for (const bentoMainValue of bentoMainValues) {
      const bangdong2EditBentoMain = {
        id: bentoMainValue.id,
        name: bentoMainValue.name,
        quantity: 0,
        is_default: bentoMainValue.is_default,
        hidenquantity: 0
      }
      bangdong2EditBentoMains.push(bangdong2EditBentoMain)
    }
    bangdong2MainName.value = mainMeal.name
    bangdong2DrinkName.value = Drink.name
    bangdong2SideDishName.value = sideDish.name
    bangdong2BentoMainName.value = bentoMain.name
    bangdong2Price.value = parseInt(response.data.price)
    bangdong2EditMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            // 配菜的數量跟著主餐的數量變化
            bangdong2EditSideDishes.forEach((sideDish) => {
              const diff = Number(newVal) - Number(oldVal)
              if (sideDish.is_default) {
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
          // 副主餐的數量跟著主餐的數量變化
          bangdong2EditBentoMains.forEach((bentoMain) => {
            const diff = Number(newVal) - Number(oldVal)
            if (bentoMain.is_default) {
              const newQuantity = Number(bentoMain.quantity) + diff
              // 確保副主餐數量不會變成負數
              bentoMain.quantity = newQuantity >= 0 ? newQuantity : 0
            }
          })
        }
      )
    })
    bangdong2EditDrinks.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdong2EditSideDishes.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdong2EditBentoMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
  } catch (error) {
    console.error(error)
  }
}

// 雞腿便當
const bangdong3Mains = reactive([])
const bangdong3MainName = ref('')
const bangdong3Drinks = reactive([])
const bangdong3DrinkName = ref('')
const bangdong3SideDishes = reactive([])
const bangdong3SideDishName = ref('')
const bangdong3BentoMains = reactive([])
const bangdong3BentoMainName = ref('')
const bangdong3Name = ref('')
const bangdong3Price = ref('')
const bangdong3ProductId = ref('')
const bangdong3MainMealId = ref('')
const bangdong3DrinkId = ref('')
const bangdong3SideDishId = ref('')
const bangdong3BentoMainId = ref('')
// 抓取雞腿便當主餐形成 input
const loadBangdong3 = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1003')
    const productOptions = response.data.product_options
    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values

    for (const mainMealValue of mainMealValues) {
      bangdong3Mains.push({
        id: mainMealValue.id,
        name: mainMealValue.name,
        shortname: mainMealValue.short_name,
        quantity: 0
      })
    }
    // 飲料
    const Drink = productOptions.drink
    const DrinkValues = Drink.product_option_values

    for (const DrinkValue of DrinkValues) {
      bangdong3Drinks.push({
        id: DrinkValue.id,
        name: DrinkValue.name,
        quantity: 0,
        price: DrinkValue.price
      })
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values

    for (const sideDishValue of sideDishValues) {
      bangdong3SideDishes.push({
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      })
    }
    // 副主餐
    const bentoMain = productOptions.bento_main
    const bentoMainValues = bentoMain.product_option_values
    for (const bentoMainValue of bentoMainValues) {
      bangdong3BentoMains.push({
        id: bentoMainValue.id,
        name: bentoMainValue.name,
        quantity: 0,
        is_default: bentoMainValue.is_default
      })
    }
    // 監聽主餐的數量變化
    bangdong3Mains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            // 配菜的數量跟著主餐的數量變化
            bangdong3SideDishes.forEach((sideDish) => {
              const diff = Number(newVal) - Number(oldVal)
              if (sideDish.is_default) {
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
          // 副主餐的數量跟著主餐的數量變化
          bangdong3BentoMains.forEach((bentoMain) => {
            const diff = Number(newVal) - Number(oldVal)
            if (bentoMain.is_default) {
              const newQuantity = Number(bentoMain.quantity) + diff
              // 確保副主餐數量不會變成負數
              bentoMain.quantity = newQuantity >= 0 ? newQuantity : 0
            }
          })
        }
      )
    })
    bangdong3Drinks.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdong3SideDishes.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdong3BentoMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdong3Name.value = response.data.name
    bangdong3MainName.value = mainMeal.name
    bangdong3DrinkName.value = Drink.name
    bangdong3SideDishName.value = sideDish.name
    bangdong3BentoMainName.value = bentoMain.name
    bangdong3Price.value = parseInt(response.data.price)
    bangdong3ProductId.value = response.data.id
    bangdong3MainMealId.value = mainMeal.id
    bangdong3DrinkId.value = Drink.id
    bangdong3SideDishId.value = sideDish.id
    bangdong3BentoMainId.value = bentoMain.id
  } catch (error) {
    console.error(error)
  }
}

// 計算總數量
watch(bangdong3Mains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  bangdong3Arbitrarily.value = Math.max(
    0,
    parseInt(bangdong3TotalQuantity.value) - mainQuantityTotal
  )
})

// 計算總價格
const bangdong3TotalQuantityPrice = computed(() => {
  const totalPrice = bangdong3TotalQuantity.value * bangdong3Price.value
  return totalPrice
})
const bangdong3optionPrice = computed(() => {
  let totalPrice = 0
  bangdong3Drinks.forEach((drink) => {
    totalPrice += drink.quantity * drink.price
  })
  bangdong3SideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
const bangdong3finalTotal = computed(() => {
  const totalPrice =
    bangdong3optionPrice.value + bangdong3TotalQuantityPrice.value
  return totalPrice
})
// 將資料推進 tableRows
const submitBangdong3 = () => {
  if (bangdong3TotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  // 檢查總數量是否匹配
  const calculatedTotalQuantity = bangdong3Mains.reduce(
    (acc, main) => acc + (main.quantity || 0),
    0
  )
  console.log(calculatedTotalQuantity, bangdong3TotalQuantity.value)
  if (calculatedTotalQuantity !== parseInt(bangdong3TotalQuantity.value, 10)) {
    alert('主餐總數量與輸入的總數量不搭！')
    return
  }
  const nextId =
    tableRows.length > 0 ? tableRows[tableRows.length - 1].id + 1 : 1

  const row = {
    bentoType: 3,
    id: nextId,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: '',
    price: bangdong3finalTotal.value,
    optionPrice: bangdong3optionPrice.value,
    totalPrice: bangdong3TotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: bangdong3Comment.value
  }

  const totalQuantity = bangdong3TotalQuantity.value
  row.quantity = totalQuantity
  // 主餐
  for (const bangdong3Main of bangdong3Mains) {
    if (bangdong3Main.quantity > 0) {
      row.Main +=
        bangdong3Main.name +
        '  x  ' +
        parseInt(bangdong3Main.quantity).toString() +
        '<br>'
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: bangdong3MainMealId.value,
        productTypeName: bangdong3MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)

      const input = {
        id: bangdong3Main.id,
        name: bangdong3Main.name,
        value: parseInt(bangdong3Main.quantity),
        type: 1
      }
      row.inputs.push(input)
      bangdong3Main.quantity = 0
    }
  }
  // 飲料
  for (const bangdong3Drink of bangdong3Drinks) {
    if (bangdong3Drink.quantity > 0) {
      row.drinks +=
        bangdong3Drink.name +
        'x' +
        parseInt(bangdong3Drink.quantity).toString() +
        '<br>'
      // 保留飲料名稱、飲料 ID
      const productInput = {
        productTypeName: bangdong3DrinkName.value,
        productTypeId: bangdong3DrinkId.value,
        productType: 'options_with_qty',
        type: 2
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdong3Drink.id,
        name: bangdong3Drink.name,
        value: parseInt(bangdong3Drink.quantity),
        type: 2
      }
      row.inputs.push(input)
      bangdong3Drink.quantity = 0
    }
  }
  // 配菜
  for (const bangdong3SideDish of bangdong3SideDishes) {
    if (bangdong3SideDish.quantity > 0) {
      row.sideDishes +=
        bangdong3SideDish.name +
        '  x  ' +
        parseInt(bangdong3SideDish.quantity).toString() +
        '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: bangdong3SideDishName.value,
        productTypeId: bangdong3SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      row.sideDishDefault += bangdong3SideDish.is_default + ' '
      const input = {
        id: bangdong3SideDish.id,
        name: bangdong3SideDish.name,
        value: parseInt(bangdong3SideDish.quantity),
        is_default: bangdong3SideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
      bangdong3SideDish.quantity = 0
    }
  }
  // 副主餐
  for (const bangdong3BentoMain of bangdong3BentoMains) {
    if (bangdong3BentoMain.quantity > 0) {
      row.bentoMains +=
        bangdong3BentoMain.name +
        'x' +
        parseInt(bangdong3BentoMain.quantity).toString() +
        '<br>'
      // 保留副主餐名稱、副主餐 ID
      const productInput = {
        productTypeName: bangdong3BentoMainName.value,
        productTypeId: bangdong3BentoMainId.value,
        productType: 'options_with_qty',
        type: 4
      }
      row.productInputs.push(productInput)

      const input = {
        id: bangdong3BentoMain.id,
        name: bangdong3BentoMain.name,
        value: parseInt(bangdong3BentoMain.quantity),
        type: 4
      }
      row.inputs.push(input)
      bangdong3BentoMain.quantity = 0
    }
  }
  // 保留 雞腿便當、1003、數量
  const productInput = {
    id: bangdong3ProductId.value,
    name: bangdong3Name.value,
    value: parseInt(totalQuantity),
    price: bangdong3Price.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: bangdong3Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (bangdong3Arbitrarily.value > 0) {
    row.Main +=
      '任意搭配' + 'x' + parseInt(bangdong3Arbitrarily.value).toString()
    const input = {
      id: 'bangdong3Arbitrarily',
      value: bangdong3Arbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = bangdong3Name.value + totalQuantity + '份'
  checkVegetable(row)
  // 將這個 row 推進 tableRows 中
  tableRows.push(row)
  meal.tableRows2.push(row)
  showbangdong3.value = false
  bangdong3Arbitrarily.value = 0
}
// --------------------------------------------
const Resetbangdong3 = () => {
  bangdong3Mains.forEach((bangdong3Main) => {
    bangdong3Main.quantity = 0
  })
  bangdong3Drinks.forEach((bangdong3Drink) => {
    bangdong3Drink.quantity = 0
  })
  bangdong3SideDishes.forEach((bangdong3SideDish) => {
    bangdong3SideDish.quantity = 0
  })
  bangdong3BentoMains.forEach((bangdong3BentoMain) => {
    bangdong3BentoMain.quantity = 0
  })
  bangdong3TotalQuantity.value = 0
  bangdong3Arbitrarily.value = 0
  showbangdong3.value = false
}
// 修改欄位
const bangdong3EditMains = reactive([])
const bangdong3EditDrinks = reactive([])
const bangdong3EditSideDishes = reactive([])
const bangdong3EditBentoMains = reactive([])
const loadBangdong3Edit = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1003')
    const productOptions = response.data.product_options

    // 主餐
    const mainMeal = productOptions.main_meal
    const values = mainMeal.product_option_values

    for (const value of values) {
      const bangdong3EditMain = {
        id: value.id,
        name: value.name,
        quantity: 0,
        hidenquantity: 0,
        shortname: value.short_name
      }
      bangdong3EditMains.push(bangdong3EditMain)
    }
    // 飲料
    const Drink = productOptions.drink
    const DrinkValues = Drink.product_option_values
    for (const DrinkValue of DrinkValues) {
      const bangdong3EditDrink = {
        id: DrinkValue.id,
        name: DrinkValue.name,
        quantity: 0,
        hidenquantity: 0,
        price: DrinkValue.price
      }
      bangdong3EditDrinks.push(bangdong3EditDrink)
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values
    for (const sideDishValue of sideDishValues) {
      const bangdong3EditSideDish = {
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        hidenquantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      }
      bangdong3EditSideDishes.push(bangdong3EditSideDish)
    }
    // 副主餐
    const bentoMain = productOptions.bento_main
    const bentoMainValues = bentoMain.product_option_values
    for (const bentoMainValue of bentoMainValues) {
      const bangdong3EditBentoMain = {
        id: bentoMainValue.id,
        name: bentoMainValue.name,
        quantity: 0,
        is_default: bentoMainValue.is_default,
        hidenquantity: 0
      }
      bangdong3EditBentoMains.push(bangdong3EditBentoMain)
    }
    bangdong3MainName.value = mainMeal.name
    bangdong3DrinkName.value = Drink.name
    bangdong3SideDishName.value = sideDish.name
    bangdong3BentoMainName.value = bentoMain.name
    bangdong3Price.value = parseInt(response.data.price)
    bangdong3EditMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            // 配菜的數量跟著主餐的數量變化
            bangdong3EditSideDishes.forEach((sideDish) => {
              const diff = Number(newVal) - Number(oldVal)
              if (sideDish.is_default) {
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
          // 副主餐的數量跟著主餐的數量變化
          bangdong3EditBentoMains.forEach((bentoMain) => {
            const diff = Number(newVal) - Number(oldVal)
            if (bentoMain.is_default) {
              const newQuantity = Number(bentoMain.quantity) + diff
              // 確保副主餐數量不會變成負數
              bentoMain.quantity = newQuantity >= 0 ? newQuantity : 0
            }
          })
        }
      )
    })
    bangdong3EditDrinks.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdong3EditSideDishes.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdong3EditBentoMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
  } catch (error) {
    console.error(error)
  }
}

// 滷牛便當
const bangdong4Mains = reactive([])
const bangdong4MainName = ref('')
const bangdong4Drinks = reactive([])
const bangdong4DrinkName = ref('')
const bangdong4SideDishes = reactive([])
const bangdong4SideDishName = ref('')
const bangdong4BentoMains = reactive([])
const bangdong4BentoMainName = ref('')
const bangdong4Name = ref('')
const bangdong4ProductId = ref('')
const bangdong4Price = ref(0)
const bangdong4MainMealId = ref('')
const bangdong4DrinkId = ref('')
const bangdong4SideDishId = ref('')
const bangdong4BentoMainId = ref('')
// 抓取滷牛便當主餐形成 input
const loadBangdong4 = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100
    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1004')
    const productOptions = response.data.product_options
    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values
    for (const mainMealValue of mainMealValues) {
      bangdong4Mains.push({
        id: mainMealValue.id,
        name: mainMealValue.name,
        shortname: mainMealValue.short_name,
        quantity: 0
      })
    }
    // 飲料
    const Drink = productOptions.drink
    const DrinkValues = Drink.product_option_values
    for (const DrinkValue of DrinkValues) {
      bangdong4Drinks.push({
        id: DrinkValue.id,
        name: DrinkValue.name,
        quantity: 0,
        price: DrinkValue.price
      })
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values
    for (const sideDishValue of sideDishValues) {
      bangdong4SideDishes.push({
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      })
    }
    // 副主餐
    const bentoMain = productOptions.bento_main
    const bentoMainValues = bentoMain.product_option_values
    for (const bentoMainValue of bentoMainValues) {
      bangdong4BentoMains.push({
        id: bentoMainValue.id,
        name: bentoMainValue.name,
        quantity: 0,
        is_default: bentoMainValue.is_default
      })
    }
    // 監聽主餐的數量變化
    bangdong4Mains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            // 配菜的數量跟著主餐的數量變化
            bangdong4SideDishes.forEach((sideDish) => {
              const diff = Number(newVal) - Number(oldVal)
              if (sideDish.is_default) {
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
          // 副主餐的數量跟著主餐的數量變化
          bangdong4BentoMains.forEach((bentoMain) => {
            const diff = Number(newVal) - Number(oldVal)
            if (bentoMain.is_default) {
              const newQuantity = Number(bentoMain.quantity) + diff
              // 確保副主餐數量不會變成負數
              bentoMain.quantity = newQuantity >= 0 ? newQuantity : 0
            }
          })
        }
      )
    })
    bangdong4Drinks.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdong4SideDishes.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdong4BentoMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })

    bangdong4Name.value = response.data.name
    bangdong4MainName.value = mainMeal.name
    bangdong4DrinkName.value = Drink.name
    bangdong4SideDishName.value = sideDish.name
    bangdong4BentoMainName.value = bentoMain.name
    bangdong4Price.value = parseInt(response.data.price)
    bangdong4ProductId.value = response.data.id
    bangdong4MainMealId.value = mainMeal.id
    bangdong4DrinkId.value = Drink.id
    bangdong4SideDishId.value = sideDish.id
    bangdong4BentoMainId.value = bentoMain.id
  } catch (error) {
    console.error(error)
  }
}

// 計算總數量
watch(bangdong4Mains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  bangdong4Arbitrarily.value = Math.max(
    0,
    parseInt(bangdong4TotalQuantity.value) - mainQuantityTotal
  )
})

// 計算總價格
const bangdong4TotalQuantityPrice = computed(() => {
  const totalPrice = bangdong4TotalQuantity.value * bangdong4Price.value
  return totalPrice
})
const bangdong4optionPrice = computed(() => {
  let totalPrice = 0
  bangdong4Drinks.forEach((drink) => {
    totalPrice += drink.quantity * drink.price
  })
  bangdong4SideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
const bangdong4finalTotal = computed(() => {
  const totalPrice =
    bangdong4optionPrice.value + bangdong4TotalQuantityPrice.value
  return totalPrice
})
// 將資料推進 tableRows
const submitBangdong4 = () => {
  if (bangdong4TotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  // 檢查總數量是否匹配
  const calculatedTotalQuantity = bangdong4Mains.reduce(
    (acc, main) => acc + (main.quantity || 0),
    0
  )
  console.log(calculatedTotalQuantity, bangdong4TotalQuantity.value)
  if (calculatedTotalQuantity !== parseInt(bangdong4TotalQuantity.value, 10)) {
    alert('主餐總數量與輸入的總數量不搭！')
    return
  }
  const nextId =
    tableRows.length > 0 ? tableRows[tableRows.length - 1].id + 1 : 1

  const row = {
    bentoType: 4,
    id: nextId,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: '',
    price: bangdong4finalTotal.value,
    optionPrice: bangdong4optionPrice.value,
    totalPrice: bangdong4TotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: bangdong4Comment.value
  }

  const totalQuantity = bangdong4TotalQuantity.value
  row.quantity = totalQuantity
  // 主餐
  for (const bangdong4Main of bangdong4Mains) {
    if (bangdong4Main.quantity > 0) {
      if (row.Main !== '') {
        row.Main += ''
      }
      row.Main +=
        bangdong4Main.name +
        'x' +
        parseInt(bangdong4Main.quantity).toString() +
        '<br>'
      const productInput = {
        productTypeId: bangdong4MainMealId.value,
        productTypeName: bangdong4MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)

      const input = {
        id: bangdong4Main.id,
        name: bangdong4Main.name,
        value: parseInt(bangdong4Main.quantity),
        type: 1
      }
      row.inputs.push(input)
      bangdong4Main.quantity = 0
    }
  }
  // 飲料
  for (const bangdong4Drink of bangdong4Drinks) {
    if (bangdong4Drink.quantity > 0) {
      row.drinks +=
        bangdong4Drink.name +
        'x' +
        parseInt(bangdong4Drink.quantity).toString() +
        '<br>'
      // 保留飲料名稱、飲料 ID
      const productInput = {
        productTypeName: bangdong4DrinkName.value,
        productTypeId: bangdong4DrinkId.value,
        productType: 'options_with_qty',
        type: 2
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdong4Drink.id,
        name: bangdong4Drink.name,
        value: parseInt(bangdong4Drink.quantity),
        type: 2
      }
      row.inputs.push(input)
      bangdong4Drink.quantity = 0
    }
  }
  // 配菜
  for (const bangdong4SideDish of bangdong4SideDishes) {
    if (bangdong4SideDish.quantity > 0) {
      row.sideDishes +=
        bangdong4SideDish.name +
        'x' +
        parseInt(bangdong4SideDish.quantity).toString() +
        '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: bangdong4SideDishName.value,
        productTypeId: bangdong4SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      row.sideDishDefault += bangdong4SideDish.is_default + ' '
      const input = {
        id: bangdong4SideDish.id,
        name: bangdong4SideDish.name,
        value: parseInt(bangdong4SideDish.quantity),
        is_default: bangdong4SideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
      bangdong4SideDish.quantity = 0
    }
  }
  // 副主餐
  for (const bangdong4BentoMain of bangdong4BentoMains) {
    if (bangdong4BentoMain.quantity > 0) {
      row.bentoMains +=
        bangdong4BentoMain.name +
        'x' +
        parseInt(bangdong4BentoMain.quantity).toString() +
        '<br>'
      // 保留副主餐名稱、副主餐 ID
      const productInput = {
        productTypeName: bangdong4BentoMainName.value,
        productTypeId: bangdong4BentoMainId.value,
        productType: 'options_with_qty',
        type: 4
      }
      row.productInputs.push(productInput)

      const input = {
        id: bangdong4BentoMain.id,
        name: bangdong4BentoMain.name,
        value: parseInt(bangdong4BentoMain.quantity),
        type: 4
      }
      row.inputs.push(input)
      bangdong4BentoMain.quantity = 0
    }
  }
  const productInput = {
    id: bangdong4ProductId.value,
    name: bangdong4Name.value,
    value: parseInt(totalQuantity),
    price: bangdong4Price.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: bangdong4Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (bangdong4Arbitrarily.value > 0) {
    row.Main +=
      '任意搭配' + 'x' + parseInt(bangdong4Arbitrarily.value).toString()
    const input = {
      id: 'bangdong4Arbitrarily',
      value: bangdong4Arbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = bangdong4Name.value + totalQuantity + '份'
  checkVegetable(row)
  // 將這個 row 推進 tableRows 中
  tableRows.push(row)
  showbangdong4.value = false
  bangdong4Arbitrarily.value = 0
}
// -----------------------------------------
const Resetbangdong4 = () => {
  bangdong4Mains.forEach((bangdong4Main) => {
    bangdong4Main.quantity = 0
  })
  bangdong4Drinks.forEach((bangdong4Drink) => {
    bangdong4Drink.quantity = 0
  })
  bangdong4SideDishes.forEach((bangdong4SideDish) => {
    bangdong4SideDish.quantity = 0
  })
  bangdong4BentoMains.forEach((bangdong4BentoMain) => {
    bangdong4BentoMain.quantity = 0
  })
  bangdong4TotalQuantity.value = 0
  bangdong4Arbitrarily.value = 0
  showbangdong4.value = false
}
// 修改欄位
const bangdong4EditMains = reactive([])
const bangdong4EditDrinks = reactive([])
const bangdong4EditSideDishes = reactive([])
const bangdong4EditBentoMains = reactive([])
const loadBangdong4Edit = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1004')
    const productOptions = response.data.product_options

    // 主餐
    const mainMeal = productOptions.main_meal
    const values = mainMeal.product_option_values

    for (const value of values) {
      const bangdong4EditMain = {
        id: value.id,
        name: value.name,
        quantity: 0,
        hidenquantity: 0,
        shortname: value.short_name
      }
      bangdong4EditMains.push(bangdong4EditMain)
    }
    // 飲料
    const Drink = productOptions.drink
    const DrinkValues = Drink.product_option_values
    for (const DrinkValue of DrinkValues) {
      const bangdong4EditDrink = {
        id: DrinkValue.id,
        name: DrinkValue.name,
        quantity: 0,
        hidenquantity: 0,
        price: DrinkValue.price
      }
      bangdong4EditDrinks.push(bangdong4EditDrink)
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values
    for (const sideDishValue of sideDishValues) {
      const bangdong4EditSideDish = {
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        hidenquantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      }
      bangdong4EditSideDishes.push(bangdong4EditSideDish)
    }
    // 副主餐
    const bentoMain = productOptions.bento_main
    const bentoMainValues = bentoMain.product_option_values
    for (const bentoMainValue of bentoMainValues) {
      const bangdong4EditBentoMain = {
        id: bentoMainValue.id,
        name: bentoMainValue.name,
        quantity: 0,
        is_default: bentoMainValue.is_default,
        hidenquantity: 0
      }
      bangdong4EditBentoMains.push(bangdong4EditBentoMain)
    }

    bangdong4MainName.value = mainMeal.name
    bangdong4DrinkName.value = Drink.name
    bangdong4SideDishName.value = sideDish.name
    bangdong4BentoMainName.value = bentoMain.name
    bangdong4Price.value = parseInt(response.data.price)
    bangdong4EditMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            // 配菜的數量跟著主餐的數量變化
            bangdong4EditSideDishes.forEach((sideDish) => {
              const diff = Number(newVal) - Number(oldVal)
              if (sideDish.is_default) {
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
          // 副主餐的數量跟著主餐的數量變化
          bangdong4EditBentoMains.forEach((bentoMain) => {
            const diff = Number(newVal) - Number(oldVal)
            if (bentoMain.is_default) {
              const newQuantity = Number(bentoMain.quantity) + diff
              // 確保副主餐數量不會變成負數
              bentoMain.quantity = newQuantity >= 0 ? newQuantity : 0
            }
          })
        }
      )
    })
    bangdong4EditDrinks.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdong4EditSideDishes.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdong4EditBentoMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
  } catch (error) {
    console.error(error)
  }
}
// 鮭魚便當

const bangdongSalmonMains = reactive([])
const bangdongSalmonMainName = ref('')
const bangdongSalmonDrinks = reactive([])
const bangdongSalmonDrinkName = ref('')
const bangdongSalmonSideDishes = reactive([])
const bangdongSalmonSideDishName = ref('')
const bangdongSalmonBentoMains = reactive([])
const bangdongSalmonBentoMainName = ref('')
const bangdongSalmonName = ref('')
const bangdongSalmonProductId = ref('')
const bangdongSalmonPrice = ref(0)
const bangdongSalmonMainMealId = ref('')
const bangdongSalmonDrinkId = ref('')
const bangdongSalmonSideDishId = ref('')
const bangdongSalmonBentoMainId = ref('')
const loadBangdongSalmon = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100
    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1080')
    const productOptions = response.data.product_options
    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values
    for (const mainMealValue of mainMealValues) {
      bangdongSalmonMains.push({
        id: mainMealValue.id,
        name: mainMealValue.name,
        shortname: mainMealValue.short_name,
        quantity: 0
      })
    }
    // 飲料
    const Drink = productOptions.drink
    const DrinkValues = Drink.product_option_values
    for (const DrinkValue of DrinkValues) {
      bangdongSalmonDrinks.push({
        id: DrinkValue.id,
        name: DrinkValue.name,
        quantity: 0,
        price: DrinkValue.price
      })
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values
    for (const sideDishValue of sideDishValues) {
      bangdongSalmonSideDishes.push({
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      })
    }
    // 副主餐
    const bentoMain = productOptions.bento_main
    const bentoMainValues = bentoMain.product_option_values
    for (const bentoMainValue of bentoMainValues) {
      bangdongSalmonBentoMains.push({
        id: bentoMainValue.id,
        name: bentoMainValue.name,
        quantity: 0,
        is_default: bentoMainValue.is_default
      })
    }
    // 監聽主餐的數量變化
    bangdongSalmonMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            // 配菜的數量跟著主餐的數量變化
            bangdongSalmonSideDishes.forEach((sideDish) => {
              const diff = Number(newVal) - Number(oldVal)
              if (sideDish.is_default) {
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
          // 副主餐的數量跟著主餐的數量變化
          bangdongSalmonBentoMains.forEach((bentoMain) => {
            const diff = Number(newVal) - Number(oldVal)
            if (bentoMain.is_default) {
              const newQuantity = Number(bentoMain.quantity) + diff
              // 確保副主餐數量不會變成負數
              bentoMain.quantity = newQuantity >= 0 ? newQuantity : 0
            }
          })
        }
      )
    })
    bangdongSalmonDrinks.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdongSalmonSideDishes.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdongSalmonBentoMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })

    bangdongSalmonName.value = response.data.name
    bangdongSalmonMainName.value = mainMeal.name
    bangdongSalmonDrinkName.value = Drink.name
    bangdongSalmonSideDishName.value = sideDish.name
    bangdongSalmonBentoMainName.value = bentoMain.name
    bangdongSalmonPrice.value = parseInt(response.data.price)
    bangdongSalmonProductId.value = response.data.id
    bangdongSalmonMainMealId.value = mainMeal.id
    bangdongSalmonDrinkId.value = Drink.id
    bangdongSalmonSideDishId.value = sideDish.id
    bangdongSalmonBentoMainId.value = bentoMain.id
  } catch (error) {
    console.error(error)
  }
}
watch(bangdongSalmonMains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  bangdongSalmonArbitrarily.value = Math.max(
    0,
    parseInt(bangdongSalmonTotalQuantity.value) - mainQuantityTotal
  )
})
const bangdongSalmonTotalQuantityPrice = computed(() => {
  const totalPrice =
    bangdongSalmonTotalQuantity.value * bangdongSalmonPrice.value

  return totalPrice
})
const bangdongSalmonoptionPrice = computed(() => {
  let totalPrice = 0
  bangdongSalmonDrinks.forEach((drink) => {
    totalPrice += drink.quantity * drink.price
  })
  bangdongSalmonSideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
const bangdongSalmonfinalTotal = computed(() => {
  const totalPrice =
    bangdongSalmonoptionPrice.value + bangdongSalmonTotalQuantityPrice.value
  return totalPrice
})
// 將資料推進 tableRows
const submitBangdongSalmon = () => {
  if (bangdongSalmonTotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  // 檢查總數量是否匹配
  const calculatedTotalQuantity = bangdongSalmonMains.reduce(
    (acc, main) => acc + (main.quantity || 0),
    0
  )
  console.log(calculatedTotalQuantity, bangdongSalmonTotalQuantity.value)
  if (
    calculatedTotalQuantity !== parseInt(bangdongSalmonTotalQuantity.value, 10)
  ) {
    alert('主餐總數量與輸入的總數量不搭！')
    return
  }
  const nextId =
    tableRows.length > 0 ? tableRows[tableRows.length - 1].id + 1 : 1

  const row = {
    bentoType: 13,
    id: nextId,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: '',
    price: bangdongSalmonfinalTotal.value,
    optionPrice: bangdongSalmonoptionPrice.value,
    totalPrice: bangdongSalmonTotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: bangdongSalmonComment.value
  }

  const totalQuantity = bangdongSalmonTotalQuantity.value
  row.quantity = totalQuantity
  // 主餐
  for (const bangdongSalmonMain of bangdongSalmonMains) {
    if (bangdongSalmonMain.quantity > 0) {
      row.Main +=
        bangdongSalmonMain.name +
        'x' +
        parseInt(bangdongSalmonMain.quantity).toString() +
        '<br>'
      const productInput = {
        productTypeId: bangdongSalmonMainMealId.value,
        productTypeName: bangdongSalmonMainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)

      const input = {
        id: bangdongSalmonMain.id,
        name: bangdongSalmonMain.name,
        value: parseInt(bangdongSalmonMain.quantity),
        type: 1
      }
      row.inputs.push(input)
      bangdongSalmonMain.quantity = 0
    }
  }
  // 飲料
  for (const bangdongSalmonDrink of bangdongSalmonDrinks) {
    if (bangdongSalmonDrink.quantity > 0) {
      row.drinks +=
        bangdongSalmonDrink.name +
        'x' +
        parseInt(bangdongSalmonDrink.quantity).toString() +
        '<br>'
      // 保留飲料名稱、飲料 ID
      const productInput = {
        productTypeName: bangdongSalmonDrinkName.value,
        productTypeId: bangdongSalmonDrinkId.value,
        productType: 'options_with_qty',
        type: 2
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongSalmonDrink.id,
        name: bangdongSalmonDrink.name,
        value: parseInt(bangdongSalmonDrink.quantity),
        type: 2
      }
      row.inputs.push(input)
      bangdongSalmonDrink.quantity = 0
    }
  }
  // 配菜
  for (const bangdongSalmonSideDish of bangdongSalmonSideDishes) {
    if (bangdongSalmonSideDish.quantity > 0) {
      row.sideDishes +=
        bangdongSalmonSideDish.name +
        'x' +
        parseInt(bangdongSalmonSideDish.quantity).toString() +
        '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: bangdongSalmonSideDishName.value,
        productTypeId: bangdongSalmonSideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      row.sideDishDefault += bangdongSalmonSideDish.is_default + ' '
      const input = {
        id: bangdongSalmonSideDish.id,
        name: bangdongSalmonSideDish.name,
        value: parseInt(bangdongSalmonSideDish.quantity),
        is_default: bangdongSalmonSideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
      bangdongSalmonSideDish.quantity = 0
    }
  }
  // 副主餐
  for (const bangdongSalmonBentoMain of bangdongSalmonBentoMains) {
    if (bangdongSalmonBentoMain.quantity > 0) {
      row.bentoMains +=
        bangdongSalmonBentoMain.name +
        'x' +
        parseInt(bangdongSalmonBentoMain.quantity).toString() +
        '<br>'
      // 保留副主餐名稱、副主餐 ID
      const productInput = {
        productTypeName: bangdongSalmonBentoMainName.value,
        productTypeId: bangdongSalmonBentoMainId.value,
        productType: 'options_with_qty',
        type: 4
      }
      row.productInputs.push(productInput)

      const input = {
        id: bangdongSalmonBentoMain.id,
        name: bangdongSalmonBentoMain.name,
        value: parseInt(bangdongSalmonBentoMain.quantity),
        type: 4
      }
      row.inputs.push(input)
      bangdongSalmonBentoMain.quantity = 0
    }
  }
  const productInput = {
    id: bangdongSalmonProductId.value,
    name: bangdongSalmonName.value,
    value: parseInt(totalQuantity),
    price: bangdongSalmonPrice.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: bangdongSalmonComment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (bangdongSalmonArbitrarily.value > 0) {
    row.Main +=
      '任意搭配' + 'x' + parseInt(bangdongSalmonArbitrarily.value).toString()
    const input = {
      id: 'bangdongSalmonArbitrarily',
      value: bangdongSalmonArbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = bangdongSalmonName.value + totalQuantity + '份'
  checkVegetable(row)
  // 將這個 row 推進 tableRows 中
  tableRows.push(row)
  showbangdongSalmon.value = false
  bangdongSalmonArbitrarily.value = 0
}

// 素食便當 125
const bangdongVegetarian1Mains = reactive([])
const bangdongVegetarian1MainName = ref('')
const bangdongVegetarian1Drinks = reactive([])
const bangdongVegetarian1DrinkName = ref('')
const bangdongVegetarian1SideDishes = reactive([])
const bangdongVegetarian1SideDishName = ref('')
const bangdongVegetarian1BentoMains = reactive([])
const bangdongVegetarian1BentoMainName = ref('')
const bangdongVegetarian1Name = ref('')
const bangdongVegetarian1Price = ref('')
const bangdongVegetarian1ProductId = ref('')
const bangdongVegetarian1MainMealId = ref('')
const bangdongVegetarian1DrinkId = ref('')
const bangdongVegetarian1SideDishId = ref('')
const bangdongVegetarian1BentoMainId = ref('')
// 抓取素食便當 125 主餐形成 input
const loadBangdongVegetarian1 = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1066')
    const productOptions = response.data.product_options
    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values

    for (const mainMealValue of mainMealValues) {
      bangdongVegetarian1Mains.push({
        id: mainMealValue.id,
        name: mainMealValue.name,
        shortname: mainMealValue.short_name,
        quantity: 0
      })
    }
    // 飲料
    const Drink = productOptions.drink
    const DrinkValues = Drink.product_option_values

    for (const DrinkValue of DrinkValues) {
      bangdongVegetarian1Drinks.push({
        id: DrinkValue.id,
        name: DrinkValue.name,
        quantity: 0,
        price: DrinkValue.price
      })
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values

    for (const sideDishValue of sideDishValues) {
      bangdongVegetarian1SideDishes.push({
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      })
    }
    // 副主餐
    const bentoMain = productOptions.bento_main
    const bentoMainValues = bentoMain.product_option_values
    for (const bentoMainValue of bentoMainValues) {
      bangdongVegetarian1BentoMains.push({
        id: bentoMainValue.id,
        name: bentoMainValue.name,
        quantity: 0,
        is_default: bentoMainValue.is_default
      })
    }
    // 監聽主餐的數量變化
    bangdongVegetarian1Mains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            // 配菜的數量跟著主餐的數量變化
            bangdongVegetarian1SideDishes.forEach((sideDish) => {
              const diff = Number(newVal) - Number(oldVal)
              if (sideDish.is_default) {
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
          // 副主餐的數量跟著主餐的數量變化
          bangdongVegetarian1BentoMains.forEach((bentoMain) => {
            const diff = Number(newVal) - Number(oldVal)
            if (bentoMain.is_default) {
              const newQuantity = Number(bentoMain.quantity) + diff
              // 確保副主餐數量不會變成負數
              bentoMain.quantity = newQuantity >= 0 ? newQuantity : 0
            }
          })
        }
      )
    })
    bangdongVegetarian1Drinks.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdongVegetarian1SideDishes.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdongVegetarian1BentoMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdongVegetarian1Name.value = response.data.name
    bangdongVegetarian1MainName.value = mainMeal.name
    bangdongVegetarian1DrinkName.value = Drink.name
    bangdongVegetarian1SideDishName.value = sideDish.name
    bangdongVegetarian1BentoMainName.value = bentoMain.name
    bangdongVegetarian1Price.value = parseInt(response.data.price)
    bangdongVegetarian1ProductId.value = response.data.id
    bangdongVegetarian1MainMealId.value = mainMeal.id
    bangdongVegetarian1DrinkId.value = Drink.id
    bangdongVegetarian1SideDishId.value = sideDish.id
    bangdongVegetarian1BentoMainId.value = bentoMain.id
  } catch (error) {
    console.error(error)
  }
}

// 計算總數量
watch(bangdongVegetarian1Mains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  bangdongVegetarian1Arbitrarily.value = Math.max(
    0,
    parseInt(bangdongVegetarian1TotalQuantity.value) - mainQuantityTotal
  )
})

// 計算總價格
const bangdongVegetarian1TotalQuantityPrice = computed(() => {
  const totalPrice =
    bangdongVegetarian1TotalQuantity.value * bangdongVegetarian1Price.value

  return totalPrice
})
const bangdongVegetarian1optionPrice = computed(() => {
  let totalPrice = 0
  bangdongVegetarian1Drinks.forEach((drink) => {
    totalPrice += drink.quantity * drink.price
  })
  bangdongVegetarian1SideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
const bangdongVegetarian1finalTotal = computed(() => {
  const totalPrice =
    bangdongVegetarian1optionPrice.value +
    bangdongVegetarian1TotalQuantityPrice.value
  return totalPrice
})
// 將資料推進 tableRows
const submitBangdongVegetarian1 = () => {
  if (bangdongVegetarian1TotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  // 檢查總數量是否匹配
  const calculatedTotalQuantity = bangdongVegetarian1Mains.reduce(
    (acc, main) => acc + (main.quantity || 0),
    0
  )
  console.log(calculatedTotalQuantity, bangdongVegetarian1TotalQuantity.value)
  if (
    calculatedTotalQuantity !==
    parseInt(bangdongVegetarian1TotalQuantity.value, 10)
  ) {
    alert('主餐總數量與輸入的總數量不搭！')
    return
  }
  const nextId =
    tableRows.length > 0 ? tableRows[tableRows.length - 1].id + 1 : 1

  const row = {
    bentoType: 11,
    id: nextId,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: 0,
    price: bangdongVegetarian1finalTotal.value,
    optionPrice: bangdongVegetarian1optionPrice.value,
    totalPrice: bangdongVegetarian1TotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: bangdongVegetarian1Comment.value
  }

  const totalQuantity = bangdongVegetarian1TotalQuantity.value
  row.quantity = totalQuantity
  // 主餐
  for (const bangdongVegetarian1Main of bangdongVegetarian1Mains) {
    if (bangdongVegetarian1Main.quantity > 0) {
      row.Main +=
        bangdongVegetarian1Main.name +
        'x' +
        parseInt(bangdongVegetarian1Main.quantity) +
        '<br>'
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: bangdongVegetarian1MainMealId.value,
        productTypeName: bangdongVegetarian1MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)

      const input = {
        id: bangdongVegetarian1Main.id,
        name: bangdongVegetarian1Main.name,
        value: parseInt(bangdongVegetarian1Main.quantity),
        type: 1
      }
      row.inputs.push(input)
      bangdongVegetarian1Main.quantity = 0
    }
  }
  // 飲料
  for (const bangdongVegetarian1Drink of bangdongVegetarian1Drinks) {
    if (bangdongVegetarian1Drink.quantity > 0) {
      row.drinks +=
        bangdongVegetarian1Drink.name +
        'x' +
        parseInt(bangdongVegetarian1Drink.quantity).toString() +
        '<br>'
      // 保留飲料名稱、飲料 ID
      const productInput = {
        productTypeName: bangdongVegetarian1DrinkName.value,
        productTypeId: bangdongVegetarian1DrinkId.value,
        productType: 'options_with_qty',
        type: 2
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongVegetarian1Drink.id,
        name: bangdongVegetarian1Drink.name,
        value: parseInt(bangdongVegetarian1Drink.quantity),
        type: 2
      }
      row.inputs.push(input)
      bangdongVegetarian1Drink.quantity = 0
    }
  }
  // 配菜
  for (const bangdongVegetarian1SideDish of bangdongVegetarian1SideDishes) {
    if (bangdongVegetarian1SideDish.quantity > 0) {
      row.sideDishes +=
        bangdongVegetarian1SideDish.name +
        'x' +
        parseInt(bangdongVegetarian1SideDish.quantity).toString() +
        '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: bangdongVegetarian1SideDishName.value,
        productTypeId: bangdongVegetarian1SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      row.sideDishDefault += bangdongVegetarian1SideDish.is_default + ' '
      const input = {
        id: bangdongVegetarian1SideDish.id,
        name: bangdongVegetarian1SideDish.name,
        value: parseInt(bangdongVegetarian1SideDish.quantity),
        is_default: bangdongVegetarian1SideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
      bangdongVegetarian1SideDish.quantity = 0
    }
  }
  // 副主餐
  for (const bangdongVegetarian1BentoMain of bangdongVegetarian1BentoMains) {
    if (bangdongVegetarian1BentoMain.quantity > 0) {
      row.bentoMains +=
        bangdongVegetarian1BentoMain.name +
        'x' +
        parseInt(bangdongVegetarian1BentoMain.quantity).toString() +
        '<br>'
      // 保留副主餐名稱、副主餐 ID
      const productInput = {
        productTypeName: bangdongVegetarian1BentoMainName.value,
        productTypeId: bangdongVegetarian1BentoMainId.value,
        productType: 'options_with_qty',
        type: 4
      }
      row.productInputs.push(productInput)

      const input = {
        id: bangdongVegetarian1BentoMain.id,
        name: bangdongVegetarian1BentoMain.name,
        value: parseInt(bangdongVegetarian1BentoMain.quantity),
        type: 4
      }
      row.inputs.push(input)
      bangdongVegetarian1BentoMain.quantity = 0
    }
  }
  // 保留 素食便當 125、1003、數量
  const productInput = {
    id: bangdongVegetarian1ProductId.value,
    name: bangdongVegetarian1Name.value,
    value: parseInt(totalQuantity),
    price: bangdongVegetarian1Price.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: bangdongVegetarian1Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (bangdongVegetarian1Arbitrarily.value > 0) {
    row.Main +=
      '任意搭配' +
      'x' +
      parseInt(bangdongVegetarian1Arbitrarily.value).toString()
    const input = {
      id: 'bangdongVegetarian1Arbitrarily',
      value: bangdongVegetarian1Arbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = bangdongVegetarian1Name.value + totalQuantity + '份'
  checkVegetable(row)
  // 將這個 row 推進 tableRows 中
  tableRows.push(row)
  console.log(row)
  showbangdongVegetarian1.value = false
  bangdongVegetarian1Arbitrarily.value = 0
}
// ------------------------------------------------------
const ResetbangdongVegetarian1 = () => {
  bangdongVegetarian1Mains.forEach((bangdongVegetarian1Main) => {
    bangdongVegetarian1Main.quantity = 0
  })
  bangdongVegetarian1Drinks.forEach((bangdongVegetarian1Drink) => {
    bangdongVegetarian1Drink.quantity = 0
  })
  bangdongVegetarian1SideDishes.forEach((bangdongVegetarian1SideDish) => {
    bangdongVegetarian1SideDish.quantity = 0
  })
  bangdongVegetarian1BentoMains.forEach((bangdongVegetarian1BentoMain) => {
    bangdongVegetarian1BentoMain.quantity = 0
  })
  bangdongVegetarian1TotalQuantity.value = 0
  bangdongVegetarian1Arbitrarily.value = 0
  showbangdongVegetarian1.value = false
}
// 修改欄位
const bangdongVegetarian1EditMains = reactive([])
const bangdongVegetarian1EditDrinks = reactive([])
const bangdongVegetarian1EditSideDishes = reactive([])
const bangdongVegetarian1EditBentoMains = reactive([])
const loadBangdongVegetarian1Edit = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1066')
    const productOptions = response.data.product_options

    // 主餐
    const mainMeal = productOptions.main_meal
    const values = mainMeal.product_option_values

    for (const value of values) {
      const bangdongVegetarian1EditMain = {
        id: value.id,
        name: value.name,
        quantity: 0,
        hidenquantity: 0,
        shortname: value.short_name
      }
      bangdongVegetarian1EditMains.push(bangdongVegetarian1EditMain)
    }
    // 飲料
    const Drink = productOptions.drink
    const DrinkValues = Drink.product_option_values
    for (const DrinkValue of DrinkValues) {
      const bangdongVegetarian1EditDrink = {
        id: DrinkValue.id,
        name: DrinkValue.name,
        quantity: 0,
        hidenquantity: 0,
        price: DrinkValue.price
      }
      bangdongVegetarian1EditDrinks.push(bangdongVegetarian1EditDrink)
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values
    for (const sideDishValue of sideDishValues) {
      const bangdongVegetarian1EditSideDish = {
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        hidenquantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      }
      bangdongVegetarian1EditSideDishes.push(bangdongVegetarian1EditSideDish)
    }
    // 副主餐
    const bentoMain = productOptions.bento_main
    const bentoMainValues = bentoMain.product_option_values
    for (const bentoMainValue of bentoMainValues) {
      const bangdongVegetarian1EditBentoMain = {
        id: bentoMainValue.id,
        name: bentoMainValue.name,
        quantity: 0,
        is_default: bentoMainValue.is_default,
        hidenquantity: 0
      }
      bangdongVegetarian1EditBentoMains.push(bangdongVegetarian1EditBentoMain)
    }
    bangdongVegetarian1MainName.value = mainMeal.name
    bangdongVegetarian1DrinkName.value = Drink.name
    bangdongVegetarian1SideDishName.value = sideDish.name
    bangdongVegetarian1BentoMainName.value = bentoMain.name
    bangdongVegetarian1Price.value = parseInt(response.data.price)
    bangdongVegetarian1EditMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            // 配菜的數量跟著主餐的數量變化
            bangdongVegetarian1EditSideDishes.forEach((sideDish) => {
              const diff = Number(newVal) - Number(oldVal)
              if (sideDish.is_default) {
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
          // 副主餐的數量跟著主餐的數量變化
          bangdongVegetarian1EditBentoMains.forEach((bentoMain) => {
            const diff = Number(newVal) - Number(oldVal)
            if (bentoMain.is_default) {
              const newQuantity = Number(bentoMain.quantity) + diff
              // 確保副主餐數量不會變成負數
              bentoMain.quantity = newQuantity >= 0 ? newQuantity : 0
            }
          })
        }
      )
    })
    bangdongVegetarian1EditDrinks.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdongVegetarian1EditSideDishes.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdongVegetarian1EditBentoMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
  } catch (error) {
    console.error(error)
  }
}

// 素食便當 150
const bangdongVegetarian2Mains = reactive([])
const bangdongVegetarian2MainName = ref('')
const bangdongVegetarian2Drinks = reactive([])
const bangdongVegetarian2DrinkName = ref('')
const bangdongVegetarian2SideDishes = reactive([])
const bangdongVegetarian2SideDishName = ref('')
const bangdongVegetarian2BentoMains = reactive([])
const bangdongVegetarian2BentoMainName = ref('')
const bangdongVegetarian2Name = ref('')
const bangdongVegetarian2Price = ref('')
const bangdongVegetarian2ProductId = ref('')
const bangdongVegetarian2MainMealId = ref('')
const bangdongVegetarian2DrinkId = ref('')
const bangdongVegetarian2SideDishId = ref('')
const bangdongVegetarian2BentoMainId = ref('')
// 抓取素食便當 125 主餐形成 input
const loadBangdongVegetarian2 = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1067')

    const productOptions = response.data.product_options
    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values

    for (const mainMealValue of mainMealValues) {
      bangdongVegetarian2Mains.push({
        id: mainMealValue.id,
        name: mainMealValue.name,
        shortname: mainMealValue.short_name,
        quantity: 0
      })
    }
    // 飲料
    const Drink = productOptions.drink
    const DrinkValues = Drink.product_option_values

    for (const DrinkValue of DrinkValues) {
      bangdongVegetarian2Drinks.push({
        id: DrinkValue.id,
        name: DrinkValue.name,
        quantity: 0,
        price: DrinkValue.price
      })
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values

    for (const sideDishValue of sideDishValues) {
      bangdongVegetarian2SideDishes.push({
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      })
    }
    // 副主餐
    const bentoMain = productOptions.bento_main
    const bentoMainValues = bentoMain.product_option_values
    for (const bentoMainValue of bentoMainValues) {
      bangdongVegetarian2BentoMains.push({
        id: bentoMainValue.id,
        name: bentoMainValue.name,
        quantity: 0,
        is_default: bentoMainValue.is_default
      })
    }
    // 監聽主餐的數量變化
    bangdongVegetarian2Mains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            // 配菜的數量跟著主餐的數量變化
            bangdongVegetarian2SideDishes.forEach((sideDish) => {
              const diff = Number(newVal) - Number(oldVal)
              if (sideDish.is_default) {
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
          // 副主餐的數量跟著主餐的數量變化
          bangdongVegetarian2BentoMains.forEach((bentoMain) => {
            const diff = Number(newVal) - Number(oldVal)
            if (bentoMain.is_default) {
              const newQuantity = Number(bentoMain.quantity) + diff
              // 確保副主餐數量不會變成負數
              bentoMain.quantity = newQuantity >= 0 ? newQuantity : 0
            }
          })
        }
      )
    })
    bangdongVegetarian2Drinks.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdongVegetarian2SideDishes.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdongVegetarian2BentoMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdongVegetarian2Name.value = response.data.name
    bangdongVegetarian2MainName.value = mainMeal.name
    bangdongVegetarian2DrinkName.value = Drink.name
    bangdongVegetarian2SideDishName.value = sideDish.name
    bangdongVegetarian2BentoMainName.value = bentoMain.name
    bangdongVegetarian2Price.value = parseInt(response.data.price)
    bangdongVegetarian2ProductId.value = response.data.id
    bangdongVegetarian2MainMealId.value = mainMeal.id
    bangdongVegetarian2DrinkId.value = Drink.id
    bangdongVegetarian2SideDishId.value = sideDish.id
    bangdongVegetarian2BentoMainId.value = bentoMain.id
  } catch (error) {
    console.error(error)
  }
}
// 計算總數量
watch(bangdongVegetarian2Mains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  bangdongVegetarian2Arbitrarily.value = Math.max(
    0,
    parseInt(bangdongVegetarian2TotalQuantity.value) - mainQuantityTotal
  )
})
// 計算總價格
const bangdongVegetarian2TotalQuantityPrice = computed(() => {
  const totalPrice =
    bangdongVegetarian2TotalQuantity.value * bangdongVegetarian2Price.value
  return totalPrice
})
const bangdongVegetarian2optionPrice = computed(() => {
  let totalPrice = 0
  bangdongVegetarian2Drinks.forEach((drink) => {
    totalPrice += drink.quantity * drink.price
  })
  bangdongVegetarian2SideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
const bangdongVegetarian2finalTotal = computed(() => {
  const totalPrice =
    bangdongVegetarian2optionPrice.value +
    bangdongVegetarian2TotalQuantityPrice.value
  return totalPrice
})
// 將資料推進 tableRows
const submitBangdongVegetarian2 = () => {
  if (bangdongVegetarian2TotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  // 檢查總數量是否匹配
  const calculatedTotalQuantity = bangdongVegetarian2Mains.reduce(
    (acc, main) => acc + (main.quantity || 0),
    0
  )
  console.log(calculatedTotalQuantity, bangdongVegetarian2TotalQuantity.value)
  if (
    calculatedTotalQuantity !==
    parseInt(bangdongVegetarian2TotalQuantity.value, 10)
  ) {
    alert('主餐總數量與輸入的總數量不搭！')
    return
  }
  const nextId =
    tableRows.length > 0 ? tableRows[tableRows.length - 1].id + 1 : 1

  const row = {
    bentoType: 12,
    id: nextId,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    price: bangdongVegetarian2finalTotal.value,
    optionPrice: bangdongVegetarian2optionPrice.value,
    totalPrice: bangdongVegetarian2TotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: bangdongVegetarian2Comment.value
  }

  const totalQuantity = bangdongVegetarian2TotalQuantity.value
  row.quantity = totalQuantity
  // 主餐
  for (const bangdongVegetarian2Main of bangdongVegetarian2Mains) {
    if (bangdongVegetarian2Main.quantity > 0) {
      if (row.Main !== '') {
        row.Main += ','
      }

      row.Main +=
        bangdongVegetarian2Main.name +
        'x' +
        parseInt(bangdongVegetarian2Main.quantity).toString() +
        '<br>'
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: bangdongVegetarian2MainMealId.value,
        productTypeName: bangdongVegetarian2MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)

      const input = {
        id: bangdongVegetarian2Main.id,
        name: bangdongVegetarian2Main.name,
        value: parseInt(bangdongVegetarian2Main.quantity),
        type: 1
      }
      row.inputs.push(input)
      bangdongVegetarian2Main.quantity = 0
    }
  }
  // 飲料
  for (const bangdongVegetarian2Drink of bangdongVegetarian2Drinks) {
    if (bangdongVegetarian2Drink.quantity > 0) {
      row.drinks +=
        bangdongVegetarian2Drink.name +
        'x' +
        parseInt(bangdongVegetarian2Drink.quantity).toString() +
        '<br>'
      // 保留飲料名稱、飲料 ID
      const productInput = {
        productTypeName: bangdongVegetarian2DrinkName.value,
        productTypeId: bangdongVegetarian2DrinkId.value,
        productType: 'options_with_qty',
        type: 2
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongVegetarian2Drink.id,
        name: bangdongVegetarian2Drink.name,
        value: parseInt(bangdongVegetarian2Drink.quantity),
        type: 2
      }
      row.inputs.push(input)
      bangdongVegetarian2Drink.quantity = 0
    }
  }
  // 配菜
  for (const bangdongVegetarian2SideDish of bangdongVegetarian2SideDishes) {
    if (bangdongVegetarian2SideDish.quantity > 0) {
      row.sideDishes +=
        bangdongVegetarian2SideDish.name +
        'x' +
        parseInt(bangdongVegetarian2SideDish.quantity).toString() +
        '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: bangdongVegetarian2SideDishName.value,
        productTypeId: bangdongVegetarian2SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      row.sideDishDefault += bangdongVegetarian2SideDish.is_default + ' '
      const input = {
        id: bangdongVegetarian2SideDish.id,
        name: bangdongVegetarian2SideDish.name,
        value: parseInt(bangdongVegetarian2SideDish.quantity),
        is_default: bangdongVegetarian2SideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
      bangdongVegetarian2SideDish.quantity = 0
    }
  }
  // 副主餐
  for (const bangdongVegetarian2BentoMain of bangdongVegetarian2BentoMains) {
    if (bangdongVegetarian2BentoMain.quantity > 0) {
      row.bentoMains +=
        bangdongVegetarian2BentoMain.name +
        'x' +
        parseInt(bangdongVegetarian2BentoMain.quantity).toString() +
        '<br>'
      // 保留副主餐名稱、副主餐 ID
      const productInput = {
        productTypeName: bangdongVegetarian2BentoMainName.value,
        productTypeId: bangdongVegetarian2BentoMainId.value,
        productType: 'options_with_qty',
        type: 4
      }
      row.productInputs.push(productInput)

      const input = {
        id: bangdongVegetarian2BentoMain.id,
        name: bangdongVegetarian2BentoMain.name,
        value: parseInt(bangdongVegetarian2BentoMain.quantity),
        type: 4
      }
      row.inputs.push(input)
      bangdongVegetarian2BentoMain.quantity = 0
    }
  }
  // 保留 素食便當 125、1003、數量
  const productInput = {
    id: bangdongVegetarian2ProductId.value,
    name: bangdongVegetarian2Name.value,
    value: parseInt(totalQuantity),
    price: bangdongVegetarian2Price.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: bangdongVegetarian2Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (bangdongVegetarian2Arbitrarily.value > 0) {
    if (row.Main !== '') {
      row.Main += ','
    }
    row.Main +=
      '任意搭配' +
      'x' +
      parseInt(bangdongVegetarian2Arbitrarily.value).toString()
    const input = {
      id: 'bangdongVegetarian2Arbitrarily',
      value: bangdongVegetarian2Arbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = bangdongVegetarian2Name.value + totalQuantity + '份'
  checkVegetable(row)
  // 將這個 row 推進 tableRows 中
  tableRows.push(row)
  showbangdongVegetarian2.value = false
  bangdongVegetarian2Arbitrarily.value = 0
}
// ---------------------------------------------------
const ResetbangdongVegetarian2 = () => {
  bangdongVegetarian2Mains.forEach((bangdongVegetarian2Main) => {
    bangdongVegetarian2Main.quantity = 0
  })
  bangdongVegetarian2Drinks.forEach((bangdongVegetarian2Drink) => {
    bangdongVegetarian2Drink.quantity = 0
  })
  bangdongVegetarian2SideDishes.forEach((bangdongVegetarian2SideDish) => {
    bangdongVegetarian2SideDish.quantity = 0
  })
  bangdongVegetarian2BentoMains.forEach((bangdongVegetarian2BentoMain) => {
    bangdongVegetarian2BentoMain.quantity = 0
  })
  bangdongVegetarian1TotalQuantity.value = 0
  bangdongVegetarian1Arbitrarily.value = 0
  showbangdongVegetarian2.value = false
}
// 修改欄位
const bangdongVegetarian2EditMains = reactive([])
const bangdongVegetarian2EditDrinks = reactive([])
const bangdongVegetarian2EditSideDishes = reactive([])
const bangdongVegetarian2EditBentoMains = reactive([])
const loadBangdongVegetarian2Edit = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1067')
    const productOptions = response.data.product_options

    // 主餐
    const mainMeal = productOptions.main_meal
    const values = mainMeal.product_option_values

    for (const value of values) {
      const bangdongVegetarian2EditMain = {
        id: value.id,
        name: value.name,
        quantity: 0,
        hidenquantity: 0,
        shortname: value.short_name
      }
      bangdongVegetarian2EditMains.push(bangdongVegetarian2EditMain)
    }
    // 飲料
    const Drink = productOptions.drink
    const DrinkValues = Drink.product_option_values
    for (const DrinkValue of DrinkValues) {
      const bangdongVegetarian2EditDrink = {
        id: DrinkValue.id,
        name: DrinkValue.name,
        quantity: 0,
        hidenquantity: 0,
        price: DrinkValue.price
      }
      bangdongVegetarian2EditDrinks.push(bangdongVegetarian2EditDrink)
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values
    for (const sideDishValue of sideDishValues) {
      const bangdongVegetarian2EditSideDish = {
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        hidenquantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      }
      bangdongVegetarian2EditSideDishes.push(bangdongVegetarian2EditSideDish)
    }
    // 副主餐
    const bentoMain = productOptions.bento_main
    const bentoMainValues = bentoMain.product_option_values
    for (const bentoMainValue of bentoMainValues) {
      const bangdongVegetarian2EditBentoMain = {
        id: bentoMainValue.id,
        name: bentoMainValue.name,
        quantity: 0,
        is_default: bentoMainValue.is_default,
        hidenquantity: 0
      }
      bangdongVegetarian2EditBentoMains.push(bangdongVegetarian2EditBentoMain)
    }
    bangdongVegetarian2MainName.value = mainMeal.name
    bangdongVegetarian2DrinkName.value = Drink.name
    bangdongVegetarian2SideDishName.value = sideDish.name
    bangdongVegetarian2BentoMainName.value = bentoMain.name
    bangdongVegetarian2Price.value = parseInt(response.data.price)
    // 監聽主餐的數量變化
    bangdongVegetarian2EditMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            // 配菜的數量跟著主餐的數量變化
            bangdongVegetarian1EditSideDishes.forEach((sideDish) => {
              const diff = Number(newVal) - Number(oldVal)
              if (sideDish.is_default) {
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
          // 副主餐的數量跟著主餐的數量變化
          bangdongVegetarian2EditBentoMains.forEach((bentoMain) => {
            const diff = Number(newVal) - Number(oldVal)
            if (bentoMain.is_default) {
              const newQuantity = Number(bentoMain.quantity) + diff
              // 確保副主餐數量不會變成負數
              bentoMain.quantity = newQuantity >= 0 ? newQuantity : 0
            }
          })
        }
      )
    })
    bangdongVegetarian2EditDrinks.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdongVegetarian2EditSideDishes.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdongVegetarian2EditBentoMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
  } catch (error) {
    console.error(error)
  }
}

// ---------------------------------------------------------
// 經濟盒餐
const lunchBox1Mains = reactive([])
const lunchBox1SideDishes = reactive([])
// const lunchBox1SideDishName = ref('')
// const lunchBox1DrinkName = ref('')
const lunchBox1MainName = ref('')
const lunchBox1Name = ref('')
const lunchBox1Price = ref(0)
const lunchBox1ProductId = ref('')
const lunchBox1MainMealId = ref('')
// const lunchBox1DrinkId = ref('')
// const lunchBox1SideDishId = ref('')
const loadLunchBox1 = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1597')
    const productOptions = response.data.product_options

    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values

    // 飲料
    for (const mainMealValue of mainMealValues) {
      const main = {
        id: mainMealValue.id,
        name: mainMealValue.name,
        shortname: mainMealValue.short_name,
        quantity: 0
      }
      lunchBox1Mains.push(main)
    }
    // 配菜
    // 監聽主餐的數量變化
    // lunchBox1Mains.forEach((main) => {
    //   watch(
    //     () => main.quantity,
    //     (newVal, oldVal) => {
    //       if (newVal === "") {
    //         main.quantity = 0;
    //       }
    //       if (newVal !== oldVal) {
    //         const diff = Number(newVal) - Number(oldVal);
    //         lunchBox1SideDishes.forEach((sideDish) => {
    //           if (sideDish.is_default) {
    //             const newQuantity = Number(sideDish.quantity) + diff;
    //             sideDish.quantity = newQuantity > 0 ? newQuantity : 0;
    //           }
    //         });
    //       }
    //     }
    //   );
    //   main.drinks.forEach((drink) => {
    //     watch(
    //       () => drink.quantity,
    //       (newVal, oldVal) => {
    //         if (newVal === "" || newVal === null) {
    //           drink.quantity = 0;
    //         }
    //       }
    //     );
    //   });
    // });
    // lunchBox1SideDishes.forEach((main) => {
    //   watch(
    //     () => main.quantity,
    //     (newVal, oldVal) => {
    //       if (newVal === "") {
    //         main.quantity = 0;
    //       }
    //     }
    //   );
    // });
    lunchBox1Name.value = response.data.name
    lunchBox1MainName.value = mainMeal.name
    // lunchBox1DrinkName.value = drink.name;
    // lunchBox1SideDishName.value = sideDish.name;
    lunchBox1Price.value = parseInt(response.data.price)
    lunchBox1ProductId.value = response.data.id
    lunchBox1MainMealId.value = mainMeal.id
    // lunchBox1DrinkId.value = drink.id;
    // lunchBox1SideDishId.value = sideDish.id;
  } catch (error) {
    console.error(error)
  }
}

// 計算任配
watch(lunchBox1Mains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  lunchBox1Arbitrarily.value = Math.max(
    0,
    parseInt(lunchBox1TotalQuantity.value) - mainQuantityTotal
  )
})

// 計算總價格
const lunchBox1TotalQuantityPrice = computed(() => {
  const totalPrice = lunchBox1TotalQuantity.value * lunchBox1Price.value
  return totalPrice
})
const lunchBox1optionPrice = computed(() => {
  let totalPrice = 0
  lunchBox1SideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
const lunchbox1finalTotal = computed(() => {
  const totalPrice =
    lunchBox1TotalQuantityPrice.value + lunchBox1optionPrice.value
  return totalPrice
})
const submitLunchbox1 = () => {
  if (lunchBox1TotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  let totalMainQuantity = 0
  // let totalDrinkQuantity = 0;

  for (const option of lunchBox1Mains) {
    if (option.quantity > 0) {
      totalMainQuantity += parseInt(option.quantity)
    }
    //   for (const drink of option.drinks) {
    //     if (drink.quantity > 0) {
    //       totalDrinkQuantity += parseInt(drink.quantity);
    //     }
    //   }
  }
  // 分享餐
  if (totalMainQuantity / lunchBox1TotalQuantity.value !== 6) {
    alert('主餐數量有誤！')
    return
  }
  // ------------------------------------------------------------------
  const nextId =
    tableRows.length > 0 ? tableRows[tableRows.length - 1].id + 1 : 1
  const row = {
    bentoType: 5,
    id: nextId,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: '',
    price: lunchbox1finalTotal.value,
    optionPrice: lunchBox1optionPrice.value,
    totalPrice: lunchBox1TotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: lunchbox1Comment.value
  }

  const totalQuantity = lunchBox1TotalQuantity.value
  row.quantity = totalQuantity
  for (const option of lunchBox1Mains) {
    if (option.quantity > 0 && option.name !== '虛擬潤餅 3 吋') {
      const Main = option.name + 'x' + parseInt(option.quantity)
      // let drinkInfo = "";
      // for (const drink of option.drinks) {
      //   if (drink.quantity > 0) {
      //     drinkInfo += drink.name + "x" + parseInt(drink.quantity);
      //     // 保留飲料名稱、飲料 ID
      //     const productInput = {
      //       mainId: option.id,
      //       productTypeName: lunchBox1DrinkName.value,
      //       productTypeId: lunchBox1DrinkId.value,
      //       productType: "options_with_qty",
      //       type: 2,
      //     };
      //     row.productInputs.push(productInput);
      //     // 將帶有數值的 input 推進 inputs
      //     const input = {
      //       id: drink.id,
      //       mainId: option.id,
      //       name: drink.name,
      //       value: parseInt(drink.quantity),
      //       type: 2,
      //     };
      //     row.inputs.push(input);
      //     drink.quantity = 0;
      //   }
      // }
      // if (drinkInfo !== "") {
      //   Main += ` (${drinkInfo}<br>`;
      // }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBox1MainMealId.value,
        productTypeName: lunchBox1MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    } else if (option.name === '虛擬潤餅 3 吋') {
      const Main = option.name + 'x' + parseInt(option.quantity)
      // let Main = " ";
      // if (option.quantity !== 0) {
      //   Main = option.name + "x" + parseInt(option.quantity);
      // }
      // let drinkInfo = "";
      // for (const drink of option.drinks) {
      //   if (drink.quantity > 0) {
      //     drinkInfo += drink.name + "x" + parseInt(drink.quantity);
      //     // 保留飲料名稱、飲料 ID
      //     const productInput = {
      //       mainId: option.id,
      //       productTypeName: lunchBox1DrinkName.value,
      //       productTypeId: lunchBox1DrinkId.value,
      //       productType: "options_with_qty",
      //       type: 2,
      //     };
      //     row.productInputs.push(productInput);
      //     // 將帶有數值的 input 推進 inputs
      //     const input = {
      //       id: drink.id,
      //       mainId: option.id,
      //       name: drink.name,
      //       value: parseInt(drink.quantity),
      //       type: 2,
      //     };
      //     row.inputs.push(input);
      //     drink.quantity = 0;
      //   }
      // }
      // if (drinkInfo !== "") {
      //   Main += ` (${drinkInfo}<br>`;
      // }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBox1MainMealId.value,
        productTypeName: lunchBox1MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    }
  }

  // 推進配菜
  // for (const sideDish of lunchBox1SideDishes) {
  //   if (sideDish.quantity > 0) {
  //     row.sideDishes +=
  //       sideDish.name + "x" + parseInt(sideDish.quantity) + "<br>";
  //     // 保留配菜名稱、配菜 ID
  //     const productInput = {
  //       productTypeName: lunchBox1SideDishName.value,
  //       productTypeId: lunchBox1SideDishId.value,
  //       productType: "options_with_qty",
  //       type: 3,
  //     };
  //     row.productInputs.push(productInput);
  //     // 將帶有數值的 input 推進 inputs
  //     const input = {
  //       id: sideDish.id,
  //       name: sideDish.name,
  //       value: parseInt(sideDish.quantity),
  //       is_default: sideDish.is_default,
  //       type: 3,
  //     };
  //     row.inputs.push(input);
  //     sideDish.quantity = 0;
  //   }
  // }
  // 保留 經濟盒餐、1005、數量
  const productInput = {
    id: lunchBox1ProductId.value,
    name: lunchBox1Name.value,
    value: parseInt(totalQuantity),
    price: lunchBox1Price.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: lunchbox1Comment.value
  }
  row.productInputs.push(productInput)

  // 保留任搭數量
  if (lunchBox1Arbitrarily.value > 0) {
    row.Main +=
      '任意搭配' + 'x' + parseInt(lunchBox1Arbitrarily.value).toString()
    const input = {
      id: 'lunchBox1Arbitrarily',
      value: lunchBox1Arbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = lunchBox1Name.value + totalQuantity + '份'
  checkVegetable(row)
  if (row.Main !== '' || row.sideDishes !== '') {
    // 如果 row.Main 或 row.sideDishes 不是空的，則添加到 tableRows
    tableRows.push(row)
    meal.tableRows2.push(row)
    showlunchBox1.value = false
    lunchBox1Arbitrarily.value = 0
  }
}
// ---reset------------------------------
const Resetlunchbox1 = () => {
  for (const option of lunchBox1Mains) {
    option.quantity = 0
    // for (const drink of option.drinks) {
    //   drink.quantity = 0;
    // }
  }
  // for (const sideDish of lunchBox1SideDishes) {
  //   sideDish.quantity = 0;
  // }
  showlunchBox1.value = false
  lunchBox1Arbitrarily.value = 0
  lunchBox1TotalQuantity.value = 0
}
// editDialog5 導入欄位
const lunchBox1EditMains = reactive([])
const lunchBox1EditSideDishes = reactive([])
// const lunchBox1EditSideDishName = ref('')
// const lunchBox1EditDrinkName = ref('')
const lunchBox1EditMainName = ref('')
const lunchBox1EditName = ref('')

const loadLunchBox1Edit = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1597')
    const productOptions = response.data.product_options

    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values

    /// / 飲料
    // const drink = productOptions.drink;
    // const drinkValues = drink.product_option_values;

    for (const mainMealValue of mainMealValues) {
      const main = {
        id: mainMealValue.id,
        name: mainMealValue.name,
        shortname: mainMealValue.short_name,
        quantity: 0
      }

      // main.drinks = drinkValues.map((drinkValue) => ({
      //   id: drinkValue.id,
      //   name: drinkValue.name,
      //   quantity: 0,
      // }));

      lunchBox1EditMains.push(main)
    }
    // 配菜
    // const sideDish = productOptions.side_dish;
    // const sideDishValues = sideDish.product_option_values;

    // for (const sideDishValue of sideDishValues) {
    //   lunchBox1EditSideDishes.push({
    //     id: sideDishValue.id,
    //     name: sideDishValue.name,
    //     quantity: 0,
    //     is_default: sideDishValue.is_default,
    //     price: sideDishValue.price,
    //   });
    // }
    lunchBox1EditName.value = response.data.name
    lunchBox1EditMainName.value = mainMeal.name
    // lunchBox1EditDrinkName.value = drink.name;
    // lunchBox1EditSideDishName.value = sideDish.name;
    // 監聽主餐的數量變化
    // lunchBox1EditMains.forEach((main) => {
    //   watch(
    //     () => main.quantity,
    //     (newVal, oldVal) => {
    //       if (newVal === "") {
    //         main.quantity = 0;
    //       }
    //       if (newVal !== oldVal) {
    //         lunchBox1EditSideDishes.forEach((sideDish) => {
    //           if (sideDish.is_default === 1) {
    //             const diff = Number(newVal) - Number(oldVal);
    //             const newQuantity = Number(sideDish.quantity) + diff;
    //             sideDish.quantity = newQuantity > 0 ? newQuantity : 0;
    //           }
    //         });
    //       }
    //     }
    //   );
    //   main.drinks.forEach((drink) => {
    //     watch(
    //       () => drink.quantity,
    //       (newVal, oldVal) => {
    //         if (newVal === "" || newVal === null) {
    //           drink.quantity = 0;
    //         }
    //       }
    //     );
    //   });
    // });
    // lunchBox1EditSideDishes.forEach((main) => {
    //   watch(
    //     () => main.quantity,
    //     (newVal, oldVal) => {
    //       if (newVal === "") {
    //         main.quantity = 0;
    //       }
    //     }
    //   );
    // });
  } catch (error) {
    console.error(error)
  }
}

// 會議盒餐
const lunchBox2Mains = reactive([])
const lunchBox2SideDishes = reactive([])
const lunchBox2SideDishName = ref('')
const lunchBox2DrinkName = ref('')
const lunchBox2MainName = ref('')
const lunchBox2Name = ref('')
const lunchBox2Price = ref(0)
const lunchBox2MainMealId = ref('')
const lunchBox2ProductId = ref('')
const lunchBox2DrinkId = ref('')
const lunchBox2SideDishId = ref('')

const loadLunchBox2 = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1006')
    const productOptions = response.data.product_options

    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values

    // 飲料
    const drink = productOptions.drink
    const drinkValues = drink.product_option_values

    for (const mainMealValue of mainMealValues) {
      const main = {
        id: mainMealValue.id,
        name: mainMealValue.name,
        shortname: mainMealValue.short_name,
        quantity: 0
      }

      main.drinks = drinkValues.map((drinkValue) => ({
        id: drinkValue.id,
        name: drinkValue.name,
        quantity: 0
      }))

      lunchBox2Mains.push(main)
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values

    for (const sideDishValue of sideDishValues) {
      lunchBox2SideDishes.push({
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      })
    }
    // 監聽主餐的數量變化
    lunchBox2Mains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            const diff = Number(newVal) - Number(oldVal)

            lunchBox2SideDishes.forEach((sideDish) => {
              if (sideDish.is_default) {
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
        }
      )
      main.drinks.forEach((drink) => {
        watch(
          () => drink.quantity,
          (newVal, oldVal) => {
            if (newVal === '' || newVal === null) {
              drink.quantity = 0
            }
          }
        )
      })
    })
    lunchBox2SideDishes.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    lunchBox2Name.value = response.data.name
    lunchBox2MainName.value = mainMeal.name
    lunchBox2DrinkName.value = drink.name
    lunchBox2SideDishName.value = sideDish.name
    lunchBox2Price.value = parseInt(response.data.price)
    lunchBox2MainMealId.value = mainMeal.id
    lunchBox2ProductId.value = response.data.id
    lunchBox2DrinkId.value = drink.id
    lunchBox2SideDishId.value = sideDish.id
  } catch (error) {
    console.error(error)
  }
}

// 計算任佩
watch(lunchBox2Mains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  lunchBox2Arbitrarily.value = Math.max(
    0,
    parseInt(lunchBox2TotalQuantity.value) - mainQuantityTotal
  )
})

// 計算總價格
const lunchBox2TotalQuantityPrice = computed(() => {
  const totalPrice = lunchBox2TotalQuantity.value * lunchBox2Price.value
  return totalPrice
})
const lunchBox2optionPrice = computed(() => {
  let totalPrice = 0
  lunchBox2SideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
const lunchbox2finalTotal = computed(() => {
  const totalPrice =
    lunchBox2TotalQuantityPrice.value + lunchBox2optionPrice.value
  return totalPrice
})
const submitLunchbox2 = () => {
  if (lunchBox2TotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  let totalMainQuantity = 0
  let totalDrinkQuantity = 0

  for (const option of lunchBox2Mains) {
    if (option.quantity > 0) {
      totalMainQuantity += parseInt(option.quantity)
    }
    for (const drink of option.drinks) {
      if (drink.quantity > 0) {
        totalDrinkQuantity += parseInt(drink.quantity)
      }
    }
  }
  if (
    totalMainQuantity !== lunchBox2TotalQuantity.value ||
    totalDrinkQuantity !== lunchBox2TotalQuantity.value
  ) {
    alert('主餐、飲料和總套數必須相等！')
    return
  }
  // ------------------------------------------------------------------
  const nextId =
    tableRows.length > 0 ? tableRows[tableRows.length - 1].id + 1 : 1
  const row = {
    bentoType: 6,
    id: nextId,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: '',
    price: lunchbox2finalTotal.value,
    optionPrice: lunchBox2optionPrice.value,
    totalPrice: lunchBox2TotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: lunchbox2Comment.value
  }
  const totalQuantity = lunchBox2TotalQuantity.value
  row.quantity = totalQuantity
  for (const option of lunchBox2Mains) {
    if (option.quantity > 0 && option.name !== '虛擬潤餅 3 吋') {
      let Main = option.name + 'x' + parseInt(option.quantity)
      let drinkInfo = ''
      for (const drink of option.drinks) {
        if (drink.quantity > 0) {
          drinkInfo += drink.name + 'x' + parseInt(drink.quantity)
          // 保留飲料名稱、飲料 ID
          const productInput = {
            mainId: option.id,
            productTypeName: lunchBox2DrinkName.value,
            productTypeId: lunchBox2DrinkId.value,
            productType: 'options_with_qty',
            type: 2
          }
          row.productInputs.push(productInput)
          // 將帶有數值的 input 推進 inputs
          const input = {
            id: drink.id,
            mainId: option.id,
            name: drink.name,
            value: parseInt(drink.quantity),
            type: 2
          }
          row.inputs.push(input)
          drink.quantity = 0
        }
      }
      if (drinkInfo !== '') {
        Main += ` (${drinkInfo}<br>`
      }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBox2MainMealId.value,
        productTypeName: lunchBox2MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    } else if (option.name === '虛擬潤餅 3 吋') {
      let Main = ''
      if (option.quantity !== 0) {
        Main = option.name + 'x' + parseInt(option.quantity)
      }
      let drinkInfo = ''
      for (const drink of option.drinks) {
        if (drink.quantity > 0) {
          drinkInfo += drink.name + 'x' + parseInt(drink.quantity)
          // 保留飲料名稱、飲料 ID
          const productInput = {
            mainId: option.id,
            productTypeName: lunchBox2DrinkName.value,
            productTypeId: lunchBox2DrinkId.value,
            productType: 'options_with_qty',
            type: 2
          }
          row.productInputs.push(productInput)
          // 將帶有數值的 input 推進 inputs
          const input = {
            id: drink.id,
            mainId: option.id,
            name: drink.name,
            value: parseInt(drink.quantity),
            type: 2
          }
          row.inputs.push(input)
          drink.quantity = 0
        }
      }
      if (drinkInfo !== '') {
        Main += ` (${drinkInfo}<br>`
      }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBox2MainMealId.value,
        productTypeName: lunchBox2MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    }
  }

  // 推進配菜
  for (const sideDish of lunchBox2SideDishes) {
    if (sideDish.quantity > 0) {
      row.sideDishes +=
        sideDish.name + 'x' + parseInt(sideDish.quantity) + '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: lunchBox2SideDishName.value,
        productTypeId: lunchBox2SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: sideDish.id,
        name: sideDish.name,
        value: parseInt(sideDish.quantity),
        is_default: sideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
      sideDish.quantity = 0
    }
  }
  // 保留 會議盒餐、1005、數量
  const productInput = {
    id: lunchBox2ProductId.value,
    name: lunchBox2Name.value,
    value: parseInt(totalQuantity),
    price: lunchBox2Price.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: lunchbox2Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (lunchBox2Arbitrarily.value > 0) {
    if (row.Main !== '') {
      row.Main += ','
    }
    row.Main +=
      '任意搭配' + 'x' + parseInt(lunchBox2Arbitrarily.value).toString()
    const input = {
      id: 'lunchBox2Arbitrarily',
      value: lunchBox2Arbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = lunchBox2Name.value + totalQuantity + '份'
  checkVegetable(row)
  if (row.Main !== '' || row.sideDishes !== '') {
    // 如果 row.Main 或 row.sideDishes 不是空的，則添加到 tableRows
    tableRows.push(row)
    showlunchBox2.value = false
    lunchBox2Arbitrarily.value = 0
  }
}
// ----------------------------------------
const Resetlunchbox2 = () => {
  for (const option of lunchBox2Mains) {
    option.quantity = 0
    for (const drink of option.drinks) {
      drink.quantity = 0
    }
  }
  for (const sideDish of lunchBox2SideDishes) {
    sideDish.quantity = 0
  }
  lunchBox2TotalQuantity.value = 0
  lunchBox2Arbitrarily.value = 0
  showlunchBox2.value = false
}
// editDialog6 導入欄位
const lunchBox2EditMains = reactive([])
const lunchBox2EditSideDishes = reactive([])
const lunchBox2EditSideDishName = ref('')
const lunchBox2EditDrinkName = ref('')
const lunchBox2EditMainName = ref('')
const lunchBox2EditName = ref('')

const loadLunchBox2Edit = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1006')
    const productOptions = response.data.product_options

    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values

    // 飲料
    const drink = productOptions.drink
    const drinkValues = drink.product_option_values

    for (const mainMealValue of mainMealValues) {
      const main = {
        id: mainMealValue.id,
        name: mainMealValue.name,
        quantity: 0,
        shortname: mainMealValue.short_name
      }

      main.drinks = drinkValues.map((drinkValue) => ({
        id: drinkValue.id,
        name: drinkValue.name,
        quantity: 0
      }))

      lunchBox2EditMains.push(main)
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values

    for (const sideDishValue of sideDishValues) {
      lunchBox2EditSideDishes.push({
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      })
    }
    lunchBox2EditName.value = response.data.name
    lunchBox2EditMainName.value = mainMeal.name
    lunchBox2EditDrinkName.value = drink.name
    lunchBox2EditSideDishName.value = sideDish.name
    // 監聽主餐的數量變化
    lunchBox2EditMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            lunchBox2EditSideDishes.forEach((sideDish) => {
              if (sideDish.is_default === 1) {
                const diff = Number(newVal) - Number(oldVal)
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
        }
      )
      main.drinks.forEach((drink) => {
        watch(
          () => drink.quantity,
          (newVal, oldVal) => {
            if (newVal === '' || newVal === null) {
              drink.quantity = 0
            }
          }
        )
      })
    })
    lunchBox2EditSideDishes.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
  } catch (error) {
    console.error(error)
  }
}

// 貴賓盒餐
const lunchBox3Mains = reactive([])
const lunchBox3SideDishes = reactive([])
const lunchBox3SideDishName = ref('')
const lunchBox3DrinkName = ref('')
const lunchBox3MainName = ref('')
const lunchBox3Name = ref('')
const lunchBox3Price = ref(0)
const lunchBox3ProductId = ref('')
const lunchBox3MainMealId = ref('')
const lunchBox3DrinkId = ref('')
const lunchBox3SideDishId = ref('')

const loadLunchBox3 = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1007')
    const productOptions = response.data.product_options

    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values

    // 飲料
    const drink = productOptions.drink
    const drinkValues = drink.product_option_values

    for (const mainMealValue of mainMealValues) {
      const main = {
        id: mainMealValue.id,
        name: mainMealValue.name,
        quantity: 0,
        shortname: mainMealValue.short_name
      }

      main.drinks = drinkValues.map((drinkValue) => ({
        id: drinkValue.id,
        name: drinkValue.name,
        quantity: 0
      }))

      lunchBox3Mains.push(main)
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values

    for (const sideDishValue of sideDishValues) {
      lunchBox3SideDishes.push({
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      })
    }
    // 監聽主餐的數量變化
    lunchBox3Mains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            const diff = Number(newVal) - Number(oldVal)
            lunchBox3SideDishes.forEach((sideDish) => {
              if (sideDish.is_default) {
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
        }
      )
      main.drinks.forEach((drink) => {
        watch(
          () => drink.quantity,
          (newVal, oldVal) => {
            if (newVal === '' || newVal === null) {
              drink.quantity = 0
            }
          }
        )
      })
    })
    lunchBox3SideDishes.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    lunchBox3Name.value = response.data.name
    lunchBox3MainName.value = mainMeal.name
    lunchBox3DrinkName.value = drink.name
    lunchBox3SideDishName.value = sideDish.name
    lunchBox3Price.value = parseInt(response.data.price)
    lunchBox3ProductId.value = response.data.id
    lunchBox3MainMealId.value = mainMeal.id
    lunchBox3DrinkId.value = drink.id
    lunchBox3SideDishId.value = sideDish.id
  } catch (error) {
    console.error(error)
  }
}

// 計算總數量
watch(lunchBox3Mains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  lunchBox3Arbitrarily.value = Math.max(
    0,
    parseInt(lunchBox3TotalQuantity.value) - mainQuantityTotal
  )
})

// 計算總價格
const lunchBox3TotalQuantityPrice = computed(() => {
  const totalPrice = lunchBox3TotalQuantity.value * lunchBox3Price.value
  return totalPrice
})
const lunchBox3optionPrice = computed(() => {
  let totalPrice = 0
  lunchBox3SideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
const lunchbox3finalTotal = computed(() => {
  const totalPrice =
    lunchBox3TotalQuantityPrice.value + lunchBox3optionPrice.value
  return totalPrice
})
const submitLunchbox3 = () => {
  if (lunchBox3TotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  let totalMainQuantity = 0
  let totalDrinkQuantity = 0

  for (const option of lunchBox3Mains) {
    if (option.quantity > 0) {
      totalMainQuantity += parseInt(option.quantity)
    }
    for (const drink of option.drinks) {
      if (drink.quantity > 0) {
        totalDrinkQuantity += parseInt(drink.quantity)
      }
    }
  }
  if (
    totalMainQuantity !== lunchBox3TotalQuantity.value ||
    totalDrinkQuantity !== lunchBox3TotalQuantity.value
  ) {
    alert('主餐、飲料和總套數必須相等！')
    return
  }
  // ------------------------------------------------------------------
  const nextId =
    tableRows.length > 0 ? tableRows[tableRows.length - 1].id + 1 : 1
  const row = {
    bentoType: 7,
    id: nextId,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    quantity: '',
    sideDishDefault: '',
    price: lunchbox3finalTotal.value,
    optionPrice: lunchBox3optionPrice.value,
    totalPrice: lunchBox3TotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: lunchbox3Comment.value
  }
  const totalQuantity = lunchBox3TotalQuantity.value
  row.quantity = totalQuantity
  for (const option of lunchBox3Mains) {
    if (option.quantity > 0 && option.name !== '虛擬潤餅 3 吋') {
      let Main = option.name + 'x' + parseInt(option.quantity)
      let drinkInfo = ''
      for (const drink of option.drinks) {
        if (drink.quantity > 0) {
          drinkInfo += drink.name + 'x' + parseInt(drink.quantity)
          // 保留飲料名稱、飲料 ID
          const productInput = {
            mainId: option.id,
            productTypeName: lunchBox3DrinkName.value,
            productTypeId: lunchBox3DrinkId.value,
            productType: 'options_with_qty',
            type: 2
          }
          row.productInputs.push(productInput)
          // 將帶有數值的 input 推進 inputs
          const input = {
            id: drink.id,
            mainId: option.id,
            name: drink.name,
            value: parseInt(drink.quantity),
            type: 2
          }
          row.inputs.push(input)
          drink.quantity = 0
        }
      }
      if (drinkInfo !== '') {
        Main += ` (${drinkInfo}<br>`
      }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBox3MainMealId.value,
        productTypeName: lunchBox3MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    } else if (option.name === '虛擬潤餅 3 吋') {
      let Main = ''
      if (option.quantity !== 0) {
        Main = option.name + 'x' + parseInt(option.quantity)
      }
      let drinkInfo = ''
      for (const drink of option.drinks) {
        if (drink.quantity > 0) {
          drinkInfo += drink.name + 'x' + parseInt(drink.quantity)
          // 保留飲料名稱、飲料 ID
          const productInput = {
            mainId: option.id,
            productTypeName: lunchBox3DrinkName.value,
            productTypeId: lunchBox3DrinkId.value,
            productType: 'options_with_qty',
            type: 2
          }
          row.productInputs.push(productInput)
          // 將帶有數值的 input 推進 inputs
          const input = {
            id: drink.id,
            mainId: option.id,
            name: drink.name,
            value: parseInt(drink.quantity),
            type: 2
          }
          row.inputs.push(input)
          drink.quantity = 0
        }
      }
      if (drinkInfo !== '') {
        Main += ` (${drinkInfo}<br>`
      }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBox3MainMealId.value,
        productTypeName: lunchBox3MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    }
  }

  // 推進配菜
  for (const sideDish of lunchBox3SideDishes) {
    if (sideDish.quantity > 0) {
      row.sideDishes +=
        sideDish.name + 'x' + parseInt(sideDish.quantity) + '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: lunchBox3SideDishName.value,
        productTypeId: lunchBox3SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: sideDish.id,
        name: sideDish.name,
        value: parseInt(sideDish.quantity),
        is_default: sideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
      sideDish.quantity = 0
    }
  }
  // 保留 貴賓盒餐、1007、數量
  const productInput = {
    id: lunchBox3ProductId.value,
    name: lunchBox3Name.value,
    value: parseInt(totalQuantity),
    price: lunchBox3Price.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: lunchbox3Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (lunchBox3Arbitrarily.value > 0) {
    row.Main +=
      '任意搭配' + 'x' + parseInt(lunchBox3Arbitrarily.value).toString()
    const input = {
      id: 'lunchBox3Arbitrarily',
      value: lunchBox3Arbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = lunchBox3Name.value + totalQuantity + '份'
  checkVegetable(row)
  if (row.Main !== '' || row.sideDishes !== '') {
    // 如果 row.Main 或 row.sideDishes 不是空的，則添加到 tableRows
    tableRows.push(row)
    showlunchBox3.value = false
    lunchBox3Arbitrarily.value = 0
  }
}
// reset-----------------------------------------
const Resetlunchbox3 = () => {
  for (const option of lunchBox3Mains) {
    option.quantity = 0
    for (const drink of option.drinks) {
      drink.quantity = 0
    }
  }
  for (const sideDish of lunchBox3SideDishes) {
    sideDish.quantity = 0
  }
  lunchBox3TotalQuantity.value = 0
  lunchBox3Arbitrarily.value = 0
  showlunchBox3.value = false
}
// editDialog7 導入欄位
const lunchBox3EditMains = reactive([])
const lunchBox3EditSideDishes = reactive([])
const lunchBox3EditSideDishName = ref('')
const lunchBox3EditDrinkName = ref('')
const lunchBox3EditMainName = ref('')
const lunchBox3EditName = ref('')

const loadLunchBox3Edit = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1007')
    const productOptions = response.data.product_options

    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values

    // 飲料
    const drink = productOptions.drink
    const drinkValues = drink.product_option_values

    for (const mainMealValue of mainMealValues) {
      const main = {
        id: mainMealValue.id,
        name: mainMealValue.name,
        quantity: 0,
        shortname: mainMealValue.short_name
      }

      main.drinks = drinkValues.map((drinkValue) => ({
        id: drinkValue.id,
        name: drinkValue.name,
        quantity: 0
      }))

      lunchBox3EditMains.push(main)
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values

    for (const sideDishValue of sideDishValues) {
      lunchBox3EditSideDishes.push({
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      })
    }
    lunchBox3EditName.value = response.data.name
    lunchBox3EditMainName.value = mainMeal.name
    lunchBox3EditDrinkName.value = drink.name
    lunchBox3EditSideDishName.value = sideDish.name
    lunchBox3EditMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            lunchBox3EditSideDishes.forEach((sideDish) => {
              if (sideDish.is_default === 1) {
                const diff = Number(newVal) - Number(oldVal)
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
        }
      )
      main.drinks.forEach((drink) => {
        watch(
          () => drink.quantity,
          (newVal, oldVal) => {
            if (newVal === '' || newVal === null) {
              drink.quantity = 0
            }
          }
        )
      })
    })
  } catch (error) {
    console.error(error)
  }
}

// 首席盒餐
const lunchBox4Mains = reactive([])
const lunchBox4SideDishes = reactive([])
const lunchBox4SideDishName = ref('')
const lunchBox4DrinkName = ref('')
const lunchBox4MainName = ref('')
const lunchBox4Name = ref('')
const lunchBox4Price = ref(0)
const lunchBox4ProductId = ref('')
const lunchBox4MainMealId = ref('')
const lunchBox4DrinkId = ref('')
const lunchBox4SideDishId = ref('')

const loadLunchBox4 = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1008')
    const productOptions = response.data.product_options

    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values

    // 飲料
    const drink = productOptions.drink
    const drinkValues = drink.product_option_values

    for (const mainMealValue of mainMealValues) {
      const main = {
        id: mainMealValue.id,
        name: mainMealValue.name,
        quantity: 0,
        shortname: mainMealValue.short_name
      }

      main.drinks = drinkValues.map((drinkValue) => ({
        id: drinkValue.id,
        name: drinkValue.name,
        quantity: 0
      }))

      lunchBox4Mains.push(main)
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values

    for (const sideDishValue of sideDishValues) {
      lunchBox4SideDishes.push({
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      })
    }
    // 監聽主餐的數量變化
    lunchBox4Mains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            const diff = Number(newVal) - Number(oldVal)
            lunchBox4SideDishes.forEach((sideDish) => {
              if (sideDish.is_default) {
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
        }
      )
      main.drinks.forEach((drink) => {
        watch(
          () => drink.quantity,
          (newVal, oldVal) => {
            if (newVal === '' || newVal === null) {
              drink.quantity = 0
            }
          }
        )
      })
    })
    lunchBox4SideDishes.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    lunchBox4Name.value = response.data.name
    lunchBox4MainName.value = mainMeal.name
    lunchBox4DrinkName.value = drink.name
    lunchBox4SideDishName.value = sideDish.name
    lunchBox4Price.value = parseInt(response.data.price)
    lunchBox4ProductId.value = response.data.id
    lunchBox4MainMealId.value = mainMeal.id
    lunchBox4DrinkId.value = drink.id
    lunchBox4SideDishId.value = sideDish.id
  } catch (error) {
    console.error(error)
  }
}

// 計算總數量
watch(lunchBox4Mains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  lunchBox4Arbitrarily.value = Math.max(
    0,
    parseInt(lunchBox4TotalQuantity.value) - mainQuantityTotal
  )
})

// 計算總價格
const lunchBox4TotalQuantityPrice = computed(() => {
  const totalPrice = lunchBox4TotalQuantity.value * lunchBox4Price.value

  return totalPrice
})
const lunchBox4optionPrice = computed(() => {
  let totalPrice = 0
  lunchBox4SideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
const lunchbox4finalTotal = computed(() => {
  const totalPrice =
    lunchBox4TotalQuantityPrice.value + lunchBox4optionPrice.value
  return totalPrice
})

const submitLunchbox4 = () => {
  if (lunchBox4TotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  let totalMainQuantity = 0
  let totalDrinkQuantity = 0

  for (const option of lunchBox4Mains) {
    if (option.quantity > 0) {
      totalMainQuantity += parseInt(option.quantity)
    }
    for (const drink of option.drinks) {
      if (drink.quantity > 0) {
        totalDrinkQuantity += parseInt(drink.quantity)
      }
    }
  }
  if (
    totalMainQuantity !== lunchBox4TotalQuantity.value ||
    totalDrinkQuantity !== lunchBox4TotalQuantity.value
  ) {
    alert('主餐、飲料和總套數必須相等！')
    return
  }
  // ------------------------------------------------------------------
  const nextId =
    tableRows.length > 0 ? tableRows[tableRows.length - 1].id + 1 : 1
  const row = {
    bentoType: 8,
    id: nextId,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: '',
    price: lunchbox4finalTotal.value,
    optionPrice: lunchBox4optionPrice.value,
    totalPrice: lunchBox4TotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: lunchbox4Comment.value
  }
  const totalQuantity = lunchBox4TotalQuantity.value
  row.quantity = totalQuantity
  for (const option of lunchBox4Mains) {
    if (option.quantity > 0 && option.name !== '虛擬潤餅 3 吋') {
      let Main = option.name + 'x' + parseInt(option.quantity)
      let drinkInfo = ''
      for (const drink of option.drinks) {
        if (drink.quantity > 0) {
          drinkInfo += drink.name + 'x' + parseInt(drink.quantity)
          // 保留飲料名稱、飲料 ID
          const productInput = {
            mainId: option.id,
            productTypeName: lunchBox4DrinkName.value,
            productTypeId: lunchBox4DrinkId.value,
            productType: 'options_with_qty',
            type: 2
          }
          row.productInputs.push(productInput)
          // 將帶有數值的 input 推進 inputs
          const input = {
            id: drink.id,
            mainId: option.id,
            name: drink.name,
            value: parseInt(drink.quantity),
            type: 2
          }
          row.inputs.push(input)
          drink.quantity = 0
        }
      }
      if (drinkInfo !== '') {
        Main += ` (${drinkInfo}<br>`
      }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBox4MainMealId.value,
        productTypeName: lunchBox4MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    } else if (option.name === '虛擬潤餅 3 吋') {
      let Main = ''
      if (option.quantity !== 0) {
        Main = option.name + 'x' + parseInt(option.quantity)
      }
      let drinkInfo = ''
      for (const drink of option.drinks) {
        if (drink.quantity > 0) {
          drinkInfo += drink.name + 'x' + parseInt(drink.quantity)
          // 保留飲料名稱、飲料 ID
          const productInput = {
            mainId: option.id,
            productTypeName: lunchBox4DrinkName.value,
            productTypeId: lunchBox4DrinkId.value,
            productType: 'options_with_qty',
            type: 2
          }
          row.productInputs.push(productInput)
          // 將帶有數值的 input 推進 inputs
          const input = {
            id: drink.id,
            mainId: option.id,
            name: drink.name,
            value: parseInt(drink.quantity),
            type: 2
          }
          row.inputs.push(input)
          drink.quantity = 0
        }
      }
      if (drinkInfo !== '') {
        Main += ` (${drinkInfo}<br>`
      }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBox4MainMealId.value,
        productTypeName: lunchBox4MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    }
  }

  // 推進配菜
  for (const sideDish of lunchBox4SideDishes) {
    if (sideDish.quantity > 0) {
      row.sideDishes +=
        sideDish.name + 'x' + parseInt(sideDish.quantity) + '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: lunchBox4SideDishName.value,
        productTypeId: lunchBox4SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: sideDish.id,
        name: sideDish.name,
        value: parseInt(sideDish.quantity),
        is_default: sideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
      sideDish.quantity = 0
    }
  }
  // 保留 首席盒餐、1008、數量
  const productInput = {
    id: lunchBox4ProductId.value,
    name: lunchBox4Name.value,
    value: parseInt(totalQuantity),
    price: lunchBox4Price.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: lunchbox4Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (lunchBox4Arbitrarily.value > 0) {
    if (row.Main !== '') {
      row.Main += ','
    }
    row.Main +=
      '任意搭配' + 'x' + parseInt(lunchBox4Arbitrarily.value).toString()
    const input = {
      id: 'lunchBox4Arbitrarily',
      value: lunchBox4Arbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = lunchBox4Name.value + totalQuantity + '份'
  checkVegetable(row)
  if (row.Main !== '' || row.sideDishes !== '') {
    // 如果 row.Main 或 row.sideDishes 不是空的，則添加到 tableRows
    tableRows.push(row)
    showlunchBox4.value = false
    lunchBox4Arbitrarily.value = 0
  }
}
// reset-----------------------------------------
const Resetlunchbox4 = () => {
  for (const option of lunchBox4Mains) {
    option.quantity = 0
    for (const drink of option.drinks) {
      drink.quantity = 0
    }
  }
  for (const sideDish of lunchBox4SideDishes) {
    sideDish.quantity = 0
  }
  lunchBox4TotalQuantity.value = 0
  lunchBox4Arbitrarily.value = 0
  showlunchBox4.value = false
}
// editDialog8 導入欄位
const lunchBox4EditMains = reactive([])
const lunchBox4EditSideDishes = reactive([])
const lunchBox4EditSideDishName = ref('')
const lunchBox4EditDrinkName = ref('')
const lunchBox4EditMainName = ref('')
const lunchBox4EditName = ref('')

const loadLunchBox4Edit = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1008')
    const productOptions = response.data.product_options

    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values

    // 飲料
    const drink = productOptions.drink
    const drinkValues = drink.product_option_values

    for (const mainMealValue of mainMealValues) {
      const main = {
        id: mainMealValue.id,
        name: mainMealValue.name,
        quantity: 0,
        shortname: mainMealValue.short_name
      }

      main.drinks = drinkValues.map((drinkValue) => ({
        id: drinkValue.id,
        name: drinkValue.name,
        quantity: 0
      }))

      lunchBox4EditMains.push(main)
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values

    for (const sideDishValue of sideDishValues) {
      lunchBox4EditSideDishes.push({
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      })
    }
    lunchBox4EditName.value = response.data.name
    lunchBox4EditMainName.value = mainMeal.name
    lunchBox4EditDrinkName.value = drink.name
    lunchBox4EditSideDishName.value = sideDish.name
    // 監聽主餐的數量變化
    lunchBox4EditMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            lunchBox4EditSideDishes.forEach((sideDish) => {
              if (sideDish.is_default === 1) {
                const diff = Number(newVal) - Number(oldVal)
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
        }
      )
      main.drinks.forEach((drink) => {
        watch(
          () => drink.quantity,
          (newVal, oldVal) => {
            if (newVal === '' || newVal === null) {
              drink.quantity = 0
            }
          }
        )
      })
    })
    lunchBox4EditSideDishes.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
  } catch (error) {
    console.error(error)
  }
}
// 情人盒餐
const lunchBox214Mains = reactive([])
const lunchBox214SideDishes = reactive([])
const lunchBox214SideDishName = ref('')
const lunchBox214DrinkName = ref('')
const lunchBox214MainName = ref('')
const lunchBox214Name = ref('')
const lunchBox214Price = ref(0)
const lunchBox214ProductId = ref('')
const lunchBox214MainMealId = ref('')
const lunchBox214DrinkId = ref('')
const lunchBox214SideDishId = ref('')

const loadLunchBox214 = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1650')
    const productOptions = response.data.product_options

    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values

    // 飲料
    const drink = productOptions.drink
    const drinkValues = drink.product_option_values

    for (const mainMealValue of mainMealValues) {
      const main = {
        id: mainMealValue.id,
        name: mainMealValue.name,
        quantity: 0,
        shortname: mainMealValue.short_name
      }

      main.drinks = drinkValues.map((drinkValue) => ({
        id: drinkValue.id,
        name: drinkValue.name,
        quantity: 0
      }))

      lunchBox214Mains.push(main)
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values

    for (const sideDishValue of sideDishValues) {
      lunchBox214SideDishes.push({
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      })
    }
    // 監聽主餐的數量變化
    lunchBox214Mains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            const diff = Number(newVal) - Number(oldVal)
            lunchBox214SideDishes.forEach((sideDish) => {
              if (sideDish.is_default) {
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
        }
      )
      main.drinks.forEach((drink) => {
        watch(
          () => drink.quantity,
          (newVal, oldVal) => {
            if (newVal === '' || newVal === null) {
              drink.quantity = 0
            }
          }
        )
      })
    })
    lunchBox214SideDishes.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    lunchBox214Name.value = response.data.name
    lunchBox214MainName.value = mainMeal.name
    lunchBox214DrinkName.value = drink.name
    lunchBox214SideDishName.value = sideDish.name
    lunchBox214Price.value = parseInt(response.data.price)
    lunchBox214ProductId.value = response.data.id
    lunchBox214MainMealId.value = mainMeal.id
    lunchBox214DrinkId.value = drink.id
    lunchBox214SideDishId.value = sideDish.id
  } catch (error) {
    console.error(error)
  }
}

// 計算總數量
watch(lunchBox214Mains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  lunchBox214Arbitrarily.value = Math.max(
    0,
    parseInt(lunchBox214TotalQuantity.value) - mainQuantityTotal
  )
})

// 計算總價格
const lunchBox214TotalQuantityPrice = computed(() => {
  const totalPrice = lunchBox214TotalQuantity.value * lunchBox214Price.value

  return totalPrice
})
const lunchBox214optionPrice = computed(() => {
  let totalPrice = 0
  lunchBox214SideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
const lunchbox214finalTotal = computed(() => {
  const totalPrice =
    lunchBox214TotalQuantityPrice.value + lunchBox214optionPrice.value
  return totalPrice
})

const submitLunchbox214 = () => {
  if (lunchBox214TotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  let totalMainQuantity = 0
  let totalDrinkQuantity = 0

  for (const option of lunchBox214Mains) {
    if (option.quantity > 0) {
      totalMainQuantity += parseInt(option.quantity)
    }
    for (const drink of option.drinks) {
      if (drink.quantity > 0) {
        totalDrinkQuantity += parseInt(drink.quantity)
      }
    }
  }
  if (
    totalMainQuantity !== lunchBox214TotalQuantity.value ||
    totalDrinkQuantity !== lunchBox214TotalQuantity.value
  ) {
    alert('主餐、飲料和總套數必須相等！')
    return
  }
  // ------------------------------------------------------------------
  const nextId =
    tableRows.length > 0 ? tableRows[tableRows.length - 1].id + 1 : 1
  const row = {
    bentoType: 14,
    id: nextId,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: '',
    price: lunchbox214finalTotal.value,
    optionPrice: lunchBox214optionPrice.value,
    totalPrice: lunchBox214TotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: lunchbox214Comment.value
  }
  const totalQuantity = lunchBox214TotalQuantity.value
  row.quantity = totalQuantity
  for (const option of lunchBox214Mains) {
    if (option.quantity > 0 && option.name !== '虛擬潤餅 3 吋') {
      let Main = option.name + 'x' + parseInt(option.quantity)
      let drinkInfo = ''
      for (const drink of option.drinks) {
        if (drink.quantity > 0) {
          drinkInfo += drink.name + 'x' + parseInt(drink.quantity)
          // 保留飲料名稱、飲料 ID
          const productInput = {
            mainId: option.id,
            productTypeName: lunchBox214DrinkName.value,
            productTypeId: lunchBox214DrinkId.value,
            productType: 'options_with_qty',
            type: 2
          }
          row.productInputs.push(productInput)
          // 將帶有數值的 input 推進 inputs
          const input = {
            id: drink.id,
            mainId: option.id,
            name: drink.name,
            value: parseInt(drink.quantity),
            type: 2
          }
          row.inputs.push(input)
          drink.quantity = 0
        }
      }
      if (drinkInfo !== '') {
        Main += ` (${drinkInfo}<br>`
      }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBox214MainMealId.value,
        productTypeName: lunchBox214MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    } else if (option.name === '虛擬潤餅 3 吋') {
      let Main = ''
      if (option.quantity !== 0) {
        Main = option.name + 'x' + parseInt(option.quantity)
      }
      let drinkInfo = ''
      for (const drink of option.drinks) {
        if (drink.quantity > 0) {
          drinkInfo += drink.name + 'x' + parseInt(drink.quantity)
          // 保留飲料名稱、飲料 ID
          const productInput = {
            mainId: option.id,
            productTypeName: lunchBox214DrinkName.value,
            productTypeId: lunchBox214DrinkId.value,
            productType: 'options_with_qty',
            type: 2
          }
          row.productInputs.push(productInput)
          // 將帶有數值的 input 推進 inputs
          const input = {
            id: drink.id,
            mainId: option.id,
            name: drink.name,
            value: parseInt(drink.quantity),
            type: 2
          }
          row.inputs.push(input)
          drink.quantity = 0
        }
      }
      if (drinkInfo !== '') {
        Main += ` (${drinkInfo}<br>`
      }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBox214MainMealId.value,
        productTypeName: lunchBox214MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    }
  }

  // 推進配菜
  for (const sideDish of lunchBox214SideDishes) {
    if (sideDish.quantity > 0) {
      row.sideDishes +=
        sideDish.name + 'x' + parseInt(sideDish.quantity) + '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: lunchBox214SideDishName.value,
        productTypeId: lunchBox214SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: sideDish.id,
        name: sideDish.name,
        value: parseInt(sideDish.quantity),
        is_default: sideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
      sideDish.quantity = 0
    }
  }
  // 保留 首席盒餐、1008、數量
  const productInput = {
    id: lunchBox214ProductId.value,
    name: lunchBox214Name.value,
    value: parseInt(totalQuantity),
    price: lunchBox214Price.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: lunchbox214Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (lunchBox214Arbitrarily.value > 0) {
    if (row.Main !== '') {
      row.Main += ','
    }
    row.Main +=
      '任意搭配' + 'x' + parseInt(lunchBox214Arbitrarily.value).toString()
    const input = {
      id: 'lunchBox214Arbitrarily',
      value: lunchBox214Arbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = lunchBox214Name.value + totalQuantity + '份'
  checkVegetable(row)
  if (row.Main !== '' || row.sideDishes !== '') {
    // 如果 row.Main 或 row.sideDishes 不是空的，則添加到 tableRows
    tableRows.push(row)
    console.log(row)
    showlunchBox214.value = false
    lunchBox214Arbitrarily.value = 0
  }
}
// reset-----------------------------------------
const Resetlunchbox214 = () => {
  for (const option of lunchBox214Mains) {
    option.quantity = 0
    for (const drink of option.drinks) {
      drink.quantity = 0
    }
  }
  for (const sideDish of lunchBox214SideDishes) {
    sideDish.quantity = 0
  }
  lunchBox214TotalQuantity.value = 0
  lunchBox214Arbitrarily.value = 0
  showlunchBox214.value = false
}
// editDialog214 導入欄位
const lunchBox214EditMains = reactive([])
const lunchBox214EditSideDishes = reactive([])
const lunchBox214EditSideDishName = ref('')
const lunchBox214EditDrinkName = ref('')
const lunchBox214EditMainName = ref('')
const lunchBox214EditName = ref('')

const loadLunchBox214Edit = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1650')
    const productOptions = response.data.product_options

    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values

    // 飲料
    const drink = productOptions.drink
    const drinkValues = drink.product_option_values

    for (const mainMealValue of mainMealValues) {
      const main = {
        id: mainMealValue.id,
        name: mainMealValue.name,
        quantity: 0,
        shortname: mainMealValue.short_name
      }

      main.drinks = drinkValues.map((drinkValue) => ({
        id: drinkValue.id,
        name: drinkValue.name,
        quantity: 0
      }))

      lunchBox214EditMains.push(main)
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values

    for (const sideDishValue of sideDishValues) {
      lunchBox214EditSideDishes.push({
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      })
    }
    lunchBox214EditName.value = response.data.name
    lunchBox214EditMainName.value = mainMeal.name
    lunchBox214EditDrinkName.value = drink.name
    lunchBox214EditSideDishName.value = sideDish.name
    // 監聽主餐的數量變化
    lunchBox214EditMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            lunchBox214EditSideDishes.forEach((sideDish) => {
              if (sideDish.is_default === 1) {
                const diff = Number(newVal) - Number(oldVal)
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
        }
      )
      main.drinks.forEach((drink) => {
        watch(
          () => drink.quantity,
          (newVal, oldVal) => {
            if (newVal === '' || newVal === null) {
              drink.quantity = 0
            }
          }
        )
      })
    })
    lunchBox214EditSideDishes.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
  } catch (error) {
    console.error(error)
  }
}
// ------------------------ 客製便當、盒餐、單點 ---------------------------------
// 客製便當
const bangdongCustom1Mains = reactive([])
const bangdongCustom1MainName = ref('')
const bangdongCustom1Drinks = reactive([])
const bangdongCustom1DrinkName = ref('')
const bangdongCustom1SideDishes = reactive([])
const bangdongCustom1SideDishName = ref('')
const bangdongCustom1Name = ref('')
const bangdongCustom1BentoMains = reactive([])
const bangdongCustom1BentoMainName = ref('')
const bangdongCustom1Price = ref(0)
const bangdongCustom1ProductId = ref('')
const bangdongCustom1MainMealId = ref('')
const bangdongCustom1DrinkId = ref('')
const bangdongCustom1SideDishId = ref('')
const bangdongCustom1BentoMainId = ref('')
const editDialog9 = ref(false)
// 抓取客製便當主餐形成 input
const loadBangdongCustom1 = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1043')
    const productOptions = response.data.product_options
    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values

    for (const mainMealValue of mainMealValues) {
      bangdongCustom1Mains.push({
        id: mainMealValue.id,
        name: mainMealValue.name,
        quantity: 0,
        shortname: mainMealValue.short_name
      })
    }
    // 飲料
    const Drink = productOptions.drink
    const DrinkValues = Drink.product_option_values

    for (const DrinkValue of DrinkValues) {
      bangdongCustom1Drinks.push({
        id: DrinkValue.id,
        name: DrinkValue.name,
        quantity: 0
      })
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values

    for (const sideDishValue of sideDishValues) {
      bangdongCustom1SideDishes.push({
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        is_default: sideDishValue.is_default
      })
    }
    // 副主餐
    const bentoMain = productOptions.bento_main
    const bentoMainValues = bentoMain.product_option_values
    for (const bentoMainValue of bentoMainValues) {
      bangdongCustom1BentoMains.push({
        id: bentoMainValue.id,
        name: bentoMainValue.name,
        quantity: 0,
        is_default: bentoMainValue.is_default
      })
    }
    bangdongCustom1Mains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdongCustom1Drinks.forEach((drink) => {
      watch(
        () => drink.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            drink.quantity = 0
          }
        }
      )
    })
    bangdongCustom1SideDishes.forEach((sideDish) => {
      watch(
        () => sideDish.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            sideDish.quantity = 0
          }
        }
      )
    })
    bangdongCustom1BentoMains.forEach((bentoMain) => {
      watch(
        () => bentoMain.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            bentoMain.quantity = 0
          }
        }
      )
    })
    bangdongCustom1Name.value = response.data.name
    bangdongCustom1MainName.value = mainMeal.name
    bangdongCustom1DrinkName.value = Drink.name
    bangdongCustom1SideDishName.value = sideDish.name
    bangdongCustom1BentoMainName.value = bentoMain.name
    bangdongCustom1ProductId.value = response.data.id
    bangdongCustom1MainMealId.value = mainMeal.id
    bangdongCustom1DrinkId.value = Drink.id
    bangdongCustom1SideDishId.value = sideDish.id
    bangdongCustom1BentoMainId.value = bentoMain.id
  } catch (error) {
    console.error(error)
  }
}

// 計算總價格
const bangdongCustom1TotalQuantityPrice = computed(() => {
  return bangdongCustom1TotalQuantity.value * bangdongCustom1Price.value
})
const bangdongCustom1optionPrice = ref(0)
const bangdongCustom1finaltotal = computed(() => {
  return (
    bangdongCustom1TotalQuantityPrice.value + bangdongCustom1optionPrice.value
  )
})
// 將資料推進 tableRows
const submitBangdongCustom1 = () => {
  const nextId =
    tableRows.length > 0 ? tableRows[tableRows.length - 1].id + 1 : 1

  const row = {
    bentoType: 9,
    id: nextId,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    sideDishDefault: '',
    bentoMains: '',
    quantity: bangdongCustom1TotalQuantity.value,
    price: bangdongCustom1finaltotal.value,
    optionPrice: bangdongCustom1optionPrice.value,
    totalPrice: bangdongCustom1TotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: bangdongCustom1Comment.value
  }

  const totalQuantity = bangdongCustom1TotalQuantity.value
  console.log(totalQuantity)
  for (const bangdongCustom1Main of bangdongCustom1Mains) {
    if (bangdongCustom1Main.quantity > 0) {
      row.Main +=
        bangdongCustom1Main.name +
        'x' +
        parseInt(bangdongCustom1Main.quantity).toString() +
        '<br>'
      const productInput = {
        productTypeId: bangdongCustom1MainMealId.value,
        productTypeName: bangdongCustom1MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongCustom1Main.id,
        name: bangdongCustom1Main.name,
        value: parseInt(bangdongCustom1Main.quantity),
        type: 1
      }
      row.inputs.push(input)
      bangdongCustom1Main.quantity = 0
    }
  }
  for (const bangdongCustom1Drink of bangdongCustom1Drinks) {
    if (bangdongCustom1Drink.quantity > 0) {
      row.drinks +=
        bangdongCustom1Drink.name +
        'x' +
        parseInt(bangdongCustom1Drink.quantity).toString() +
        '<br>'
      // 保留飲料名稱、飲料 ID
      const productInput = {
        productTypeName: bangdongCustom1DrinkName.value,
        productTypeId: bangdongCustom1DrinkId.value,
        productType: 'options_with_qty',
        type: 2
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongCustom1Drink.id,
        name: bangdongCustom1Drink.name,
        value: parseInt(bangdongCustom1Drink.quantity),
        type: 2
      }
      row.inputs.push(input)
      bangdongCustom1Drink.quantity = 0
    }
  }

  for (const bangdongCustom1SideDish of bangdongCustom1SideDishes) {
    if (bangdongCustom1SideDish.quantity > 0) {
      row.sideDishes +=
        bangdongCustom1SideDish.name +
        'x' +
        parseInt(bangdongCustom1SideDish.quantity).toString() +
        '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: bangdongCustom1SideDishName.value,
        productTypeId: bangdongCustom1SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      row.sideDishDefault += bangdongCustom1SideDish.is_default + ' '

      const input = {
        id: bangdongCustom1SideDish.id,
        name: bangdongCustom1SideDish.name,
        value: parseInt(bangdongCustom1SideDish.quantity),
        is_default: bangdongCustom1SideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
      bangdongCustom1SideDish.quantity = 0
    }
  }

  // 副主餐
  for (const bangdongCustom1BentoMain of bangdongCustom1BentoMains) {
    if (bangdongCustom1BentoMain.quantity > 0) {
      row.bentoMains +=
        bangdongCustom1BentoMain.name +
        'x' +
        parseInt(bangdongCustom1BentoMain.quantity).toString() +
        '<br>'
      // 保留副主餐名稱、副主餐 ID
      const productInput = {
        productTypeName: bangdongCustom1BentoMainName.value,
        productTypeId: bangdongCustom1BentoMainId.value,
        productType: 'options_with_qty',
        type: 4
      }
      row.productInputs.push(productInput)

      const input = {
        id: bangdongCustom1BentoMain.id,
        name: bangdongCustom1BentoMain.name,
        value: parseInt(bangdongCustom1BentoMain.quantity),
        type: 4
      }
      row.inputs.push(input)
      bangdongCustom1BentoMain.quantity = 0
    }
  }
  const productInput = {
    id: bangdongCustom1ProductId.value,
    name: bangdongCustom1Name.value,
    value: parseInt(totalQuantity),
    price: bangdongCustom1Price.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: bangdongCustom1Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (bangdongCustom1Arbitrarily.value > 0) {
    if (row.Main !== '') {
      row.Main += ','
    }
    row.Main +=
      '任意搭配' + 'x' + parseInt(bangdongCustom1Arbitrarily.value).toString()
    const input = {
      id: 'bangdongCustom1Arbitrarily',
      value: bangdongCustom1Arbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = bangdongCustom1Name.value + totalQuantity + '份'
  checkVegetable(row)
  bangdongCustom1Price.value = 0
  // 將這個 row 推進 tableRows 中
  tableRows.push(row)
  showbangdongCustom1.value = false
  bangdongCustom1Arbitrarily.value = 0
}

// editDialog9 導入欄位
const bangdongCustom1EditMains = reactive([])
const bangdongCustom1EditDrinks = reactive([])
const bangdongCustom1EditSideDishes = reactive([])
const bangdongCustom1EditBentoMains = reactive([])
const loadBangdongCustom1Edit = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1043')
    const productOptions = response.data.product_options

    // 主餐
    const mainMeal = productOptions.main_meal
    const values = mainMeal.product_option_values

    for (const value of values) {
      const bangdongCustom1EditMain = {
        id: value.id,
        name: value.name,
        quantity: 0,
        hidenquantity: 0,
        shortname: value.short_name
      }
      bangdongCustom1EditMains.push(bangdongCustom1EditMain)
    }
    // 飲料
    const Drink = productOptions.drink
    const DrinkValues = Drink.product_option_values
    for (const DrinkValue of DrinkValues) {
      const bangdongCustom1EditDrink = {
        id: DrinkValue.id,
        name: DrinkValue.name,
        quantity: 0,
        hidenquantity: 0
      }
      bangdongCustom1EditDrinks.push(bangdongCustom1EditDrink)
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values
    for (const sideDishValue of sideDishValues) {
      const bangdongCustom1EditSideDish = {
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        hidenquantity: 0,
        is_default: sideDishValue.is_default
      }
      bangdongCustom1EditSideDishes.push(bangdongCustom1EditSideDish)
    }
    // 副主餐
    const bentoMain = productOptions.bento_main
    const bentoMainValues = bentoMain.product_option_values
    for (const bentoMainValue of bentoMainValues) {
      const bangdongCustom1EditBentoMain = {
        id: bentoMainValue.id,
        name: bentoMainValue.name,
        quantity: 0,
        is_default: bentoMainValue.is_default,
        hidenquantity: 0
      }
      bangdongCustom1EditBentoMains.push(bangdongCustom1EditBentoMain)
    }
    bangdongCustom1EditMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdongCustom1EditDrinks.forEach((drink) => {
      watch(
        () => drink.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            drink.quantity = 0
          }
        }
      )
    })
    bangdongCustom1EditSideDishes.forEach((sideDish) => {
      watch(
        () => sideDish.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            sideDish.quantity = 0
          }
        }
      )
    })
    bangdongCustom1EditBentoMains.forEach((bentoMain) => {
      watch(
        () => bentoMain.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            bentoMain.quantity = 0
          }
        }
      )
    })

    bangdongCustom1MainName.value = mainMeal.name
    bangdongCustom1DrinkName.value = Drink.name
    bangdongCustom1SideDishName.value = sideDish.name
    bangdongCustom1BentoMainName.value = bentoMain.name
  } catch (error) {
    console.error(error)
  }
}

// 客製盒餐
const lunchBoxCustom1Mains = reactive([])
const lunchBoxCustom1SideDishes = reactive([])
const lunchBoxCustom1SideDishName = ref('')
const lunchBoxCustom1DrinkName = ref('')
const lunchBoxCustom1MainName = ref('')
const lunchBoxCustom1Name = ref('')
const lunchBoxCustom1Price = ref(0)
const lunchBoxCustom1ProductId = ref('')
const lunchBoxCustom1BentoMains = reactive([])
const lunchBoxCustom1Burrito6inchs = reactive([])
const lunchBoxCustom1MainMealId = ref('')
const lunchBoxCustom1DrinkId = ref('')
const lunchBoxCustom1SideDishId = ref('')
const lunchBoxCustom1BentoMainName = ref('')
const lunchBoxCustom1BentoMainId = ref('')
const lunchBoxCustom1Burrito6inchName = ref('')
const lunchBoxCustom1Burrito6inchId = ref('')
const loadLunchBoxCustom1 = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1044')
    const productOptions = response.data.product_options

    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values

    // 飲料
    const drink = productOptions.drink
    const drinkValues = drink.product_option_values

    for (const mainMealValue of mainMealValues) {
      const main = {
        id: mainMealValue.id,
        name: mainMealValue.name,
        quantity: 0,
        shortname: mainMealValue.short_name
      }

      main.drinks = drinkValues.map((drinkValue) => ({
        id: drinkValue.id,
        name: drinkValue.name,
        quantity: 0
      }))

      lunchBoxCustom1Mains.push(main)
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values

    for (const sideDishValue of sideDishValues) {
      lunchBoxCustom1SideDishes.push({
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        is_default: sideDishValue.is_default
      })
    }
    // 副主餐
    const bentoMain = productOptions.bento_main
    const bentoMainValues = bentoMain.product_option_values
    for (const bentoMainValue of bentoMainValues) {
      lunchBoxCustom1BentoMains.push({
        id: bentoMainValue.id,
        name: bentoMainValue.name,
        quantity: 0,
        is_default: bentoMainValue.is_default,
        hidenquantity: 0
      })
    }
    // 6inch
    const Burrito6inch = productOptions.burrito_6inch
    const Burrito6inchValues = Burrito6inch.product_option_values
    for (const Burrito6inchValue of Burrito6inchValues) {
      lunchBoxCustom1Burrito6inchs.push({
        id: Burrito6inchValue.id,
        name: Burrito6inchValue.name,
        quantity: 0,
        hidenquantity: 0
      })
    }
    lunchBoxCustom1Mains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
      main.drinks.forEach((drink) => {
        watch(
          () => drink.quantity,
          (newVal, oldVal) => {
            if (newVal === '') {
              drink.quantity = 0
            }
          }
        )
      })
    })
    lunchBoxCustom1SideDishes.forEach((sideDish) => {
      watch(
        () => sideDish.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            sideDish.quantity = 0
          }
        }
      )
    })
    lunchBoxCustom1BentoMains.forEach((bentoMain) => {
      watch(
        () => bentoMain.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            bentoMain.quantity = 0
          }
        }
      )
    })
    lunchBoxCustom1Name.value = response.data.name
    lunchBoxCustom1MainName.value = mainMeal.name
    lunchBoxCustom1DrinkName.value = drink.name
    lunchBoxCustom1SideDishName.value = sideDish.name
    lunchBoxCustom1ProductId.value = response.data.id
    lunchBoxCustom1MainMealId.value = mainMeal.id
    lunchBoxCustom1DrinkId.value = drink.id
    lunchBoxCustom1SideDishId.value = sideDish.id
    lunchBoxCustom1BentoMainId.value = bentoMain.id
    lunchBoxCustom1BentoMainName.value = bentoMain.name
    lunchBoxCustom1Burrito6inchId.value = Burrito6inch.id
    lunchBoxCustom1Burrito6inchName.value = Burrito6inch.name
  } catch (error) {
    console.error(error)
  }
}

// 計算總數量
const lunchBoxCustom1TotalQuantity = ref(0)
const lunchBoxCustom1optionPrice = ref(0)
// 計算總價格
const lunchBoxCustom1TotalQuantityPrice = computed(() => {
  return lunchBoxCustom1TotalQuantity.value * lunchBoxCustom1Price.value
})
const lunchBoxCustom1finaltotal = computed(() => {
  return (
    lunchBoxCustom1TotalQuantityPrice.value + lunchBoxCustom1optionPrice.value
  )
})
const submitLunchboxCustom1 = () => {
  const nextId =
    tableRows.length > 0 ? tableRows[tableRows.length - 1].id + 1 : 1
  const row = {
    bentoType: 0,
    id: nextId,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: lunchBoxCustom1TotalQuantity.value,
    price: lunchBoxCustom1finaltotal.value,
    optionPrice: lunchBoxCustom1optionPrice.value,
    totalPrice: lunchBoxCustom1TotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: lunchboxCustom1Comment.value
  }
  const totalQuantity = lunchBoxCustom1TotalQuantity.value
  for (const option of lunchBoxCustom1Mains) {
    if (option.quantity > 0 && option.name !== '虛擬潤餅 3 吋') {
      let Main = option.name + 'x' + parseInt(option.quantity)
      let drinkInfo = ''
      for (const drink of option.drinks) {
        if (drink.quantity > 0) {
          drinkInfo += drink.name + 'x' + parseInt(drink.quantity)
          // 保留飲料名稱、飲料 ID
          const productInput = {
            mainId: option.id,
            productTypeName: lunchBoxCustom1DrinkName.value,
            productTypeId: lunchBoxCustom1DrinkId.value,
            productType: 'options_with_qty',
            type: 2
          }
          row.productInputs.push(productInput)
          // 將帶有數值的 input 推進 inputs
          const input = {
            id: drink.id,
            mainId: option.id,
            name: drink.name,
            value: parseInt(drink.quantity),
            type: 2
          }
          row.inputs.push(input)
          drink.quantity = 0
        }
      }
      if (drinkInfo !== '') {
        Main += ` (${drinkInfo}<br>`
      }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBoxCustom1MainMealId.value,
        productTypeName: lunchBoxCustom1MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    } else if (option.name === '虛擬潤餅 3 吋') {
      let Main = ''
      if (option.quantity !== 0) {
        Main = option.name + 'x' + parseInt(option.quantity)
      }
      let drinkInfo = ''
      for (const drink of option.drinks) {
        if (drink.quantity > 0) {
          drinkInfo += drink.name + 'x' + parseInt(drink.quantity)
          // 保留飲料名稱、飲料 ID
          const productInput = {
            mainId: option.id,
            productTypeName: lunchBoxCustom1DrinkName.value,
            productTypeId: lunchBoxCustom1DrinkId.value,
            productType: 'options_with_qty',
            type: 2
          }
          row.productInputs.push(productInput)
          // 將帶有數值的 input 推進 inputs
          const input = {
            id: drink.id,
            mainId: option.id,
            name: drink.name,
            value: parseInt(drink.quantity),
            type: 2
          }
          row.inputs.push(input)
          drink.quantity = 0
        }
      }
      if (drinkInfo !== '') {
        Main += ` (${drinkInfo}<br>`
      }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBoxCustom1MainMealId.value,
        productTypeName: lunchBoxCustom1MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    }
  }

  // 推進配菜
  for (const sideDish of lunchBoxCustom1SideDishes) {
    if (sideDish.quantity > 0) {
      if (row.sideDishes !== '') {
        row.sideDishes += ', '
      }
      row.sideDishes +=
        sideDish.name + 'x' + parseInt(sideDish.quantity) + '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: lunchBoxCustom1SideDishName.value,
        productTypeId: lunchBoxCustom1SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: sideDish.id,
        name: sideDish.name,
        value: parseInt(sideDish.quantity),
        is_default: sideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
      sideDish.quantity = 0
    }
  }
  // 副主餐
  for (const lunchBoxCustom1BentoMain of lunchBoxCustom1BentoMains) {
    if (lunchBoxCustom1BentoMain.quantity > 0) {
      if (row.bentoMains !== '') {
        row.bentoMains += ','
      }
      row.bentoMains +=
        lunchBoxCustom1BentoMain.name +
        'x' +
        parseInt(lunchBoxCustom1BentoMain.quantity).toString() +
        '<br>'
      // 保留副主餐名稱、副主餐 ID
      const productInput = {
        productTypeName: lunchBoxCustom1BentoMainName.value,
        productTypeId: lunchBoxCustom1BentoMainId.value,
        productType: 'options_with_qty',
        type: 4
      }
      row.productInputs.push(productInput)

      const input = {
        id: lunchBoxCustom1BentoMain.id,
        name: lunchBoxCustom1BentoMain.name,
        value: parseInt(lunchBoxCustom1BentoMain.quantity),
        type: 4
      }
      row.inputs.push(input)
      lunchBoxCustom1BentoMain.quantity = 0
    }
  }
  for (const lunchBoxCustom1Burrito6inch of lunchBoxCustom1Burrito6inchs) {
    if (lunchBoxCustom1Burrito6inch.quantity > 0) {
      if (row.bentoMains !== '') {
        row.bentoMains += ','
      }
      row.bentoMains +=
        lunchBoxCustom1Burrito6inch.name +
        'x' +
        parseInt(lunchBoxCustom1Burrito6inch.quantity).toString() +
        '<br>'
      // 保留副主餐名稱、副主餐 ID
      const productInput = {
        productTypeName: lunchBoxCustom1Burrito6inchName.value,
        productTypeId: lunchBoxCustom1Burrito6inchId.value,
        productType: 'options_with_qty',
        type: 4
      }
      row.productInputs.push(productInput)

      const input = {
        id: lunchBoxCustom1Burrito6inch.id,
        name: lunchBoxCustom1Burrito6inch.name,
        value: parseInt(lunchBoxCustom1Burrito6inch.quantity),
        type: 4
      }
      row.inputs.push(input)
      lunchBoxCustom1Burrito6inch.quantity = 0
    }
  }
  // 保留 客製盒餐、數量、
  const productInput = {
    id: lunchBoxCustom1ProductId.value,
    name: lunchBoxCustom1Name.value,
    value: parseInt(totalQuantity),
    price: lunchBoxCustom1Price.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: lunchboxCustom1Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (lunchBoxCustom1Arbitrarily.value > 0) {
    if (row.Main !== '') {
      row.Main += ','
    }
    row.Main +=
      '任意搭配' + 'x' + parseInt(lunchBoxCustom1Arbitrarily.value).toString()
    const input = {
      id: 'lunchBoxCustom1Arbitrarily',
      value: lunchBoxCustom1Arbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = lunchBoxCustom1Name.value + totalQuantity + '份'
  checkVegetable(row)
  if (row.Main !== '' || row.sideDishes !== '') {
    // 如果 row.Main 或 row.sideDishes 不是空的，則添加到 tableRows
    tableRows.push(row)
    showLunchBoxCustom1.value = false
    lunchBoxCustom1Arbitrarily.value = 0
  }
}
// editDialog0 導入欄位
const lunchBoxCustom1EditMains = reactive([])
const lunchBoxCustom1EditSideDishes = reactive([])
const lunchBoxCustom1EditSideDishName = ref('')
const lunchBoxCustom1EditDrinkName = ref('')
const lunchBoxCustom1EditMainName = ref('')
const lunchBoxCustom1EditName = ref('')
const lunchBoxCustom1EditBentoMains = reactive([])
const loadLunchBoxCustom1Edit = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1044')
    const productOptions = response.data.product_options

    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values

    // 飲料
    const drink = productOptions.drink
    const drinkValues = drink.product_option_values

    for (const mainMealValue of mainMealValues) {
      const main = {
        id: mainMealValue.id,
        name: mainMealValue.name,
        quantity: 0,
        shortname: mainMealValue.short_name
      }

      main.drinks = drinkValues.map((drinkValue) => ({
        id: drinkValue.id,
        name: drinkValue.name,
        quantity: 0
      }))

      lunchBoxCustom1EditMains.push(main)
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values

    for (const sideDishValue of sideDishValues) {
      lunchBoxCustom1EditSideDishes.push({
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        is_default: sideDishValue.is_default
      })
    }
    // bentomains
    const bentoMain = productOptions.bento_main
    const bentoMainValues = bentoMain.product_option_values
    for (const bentoMainValue of bentoMainValues) {
      lunchBoxCustom1EditBentoMains.push({
        id: bentoMainValue.id,
        name: bentoMainValue.name,
        quantity: 0,
        is_default: bentoMainValue.is_default,
        hidenquantity: 0
      })
    }
    // watch = 0
    lunchBoxCustom1EditMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
      main.drinks.forEach((drink) => {
        watch(
          () => drink.quantity,
          (newVal, oldVal) => {
            if (newVal === '') {
              drink.quantity = 0
            }
          }
        )
      })
    })
    lunchBoxCustom1EditSideDishes.forEach((sideDish) => {
      watch(
        () => sideDish.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            sideDish.quantity = 0
          }
        }
      )
    })
    lunchBoxCustom1EditBentoMains.forEach((bentoMain) => {
      watch(
        () => bentoMain.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            bentoMain.quantity = 0
          }
        }
      )
    })
    lunchBoxCustom1EditName.value = response.data.name
    lunchBoxCustom1EditMainName.value = mainMeal.name
    lunchBoxCustom1EditDrinkName.value = drink.name
    lunchBoxCustom1EditSideDishName.value = sideDish.name
  } catch (error) {
    console.error(error)
  }
}

// 單點
const bangdongSolo6inchs = reactive([])
const bangdongSolo6inchName = ref('')
const bangdongSolo3inchs = reactive([])
const bangdongSolo3inchName = ref('')
const bangdongSoloDrinks = reactive([])
const bangdongSoloDrinkName = ref('')
const bangdongSoloSideDishes = reactive([])
const bangdongSoloSideDishName = ref('')
const bangdongSoloBentoMains = reactive([])
const bangdongSoloBentoMainName = ref('')
const bangdongSoloEcoBags = reactive([])
const bangdongSoloEcoBagName = ref('')
const bangdongSoloName = ref('')
const bangdongSoloProductId = ref('')
const bangdongSolo6inchId = ref('')
// const bangdongSolo3inchId = ref('')
const bangdongSoloDrinkId = ref('')
const bangdongSoloSideDishId = ref('')
const bangdongSoloBentoMainId = ref('')
const bangdongSoloEcoBagId = ref('')
const editDialog10 = ref(false)
// 抓取單點商品形成 input
const loadBangdongSolo = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1062')
    const productOptions = response.data.product_options
    // 6 吋
    const burrito6inch = productOptions.burrito_6inch
    const burrito6inchValues = burrito6inch.product_option_values

    for (const burrito6inchValue of burrito6inchValues) {
      bangdongSolo6inchs.push({
        id: burrito6inchValue.id,
        name: burrito6inchValue.name,
        price: burrito6inchValue.price,
        quantity: 0
      })
    }
    /// / 3 吋
    // const burrito3inch = productOptions.burrito_3inch;
    // const burrito3inchValues = burrito3inch.product_option_values;

    // for (const burrito3inchValue of burrito3inchValues) {
    //   bangdongSolo3inchs.push({
    //     id: burrito3inchValue.id,
    //     name: burrito3inchValue.name,
    //     price: burrito3inchValue.price,
    //     quantity: 0,
    //   });
    // }
    // 飲料
    const Drink = productOptions.drink
    const DrinkValues = Drink.product_option_values

    for (const DrinkValue of DrinkValues) {
      bangdongSoloDrinks.push({
        id: DrinkValue.id,
        name: DrinkValue.name,
        price: DrinkValue.price,
        quantity: 0
      })
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values

    for (const sideDishValue of sideDishValues) {
      bangdongSoloSideDishes.push({
        id: sideDishValue.id,
        name: sideDishValue.name,
        price: sideDishValue.price,
        quantity: 0,
        is_default: sideDishValue.is_default
      })
    }
    // 副主餐
    const bentoMain = productOptions.bento_main
    const bentoMainValues = bentoMain.product_option_values
    for (const bentoMainValue of bentoMainValues) {
      bangdongSoloBentoMains.push({
        id: bentoMainValue.id,
        name: bentoMainValue.name,
        price: bentoMainValue.price,
        quantity: 0
      })
    }
    // 環保袋
    const ecoBag = productOptions.eco_bag
    const ecoBagValues = ecoBag.product_option_values
    for (const ecoBagValue of ecoBagValues) {
      bangdongSoloEcoBags.push({
        id: ecoBagValue.id,
        name: ecoBagValue.name,
        price: ecoBagValue.price,
        quantity: 0
      })
    }

    // if = '' get 0
    bangdongSolo6inchs.forEach((bangdongSolo6inch) => {
      watch(
        () => bangdongSolo6inch.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            bangdongSolo6inch.quantity = 0
          }
        }
      )
    })
    bangdongSolo3inchs.forEach((bangdongSolo3inch) => {
      watch(
        () => bangdongSolo3inch.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            bangdongSolo3inch.quantity = 0
          }
        }
      )
    })
    bangdongSoloDrinks.forEach((bangdongSoloDrink) => {
      watch(
        () => bangdongSoloDrink.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            bangdongSoloDrink.quantity = 0
          }
        }
      )
    })
    bangdongSoloSideDishes.forEach((bangdongSoloSideDish) => {
      watch(
        () => bangdongSoloSideDish.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            bangdongSoloSideDish.quantity = 0
          }
        }
      )
    })
    bangdongSoloBentoMains.forEach((bangdongSoloBentoMain) => {
      watch(
        () => bangdongSoloBentoMain.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            bangdongSoloBentoMain.quantity = 0
          }
        }
      )
    })
    bangdongSoloEcoBags.forEach((bangdongSoloEcoBag) => {
      watch(
        () => bangdongSoloEcoBag.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            bangdongSoloEcoBag.quantity = 0
          }
        }
      )
    })

    bangdongSoloName.value = response.data.name
    bangdongSolo6inchName.value = burrito6inch.name
    // bangdongSolo3inchName.value = burrito3inch.name;
    bangdongSoloDrinkName.value = Drink.name
    bangdongSoloSideDishName.value = sideDish.name
    bangdongSoloBentoMainName.value = bentoMain.name
    bangdongSoloEcoBagName.value = ecoBag.name
    bangdongSoloProductId.value = response.data.id
    bangdongSolo6inchId.value = burrito6inch.id
    // bangdongSolo3inchId.value = burrito3inch.id;
    bangdongSoloDrinkId.value = Drink.id
    bangdongSoloSideDishId.value = sideDish.id
    bangdongSoloBentoMainId.value = bentoMain.id
    bangdongSoloEcoBagId.value = ecoBag.id
  } catch (error) {
    console.error(error)
  }
}

// 計算總數量
const bangdongSoloTotalQuantity = computed(() => {
  let total = 0
  total += bangdongSolo6inchs.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  )
  total += bangdongSolo3inchs.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  )
  total += bangdongSoloDrinks.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  )
  total += bangdongSoloSideDishes.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  )
  total += bangdongSoloBentoMains.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  )
  total += bangdongSoloEcoBags.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  )

  return total
})
// 計算總價格
const bangdongSoloTotalQuantityPrice = computed(() => {
  let total = 0
  total += bangdongSolo6inchs.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.price),
    0
  )
  total += bangdongSolo3inchs.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.price),
    0
  )
  total += bangdongSoloDrinks.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.price),
    0
  )
  total += bangdongSoloSideDishes.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.price),
    0
  )
  total += bangdongSoloBentoMains.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.price),
    0
  )
  total += bangdongSoloEcoBags.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.price),
    0
  )

  return total
})
// 將資料推進 tableRows
const submitBangdongSolo = () => {
  const nextId =
    tableRows.length > 0 ? tableRows[tableRows.length - 1].id + 1 : 1

  const row = {
    bentoType: 10,
    id: nextId,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    price: bangdongSoloTotalQuantityPrice.value,
    optionPrice: 0,
    totalPrice: bangdongSoloTotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: bangdongSoloComment.value
  }

  const totalQuantity = bangdongSoloTotalQuantity.value
  // 6 吋潤餅
  const bangdongSolo6inchCompositions = []
  for (const bangdongSolo6inch of bangdongSolo6inchs) {
    if (bangdongSolo6inch.quantity > 0) {
      const bangdongSolo6inchComposition =
        `${bangdongSolo6inch.name} x${bangdongSolo6inch.quantity}` + '<br>'
      bangdongSolo6inchCompositions.push(bangdongSolo6inchComposition)
      // 保留 6 吋潤餅名稱、ID
      const productInput = {
        productTypeName: bangdongSolo6inchName.value,
        productTypeId: bangdongSolo6inchId.value,
        productType: 'options_with_qty',
        type: 5
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongSolo6inch.id,
        name: bangdongSolo6inch.name,
        value: parseInt(bangdongSolo6inch.quantity),
        type: 5
      }
      row.inputs.push(input)

      bangdongSolo6inch.quantity = 0
    }
  }
  if (bangdongSolo6inchCompositions.length > 0) {
    row.Main += `${
      bangdongSolo6inchName.value
    }  (${bangdongSolo6inchCompositions.join(', ')}`
  }
  // 飲料
  for (const bangdongSoloDrink of bangdongSoloDrinks) {
    if (bangdongSoloDrink.quantity > 0) {
      row.drinks +=
        bangdongSoloDrink.name +
        'x' +
        parseInt(bangdongSoloDrink.quantity).toString() +
        '<br>'
      // 保留飲料名稱、ID
      const productInput = {
        productTypeName: bangdongSoloDrinkName.value,
        productTypeId: bangdongSoloDrinkId.value,
        productType: 'options_with_qty',
        type: 7
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongSoloDrink.id,
        name: bangdongSoloDrink.name,
        price: bangdongSoloDrink.price,
        value: parseInt(bangdongSoloDrink.quantity),
        type: 7
      }
      row.inputs.push(input)
      bangdongSoloDrink.quantity = 0
    }
  }
  // 配菜
  const bangdongSoloSideDishCompositions = []
  for (const bangdongSoloSideDish of bangdongSoloSideDishes) {
    if (bangdongSoloSideDish.quantity > 0) {
      const bangdongSoloSideDishComposition =
        `${bangdongSoloSideDish.name} x ${bangdongSoloSideDish.quantity}` +
        '<br>'
      bangdongSoloSideDishCompositions.push(bangdongSoloSideDishComposition)
      // 保留配菜名稱、ID
      const productInput = {
        productTypeName: bangdongSoloSideDishName.value,
        productTypeId: bangdongSoloSideDishId.value,
        productType: 'options_with_qty',
        type: 8
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongSoloSideDish.id,
        name: bangdongSoloSideDish.name,
        price: bangdongSoloSideDish.price,
        value: parseInt(bangdongSoloSideDish.quantity),
        is_default: bangdongSoloSideDish.is_default,
        type: 8
      }
      row.inputs.push(input)
      row.Main += `${bangdongSoloSideDishCompositions.join(', ')}`
      bangdongSoloSideDish.quantity = 0
    }
  }
  // 副主餐
  const bangdongSoloBentoMainCompositions = []
  for (const bangdongSoloBentoMain of bangdongSoloBentoMains) {
    if (bangdongSoloBentoMain.quantity > 0) {
      const bangdongSoloBentoMainComposition =
        `${bangdongSoloBentoMain.name} x${bangdongSoloBentoMain.quantity}` +
        '<br>'
      bangdongSoloBentoMainCompositions.push(bangdongSoloBentoMainComposition)
      // 保留副主餐名稱、ID
      const productInput = {
        productTypeName: bangdongSoloBentoMainName.value,
        productTypeId: bangdongSoloBentoMainId.value,
        productType: 'options_with_qty',
        type: 9
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongSoloBentoMain.id,
        name: bangdongSoloBentoMain.name,
        price: bangdongSoloBentoMain.price,
        value: parseInt(bangdongSoloBentoMain.quantity),
        type: 9
      }
      row.inputs.push(input)
      row.Main += `${bangdongSoloBentoMainCompositions.join(', ')}`
      bangdongSoloBentoMain.quantity = 0
    }
  }

  if (bangdongSoloSideDishCompositions.length > 0) {
    row.sideDishes += `配菜 (${bangdongSoloSideDishCompositions.join(', ')})`
  }

  if (bangdongSoloBentoMainCompositions.length > 0) {
    if (bangdongSoloSideDishCompositions.length > 0) {
      row.sideDishes += ', '
    }
    row.sideDishes += ` 副主餐 (${bangdongSoloBentoMainCompositions.join(
      ', '
    )})`
  }
  row.name = bangdongSoloName.value + totalQuantity + '份'

  // 購物袋
  const ecoBagCompositions = []
  for (const bangdongSoloEcoBag of bangdongSoloEcoBags) {
    if (bangdongSoloEcoBag.quantity > 0) {
      const ecoBagComposition =
        `${bangdongSoloEcoBag.name} x${bangdongSoloEcoBag.quantity}` + '<br>'
      ecoBagCompositions.push(ecoBagComposition)
      // 保留購物袋名稱、ID
      const productInput = {
        productTypeName: bangdongSoloEcoBagName.value,
        productTypeId: bangdongSoloEcoBagId.value,
        productType: 'options_with_qty',
        type: 0
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongSoloEcoBag.id,
        name: bangdongSoloEcoBag.name,
        price: bangdongSoloEcoBag.price,
        value: parseInt(bangdongSoloEcoBag.quantity),
        type: 0
      }
      row.inputs.push(input)
      bangdongSoloEcoBag.quantity = 0
    }
  }

  if (ecoBagCompositions.length > 0) {
    row.name += ` (${ecoBagCompositions.join(',')}`
  }
  const productInput = {
    id: bangdongSoloProductId.value,
    name: bangdongSoloName.value,
    value: parseInt(totalQuantity),
    price: 0,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: bangdongSoloComment.value
  }
  row.productInputs.push(productInput)
  // 將這個 row 推進 tableRows 中
  tableRows.push(row)
  meal.tableRows2.push(row)
  showbangdongSolo.value = false
}
// reset-----------------------------------------
const ResetbangdongSolo = () => {
  for (const bangdongSolo6inch of bangdongSolo6inchs) {
    bangdongSolo6inch.quantity = 0
  }
  for (const bangdongSolo3inch of bangdongSolo3inchs) {
    bangdongSolo3inch.quantity = 0
  }
  for (const bangdongSoloDrink of bangdongSoloDrinks) {
    bangdongSoloDrink.quantity = 0
  }
  for (const bangdongSoloSideDish of bangdongSoloSideDishes) {
    bangdongSoloSideDish.quantity = 0
  }
  for (const bangdongSoloBentoMain of bangdongSoloBentoMains) {
    bangdongSoloBentoMain.quantity = 0
  }
  for (const bangdongSoloEcoBag of bangdongSoloEcoBags) {
    bangdongSoloEcoBag.quantity = 0
  }
  showbangdongSolo.value = false
}
// editDialog10 導入欄位
const bangdongSoloEdit6inchs = reactive([])
const bangdongSoloEdit3inchs = reactive([])
const bangdongSoloEditDrinks = reactive([])
const bangdongSoloEditSideDishes = reactive([])
const bangdongSoloEditBentoMains = reactive([])
const bangdongSoloEditEcoBags = reactive([])
const bangdongSoloEditName = ref('')
const loadBangdongSoloEdit = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1062')
    const productOptions = response.data.product_options

    // 6 吋潤餅
    const burrito6inch = productOptions.burrito_6inch
    const values = burrito6inch.product_option_values

    for (const value of values) {
      const bangdongSoloEdit6inch = {
        id: value.id,
        name: value.name,
        quantity: 0,
        price: value.price,
        hidenquantity: 0
      }
      bangdongSoloEdit6inchs.push(bangdongSoloEdit6inch)
    }

    // 飲料
    const Drink = productOptions.drink
    const DrinkValues = Drink.product_option_values
    for (const DrinkValue of DrinkValues) {
      const bangdongSoloEditDrink = {
        id: DrinkValue.id,
        name: DrinkValue.name,
        quantity: 0,
        price: DrinkValue.price,
        hidenquantity: 0
      }
      bangdongSoloEditDrinks.push(bangdongSoloEditDrink)
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values
    for (const sideDishValue of sideDishValues) {
      const bangdongSoloEditSideDish = {
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        price: sideDishValue.price,
        hidenquantity: 0,
        is_default: sideDishValue.is_default
      }
      bangdongSoloEditSideDishes.push(bangdongSoloEditSideDish)
    }
    // 副主餐
    const bentoMain = productOptions.bento_main
    const bentoMainValues = bentoMain.product_option_values
    for (const bentoMainValue of bentoMainValues) {
      const bangdongSoloEditBentoMain = {
        id: bentoMainValue.id,
        name: bentoMainValue.name,
        quantity: 0,
        is_default: bentoMainValue.is_default,
        price: bentoMainValue.price,
        hidenquantity: 0
      }
      bangdongSoloEditBentoMains.push(bangdongSoloEditBentoMain)
    }
    // 環保袋
    const ecoBag = productOptions.eco_bag
    const ecoBagValues = ecoBag.product_option_values
    for (const ecoBagValue of ecoBagValues) {
      const bangdongSoloEditEcoBag = {
        id: ecoBagValue.id,
        name: ecoBagValue.name,
        price: ecoBagValue.price,
        quantity: 0,
        hidenquantity: 0
      }
      bangdongSoloEditEcoBags.push(bangdongSoloEditEcoBag)
    }
    // if got = '' get 0
    bangdongSoloEdit6inchs.forEach((bangdongSoloEdit6inch) => {
      watch(
        () => bangdongSoloEdit6inch.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            bangdongSoloEdit6inch.quantity = 0
          }
        }
      )
    })

    bangdongSoloEditDrinks.forEach((bangdongSoloEditDrink) => {
      watch(
        () => bangdongSoloEditDrink.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            bangdongSoloEditDrink.quantity = 0
          }
        }
      )
    })
    bangdongSoloEditSideDishes.forEach((bangdongSoloEditSideDish) => {
      watch(
        () => bangdongSoloEditSideDish.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            bangdongSoloEditSideDish.quantity = 0
          }
        }
      )
    })
    bangdongSoloEditBentoMains.forEach((bangdongSoloEditBentoMain) => {
      watch(
        () => bangdongSoloEditBentoMain.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            bangdongSoloEditBentoMain.quantity = 0
          }
        }
      )
    })
    bangdongSoloEditEcoBags.forEach((bangdongSoloEditEcoBag) => {
      watch(
        () => bangdongSoloEditEcoBag.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            bangdongSoloEditEcoBag.quantity = 0
          }
        }
      )
    })

    bangdongSolo6inchName.value = burrito6inch.name
    bangdongSoloDrinkName.value = Drink.name
    bangdongSoloSideDishName.value = sideDish.name
    bangdongSoloBentoMainName.value = bentoMain.name
    bangdongSoloEditName.value = response.data.name
  } catch (error) {
    console.error(error)
  }
}

// ------------------------------------- 刪除新增膗存 ----------------------

// 刪除該行
const deleteRow = (id) => {
  const index = tableRows.findIndex((row) => row.id === id)
  if (index >= 0) {
    tableRows.splice(index, 1)

    // 重新生成 ID
    for (let i = index; i < tableRows.length; i++) {
      tableRows[i].id = tableRows[i].id - 1
    }
  }
}

// 將 table 資料拆解放回修正欄位

let editingRow = null
let watchers = []
const timeout = 2000 // load delay
// 找到對應的 dialog
function editRowDialog (row) {
  console.log(row)
  if (row.bentoType === 1) {
    if (!isBangdong1Loaded.value) {
      loadBangdong1()
      loadBangdong1Edit()
      isBangdong1Loaded.value = true
    }
    setTimeout(function () {
      editBangdong1(row)
    }, timeout)
  } else if (row.bentoType === 2) {
    if (!isBangdong2Loaded.value) {
      loadBangdong2()
      loadBangdong2Edit()
      isBangdong2Loaded.value = true
    }
    setTimeout(function () {
      editBangdong2(row)
    }, timeout)
  } else if (row.bentoType === 3) {
    if (!isBangdong3Loaded.value) {
      loadBangdong3()
      loadBangdong3Edit()
      isBangdong3Loaded.value = true
    }
    setTimeout(function () {
      editBangdong3(row)
    }, timeout)
  } else if (row.bentoType === 4) {
    if (!isBangdong4Loaded.value) {
      loadBangdong4()
      loadBangdong4Edit()
      isBangdong4Loaded.value = true
    }
    setTimeout(function () {
      editBangdong4(row)
    }, timeout)
  } else if (row.bentoType === 5) {
    if (!isLunchBox1Loaded.value) {
      loadLunchBox1()
      loadLunchBox1Edit()
      isLunchBox1Loaded.value = true
    }
    setTimeout(function () {
      editRowDialog5(row)
    }, timeout)
  } else if (row.bentoType === 6) {
    if (!isLunchBox2Loaded.value) {
      loadLunchBox2()
      loadLunchBox2Edit()
      isLunchBox2Loaded.value = true
    }
    setTimeout(function () {
      editRowDialog6(row)
    }, timeout)
  } else if (row.bentoType === 7) {
    if (!isLunchBox3Loaded.value) {
      loadLunchBox3()
      loadLunchBox3Edit()
      isLunchBox3Loaded.value = true
    }
    setTimeout(function () {
      editRowDialog7(row)
    }, timeout)
  } else if (row.bentoType === 8) {
    if (!isLunchBox4Loaded.value) {
      loadLunchBox4()
      loadLunchBox4Edit()
      isLunchBox4Loaded.value = true
    }
    setTimeout(function () {
      editRowDialog8(row)
    }, timeout)
  } else if (row.bentoType === 9) {
    if (!isBangdongCustom1Loaded.value) {
      loadBangdongCustom1()
      loadBangdongCustom1Edit()
      isBangdongCustom1Loaded.value = true
    }
    setTimeout(function () {
      editRowDialog9(row)
    }, timeout)
  } else if (row.bentoType === 0) {
    if (!isLunchBoxCustom1Loaded.value) {
      loadLunchBoxCustom1()
      loadLunchBoxCustom1Edit()
      isLunchBoxCustom1Loaded.value = true
    }
    setTimeout(function () {
      editRowDialog0(row)
    }, timeout)
  } else if (row.bentoType === 10) {
    if (!isBangdongSoloLoaded.value) {
      loadBangdongSolo()
      loadBangdongSoloEdit()
      isBangdongSoloLoaded.value = true
    }
    setTimeout(function () {
      editBangdongSolo(row)
    }, timeout)
  } else if (row.bentoType === 11) {
    if (!isBangdongVegetarian1Loaded.value) {
      loadBangdongVegetarian1()
      loadBangdongVegetarian1Edit()
      isBangdongVegetarian1Loaded.value = true
    }
    setTimeout(function () {
      editBangdongVegetarian1(row)
    }, timeout)
  } else if (row.bentoType === 12) {
    if (!isBangdongVegetarian2Loaded.value) {
      loadBangdongVegetarian2()
      loadBangdongVegetarian2Edit()
      isBangdongVegetarian2Loaded.value = true
    }
    setTimeout(function () {
      editBangdongVegetarian2(row)
    }, timeout)
  } else if (row.bentoType === 13) {
    if (!isBangdongSalmonLoaded.value) {
      loadBangdongSalmon()
      loadBangdongSalmonEdit()
      isBangdongSalmonLoaded.value = true
    }
    setTimeout(function () {
      editBangdongSalmon(row)
    }, timeout)
  } else if (row.bentoType === 14) {
    if (!isLunchBox214Loaded.value) {
      loadLunchBox214()
      loadLunchBox214Edit()
      isLunchBox214Loaded.value = true
    }
    setTimeout(function () {
      editRowDialog214(row)
    }, timeout)
  }
}
// 招牌便當修改
const editDialog1 = ref(false)
function editBangdong1 (row) {
  // watchers.forEach((unwatch) => unwatch());
  // watchers = [];
  // 招牌便當主餐歸零
  for (const bangdong1EditMain of bangdong1EditMains) {
    bangdong1EditMain.quantity = 0
  }
  // 招牌便當飲料歸零
  for (const bangdong1EditDrink of bangdong1EditDrinks) {
    bangdong1EditDrink.quantity = 0
  }
  // 招牌便當配菜歸零
  for (const bangdong1EditSideDish of bangdong1EditSideDishes) {
    bangdong1EditSideDish.quantity = 0
  }
  // 招牌便當副主餐歸零
  for (const bangdong1EditBentoMain of bangdong1EditBentoMains) {
    bangdong1EditBentoMain.quantity = 0
  }
  // 招牌便當主餐隱藏欄位歸零
  for (const input of row.inputs) {
    const name = input.name
    const value = input.value
    // 任意搭配抓取推入
    if (input.name === '任意搭配') {
      bangdong1EditArbitrarily.value = input.value
    }
    // 招牌便當  主餐  推入 input 數值
    const mainIndex = bangdong1EditMains.findIndex(
      (bangdong1EditMain) =>
        bangdong1EditMain.name === name || bangdong1EditMain.shortname === name
    )
    if (mainIndex >= 0) {
      bangdong1EditMains[mainIndex].quantity = parseInt(value)
    }
    // 招牌便當  飲料  推入 input 數值
    const drinkIndex = bangdong1EditDrinks.findIndex(
      (bangdong1EditDrink) => bangdong1EditDrink.name === name
    )
    if (drinkIndex >= 0) {
      bangdong1EditDrinks[drinkIndex].quantity = parseInt(value)
    }
    // 招牌便當  配菜  推入 input 數值
    setTimeout(() => {
      const sideDishIndex = bangdong1EditSideDishes.findIndex(
        (bangdong1EditSideDish) => bangdong1EditSideDish.name === name
      )
      if (sideDishIndex >= 0) {
        bangdong1EditSideDishes[sideDishIndex].quantity = parseInt(value)
      }
    }, 2000)
  }
  // 監聽主餐的數量變化
  editingRow = row
  bangdong1EditTotalQuantity.value = row.quantity
  bangdong1Comment.value = row.comment
  editDialog1.value = true
}

// 招牌便當修正欄位總數量計算
watch(bangdong1EditMains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  bangdong1EditArbitrarily.value = Math.max(
    0,
    parseInt(bangdong1EditTotalQuantity.value) - mainQuantityTotal
  )
})

// 招牌便當單價
const bangdong1EditPrice = computed(() => {
  return bangdong1Price.value
})

// 招牌便當總價格
const bangdong1EditTotalQuantityPrice = computed(() => {
  const totalPrice =
    bangdong1EditTotalQuantity.value * bangdong1EditPrice.value
  return totalPrice
})
const bangdong1EditoptionPrice = computed(() => {
  let totalPrice = 0
  bangdong1EditDrinks.forEach((drink) => {
    totalPrice += drink.quantity * drink.price
  })
  bangdong1EditSideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})

const bangdong1EditfinalTotal = computed(() => {
  const totalPrice =
    bangdong1EditoptionPrice.value + bangdong1EditTotalQuantityPrice.value
  return totalPrice
})
// 關閉修正欄位
function closeEditDialog1 () {
  watchers.forEach((unwatch) => unwatch())
  // 清空 watchers 数组
  watchers = []
  editDialog1.value = false
}
// 完成後儲存並且將資料推進 tableRows 刪除原本的資料
function saveEditDialog1 () {
  if (bangdong1EditTotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  // 檢查總數量是否匹配
  const calculatedTotalQuantity = bangdong1EditMains.reduce(
    (acc, main) => acc + (main.quantity || 0),
    0
  )
  console.log(calculatedTotalQuantity, bangdong1EditTotalQuantity.value)
  if (
    calculatedTotalQuantity !== parseInt(bangdong1EditTotalQuantity.value, 10)
  ) {
    alert('主餐總數量與輸入的總數量不搭！')
    return
  }
  const row = {
    bentoType: 1,
    id: editingRow.id, // 使用新生成的 ID
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    sideDishDefault: '',
    price: bangdong1EditfinalTotal.value,
    optionPrice: bangdong1EditoptionPrice.value,
    totalPrice: bangdong1EditTotalQuantityPrice.value,
    inputs: [],
    quantity: '',
    productInputs: [],
    comment: bangdong1Comment.value
  }

  const totalEditQuantity = bangdong1EditTotalQuantity.value // 計算總數量
  row.quantity = bangdong1EditTotalQuantity.value
  for (const bangdong1EditMain of bangdong1EditMains) {
    if (bangdong1EditMain.quantity > 0) {
      row.Main +=
        bangdong1EditMain.name +
        'x' +
        parseInt(bangdong1EditMain.quantity).toString() +
        '<br>'
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: bangdong1MainMealId.value,
        productTypeName: bangdong1MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdong1EditMain.id,
        name: bangdong1EditMain.name,
        value: parseInt(bangdong1EditMain.quantity),
        type: 1
      }
      row.inputs.push(input)
    }
  }

  for (const bangdong1EditDrink of bangdong1EditDrinks) {
    if (bangdong1EditDrink.quantity > 0) {
      row.drinks +=
        bangdong1EditDrink.name +
        'x' +
        parseInt(bangdong1EditDrink.quantity).toString() +
        '<br>'
      // 保留飲料名稱、飲料 ID
      const productInput = {
        productTypeName: bangdong1DrinkName.value,
        productTypeId: bangdong1DrinkId.value,
        productType: 'options_with_qty',
        type: 2
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdong1EditDrink.id,
        name: bangdong1EditDrink.name,
        value: parseInt(bangdong1EditDrink.quantity),
        type: 2
      }
      row.inputs.push(input)
    }
  }

  for (const bangdong1EditSideDish of bangdong1EditSideDishes) {
    if (bangdong1EditSideDish.quantity > 0) {
      row.sideDishes +=
        bangdong1EditSideDish.name +
        'x' +
        parseInt(bangdong1EditSideDish.quantity).toString() +
        '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: bangdong1SideDishName.value,
        productTypeId: bangdong1SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      row.sideDishDefault += bangdong1EditSideDish.is_default + ' '
      const input = {
        id: bangdong1EditSideDish.id,
        name: bangdong1EditSideDish.name,
        value: parseInt(bangdong1EditSideDish.quantity),
        is_default: bangdong1EditSideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
    }
  }
  // 保留 招牌便當、1001、數量
  const productInput = {
    id: bangdong1ProductId.value,
    name: bangdong1Name.value,
    value: parseInt(totalEditQuantity),
    price: bangdong1EditPrice.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: bangdong1Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (bangdong1EditArbitrarily.value > 0) {
    if (row.Main !== '') {
      row.Main += ','
    }
    row.Main +=
      '任意搭配' + 'x' + parseInt(bangdong1EditArbitrarily.value).toString()
    const input = {
      id: 'bangdong1EditArbitrarily',
      value: bangdong1EditArbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }

  row.name = bangdong1Name.value + totalEditQuantity + '份' // 使用總數量
  checkVegetable(row)
  // 將這個 row 推進 tableRows 中
  const rowIndex = tableRows.findIndex((r) => r === editingRow)
  if (rowIndex !== -1) {
    tableRows.splice(rowIndex, 1, row) // 在移除元素的同時插入新元素
  }
  editDialog1.value = false
  bangdong1EditArbitrarily.value = 0
}

// 雞胸便當修改

const editDialog2 = ref(false)

function editBangdong2 (row) {
  watchers.forEach((unwatch) => unwatch())
  watchers = []
  // 雞胸便當主餐歸零
  for (const bangdong2EditMain of bangdong2EditMains) {
    bangdong2EditMain.quantity = 0
  }
  // 雞胸便當飲料歸零
  for (const bangdong2EditDrink of bangdong2EditDrinks) {
    bangdong2EditDrink.quantity = 0
  }
  // 雞胸便當配菜歸零
  for (const bangdong2EditSideDish of bangdong2EditSideDishes) {
    bangdong2EditSideDish.quantity = 0
  }
  // 雞胸便當副主餐歸零
  for (const bangdong2EditBentoMain of bangdong2EditBentoMains) {
    bangdong2EditBentoMain.quantity = 0
  }
  // 雞胸便當主餐隱藏欄位歸零
  for (const input of row.inputs) {
    const name = input.name
    const value = input.value
    // 任意搭配抓取推入
    if (input.name === '任意搭配') {
      bangdong2EditArbitrarily.value = input.value
    }
    // 雞胸便當  主餐  推入 input 數值
    const mainIndex = bangdong2EditMains.findIndex(
      (bangdong2EditMain) =>
        bangdong2EditMain.name === name || bangdong2EditMain.shortname === name
    )
    if (mainIndex >= 0) {
      bangdong2EditMains[mainIndex].quantity = parseInt(value)
    }
    // 雞胸便當  飲料  推入 input 數值
    const drinkIndex = bangdong2EditDrinks.findIndex(
      (bangdong2EditDrink) => bangdong2EditDrink.name === name
    )
    if (drinkIndex >= 0) {
      bangdong2EditDrinks[drinkIndex].quantity = parseInt(value)
    }
    /// / 雞胸便當  配菜  推入 input 數值
    setTimeout(() => {
      const sideDishIndex = bangdong2EditSideDishes.findIndex(
        (bangdong2EditSideDish) => bangdong2EditSideDish.name === name
      )
      if (sideDishIndex >= 0) {
        bangdong2EditSideDishes[sideDishIndex].quantity = parseInt(value)
      }
      // 雞胸便當  副主餐  推入 input 數值
      const bentoMainIndex = bangdong2EditBentoMains.findIndex(
        (bangdong2EditBentoMain) => bangdong2EditBentoMain.name === name
      )
      if (bentoMainIndex >= 0) {
        bangdong2EditBentoMains[bentoMainIndex].quantity = parseInt(value)
      }
    }, 2000)
  }
  // 監聽主餐的數量變化

  editingRow = row
  bangdong2EditTotalQuantity.value = row.quantity
  bangdong2Comment.value = row.comment
  editDialog2.value = true
}

// 雞胸便當總數量
watch(bangdong2EditMains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  bangdong2EditArbitrarily.value = Math.max(
    0,
    parseInt(bangdong2EditTotalQuantity.value) - mainQuantityTotal
  )
})
// 雞胸便當單價
const bangdong2EditPrice = computed(() => {
  return bangdong2Price.value
})
// 雞胸便當總價格
const bangdong2EditTotalQuantityPrice = computed(() => {
  const totalPrice =
    bangdong2EditTotalQuantity.value * bangdong2EditPrice.value

  return totalPrice
})
const bangdong2EditoptionPrice = computed(() => {
  let totalPrice = 0
  bangdong2EditDrinks.forEach((drink) => {
    totalPrice += drink.quantity * drink.price
  })
  bangdong2EditSideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })

  return totalPrice
})

const bangdong2EditfinalTotal = computed(() => {
  const totalPrice =
    bangdong2EditoptionPrice.value + bangdong2EditTotalQuantityPrice.value
  return totalPrice
})
// 關閉修正欄位
function closeEditDialog2 () {
  editDialog2.value = false
}
// 完成後儲存並且將資料推進 tableRows 刪除原本的資料
function saveEditDialog2 () {
  if (bangdong2EditTotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  // 檢查總數量是否匹配
  const calculatedTotalQuantity = bangdong2EditMains.reduce(
    (acc, main) => acc + (main.quantity || 0),
    0
  )
  console.log(calculatedTotalQuantity, bangdong2EditTotalQuantity.value)
  if (
    calculatedTotalQuantity !== parseInt(bangdong2EditTotalQuantity.value, 10)
  ) {
    alert('主餐總數量與輸入的總數量不搭！')
    return
  }
  const row = {
    bentoType: 2,
    id: editingRow.id, // 使用新生成的 ID
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: '',
    price: bangdong2EditfinalTotal.value,
    optionPrice: bangdong2EditoptionPrice.value,
    totalPrice: bangdong2EditTotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: bangdong2Comment.value
  }

  const totalEditQuantity = bangdong2EditTotalQuantity.value // 計算總數量
  row.quantity = bangdong2EditTotalQuantity.value
  // 儲存推入主餐置入 table
  for (const bangdong2EditMain of bangdong2EditMains) {
    if (bangdong2EditMain.quantity > 0) {
      row.Main +=
        bangdong2EditMain.name +
        'x' +
        parseInt(bangdong2EditMain.quantity).toString() +
        '<br>'
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: bangdong2MainMealId.value,
        productTypeName: bangdong2MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdong2EditMain.id,
        name: bangdong2EditMain.name,
        value: parseInt(bangdong2EditMain.quantity),
        type: 1
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入飲料置入 table
  for (const bangdong2EditDrink of bangdong2EditDrinks) {
    if (bangdong2EditDrink.quantity > 0) {
      row.drinks +=
        bangdong2EditDrink.name +
        'x' +
        parseInt(bangdong2EditDrink.quantity).toString() +
        '<br>'
      // 保留飲料名稱、飲料 ID
      const productInput = {
        productTypeName: bangdong2DrinkName.value,
        productTypeId: bangdong2DrinkId.value,
        productType: 'options_with_qty',
        type: 2
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdong2EditDrink.id,
        name: bangdong2EditDrink.name,
        value: parseInt(bangdong2EditDrink.quantity),
        type: 2
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入配菜置入 table
  for (const bangdong2EditSideDish of bangdong2EditSideDishes) {
    if (bangdong2EditSideDish.quantity > 0) {
      row.sideDishes +=
        bangdong2EditSideDish.name +
        'x' +
        parseInt(bangdong2EditSideDish.quantity).toString() +
        '<br>'
      // 保留配菜名稱、ID
      const productInput = {
        productTypeName: bangdong2SideDishName.value,
        productTypeId: bangdong2SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      row.sideDishDefault += bangdong2EditSideDish.is_default + ' '
      const input = {
        id: bangdong2EditSideDish.id,
        name: bangdong2EditSideDish.name,
        value: parseInt(bangdong2EditSideDish.quantity),
        is_default: bangdong2EditSideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入副主餐置入 table
  for (const bangdong2EditBentoMain of bangdong2EditBentoMains) {
    if (bangdong2EditBentoMain.quantity > 0) {
      row.bentoMains +=
        bangdong2EditBentoMain.name +
        'x' +
        parseInt(bangdong2EditBentoMain.quantity).toString() +
        '<br>'
      const productInput = {
        productTypeName: bangdong2BentoMainName.value,
        productTypeId: bangdong2BentoMainId.value,
        productType: 'options_with_qty',
        type: 4
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdong2EditBentoMain.id,
        name: bangdong2EditBentoMain.name,
        value: parseInt(bangdong2EditBentoMain.quantity),
        type: 4
      }
      row.inputs.push(input)
    }
  }
  // 保留 雞胸便當、1002、數量
  const productInput = {
    id: bangdong2ProductId.value,
    name: bangdong2Name.value,
    value: parseInt(totalEditQuantity),
    price: bangdong2EditPrice.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: bangdong2Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (bangdong2EditArbitrarily.value > 0) {
    if (row.Main !== '') {
      row.Main += ','
    }
    row.Main +=
      '任意搭配' + 'x' + parseInt(bangdong2EditArbitrarily.value).toString()
    const input = {
      id: 'bangdong2EditArbitrarily',
      value: bangdong2EditArbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = bangdong2Name.value + totalEditQuantity + '份' // 使用總數量
  checkVegetable(row)
  // 將這個 row 推進 tableRows 中
  const rowIndex = tableRows.findIndex((r) => r === editingRow)
  if (rowIndex !== -1) {
    tableRows.splice(rowIndex, 1, row) // 在移除元素的同時插入新元素
  }
  editDialog2.value = false
  bangdong2EditArbitrarily.value = 0
  console.log(row)
}
// 雞腿便當修改
const editDialog3 = ref(false)
function editBangdong3 (row) {
  watchers.forEach((unwatch) => unwatch())
  watchers = []
  // 雞腿便當主餐歸零
  for (const bangdong3EditMain of bangdong3EditMains) {
    bangdong3EditMain.quantity = 0
  }
  // 雞腿便當飲料歸零
  for (const bangdong3EditDrink of bangdong3EditDrinks) {
    bangdong3EditDrink.quantity = 0
  }
  // 雞腿便當配菜歸零
  for (const bangdong3EditSideDish of bangdong3EditSideDishes) {
    bangdong3EditSideDish.quantity = 0
  }
  // 雞腿便當副主餐歸零
  for (const bangdong3EditBentoMain of bangdong3EditBentoMains) {
    bangdong3EditBentoMain.quantity = 0
  }
  // 雞腿便當主餐隱藏欄位歸零
  for (const input of row.inputs) {
    const name = input.name
    const value = input.value
    // 任意搭配抓取推入
    if (input.name === '任意搭配') {
      bangdong3EditArbitrarily.value = input.value
    }
    // 雞腿便當  主餐  推入 input 數值
    const mainIndex = bangdong3EditMains.findIndex(
      (bangdong3EditMain) =>
        bangdong3EditMain.name === name || bangdong3EditMain.shortname === name
    )
    if (mainIndex >= 0) {
      bangdong3EditMains[mainIndex].quantity = parseInt(value)
    }
    // 雞腿便當  飲料  推入 input 數值
    const drinkIndex = bangdong3EditDrinks.findIndex(
      (bangdong3EditDrink) => bangdong3EditDrink.name === name
    )
    if (drinkIndex >= 0) {
      bangdong3EditDrinks[drinkIndex].quantity = parseInt(value)
    }
    setTimeout(() => {
      // 雞腿便當  配菜  推入 input 數值
      const sideDishIndex = bangdong3EditSideDishes.findIndex(
        (bangdong3EditSideDish) => bangdong3EditSideDish.name === name
      )
      if (sideDishIndex >= 0) {
        bangdong3EditSideDishes[sideDishIndex].quantity = parseInt(value)
      }
      // 雞腿便當  副主餐  推入 input 數值
      const bentoMainIndex = bangdong3EditBentoMains.findIndex(
        (bangdong3EditBentoMain) => bangdong3EditBentoMain.name === name
      )
      if (bentoMainIndex >= 0) {
        bangdong3EditBentoMains[bentoMainIndex].quantity = parseInt(value)
      }
    }, 2000)
  }
  // 監聽主餐的數量變化

  editingRow = row
  bangdong3EditTotalQuantity.value = row.quantity
  bangdong3Comment.value = row.comment
  editDialog3.value = true
}

// 雞腿便當修正區總數量
watch(bangdong3EditMains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  bangdong3EditArbitrarily.value = Math.max(
    0,
    parseInt(bangdong3EditTotalQuantity.value) - mainQuantityTotal
  )
})
// 雞腿便當單價
const bangdong3EditPrice = computed(() => {
  return bangdong3Price.value
})
// 雞腿便當總價格
const bangdong3EditTotalQuantityPrice = computed(() => {
  const totalPrice =
    bangdong3EditTotalQuantity.value * bangdong3EditPrice.value
  return totalPrice
})
const bangdong3EditoptionPrice = computed(() => {
  let totalPrice = 0
  bangdong3EditDrinks.forEach((drink) => {
    totalPrice += drink.quantity * drink.price
  })
  bangdong3EditSideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
const bangdong3EditfinalTotal = computed(() => {
  const totalPrice =
    bangdong3EditoptionPrice.value + bangdong3EditTotalQuantityPrice.value
  return totalPrice
})
// 關閉修正欄位
function closeEditDialog3 () {
  editDialog3.value = false
}
// 完成後儲存並且將資料推進 tableRows 刪除原本的資料
function saveEditDialog3 () {
  if (bangdong3EditTotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  // 檢查總數量是否匹配
  const calculatedTotalQuantity = bangdong3EditMains.reduce(
    (acc, main) => acc + (main.quantity || 0),
    0
  )
  console.log(calculatedTotalQuantity, bangdong3EditTotalQuantity.value)
  if (
    calculatedTotalQuantity !== parseInt(bangdong3EditTotalQuantity.value, 10)
  ) {
    alert('主餐總數量與輸入的總數量不搭！')
    return
  }
  const row = {
    bentoType: 3,
    id: editingRow.id, // 使用新生成的 ID
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: '',
    price: bangdong3EditfinalTotal.value,
    optionPrice: bangdong3EditoptionPrice.value,
    totalPrice: bangdong3EditTotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: bangdong3Comment.value
  }

  const totalEditQuantity = bangdong3EditTotalQuantity.value // 計算總數量
  row.quantity = totalEditQuantity
  // 儲存推入主餐置入 table
  for (const bangdong3EditMain of bangdong3EditMains) {
    if (bangdong3EditMain.quantity > 0) {
      row.Main +=
        bangdong3EditMain.name +
        ' x ' +
        parseInt(bangdong3EditMain.quantity).toString() +
        '<br>'
      // 保留 雞腿便當、1003、數量、主餐名稱、主餐 ID
      const productInput = {
        productTypeId: bangdong3MainMealId.value,
        productTypeName: bangdong3MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdong3EditMain.id,
        name: bangdong3EditMain.name,
        value: parseInt(bangdong3EditMain.quantity),
        type: 1
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入飲料置入 table
  for (const bangdong3EditDrink of bangdong3EditDrinks) {
    if (bangdong3EditDrink.quantity > 0) {
      row.drinks +=
        bangdong3EditDrink.name +
        ' x ' +
        parseInt(bangdong3EditDrink.quantity).toString() +
        '<br>'
      // 保留飲料名稱、飲料 ID
      const productInput = {
        productTypeName: bangdong3DrinkName.value,
        productTypeId: bangdong3DrinkId.value,
        productType: 'options_with_qty',
        type: 2
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdong3EditDrink.id,
        name: bangdong3EditDrink.name,
        value: parseInt(bangdong3EditDrink.quantity),
        type: 2
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入配菜置入 table
  for (const bangdong3EditSideDish of bangdong3EditSideDishes) {
    if (bangdong3EditSideDish.quantity > 0) {
      row.sideDishes +=
        bangdong3EditSideDish.name +
        'x' +
        parseInt(bangdong3EditSideDish.quantity).toString() +
        '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: bangdong3SideDishName.value,
        productTypeId: bangdong3SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      row.sideDishDefault += bangdong3EditSideDish.is_default + ' '
      const input = {
        id: bangdong3EditSideDish.id,
        name: bangdong3EditSideDish.name,
        value: parseInt(bangdong3EditSideDish.quantity),
        is_default: bangdong3EditSideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入副主餐置入 table
  for (const bangdong3EditBentoMain of bangdong3EditBentoMains) {
    if (bangdong3EditBentoMain.quantity > 0) {
      row.bentoMains +=
        bangdong3EditBentoMain.name +
        'x' +
        parseInt(bangdong3EditBentoMain.quantity).toString()
      // 保留副主餐名稱、副主餐 ID
      const productInput = {
        productTypeName: bangdong3BentoMainName.value,
        productTypeId: bangdong3BentoMainId.value,
        productType: 'options_with_qty',
        type: 4
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdong3EditBentoMain.id,
        name: bangdong3EditBentoMain.name,
        value: parseInt(bangdong3EditBentoMain.quantity),
        type: 4
      }
      row.inputs.push(input)
    }
  }
  // 保留 雞腿便當、1003、數量
  const productInput = {
    id: bangdong3ProductId.value,
    name: bangdong3Name.value,
    value: parseInt(totalEditQuantity),
    price: bangdong3EditPrice.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: bangdong3Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (bangdong3EditArbitrarily.value > 0) {
    row.Main +=
      '任意搭配' +
      'x' +
      parseInt(bangdong3EditArbitrarily.value).toString() +
      '<br>'
    const input = {
      id: 'bangdong3EditArbitrarily',
      value: bangdong3EditArbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = bangdong3Name.value + totalEditQuantity + '份' // 使用總數量
  checkVegetable(row)
  // 將這個 row 推進 tableRows 中
  const rowIndex = tableRows.findIndex((r) => r === editingRow)
  if (rowIndex !== -1) {
    tableRows.splice(rowIndex, 1, row) // 在移除元素的同時插入新元素
  }

  editDialog3.value = false
  bangdong3EditArbitrarily.value = 0
  console.log(row)
}

// 滷牛便當修改
const editDialog4 = ref(false)
function editBangdong4 (row) {
  watchers.forEach((unwatch) => unwatch())
  watchers = []
  // 滷牛便當主餐歸零
  for (const bangdong4EditMain of bangdong4EditMains) {
    bangdong4EditMain.quantity = 0
  }
  // 滷牛便當飲料歸零
  for (const bangdong4EditDrink of bangdong4EditDrinks) {
    bangdong4EditDrink.quantity = 0
  }
  // 滷牛便當配菜歸零
  for (const bangdong4EditSideDish of bangdong4EditSideDishes) {
    bangdong4EditSideDish.quantity = 0
  }
  // 滷牛便當副主餐歸零
  for (const bangdong4EditBentoMain of bangdong4EditBentoMains) {
    bangdong4EditBentoMain.quantity = 0
  }
  // 滷牛便當主餐隱藏欄位歸零
  for (const input of row.inputs) {
    const name = input.name
    const value = input.value
    // 任意搭配抓取推入
    if (input.name === '任意搭配') {
      bangdong4EditArbitrarily.value = input.value
    }
    // 滷牛便當  主餐  推入 input 數值
    const mainIndex = bangdong4EditMains.findIndex(
      (bangdong4EditMain) =>
        bangdong4EditMain.name === name || bangdong4EditMain.shortname === name
    )
    if (mainIndex >= 0) {
      bangdong4EditMains[mainIndex].quantity = parseInt(value)
    }
    // 滷牛便當  飲料  推入 input 數值
    const drinkIndex = bangdong4EditDrinks.findIndex(
      (bangdong4EditDrink) => bangdong4EditDrink.name === name
    )
    if (drinkIndex >= 0) {
      bangdong4EditDrinks[drinkIndex].quantity = parseInt(value)
    }
    setTimeout(() => {
      // 滷牛便當  配菜  推入 input 數值
      const sideDishIndex = bangdong4EditSideDishes.findIndex(
        (bangdong4EditSideDish) => bangdong4EditSideDish.name === name
      )
      if (sideDishIndex >= 0) {
        bangdong4EditSideDishes[sideDishIndex].quantity = parseInt(value)
      }
      // 滷牛便當  副主餐  推入 input 數值
      const bentoMainIndex = bangdong4EditBentoMains.findIndex(
        (bangdong4EditBentoMain) => bangdong4EditBentoMain.name === name
      )
      if (bentoMainIndex >= 0) {
        bangdong4EditBentoMains[bentoMainIndex].quantity = parseInt(value)
      }
    }, 2000)
  }
  // 監聽主餐的數量變化

  editingRow = row
  bangdong4EditTotalQuantity.value = row.quantity
  bangdong4Comment.value = row.comment
  editDialog4.value = true
}
// 滷牛便當總數量
watch(bangdong4EditMains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  bangdong4EditArbitrarily.value = Math.max(
    0,
    parseInt(bangdong4EditTotalQuantity.value) - mainQuantityTotal
  )
})
// 滷牛便當單價
const bangdong4EditPrice = computed(() => {
  return bangdong4Price.value
})
// 滷牛便當總價格
const bangdong4EditTotalQuantityPrice = computed(() => {
  const totalPrice =
    bangdong4EditTotalQuantity.value * bangdong4EditPrice.value
  return totalPrice
})
const bangdong4EditoptionPrice = computed(() => {
  let totalPrice = 0
  bangdong4EditDrinks.forEach((drink) => {
    totalPrice += drink.quantity * drink.price
  })
  bangdong4EditSideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
const bangdong4EditfinalTotal = computed(() => {
  const totalPrice =
    bangdong4EditoptionPrice.value + bangdong4EditTotalQuantityPrice.value
  return totalPrice
})
// 關閉修正欄位
function closeEditDialog4 () {
  editDialog4.value = false
}
// 完成後儲存並且將資料推進 tableRows 刪除原本的資料
function saveEditDialog4 () {
  if (bangdong4EditTotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  // 檢查總數量是否匹配
  const calculatedTotalQuantity = bangdong4EditMains.reduce(
    (acc, main) => acc + (main.quantity || 0),
    0
  )
  console.log(calculatedTotalQuantity, bangdong4EditTotalQuantity.value)
  if (
    calculatedTotalQuantity !== parseInt(bangdong4EditTotalQuantity.value, 10)
  ) {
    alert('主餐總數量與輸入的總數量不搭！')
    return
  }
  const row = {
    bentoType: 4,
    id: editingRow.id, // 使用新生成的 ID
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: '',
    price: bangdong4EditfinalTotal.value,
    optionPrice: bangdong4EditoptionPrice.value,
    totalPrice: bangdong4EditTotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: bangdong4Comment.value
  }

  const totalEditQuantity = bangdong4EditTotalQuantity.value // 計算總數量
  row.quantity = totalEditQuantity
  // 儲存推入主餐置入 table
  for (const bangdong4EditMain of bangdong4EditMains) {
    if (bangdong4EditMain.quantity > 0) {
      row.Main +=
        bangdong4EditMain.name +
        'x' +
        parseInt(bangdong4EditMain.quantity).toString() +
        '<br>'
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: bangdong4MainMealId.value,
        productTypeName: bangdong4MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdong4EditMain.id,
        name: bangdong4EditMain.name,
        value: parseInt(bangdong4EditMain.quantity),
        type: 1
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入飲料置入 table
  for (const bangdong4EditDrink of bangdong4EditDrinks) {
    if (bangdong4EditDrink.quantity > 0) {
      row.drinks +=
        bangdong4EditDrink.name +
        'x' +
        parseInt(bangdong4EditDrink.quantity).toString() +
        '<br>'
      // 保留飲料名稱、飲料 ID
      const productInput = {
        productTypeName: bangdong4DrinkName.value,
        productTypeId: bangdong4DrinkId.value,
        productType: 'options_with_qty',
        type: 2
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdong4EditDrink.id,
        name: bangdong4EditDrink.name,
        value: parseInt(bangdong4EditDrink.quantity),
        type: 2
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入配菜置入 table
  for (const bangdong4EditSideDish of bangdong4EditSideDishes) {
    if (bangdong4EditSideDish.quantity > 0) {
      row.sideDishes +=
        bangdong4EditSideDish.name +
        'x' +
        parseInt(bangdong4EditSideDish.quantity).toString() +
        '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: bangdong4SideDishName.value,
        productTypeId: bangdong4SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      row.sideDishDefault += bangdong4EditSideDish.is_default + ' '
      const input = {
        id: bangdong4EditSideDish.id,
        name: bangdong4EditSideDish.name,
        value: parseInt(bangdong4EditSideDish.quantity),
        is_default: bangdong4EditSideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入副主餐置入 table
  for (const bangdong4EditBentoMain of bangdong4EditBentoMains) {
    if (bangdong4EditBentoMain.quantity > 0) {
      row.bentoMains +=
        bangdong4EditBentoMain.name +
        'x' +
        parseInt(bangdong4EditBentoMain.quantity).toString() +
        '<br>'
      // 保留副主餐名稱、副主餐 ID
      const productInput = {
        productTypeName: bangdong4BentoMainName.value,
        productTypeId: bangdong4BentoMainId.value,
        productType: 'options_with_qty',
        type: 4
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdong4EditBentoMain.id,
        name: bangdong4EditBentoMain.name,
        value: parseInt(bangdong4EditBentoMain.quantity),
        type: 4
      }
      row.inputs.push(input)
    }
  }
  // 保留 滷牛便當、1004、數量
  const productInput = {
    id: bangdong4ProductId.value,
    name: bangdong4Name.value,
    value: parseInt(totalEditQuantity),
    price: bangdong4EditPrice.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: bangdong4Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (bangdong4EditArbitrarily.value > 0) {
    row.Main +=
      '任意搭配' + 'x' + parseInt(bangdong4EditArbitrarily.value).toString()
    const input = {
      id: 'bangdong4EditArbitrarily',
      value: bangdong4EditArbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = bangdong4Name.value + totalEditQuantity + '份' // 使用總數量
  checkVegetable(row)
  // 將這個 row 推進 tableRows 中
  const rowIndex = tableRows.findIndex((r) => r === editingRow)
  if (rowIndex !== -1) {
    tableRows.splice(rowIndex, 1, row) // 在移除元素的同時插入新元素
  }
  editDialog4.value = false
  bangdong4EditArbitrarily.value = 0
}
// 修改欄位

const bangdongSalmonEditMains = reactive([])
const bangdongSalmonEditDrinks = reactive([])
const bangdongSalmonEditSideDishes = reactive([])
const bangdongSalmonEditBentoMains = reactive([])
const loadBangdongSalmonEdit = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get('catalog/product/1080')
    const productOptions = response.data.product_options

    // 主餐
    const mainMeal = productOptions.main_meal
    const values = mainMeal.product_option_values

    for (const value of values) {
      const bangdongSalmonEditMain = {
        id: value.id,
        name: value.name,
        quantity: 0,
        hidenquantity: 0,
        shortname: value.short_name
      }
      bangdongSalmonEditMains.push(bangdongSalmonEditMain)
    }
    // 飲料
    const Drink = productOptions.drink
    const DrinkValues = Drink.product_option_values
    for (const DrinkValue of DrinkValues) {
      const bangdongSalmonEditDrink = {
        id: DrinkValue.id,
        name: DrinkValue.name,
        quantity: 0,
        hidenquantity: 0,
        price: DrinkValue.price
      }
      bangdongSalmonEditDrinks.push(bangdongSalmonEditDrink)
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values
    for (const sideDishValue of sideDishValues) {
      const bangdongSalmonEditSideDish = {
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        hidenquantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      }
      bangdongSalmonEditSideDishes.push(bangdongSalmonEditSideDish)
    }
    // 副主餐
    const bentoMain = productOptions.bento_main
    const bentoMainValues = bentoMain.product_option_values
    for (const bentoMainValue of bentoMainValues) {
      const bangdongSalmonEditBentoMain = {
        id: bentoMainValue.id,
        name: bentoMainValue.name,
        quantity: 0,
        is_default: bentoMainValue.is_default,
        hidenquantity: 0
      }
      bangdongSalmonEditBentoMains.push(bangdongSalmonEditBentoMain)
    }

    bangdongSalmonMainName.value = mainMeal.name
    bangdongSalmonDrinkName.value = Drink.name
    bangdongSalmonSideDishName.value = sideDish.name
    bangdongSalmonBentoMainName.value = bentoMain.name
    bangdongSalmonPrice.value = parseInt(response.data.price)
    bangdongSalmonEditMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            // 配菜的數量跟著主餐的數量變化
            bangdongSalmonEditSideDishes.forEach((sideDish) => {
              const diff = Number(newVal) - Number(oldVal)
              if (sideDish.is_default) {
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
          // 副主餐的數量跟著主餐的數量變化
          bangdongSalmonEditBentoMains.forEach((bentoMain) => {
            const diff = Number(newVal) - Number(oldVal)
            if (bentoMain.is_default) {
              const newQuantity = Number(bentoMain.quantity) + diff
              // 確保副主餐數量不會變成負數
              bentoMain.quantity = newQuantity >= 0 ? newQuantity : 0
            }
          })
        }
      )
    })
    bangdongSalmonEditDrinks.forEach((drink) => {
      watch(
        () => drink.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            drink.quantity = 0
          }
        }
      )
    })
    bangdongSalmonEditSideDishes.forEach((sideDish) => {
      watch(
        () => sideDish.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            sideDish.quantity = 0
          }
        }
      )
    })
    bangdongSalmonEditBentoMains.forEach((bentoMain) => {
      watch(
        () => bentoMain.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            bentoMain.quantity = 0
          }
        }
      )
    })
  } catch (error) {
    console.error(error)
  }
}
// 鮭魚修改
const editDialogSalmon = ref(false)
function editBangdongSalmon (row) {
  watchers.forEach((unwatch) => unwatch())
  watchers = []
  for (const bangdongSalmonEditMain of bangdongSalmonEditMains) {
    bangdongSalmonEditMain.quantity = 0
  }
  for (const bangdongSalmonEditDrink of bangdongSalmonEditDrinks) {
    bangdongSalmonEditDrink.quantity = 0
  }
  for (const bangdongSalmonEditSideDish of bangdongSalmonEditSideDishes) {
    bangdongSalmonEditSideDish.quantity = 0
  }
  for (const bangdongSalmonEditBentoMain of bangdongSalmonEditBentoMains) {
    bangdongSalmonEditBentoMain.quantity = 0
  }
  // 滷牛便當主餐隱藏欄位歸零
  for (const input of row.inputs) {
    const name = input.name
    const value = input.value
    // 任意搭配抓取推入
    if (input.name === '任意搭配') {
      bangdongSalmonEditArbitrarily.value = input.value
    }
    // 滷牛便當  主餐  推入 input 數值
    const mainIndex = bangdongSalmonEditMains.findIndex(
      (bangdongSalmonEditMain) =>
        bangdongSalmonEditMain.name === name ||
        bangdongSalmonEditMain.shortname === name
    )
    if (mainIndex >= 0) {
      bangdongSalmonEditMains[mainIndex].quantity = parseInt(value)
    }
    // 滷牛便當  飲料  推入 input 數值
    const drinkIndex = bangdongSalmonEditDrinks.findIndex(
      (bangdongSalmonEditDrink) => bangdongSalmonEditDrink.name === name
    )
    if (drinkIndex >= 0) {
      bangdongSalmonEditDrinks[drinkIndex].quantity = parseInt(value)
    }
    // salmon  配菜  推入 input 數值
    setTimeout(() => {
      const sideDishIndex = bangdongSalmonEditSideDishes.findIndex(
        (bangdongSalmonEditSideDish) => bangdongSalmonEditSideDish.name === name
      )
      if (sideDishIndex >= 0) {
        bangdongSalmonEditSideDishes[sideDishIndex].quantity = parseInt(value)
      }
      // salmon  副主餐  推入 input 數值
      const bentoMainIndex = bangdongSalmonEditBentoMains.findIndex(
        (bangdongSalmonEditBentoMain) =>
          bangdongSalmonEditBentoMain.name === name
      )
      if (bentoMainIndex >= 0) {
        bangdongSalmonEditBentoMains[bentoMainIndex].quantity = parseInt(value)
      }
    }, 2000)
  }
  // 監聽主餐的數量變化

  editingRow = row
  bangdongSalmonEditTotalQuantity.value = row.quantity
  bangdongSalmonComment.value = row.comment
  editDialogSalmon.value = true
}

watch(bangdongSalmonEditMains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  bangdongSalmonEditArbitrarily.value = Math.max(
    0,
    parseInt(bangdongSalmonEditTotalQuantity.value) - mainQuantityTotal
  )
})

const bangdongSalmonEditPrice = computed(() => {
  return bangdongSalmonPrice.value
})
const bangdongSalmonEditTotalQuantityPrice = computed(() => {
  const totalPrice =
    bangdongSalmonEditTotalQuantity.value * bangdongSalmonEditPrice.value
  return totalPrice
})
const bangdongSalmonEditoptionPrice = computed(() => {
  let totalPrice = 0
  bangdongSalmonEditDrinks.forEach((drink) => {
    totalPrice += drink.quantity * drink.price
  })
  bangdongSalmonEditSideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
const bangdongSalmonEditfinalTotal = computed(() => {
  const totalPrice =
    bangdongSalmonEditoptionPrice.value +
    bangdongSalmonEditTotalQuantityPrice.value
  return totalPrice
})
// 關閉修正欄位
function closeEditDialogSalmon () {
  editDialogSalmon.value = false
}
// 完成後儲存並且將資料推進 tableRows 刪除原本的資料
function saveEditDialogSalmon () {
  if (bangdongSalmonEditTotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  // 檢查總數量是否匹配
  const calculatedTotalQuantity = bangdongSalmonEditMains.reduce(
    (acc, main) => acc + (main.quantity || 0),
    0
  )
  console.log(calculatedTotalQuantity, bangdongSalmonEditTotalQuantity.value)
  if (
    calculatedTotalQuantity !==
    parseInt(bangdongSalmonEditTotalQuantity.value, 10)
  ) {
    alert('主餐總數量與輸入的總數量不搭！')
    return
  }
  const row = {
    bentoType: 13,
    id: editingRow.id, // 使用新生成的 ID
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: '',
    price: bangdongSalmonEditfinalTotal.value,
    optionPrice: bangdongSalmonEditoptionPrice.value,
    totalPrice: bangdongSalmonEditTotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: bangdongSalmonComment.value
  }

  const totalEditQuantity = bangdongSalmonEditTotalQuantity.value // 計算總數量
  row.quantity = totalEditQuantity
  // 儲存推入主餐置入 table
  for (const bangdongSalmonEditMain of bangdongSalmonEditMains) {
    if (bangdongSalmonEditMain.quantity > 0) {
      row.Main +=
        bangdongSalmonEditMain.name +
        'x' +
        parseInt(bangdongSalmonEditMain.quantity).toString() +
        '<br>'
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: bangdongSalmonMainMealId.value,
        productTypeName: bangdongSalmonMainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongSalmonEditMain.id,
        name: bangdongSalmonEditMain.name,
        value: parseInt(bangdongSalmonEditMain.quantity),
        type: 1
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入飲料置入 table
  for (const bangdongSalmonEditDrink of bangdongSalmonEditDrinks) {
    if (bangdongSalmonEditDrink.quantity > 0) {
      row.drinks +=
        bangdongSalmonEditDrink.name +
        'x' +
        parseInt(bangdongSalmonEditDrink.quantity).toString() +
        '<br>'
      // 保留飲料名稱、飲料 ID
      const productInput = {
        productTypeName: bangdongSalmonDrinkName.value,
        productTypeId: bangdongSalmonDrinkId.value,
        productType: 'options_with_qty',
        type: 2
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongSalmonEditDrink.id,
        name: bangdongSalmonEditDrink.name,
        value: parseInt(bangdongSalmonEditDrink.quantity),
        type: 2
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入配菜置入 table
  for (const bangdongSalmonEditSideDish of bangdongSalmonEditSideDishes) {
    if (bangdongSalmonEditSideDish.quantity > 0) {
      row.sideDishes +=
        bangdongSalmonEditSideDish.name +
        'x' +
        parseInt(bangdongSalmonEditSideDish.quantity).toString() +
        '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: bangdongSalmonSideDishName.value,
        productTypeId: bangdongSalmonSideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      row.sideDishDefault += bangdongSalmonEditSideDish.is_default + ' '
      const input = {
        id: bangdongSalmonEditSideDish.id,
        name: bangdongSalmonEditSideDish.name,
        value: parseInt(bangdongSalmonEditSideDish.quantity),
        is_default: bangdongSalmonEditSideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入副主餐置入 table
  for (const bangdongSalmonEditBentoMain of bangdongSalmonEditBentoMains) {
    if (bangdongSalmonEditBentoMain.quantity > 0) {
      row.bentoMains +=
        bangdongSalmonEditBentoMain.name +
        'x' +
        parseInt(bangdongSalmonEditBentoMain.quantity).toString() +
        '<br>'
      // 保留副主餐名稱、副主餐 ID
      const productInput = {
        productTypeName: bangdongSalmonBentoMainName.value,
        productTypeId: bangdongSalmonBentoMainId.value,
        productType: 'options_with_qty',
        type: 4
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongSalmonEditBentoMain.id,
        name: bangdongSalmonEditBentoMain.name,
        value: parseInt(bangdongSalmonEditBentoMain.quantity),
        type: 4
      }
      row.inputs.push(input)
    }
  }
  // 保留 滷牛便當、1004、數量
  const productInput = {
    id: bangdongSalmonProductId.value,
    name: bangdongSalmonName.value,
    value: parseInt(totalEditQuantity),
    price: bangdongSalmonEditPrice.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: bangdongSalmonComment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (bangdongSalmonEditArbitrarily.value > 0) {
    row.Main +=
      '任意搭配' +
      'x' +
      parseInt(bangdongSalmonEditArbitrarily.value).toString()
    const input = {
      id: 'bangdongSalmonEditArbitrarily',
      value: bangdongSalmonEditArbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = bangdongSalmonName.value + totalEditQuantity + '份' // 使用總數量
  checkVegetable(row)
  // 將這個 row 推進 tableRows 中
  const rowIndex = tableRows.findIndex((r) => r === editingRow)
  if (rowIndex !== -1) {
    tableRows.splice(rowIndex, 1, row) // 在移除元素的同時插入新元素
  }
  editDialogSalmon.value = false
  bangdongSalmonEditArbitrarily.value = 0
  console.log(row)
}
const ResetbangdongSalmon = () => {
  bangdongSalmonMains.forEach((bangdongSalmonMain) => {
    bangdongSalmonMain.quantity = 0
  })
  bangdongSalmonDrinks.forEach((bangdongSalmonDrink) => {
    bangdongSalmonDrink.quantity = 0
  })
  bangdongSalmonSideDishes.forEach((bangdongSalmonSideDish) => {
    bangdongSalmonSideDish.quantity = 0
  })
  bangdongSalmonBentoMains.forEach((bangdongSalmonBentoMain) => {
    bangdongSalmonBentoMain.quantity = 0
  })
  showbangdongSalmon.value = false
  bangdongSalmonTotalQuantity.value = 0
  bangdongSalmonArbitrarily.value = 0
}
// 素食便當 125 修改

const editDialogV1 = ref(false)

function editBangdongVegetarian1 (row) {
  watchers.forEach((unwatch) => unwatch())
  watchers = []
  // 素食便當 125 主餐歸零
  for (const bangdongVegetarian1EditMain of bangdongVegetarian1EditMains) {
    bangdongVegetarian1EditMain.quantity = 0
  }
  // 素食便當 125 飲料歸零
  for (const bangdongVegetarian1EditDrink of bangdongVegetarian1EditDrinks) {
    bangdongVegetarian1EditDrink.quantity = 0
  }
  // 素食便當 125 配菜歸零
  for (const bangdongVegetarian1EditSideDish of bangdongVegetarian1EditSideDishes) {
    bangdongVegetarian1EditSideDish.quantity = 0
  }
  // 素食便當 125 副主餐歸零
  for (const bangdongVegetarian1EditBentoMain of bangdongVegetarian1EditBentoMains) {
    bangdongVegetarian1EditBentoMain.quantity = 0
  }
  // 素食便當 125 主餐隱藏欄位歸零
  for (const input of row.inputs) {
    const name = input.name
    const value = input.value
    // 任意搭配抓取推入
    if (input.name === '任意搭配') {
      bangdongVegetarian1EditArbitrarily.value = input.value
    }
    // 素食便當 125  主餐  推入 input 數值
    const mainIndex = bangdongVegetarian1EditMains.findIndex(
      (bangdongVegetarian1EditMain) =>
        bangdongVegetarian1EditMain.name === name ||
        bangdongVegetarian1EditMain.shortname === name
    )
    if (mainIndex >= 0) {
      bangdongVegetarian1EditMains[mainIndex].quantity = parseInt(value)
    }
    // 素食便當 125  飲料  推入 input 數值
    const drinkIndex = bangdongVegetarian1EditDrinks.findIndex(
      (bangdongVegetarian1EditDrink) =>
        bangdongVegetarian1EditDrink.name === name
    )
    if (drinkIndex >= 0) {
      bangdongVegetarian1EditDrinks[drinkIndex].quantity = parseInt(value)
    }
    setTimeout(() => {
      // 素食便當 125  配菜  推入 input 數值
      const sideDishIndex = bangdongVegetarian1EditSideDishes.findIndex(
        (bangdongVegetarian1EditSideDish) =>
          bangdongVegetarian1EditSideDish.name === name
      )
      if (sideDishIndex >= 0) {
        bangdongVegetarian1EditSideDishes[sideDishIndex].quantity =
          parseInt(value)
      }
      // 素食便當 125  副主餐  推入 input 數值
      const bentoMainIndex = bangdongVegetarian1EditBentoMains.findIndex(
        (bangdongVegetarian1EditBentoMain) =>
          bangdongVegetarian1EditBentoMain.name === name
      )
      if (bentoMainIndex >= 0) {
        bangdongVegetarian1EditBentoMains[bentoMainIndex].quantity =
          parseInt(value)
      }
    }, 2000)
  }
  // 監聽主餐的數量變化

  editingRow = row
  bangdongVegetarian1EditTotalQuantity.value = row.quantity
  bangdongVegetarian1Comment.value = row.comment
  editDialogV1.value = true
}

// 素食便當 125 總數量
watch(bangdongVegetarian1EditMains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  bangdongVegetarian1EditArbitrarily.value = Math.max(
    0,
    parseInt(bangdongVegetarian1EditTotalQuantity.value) - mainQuantityTotal
  )
})
// 素食便當 125 單價
const bangdongVegetarian1EditPrice = computed(() => {
  return bangdongVegetarian1Price.value
})
// 素食便當 125 總價格
const bangdongVegetarian1EditTotalQuantityPrice = computed(() => {
  const totalPrice =
    bangdongVegetarian1EditTotalQuantity.value *
    bangdongVegetarian1EditPrice.value
  return totalPrice
})

const bangdongVegetarian1EditoptionPrice = computed(() => {
  let totalPrice = 0
  bangdongVegetarian1EditDrinks.forEach((drink) => {
    totalPrice += drink.quantity * drink.price
  })
  bangdongVegetarian1EditSideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
const bangdongVegetarian1EditfinalTotal = computed(() => {
  const totalPrice =
    bangdongVegetarian1EditoptionPrice.value +
    bangdongVegetarian1EditTotalQuantityPrice.value
  return totalPrice
})
// 關閉修正欄位
function closeEditDialogV1 () {
  editDialogV1.value = false
}
// 完成後儲存並且將資料推進 tableRows 刪除原本的資料
function saveEditDialogV1 () {
  if (bangdongVegetarian1EditTotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  // 檢查總數量是否匹配
  const calculatedTotalQuantity = bangdongVegetarian1EditMains.reduce(
    (acc, main) => acc + (main.quantity || 0),
    0
  )
  console.log(
    calculatedTotalQuantity,
    bangdongVegetarian1EditTotalQuantity.value
  )
  if (
    calculatedTotalQuantity !==
    parseInt(bangdongVegetarian1EditTotalQuantity.value, 10)
  ) {
    alert('主餐總數量與輸入的總數量不搭！')
    return
  }
  const row = {
    bentoType: 11,
    id: editingRow.id, // 使用新生成的 ID
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: '',
    price: bangdongVegetarian1EditfinalTotal.value,
    optionPrice: bangdongVegetarian1EditoptionPrice.value,
    totalPrice: bangdongVegetarian1EditTotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: bangdongVegetarian1Comment.value
  }

  const totalEditQuantity = bangdongVegetarian1EditTotalQuantity.value // 計算總數量
  row.quantity = totalEditQuantity
  // 儲存推入主餐置入 table
  for (const bangdongVegetarian1EditMain of bangdongVegetarian1EditMains) {
    if (bangdongVegetarian1EditMain.quantity > 0) {
      row.Main +=
        bangdongVegetarian1EditMain.name +
        'x' +
        parseInt(bangdongVegetarian1EditMain.quantity).toString() +
        '<br>'
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: bangdongVegetarian1MainMealId.value,
        productTypeName: bangdongVegetarian1MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongVegetarian1EditMain.id,
        name: bangdongVegetarian1EditMain.name,
        value: parseInt(bangdongVegetarian1EditMain.quantity),
        type: 1
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入飲料置入 table
  for (const bangdongVegetarian1EditDrink of bangdongVegetarian1EditDrinks) {
    if (bangdongVegetarian1EditDrink.quantity > 0) {
      row.drinks +=
        bangdongVegetarian1EditDrink.name +
        'x' +
        parseInt(bangdongVegetarian1EditDrink.quantity).toString() +
        '<br>'
      // 保留飲料名稱、飲料 ID
      const productInput = {
        productTypeName: bangdongVegetarian1DrinkName.value,
        productTypeId: bangdongVegetarian1DrinkId.value,
        productType: 'options_with_qty',
        type: 2
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongVegetarian1EditDrink.id,
        name: bangdongVegetarian1EditDrink.name,
        value: parseInt(bangdongVegetarian1EditDrink.quantity),
        type: 2
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入配菜置入 table
  for (const bangdongVegetarian1EditSideDish of bangdongVegetarian1EditSideDishes) {
    if (bangdongVegetarian1EditSideDish.quantity > 0) {
      row.sideDishes +=
        bangdongVegetarian1EditSideDish.name +
        'x' +
        parseInt(bangdongVegetarian1EditSideDish.quantity).toString() +
        '<br>'
      // 保留配菜名稱、ID
      const productInput = {
        productTypeName: bangdongVegetarian1SideDishName.value,
        productTypeId: bangdongVegetarian1SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      row.sideDishDefault += bangdongVegetarian1EditSideDish.is_default + ' '
      const input = {
        id: bangdongVegetarian1EditSideDish.id,
        name: bangdongVegetarian1EditSideDish.name,
        value: parseInt(bangdongVegetarian1EditSideDish.quantity),
        is_default: bangdongVegetarian1EditSideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入副主餐置入 table
  for (const bangdongVegetarian1EditBentoMain of bangdongVegetarian1EditBentoMains) {
    if (bangdongVegetarian1EditBentoMain.quantity > 0) {
      row.bentoMains +=
        bangdongVegetarian1EditBentoMain.name +
        'x' +
        parseInt(bangdongVegetarian1EditBentoMain.quantity).toString() +
        '<br>'
      const productInput = {
        productTypeName: bangdongVegetarian1BentoMainName.value,
        productTypeId: bangdongVegetarian1BentoMainId.value,
        productType: 'options_with_qty',
        type: 4
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongVegetarian1EditBentoMain.id,
        name: bangdongVegetarian1EditBentoMain.name,
        value: parseInt(bangdongVegetarian1EditBentoMain.quantity),
        type: 4
      }
      row.inputs.push(input)
    }
  }
  // 保留素食便當 125、1002、數量
  const productInput = {
    id: bangdongVegetarian1ProductId.value,
    name: bangdongVegetarian1Name.value,
    value: parseInt(totalEditQuantity),
    price: bangdongVegetarian1EditPrice.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: bangdongVegetarian1Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (bangdongVegetarian1EditArbitrarily.value > 0) {
    row.Main +=
      '任意搭配' +
      'x' +
      parseInt(bangdongVegetarian1EditArbitrarily.value).toString() +
      '<br>'
    const input = {
      id: 'bangdongVegetarian1EditArbitrarily',
      value: bangdongVegetarian1EditArbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = bangdongVegetarian1Name.value + totalEditQuantity + '份' // 使用總數量
  checkVegetable(row)
  // 將這個 row 推進 tableRows 中
  const rowIndex = tableRows.findIndex((r) => r === editingRow)
  if (rowIndex !== -1) {
    tableRows.splice(rowIndex, 1, row) // 在移除元素的同時插入新元素
  }
  editDialogV1.value = false
  bangdongVegetarian1EditArbitrarily.value = 0
}

// 素食便當 150 修改

const editDialogV2 = ref(false)

function editBangdongVegetarian2 (row) {
  watchers.forEach((unwatch) => unwatch())
  watchers = []
  // 素食便當 150 主餐歸零
  for (const bangdongVegetarian2EditMain of bangdongVegetarian2EditMains) {
    bangdongVegetarian2EditMain.quantity = 0
  }
  // 素食便當 150 飲料歸零
  for (const bangdongVegetarian2EditDrink of bangdongVegetarian2EditDrinks) {
    bangdongVegetarian2EditDrink.quantity = 0
  }
  // 素食便當 150 配菜歸零
  for (const bangdongVegetarian2EditSideDish of bangdongVegetarian2EditSideDishes) {
    bangdongVegetarian2EditSideDish.quantity = 0
  }
  // 素食便當 150 副主餐歸零
  for (const bangdongVegetarian2EditBentoMain of bangdongVegetarian2EditBentoMains) {
    bangdongVegetarian2EditBentoMain.quantity = 0
  }
  // 素食便當 150 主餐隱藏欄位歸零
  for (const input of row.inputs) {
    const name = input.name
    const value = input.value
    // 任意搭配抓取推入
    if (input.name === '任意搭配') {
      bangdongVegetarian2EditArbitrarily.value = input.value
    }
    // 素食便當 150 主餐 推入 input 數值
    const mainIndex = bangdongVegetarian2EditMains.findIndex(
      (bangdongVegetarian2EditMain) =>
        bangdongVegetarian2EditMain.name === name ||
        bangdongVegetarian2EditMain.shortname === name
    )
    if (mainIndex >= 0) {
      bangdongVegetarian2EditMains[mainIndex].quantity = parseInt(value)
    }
    // 素食便當 150 飲料 推入 input 數值
    const drinkIndex = bangdongVegetarian2EditDrinks.findIndex(
      (bangdongVegetarian2EditDrink) =>
        bangdongVegetarian2EditDrink.name === name
    )
    if (drinkIndex >= 0) {
      bangdongVegetarian2EditDrinks[drinkIndex].quantity = parseInt(value)
    }
    setTimeout(() => {
      // 素食便當 150 配菜 推入 input 數值
      const sideDishIndex = bangdongVegetarian2EditSideDishes.findIndex(
        (bangdongVegetarian2EditSideDish) =>
          bangdongVegetarian2EditSideDish.name === name
      )
      if (sideDishIndex >= 0) {
        bangdongVegetarian2EditSideDishes[sideDishIndex].quantity =
          parseInt(value)
      }
      // 素食便當 150 副主餐 推入 input 數值
      const bentoMainIndex = bangdongVegetarian2EditBentoMains.findIndex(
        (bangdongVegetarian2EditBentoMain) =>
          bangdongVegetarian2EditBentoMain.name === name
      )
      if (bentoMainIndex >= 0) {
        bangdongVegetarian2EditBentoMains[bentoMainIndex].quantity =
          parseInt(value)
      }
    }, 2000)
  }

  editingRow = row
  bangdongVegetarian2EditTotalQuantity.value = row.quantity
  bangdongVegetarian2Comment.value = row.comment
  editDialogV2.value = true
}

// 素食便當 150 總數量
watch(bangdongVegetarian2EditMains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  bangdongVegetarian2EditArbitrarily.value = Math.max(
    0,
    parseInt(bangdongVegetarian2EditTotalQuantity.value) - mainQuantityTotal
  )
})
// 素食便當 150 單價
const bangdongVegetarian2EditPrice = computed(() => {
  return bangdongVegetarian2Price.value
})
// 素食便當 150 總價格
const bangdongVegetarian2EditTotalQuantityPrice = computed(() => {
  const totalPrice =
    bangdongVegetarian2EditTotalQuantity.value *
    bangdongVegetarian2EditPrice.value
  return totalPrice
})
const bangdongVegetarian2EditoptionPrice = computed(() => {
  let totalPrice = 0
  bangdongVegetarian2EditDrinks.forEach((drink) => {
    totalPrice += drink.quantity * drink.price
  })
  bangdongVegetarian2EditSideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
const bangdongVegetarian2EditfinalTotal = computed(() => {
  const totalPrice =
    bangdongVegetarian2EditoptionPrice.value +
    bangdongVegetarian2EditTotalQuantityPrice.value
  return totalPrice
})
// 關閉修正欄位
function closeEditDialogV2 () {
  editDialogV2.value = false
}
// 完成後儲存並且將資料推進 tableRows 刪除原本的資料
function saveEditDialogV2 () {
  if (bangdongVegetarian2EditTotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  // 檢查總數量是否匹配
  const calculatedTotalQuantity = bangdongVegetarian2EditMains.reduce(
    (acc, main) => acc + (main.quantity || 0),
    0
  )
  if (
    calculatedTotalQuantity !==
    parseInt(bangdongVegetarian2EditTotalQuantity.value, 10)
  ) {
    alert('主餐總數量與輸入的總數量不搭！')
    return
  }
  const row = {
    bentoType: 12,
    id: editingRow.id, // 使用新生成的 ID
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: '',
    price: bangdongVegetarian2EditfinalTotal.value,
    optionPrice: bangdongVegetarian2EditoptionPrice.value,
    totalPrice: bangdongVegetarian2EditTotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: bangdongVegetarian2Comment.value
  }

  const totalEditQuantity = bangdongVegetarian2EditTotalQuantity.value // 計算總數量
  row.quantity = totalEditQuantity
  // 儲存推入主餐置入 table
  for (const bangdongVegetarian2EditMain of bangdongVegetarian2EditMains) {
    if (bangdongVegetarian2EditMain.quantity > 0) {
      row.Main +=
        bangdongVegetarian2EditMain.name +
        'x' +
        parseInt(bangdongVegetarian2EditMain.quantity).toString() +
        '<br>'
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: bangdongVegetarian2MainMealId.value,
        productTypeName: bangdongVegetarian2MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongVegetarian2EditMain.id,
        name: bangdongVegetarian2EditMain.name,
        value: parseInt(bangdongVegetarian2EditMain.quantity),
        type: 1
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入飲料置入 table
  for (const bangdongVegetarian2EditDrink of bangdongVegetarian2EditDrinks) {
    if (bangdongVegetarian2EditDrink.quantity > 0) {
      row.drinks +=
        bangdongVegetarian2EditDrink.name +
        'x' +
        parseInt(bangdongVegetarian2EditDrink.quantity).toString() +
        '<br>'
      // 保留飲料名稱、飲料 ID
      const productInput = {
        productTypeName: bangdongVegetarian2DrinkName.value,
        productTypeId: bangdongVegetarian2DrinkId.value,
        productType: 'options_with_qty',
        type: 2
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongVegetarian2EditDrink.id,
        name: bangdongVegetarian2EditDrink.name,
        value: parseInt(bangdongVegetarian2EditDrink.quantity),
        type: 2
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入配菜置入 table
  for (const bangdongVegetarian2EditSideDish of bangdongVegetarian2EditSideDishes) {
    if (bangdongVegetarian2EditSideDish.quantity > 0) {
      row.sideDishes +=
        bangdongVegetarian2EditSideDish.name +
        'x' +
        parseInt(bangdongVegetarian2EditSideDish.quantity).toString() +
        '<br>'
      // 保留配菜名稱、ID
      const productInput = {
        productTypeName: bangdongVegetarian2SideDishName.value,
        productTypeId: bangdongVegetarian2SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      row.sideDishDefault += bangdongVegetarian2EditSideDish.is_default + ' '
      const input = {
        id: bangdongVegetarian2EditSideDish.id,
        name: bangdongVegetarian2EditSideDish.name,
        value: parseInt(bangdongVegetarian2EditSideDish.quantity),
        is_default: bangdongVegetarian2EditSideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入副主餐置入 table
  for (const bangdongVegetarian2EditBentoMain of bangdongVegetarian2EditBentoMains) {
    if (bangdongVegetarian2EditBentoMain.quantity > 0) {
      row.bentoMains +=
        bangdongVegetarian2EditBentoMain.name +
        'x' +
        parseInt(bangdongVegetarian2EditBentoMain.quantity).toString() +
        '<br>'
      const productInput = {
        productTypeName: bangdongVegetarian2BentoMainName.value,
        productTypeId: bangdongVegetarian2BentoMainId.value,
        productType: 'options_with_qty',
        type: 4
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongVegetarian2EditBentoMain.id,
        name: bangdongVegetarian2EditBentoMain.name,
        value: parseInt(bangdongVegetarian2EditBentoMain.quantity),
        type: 4
      }
      row.inputs.push(input)
    }
  }
  // 保留素食便當 150、1002、數量
  const productInput = {
    id: bangdongVegetarian2ProductId.value,
    name: bangdongVegetarian2Name.value,
    value: parseInt(totalEditQuantity),
    price: bangdongVegetarian2EditPrice.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: bangdongVegetarian2Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (bangdongVegetarian2EditArbitrarily.value > 0) {
    row.Main +=
      '任意搭配' +
      'x' +
      parseInt(bangdongVegetarian2EditArbitrarily.value).toString() +
      '<br>'
    const input = {
      id: 'bangdongVegetarian2EditArbitrarily',
      value: bangdongVegetarian2EditArbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = bangdongVegetarian2Name.value + totalEditQuantity + '份' // 使用總數量
  checkVegetable(row)
  // 將這個 row 推進 tableRows 中
  const rowIndex = tableRows.findIndex((r) => r === editingRow)
  if (rowIndex !== -1) {
    tableRows.splice(rowIndex, 1, row) // 在移除元素的同時插入新元素
  }
  editDialogV2.value = false
  bangdongVegetarian2EditArbitrarily.value = 0
}
// reset-----------------------------
const ResetbangdongCustom1 = () => {
  for (const bangdongCustom1Main of bangdongCustom1Mains) {
    bangdongCustom1Main.quantity = 0
  }
  // 客製招牌便當飲料歸零
  for (const bangdongCustom1Drink of bangdongCustom1Drinks) {
    bangdongCustom1Drink.quantity = 0
  }
  // 客製招牌便當配菜歸零
  for (const bangdongCustom1SideDish of bangdongCustom1SideDishes) {
    bangdongCustom1SideDish.quantity = 0
  }
  // 客製招牌便當副主餐歸零
  for (const bangdongCustom1BentoMain of bangdongCustom1BentoMains) {
    bangdongCustom1BentoMain.quantity = 0
  }
  bangdongCustom1TotalQuantityPrice.value = 0
  bangdongCustom1Price.value = 0
  bangdongCustom1TotalQuantity.value = 0
  showbangdongCustom1.value = false
}
// 客製便當總價格
const bangdongCustom1EditPrice = ref(0)
const bangdongCustom1EditoptionPrice = ref(0)
const bangdongCustom1EditTotalQuantityPrice = computed(() => {
  return (
    bangdongCustom1EditTotalQuantity.value * bangdongCustom1EditPrice.value
  )
})
const bangdongCustom1EditfinalTotal = computed(() => {
  const totalPrice =
    bangdongCustom1EditoptionPrice.value +
    bangdongCustom1EditTotalQuantityPrice.value
  return totalPrice
})

// 客製便當修改
function editRowDialog9 (row) {
  // 客製招牌便當主餐歸零
  for (const bangdongCustom1EditMain of bangdongCustom1EditMains) {
    bangdongCustom1EditMain.quantity = 0
  }
  // 客製招牌便當飲料歸零
  for (const bangdongCustom1EditDrink of bangdongCustom1EditDrinks) {
    bangdongCustom1EditDrink.quantity = 0
  }
  // 客製招牌便當配菜歸零
  for (const bangdongCustom1EditSideDish of bangdongCustom1EditSideDishes) {
    bangdongCustom1EditSideDish.quantity = 0
  }
  // 客製招牌便當副主餐歸零
  for (const bangdongCustom1EditBentoMain of bangdongCustom1EditBentoMains) {
    bangdongCustom1EditBentoMain.quantity = 0
  }
  // 客製招牌便當主餐隱藏欄位歸零
  for (const input of row.inputs) {
    const name = input.name
    const value = input.value
    // 任意搭配抓取推入
    if (input.name === '任意搭配') {
      bangdongCustom1EditArbitrarily.value = input.value
    }
    // 客製招牌便當  主餐  推入 input 數值
    const mainIndex = bangdongCustom1EditMains.findIndex(
      (bangdongCustom1EditMain) =>
        bangdongCustom1EditMain.name === name ||
        bangdongCustom1EditMain.short_name === name
    )
    if (mainIndex >= 0) {
      bangdongCustom1EditMains[mainIndex].quantity = parseInt(value)
    }
    // 客製招牌便當  飲料  推入 input 數值
    const drinkIndex = bangdongCustom1EditDrinks.findIndex(
      (bangdongCustom1EditDrink) => bangdongCustom1EditDrink.name === name
    )
    if (drinkIndex >= 0) {
      bangdongCustom1EditDrinks[drinkIndex].quantity = parseInt(value)
    }
    // 客製招牌便當  配菜  推入 input 數值
    const sideDishIndex = bangdongCustom1EditSideDishes.findIndex(
      (bangdongCustom1EditSideDish) => bangdongCustom1EditSideDish.name === name
    )
    if (sideDishIndex >= 0) {
      bangdongCustom1EditSideDishes[sideDishIndex].quantity = parseInt(value)
    }
    // 客製招牌便當  副主餐  推入 input 數值
    const bentoMainIndex = bangdongCustom1EditBentoMains.findIndex(
      (bangdongCustom1EditBentoMain) =>
        bangdongCustom1EditBentoMain.name === name
    )
    if (bentoMainIndex >= 0) {
      bangdongCustom1EditBentoMains[bentoMainIndex].quantity = parseInt(value)
    }
  }

  // const totalQuantity = row.quantity // 取 bangdongCustom1TotalQuantity 的值
  editingRow = row
  bangdongCustom1EditTotalQuantity.value = row.quantity
  bangdongCustom1EditPrice.value = row.price / row.quantity
  bangdongCustom1Comment.value = row.comment
  editDialog9.value = true
}
// 客製便當總數量

// 關閉修正欄位
function closeEditDialog9 () {
  editDialog9.value = false
}
// 完成後儲存並且將資料推進 tableRows 刪除原本的資料
function saveEditDialog9 () {
  const row = {
    bentoType: 9,
    id: editingRow.id, // 使用新生成的 ID
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    sideDishDefault: '',
    bentoMains: '',
    price: bangdongCustom1EditfinalTotal.value,
    optionPrice: bangdongCustom1EditoptionPrice.value,
    totalPrice: bangdongCustom1EditTotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: bangdongCustom1Comment.value
  }

  const totalEditQuantity = bangdongCustom1EditTotalQuantity.value // 計算總數量
  for (const bangdongCustom1EditMain of bangdongCustom1EditMains) {
    if (bangdongCustom1EditMain.quantity > 0) {
      row.Main +=
        bangdongCustom1EditMain.name +
        'x' +
        parseInt(bangdongCustom1EditMain.quantity).toString() +
        '<br>'
      const productInput = {
        productTypeId: bangdongCustom1MainMealId.value,
        productTypeName: bangdongCustom1MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongCustom1EditMain.id,
        name: bangdongCustom1EditMain.name,
        value: parseInt(bangdongCustom1EditMain.quantity),
        type: 1
      }
      row.inputs.push(input)
    }
  }

  for (const bangdongCustom1EditDrink of bangdongCustom1EditDrinks) {
    if (bangdongCustom1EditDrink.quantity > 0) {
      row.drinks +=
        bangdongCustom1EditDrink.name +
        'x' +
        parseInt(bangdongCustom1EditDrink.quantity).toString() +
        '<br>'
      // 保留飲料名稱、飲料 ID
      const productInput = {
        productTypeName: bangdongCustom1DrinkName.value,
        productTypeId: bangdongCustom1DrinkId.value,
        productType: 'options_with_qty',
        type: 2
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongCustom1EditDrink.id,
        name: bangdongCustom1EditDrink.name,
        value: parseInt(bangdongCustom1EditDrink.quantity),
        type: 2
      }
      row.inputs.push(input)
    }
  }

  for (const bangdongCustom1EditSideDish of bangdongCustom1EditSideDishes) {
    if (bangdongCustom1EditSideDish.quantity > 0) {
      row.sideDishes +=
        bangdongCustom1EditSideDish.name +
        'x' +
        parseInt(bangdongCustom1EditSideDish.quantity).toString() +
        '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: bangdongCustom1SideDishName.value,
        productTypeId: bangdongCustom1SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      row.sideDishDefault += bangdongCustom1EditSideDish.is_default + ' '
      const input = {
        id: bangdongCustom1EditSideDish.id,
        name: bangdongCustom1EditSideDish.name,
        value: parseInt(bangdongCustom1EditSideDish.quantity),
        is_default: bangdongCustom1EditSideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入副主餐置入 table
  for (const bangdongCustom1EditBentoMain of bangdongCustom1EditBentoMains) {
    if (bangdongCustom1EditBentoMain.quantity > 0) {
      row.bentoMains +=
        bangdongCustom1EditBentoMain.name +
        'x' +
        parseInt(bangdongCustom1EditBentoMain.quantity).toString() +
        '<br>'
      // 保留副主餐名稱、副主餐 ID
      const productInput = {
        productTypeName: bangdongCustom1BentoMainName.value,
        productTypeId: bangdongCustom1BentoMainId.value,
        productType: 'options_with_qty',
        type: 4
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongCustom1EditBentoMain.id,
        name: bangdongCustom1EditBentoMain.name,
        value: parseInt(bangdongCustom1EditBentoMain.quantity),
        type: 4
      }
      row.inputs.push(input)
    }
  }
  const productInput = {
    id: bangdongCustom1ProductId.value,
    name: bangdongCustom1Name.value,
    value: parseInt(totalEditQuantity),
    price: bangdongCustom1Price.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: bangdongCustom1Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (bangdongCustom1EditArbitrarily.value > 0) {
    if (row.Main !== '') {
      row.Main += ','
    }
    row.Main +=
      '任意搭配' +
      'x' +
      parseInt(bangdongCustom1EditArbitrarily.value).toString()
    const input = {
      id: 'bangdongCustom1EditArbitrarily',
      value: bangdongCustom1EditArbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = bangdongCustom1Name.value + totalEditQuantity + '份' // 使用總數量
  checkVegetable(row)
  // 將這個 row 推進 tableRows 中
  const rowIndex = tableRows.findIndex((r) => r === editingRow)
  if (rowIndex !== -1) {
    tableRows.splice(rowIndex, 1, row) // 在移除元素的同時插入新元素
  }
  editDialog9.value = false
  bangdongCustom1EditArbitrarily.value = 0
}

// 經濟盒餐修改
const editDialog5 = ref(false)
function editRowDialog5 (row) {
  watchers.forEach((unwatch) => unwatch())
  watchers = []
  for (const main of lunchBox1EditMains) {
    main.quantity = 0
    // for (const drink of main.drinks) {
    //   drink.quantity = 0;
    // }
  }

  // for (const sideDish of lunchBox1EditSideDishes) {
  //   sideDish.quantity = 0;
  // }
  for (const input of row.inputs) {
    const mainId = input.mainId
    const name = input.name
    const value = input.value
    // 任意搭配抓取推入
    if (input.name === '任意搭配') {
      lunchBox1EditArbitrarily.value = input.value
    }
    const mainIndex = lunchBox1EditMains.findIndex(
      (lunchBox1EditMain) =>
        lunchBox1EditMain.name === name || lunchBox1EditMain.shortname === name
    )
    if (mainIndex >= 0) {
      lunchBox1EditMains[mainIndex].quantity = parseInt(value)
    }
    for (const main of lunchBox1EditMains) {
      if (main.id === mainId) {
        if (main.name === name) {
          main.quantity = parseInt(value)
        } else {
          // for (const drink of main.drinks) {
          //   if (drink.name === name) {
          //     drink.quantity = parseInt(value);
          //   }
          // }
        }
      }
    }
    // setTimeout(() => {
    //   const sideDishIndex = lunchBox1EditSideDishes.findIndex(
    //     (sideDish) => sideDish.name === name
    //   );
    //   if (sideDishIndex >= 0) {
    //     lunchBox1EditSideDishes[sideDishIndex].quantity = parseInt(value);
    //   }
    // }, 2000);
  }

  editingRow = row
  lunchBox1EditTotalQuantity.value = row.quantity
  lunchbox1Comment.value = row.comment
  editDialog5.value = true
}
// 經濟盒餐修改總數量
watch(lunchBox1EditMains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  lunchBox1EditArbitrarily.value = Math.max(
    0,
    parseInt(lunchBox1EditTotalQuantity.value) - mainQuantityTotal
  )
})

// 經濟盒餐修改單價
const lunchBox1EditPrice = computed(() => {
  return lunchBox1Price.value
})
// 經濟盒餐修改總價格
const lunchBox1EditTotalQuantityPrice = computed(() => {
  const totalPrice = lunchBox1EditTotalQuantity.value * lunchBox1Price.value
  return totalPrice
})
const lunchBox1EditoptionPrice = computed(() => {
  let totalPrice = 0
  lunchBox1EditSideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
const lunchbox1EditfinalTotal = computed(() => {
  const totalPrice =
    lunchBox1EditTotalQuantityPrice.value + lunchBox1EditoptionPrice.value
  return totalPrice
})
function closeEditDialog5 () {
  editDialog5.value = false
}

const saveEditDialog5 = () => {
  if (lunchBox1EditTotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  let totalMainQuantity = 0
  // let totalDrinkQuantity = 0;

  for (const option of lunchBox1EditMains) {
    if (option.quantity > 0) {
      totalMainQuantity += parseInt(option.quantity)
    }
  }
  if (totalMainQuantity / parseInt(lunchBox1EditTotalQuantity.value) !== 6) {
    alert('主餐數量有誤！')
    return
  }
  const row = {
    bentoType: 5,
    id: editingRow.id,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: '',
    price: lunchbox1EditfinalTotal.value,
    optionPrice: lunchBox1EditoptionPrice.value,
    totalPrice: lunchBox1EditTotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: lunchbox1Comment.value
  }
  const totalEditQuantity = lunchBox1EditTotalQuantity.value // 計算總數量
  row.quantity = totalEditQuantity
  for (const option of lunchBox1EditMains) {
    if (option.quantity > 0 && option.name !== '虛擬潤餅 3 吋') {
      const Main = option.name + 'x' + parseInt(option.quantity)
      // let drinkInfo = "";
      // for (const drink of option.drinks) {
      //   if (drink.quantity > 0) {
      //     drinkInfo += drink.name + "x" + parseInt(drink.quantity);
      //     // 保留飲料名稱、飲料 ID
      //     const productInput = {
      //       mainId: option.id,
      //       productTypeName: lunchBox1DrinkName.value,
      //       productTypeId: lunchBox1DrinkId.value,
      //       productType: "options_with_qty",
      //       type: 2,
      //     };
      //     row.productInputs.push(productInput);
      //     // 將帶有數值的 input 推進 inputs
      //     const input = {
      //       id: drink.id,
      //       mainId: option.id,
      //       name: drink.name,
      //       value: parseInt(drink.quantity),
      //       type: 2,
      //     };
      //     row.inputs.push(input);
      //     drink.quantity = 0;
      //   }
      // }
      // if (drinkInfo !== "") {
      //   Main += ` (${drinkInfo}<br>`;
      // }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBox1MainMealId.value,
        productTypeName: lunchBox1MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    } else if (option.name === '虛擬潤餅 3 吋') {
      let Main = ''
      if (option.quantity !== 0) {
        Main = option.name + 'x' + parseInt(option.quantity)
      }
      // let drinkInfo = "";
      // for (const drink of option.drinks) {
      //   if (drink.quantity > 0) {
      //     drinkInfo += drink.name + "x" + parseInt(drink.quantity);
      //     // 保留飲料名稱、飲料 ID
      //     const productInput = {
      //       mainId: option.id,
      //       productTypeName: lunchBox1DrinkName.value,
      //       productTypeId: lunchBox1DrinkId.value,
      //       productType: "options_with_qty",
      //       type: 2,
      //     };
      //     row.productInputs.push(productInput);
      //     // 將帶有數值的 input 推進 inputs
      //     const input = {
      //       id: drink.id,
      //       mainId: option.id,
      //       name: drink.name,
      //       value: parseInt(drink.quantity),
      //       type: 2,
      //     };
      //     row.inputs.push(input);
      //     drink.quantity = 0;
      //   }
      // }
      // if (drinkInfo !== "") {
      //   Main += ` (${drinkInfo}<br>`;
      // }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBox1MainMealId.value,
        productTypeName: lunchBox1MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    }
  }

  // for (const sideDish of lunchBox1EditSideDishes) {
  //   if (sideDish.quantity > 0) {
  //     row.sideDishes +=
  //       sideDish.name + "x" + parseInt(sideDish.quantity) + "<br>";
  //     // 保留配菜名稱、配菜 ID
  //     const productInput = {
  //       productTypeName: lunchBox1SideDishName.value,
  //       productTypeId: lunchBox1SideDishId.value,
  //       productType: "options_with_qty",
  //       type: 3,
  //     };
  //     row.productInputs.push(productInput);
  //     // 將帶有數值的 input 推進 inputs
  //     const input = {
  //       id: sideDish.id,
  //       name: sideDish.name,
  //       value: parseInt(sideDish.quantity),
  //       is_default: sideDish.is_default,
  //       type: 3,
  //     };
  //     row.inputs.push(input);
  //     sideDish.quantity = 0;
  //   }
  // }
  // 保留 經濟盒餐、1005、數量
  const productInput = {
    id: lunchBox1ProductId.value,
    name: lunchBox1Name.value,
    value: parseInt(totalEditQuantity),
    price: lunchBox1Price.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: lunchbox1Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (lunchBox1EditArbitrarily.value > 0) {
    if (row.Main !== '') {
      row.Main += ','
    }
    row.Main +=
      '任意搭配' + 'x' + parseInt(lunchBox1EditArbitrarily.value).toString()
    const input = {
      id: 'lunchBox1EditArbitrarily',
      value: lunchBox1EditArbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }

  row.name = lunchBox1Name.value + totalEditQuantity + '份' // 使用總數量
  checkVegetable(row)
  if (row.Main !== '' || row.sideDishes !== '') {
    const rowIndex = tableRows.findIndex((item) => item.id === editingRow.id)
    tableRows.splice(rowIndex, 1, row)
  }

  editDialog5.value = false
  lunchBox1EditArbitrarily.value = 0
}

// 會議盒餐修改
const editDialog6 = ref(false)
function editRowDialog6 (row) {
  watchers.forEach((unwatch) => unwatch())
  watchers = []
  for (const main of lunchBox2EditMains) {
    main.quantity = 0
    for (const drink of main.drinks) {
      drink.quantity = 0
    }
  }

  for (const sideDish of lunchBox2EditSideDishes) {
    sideDish.quantity = 0
  }
  for (const input of row.inputs) {
    const mainId = input.mainId
    const name = input.name
    const value = input.value
    // 任意搭配抓取推入
    if (input.name === '任意搭配') {
      lunchBox2EditArbitrarily.value = input.value
    }
    const mainIndex = lunchBox2EditMains.findIndex(
      (lunchBox2EditMain) =>
        lunchBox2EditMain.name === name || lunchBox2EditMain.shortname === name
    )
    if (mainIndex >= 0) {
      lunchBox2EditMains[mainIndex].quantity = parseInt(value)
    }
    for (const main of lunchBox2EditMains) {
      if (main.id === mainId) {
        if (main.name === name) {
          main.quantity = parseInt(value)
        } else {
          for (const drink of main.drinks) {
            if (drink.name === name) {
              drink.quantity = parseInt(value)
            }
          }
        }
      }
    }
    setTimeout(() => {
      const sideDishIndex = lunchBox2EditSideDishes.findIndex(
        (sideDish) => sideDish.name === name
      )
      if (sideDishIndex >= 0) {
        lunchBox2EditSideDishes[sideDishIndex].quantity = parseInt(value)
      }
    }, 2000)
  }

  editingRow = row
  lunchBox2EditTotalQuantity.value = row.quantity
  lunchbox2Comment.value = row.comment
  editDialog6.value = true
}
// 會議盒餐修改總數量
watch(lunchBox2EditMains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  lunchBox2EditArbitrarily.value = Math.max(
    0,
    parseInt(lunchBox2EditTotalQuantity.value) - mainQuantityTotal
  )
})

// 會議盒餐修改單價
const lunchBox2EditPrice = computed(() => {
  return lunchBox2Price.value
})
// 會議盒餐修改總價格
const lunchBox2EditTotalQuantityPrice = computed(() => {
  const totalPrice = lunchBox2EditTotalQuantity.value * lunchBox2Price.value
  return totalPrice
})
const lunchBox2EditoptionPrice = computed(() => {
  let totalPrice = 0
  lunchBox2EditSideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
const lunchbox2EditfinalTotal = computed(() => {
  const totalPrice =
    lunchBox2EditTotalQuantityPrice.value + lunchBox2EditoptionPrice.value
  return totalPrice
})

function closeEditDialog6 () {
  editDialog6.value = false
}

const saveEditDialog6 = () => {
  if (lunchBox2EditTotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  let totalMainQuantity = 0
  let totalDrinkQuantity = 0

  for (const option of lunchBox2EditMains) {
    if (option.quantity > 0) {
      totalMainQuantity += parseInt(option.quantity)
    }
    for (const drink of option.drinks) {
      if (drink.quantity > 0) {
        totalDrinkQuantity += parseInt(drink.quantity)
      }
    }
  }
  if (
    totalMainQuantity !== parseInt(lunchBox2EditTotalQuantity.value) ||
    totalDrinkQuantity !== parseInt(lunchBox2EditTotalQuantity.value)
  ) {
    alert('主餐、飲料和總套數必須相等！')
    return
  }
  const row = {
    bentoType: 6,
    id: editingRow.id,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: '',
    price: lunchbox2EditfinalTotal.value,
    optionPrice: lunchBox2EditoptionPrice.value,
    totalPrice: lunchBox2EditTotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: lunchbox2Comment.value
  }
  const totalEditQuantity = lunchBox2EditTotalQuantity.value
  row.quantity = totalEditQuantity // 計算總數量
  for (const option of lunchBox2EditMains) {
    if (option.quantity > 0 && option.name !== '虛擬潤餅 3 吋') {
      let Main = option.name + 'x' + parseInt(option.quantity)
      let drinkInfo = ''
      for (const drink of option.drinks) {
        if (drink.quantity > 0) {
          drinkInfo += drink.name + 'x' + parseInt(drink.quantity)
          // 保留飲料名稱、飲料 ID
          const productInput = {
            mainId: option.id,
            productTypeName: lunchBox2DrinkName.value,
            productTypeId: lunchBox2DrinkId.value,
            productType: 'options_with_qty',
            type: 2
          }
          row.productInputs.push(productInput)
          // 將帶有數值的 input 推進 inputs
          const input = {
            id: drink.id,
            mainId: option.id,
            name: drink.name,
            value: parseInt(drink.quantity),
            type: 2
          }
          row.inputs.push(input)
          drink.quantity = 0
        }
      }
      if (drinkInfo !== '') {
        Main += ` (${drinkInfo}<br>`
      }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBox2MainMealId.value,
        productTypeName: lunchBox2MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    } else if (option.name === '虛擬潤餅 3 吋') {
      let Main = ''
      if (option.quantity !== 0) {
        Main = option.name + 'x' + parseInt(option.quantity)
      }

      let drinkInfo = ''
      for (const drink of option.drinks) {
        if (drink.quantity > 0) {
          drinkInfo += drink.name + 'x' + parseInt(drink.quantity)
          // 保留飲料名稱、飲料 ID
          const productInput = {
            mainId: option.id,
            productTypeName: lunchBox2DrinkName.value,
            productTypeId: lunchBox2DrinkId.value,
            productType: 'options_with_qty',
            type: 2
          }
          row.productInputs.push(productInput)
          // 將帶有數值的 input 推進 inputs
          const input = {
            id: drink.id,
            mainId: option.id,
            name: drink.name,
            value: parseInt(drink.quantity),
            type: 2
          }
          row.inputs.push(input)
          drink.quantity = 0
        }
      }
      if (drinkInfo !== '') {
        Main += ` (${drinkInfo}<br>`
      }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBox2MainMealId.value,
        productTypeName: lunchBox2MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    }
  }

  for (const sideDish of lunchBox2EditSideDishes) {
    if (sideDish.quantity > 0) {
      if (row.sideDishes !== '') {
        row.sideDishes += ', '
      }
      row.sideDishes +=
        sideDish.name + 'x' + parseInt(sideDish.quantity) + '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: lunchBox2SideDishName.value,
        productTypeId: lunchBox2SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: sideDish.id,
        name: sideDish.name,
        value: parseInt(sideDish.quantity),
        is_default: sideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
      sideDish.quantity = 0
    }
  }
  // 保留 會議盒餐、1006、數量
  const productInput = {
    id: lunchBox2ProductId.value,
    name: lunchBox2Name.value,
    value: parseInt(totalEditQuantity),
    price: lunchBox2Price.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: lunchbox2Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (lunchBox2EditArbitrarily.value > 0) {
    if (row.Main !== '') {
      row.Main += ','
    }
    row.Main +=
      '任意搭配' + 'x' + parseInt(lunchBox2EditArbitrarily.value).toString()
    const input = {
      id: 'lunchBox2EditArbitrarily',
      value: lunchBox2EditArbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = lunchBox2Name.value + totalEditQuantity + '份' // 使用總數量
  checkVegetable(row)
  if (row.Main !== '' || row.sideDishes !== '') {
    const rowIndex = tableRows.findIndex((item) => item.id === editingRow.id)
    tableRows.splice(rowIndex, 1, row)
  }
  lunchBox2EditTotalQuantity.value = row.quantity
  editDialog6.value = false
  lunchBox2EditArbitrarily.value = 0
}

// 貴賓盒餐修改
const editDialog7 = ref(false)
function editRowDialog7 (row) {
  watchers.forEach((unwatch) => unwatch())
  watchers = []
  for (const main of lunchBox3EditMains) {
    main.quantity = 0
    for (const drink of main.drinks) {
      drink.quantity = 0
    }
  }

  for (const sideDish of lunchBox3EditSideDishes) {
    sideDish.quantity = 0
  }
  for (const input of row.inputs) {
    const mainId = input.mainId
    const name = input.name
    const value = input.value

    // 任意搭配抓取推入
    if (input.name === '任意搭配') {
      lunchBox3EditArbitrarily.value = input.value
    }
    const mainIndex = lunchBox3EditMains.findIndex(
      (lunchBox3EditMain) =>
        lunchBox3EditMain.name === name || lunchBox3EditMain.shortname === name
    )
    if (mainIndex >= 0) {
      lunchBox3EditMains[mainIndex].quantity = parseInt(value)
    }
    for (const main of lunchBox3EditMains) {
      if (main.id === mainId) {
        if (main.name === name) {
          main.quantity = parseInt(value)
        } else {
          for (const drink of main.drinks) {
            if (drink.name === name) {
              drink.quantity = parseInt(value)
            }
          }
        }
      }
    }
    setTimeout(() => {
      const sideDishIndex = lunchBox3EditSideDishes.findIndex(
        (sideDish) => sideDish.name === name
      )
      if (sideDishIndex >= 0) {
        lunchBox3EditSideDishes[sideDishIndex].quantity = parseInt(value)
      }
    }, 2000)
  }
  // 監聽主餐的數量變化

  editingRow = row
  lunchBox3EditTotalQuantity.value = row.quantity
  lunchbox3Comment.value = row.comment
  editDialog7.value = true
}
// 貴賓盒餐修改總數量
watch(lunchBox3EditMains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  lunchBox3EditArbitrarily.value = Math.max(
    0,
    parseInt(lunchBox3EditTotalQuantity.value) - mainQuantityTotal
  )
})

// 貴賓盒餐修改單價
const lunchBox3EditPrice = computed(() => {
  return lunchBox3Price.value
})
// 貴賓盒餐修改總價格
const lunchBox3EditTotalQuantityPrice = computed(() => {
  const totalPrice = lunchBox3EditTotalQuantity.value * lunchBox3Price.value

  return totalPrice
})
const lunchBox3EditoptionPrice = computed(() => {
  let totalPrice = 0
  lunchBox3EditSideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
const lunchbox3EditfinalTotal = computed(() => {
  const totalPrice =
    lunchBox3EditTotalQuantityPrice.value + lunchBox3EditoptionPrice.value
  return totalPrice
})
function closeEditDialog7 () {
  editDialog7.value = false
}

const saveEditDialog7 = () => {
  if (lunchBox3EditTotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  let totalMainQuantity = 0
  let totalDrinkQuantity = 0

  for (const option of lunchBox3EditMains) {
    if (option.quantity > 0) {
      totalMainQuantity += parseInt(option.quantity)
    }
    for (const drink of option.drinks) {
      if (drink.quantity > 0) {
        totalDrinkQuantity += parseInt(drink.quantity)
      }
    }
  }
  if (
    totalMainQuantity !== parseInt(lunchBox3EditTotalQuantity.value) ||
    totalDrinkQuantity !== parseInt(lunchBox3EditTotalQuantity.value)
  ) {
    alert('主餐、飲料和總套數必須相等！')
    return
  }
  const row = {
    bentoType: 7,
    id: editingRow.id,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: '',
    price: lunchbox3EditfinalTotal.value,
    optionPrice: lunchBox3EditoptionPrice.value,
    totalPrice: lunchBox3EditTotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: lunchbox3Comment.value
  }
  const totalEditQuantity = lunchBox3EditTotalQuantity.value // 計算總數量
  row.quantity = totalEditQuantity
  for (const option of lunchBox3EditMains) {
    if (option.quantity > 0 && option.name !== '虛擬潤餅 3 吋') {
      let Main = option.name + 'x' + parseInt(option.quantity)
      let drinkInfo = ''
      for (const drink of option.drinks) {
        if (drink.quantity > 0) {
          drinkInfo += drink.name + 'x' + parseInt(drink.quantity)
          // 保留飲料名稱、飲料 ID
          const productInput = {
            mainId: option.id,
            productTypeName: lunchBox3DrinkName.value,
            productTypeId: lunchBox3DrinkId.value,
            productType: 'options_with_qty',
            type: 2
          }
          row.productInputs.push(productInput)
          // 將帶有數值的 input 推進 inputs
          const input = {
            id: drink.id,
            mainId: option.id,
            name: drink.name,
            value: parseInt(drink.quantity),
            type: 2
          }
          row.inputs.push(input)
          drink.quantity = 0
        }
      }
      if (drinkInfo !== '') {
        Main += ` (${drinkInfo}<br>`
      }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBox3MainMealId.value,
        productTypeName: lunchBox3MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    } else if (option.name === '虛擬潤餅 3 吋') {
      let Main = ''
      if (option.quantity !== 0) {
        Main = option.name + 'x' + parseInt(option.quantity)
      }
      let drinkInfo = ''
      for (const drink of option.drinks) {
        if (drink.quantity > 0) {
          drinkInfo += drink.name + 'x' + parseInt(drink.quantity)
          // 保留飲料名稱、飲料 ID
          const productInput = {
            mainId: option.id,
            productTypeName: lunchBox3DrinkName.value,
            productTypeId: lunchBox3DrinkId.value,
            productType: 'options_with_qty',
            type: 2
          }
          row.productInputs.push(productInput)
          // 將帶有數值的 input 推進 inputs
          const input = {
            id: drink.id,
            mainId: option.id,
            name: drink.name,
            value: parseInt(drink.quantity),
            type: 2
          }
          row.inputs.push(input)
          drink.quantity = 0
        }
      }
      if (drinkInfo !== '') {
        Main += ` (${drinkInfo}<br>`
      }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBox3MainMealId.value,
        productTypeName: lunchBox3MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    }
  }

  for (const sideDish of lunchBox3EditSideDishes) {
    if (sideDish.quantity > 0) {
      if (row.sideDishes !== '') {
        row.sideDishes += ', '
      }
      row.sideDishes +=
        sideDish.name + 'x' + parseInt(sideDish.quantity) + '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: lunchBox3SideDishName.value,
        productTypeId: lunchBox3SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: sideDish.id,
        name: sideDish.name,
        value: parseInt(sideDish.quantity),
        is_default: sideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
      sideDish.quantity = 0
    }
  }
  // 保留 貴賓盒餐、1007、數量
  const productInput = {
    id: lunchBox3ProductId.value,
    name: lunchBox3Name.value,
    value: parseInt(totalEditQuantity),
    price: lunchBox3Price.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: lunchbox3Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (lunchBox3EditArbitrarily.value > 0) {
    if (row.Main !== '') {
      row.Main += ','
    }
    row.Main +=
      '任意搭配' + 'x' + parseInt(lunchBox3EditArbitrarily.value).toString()
    const input = {
      id: 'lunchBox3EditArbitrarily',
      value: lunchBox3EditArbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = lunchBox3Name.value + totalEditQuantity + '份' // 使用總數量
  checkVegetable(row)
  if (row.Main !== '' || row.sideDishes !== '') {
    const rowIndex = tableRows.findIndex((item) => item.id === editingRow.id)
    tableRows.splice(rowIndex, 1, row)
  }
  lunchBox3EditTotalQuantity.value = row.quantity
  editDialog7.value = false
}

// 214盒餐修改
const editDialog214 = ref(false)
function editRowDialog214 (row) {
  watchers.forEach((unwatch) => unwatch())
  watchers = []
  for (const main of lunchBox214EditMains) {
    main.quantity = 0
    for (const drink of main.drinks) {
      drink.quantity = 0
    }
  }

  for (const sideDish of lunchBox214EditSideDishes) {
    sideDish.quantity = 0
  }
  for (const input of row.inputs) {
    const mainId = input.mainId
    const name = input.name
    const value = input.value
    // 任意搭配抓取推入
    if (input.name === '任意搭配') {
      lunchBox214EditArbitrarily.value = input.value
    }
    const mainIndex = lunchBox214EditMains.findIndex(
      (lunchBox214EditMain) =>
        lunchBox214EditMain.name === name ||
        lunchBox214EditMain.shortname === name
    )
    if (mainIndex >= 0) {
      lunchBox214EditMains[mainIndex].quantity = parseInt(value)
    }
    for (const main of lunchBox214EditMains) {
      if (main.id === mainId) {
        if (main.name === name) {
          main.quantity = parseInt(value)
        } else {
          for (const drink of main.drinks) {
            if (drink.name === name) {
              drink.quantity = parseInt(value)
            }
          }
        }
      }
    }
    setTimeout(() => {
      const sideDishIndex = lunchBox214EditSideDishes.findIndex(
        (sideDish) => sideDish.name === name
      )
      if (sideDishIndex >= 0) {
        lunchBox214EditSideDishes[sideDishIndex].quantity = parseInt(value)
      }
    }, 2000)
  }

  editingRow = row
  lunchBox214EditTotalQuantity.value = row.quantity
  lunchbox214Comment.value = row.comment
  editDialog214.value = true
}
// 首席盒餐修改總數量
watch(lunchBox214EditMains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  lunchBox214EditArbitrarily.value = Math.max(
    0,
    parseInt(lunchBox214EditTotalQuantity.value) - mainQuantityTotal
  )
})

// 首席盒餐修改單價
const lunchBox214EditPrice = computed(() => {
  return lunchBox214Price.value
})
// 首席盒餐修改總價格
const lunchBox214EditTotalQuantityPrice = computed(() => {
  const totalPrice = lunchBox214EditTotalQuantity.value * lunchBox214Price.value

  return totalPrice
})
const lunchBox214EditoptionPrice = computed(() => {
  let totalPrice = 0
  lunchBox214EditSideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
const lunchbox214EditfinalTotal = computed(() => {
  const totalPrice =
    lunchBox214EditTotalQuantityPrice.value + lunchBox214EditoptionPrice.value
  return totalPrice
})

function closeEditDialog214 () {
  editDialog214.value = false
}

const saveEditDialog214 = () => {
  if (lunchBox214EditTotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  let totalMainQuantity = 0
  let totalDrinkQuantity = 0

  for (const option of lunchBox214EditMains) {
    if (option.quantity > 0) {
      totalMainQuantity += parseInt(option.quantity)
    }
    for (const drink of option.drinks) {
      if (drink.quantity > 0) {
        totalDrinkQuantity += parseInt(drink.quantity)
      }
    }
  }
  console.log(lunchBox214EditTotalQuantity.value)
  console.log(totalMainQuantity, totalDrinkQuantity)
  if (
    totalMainQuantity !== parseInt(lunchBox214EditTotalQuantity.value) ||
    totalDrinkQuantity !== parseInt(lunchBox214EditTotalQuantity.value)
  ) {
    alert('主餐、飲料和總套數必須相等！')
    return
  }
  const row = {
    bentoType: 14,
    id: editingRow.id,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: '',
    price: lunchbox214EditfinalTotal.value,
    optionPrice: lunchBox214EditoptionPrice.value,
    totalPrice: lunchBox214EditTotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: lunchbox214Comment.value
  }
  const totalEditQuantity = lunchBox214EditTotalQuantity.value // 計算總數量
  row.quantity = totalEditQuantity
  for (const option of lunchBox4EditMains) {
    if (option.quantity > 0 && option.name !== '虛擬潤餅 3 吋') {
      let Main = option.name + 'x' + parseInt(option.quantity)
      let drinkInfo = ''
      for (const drink of option.drinks) {
        if (drink.quantity > 0) {
          drinkInfo += drink.name + 'x' + parseInt(drink.quantity)
          // 保留飲料名稱、飲料 ID
          const productInput = {
            mainId: option.id,
            productTypeName: lunchBox214DrinkName.value,
            productTypeId: lunchBox214DrinkId.value,
            productType: 'options_with_qty',
            type: 2
          }
          row.productInputs.push(productInput)
          // 將帶有數值的 input 推進 inputs
          const input = {
            id: drink.id,
            mainId: option.id,
            name: drink.name,
            value: parseInt(drink.quantity),
            type: 2
          }
          row.inputs.push(input)
          drink.quantity = 0
        }
      }
      if (drinkInfo !== '') {
        Main += ` (${drinkInfo}<br>`
      }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBox214MainMealId.value,
        productTypeName: lunchBox214MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    } else if (option.name === '虛擬潤餅 3 吋') {
      let Main = ''
      if (option.quantity !== 0) {
        Main = option.name + 'x' + parseInt(option.quantity)
      }
      let drinkInfo = ''
      for (const drink of option.drinks) {
        if (drink.quantity > 0) {
          drinkInfo += drink.name + 'x' + parseInt(drink.quantity)
          // 保留飲料名稱、飲料 ID
          const productInput = {
            mainId: option.id,
            productTypeName: lunchBox214DrinkName.value,
            productTypeId: lunchBox214DrinkId.value,
            productType: 'options_with_qty',
            type: 2
          }
          row.productInputs.push(productInput)
          // 將帶有數值的 input 推進 inputs
          const input = {
            id: drink.id,
            mainId: option.id,
            name: drink.name,
            value: parseInt(drink.quantity),
            type: 2
          }
          row.inputs.push(input)
          drink.quantity = 0
        }
      }
      if (drinkInfo !== '') {
        Main += ` (${drinkInfo}<br>`
      }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBox214MainMealId.value,
        productTypeName: lunchBox214MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    }
  }

  for (const sideDish of lunchBox4EditSideDishes) {
    if (sideDish.quantity > 0) {
      if (row.sideDishes !== '') {
        row.sideDishes += ', '
      }
      row.sideDishes +=
        sideDish.name + 'x' + parseInt(sideDish.quantity) + '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: lunchBox214SideDishName.value,
        productTypeId: lunchBox214SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: sideDish.id,
        name: sideDish.name,
        value: parseInt(sideDish.quantity),
        is_default: sideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
      sideDish.quantity = 0
    }
  }
  // 保留 首席盒餐、1008、數量
  const productInput = {
    id: lunchBox214ProductId.value,
    name: lunchBox214Name.value,
    value: parseInt(totalEditQuantity),
    price: lunchBox214Price.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: lunchbox214Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (lunchBox214EditArbitrarily.value > 0) {
    row.Main +=
      '任意搭配' + 'x' + parseInt(lunchBox214EditArbitrarily.value).toString()
    const input = {
      id: 'lunchBox214EditArbitrarily',
      value: lunchBox214EditArbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = lunchBox214Name.value + totalEditQuantity + '份' // 使用總數量
  checkVegetable(row)
  if (row.Main !== '' || row.sideDishes !== '') {
    const rowIndex = tableRows.findIndex((item) => item.id === editingRow.id)
    tableRows.splice(rowIndex, 1, row)
  }
  editDialog214.value = false
  lunchBox214EditArbitrarily.value = 0
}
// 首席盒餐修改
const editDialog8 = ref(false)
function editRowDialog8 (row) {
  watchers.forEach((unwatch) => unwatch())
  watchers = []
  for (const main of lunchBox4EditMains) {
    main.quantity = 0
    for (const drink of main.drinks) {
      drink.quantity = 0
    }
  }

  for (const sideDish of lunchBox4EditSideDishes) {
    sideDish.quantity = 0
  }
  for (const input of row.inputs) {
    const mainId = input.mainId
    const name = input.name
    const value = input.value
    // 任意搭配抓取推入
    if (input.name === '任意搭配') {
      lunchBox4EditArbitrarily.value = input.value
    }
    const mainIndex = lunchBox4EditMains.findIndex(
      (lunchBox4EditMain) =>
        lunchBox4EditMain.name === name || lunchBox4EditMain.shortname === name
    )
    if (mainIndex >= 0) {
      lunchBox4EditMains[mainIndex].quantity = parseInt(value)
    }
    for (const main of lunchBox4EditMains) {
      if (main.id === mainId) {
        if (main.name === name) {
          main.quantity = parseInt(value)
        } else {
          for (const drink of main.drinks) {
            if (drink.name === name) {
              drink.quantity = parseInt(value)
            }
          }
        }
      }
    }
    setTimeout(() => {
      const sideDishIndex = lunchBox4EditSideDishes.findIndex(
        (sideDish) => sideDish.name === name
      )
      if (sideDishIndex >= 0) {
        lunchBox4EditSideDishes[sideDishIndex].quantity = parseInt(value)
      }
    }, 2000)
  }

  editingRow = row
  lunchBox4EditTotalQuantity.value = row.quantity
  lunchbox4Comment.value = row.comment
  editDialog8.value = true
}
// 首席盒餐修改總數量
watch(lunchBox4EditMains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  lunchBox4EditArbitrarily.value = Math.max(
    0,
    parseInt(lunchBox4EditTotalQuantity.value) - mainQuantityTotal
  )
})

// 首席盒餐修改單價
const lunchBox4EditPrice = computed(() => {
  return lunchBox4Price.value
})
// 首席盒餐修改總價格
const lunchBox4EditTotalQuantityPrice = computed(() => {
  const totalPrice = lunchBox4EditTotalQuantity.value * lunchBox4Price.value

  return totalPrice
})
const lunchBox4EditoptionPrice = computed(() => {
  let totalPrice = 0
  lunchBox4EditSideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
const lunchbox4EditfinalTotal = computed(() => {
  const totalPrice =
    lunchBox4EditTotalQuantityPrice.value + lunchBox4EditoptionPrice.value
  return totalPrice
})

function closeEditDialog8 () {
  editDialog8.value = false
}

const saveEditDialog8 = () => {
  if (lunchBox4EditTotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  let totalMainQuantity = 0
  let totalDrinkQuantity = 0

  for (const option of lunchBox4EditMains) {
    if (option.quantity > 0) {
      totalMainQuantity += parseInt(option.quantity)
    }
    for (const drink of option.drinks) {
      if (drink.quantity > 0) {
        totalDrinkQuantity += parseInt(drink.quantity)
      }
    }
  }
  console.log(lunchBox4EditTotalQuantity.value)
  console.log(totalMainQuantity, totalDrinkQuantity)
  if (
    totalMainQuantity !== parseInt(lunchBox4EditTotalQuantity.value) ||
    totalDrinkQuantity !== parseInt(lunchBox4EditTotalQuantity.value)
  ) {
    alert('主餐、飲料和總套數必須相等！')
    return
  }
  const row = {
    bentoType: 8,
    id: editingRow.id,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: '',
    price: lunchbox4EditfinalTotal.value,
    optionPrice: lunchBox4EditoptionPrice.value,
    totalPrice: lunchBox4EditTotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: lunchbox4Comment.value
  }
  const totalEditQuantity = lunchBox4EditTotalQuantity.value // 計算總數量
  row.quantity = totalEditQuantity
  for (const option of lunchBox4EditMains) {
    if (option.quantity > 0 && option.name !== '虛擬潤餅 3 吋') {
      let Main = option.name + 'x' + parseInt(option.quantity)
      let drinkInfo = ''
      for (const drink of option.drinks) {
        if (drink.quantity > 0) {
          drinkInfo += drink.name + 'x' + parseInt(drink.quantity)
          // 保留飲料名稱、飲料 ID
          const productInput = {
            mainId: option.id,
            productTypeName: lunchBox4DrinkName.value,
            productTypeId: lunchBox4DrinkId.value,
            productType: 'options_with_qty',
            type: 2
          }
          row.productInputs.push(productInput)
          // 將帶有數值的 input 推進 inputs
          const input = {
            id: drink.id,
            mainId: option.id,
            name: drink.name,
            value: parseInt(drink.quantity),
            type: 2
          }
          row.inputs.push(input)
          drink.quantity = 0
        }
      }
      if (drinkInfo !== '') {
        Main += ` (${drinkInfo}<br>`
      }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBox4MainMealId.value,
        productTypeName: lunchBox4MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    } else if (option.name === '虛擬潤餅 3 吋') {
      let Main = ''
      if (option.quantity !== 0) {
        Main = option.name + 'x' + parseInt(option.quantity)
      }
      let drinkInfo = ''
      for (const drink of option.drinks) {
        if (drink.quantity > 0) {
          drinkInfo += drink.name + 'x' + parseInt(drink.quantity)
          // 保留飲料名稱、飲料 ID
          const productInput = {
            mainId: option.id,
            productTypeName: lunchBox4DrinkName.value,
            productTypeId: lunchBox4DrinkId.value,
            productType: 'options_with_qty',
            type: 2
          }
          row.productInputs.push(productInput)
          // 將帶有數值的 input 推進 inputs
          const input = {
            id: drink.id,
            mainId: option.id,
            name: drink.name,
            value: parseInt(drink.quantity),
            type: 2
          }
          row.inputs.push(input)
          drink.quantity = 0
        }
      }
      if (drinkInfo !== '') {
        Main += ` (${drinkInfo}<br>`
      }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBox4MainMealId.value,
        productTypeName: lunchBox4MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    }
  }

  for (const sideDish of lunchBox4EditSideDishes) {
    if (sideDish.quantity > 0) {
      if (row.sideDishes !== '') {
        row.sideDishes += ', '
      }
      row.sideDishes +=
        sideDish.name + 'x' + parseInt(sideDish.quantity) + '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: lunchBox4SideDishName.value,
        productTypeId: lunchBox4SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: sideDish.id,
        name: sideDish.name,
        value: parseInt(sideDish.quantity),
        is_default: sideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
      sideDish.quantity = 0
    }
  }
  // 保留 首席盒餐、1008、數量
  const productInput = {
    id: lunchBox4ProductId.value,
    name: lunchBox4Name.value,
    value: parseInt(totalEditQuantity),
    price: lunchBox4Price.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: lunchbox4Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (lunchBox4EditArbitrarily.value > 0) {
    row.Main +=
      '任意搭配' + 'x' + parseInt(lunchBox4EditArbitrarily.value).toString()
    const input = {
      id: 'lunchBox4EditArbitrarily',
      value: lunchBox4EditArbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = lunchBox4Name.value + totalEditQuantity + '份' // 使用總數量
  checkVegetable(row)
  if (row.Main !== '' || row.sideDishes !== '') {
    const rowIndex = tableRows.findIndex((item) => item.id === editingRow.id)
    tableRows.splice(rowIndex, 1, row)
  }
  editDialog8.value = false
  lunchBox4EditArbitrarily.value = 0
}
const ResetLunchBoxCustom1 = () => {
  for (const main of lunchBoxCustom1Mains) {
    main.quantity = 0
    for (const drink of main.drinks) {
      drink.quantity = 0
    }
  }

  for (const sideDish of lunchBoxCustom1SideDishes) {
    sideDish.quantity = 0
  }
  for (const BentoMain of lunchBoxCustom1BentoMains) {
    BentoMain.quantity = 0
  }
  lunchBoxCustom1Price.value = 0
  showLunchBoxCustom1.value = false
}
// 客製盒餐修改
function editRowDialog0 (row) {
  for (const main of lunchBoxCustom1EditMains) {
    main.quantity = 0
    for (const drink of main.drinks) {
      drink.quantity = 0
    }
  }

  for (const sideDish of lunchBoxCustom1EditSideDishes) {
    sideDish.quantity = 0
  }
  for (const input of row.inputs) {
    const mainId = input.mainId
    const name = input.name
    const value = input.value
    // 任意搭配抓取推入
    if (input.name === '任意搭配') {
      lunchBoxCustom1EditArbitrarily.value = input.value
    }
    const mainIndex = lunchBoxCustom1EditMains.findIndex(
      (lunchBoxCustom1EditMain) =>
        lunchBoxCustom1EditMain.name === name ||
        lunchBoxCustom1EditMain.short_name === name
    )
    if (mainIndex >= 0) {
      lunchBoxCustom1EditMains[mainIndex].quantity = parseInt(value)
    }
    for (const main of lunchBoxCustom1EditMains) {
      if (main.id === mainId) {
        if (main.name === name) {
          main.quantity = parseInt(value)
        } else {
          for (const drink of main.drinks) {
            if (drink.name === name) {
              drink.quantity = parseInt(value)
            }
          }
        }
      }
    }

    const sideDishIndex = lunchBoxCustom1EditSideDishes.findIndex(
      (sideDish) => sideDish.name === name
    )
    if (sideDishIndex >= 0) {
      lunchBoxCustom1EditSideDishes[sideDishIndex].quantity = parseInt(value)
    }
    const totalQuantity = parseFloat(row.price) // 获取 lunchBoxCustom1TotalQuantity 的值
    const bentoMainIndex = lunchBoxCustom1EditBentoMains.findIndex(
      (lunchBoxCustom1EditBentoMain) =>
        lunchBoxCustom1EditBentoMain.name === name
    )
    if (bentoMainIndex >= 0) {
      lunchBoxCustom1EditBentoMains[bentoMainIndex].quantity = parseInt(value)
    }
    lunchBoxCustom1EditPrice.value =
      totalQuantity / lunchBoxCustom1EditTotalQuantity.value // 将 rowPrice /totalQuantity 的值赋给 lunchBoxCustom1EditPrice
  }
  editingRow = row
  lunchboxCustom1Comment.value = row.comment
  editDialog0.value = true
}

const lunchBoxCustom1EditTotalQuantity = computed(() => {
  return (
    lunchBoxCustom1EditMains.reduce((total, current) => {
      return total + parseInt(current.quantity)
    }, 0) + parseInt(lunchBoxCustom1EditArbitrarily.value)
  )
})

const lunchBoxCustom1EditPrice = ref(0)
const lunchboxCustom1EditoptionPrice = ref(0)
const lunchBoxCustom1EditTotalQuantityPrice = computed(() => {
  return (
    lunchBoxCustom1EditTotalQuantity.value * lunchBoxCustom1EditPrice.value
  )
})
const lunchBoxCustom1Editfinaltotal = computed(() => {
  return (
    lunchBoxCustom1EditTotalQuantityPrice.value +
    lunchboxCustom1EditoptionPrice.value
  )
})
const editDialog0 = ref(false)
function closeEditDialog0 () {
  editDialog0.value = false
}

const saveEditDialog0 = () => {
  const row = {
    bentoType: 0,
    id: editingRow.id,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    price: lunchBoxCustom1Editfinaltotal.value,
    optionPrice: lunchboxCustom1EditoptionPrice.value,
    totalPrice: lunchBoxCustom1EditTotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: lunchboxCustom1Comment.value
  }
  const totalEditQuantity = lunchBoxCustom1EditTotalQuantity.value // 計算總數量
  for (const option of lunchBoxCustom1EditMains) {
    if (option.quantity > 0 && option.name !== '虛擬潤餅 3 吋') {
      let Main = option.name + 'x' + parseInt(option.quantity)
      let drinkInfo = ''
      for (const drink of option.drinks) {
        if (drink.quantity > 0) {
          drinkInfo += drink.name + 'x' + parseInt(drink.quantity)
          // 保留飲料名稱、飲料 ID
          const productInput = {
            mainId: option.id,
            productTypeName: lunchBoxCustom1DrinkName.value,
            productTypeId: lunchBoxCustom1DrinkId.value,
            productType: 'options_with_qty',
            type: 2
          }
          row.productInputs.push(productInput)
          // 將帶有數值的 input 推進 inputs
          const input = {
            id: drink.id,
            mainId: option.id,
            name: drink.name,
            value: parseInt(drink.quantity),
            type: 2
          }
          row.inputs.push(input)
          drink.quantity = 0
        }
      }
      if (drinkInfo !== '') {
        Main += ` (${drinkInfo}<br>`
      }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBoxCustom1MainMealId.value,
        productTypeName: lunchBoxCustom1MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    } else if (option.name === '虛擬潤餅 3 吋') {
      let Main = ''
      if (option.quantity !== 0) {
        Main = option.name + 'x' + parseInt(option.quantity)
      }
      let drinkInfo = ''
      for (const drink of option.drinks) {
        if (drink.quantity > 0) {
          drinkInfo += drink.name + 'x' + parseInt(drink.quantity)
          // 保留飲料名稱、飲料 ID
          const productInput = {
            mainId: option.id,
            productTypeName: lunchBoxCustom1DrinkName.value,
            productTypeId: lunchBoxCustom1DrinkId.value,
            productType: 'options_with_qty',
            type: 2
          }
          row.productInputs.push(productInput)
          // 將帶有數值的 input 推進 inputs
          const input = {
            id: drink.id,
            mainId: option.id,
            name: drink.name,
            value: parseInt(drink.quantity),
            type: 2
          }
          row.inputs.push(input)
          drink.quantity = 0
        }
      }
      if (drinkInfo !== '') {
        Main += ` (${drinkInfo}<br>`
      }
      row.Main += Main
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: lunchBoxCustom1MainMealId.value,
        productTypeName: lunchBoxCustom1MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: option.id,
        name: option.name,
        value: parseInt(option.quantity),
        type: 1
      }
      row.inputs.push(input)
      option.quantity = 0
    }
  }

  for (const sideDish of lunchBoxCustom1EditSideDishes) {
    if (sideDish.quantity > 0) {
      if (row.sideDishes !== '') {
        row.sideDishes += ', '
      }
      row.sideDishes +=
        sideDish.name + 'x' + parseInt(sideDish.quantity) + '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: lunchBoxCustom1SideDishName.value,
        productTypeId: lunchBoxCustom1SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      // 將帶有數值的 input 推進 inputs
      const input = {
        id: sideDish.id,
        name: sideDish.name,
        value: parseInt(sideDish.quantity),
        is_default: sideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
      sideDish.quantity = 0
    }
  }
  for (const lunchBoxCustom1EditBentoMain of lunchBoxCustom1EditBentoMains) {
    if (lunchBoxCustom1EditBentoMain.quantity > 0) {
      if (row.bentoMains !== '') {
        row.bentoMains += ','
      }
      row.bentoMains +=
        lunchBoxCustom1EditBentoMain.name +
        'x' +
        parseInt(lunchBoxCustom1EditBentoMain.quantity).toString() +
        '<br>'
      // 保留副主餐名稱、副主餐 ID
      const productInput = {
        productTypeName: lunchBoxCustom1BentoMainName.value,
        productTypeId: lunchBoxCustom1BentoMainId.value,
        productType: 'options_with_qty',
        type: 4
      }
      row.productInputs.push(productInput)
      const input = {
        id: lunchBoxCustom1EditBentoMain.id,
        name: lunchBoxCustom1EditBentoMain.name,
        value: parseInt(lunchBoxCustom1EditBentoMain.quantity),
        type: 4
      }
      row.inputs.push(input)
    }
  }
  // 保留 客製盒餐、數量、主餐名稱
  const productInput = {
    id: lunchBoxCustom1ProductId.value,
    name: lunchBoxCustom1Name.value,
    value: parseInt(totalEditQuantity),
    price: lunchBoxCustom1Price.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: lunchboxCustom1Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (lunchBoxCustom1EditArbitrarily.value > 0) {
    if (row.Main !== '') {
      row.Main += ','
    }
    row.Main +=
      '任意搭配' +
      'x' +
      parseInt(lunchBoxCustom1EditArbitrarily.value).toString()
    const input = {
      id: 'lunchBoxCustom1EditArbitrarily',
      value: lunchBoxCustom1EditArbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = lunchBoxCustom1Name.value + totalEditQuantity + '份' // 使用總數量
  checkVegetable(row)
  if (row.Main !== '' || row.sideDishes !== '') {
    const rowIndex = tableRows.findIndex((item) => item.id === editingRow.id)
    tableRows.splice(rowIndex, 1, row)
  }

  editDialog0.value = false
  lunchBoxCustom1EditArbitrarily.value = 0
}
// 單點修改
function editBangdongSolo (row) {
  // 6 吋潤餅歸零
  for (const bangdongSoloEdit6inch of bangdongSoloEdit6inchs) {
    bangdongSoloEdit6inch.quantity = 0
  }
  // 3 吋潤筆歸零
  // for (const bangdongSoloEdit3inch of bangdongSoloEdit3inchs) {
  //   bangdongSoloEdit3inch.quantity = 0;
  // }
  // 飲料歸零
  for (const bangdongSoloEditDrink of bangdongSoloEditDrinks) {
    bangdongSoloEditDrink.quantity = 0
  }
  // 配菜歸零
  for (const bangdongSoloEditSideDish of bangdongSoloEditSideDishes) {
    bangdongSoloEditSideDish.quantity = 0
  }
  // 副主餐歸零
  for (const bangdongSoloEditBentoMain of bangdongSoloEditBentoMains) {
    bangdongSoloEditBentoMain.quantity = 0
  }
  // 環保袋歸零
  for (const bangdongSoloEditEcoBag of bangdongSoloEditEcoBags) {
    bangdongSoloEditEcoBag.quantity = 0
  }
  // 雞胸便當主餐隱藏欄位歸零
  for (const input of row.inputs) {
    const name = input.name
    const value = input.value
    // 6 吋潤餅 推入 input 數值
    const mainIndex = bangdongSoloEdit6inchs.findIndex(
      (bangdongSoloEdit6inch) => bangdongSoloEdit6inch.name === name
    )
    if (mainIndex >= 0) {
      bangdongSoloEdit6inchs[mainIndex].quantity = parseInt(value)
    }
    // 3 吋潤筆 推入 input 數值
    // const threeInchIndex = bangdongSoloEdit3inchs.findIndex(
    //   (bangdongSoloEdit3inch) => bangdongSoloEdit3inch.name === name
    // );
    // if (threeInchIndex >= 0) {
    //   bangdongSoloEdit3inchs[threeInchIndex].quantity = parseInt(value);
    // }
    // 飲料 推入 input 數值
    const drinkIndex = bangdongSoloEditDrinks.findIndex(
      (bangdongSoloEditDrink) => bangdongSoloEditDrink.name === name
    )
    if (drinkIndex >= 0) {
      bangdongSoloEditDrinks[drinkIndex].quantity = parseInt(value)
    }
    // 配菜 推入 input 數值
    const sideDishIndex = bangdongSoloEditSideDishes.findIndex(
      (bangdongSoloEditSideDish) => bangdongSoloEditSideDish.name === name
    )
    if (sideDishIndex >= 0) {
      bangdongSoloEditSideDishes[sideDishIndex].quantity = parseInt(value)
    }
    // 副主餐 推入 input 數值
    const bentoMainIndex = bangdongSoloEditBentoMains.findIndex(
      (bangdongSoloEditBentoMain) => bangdongSoloEditBentoMain.name === name
    )
    if (bentoMainIndex >= 0) {
      bangdongSoloEditBentoMains[bentoMainIndex].quantity = parseInt(value)
    }
    // 環保袋 推入 input 數值
    const ecoBagIndex = bangdongSoloEditEcoBags.findIndex(
      (bangdongSoloEditEcoBag) => bangdongSoloEditEcoBag.name === name
    )
    if (ecoBagIndex >= 0) {
      bangdongSoloEditEcoBags[ecoBagIndex].quantity = parseInt(value)
    }
  }

  editingRow = row
  bangdongSoloComment.value = row.comment
  editDialog10.value = true
}

// 計算總數量
const bangdongSoloEditTotalQuantity = computed(() => {
  let total = 0
  total += bangdongSoloEdit6inchs.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  )
  // total += bangdongSoloEdit3inchs.reduce(
  //   (sum, item) => sum + Number(item.quantity),
  //   0
  // );
  total += bangdongSoloEditDrinks.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  )
  total += bangdongSoloEditSideDishes.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  )
  total += bangdongSoloEditBentoMains.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  )
  total += bangdongSoloEditEcoBags.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  )

  return total
})
// 計算總價格
const bangdongSoloEditTotalQuantityPrice = computed(() => {
  let total = 0
  total += bangdongSoloEdit6inchs.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.price),
    0
  )
  // total += bangdongSoloEdit3inchs.reduce(
  //   (sum, item) => sum + Number(item.quantity) * Number(item.price),
  //   0
  // );
  total += bangdongSoloEditDrinks.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.price),
    0
  )
  total += bangdongSoloEditSideDishes.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.price),
    0
  )
  total += bangdongSoloEditBentoMains.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.price),
    0
  )
  total += bangdongSoloEditEcoBags.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.price),
    0
  )

  return total
})
// 關閉修正欄位
function closeEditDialog10 () {
  editDialog10.value = false
}
// 完成後儲存並且將資料推進 tableRows 刪除原本的資料
function saveEditDialog10 () {
  const row = {
    bentoType: 10,
    id: editingRow.id, // 使用新生成的 ID
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    price: bangdongSoloEditTotalQuantityPrice.value,
    optionPrice: 0,
    totalPrice: bangdongSoloEditTotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: bangdongSoloComment.value
  }

  const totalQuantity = bangdongSoloEditTotalQuantity.value

  // 儲存推入潤餅置入 table
  // 6 吋潤餅
  const bangdongSoloEdit6inchCompositions = []
  for (const bangdongSoloEdit6inch of bangdongSoloEdit6inchs) {
    if (bangdongSoloEdit6inch.quantity > 0) {
      const bangdongSoloEdit6inchComposition = `${bangdongSoloEdit6inch.name} x${bangdongSoloEdit6inch.quantity} `
      bangdongSoloEdit6inchCompositions.push(bangdongSoloEdit6inchComposition)
      // 保留 6 吋潤餅名稱、ID
      const productInput = {
        productTypeName: bangdongSolo6inchName.value,
        productTypeId: bangdongSolo6inchId.value,
        productType: 'options_with_qty',
        type: 5
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongSoloEdit6inch.id,
        name: bangdongSoloEdit6inch.name,
        value: parseInt(bangdongSoloEdit6inch.quantity),
        type: 5
      }
      row.inputs.push(input)

      bangdongSoloEdit6inch.quantity = 0
    }
  }
  // 3 吋潤餅
  // const bangdongSoloEdit3inchCompositions = [];
  // for (const bangdongSoloEdit3inch of bangdongSoloEdit3inchs) {
  //   if (bangdongSoloEdit3inch.quantity > 0) {
  //     const bangdongSoloEdit3inchComposition = `${bangdongSoloEdit3inch.name} x${bangdongSoloEdit3inch.quantity}`;
  //     bangdongSoloEdit3inchCompositions.push(bangdongSoloEdit3inchComposition);
  //     // 保留 3 吋潤餅名稱、ID
  //     const productInput = {
  //       productTypeName: bangdongSolo3inchName.value,
  //       productTypeId: bangdongSolo3inchId.value,
  //       productType: "options_with_qty",
  //       type: 6,
  //     };
  //     row.productInputs.push(productInput);
  //     const input = {
  //       id: bangdongSoloEdit3inch.id,
  //       name: bangdongSoloEdit3inch.name,
  //       value: parseInt(bangdongSoloEdit3inch.quantity),
  //       type: 6,
  //     };
  //     row.inputs.push(input);

  //     bangdongSoloEdit3inch.quantity = 0;
  //   }
  // }

  if (bangdongSoloEdit6inchCompositions.length > 0) {
    row.Main += `${
      bangdongSolo6inchName.value
    } (${bangdongSoloEdit6inchCompositions.join(', ')})`
  }

  // if (bangdongSoloEdit3inchCompositions.length > 0) {
  //   if (bangdongSoloEdit3inchCompositions.length > 0) {
  //     row.Main += ", ";
  //   }
  //   row.Main += `${
  //     bangdongSolo3inchName.value
  //   }  (${bangdongSoloEdit3inchCompositions.join(", ")})`;
  // }
  // 儲存推入飲料置入 table
  for (const bangdongSoloEditDrink of bangdongSoloEditDrinks) {
    if (bangdongSoloEditDrink.quantity > 0) {
      if (row.drinks !== '') {
        row.drinks += ','
      }
      row.drinks +=
        bangdongSoloEditDrink.name +
        'x' +
        parseInt(bangdongSoloEditDrink.quantity).toString() +
        '<br>'
      // 保留飲料名稱、ID
      const productInput = {
        productTypeName: bangdongSoloDrinkName.value,
        productTypeId: bangdongSoloDrinkId.value,
        productType: 'options_with_qty',
        type: 7
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongSoloEditDrink.id,
        name: bangdongSoloEditDrink.name,
        price: bangdongSoloEditDrink.price,
        value: parseInt(bangdongSoloEditDrink.quantity),
        type: 7
      }
      row.inputs.push(input)
      bangdongSoloEditDrink.quantity = 0
    }
  }
  // 儲存推入配菜置入 table
  const bangdongSoloEditSideDishCompositions = []
  for (const bangdongSoloEditSideDish of bangdongSoloEditSideDishes) {
    if (bangdongSoloEditSideDish.quantity > 0) {
      const bangdongSoloEditSideDishComposition = `${bangdongSoloEditSideDish.name} x${bangdongSoloEditSideDish.quantity}`
      bangdongSoloEditSideDishCompositions.push(
        bangdongSoloEditSideDishComposition
      )
      // 保留配菜名稱、ID
      const productInput = {
        productTypeName: bangdongSoloSideDishName.value,
        productTypeId: bangdongSoloSideDishId.value,
        productType: 'options_with_qty',
        type: 8
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongSoloEditSideDish.id,
        name: bangdongSoloEditSideDish.name,
        price: bangdongSoloEditSideDish.price,
        value: parseInt(bangdongSoloEditSideDish.quantity),
        is_default: bangdongSoloEditSideDish.is_default,
        type: 8
      }
      row.inputs.push(input)
      row.Main += `${bangdongSoloEditSideDishCompositions.join(', ')})`
      bangdongSoloEditSideDish.quantity = 0
    }
  }
  // 儲存推入副主餐置入 table
  const bangdongSoloEditBentoMainCompositions = []
  for (const bangdongSoloEditBentoMain of bangdongSoloEditBentoMains) {
    if (bangdongSoloEditBentoMain.quantity > 0) {
      const bangdongSoloEditBentoMainComposition = `${bangdongSoloEditBentoMain.name} x${bangdongSoloEditBentoMain.quantity}`
      bangdongSoloEditBentoMainCompositions.push(
        bangdongSoloEditBentoMainComposition
      )
      // 保留副主餐名稱、ID
      const productInput = {
        productTypeName: bangdongSoloBentoMainName.value,
        productTypeId: bangdongSoloBentoMainId.value,
        productType: 'options_with_qty',
        type: 9
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongSoloEditBentoMain.id,
        name: bangdongSoloEditBentoMain.name,
        price: bangdongSoloEditBentoMain.price,
        value: parseInt(bangdongSoloEditBentoMain.quantity),
        type: 9
      }
      row.inputs.push(input)

      bangdongSoloEditBentoMain.quantity = 0
    }
  }

  if (bangdongSoloEditSideDishCompositions.length > 0) {
    row.Main += `配菜 (${bangdongSoloEditSideDishCompositions.join(', ')})`
  }

  if (bangdongSoloEditBentoMainCompositions.length > 0) {
    if (bangdongSoloEditSideDishCompositions.length > 0) {
      row.Main += ', '
    }
    row.Main += `副主餐 (${bangdongSoloEditBentoMainCompositions.join(', ')})`
  }
  row.name = bangdongSoloEditName.value + totalQuantity + '份'
  checkVegetable(row)
  // 購物袋
  const ecoBagCompositions = []
  for (const bangdongSoloEditEcoBag of bangdongSoloEditEcoBags) {
    if (bangdongSoloEditEcoBag.quantity > 0) {
      const ecoBagComposition = `${bangdongSoloEditEcoBag.name} x${bangdongSoloEditEcoBag.quantity}`
      ecoBagCompositions.push(ecoBagComposition)
      // 保留購物袋名稱、ID
      const productInput = {
        productTypeName: bangdongSoloEcoBagName.value,
        productTypeId: bangdongSoloEcoBagId.value,
        productType: 'options_with_qty',
        type: 0
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongSoloEditEcoBag.id,
        name: bangdongSoloEditEcoBag.name,
        price: bangdongSoloEditEcoBag.price,
        value: parseInt(bangdongSoloEditEcoBag.quantity),
        type: 0
      }
      row.inputs.push(input)
      bangdongSoloEditEcoBag.quantity = 0
    }
  }

  if (ecoBagCompositions.length > 0) {
    row.name += ` (${ecoBagCompositions.join(', ')})`
  }
  const productInput = {
    id: bangdongSoloProductId.value,
    name: bangdongSoloName.value,
    value: parseInt(totalQuantity),
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    price: 0,
    comment: bangdongSoloComment.value
  }
  console.log(productInput)
  row.productInputs.push(productInput)
  // 將這個 row 推進 tableRows 中
  const rowIndex = tableRows.findIndex((r) => r === editingRow)
  if (rowIndex !== -1) {
    tableRows.splice(rowIndex, 1, row) // 在移除元素的同時插入新元素
  }
  editDialog10.value = false
}
// -------------------------------------------------------------------------

// 盒餐開關
const showlunchBox = ref(false)
// 是否已經抓取過資料的狀態變數
const isLunchBox1Loaded = ref(false)
const isLunchBox2Loaded = ref(false)
const isLunchBox3Loaded = ref(false)
const isLunchBox4Loaded = ref(false)
const isLunchBox214Loaded = ref(false)

const loadlunchboxall = () => {
  if (!isLunchBox1Loaded.value) {
    loadLunchBox1()
    loadLunchBox1Edit()
    isLunchBox1Loaded.value = true
  }
  if (!isLunchBox2Loaded.value) {
    loadLunchBox2()
    loadLunchBox2Edit()
    isLunchBox2Loaded.value = true
  }
  if (!isLunchBox3Loaded.value) {
    loadLunchBox3()
    loadLunchBox3Edit()
    isLunchBox3Loaded.value = true
  }
  if (!isLunchBox4Loaded.value) {
    loadLunchBox4()
    loadLunchBox4Edit()
    isLunchBox4Loaded.value = true
  }
  if (!isLunchBox214Loaded.value) {
    loadLunchBox214()
    loadLunchBox214Edit()
    isLunchBox214Loaded.value = true
  }
}

const openlunchBox = () => {
  showlunchBox.value = true
  loadlunchboxall()
}
const showlunchBox1 = ref(false)
const showlunchBox2 = ref(false)
const showlunchBox3 = ref(false)
const showlunchBox4 = ref(false)
const showlunchBox214 = ref(false)
const showbangdong1 = ref(false)
const showbangdong2 = ref(false)
const showbangdong3 = ref(false)
const showbangdong4 = ref(false)
const showbangdongSalmon = ref(false)
const showbangdongVegetarian1 = ref(false)
const showbangdongVegetarian2 = ref(false)
// 單點開關
const showbangdongSolo = ref(false)

const isBangdongSoloLoaded = ref(false)

const opensolo = () => {
  showbangdongSolo.value = true
  loadBangdongSoloAll()
}
const loadBangdongSoloAll = () => {
  if (!isBangdongSoloLoaded.value) {
    loadBangdongSolo()
    loadBangdongSoloEdit()
    isBangdongSoloLoaded.value = true
  }
}
// 客製便當開關
const showbangdongCustom1 = ref(false)

const isBangdongCustom1Loaded = ref(false)

const openCustomBangdong = () => {
  showbangdongCustom1.value = true
  loadCustomBangdongAll()
}
const loadCustomBangdongAll = () => {
  if (!isBangdongCustom1Loaded.value) {
    loadBangdongCustom1()
    loadBangdongCustom1Edit()
    isBangdongCustom1Loaded.value = true
  }
}
// 客製餐盒開關
const showLunchBoxCustom1 = ref(false)

const isLunchBoxCustom1Loaded = ref(false)
const openCustomLunchBox = () => {
  showLunchBoxCustom1.value = true
  loadCustomlunchboxAll()
}
const loadCustomlunchboxAll = () => {
  if (!isLunchBoxCustom1Loaded.value) {
    loadLunchBoxCustom1()
    loadLunchBoxCustom1Edit()
    isLunchBoxCustom1Loaded.value = true
  }
}
const isSubmitting = ref(false)
// 添加新訂單
const alreadyCheck = () => {
  confirm.value = true
}
const addOrderFirst = async () => {
  personForm.orderStatu = 'Pending'
  await addOrder()
  showPersonDialog.value = false
}
const addOrder = async () => {
  confirm.value = false
  showPersonDialog.value = false
  if (personForm.orderStatu === '請選擇') {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'error',
      message: '請選擇訂單狀態'
    })
    return
  }
  if (paymentMethod.value === '') {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'error',
      message: '請選擇付款方式'
    })
    return
  }
  const findAddress = async () => {
    let state = address.state.find(
      (address) => address.label === personForm.address
    )
    if (state === undefined) {
      state = address.state.find(
        (address) => address.value === personForm.address
      )
    }
    if (state !== undefined) {
      personForm.address = state.value
    }
    if (state === undefined) {
      personForm.address = ''
    }
  }
  const findCity = async (val) => {
    await address.getcity(val) //
    if (personForm.address2) {
      // 使用 Array.find 尋找匹配的城市，並確保有 return 語句
      let city = address.city.find(
        (address) => address.label === personForm.address2
      )
      // 如果未找到，則使用 value 進行第二次尋找
      if (city === undefined) {
        city = address.city.find(
          (address) => address.value === personForm.address2
        )
      }
      // 檢查是否找到匹配的項目
      if (city !== undefined) {
        personForm.address2 = city.value
      }
      if (city === undefined) {
        personForm.address2 = ''
      }
    }
  }
  console.log(personForm.event)
  if (personForm.address) {
    await findAddress()
  }
  if (personForm.address2) {
    await findCity(personForm.address)
  }
  isSubmitting.value = true
  try {
    const formData = new FormData()

    if (personForm.pick === '自取') {
      personForm.road = '自取'
    }
    if (personForm.prefix == null) {
      personForm.prefix = ''
    }
    if (personForm.hometel2 == null) {
      personForm.hometel2 = ''
    }
    if (personForm.hometel == null) {
      personForm.hometel = ''
    }

    const locationIdValue = computed(() => {
      if (personForm.locationId === '重慶南') {
        return 1
      } else if (personForm.locationId === '和平') {
        return 2
      } else {
        return 1
      }
    })

    const memberId = personForm.memberId || ''
    // 添加基本的訂單信息
    formData.append('order_id', '') // 訂單編號
    formData.append('customer_id', memberId) // 訂購人編號
    formData.append('order_date', personForm.checkDate) // 訂購日期
    formData.append('shipping_method', personForm.pick) // 取貨方式
    formData.append('delivery_date_ymd', personForm.getDate) // 送達日
    formData.append('delivery_date_hi', personForm.delivery_date_hi) // 送達時間
    formData.append('delivery_time_range', personForm.time) // 送達時間範圍
    formData.append('shipping_road_abbr', personForm.road) // 送達路段
    formData.append('personal_name', personForm.name) // 訂購人姓名
    formData.append('salutation_id', personForm.gender) // 稱謂 (即性別，先生 / 小姐)
    formData.append('mobile', personForm.tel) // 訂購人手機
    formData.append('telephone_prefix', personForm.prefix) // 區碼
    formData.append(
      'telephone',
      personForm.hometel + '#' + personForm.hometel2
    ) // 訂購人電話
    formData.append('payment_company', personForm.getCompany) // 訂購公司
    formData.append('payment_department', personForm.department) // 訂購公司部門
    formData.append('payment_tin', personForm.compilation) // 統一編號
    formData.append('is_payment_tin', personForm.noCompilation ? 1 : 0) // 是否需要統編
    formData.append('payment_method', paymentMethod.value) //  付款方式
    formData.append('scheduled_payment_date', getMoneyDate.value) // 付款日期
    formData.append('payment_total', total.value) //  總金額
    formData.append('payment_paid', paid.value) //  付款金額
    formData.append('payment_unpaid', unpaid.value) //  未付餘額
    formData.append('order_tags', personForm.event) //  訂單標籤
    formData.append('shipping_personal_name', personForm.recipient) //  personForm.recipient
    formData.append('shipping_state_id', personForm.address || '') //  縣市代號
    formData.append('shipping_city_id', personForm.address2 || '') //  鄉鎮市區代號
    formData.append('shipping_road', personForm.road || '') //  送達地址
    formData.append('shipping_address1', personForm.road2 || '') //  送達地址
    formData.append('shipping_company', personForm.getCompany) //  收件公司
    formData.append('shipping_phone', personForm.recipientTel) //  收件人電話
    formData.append('comment', personForm.remark) //  客戶備註
    formData.append('extra_comment', mealRemark.value) //  餐點備註
    // formData.append("status_id", personForm.orderStatu); // 設定訂單狀態
    formData.append('status_code', personForm.orderStatu) // 設定訂單狀態
    formData.append('location_id', locationIdValue.value) // 設定訂單狀態
    // formData.append("shipping_road_abbr",personForm.road)
    formData.append('order_totals[sub_total][title]', '商品合計') // 商品合計
    formData.append('order_totals[sub_total][value]', productPrice.value)
    // formData.append('order_totals[sub_total][sort_order]', 1)
    formData.append('order_totals[discount][title]', '優惠折扣') // 優惠折扣
    formData.append('order_totals[discount][value]', discount.value)
    // formData.append('order_totals[discount][sort_order]', 2)
    formData.append('order_totals[shipping_fee][title]', '運費') // 運費
    formData.append('order_totals[shipping_fee][value]', freight.value)
    // formData.append('order_totals[shipping_fee][sort_order]', 3)
    formData.append('order_totals[total][title]', '總計') // 總計
    formData.append('order_totals[total][value]', total.value)
    // formData.append('order_totals[total ][sort_order]', 4)

    // 添加訂單產品
    for (const row of tableRows) {
      for (const productInput of row.productInputs) {
        if (Object.prototype.hasOwnProperty.call(productInput, 'name')) {
          formData.append(
            `order_products[${row.id}][main_category_code]`,
            meal.getCategoryCode(productInput.name)
          )
          formData.append(
            `order_products[${row.id}][product_id]`,
            productInput.id
          )
          formData.append(`order_products[${row.id}][name]`, productInput.name)
          formData.append(
            `order_products[${row.id}][quantity]`,
            productInput.value
          )
          formData.append(
            `order_products[${row.id}][price]`,
            productInput.price
          )
          formData.append(
            `order_products[${row.id}][total]`,
            productInput.totalPrice
          )
          formData.append(
            `order_products[${row.id}][final_total]`,
            productInput.finaltotalPrice
          )
          formData.append(
            `order_products[${row.id}][options_total]`,
            productInput.optionPrice
          )
          formData.append(
            `order_products[${row.id}][comment]`,
            productInput.comment
          )
        }
      }

      let productOptionIndex = 1
      for (const productInput of row.productInputs) {
        if (
          typeof productInput.productTypeId !== 'undefined' &&
          typeof productInput.productType !== 'undefined' &&
          typeof productInput.productTypeName !== 'undefined'
        ) {
          formData.append(
            `order_products[${row.id}][product_options][${productOptionIndex}][product_option_id]`,
            productInput.productTypeId
          )
          formData.append(
            `order_products[${row.id}][product_options][${productOptionIndex}][type]`,
            productInput.productType
          )
          formData.append(
            `order_products[${row.id}][product_options][${productOptionIndex}][name]`,
            productInput.productTypeName
          )

          let productOptionValueIndex = 1
          for (const input of row.inputs) {
            if (
              input.mainId === productInput.mainId &&
              input.type === productInput.type
            ) {
              if (!input.name.includes('任意搭配')) {
                if (input.name !== 'Arbitrarily') {
                  formData.append(
                    `order_products[${row.id}][product_options][${productOptionIndex}][product_option_values][${productOptionValueIndex}][product_option_value_id]`,
                    input.id
                  )
                  formData.append(
                    `order_products[${row.id}][product_options][${productOptionIndex}][product_option_values][${productOptionValueIndex}][value]`,
                    input.name
                  )
                  formData.append(
                    `order_products[${row.id}][product_options][${productOptionIndex}][product_option_values][${productOptionValueIndex}][quantity]`,
                    input.value
                  )
                  if (input.mainId) {
                    formData.append(
                      `order_products[${row.id}][product_options][${productOptionIndex}][product_option_values][${productOptionValueIndex}][parent_povid]`,
                      input.mainId
                    )
                  }

                  productOptionValueIndex++
                }
              }
            }
          }
          productOptionIndex++
        }
      }
    }

    // 發送訂單到 API
    const response = await apiAuth.post('sale/order/save', formData)
    if (!response.data.success) {
      $q.notify({
        color: 'red-4',
        position: 'center',
        message: response.data.error
      })
    } else {
      $q.notify({
        color: 'accent',
        textColor: 'white',
        position: 'center',
        message: response.data.success + '訂單編號 : ' + response.data.code
      })
    }
    // 清空 tableRows
    tableRows.splice(0, tableRows.length)
    onReset()
    getMoneyDate.value = ''
    paid.value = 0
    freight.value = 0
    discount.value = 0
    mealRemark.value = ''
  } catch (error) {
    console.error(error)
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'error',
      position: 'center',
      message: 'An error occurred: ' + error.message
    })
  } finally {
    isSubmitting.value = false
  }
}

// 編輯訂單
const editOrder = async () => {
  confirm.value = false
  if (personForm.orderStatu === '請選擇') {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'error',
      message: '請選擇訂單狀態'
    })
    return
  }
  if (tableRows.length === 0) {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'warning',
      position: 'center',
      message: '還沒點餐唷，請先加入餐點'
    })
    return
  }
  if (paymentMethod.value === '') {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'error',
      message: '請選擇付款方式'
    })
    return
  }
  if (isSubmitting.value) {
    return
  }

  isSubmitting.value = true
  try {
    // 導入資料縣市
    console.log(meal.order.shipping_state_id, meal.order.shipping_city_id)
    if (isNaN(meal.order.shipping_city_id)) {
      let city = address.city.find(
        (c) => c.label === meal.order.shipping_city_id
      )
      if (city === undefined) {
        city = address.city.find(
          (c) => c.value === meal.order.shipping_city_id
        )
      }
      meal.order.shipping_city_id = city.value
    }
    console.log(meal.order.shipping_state_id, meal.order.shipping_city_id)
    const formData = new FormData()

    // 添加基本的訂單信息
    formData.append('order_id', meal.order.id) // 訂單編號
    formData.append('customer_id', meal.order.customer_id) // 訂購人編號
    formData.append('order_date', meal.order.order_date) // 訂購日期
    formData.append('shipping_method', meal.order.shipping_method) // 取貨方式
    formData.append('delivery_date_ymd', meal.order.delivery_date_ymd) // 送達日
    formData.append('delivery_date_hi', meal.order.delivery_date_hi) // 送達時間
    formData.append('delivery_time_range', meal.order.delivery_time_range) // 送達時間範圍
    formData.append('shipping_road_abbr', meal.order.shipping_road_abbr) // 送達路段
    formData.append('personal_name', meal.order.personal_name) // 訂購人姓名
    formData.append('salutation_id', 18) // 稱謂 (即性別，先生 / 小姐)
    formData.append('mobile', meal.order.mobile) // 訂購人手機
    formData.append('telephone_prefix', meal.order.telephone_prefix) // 區碼
    formData.append('telephone', meal.order.telephone) // 訂購人電話
    formData.append('payment_company', meal.order.payment_company) // 訂購公司
    formData.append('payment_department', meal.order.payment_department) // 訂購公司部門
    formData.append('payment_tin', meal.order.payment_tin) // 統一編號
    formData.append('is_payment_tin', meal.order.is_payment_tin) // 是否需要統編
    formData.append('payment_method', paymentMethod.value) //  付款方式
    formData.append('scheduled_payment_date', getMoneyDate.value) // 付款日期
    formData.append('payment_total', total.value) //  總金額
    formData.append('payment_paid', meal.order.payment_paid) //  付款金額
    formData.append('payment_unpaid', total.value) //  未付餘額
    formData.append('order_tags', meal.order.order_tags) //  訂單標籤
    formData.append(
      'shipping_personal_name',
      meal.order.shipping_personal_name
    ) //  personForm.recipient
    formData.append('shipping_state_id', meal.order.shipping_state_id) //  縣市代號
    formData.append('shipping_city_id', meal.order.shipping_city_id) //  鄉鎮市區代號
    formData.append('shipping_road', meal.order.shipping_road) //  送達地址
    formData.append('shipping_address1', meal.order.shipping_address1) //  送達地址
    formData.append('payment_company', meal.order.payment_company) //  收件公司
    formData.append('shipping_phone', meal.order.shipping_phone) //  收件人電話
    formData.append('comment', meal.order.comment) //  客戶備註
    formData.append('extra_comment', meal.order.extra_comment) //  餐點備註
    // formData.append("status_id", personForm.orderStatu); // 設定訂單狀態
    formData.append('status_code', personForm.orderStatu) // 設定訂單狀態
    formData.append('location_id', meal.order.location_id) // 設定訂單狀態
    formData.append('order_totals[sub_total][title]', '商品合計') // 商品合計
    formData.append('order_totals[sub_total][value]', productPrice.value)
    formData.append('order_totals[discount][title]', '優惠折扣') // 優惠折扣
    formData.append('order_totals[discount][value]', discount.value)
    formData.append('order_totals[shipping_fee][title]', '運費') // 運費
    formData.append('order_totals[shipping_fee][value]', freight.value)
    formData.append('order_totals[total][title]', '總計') // 總計
    formData.append('order_totals[total][value]', total.value)

    // 添加訂單產品
    for (const row of tableRows) {
      for (const productInput of row.productInputs) {
        if (Object.prototype.hasOwnProperty.call(productInput, 'name')) {
          formData.append(
            `order_products[${row.id}][main_category_code]`,
            meal.getCategoryCode(productInput.name)
          )
          formData.append(
            `order_products[${row.id}][product_id]`,
            productInput.id
          )
          formData.append(`order_products[${row.id}][name]`, productInput.name)
          formData.append(
            `order_products[${row.id}][quantity]`,
            productInput.value
          )
          formData.append(
            `order_products[${row.id}][price]`,
            productInput.price
          )
          formData.append(
            `order_products[${row.id}][total]`,
            productInput.totalPrice
          )
          formData.append(
            `order_products[${row.id}][final_total]`,
            productInput.finaltotalPrice
          )
          formData.append(
            `order_products[${row.id}][options_total]`,
            productInput.optionPrice
          )
          formData.append(
            `order_products[${row.id}][comment]`,
            productInput.comment
          )
        }
      }

      let productOptionIndex = 1
      for (const productInput of row.productInputs) {
        if (
          typeof productInput.productTypeId !== 'undefined' &&
          typeof productInput.productType !== 'undefined' &&
          typeof productInput.productTypeName !== 'undefined'
        ) {
          formData.append(
            `order_products[${row.id}][product_options][${productOptionIndex}][product_option_id]`,
            productInput.productTypeId
          )
          formData.append(
            `order_products[${row.id}][product_options][${productOptionIndex}][type]`,
            productInput.productType
          )
          formData.append(
            `order_products[${row.id}][product_options][${productOptionIndex}][name]`,
            productInput.productTypeName
          )

          let productOptionValueIndex = 1
          for (const input of row.inputs) {
            if (
              input.mainId === productInput.mainId &&
              input.type === productInput.type
            ) {
              if (!input.name.includes('任意搭配')) {
                if (input.name !== 'Arbitrarily') {
                  formData.append(
                    `order_products[${row.id}][product_options][${productOptionIndex}][product_option_values][${productOptionValueIndex}][product_option_value_id]`,
                    input.id
                  )
                  formData.append(
                    `order_products[${row.id}][product_options][${productOptionIndex}][product_option_values][${productOptionValueIndex}][value]`,
                    input.name
                  )
                  formData.append(
                    `order_products[${row.id}][product_options][${productOptionIndex}][product_option_values][${productOptionValueIndex}][quantity]`,
                    input.value
                  )
                  if (input.mainId) {
                    formData.append(
                      `order_products[${row.id}][product_options][${productOptionIndex}][product_option_values][${productOptionValueIndex}][parent_povid]`,
                      input.mainId
                    )
                  }

                  productOptionValueIndex++
                }
              }
            }
          }
          productOptionIndex++
        }
      }
    }

    // 發送訂單到 API
    const response = await apiAuth.post('sale/order/save', formData)
    if (!response.data.success) {
      $q.notify({
        color: 'red-4',
        textColor: 'white',
        position: 'center',
        message: response.data.error
      })
    } else {
      $q.notify({
        color: 'accent',
        textColor: 'white',
        position: 'center',
        message: response.data.success + '訂單編號 : ' + response.data.code
      })
    }
    // 清空 tableRows
    tableRows.splice(0, tableRows.length)
    onReset()
    getMoneyDate.value = ''
    paid.value = 0
    freight.value = 0
    discount.value = 0
    mealRemark.value = ''
  } catch (error) {
    console.error(error)
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'error',
      position: 'center',
      message: 'An error occurred: ' + error.message
    })
  } finally {
    isSubmitting.value = false
    meal.order = []
    meal.id = ''
    meal.orderdetails = []
  }
}

// q-date-------------------------------------
const showDatePicker = ref(false)

const showDatePicker2 = ref(false)
watch(
  () => personForm.checkDate,
  (newDate, oldDate) => {
    showDatePicker2.value = false
  }
)

// ---------------------------------------------------
if (meal.shouldEdit === true) {
  for (let i = 0; i < meal.tableRows.length; i++) {
    tableRows.push(meal.tableRows[i])
  }
  console.log(tableRows)
  personForm.orderStatu = meal.status_id
  paymentMethod.value = meal.order.payment_method
  // freight.value=meal.order.shipping_fee
  meal.tableRows = []
  meal.shouldEdit = false
  freight.value = meal?.order.totals?.[2]?.value || 0
}
// --------------------------------------------------road
const dialogRoad = ref(false)
const ITEMS_PER_PAGE = 55
const searchTerm = ref('')
const currentPage = ref(1)
const roads = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return road.roads
    .filter((road) => road.value.includes(searchTerm.value))
    .slice(start, end)
})
const totalPages = computed(() =>
  Math.ceil(road.roads.length / ITEMS_PER_PAGE)
)

const copyroad = (val) => {
  personForm.address2 = val.split('_')[0]
  personForm.road = val.split('_')[1]
  dialogRoad.value = false
}
const opendialogRoad = async (val, val2, val3) => {
  // console.log(val3);
  if (!val3) {
    await road.getRoad(val, val2)
  } else {
    await road.getRoadFull(val, val2, val3)
  }
  dialogRoad.value = true
}

if (meal.notsavemeals === true) {
  editOrder()
  meal.notsavemeals = false
  meal.id = ''
  meal.order = []
  meal.orderdetails = []
}
// --------------------
const onItemClick = (val, val2) => {
  console.log('Clicked on an Item')
  personForm.road = val
  personForm.address2 = val2.split('_')[0]
  menuState.value = false
}

const uberCustomer = async () => {
  if (tag.uberCustomer) {
    personForm.pick = '自取'
    personForm.name = '門市客'
    personForm.tel = '0900000000'
    personForm.getDate = today
    personForm.time = '12:00'
    personForm.sameOrderCustomer = true
    setTimeout(async () => {
      await memerSave()
    }, 2550)
    tag.uberCustomer = false
  }
}
uberCustomer()
watch(
  () => personForm.prefix,
  (newval, oldval) => {
    if (newval === '02' || newval === '03') {
      hometelRef.value.focus()
    }
  }
)
onBeforeRouteLeave((to, from, next) => {
  const answer = window.confirm('確定離開嗎？')
  if (answer) {
    // 如果用戶確認，則繼續路由導航
    next()
  } else {
    // 如果用戶取消，則阻止路由導航
    next(false)
  }
})
</script>

<style lang="scss" scoped>
@import "../../css/order.scss";
</style>
