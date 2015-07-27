/*
$(window).load(function(){
	$("body").addClass("mobile").removeClass("bigscreen");

});
*/
function show_touch_tip(item){
	$("#touch-tip a").attr("href", "/item/"+item.attr("data-id")+"/");
	$("#touch-tip img").attr("src", "/cache/thumb_"+item.attr("data-id")+"_30.jpeg");
	$("#touch-tip .name").text(item.find("img").first().attr("alt"));
	$("#touch-tip .price").text(item.find(".price b").first().text());
	$("#touch-tip").show();
}

function bind_drag_events(item){
	item.click(function(){
		if ($("body").hasClass("mobile")){
			show_touch_tip($(this));
		}
	}).drag("start", function(event){
		//console.log(event);
		//console.log("start drag "+(new Date().getTime()));
		CONSTRUCTOR.move_event = prepare_point(event);
		var bound = $(this);
		setTimeout(function(){
			CONSTRUCTOR.mouse_down(bound);
		},1);

		CONSTRUCTOR.move_timer = setInterval(function(){
			if (!CONSTRUCTOR.dragging){
				clearInterval(CONSTRUCTOR.move_timer);
				return;
			}

			CONSTRUCTOR.mouse_move();
		}, 5);

	}).drag(function(event){
		//console.log("drag "+(new Date().getTime()));
		//console.log(event);

		if (CONSTRUCTOR.dragging){
			CONSTRUCTOR.move_event = prepare_point(event);
		}
	},{ click:true }).drag("end", function(event, dd){
		//console.log(event);
		//console.log("end drag");
		if (CONSTRUCTOR.dragging){
			clearInterval(CONSTRUCTOR.move_timer);
			CONSTRUCTOR.move_event = prepare_point(event);
			CONSTRUCTOR.mouse_up();
		}
	});
}

function scroll_item_container(button){

	var container = button.siblings(".item-container");

	var direction = parseInt(button.attr("data-direction"));

	var item_height = container.find(".item:visible").first().outerHeight();

	var offset = container[0].scrollTop;

	var new_offset = offset + (2 * item_height + 20) * direction;

	if (direction > 0){
		var max_offset = container[0].scrollHeight;
		if (new_offset > max_offset){
			new_offset = max_offset;
		}
	}
	else {
		if (new_offset < 0){
			new_offset = 0;
		}
	}

	container[0].scrollTop = new_offset;
	load_item_images();
}

function prepare_point(event){

	if ("object" === typeof(event.originalEvent) && null !== event.originalEvent){
		event.originalEvent.preventDefault();
		event.originalEvent.stopPropagation();
	}
	event.preventDefault();
	event.stopPropagation();
	return new Object({
		type		:	event.type,
		x			:	event.pageX,
		y			:	event.pageY,
		timeStamp	:	new Date().getTime()
	});
}
$(window).load(function(){
	if ($.browser.mobile){
		$.scrollTo("h1.v2.no-top");
	}
});


$(document).on('ready', function(){

	if ($.browser.mobile){
		$.scrollTo("h1.v2.no-top");
	}

	$(".dropzone,.item,.pickupzone").disableSelection();

	$(".item.component").each(function(){
		bind_drag_events($(this));
	});

	$(document).on('touchmove', ".item", function(event) {
		event.preventDefault();
	});

	$("#base,.item.component").on({
		touchmove		:function(event){
			event.preventDefault();
		},
		touchstart		:function(event){
			event.preventDefault();
		},
		touchend		:function(event){
			event.preventDefault();
		}
	});

	$("body").on({
		touchmove	: function(event) {
			if (CONSTRUCTOR.dragging){
				event.preventDefault();
			}
		},
		touchcancel	:function(event){
			clearInterval(CONSTRUCTOR.move_timer);
			if (CONSTRUCTOR.dragging){
				event.preventDefault();
				CONSTRUCTOR.move_event = prepare_point(event);
				CONSTRUCTOR.move_event = prepare_point(event);
				CONSTRUCTOR.mouse_up();
			}
		},
		click		: function (){
			if (!CONSTRUCTOR.dragging){
				$("#touch-tip").hide();
			}
		}
	});

	$(".item-tab .v2button-arrow-long").on("click", function(event){
		event.preventDefault();
		event.stopPropagation();
		event.originalEvent.preventDefault();
		event.originalEvent.stopPropagation();
		scroll_item_container($(this));
		return false;
	});

	$("div.tag_menu .tab .logic input[name=logic]").on("change", function(){
		if ($(this).is(":checked")){
			$("input[name=c_logic]").val("and");
		}
		else {
			$("input[name=c_logic]").val("or");
		}
		$(".tag_menu:visible .tab.active").removeClass("active");
		filter_tags();
	});

});


CONSTRUCTOR = new Object({
	auto				:	false,
	load_images_timer	:	null,
	dragging			:	false,
	draggable			:	null,
	move_counter		:	5,
	move_timer			:	null,
	move_complete		:	true,
	move_event			:	null,
	cursor_offset		:	{
		x	:	0,
		y	:	0
	},

	mouse_down		:	function(item){

		//console.log(CONSTRUCTOR.move_event);
		//console.log(item);

		CONSTRUCTOR.dragging = true;

		if(item.hasClass("static")){
			component = draggable_instantiate(item);
		}
		else {
			component = item;
			CONSTRUCTOR.cursor_offset.x = -component.width()*0.5;
			CONSTRUCTOR.cursor_offset.y = -component.height()*0.5;
		}

		if ($("body").hasClass("mobile")){
			show_touch_tip(item);
		}

		$("body").addClass("dragged");
		component.addClass("free").addClass("dragged");

		CONSTRUCTOR.draggable = component;

		if (CONSTRUCTOR.draggable.parent().is("#base")){
			draggable_copy().insertAfter(CONSTRUCTOR.draggable);
			CONSTRUCTOR.draggable.addClass("clipped").appendTo("body");
		}

		setTimeout(draggable_position,1);
	},

	mouse_move		:	function(){
		if (new Date().getTime() - CONSTRUCTOR.move_event.timeStamp > 50) {
			return;
		}
		/*
		CONSTRUCTOR.move_counter++;
		if (CONSTRUCTOR.move_counter > 5) {
			//console.log(CONSTRUCTOR.move_event);
			draggable_position();
			CONSTRUCTOR.move_counter = 0;
		}
		*/
	   draggable_position();
	},

	mouse_up		:	function(){
		//console.log(CONSTRUCTOR.move_event);

		$(".item.instance.dragged").removeClass("dragged");
		$("body").removeClass("dragged");

		var preview = $("#base .item.preview");

		if (preview.size() > 0){
			// Component was dropped onto base, remove draggable, make preview permanent
			CONSTRUCTOR.draggable.remove();
			preview.removeClass("preview");
			$(".item.instance.clipped").remove();
		}
		else {

			// check where it was dropped

			var inside_workspace_x = CONSTRUCTOR.move_event.x > $("#constructor_workspace").offset().left && CONSTRUCTOR.move_event.x < $("#constructor_workspace").offset().left + $("#constructor_workspace").width();
			var inside_workspace_y = CONSTRUCTOR.move_event.y > $("#constructor_workspace").offset().top && CONSTRUCTOR.move_event.y < $("#constructor_workspace").offset().top + $("#constructor_workspace").height();

			if (inside_workspace_x && inside_workspace_y){
				$("#constructor_workspace").append(CONSTRUCTOR.draggable);
			}
			else {
				CONSTRUCTOR.draggable.remove();
			}
		}

		CONSTRUCTOR.dragging = false;
		CONSTRUCTOR.draggable = null;
		CONSTRUCTOR.cursor_offset.x = 0;
		CONSTRUCTOR.cursor_offset.y = 0;

		recalculate_and_rebuild();
	},

	base			:	{
		pixels		:	950,
		size		:	100,
		proportion	:	3,
		left		:	0,
		active		:	0,
		right		:	0,
		buffer		:	0,
		buffer_px	:	0
	}
});


function draggable_instantiate(static){
	var instance = static.clone(true);
	instance.addClass("instance").removeClass("static").addClass("fresh");

	instance.find("img.main").attr("src","/constructor/images/items/"+instance.find("[name=image2]").val());
	$("body").prepend(instance);
	scale_single(instance);

	//bind_drag_events(instance);
	return instance;
}

function draggable_copy(){
	var copy = CONSTRUCTOR.draggable.clone(true);
	//bind_drag_events(copy);
	copy.addClass("preview").removeClass("free");
	copy.css({
		"top"	:	copy.attr("data-top"),
		"left"	:	""
	});
	return copy;
}

function draggable_position(){

	//console.log("drag pos 0 "+ new Date().getTime());

	if (!CONSTRUCTOR.move_complete || null === CONSTRUCTOR.draggable){
		return false;
	}

	CONSTRUCTOR.move_complete = false;

	//console.log("drag pos 1 "+ new Date().getTime());

	var posx = CONSTRUCTOR.move_event.x+CONSTRUCTOR.cursor_offset.x;
	var posy = CONSTRUCTOR.move_event.y+CONSTRUCTOR.cursor_offset.y;

	CONSTRUCTOR.draggable.css({
		"left":	posx,
		"top":	posy
	});

	CONSTRUCTOR.draggable.removeClass("fresh");

	var clip_x = CONSTRUCTOR.move_event.x >= $("#base").offset().left && CONSTRUCTOR.move_event.x <= $("#base").offset().left + 950;
	var clip_y = CONSTRUCTOR.move_event.y >= ($("#base").offset().top) && CONSTRUCTOR.move_event.y <= ($("#base").offset().top + 40 - CONSTRUCTOR.cursor_offset.y);

	if (clip_x && clip_y){
		// Clipping to base
		if (!CONSTRUCTOR.draggable.hasClass("clipped")){
			// Initial clip to base
			draggable_copy().appendTo($("#base"));
			CONSTRUCTOR.draggable.addClass("clipped");
		}

		position_previw();
		position_base_components();
	}
	else {
		if (CONSTRUCTOR.draggable.hasClass("clipped")){
			$("#base .preview").remove();
			CONSTRUCTOR.draggable.removeClass("clipped");
		}
		if (!CONSTRUCTOR.draggable.parent().is("body")){
			CONSTRUCTOR.draggable.appendTo("body");
		}
	}

	//console.log("drag pos 2 "+ new Date().getTime());

	CONSTRUCTOR.move_complete = true;
}

function position_previw(){

	// Move the preview on the base, swapping with other items if necessary
	var preview = $("#base .preview");

	if (preview.size() > 0 && $("#base .item").size() > 1){

		var first = $("#base .item").first();
		var prev = preview.prev();
		var next = preview.next();

		if(preview !== first && CONSTRUCTOR.move_event.x < first.offset().left + first.width()*0.5){
			// Left most
			$("#base").prepend(preview);
			return;
		}

		// Right most is default

		if(prev.size() > 0 && CONSTRUCTOR.move_event.x < prev.offset().left+prev.width()*0.5){
			// Somewhere in the middle
			preview.insertBefore(prev);
			return;
		}

		if(next.size() > 0 && CONSTRUCTOR.move_event.x > next.offset().left+next.width()*0.5){
			// Somewhere in the middle
			preview.insertAfter(next);
			return;
		}
	}
}

function position_base_components(){
	var base = $("#base");
	base.css({
		"padding-left"	: CONSTRUCTOR.base.left+"px",
		"width"			: CONSTRUCTOR.base.active+"px"
	});

	var active_zone_end = base.offset().left + base.width() + parseInt(base.css("padding-left"));

	$($("#base .item.instance").get().reverse()).each(function(){
		// Shake off items from base starting from right-most
		var component = $(this);

		if (component[0].offsetTop > base.height()/2 || component.offset().left > active_zone_end ){
			// Component moves to work space
			var space = $("#constructor_workspace");
			if (component.hasClass("preview")){
				component.remove();
				return;
			}
			component.appendTo(space);

			var x = (Math.random() * (space.width() - component.width())) + space.offset().left;;
			var y = (Math.random() * (space.height()- 50 - component.height())) + space.offset().top + 50;

			component.css({
				"top": y+"px",
				"left": x+"px"
			});
		}
	});
	var last = $("#base .item").last();
	if (last.size() === 0){
		return;
	}
	var unused_space = active_zone_end - (last.offset().left + last.outerWidth(true));

	var padding = parseInt(unused_space/2);
	base.css({
		"padding-left": (CONSTRUCTOR.base.left+padding)+"px",
		"width": (CONSTRUCTOR.base.active-padding)+"px"
	});
}

function load_item_images(){
	var container = $(".item-container:visible");
	var y1 = container.offset().top - 80;
	var y2 = y1 + container.height() + 80;
	var n = 0;
	container.find("img.main[data-loaded=false]:visible").each(function(){
		if (y1 <= $(this).offset().top && $(this).offset().top <= y2){
			//console.log($(this).closest(".item").attr("data-id")+" "+n+" " + y1 +" <= " +$(this).offset().top + " <+ "+y2);
			if (n++ > 40){
				return;
			}
			var url = $(this).attr("data-src");
			$(this).attr("src", url);
			$(this).attr("data-loaded","true");
		}
	});
}

function filter_tags(){
	var tab = $("#constructor_catalog .item-tab:visible");

	var logic = $("input[name=c_logic]").val();

	var show_items = new Array();

	var ticks = tab.find("input[type=checkbox]:checked:not([name=logic])");

	if (ticks.size() === 0){
		tab.find(".item.group:not(:visible), .item.component:not(:visible)").addClass('show').removeClass("hide");
		setTimeout(function(){
			load_item_images();
			$(".item-container:visible")[0].scrollTop = 0;
		},5);
		return;
	}
	var first = true;
	ticks.each(function(){

		var tagged_items = tags_to_items[$(this).val()];

		if (logic === "and" && !first){
			show_items = $.map(show_items,function(a){return $.inArray(a, tagged_items) < 0 ? null : a;})
		}
		else {
			show_items = show_items.concat(tagged_items);
		}
		first = false;
	});
	tab.find(".item.component,.item.base[data-igid=0]").each(function(){

		var item = $(this);

		setTimeout(function(){
			var found = show_items.indexOf(item.attr("data-id")) >= 0;
			if (found && !item.is(":visible")){
				item.addClass('show').removeClass("hide");
			}
			else if (!found && $(this).is(":visible")){
				item.addClass('hide').removeClass("show");
			}
			clearTimeout(CONSTRUCTOR.load_images_timer);
			CONSTRUCTOR.load_images_timer = setTimeout(function(){
				load_item_images();
				$(".item-container:visible")[0].scrollTop = 0;
			}, 50);
		},1);

	});
	tab.find(".item.group").each(function(){
		show_hide_group($(this), show_items);
	});
}

function show_hide_group(group, array){
	var found = false;
	group.find("option").each(function(){
		if (array.indexOf($(this).val()) >= 0){
			if (!group.is(":visible")){
				group.addClass('show').removeClass("hide");
			}
			found = true;
			return true;
		}
	});
	if(found){
		return true;
	}
	if (group.is(":visible")){
		group.addClass('hide').removeClass("show");
	}
	return false;
}

function scale_instances(){
	console.log("Re-scaling all instances");
	$(".item.instance").each(function(){
		scale_single($(this));
	});

}

function scale_single(component){
	var pxwidth = pixelsOf(component,1);

	pxwidth += pixelsOf(component,2)+pixelsOf(component,3);

	var iwidth = parseInt(component.find("input[name=iwidth]").val());
	var iheight = parseInt(component.find("input[name=iheight]").val());
	var pxheight = parseInt(iheight*pxwidth/iwidth);

	component.css({
		"background-size": pxwidth+"px"+" auto",
		"width": pxwidth+"px",
		"height": pxheight+"px",
		"margin": "0 "+parseInt(pixelsOf(component, 1)*0.2*0.5)+"px"
	});
	component.find("img").css({
		"width": pxwidth+"px",
		"height": pxheight+"px"
	});

	component.attr("data-top",parseInt($("#base").height()/2 - pixelsOf(component, 4))+"px");

	var size1 = parseFloat(component.find("input[name=size1]").val());
	if (size1 > 0){
		// Podveska
		var size2 = parseFloat(component.find("input[name=size2]").val());
		component.width(pixelsOf(component, 2));
		component.find("img").css({
			"left"		:	"-"+pixelsOf(component, 1)+"px"
		});
		component.addClass("podveska");
	}
	component.css("margin","0 "+CONSTRUCTOR.base.buffer_px+"px");

	if (CONSTRUCTOR.dragging){
		CONSTRUCTOR.cursor_offset.x = -pxwidth*0.5;
		CONSTRUCTOR.cursor_offset.y = -pxheight*0.5;
	}
	//console.log(component.width()+" / "+parseInt(component.css("background-size"))+" = "+component.width()/parseInt(component.css("background-size")));
	/*
	setTimeout(function(){
		component.css("z-index",((component.width()/parseInt(component.css("background-size")))<0.4)?"0":"1");
	}, 10);
	*/
}

function pixelsOf(component,value){
	return parseInt(parseFloat(component.find("input[name=size"+value+"]").val()) * CONSTRUCTOR.base.proportion);
}

function recalculate_and_rebuild(){
	var total = 0;
	var current_base_id = $("p.base-size select").val();
	var link_components = "";

	total += parseInt($(".item.base[data-id="+current_base_id+"]").find("[name=price]").val());

	$("#base .item.instance").each(function(){
		total += parseInt($(this).find("[name=price]").val());
		link_components += "-"+$(this).attr("data-id");
	});

	$("p.total b span").text(total);

	var link_full = current_base_id+link_components;

	$("input[name=build]").val(link_full);

	$("ul#constructor_list a").each(function(){
		$(this).attr("href","/constructor/build/"+$(this).attr("data-base")+link_components+"/");
	});

	var url = global_root+"/constructor/build/"+link_full+"/";
	$("input.build-link").val(link_full);
	$("meta.url").attr("content",url);
	$("meta.image").attr("content",global_root+"/cache/"+link_full+".jpeg");
	$("div.share-url input").attr("data-url",url).val(url);
	$("#wrapper_menu_personal div.share-custom p a").attr("href","/render/"+link_full+"?download");
};

function switch_to_base(iid, rescale){
	var item = $(".item.static.base[data-id="+iid+"]");
	var size1 = parseFloat(item.find("input[name=size1]").val());
	var size2 = parseFloat(item.find("input[name=size2]").val());
	var size3 = parseFloat(item.find("input[name=size3]").val());
	CONSTRUCTOR.base.size = size1+size2+size3;
	CONSTRUCTOR.base.proportion = CONSTRUCTOR.base.pixels/CONSTRUCTOR.base.size;
	CONSTRUCTOR.base.buffer_px = parseInt(CONSTRUCTOR.base.buffer*CONSTRUCTOR.base.proportion/2);
	CONSTRUCTOR.base.left = pixelsOf(item, 1);
	CONSTRUCTOR.base.right = pixelsOf(item, 3);
	CONSTRUCTOR.base.active = pixelsOf(item, 2);
	$("#base").css({
		"padding-left"		: CONSTRUCTOR.base.left+"px",
		"padding-right"		: CONSTRUCTOR.base.right+"px",
		"width"				: CONSTRUCTOR.base.active+"px"
	});
	$("#base").attr("data-id",item.attr("data-id"));

	$("#base_box").css({
		"background-image"	: "url(/constructor/images/items/"+item.find("input[name=image2]").val()+")",
	});

	setTimeout(function(){
		recalculate_and_rebuild();
		if ($.browser.mobile){
			$.scrollTo("h1.v2.no-top");
		}
		if ($("body").hasClass("mobile")){
			show_touch_tip(item);
		}
	}, 100);

	if (true === rescale){
		scale_instances();
	}

	position_base_components();
}

function touch_to_mouse_event(touch_event){
	if ("undefined" !== typeof(touch_event.originalEvent.touches[0])){
		touch_event.pageX = touch_event.originalEvent.touches[0].pageX;
		touch_event.pageY = touch_event.originalEvent.touches[0].pageY;
	}
	else {
		touch_event.pageX = 0;
		touch_event.pageY = 0;
	}
	return touch_event;
}



$(document).ready(function(){

	CONSTRUCTOR.base.buffer = parseInt($("input[name=bead_buffer]").val());
	CONSTRUCTOR.base.pixels = $("#base").width();

	load_item_images();

	$("#constructor_catalog").disableSelection();

	$(".tabs a.v2button").on({
		mouseenter:	function() {
			$(".instructions_short p:eq("+$(this).attr("data-ix")+")").addClass("hover");
		},
		mouseleave:	function() {
			$(".instructions_short p:eq("+$(this).attr("data-ix")+")").removeClass("hover");
		},
		click:		function(){
			if ($(this).is("#hint,#basket_button,.active")){
				return;
			}
			$(".tabs a.v2button.active").removeClass("active");
			$(this).addClass("active");
			$("#constructor_catalog .item-tab:visible").addClass("hide");
			$("#constructor_catalog .item-tab[data-ix="+$(this).attr("data-ix")+"]").removeClass("hide");
			setTimeout(function(){
				$(window).trigger("resize");
				load_item_images();
			},10);
		}
	});

	$(".item.static").on({
		mousemove:	function(event) {
			if (CONSTRUCTOR.dragging || $("body").hasClass("mobile")){
				return false;
			}
			/*
			console.log("Client x, y: "+ event.clientX + " " + event.clientY);
			console.log("Offset x, y: "+ event.offsetX + " " + event.offsetY);
			console.log("Page x, y: "+ event.pageX + " " + event.pageY);
			console.log("Screen x, y: "+ event.screenX + " " + event.screenY);
			*/
			var popup = $(this).find(".item-popup");
			var img = popup.find("img[data-loaded=false]");
			if (img.size() > 0){
				img.attr("data-loaded","true").attr("src", img.attr("data-src"));
			}
			var mod_x = 0;
			if (event.clientX > $(window).width()/2){
				mod_x = -popup.width()-10;
			}

			popup.css({
				top: event.clientY+5,
				left: event.clientX+5+mod_x
			});

		},
		mouseleave:	function() {
			$(".instructions_short p:eq("+$(this).attr("data-ix")+")").removeClass("hover");
		}
	});

	$("a#hint").on("click",function(){
		$.scrollTo("div.instructions",100);
	});

	$(".item-container").on("scroll", function(){
		load_item_images();
	});


	$(".tag_menu .tab li input[type=checkbox]").on("change", function(){
		filter_tags();
	});

	$(".item.static.group").on("click",function(){
		var current_iid = $("p.base-size select").val();

		var current_item = $(".item.base[data-id="+current_iid+"]");

		if (current_item.attr("data-igid") === $(this).attr("data-igid")){
			return false;
		}

		var current_size = current_item.find("input[name=size4]").val();

		var same_size = $(".item.base[data-igid="+$(this).attr("data-igid")+"] input[name=size4][value="+current_size+"]");

		var need_rescale = false;

		var iid = -1;
		if (same_size.size() > 0){
			iid = same_size.closest(".item").attr("data-id");
		}
		else {
			need_rescale = true;
			iid = $(this).find("option").last().val();
		}

		switch_to_base(iid);

		if (need_rescale){
			scale_instances();
		}

		$("p.base-size select").replaceWith($(this).find("select")[0].outerHTML);
		$("p.base-name b").text($(this).attr("data-igname"));
		setTimeout(function(){
			$("p.base-size select").val(iid);
		},10);
	});

	$(".item.static.base").on("click",function(){
		var iid = $(this).attr("data-id");
		switch_to_base(iid);

		var current_size = $(".item.base[data-id="+$("p.base-size select").val()+"]").find("input[name=size4]").val();
		if ($(this).find("input[name=size4]").val() != current_size){
			scale_instances();
		}

		$("p.base-size select").replaceWith('<select><option value="'+iid+'">'+$(this).find("input[name=size4]").val()+'</option></select>');
		$("p.base-name b").text($(this).find("input[name=name]").val());
	});

	$(document).on("change","p.base-size select",function(){
		switch_to_base($(this).val(), true);
	});

	$(document).on("click", "div.tag_menu .tags-clear", function(event){
		event.preventDefault();
		setTimeout(function(){
			load_item_images();
			$(".item-container:visible")[0].scrollTop = 0;
		},5);
	});

	var build = $("input[name=build]").val().split("-");

	switch_to_base($("p.base-size select").val());

	for(var i in build){
		add_single_static_component(static_item_by_id(build[i]));
	}

	position_base_components();
	recalculate_and_rebuild();

});

function clear_base(){
	$("#base .item").remove();
	recalculate_and_rebuild();
}

function constructor_auto_single(response){

	var component = null;

	if (response[0].result < 0){

		component = $(".item.component.static").random();
	}
	else {
		var suggestions = JSON.parse(response[0].message);

		if (suggestions.length === 0) {
			component = $(".item.component.static").random();
		}
		else {
			var item_data = null;
			do {
				item_data = $(suggestions).random();
				suggestions.splice(suggestions.indexOf(item_data[0]),1);
				if ($("#base .item").last().attr("data-id") == item_data[0]){
					component = $("<div/>", {
						class: "base"
					});
					continue;
				}
				component = static_item_by_id(item_data[0]);
			}
			while(component.hasClass("base") && suggestions.length > 0);

			if (component.hasClass("base")){
				component = $(".item.component.static").random();
			}
		}
	}

	add_single_static_component(component);

	if (CONSTRUCTOR.auto && $("#base .item").size() <= Math.ceil(parseInt($(".item.base[data-id="+$("p.base-size select").val()+"] input[name=size2]").val())/10)){
		SOM.enable($(".auto-add"));
		$(".auto-add").click();
	}
	else {
		SOM.enable($(".auto-make"));
		CONSTRUCTOR.auto = false;
	}

	position_base_components();
	recalculate_and_rebuild();
	SOM.enable($(".auto-add"))
}

function static_item_by_id(iid){
	return $(".item.static[data-id="+iid+"]").first();
}

function disable_auto_single(){
	SOM.disable($(".auto-add"));
}

function add_single_static_component(component){
	if (component.hasClass("base")){
		switch_to_base(component.attr("data-id"));
		return;
	}
	component = draggable_instantiate(component).removeClass("fresh");
	component.css({
		"top"	:	component.attr("data-top"),
		"left"	:	""
	});
	$("#base").append(component);
}

function constructor_auto_full(){
	SOM.disable($(".auto-make"));
	CONSTRUCTOR.auto = true;
	$(".auto-add").click();
}

