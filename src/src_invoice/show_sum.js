(() => {
    'use strict';
  const Kuc = Kucs['1.17.1'];
  console.log(Kuc.version);
  
  kintone.events.on('app.record.index.show',function(event)
  {
    const header = kintone.app.getHeaderMenuSpaceElement();
      var record = event.records
      var totalAmt = 0;
      for(const entry of Object.entries(record))
      {
       totalAmt+=Number(entry[1].allocation_Amt.value)
      }
      console.log(totalAmt)
  
      const button = new Kuc.Button({
      text: "Total = " + totalAmt.toString(),
      type: 'alert',
      className: 'options-class',
      id: 'options-id',
      visible: true,
      disabled: true
     });
      header.appendChild(button);
      return event;
  })
  kintone.events.on('app.record.index.edit.show',function(event)
  {
    var record = event.record;
    record.allocation_Amt.disabled = true;
    return event
  })
  })();
  