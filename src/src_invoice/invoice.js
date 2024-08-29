kintone.events.on('app.record.create.show', function (event) {
  const record = event.record
  if (record.Transaction_No.value != '') {
    record.Transaction_No.lookup = true
    console.info('Auto-lookup completed!')
  }
  return event
})

//Check Balance = 0 or cancel submit
var trigger_event = ['app.record.create.submit', 'app.record.edit.submit']
kintone.events.on(trigger_event, function (ev) {
  var record = ev.record

  if (record.Calculated_Balance.value < 0) {
    ev.error = 'Balance must be greater or equal to 0!'
    console.warn('Balance guard activated!')
    return ev
  }
  return ev
})
//Get old settled amount from transaction app, saved at feteched_alloc
var trigger_event = ['app.record.create.submit.success', 'app.record.edit.submit.success']
const transaction_AppID = 275
kintone.events.on(trigger_event, async function (ev) {
  var record = ev.record
  var feteched_alloc
  var body = {
    app: transaction_AppID,
    query: 'Transaction_No = ' + record.Transaction_No.value.toString(),
    fields: 'total_settled',
  }
  await kintone.api(kintone.api.url('/k/v1/records.json', true), 'GET', body).then(
    function (resp) {
      // success
      feteched_alloc = Number(resp.records[0].total_settled.value)
      console.info('Fetech Successful!')
    },
    function (error) {
      // error
      alert('An Error has been detected retrieving current invoice detatils, contact app administrator!')
      console.log(JSON.stringify(error))
      return ev
    },
  )
  //Update the total settled amount,overwrite the old transaction
  var body = {
    app: transaction_AppID,
    updateKey: {
      field: 'Transaction_No',
      value: record.Transaction_No.value,
    },
    record: {
      total_settled: {
        value: Number(record.allocation_Amt.value) + feteched_alloc,
      },
      OS_Deposit: {
        value: Number(record.Calculated_Balance.value),
      },
    },
  }
  kintone.api(
    kintone.api.url('/k/v1/record.json', true),
    'PUT',
    body,
    function (resp) {
      // success
      console.info('Transaction Updated!')
    },
    function (error) {
      // error
      alert('An Error has been detected while updating related transaction, contact app administrator!')
      console.log(JSON.stringify(error))
    },
  )
})
