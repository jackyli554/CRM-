const app = () => {
  const Invoice_APPID = 276
  //!!!!!!!!!!!!!Not Completed!!!!!!!!!!!!!!!!!!
  //Init arr for committing to invoice app
  kintone.events.on('app.record.create.submit.success', async function (event) {
    var record = event.record
    if (record.invoice_detail.value.length === 0 || isNaN(record.invoice_detail.value.length)) {
      alert('Empty/Invalid Request Detected! Contact App administrator if this is not the case!')
      return event
    }
    const trans_no = record.trans_no.value
    const settle_date = new Date(record.settle_date.value)
    const commit_JSON = {
      app: Invoice_APPID,
      records: GetSettlementJSON(record),
    }
    console.log(JSON.stringify(commit_JSON))
    await kintone.api(
      kintone.api.url('/k/v1/records.json', true),
      'POST',
      commit_JSON,
      function (resp) {
        alert(resp.ids.length + ' invoice inserted!')
      },
      function (error) {
        alert('An Error Occured while creating invoice,Contact App Administrator!')
        console.error(JSON.stringify(error))
      },
    )
    return event

    function GetSettlementJSON(Record) {
      //TODO: get current record table,count table len, form 2d array with len = tablelen,dir={invoice_no[],trans_no,settle_date}
      //return Array of TradeDebtorInvoiceClass Object
      var extracted_arr = []
      for (const invoice_no_element of Object.entries(record.invoice_detail.value)) {
        const TradeDebtor_constructed = JSON.stringify(
          new TradeDebtorInvoiceClass(invoice_no_element[1].value.Invoice_No_.value),
        )
        extracted_arr.push(TradeDebtor_constructed)
      }
      console.log(extracted_arr.length + ' elements detected!')
      console.log(JSON.stringify(extracted_arr))
      return extracted_arr
    }

    //TODO: Create one invoice settlement record for each array element, alloc_amt = 0
  })

  function TradeDebtorInvoiceClass(invoice_no) {
    this.trans_no.value = trans_no
    this.settle_date.value = settle_date
    this.invoice_no.value = invoice_no
    this.alloc_amt.value = 0
  }
  //helper function:auto-create an undefined parent when trying to set its children property
  function autovivify() {
    return new Proxy(
      {},
      {
        get: (target, name) => {
          if (name === 'toJSON') {
            return () => target
          } else {
            return name in target ? target[name] : (target[name] = autovivify())
          }
        },
      },
    )
  }
}
export default app
