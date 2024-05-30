// 牛肉丸便當修改

const editDialog21 = ref(false)

function editBangdong5 (row) {
  watchers.forEach((unwatch) => unwatch())
  watchers = []
  // 牛肉丸便當主餐歸零
  for (const bangdong5EditMain of bangdong5EditMains) {
    bangdong5EditMain.quantity = 0
  }
  // 牛肉丸便當飲料歸零
  for (const bangdong5EditDrink of bangdong5EditDrinks) {
    bangdong5EditDrink.quantity = 0
  }
  // 牛肉丸便當配菜歸零
  for (const bangdong5EditSideDish of bangdong5EditSideDishes) {
    bangdong5EditSideDish.quantity = 0
  }
  // 牛肉丸便當副主餐歸零
  for (const bangdong5EditBentoMain of bangdong5EditBentoMains) {
    bangdong5EditBentoMain.quantity = 0
  }
  // 牛肉丸便當主餐隱藏欄位歸零
  for (const input of row.inputs) {
    const name = input.name
    const value = input.value
    // 任意搭配抓取推入
    if (input.name === '任意搭配') {
      bangdong5EditArbitrarily.value = input.value
    }
    // 牛肉丸便當  主餐  推入 input 數值
    const mainIndex = bangdong5EditMains.findIndex(
      (bangdong5EditMain) =>
        bangdong5EditMain.name === name || bangdong5EditMain.shortname === name
    )
    if (mainIndex >= 0) {
      bangdong5EditMains[mainIndex].quantity = parseInt(value)
    }
    // 牛肉丸便當  飲料  推入 input 數值
    const drinkIndex = bangdong5EditDrinks.findIndex(
      (bangdong5EditDrink) => bangdong5EditDrink.name === name
    )
    if (drinkIndex >= 0) {
      bangdong5EditDrinks[drinkIndex].quantity = parseInt(value)
    }
    /// / 牛肉丸便當  配菜  推入 input 數值
    setTimeout(() => {
      const sideDishIndex = bangdong5EditSideDishes.findIndex(
        (bangdong5EditSideDish) => bangdong5EditSideDish.name === name
      )
      if (sideDishIndex >= 0) {
        bangdong5EditSideDishes[sideDishIndex].quantity = parseInt(value)
      }
      // 牛肉丸便當  副主餐  推入 input 數值
      const bentoMainIndex = bangdong5EditBentoMains.findIndex(
        (bangdong5EditBentoMain) => bangdong5EditBentoMain.name === name
      )
      if (bentoMainIndex >= 0) {
        bangdong5EditBentoMains[bentoMainIndex].quantity = parseInt(value)
      }
    }, 2000)
  }
  // 監聽主餐的數量變化

  editingRow = row
  bangdong5EditTotalQuantity.value = row.quantity
  bangdong5Comment.value = row.comment
  editDialog21.value = true
}

// 牛肉丸便當總數量
watch(bangdong5EditMains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)

  bangdong5EditArbitrarily.value = Math.max(
    0,
    parseInt(bangdong5EditTotalQuantity.value) - mainQuantityTotal
  )
})
// 牛肉丸便當單價
const bangdong5EditPrice = computed(() => {
  return bangdong5Price.value
})
// 牛肉丸便當總價格
const bangdong5EditTotalQuantityPrice = computed(() => {
  const totalPrice =
    bangdong5EditTotalQuantity.value * bangdong5EditPrice.value

  return totalPrice
})
const bangdong5EditoptionPrice = computed(() => {
  let totalPrice = 0
  bangdong5EditDrinks.forEach((drink) => {
    totalPrice += drink.quantity * drink.price
  })
  bangdong5EditSideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })

  return totalPrice
})

const bangdong5EditfinalTotal = computed(() => {
  const totalPrice =
    bangdong5EditoptionPrice.value + bangdong5EditTotalQuantityPrice.value
  return totalPrice
})
// 關閉修正欄位
function closeEditDialog21 () {
  editDialog21.value = false
}
// 完成後儲存並且將資料推進 tableRows 刪除原本的資料
function saveEditDialog21 () {
  if (bangdong5EditTotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  // 檢查總數量是否匹配
  const calculatedTotalQuantity = bangdong5EditMains.reduce(
    (acc, main) => acc + (main.quantity || 0),
    0
  )
  console.log(calculatedTotalQuantity, bangdong5EditTotalQuantity.value)
  if (
    calculatedTotalQuantity !== parseInt(bangdong5EditTotalQuantity.value, 10)
  ) {
    alert('主餐總數量與輸入的總數量不搭！')
    return
  }
  const row = {
    bentoType: 21,
    id: editingRow.id, // 使用新生成的 ID
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: '',
    price: bangdong5EditfinalTotal.value,
    optionPrice: bangdong5EditoptionPrice.value,
    totalPrice: bangdong5EditTotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: bangdong5Comment.value
  }

  const totalEditQuantity = bangdong5EditTotalQuantity.value // 計算總數量
  row.quantity = bangdong5EditTotalQuantity.value
  // 儲存推入主餐置入 table
  for (const bangdong5EditMain of bangdong5EditMains) {
    if (bangdong5EditMain.quantity > 0) {
      row.Main +=
        bangdong5EditMain.name +
        'x' +
        parseInt(bangdong5EditMain.quantity).toString() +
        '<br>'
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: bangdong5MainMealId.value,
        productTypeName: bangdong5MainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdong5EditMain.id,
        name: bangdong5EditMain.name,
        value: parseInt(bangdong5EditMain.quantity),
        type: 1
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入飲料置入 table
  for (const bangdong5EditDrink of bangdong5EditDrinks) {
    if (bangdong5EditDrink.quantity > 0) {
      row.drinks +=
        bangdong5EditDrink.name +
        'x' +
        parseInt(bangdong5EditDrink.quantity).toString() +
        '<br>'
      // 保留飲料名稱、飲料 ID
      const productInput = {
        productTypeName: bangdong5DrinkName.value,
        productTypeId: bangdong5DrinkId.value,
        productType: 'options_with_qty',
        type: 2
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdong5EditDrink.id,
        name: bangdong5EditDrink.name,
        value: parseInt(bangdong5EditDrink.quantity),
        type: 2
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入配菜置入 table
  for (const bangdong5EditSideDish of bangdong5EditSideDishes) {
    if (bangdong5EditSideDish.quantity > 0) {
      row.sideDishes +=
        bangdong5EditSideDish.name +
        'x' +
        parseInt(bangdong5EditSideDish.quantity).toString() +
        '<br>'
      // 保留配菜名稱、ID
      const productInput = {
        productTypeName: bangdong5SideDishName.value,
        productTypeId: bangdong5SideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      row.sideDishDefault += bangdong5EditSideDish.is_default + ' '
      const input = {
        id: bangdong5EditSideDish.id,
        name: bangdong5EditSideDish.name,
        value: parseInt(bangdong5EditSideDish.quantity),
        is_default: bangdong5EditSideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
    }
  }
  // 儲存推入副主餐置入 table
  for (const bangdong5EditBentoMain of bangdong5EditBentoMains) {
    if (bangdong5EditBentoMain.quantity > 0) {
      row.bentoMains +=
        bangdong5EditBentoMain.name +
        'x' +
        parseInt(bangdong5EditBentoMain.quantity).toString() +
        '<br>'
      const productInput = {
        productTypeName: bangdong5BentoMainName.value,
        productTypeId: bangdong5BentoMainId.value,
        productType: 'options_with_qty',
        type: 4
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdong5EditBentoMain.id,
        name: bangdong5EditBentoMain.name,
        value: parseInt(bangdong5EditBentoMain.quantity),
        type: 4
      }
      row.inputs.push(input)
    }
  }
  // 保留 牛肉丸便當、1002、數量
  const productInput = {
    id: bangdong5ProductId.value,
    name: bangdong5Name.value,
    value: parseInt(totalEditQuantity),
    price: bangdong5EditPrice.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: bangdong5Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (bangdong5EditArbitrarily.value > 0) {
    if (row.Main !== '') {
      row.Main += ','
    }
    row.Main +=
      '任意搭配' + 'x' + parseInt(bangdong5EditArbitrarily.value).toString()
    const input = {
      id: 'bangdong5EditArbitrarily',
      value: bangdong5EditArbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = bangdong5Name.value + totalEditQuantity + '份' // 使用總數量
  checkVegetable(row)
  // 將這個 row 推進 tableRows 中
  const rowIndex = tableRows.findIndex((r) => r === editingRow)
  if (rowIndex !== -1) {
    tableRows.splice(rowIndex, 1, row) // 在移除元素的同時插入新元素
  }
  editDialog21.value = false
  bangdong5EditArbitrarily.value = 0
  console.log(row)
}
