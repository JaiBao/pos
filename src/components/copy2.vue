const submitGuabaoCustom2 = () => {
  if (guabaoCustom2TotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  if (guabaoCustom2Price.value === 0) {
    alert('忘記填單價了喔！！！')
    return
  }
  const nextId =
    tableRows.length > 0 ? tableRows[tableRows.length - 1].id + 1 : 1
  const row = {
    bentoType: 39,
    id: nextId,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    bentoMains: '',
    sideDishDefault: '',
    quantity: guabaoCustom2TotalQuantity.value,
    price: guabaoCustom2finaltotal.value,
    optionPrice: guabaoCustom2optionPrice.value,
    totalPrice: guabaoCustom2TotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: guabaoCustom2Comment.value
  }
  const totalQuantity = guabaoCustom2TotalQuantity.value
  for (const option of guabaoCustom2Mains) {
    if (option.quantity > 0 && option.name !== '虛擬潤餅 3 吋') {
      let Main = option.name + 'x' + parseInt(option.quantity)
      let drinkInfo = ''
      for (const drink of option.drinks) {
        if (drink.quantity > 0) {
          drinkInfo += drink.name + 'x' + parseInt(drink.quantity)
          // 保留飲料名稱、飲料 ID
          const productInput = {
            mainId: option.id,
            productTypeName: guabaoCustom2DrinkName.value,
            productTypeId: guabaoCustom2DrinkId.value,
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
        productTypeId: guabaoCustom2MainMealId.value,
        productTypeName: guabaoCustom2MainName.value,
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
            productTypeName: guabaoCustom2DrinkName.value,
            productTypeId: guabaoCustom2DrinkId.value,
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
        productTypeId: guabaoCustom2MainMealId.value,
        productTypeName: guabaoCustom2MainName.value,
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
  for (const sideDish of guabaoCustom2SideDishes) {
    if (sideDish.quantity > 0) {
      if (row.sideDishes !== '') {
        row.sideDishes += ', '
      }
      row.sideDishes +=
        sideDish.name + 'x' + parseInt(sideDish.quantity) + '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: guabaoCustom2SideDishName.value,
        productTypeId: guabaoCustom2SideDishId.value,
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
  for (const guabaoCustom2BentoMain of guabaoCustom2BentoMains) {
    if (guabaoCustom2BentoMain.quantity > 0) {
      if (row.bentoMains !== '') {
        row.bentoMains += ','
      }
      row.bentoMains +=
        guabaoCustom2BentoMain.name +
        'x' +
        parseInt(guabaoCustom2BentoMain.quantity).toString() +
        '<br>'
      // 保留副主餐名稱、副主餐 ID
      const productInput = {
        productTypeName: guabaoCustom2BentoMainName.value,
        productTypeId: guabaoCustom2BentoMainId.value,
        productType: 'options_with_qty',
        type: 4
      }
      row.productInputs.push(productInput)

      const input = {
        id: guabaoCustom2BentoMain.id,
        name: guabaoCustom2BentoMain.name,
        value: parseInt(guabaoCustom2BentoMain.quantity),
        type: 4
      }
      row.inputs.push(input)
      guabaoCustom2BentoMain.quantity = 0
    }
  }
  for (const guabaoCustom2Burrito6inch of guabaoCustom2Burrito6inchs) {
    if (guabaoCustom2Burrito6inch.quantity > 0) {
      if (row.bentoMains !== '') {
        row.bentoMains += ','
      }
      row.bentoMains +=
        guabaoCustom2Burrito6inch.name +
        'x' +
        parseInt(guabaoCustom2Burrito6inch.quantity).toString() +
        '<br>'
      // 保留副主餐名稱、副主餐 ID
      const productInput = {
        productTypeName: guabaoCustom2Burrito6inchName.value,
        productTypeId: guabaoCustom2Burrito6inchId.value,
        productType: 'options_with_qty',
        type: 4
      }
      row.productInputs.push(productInput)

      const input = {
        id: guabaoCustom2Burrito6inch.id,
        name: guabaoCustom2Burrito6inch.name,
        value: parseInt(guabaoCustom2Burrito6inch.quantity),
        type: 4
      }
      row.inputs.push(input)
      guabaoCustom2Burrito6inch.quantity = 0
    }
  }
  // 保留 客製盒餐、數量、
  const productInput = {
    id: guabaoCustom2ProductId.value,
    name: guabaoCustom2Name.value,
    value: parseInt(totalQuantity),
    price: guabaoCustom2Price.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: guabaoCustom2Comment.value
  }
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (guabaoCustom2Arbitrarily.value > 0) {
    if (row.Main !== '') {
      row.Main += ','
    }
    row.Main +=
      '任意搭配' + 'x' + parseInt(guabaoCustom2Arbitrarily.value).toString()
    const input = {
      id: 'guabaoCustom2Arbitrarily',
      value: guabaoCustom2Arbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = guabaoCustom2Name.value + totalQuantity + '份'
  checkVegetable(row)
  if (row.Main !== '' || row.sideDishes !== '') {
    // 如果 row.Main 或 row.sideDishes 不是空的，則添加到 tableRows
    tableRows.push(row)
    showGuabaoCustom2.value = false
    guabaoCustom2Arbitrarily.value = 0
    guabaoCustom2TotalQuantity.value = 0
    guabaoCustom2Price.value = 0
  }
}
