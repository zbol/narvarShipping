(function() {
    "use strict";
    var e = {
    	/* Your Global Var
    	   To call - this.settings.yourVariableHere
    	*/
       // LFWLinkPrefixet:  $(".collection_json_feed"),
       // LFWLinkPrefixftp: "/SearchDisplay"
    };
    var i = {
        settings: e,
        loadAJAX: function(zip) {
            var orderDate = getOrderDate()
            var obj = this
            var codeStatus = ""
            var ship = []
            var zipCode = zip
            var checkedMethod = $( "#singleShipmentShippingMode option:selected" ).val()
            console.log('date: '+ orderDate+ ' ZIP: '+zipCode)

             var narvar = {
                  "async": true,
                  "crossDomain": true,
                  "url": "https://www.sunglasshut.com/narvar/api/shipping",
                  "method": "POST",
                  "contentType": "application/json",
                  "headers": {
                      "cache-control": "no-cache"
                },
                "data": "{ \"retailerName\":\"sunglasshut\", \"OAuthToken\":\"kjU8LDCJgjhmavEL\",\r\n   \"source\":\"test\",\r\n  \"shipping\":[  \r\n  {  \r\n  \"orderDate\":\""+orderDate+"\",\r\n  \"carrier\":\"\",\r\n  \"serviceType\":\"\",\r\n \"ozip\":\"38118\",\r\n \"dzip\":\""+zipCode+"\",\r\n \"fulfillmentDays\":0\r\n  }\r\n  ]\r\n}\r\n"
              }
              $.ajax(narvar)
                  .done(function (response) {
                    if(response.status.code === "OK"){
                      var maxDeliveryUG = shipDate(response.shipResponse.shippingInfos["0"].shippingDetail.detail[0].deliveryDateMax)
                      var minDeliveryUG = shipDate(response.shipResponse.shippingInfos["0"].shippingDetail.detail[0].deliveryDateMin)
                      var maxDeliveryE2 = shipDate(response.shipResponse.shippingInfos["0"].shippingDetail.detail[1].deliveryDateMax)
                      var minDeliveryE2 = shipDate(response.shipResponse.shippingInfos["0"].shippingDetail.detail[1].deliveryDateMin)
                      var maxDelivery13 = shipDate(response.shipResponse.shippingInfos["0"].shippingDetail.detail[2].deliveryDateMax)
                      var minDelivery13 = shipDate(response.shipResponse.shippingInfos["0"].shippingDetail.detail[2].deliveryDateMin)
                      var maxDeliveryE1 = shipDate(response.shipResponse.shippingInfos["0"].shippingDetail.detail[3].deliveryDateMax)
                      var minDeliveryE1 = shipDate(response.shipResponse.shippingInfos["0"].shippingDetail.detail[3].deliveryDateMin)
                      var maxDeliveryPM = shipDate(response.shipResponse.shippingInfos["0"].shippingDetail.detail[4].deliveryDateMax)
                      var minDeliveryPM = shipDate(response.shipResponse.shippingInfos["0"].shippingDetail.detail[4].deliveryDateMin)
                      

                      $('.val-10752 .ship-estimated').text(maxDeliveryE1+' - ')
                      $('.val-10753 .ship-estimated').text(maxDeliveryE2+' - ') 
                      $('.val-10751 .ship-estimated').text(maxDeliveryUG+' - ')
                      $('.val-10755 .ship-estimated').text(maxDeliveryPM+' - ')

                      switch (checkedMethod) {
                          case "10753":
                            $('.estimate-header .red').text(maxDeliveryE2) 
                            break;
                          case "10752":
                            $('.estimate-header .red').text(maxDeliveryE1)
                            break;
                          case "10751":
                            $('.estimate-header .red').text(maxDeliveryUG)
                            break;
                          case "10755":
                            $('.estimate-header .red').text(maxDeliveryPM)
                            break;
                          case "10754":
                            $('.estimate-header .red').text('No Estimated Delivery on APO/FPO Orders')
                            break;  
                        }


                      //$('.val-10753 .ship-estimated').text(maxDelivery13+' - ')                   
                      console.log('dateyUG: '+maxDeliveryUG)
                      console.log(response)
                    }else{
                      console.log("didn't load "+response)
                      $('.estimate-header .red').text('Not available at this time')
                    }
                    
                  })
                  .fail(function(){
                     $('.estimate-header .red').text('Not available at this time')
                    console.log("error")
                  })

            function shipDate(date) {
              var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
              var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
              var now = new Date(date);
                now.setDate(now.getDate() + 1);
              var year = "" + now.getFullYear();
              var month = "" + (now.getMonth()); if (month.length == 1) { month = "0" + month; }
              var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
              return dayNames[now.getDay()] +', '+monthNames[month]+' '+day+', '+year ;
            }
            
            function getOrderDate() {
              var now = new Date();
              var year = "" + now.getUTCFullYear();
              var month = "" + (now.getUTCMonth() + 1); if (month.length == 1) { month = "0" + month; }
              var day = "" + now.getUTCDate(); if (day.length == 1) { day = "0" + day; }
              var hour = "" + now.getUTCHours(); if (hour.length == 1) { hour = "0" + hour; }
              var minute = "" + now.getUTCMinutes(); if (minute.length == 1) { minute = "0" + minute; }
              var second = "" + now.getUTCSeconds(); if (second.length == 1) { second = "0" + second; }
              return year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second+"Z";
            }
           console.log('Narvar loadAJAX');
        },
        setCountDown: function() {
          var today = new Date();
          var date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 22, 0, 0));
          console.log('date '+date);
          //var date = "29 November 2016 16:00:00 GMT-0400"
          var thisEl = $('.ship-countdown')
          var eventDate = Date.parse(date) / 1e3;
          var currentDate = Math.floor(Date.now() / 1e3);
          console.log('eventDate '+eventDate);
           console.log('currentDate '+Date());
          if (eventDate <= currentDate) {
            //thisEl.hide();
          }else{
           // thisEl.show();
          }
          var seconds = eventDate - currentDate;
          var days = Math.floor(seconds / 86400);
          seconds -= days * 60 * 60 * 24;
          var hours = Math.floor(seconds / 3600);
          seconds -= hours * 60 * 60;
          var minutes = Math.floor(seconds / 60);
          seconds -= minutes * 60;
          days == 1 ? thisEl.find(".timeRefDays").text("day") : thisEl.find(".timeRefDays").text("days");
          hours == 1 ? thisEl.find(".timeRefHours").text("hour") : thisEl.find(".timeRefHours").text("hours");
          minutes == 1 ? thisEl.find(".timeRefMinutes").text("minute") : thisEl.find(".timeRefMinutes").text("minutes");
          seconds == 1 ? thisEl.find(".timeRefSeconds").text("second") : thisEl.find(".timeRefSeconds").text("seconds");
          if (days >= 1){
            thisEl.find('.time-hours').show();
          }
          if (days < 1){
            thisEl.find('.time-days').hide();
            thisEl.find('.time-hours').show();
            thisEl.find('br').hide();
            //thisEl.find('.time-only').text('Less Than');
          }
          if (days < 1 && hours <= 1){
            thisEl.find('.time-days').hide();
            thisEl.find('.time-hours').show();
            thisEl.find('.time-minutes').show();
          }
           if (days < 1 && hours == 0){
            thisEl.find('.time-days').hide();
            thisEl.find('.time-hours').hide();
            thisEl.find('.time-minutes').show();
          }
          
          if (!isNaN(eventDate)) {
            thisEl.find(".days").text(days);
            thisEl.find(".hours").text(hours);
            thisEl.find(".minutes").text(minutes);
            thisEl.find(".seconds").text(seconds)
            //clearInterval(interval)
          } else {
            thisEl.hide();
            console.log("Invalid date. Example: 30 Tuesday 2013 15:50:00 EST");
            //clearInterval(interval);
          }
        
        },
        getShippingText: function($val) {
          var shipSchedule = '',
            shipSubText = '',
            shipOtherText = '',
          ShipingSchedule = [
                  {"value":"10753", "method":"2-Day Shipping",    "subtext":"<strong>FREE</strong> 2-Day Shipping", "othertext":""},
                  {"value":"10751", "method":"Standard Shipping", "subtext":"<strong>FREE</strong> Standard Shipping", "othertext":""},
                  {"value":"10752", "method":"Next-Day Shipping", "subtext":"$17.95 Next-Day Shipping", "othertext":""},
                  {"value":"10755", "method":"USPS PO BOX",       "subtext":"<strong>FREE</strong> USPS PO BOX Only ", "othertext":""},
                  {"value":"10754", "method":"APO/FPO",           "subtext":"<strong>FREE</strong> APO/FPO ", "othertext":"<a class='shipping-modal-details' data-open-modal='shipping_modal' data-scroll-modal='mail_transit'> <span>Click here</span> to see estimated shipping times.</a>"}
              ]
          for (i = 0; i < ShipingSchedule.length; i++) { 
            var shipValue = ShipingSchedule[i],
              thisValue = shipValue.value,
              thisSubText = shipValue.subtext,
              thisOtherText = shipValue.othertext;
              if(thisValue == $val){
                shipSubText = thisSubText;
                shipOtherText = thisOtherText
              }
          };
          return [shipSubText, shipOtherText]
        },
        changeShipDropDown: function() {
          var shipMethodIndex = $( "#singleShipmentShippingMode option:selected" ).index();
          var shipEstimate = 'Enter Zip Code Above'
          var obj = this
          $("#singleShipmentShippingMode option").each(function(i, e) {
            var $text = $(this).text(),
              $val = $(this).val(),
              shipSchedule = obj.getShippingText($val),
              shipSubText = shipSchedule[0],
              othertext = shipSchedule[1],
              radioClass = 'redesignIcons-radio';

            if (shipMethodIndex == i){
              radioClass = 'redesignIcons-radio-checked';
            }

            $('<div/>')
                  .addClass('sgh-ship-radio custom-check val-'+$val)
                 .prepend(
                  $('<label for="'+$val+'"><span class="icon '+radioClass+'"></span><span class="red ship-estimated"></span>'+shipSubText+'</label>')
                  .attr("value", $val)
                  .attr("checked", i == shipMethodIndex)
                  .prepend(
                    $('<input type="radio" name="shipping" id="'+$val+'" />')
                    .click(function () {
                      var $this = $(this),
                        checked = $this.prev().prop("checked");
                      
                      //console.log(checked)
                      $('input:radio[name='+$(this).attr('name')+']').parent().find('.icon.redesignIcons-radio-checked').removeClass('redesignIcons-radio-checked').addClass('redesignIcons-radio'); 
                      $(this).parent().find('.icon').removeClass('redesignIcons-radio').addClass('redesignIcons-radio-checked');          
                      $("#singleShipmentShippingMode").val($val); 
                      $('#singleShipmentShippingMode').trigger("change");
                      obj.loadAJAX()
                    })      
                 )
               ).append(othertext).appendTo(".shipping_method_content");
          });
          $('.val-10754').insertAfter($( '.val-10751'))
          $('.val-10755').insertAfter($( '.val-10751'))
           $('<div/>')
              .addClass('sgh-ship-estimate')
              .prepend(
                $('<p/>')
                  .addClass('estimate-header')
                  .html('Estimated Delivery: <span class="red">'+shipEstimate+'</span>')
              )
              .append(
                $('<p/>')
                  .addClass('estimate-body')
                  .html('<span class="ship-count-container">If you order in the next <span class="ship-countdown"> <span class="hours time-hours"><!--00--></span> <span class="timeRefHours time-hours"><!--hours--></span> <span class="minutes time-minutes"><!--00--></span> <span class="timeRefMinutes time-minutes"><!--minutes--></span></span></span>  <a class="shipping-modal-details" data-open-modal="shipping_modal" >See Shipping Details</a>')
              ).prependTo(".shipping_method_content")

          //obj.setCountDown();
          $('.mapquest-lookup').change(function() {
             var zip = $('.mapquest-lookup').val()
              obj.loadAJAX(zip)
              console.log('change');
              //shipCheckZip($(this));
          });
          if( $('.mapquest-lookup').val()){
              //var $mapquest = $('.mapquest-lookup');
              var zip = $('.mapquest-lookup').val()
              obj.loadAJAX(zip)
          }
          if($('.address-block').length){
              var zip = $('.shipAddress:visible .pixel_zip').val();
          
               $('#singleShipmentAddress').change(function() {
                  zip = $('.shipAddress:visible .pixel_zip').val();
                  setTimeout(function(){
                    obj.loadAJAX(zip)
                   // console.log('login User CHange'+$mapquest.val())
                  }, 300);
                  //shipCheckZip($mapquest);
                  
              });
              obj.loadAJAX(zip)
          }
          $('.shipping-modal-details').on( 'click', function() {
              var $this = $(this);
              openCustomModal($this)
          });
        },
        init: function() {
            return this.changeShipDropDown(), this;
        }
    };
    window.narvarAPI = i;

}()), $(function() {
  if(!$('.hto-copy:visible').length){
    narvarAPI.init();
  }else{
    $('.shipping_method_content').addClass('ship-hto');
  }
});