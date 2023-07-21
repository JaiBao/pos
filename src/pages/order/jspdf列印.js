// import JsPDF from 'jspdf'
// import 'jspdf-autotable' // import autoTable from 'jspdf-autotable'
// import 'src/assets/YeZiGong-normal.js'
// function printOrder (row) {
//   // 取得被選取的訂單
//   const selectedOrder = orders.find((order) => order.id === row.id)

//   // 使用 jsPDF 印出訂單
//   const doc = new JsPDF()
//   doc.setFont('YeZiGong')// 使用实例.setFont 参数刚才下载的字体名字
//   // 如果忘记名字可以返回刚才的js文件查看，如下代码

//   // //转换js文件 最底部
//   // var callAddFont = function () {
//   // this.addFileToVFS('YeZiGongChangShanHaiMingChao-2-normal.ttf', font);
//   // this.addFont('songti-normal.ttf', 'songti', 'normal');//第二个参数为字体名字
//   // };
//   // jsPDF.API.events.push(['addFonts', callAddFont])

//   // 設定字型
//   doc.setFontSize(12)

//   // 設定表格樣式
//   const tableWidths = [30, 30, 40, 40, 40, 40, 40, 40, 40, 40]
//   const tableHead = [
//     '',
//     '數量',
//     '全素薯',
//     '蛋素薯',
//     '薯泥',
//     '炸蝦',
//     '炒雞',
//     '酥魚',
//     '培根',
//     '滷肉'
//   ]
//   const tableRows = [
//     [
//       { content: selectedOrder.name + '的訂單', colSpan: 10 },
//       '', '', '', '', '', '', '', '', ''
//     ],
//     tableHead,
//     [
//       '1',
//       '',
//       '',
//       '',
//       '',
//       '',
//       '',
//       '',
//       '',
//       ''
//     ]
//   ]
//   doc.autoTable({
//     head: [tableHead],
//     body: tableRows,
//     startY: 20,
//     margin: { top: 10 },
//     columnWidth: tableWidths,
//     styles: {
//       fontSize: 10,
//       cellPadding: 3,
//       halign: 'center'
//     }
//   })

//   // 打印訂單
//   doc.autoPrint()
//   // 新視窗
//   doc.output('dataurlnewwindow')

//   // 下载PDF文件
//   // doc.save('order.pdf')
// }
