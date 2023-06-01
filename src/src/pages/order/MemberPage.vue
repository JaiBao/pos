<!-- <template>
  <table class="table table-bordered table-hover" id="table-order-header">
                    <tbody>
                      <tr>
                        <td colspan="8">重慶南店

                        <label for="input-order_date">訂購日期 </label>
                        <input type="date" id="input-order_date" name="order_date" value="2023-03-31">

                        &nbsp;&nbsp;&nbsp;訂單狀態
                          <select id="status_id" name="status_id">
                            <option value="">--</option>
                                                            <option value="101" selected="">未確認</option>
                                                            <option value="116">待配餐</option>
                                                            <option value="103">已確認</option>
                                                            <option value="117">未結清</option>
                                                            <option value="118">已結案</option>
                                                            <option value="115">作廢</option>
                                                        </select>&nbsp;&nbsp;

                          取貨方式
                          <select id="input-shipping_method" name="shipping_method">
                            <option value="">--</option>
                            <option value="shipping_pickup">自取</option>
                            <option value="shipping_delivery">派送</option>
                          </select>

                        </td>
                      </tr>
                      <tr>
                        <td class="text-end colname" style="width:85px;">送達日</td>
                        <td class="text-start width6char"><input type="date" id="input-delivery_date" name="delivery_date" value="2023-03-31" class="form-control"></td>
                        <td class="text-end colname3char">星期</td>
                        <td class="text-start width7char"><input type="text" id="input-delivery_day_of_week" name="delivery_day_of_week" value="五" class="form-control" readonly=""></td>

                        <td class="text-start" colspan="4">

                          <label target="_blank" for="input-delivery_time_range" data-bs-toggle="tooltip" data-bs-original-title="例如：11:30 - 12:30。本欄未嚴格限制，可輸入文字。例如 最好12點前">送達時間範圍 <i class="fa fa-question-circle" aria-hidden="true"></i></label>
                          <input type="text" id="input-delivery_time_range" name="delivery_time_range" value="" placeholder="例如 1130 - 1230" style="width:120px;">

                          &nbsp;&nbsp;
                          <label target="_blank" data-bs-toggle="tooltip" data-bs-original-title="格式必須是幾點:幾分，例如 12:30。">排單時間 <i class="fa fa-question-circle" aria-hidden="true"></i></label>
                          <input type="text" id="input-delivery_time" name="delivery_time" value="" class="width4char" placeholder="例如 12:00">

                          &nbsp;&nbsp;
                          <label target="_blank" data-bs-toggle="tooltip" title="任意文字。請盡量簡短。例如&quot;中山南&quot;">送達路段 <i class="fa fa-question-circle" aria-hidden="true"></i></label>
                          <input type="text" id="input-shipping_address_section" name="shipping_address_section" value="" style="width:110px;">

                          &nbsp;&nbsp;
                          <label target="_blank" for="input-delivery_time_comment" data-bs-toggle="tooltip" title="a 或 b 或 a,b">控單表備註 <i class="fa fa-question-circle" aria-hidden="true"></i>
                            <input type="text" id="input-delivery_time_comment" name="delivery_time_comment" value="" class="width4char">
                          </label>
                        </td>
                      </tr>

                      <tr>
                        <td class="text-end colname required">訂購人</td>
                        <td class="text-start width6char">
                          <input type="hidden" id="input-customer_id" name="customer_id" value="">

                          <div class="input-group mb-3">
                            <input type="text" id="input-personal_name" name="personal_name" class="form-control" aria-label="personal_name" value="" data-oc-target="autocomplete-personal_name" autocomplete="off" minlength="1">
                            <div class="input-group-append">
                              <a class="input-group-text" target="_self" id="a-order_list" href="sale/orders?filter_customer_id="><i class="fa-solid fa-list"></i></a>
                            </div>
                          </div>

                          <ul id="autocomplete-personal_name" class="dropdown-menu"></ul>
                          <div id="error-personal_name" class="invalid-feedback"></div>

                          <div style="display: flex;flex-direction: row;justify-content: space-between;">
                            <div class="text-start">
                              <input id="input-customer" name="customer" value="新客戶" class="form-control" disabled="">
                            </div>
                            <div class="text-end">
                            <i class="fa fa-times-circle" data-bs-toggle="tooltip" title="清空訂購人" style="color:grey;" onclick="clearCustomer();"></i>
                            </div>
                          </div>
                        </td>

                        <td class="text-end colname3char">稱謂</td>
                        <td class="text-start">
                          <select name="salutation_id" id="input-salutation_id" class="form-select">
                            <option value="">--</option>
                                                            <option value="17">先生</option>
                                                              <option value="18" selected="">小姐</option>
                                                        </select>
                        </td>

                        <td class="text-end colname3char">
                          <label target="_blank" data-bs-toggle="tooltip" title="儲存時系統會自動刪除橫線"><i class="fa fa-question-circle" aria-hidden="true"></i> 手機</label><br>
                          <label target="_blank" data-bs-toggle="tooltip" title="儲存時系統會自動刪除橫線"><i class="fa fa-question-circle" aria-hidden="true"></i> 市話</label>
                        </td>

                        <td class="text-start" style="width:180px;">
                          <input type="text" id="input-mobile" name="mobile" value="" placeholder="查詢時請輸入至少3個數字" data-oc-target="autocomplete-mobile" autocomplete="off" style="width:158px;" minlength="3">
                          <ul id="autocomplete-mobile" class="dropdown-menu"></ul>
                          <div id="error-mobile" class="invalid-feedback"></div>

                          <input type="text" id="input-telephone_prefix" name="telephone_prefix" value="" placeholder="區碼" style="width:30px">
                          <input type="text" id="input-telephone" name="telephone" value="" placeholder="查詢時請輸入至少3個數字" data-oc-target="autocomplete-telephone" autocomplete="off" style="width:125px;" minlength="3">
                          <ul id="autocomplete-telephone" class="dropdown-menu"></ul>
                          <div id="error-telephone" class="invalid-feedback"></div>
                          <span id="span-hasOrder" style="color:red"></span>

                        </td>

                        <td class="text-end colname2char">Email</td>
                        <td class="text-start">
                          <input type="text" id="input-email" name="email" value="" placeholder="Email" data-oc-target="autocomplete-email" autocomplete="off" class="form-control" minlength="2">
                          <ul id="autocomplete-email" class="dropdown-menu"></ul>
                        </td>
                      </tr>

                      <tr>
                        <td class="text-end colname">訂餐公司</td>
                        <td class="text-start" colspan="3"><input id="input-payment_company" name="payment_company" type="text" value="" class="form-control"></td>
                        <td class="text-end colname2char">部門</td>
                        <td class="text-start"><input type="text" id="input-payment_department" name="payment_department" value="" class="form-control"></td>
                        <td class="text-end colname2char">統編</td>
                        <td class="text-start"><input type="text" id="input-payment_tin" name="payment_tin" value="" class="form-control"></td>
                      </tr>
                      <tr>
                        <td class="text-end colname required">收件人</td>
                        <td class="text-start" colspan="2">
                          <input type="text" id="input-shipping_personal_name" name="shipping_personal_name" value="" class="form-control">
                          <div id="error-shipping_personal_name" class="invalid-feedback"></div>

                          <div class="form-check" style="font-size: 0.8em;">
                            <input type="checkbox" name="same_order_customer" id="input-same_order_customer" class="form-check-input">
                            <label for="input-same_order_customer" class="form-check-label">同訂購人</label>
                          </div>

                        </td>
                        <td class="text-end colname2char">地址</td>
                        <td class="text-start" colspan="4">
                          <div class="col-sm-12">
                            <div class="input-group">
                              <select id="input-shipping_state_id" name="shipping_state_id">
                                <option value="">--</option>
                                                                <option value="1">基隆市</option>
                                                                <option value="2">臺北市</option>
                                                                <option value="3">新北市</option>
                                                                <option value="4">桃園市</option>
                                                                <option value="5">新竹市</option>
                                                                <option value="6">新竹縣</option>
                                                                <option value="7">苗栗縣</option>
                                                                <option value="8">臺中市</option>
                                                                <option value="9">彰化縣</option>
                                                                <option value="10">南投縣</option>
                                                                <option value="11">雲林縣</option>
                                                                <option value="12">嘉義市</option>
                                                                <option value="13">嘉義縣</option>
                                                                <option value="14">臺南市</option>
                                                                <option value="15">高雄市</option>
                                                                <option value="16">屏東縣</option>
                                                                <option value="17">臺東縣</option>
                                                                <option value="18">花蓮縣</option>
                                                                <option value="19">宜蘭縣</option>
                                                                <option value="20">澎湖縣</option>
                                                                <option value="21">金門縣</option>
                                                                <option value="22">連江縣</option>
                                                              </select>
                              <select id="input-shipping_city_id" name="shipping_city_id">
                                                              </select>
                              <input type="text" id="input-shipping_road" name="shipping_road" value="" autocomplete="off" data-oc-target="autocomplete-shipping_road" class="form-control form-control-sm" minlength="1">
                                <ul id="autocomplete-shipping_road" class="dropdown-menu" style="margin-left: 90px;margin-top: 30px;"></ul>
                                <div id="error-shipping_road" class="invalid-feedback"></div>
                            </div>
                          </div>

                          <input type="text" id="input-shipping_lane" name="shipping_lane" value="" class="width2char">巷
                          <input type="text" id="input-shipping_alley" name="shipping_alley" value="" class="width2char">弄
                          <input type="text" id="input-shipping_no" name="shipping_no" value="" class="width2char">號
                          <input type="text" id="input-shipping_floor" name="shipping_floor" value="" class="width2char">樓
                          <input type="text" id="input-shipping_room" name="shipping_room" value="" class="width2char">室/房
                          <input type="text" id="input-shipping_address2" name="shipping_address2" placeholder="地址補充" value="" style="width:150px;">

                          <!--<button type="button" data-bs-toggle="modal" data-bs-target="#modal-customer" class="btn btn-outline-primary"><i class="fa-solid fa-cog"></i></button>-->
                        </td>
                      </tr>
                      <tr>
                        <td class="text-end colname">送達公司</td>
                        <td class="text-start" colspan="2"><input type="text" id="input-shipping_company" name="shipping_company" value="" class="form-control">
                          <div class="form-check" style="font-size: 0.8em;">
                            <input type="checkbox" name="same_as_order_company" id="input-same_as_order_company" class="form-check-input">
                            <label for="input-same_as_order_company" class="form-check-label">同訂餐公司</label>
                          </div>
                      </td>
                        <td class="text-end colname3char" colspan="2">收件電話</td>
                        <td class="text-start" colspan="3"><input type="text" id="input-shipping_phone" name="shipping_phone" value="" class="form-control"></td>
                      </tr>
                    </tbody>
                  </table>
</template> -->
