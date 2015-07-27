(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)||/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);


fsets = null;
qty_change_trigger = null;
qty_change_delay = 0;

$(window).load(function(){
	sides_fix_height();
	setTimeout(function(){
		sides_fix_height();
	}, 2000);
	
	/*$.post("/process_ajax.php", "a=timesync&cli="+(new Date()).getTimezoneOffset());*/
	/*
	$(".menu-drop-down ul").each(function(){
		$(this).css("left",$(this).prev().offset().left+"px");
	});
	*/
   
   var diff = $(window).height()-$("#subwrapper_whole").height();
   if ($("#content404").length == 1 && diff > 0){
	   $("#content404").animate({height:($("#content404").height() + diff)+'px'}, 300)
	   $(".background_side").animate({height:($(".background_side").height() + diff)+'px'}, 300)
   }
   
   //$(".newsletter input[data-type=submit]").val("vasya"+new Date().getTime()+"@gmail.com");
   //$(".newsletter .v2button").click();
   
});

$(window).on("resize onorientationchange orientationchange",function(){
	sides_fix_height();
	$("div.som-popup-overlay").height($(window).height());
});

$(document).ready(function(){
	
	$(document).on("click", "div.som-popup-overlay", function(){
		$(".som-popup-trigger-close").click();
	});
	
	menu_detect_active();
	
	if ($.browser.mobile){
		$(".background_side").remove();
		$("#subwrapper_whole").width(960);
		$("body").addClass("mobile");
	}
	else {
		$("body").addClass("bigscreen");
	}
	/*
	if (typeof(browser) != "undefined" && browser.indexOf("mobile") >= 0){
		jQuery("body").addClass("mobile");
	}
	else {
		jQuery("body").addClass("bigscreen");
	}
	*/
   
	$(document).on("click", "div.featured-set .v2button-arrow-long", function(){
		var direction = parseInt($(this).attr("data-direction"));
		if (fsets === null){
			$.ajax({
				type: "POST",
				url: "/process_ajax.php",
				data: "a=get_featured_sets",
				dataType: "jsonp",
				success: function(){
					switch_set(direction);
				},
				error: function(error){
					switch_set(direction);
				}
			});
		}
		else {
			switch_set(direction);
		}
	});
	
	$(document).on("click", "div.suggested-items .switch", function(event){
		event.preventDefault();
		var container = $("div.suggested-items");
		var direction = parseInt($(this).attr("data-direction"));
		var current_index = parseInt(container.attr("data-current-index"));
		var next = current_index + direction;
		if (next < 0){
			next = suggested_items.length - 1;
		}
		else if (next === suggested_items.length){
			next = 0;
		}

		container.attr("data-current-index",next);

		var i = 0;
		container.find("div.item").each(function(){
			var item = $(this);
			
			var iid = suggested_items[next][i].iid;
			var name = suggested_items[next][i].name;
			var price = suggested_items[next][i].price;
			
			item.find("input.id").val(iid);
			item.find("p.image a").attr("href","/item/"+iid+"/");
			item.find("p.image a img").attr("src","/cache/thumb_"+iid+"_60.jpeg").attr("alt",name).attr("title","Посмотреть детали: "+name);
			item.find("p.price span").text(price);
			i++;
		});
	});
	
	$("#captcha img").click(function(){
		var img = $(this);
		img.attr("src",global_root+"/images/system/captcha_dummy.png").attr("src",global_root+"/captcha.php?r="+Math.random());
	});
	
	$(".background_side").height($("#wrapper_whole").height());

	$("form.form-ajax-submit").submit(function(){
		return false;
	});
	
	$(".menu-drop-down").hover(
		function(){
			$(this).find("ul").stop(true,true).fadeIn('fast');
		},
		function(){
			$(this).find("ul").stop(true,true).fadeOut('fast');
		}
	);
		
	$(document).on("click", "a.share-button", function(event){
		event.preventDefault();
		var url = "";
		if ($(this).hasClass("share-fb")){
			url = "http://www.facebook.com/dialog/feed?app_id=604955289590942";
			var data = new Object({
				"link":			$("meta.url").attr("content"),
				"display":		"popup",
				"name":			$("meta.title").attr("content"),
				/*"caption":		$(this).attr("data-caption"),*/
				"description":	$("meta.description").attr("content").substring(0,277)+"...",
				"picture":		$("meta.image").attr("content"),
				/*"source":		$(this).attr("data-source"),*/
				"ref":			"share",
				"actions":		"{'name':'Наша группа на Facebook', 'link':'https://www.facebook.com/pages/Miamo/389387777830773'}",
				"redirect_uri":	"http://busiki-shop.com/?ref=facebook"
			});
			for (var k in data){
				url += "&"+k+"="+encodeURIComponent(data[k]);
			}
			share_window = window.open(url,$(this).attr("title"),'height=300,width=600');
		}
		else if ($(this).hasClass("share-vk")){
			url = "http://vkontakte.ru/share.php?url="+encodeURIComponent($("meta.url").attr("content"));
			share_window = window.open(url,$(this).attr("title"),'height=300,width=600');
		}
		else if ($(this).hasClass("share-odnoklassniki")){
			url = "http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.noresize=on&st._surl="+encodeURIComponent($("meta.url").attr("content"));
			share_window = window.open(url,$(this).attr("title"),'height=300,width=600');
		}
		else if ($(this).hasClass("share-twitter")){
			url = "http://twitter.com/intent/tweet?via=MIAMO&related=MIAMO,Pandora";
			var data = new Object({
				"url":			$("meta.url").attr("content"),
				"text":			$("meta.title").attr("content")
			});
			for (var k in data){
				url += "&"+k+"="+encodeURIComponent(data[k]);
			}
			share_window = window.open(url,$(this).attr("title"),'height=300,width=600');
		}
		else if ($(this).hasClass("share-googleplus")){
			url = "https://plus.google.com/u/0/share?hl=ru&url="+$("meta.url").attr("content");
			var data = new Object({
				"url":			$("meta.url").attr("content")
			});
			for (var k in data){
				url += "&"+k+"="+encodeURIComponent(data[k]);
			}
			share_window = window.open(url,$(this).attr("title"),'height=300,width=600');
		}
		else if ($(this).hasClass("share-livejournal")){
			url = "http://www.livejournal.com/update.bml?a=b";
			var data = new Object({
				"url":			$("meta.url").attr("content"),
				"subject":		$("meta.title").attr("content"),
				"event":		'<img src="'+$("meta.image").attr("content")+'" />'+"\n\n"+$("meta.description").attr("content").substring(0,277)+"...",
			});
			for (var k in data){
				url += "&"+k+"="+encodeURIComponent(data[k]);
			}
			share_window = window.open(url,$(this).attr("title"),'height=500,width=1024');
		}
	});
	
	$(document).on("click", "#wrapper_menu_personal .menu-personal-button>a.som-prevent-default", function(){
		$("#wrapper_menu_personal .menu-personal-button>a.som-prevent-default.active").not($(this)).click();
		$(this).toggleClass("active");
		$(this).siblings(".pop-down").toggleClass("hide");
		$("#wrapper_menu_personal .share-url input:visible").focus();
	});

	$(document).on("focus", "#wrapper_menu_personal .share-url input", function(){
		$(this).val($(this).attr("data-url"));
		$(this).select();
	});
	
	$(document).on("mousedown", "#wrapper_menu_personal .share-url input", function(event){
		event.preventDefault();
		$(this).focus();
	});
	
	$(document).on("focus", ".som-default-value.password", function(){
		if($(this).val() == ""){
			$(this).get(0).type='password';
			//$(this).addClass("password");
		}
	});
	$(document).on("blur", ".som-default-value.password", function(){
		if($(this).val() == $(this).attr("data-default-value")){
			//$(this).removeClass("password");
			$(this).get(0).type='text';
		}
	});
	
	/*
	$(document).click(function(event){
		event.stopPropagation();
		event.preventDefault();
		if (typeof(event.originalEvent) == "undefined"){
			return false;
		}
		if ($(this).closest("#image_preview").size() > 0){
			return false;
		}
		$("#image_preview .som-popup-trigger-close").click();
		return false;
	});
	*/
	
	$(document).on("click", ".preview_on_click", function(){
		$("#image_preview .som-popup-trigger-close").click();
		SOM.popupGenericOpen("v2/popup/popup_image_preview", new Object({
			"IMAGE":	$(this).attr("data-preview")
		}),null, function(popup){
			var div = popup.find(".som-popup-main .som-popup-wide");
			div.css("overflow","");
			div.width("auto");
			div.height("auto");
			div.find("img").css({
				"max-width"	: $(window).width()-40,
				"max-height": $(window).height()-200
			});
			popup.width("auto");
			popup.height("auto");

			popup.find("img").load(function(){
				SOM.popup_center(popup);
			});
			
		});
	});
	
	$(document).on("click", "tr.tick_on_click td:not(.checkbox)", function(event){
		$(this).closest("tr").find("input[type=checkbox]").click();
	});

	$(document).on("click", "div.tag_menu .tab", function(event){
		event.stopPropagation();
	});
	$(document).on("click", "div.tag_menu .tab h3", function(){
		var menu = $(this).closest(".tag_menu");
		var tab = $(this).closest(".tab");
		menu.find(".tab.active").not(tab).removeClass("active").find(".drop-down");
		tab.toggleClass("active");
		var w = tab.find("h3").outerWidth()-2;
		tab.find(".drop-down").css("min-width",w+"px");
		tab.find("span.hider").width(w);
	});
	
	$(document).on("change", "div.tag_menu .tab li input[type=checkbox]", function(){
		var tab = $(this).closest(".tab");
		var menu = tab.closest(".tag_menu");
		if (tab.find("input[type=checkbox]:checked").size() > 0){
			tab.find("h3 span").addClass("tick");
		}
		else {
			tab.find("h3 span").removeClass("tick");
		}
		
		if (menu.find("input[type=checkbox]:checked").size() > 0){
			menu.find(".tags-clear").removeClass("inactive");
		}
		else {
			menu.find(".tags-clear").addClass("inactive");
		}
		$(".tag_menu:visible .tab.active").removeClass("active");
	});
	
	$(document).on("click", "div.tag_menu .tags-clear", function(event){
		event.stopPropagation();
		$(this).addClass("inactive");
		var menu = $(this).closest(".tag_menu");
		menu.find(".tick").removeClass("tick");
		menu.find("input[type=checkbox]:checked").attr("checked",false).last().trigger("change");
		menu.find(".tab.active").removeClass("active");
		$(".tag-filtered .item.hide").removeClass("hide");
	});
	
	$(document).on("click", "body", function(){
		$(".tag_menu:visible .tab.active").removeClass("active");
	});
	
	$(document).on("click", ".qty_operator", function(event){
		$(this).disableSelection();
		if ($(this).is("[data-disabled] *,[data-disabled]")){
			return false;
		}
		
		var input = $(this).siblings("input.qty");
		var diff = parseInt($(this).attr("data-add"));
		var new_qty = parseInt(input.val())+diff;
		if (new_qty <= 0){
			new_qty = 1;
		}
		input.val(new_qty);
		
		if (qty_change_delay === 0){
			if ($("body").hasClass("mobile")){
				qty_change_delay = 2000;
			}
			else {
				qty_change_delay = 500;
			}
		}
		
		clearTimeout(qty_change_trigger);
		qty_change_trigger = setTimeout(function(){
			input.trigger("change");
		},500);
		
		qty_operator_fix_state($(this));
	});
	
	$(".qty_operator.minus").each(function(){
		qty_operator_fix_state($(this));
	});
});

function qty_operator_fix_state(button){
	var qty = parseInt(button.siblings("input.qty").val());
	if (button.hasClass("minus")){
		SOM.enable(button.siblings(".plus"));
		if(qty <= 1){
			SOM.disable(button);
		}
		else {
			SOM.enable(button);
		}
	}
	else {
		SOM.enable(button.siblings(".minus"));
		if(qty >= 1000){
			SOM.disable(button);
		}
		else {
			SOM.enable(button);
		}
	}
}

function popupBasketOpen(functionOK){
	fetchHTML("constructor_popup_basket_updated", new Array(),
		function(html){
			displayPopup(html, 350, function(popup){
				popup.find("input.popup-cancel").click(function(){
					var popup = $(this).closest("div.popup-box");
					popup.fadeOut(parseInt(100),function(){
						$(this).remove();
					});
				});

				popup.find("input.popup-send").click(functionOK);
			})
		}
	);
}

function itemAddedToBasketPopup(){
	popupBasketOpen(function(){
		window.location = window.location = "/basket/";
	});
}

function checkActiveSet(link){
	if (link.hasClass("inactive")){
		alert("no");
		return false;
	}
	return true;
}

function update_header_basket(json_array){
	var data = json_array;
	if(typeof(json_array) === 'string'){
		data = JSON.parse(json_array);
	}
	var callback_data;
	for(var i in data){
		if (data[i].target == "__callback"){
			callback_data = data[i];
			break;
		}
	}
	$("#basket_top .header-basket-left .subtotal").text(callback_data.message.basket_top.total);
	$("#basket_top .header-basket-right .header-basket-count").text(callback_data.message.basket_top.qty);
}

function menu_detect_active(){
	$("#wrapper_menu a").each(function(){
		var href = $(this).attr("href");
		var location = decodeURIComponent(window.location.pathname);
		if (location.indexOf(href) >= 0){
			if (href == "/" && location != "/" || href == ""){
				return;
			}
			$(this).addClass("selected");
			$(this).parents().filter("#wrapper_menu li:not(.drop-down)").first().find("div>a").addClass("selected");
		}
	});
	$(".side-menu a").each(function(){
		var href = $(this).attr("href");
		var location = decodeURIComponent(window.location.pathname);
		if (location.indexOf(href) >= 0){
			if (href == "/" && location != "/" || href == ""){
				return;
			}
			$(this).addClass("selected");
		}
	});
}

function sides_fix_height(){
	$(".background_side").animate({
		"height":$("#wrapper_whole").height()+"px"
	},100);
}

if (typeof(SOM) != "undefined"){
	som = SOM;
	SOM.locale_update({
		"popup_error_title"					:"- Ошибка! -",
		"popup_success_title"				:"- Выполнено -",
		"popup_confirm_title"				:"- Вы уверены? -",
		"popup_message_template"			:"v2/popup/popup_message",
		"popup_error_message_template"		:"v2/popup/popup_error_message",
		"popup_success_message_template"	:"v2/popup/popup_success_message",
		"popup_confirm_template"			:"v2/popup/popup_confirm",
		"popup_message_max_file_size"		:"Максимальный размер файла",
		"MB"								:"мб"
	});
}

function basket_updated(json){
	try {
		json = JSON.parse(json);
	}
	catch(error){
		SOM.popupMessageOpen("Ошибка", json, 500);
	}
	if ("1" == json.status){
		$(".quantity.header-basket-count").text(json.count);
		$("#basket_top div.header-basket-left span.subtotal").text(json.total);
		
		if ($("#basket").size() == 0){
			SOM.popupGenericOpen("v2/popup/popup_basket_updated");
		}
		else {
			api(new Object({
				"a"	:	"get",
				"o"	:	"basket_table_html"
			}),basket_full_update);
		}
		
		if ($("div.suggestions-basket").size() > 0){
			$.ajax({
				type: "POST",
				url: "/process_ajax.php",
				data: "a=get_basket_suggestions",
				dataType: "jsonp"
			});
		}
	}
}

function login_attempt(json){
	json = JSON.parse(json);
	if (json[0].result == "1"){
		var form = $("form.login-form");
		form.find("input[name=redirect]").val(window.location.href);
		form.removeClass("som-ajax-submit-container").submit();
	}
}

function update_basket_suggestions(json){
	suggested_items = json;
	var container = $("div.suggested-items");
	container.attr("data-current-index","-1");
	container.find("a.switch").click();
}

function download_fsets(json){
	fsets = json;
}

function switch_set(direction){
	var fset = $("div.featured-set");
	var rotator = fset.find("div.set-rotator");
	var current_index = parseInt(rotator.attr("data-current-index"));
	var next = current_index + direction;
	var preload_left = current_index;
	var preload_right = current_index;
	if (direction > 0){
		preload_right = next + direction;
	}
	else {
		preload_left = next + direction;
	}
	
	if(next === 0){
		preload_left = fsets.length - 1;
	}
	else if (next === fsets.length -1 ){
		preload_right = 0;
	}
	
	if (next < 0){
		next = fsets.length - 1;
		preload_left = next - 1;
	}
	else if (next === fsets.length){
		next = 0;
		preload_right = 1;
	}
	
	var link = fsets[next].link;
	
	rotator.attr("data-current-index",next);
	rotator.find("p.image").css("background-image","url('/cache/"+link+".jpeg')").attr("data-preview","/cache/"+link+".jpeg");
	fset.find("span.price").text(parseInt(fsets[next].subtotal/100));
	fset.find("a.edit").attr("href","/constructor/build/"+link+"/");
	fset.find("div.som-ajax-submit-container input[name=item]").val(link);
	
	fset.find("div.preload img.left").attr("src","/cache/"+fsets[preload_left].link+".jpeg");
	fset.find("div.preload img.right").attr("src","/cache/"+fsets[preload_right].link+".jpeg");
}

/* Rotator */

$(document).ready(function(){
	$(".rotator-slide a").live("click",function(event){
		if ($(this).attr("href") == ""){
			event.preventDefault();
		}
	});
	$(".rotator-switch").live("click",function(event){
		if ($("#rotator .rotator-slide").size() <= 0){
			return false;
		}
		event.preventDefault();
		nextSlide($(this).attr("data-direction"));
		clearInterval(slideTimer);
	});
	
	if ($("#rotator .rotator-slide").size() > 1){
		slideTimer = setInterval(function(){nextSlide(-1);}, 4000);
	}
	else {
		$(".rotator-switch").remove();
	}
});

function nextSlide(direction){
	if (direction > 0){
		$("#rotator .rotator-slide").last().prependTo($("#rotator ul"));
		$("#rotator ul").css("left","-720px");
		$("#rotator ul").animate({"left":(0) + "px"});
	}
	else {
		$("#rotator ul").animate({"left":(direction * 720) + "px"},function(){
			$("#rotator .rotator-slide").first().appendTo($("#rotator ul"));
			$("#rotator ul").css("left","0px");
		});
	}
}

/* /Rotator */


/* Other */
function feedback_sent(response){
	if (response[0].result == "1"){
		SOM.popupGenericOpen("v2/popup/popup_feedback_sent");
	}
}

function api(param, success_callback, error_callback){
	
	var data = new Array();
	for (var k in param){
		data.push(k+"="+param[k]);
	}
	
	$.ajax({
		url:"/api.php",
		type:"post",
		data: data.join("&"),
		success:function(json_data){
			success_callback(json_data);
		},
		error:function(error){
			SOM.run_if_function(error_callback,error);
		}
	});
}

function password_recover_dialog(){
	SOM.popupGenericOpen("v2/popup/popup_password_recover");
}

function soft_redirect(url){
	$(document).find("html").load(url);
}

/* /Other */