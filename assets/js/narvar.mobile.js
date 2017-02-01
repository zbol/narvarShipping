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
            var checkedMethod = $( "#shipping_method option:selected" ).val()
            //console.log('date: '+ checkedMethod)

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
                      
                      $('.val-10752 .ship-estimated').html(maxDeliveryE1).addClass('ship-has-estimate')
                      $('.val-10753 .ship-estimated').html(maxDeliveryE2).addClass('ship-has-estimate') 
                      $('.val-10751 .ship-estimated').html(maxDeliveryUG).addClass('ship-has-estimate')
                      $('.val-10755 .ship-estimated').html(maxDeliveryPM).addClass('ship-has-estimate')


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
                      //console.log('dateyUG: '+maxDeliveryUG)
                      //console.log(response)
                    }else{
                      //console.log("didn't load "+response)
                      $('.estimate-header .red').text('Not available at this time')
                    }
                    
                  })
                  .fail(function(){
                     $('.estimate-header .red').text('Not available at this time')
                    //console.log("error")
                  })

            function shipDate(date) {
              var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
              var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
              var now = new Date(date);
                now.setDate(now.getUTCDate());
              var year = "" + now.getUTCFullYear();
              var month = "" + (now.getUTCMonth()); 
              var day = "" + now.getUTCDate(); if (day.length == 1) { day = "0" + day; }
              return dayNames[now.getUTCDay()] +', '+monthNames[month]+' '+day+', '+year ;
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
           //console.log('Narvar loadAJAX');
        },
        getShippingText: function($val) {
          var shipSchedule = '',
          shipSubText = '',
          shipOtherText = '',
          ShipingSchedule = [
                  {"value":"10753", "method":"2-Day Shipping",    "subtext":"<strong>FREE</strong> 2-Day Shipping", "othertext":""},
                  {"value":"10751", "method":"Standard Shipping", "subtext":"<strong>FREE</strong> Standard Shipping", "othertext":""},
                  {"value":"10752", "method":"Next-Day Shipping", "subtext":"<span class='ship-amount'>$17.95</span> Next-Day Shipping", "othertext":""},
                  {"value":"10755", "method":"USPS PO BOX",       "subtext":"<strong>FREE</strong> USPS PO BOX Only ", "othertext":""},
                  {"value":"10754", "method":"APO/FPO",           "subtext":"<strong>FREE</strong> APO/FPO ", "othertext":""}
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
			var shipMethodIndex = $( "#shipping_method option:selected" ).index()
			var shipEstimate = 'Enter Zip Code Above'
			var obj = this
			$("#shipping_method option").each(function(i, e) {
				var $text = $(this).text(),
					$val = $(this).val(),
					shipSchedule = obj.getShippingText($val),
					shipSubText = shipSchedule[0],
              		othertext = shipSchedule[1],
					radioClass = 'redesignIcons-radio';

				//console.log('shipMethodIndex: '+shipMethodIndex);
				//console.log('shipSchedule: '+i);
				//console.log('shipSubText: '+shipSubText);
				$('<div/>')
		          .addClass('sgh-ship-radio custom-check val-'+$val)
		         .prepend(
		            $('<label for="'+$val+'"><span class="icon '+radioClass+'"></span><span class="red ship-estimated"></span><span class="ship-text">'+shipSubText+'</span></label>')
			        .attr("value", $val)
			        .prepend(
			        	$('<input type="radio" name="shipping" id="'+$val+'" />')
			        	.attr("checked", i == shipMethodIndex)
			        	.click(function () {
				        	var $this = $(this),
				        		checked = $this.prev().prop("checked");
				        	//console.log(checked)
		 					$('input:radio[name='+$(this).attr('name')+']').parent().find('.icon.redesignIcons-radio-checked').removeClass('redesignIcons-radio-checked').addClass('redesignIcons-radio');	;
		        			$(this).parent().find('.icon').removeClass('redesignIcons-radio').addClass('redesignIcons-radio-checked');					
		        			$("#shipping_method").val($val); 
		        			$('#shipping_method_with_signature').val($('#shipping_method').val());
			        		obj.loadAJAX()
			        	})      
		         )
			     ).appendTo(".shipping-method");
			});
      var oneDayUPS = $('#shipping_method .Next').text();
        if (oneDayUPS.indexOf('FREE') !== -1){
          $('.sgh-ship-radio.val-10752').find('.ship-amount').html('<strong>FREE</strong>');
            //console.log('FREE Next Day')
      }
      $('.val-10754').insertAfter($( '.val-10751'))
      $('.val-10755').insertAfter($( '.val-10751'))
			$('<div/>')
              .addClass('sgh-ship-estimate')
              .prepend(
                $('<p/>')
                  .addClass('estimate-header')
                  .html('Estimated Delivery: <br/><span class="red">'+shipEstimate+'</span>')
              )
              .insertAfter("#checkout_cart .shipping-method h1")
          $('#zipCode').change(function() {
             var zip = $(this).val()
              obj.loadAJAX(zip)
              //console.log('change');
              //shipCheckZip($(this));
          });
          if( $('#zipCode').val()){
              //var $mapquest = $('.mapquest-lookup');
              var zip = $('#zipCode').val()
              obj.loadAJAX(zip)
          }
          if($('#selectShipmentAddresses').length){
              var zip = $('#selectShipmentAddresses .entry:visible input[name$="_zip"]').val();
          
               $('#shipmentAddress').change(function() {
                  zip = $('#selectShipmentAddresses .entry:visible input[name$="_zip"]').val();
                  setTimeout(function(){
                    obj.loadAJAX(zip)
                   // console.log('login User CHange'+$mapquest.val())
                  }, 300);
                  //shipCheckZip($mapquest);
                  
              });
              obj.loadAJAX(zip)
          }
		},
        init: function() {
            return this.changeShipDropDown(), this;
        }
    };
    window.narvarAPI = i;

}()), $(function() {
  if(!$('#SignatureContainer:visible').length){
     $('body').addClass('exp-narvar-shipping')
    narvarAPI.init();
  }
});