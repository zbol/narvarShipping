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
                "data": "{ \"retailerName\":\"sunglasshut\", \"OAuthToken\":\"kjU8LDCJgjhmavEL\",\r\n   \"source\":\"test\",\r\n  \"shipping\":[  \r\n  {  \r\n  \"orderDate\":\" "+orderDate+" \",\r\n  \"carrier\":\"UPS\",\r\n  \"serviceType\":\"\",\r\n \"ozip\":\"94403\",\r\n \"dzip\":\""+zipCode+"\",\r\n \"fulfillmentDays\":1\r\n  }\r\n  ]\r\n}\r\n"
              }
              $.ajax(narvar)
                  .done(function (response) {
                    if(response.status.code === "OK"){
                      var maxDeliveryE2 = shipDate(response.shipResponse.shippingInfos["0"].shippingDetail.detail[1].deliveryDateMax)
                      var minDeliveryE2 = shipDate(response.shipResponse.shippingInfos["0"].shippingDetail.detail[1].deliveryDateMin)
                      var maxDeliveryUG = shipDate(response.shipResponse.shippingInfos["0"].shippingDetail.detail[0].deliveryDateMax)
                      var minDeliveryUG = shipDate(response.shipResponse.shippingInfos["0"].shippingDetail.detail[0].deliveryDateMin)
                      var maxDelivery13 = shipDate(response.shipResponse.shippingInfos["0"].shippingDetail.detail[2].deliveryDateMax)
                      var minDelivery13 = shipDate(response.shipResponse.shippingInfos["0"].shippingDetail.detail[2].deliveryDateMin)
                      var maxDeliveryE1 = shipDate(response.shipResponse.shippingInfos["0"].shippingDetail.detail[3].deliveryDateMax)
                      var minDeliveryE1 = shipDate(response.shipResponse.shippingInfos["0"].shippingDetail.detail[3].deliveryDateMin)
                      
                      $('.val-10752 .ship-estimated').html(maxDeliveryE1+' <br/> ')
                      $('.val-10753 .ship-estimated').html(maxDeliveryE2+' <br/> ') 
                      $('.val-10751 .ship-estimated').html(maxDeliveryUG+' <br/> ')

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
              var year = "" + now.getFullYear();
              var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
              var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
              var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
              var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
              var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
              return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second+"Z";
            }
           console.log('Narvar loadAJAX');
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
				console.log('shipSchedule: '+i);
				console.log('shipSubText: '+shipSubText);
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
              console.log('change');
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
    narvarAPI.init();
});