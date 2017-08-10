Vue.component('cookie', {
  props: ['cookie'],
  template: '<tr><td>{{ cookie.date }}</td><td>{{ cookie.text }}</td></tr>',
  replace: true
})

var app = new Vue({
  el: '#currency-app',
  data: {
	options: [],
	cookiesList: [],
	message: 'Reset',
  },
   methods: {
	resetCookies: function() {
	  	var name = 'conversions';
		document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
		this.getCookies();
	},
	
	/* ajax web service */
	pullEmployees: function() {
      this.$http.get('https://api.fixer.io/latest').then(
		  (response) => {
			  var currencies = [];
			  $.each(response.body.rates, function(currency, rate) {
				currencies.push({"id":rate, "text" :currency.toUpperCase()  });
			  });  
			 this.options = currencies;
			 //console.log(this.options );
		  })
    },
	
	/* submit the Convert button */
	exchangeCurrency: function() { 
		var amount = parseInt( $("#amount").val() );
		var rateFrom = $(".currency-list")[0].value;
		var rateFromLabel = $("#from option:selected").text();
		var rateToLabel = $("#to option:selected").text();
		var rateTo = $(".currency-list")[1].value;
		var cookieName = "conversions";
		var cookie = $.cookie(cookieName);	  
		if (!amount) {
			$("#error").show()
		} else {
			$("#error").hide()
			if (amount == undefined || rateFrom == "---Select---" || rateTo == "---Select---") {
				$(".results").html("0");
			} else {
				//add it in cookie if there are less than 100 values:	
				let displayedText = amount + " " + rateFromLabel + " = " +(amount * (rateTo * (1 / rateFrom))).toFixed(2) + " " + rateToLabel;
				$(".results").html(displayedText);
				var items = cookie ? cookie.split(/,/) : new Array();
				var d = Date.now();

				if(items.length < 100) { 
					items.push(d + "#" + displayedText);
					$.cookie(cookieName, items.join(','), { expires : 30 });
				}
			}
		}
		//refresh the table with latest conversions
		this.getCookies();
	},
	
	/* change the icon in the input field */
	changeSymbol: function() {
		var rateFromLabel = $("#from option:selected").text();
		if(rateFromLabel != "---Select---") {
			$("#symbol").text(rateFromLabel);
		}
	},
	
	/* fetch the cookies with latest 100 searches */
	getCookies: function() {
		var cookieName = "conversions";
		var cookie = $.cookie(cookieName);
		var list = [];
		if (cookie){
			var items = cookie ? cookie.split(/,/) : new Array();
			for(var i = 0; i < items.length; i++){
				let itemValues = items[i].split(/#/);
				date = new Date( parseInt(itemValues[0]) );
				let datevalues = [
				   date.getFullYear(),
				   date.getMonth()+1,
				   date.getDate(),
				   date.getHours(),
				   date.getMinutes(),
				   date.getSeconds()
				];		
				let d = datevalues[2] + "/" + datevalues[1] +  "/" + datevalues[0] + "-" + datevalues[3] + ":" + datevalues[4] + ":" + datevalues[5];
				list.push ( {'date': d, 'text': itemValues[1]} );
			}
		}
		this.cookiesList = list;
		console.log(this.cookiesList);
	}
  },
  
  mounted(){
	this.getCookies(),
    this.pullEmployees()
  }  
	

})