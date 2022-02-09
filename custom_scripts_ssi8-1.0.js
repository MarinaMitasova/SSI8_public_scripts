function checkArguments(arg, opts){
	if (arg.length == 0 || opts === undefined){throw "Функция должна принимать один аргумент в виде объекта."}
	if (arg.length > 1){throw "Слишком много арументов для данной функции! \nФункция должна принимать только один аргумент в виде объекта."}
	if (opts.ques === undefined){throw "Не задано имя вопроса `ques`!"}
	if ($("#"+opts.ques+"_div").length == 0){throw "Вопрос " + opts.ques + " не найден на странице."}
}

/*
Если отключить графические чекбоксы и радио-кнопки, то не работают как надо on click!!!
Надо переделать
$(function(){
	$("[type='checkbox']").on("click", function(){
		SSI_SelectGraphicalCheckbox($(), this, this.checked)
	})
	$(".clickable").on("click", function(){
		var inp = $(this).find("[type='checkbox']")[0]
		SSI_SelectGraphicalCheckbox($(), inp, inp.checked)
	})
})
*/
function changeInputTextOrExclusive(opts){

    //ques:  - Обязательный
    //answLocation: default="inColumns"

	checkArguments(arguments, opts);
	var ques = opts.ques;

	var quesDirection = opts.answLocation === undefined ? "inColumns" : opts.answLocation;
	if (quesDirection != "inRows" && quesDirection != "inColumns"){
		throw "answLocation может принимать одно из значений: 'inRows' или 'inColumns'."
	}
	
	var inputs = $("#"+ques+"_div").find("[type='text'], [type='tel'], textarea").not("[id$='_other']");
	var excl = $("#"+ques+"_div").find("[type='checkbox']")
	
	var arr = {};
	if (quesDirection == "inRows"){
		var temp=[];
		inputs.each(function(){
			var x = this.id.split("_")[1].replace("r", "");
			if (!~temp.indexOf(x)) temp.push(x)
		})
		$.each(temp, function(i, e){
			var reg = new RegExp(ques + '_r' + e + '_c\\d+');
			arr[e]={
				inps: inputs.filter(function(){return reg.test(this.id)}),
				chb: excl.filter(function(){return reg.test(this.id)})
			}
		})
	}else{
		var temp=[];
		inputs.each(function(){
			var x = this.id.split("_")[2].replace("c", "");
			if (!~temp.indexOf(x)) temp.push(x)
		})
		$.each(temp, function(i, e){
			var reg = new RegExp(ques + '_r\\d+_c'+e);
			arr[e]={
				inps: inputs.filter(function(){return reg.test(this.id)}),
				chb: excl.filter(function(){return reg.test(this.id)})
			}
		})
	}
	var other = $("[id^='" + ques + "_r'][id$='_other']");
	
	SSI_CustomGraphicalCheckbox = function(GraphicalCheckboxObj, inputObj, bln){
		if(bln){
			if (quesDirection == "inRows"){
				x = inputObj.id.split("_")[1].replace("r", "");
			}else{
				x = inputObj.id.split("_")[2].replace("c", "");
			}
			
			arr[x].inps.val("")
			arr[x].chb.not(inputObj).get().forEach(function(chb){
				SSI_SetSelect(chb.id, 0)
			})
			
			if(quesDirection == "inColumns" && other.length) other.val("");
		}
	}
	
	inputs.on("keyup", function(){
		if($(this).val() != ""){
			if (quesDirection == "inRows"){
				x = this.id.split("_")[1].replace("r", "");
			}else{
				x = this.id.split("_")[2].replace("c", "");
			}
			
			arr[x].chb.get().forEach(function(chb){
				SSI_SetSelect(chb.id, 0)
			})
		}
	});
	if(quesDirection == "inColumns" && other.length){
		other.on("keyup", function(){
			if($(this).val() != ""){excl.prop("checked", false);}
		});
	}
}

function checkInputTextOrExclusive(opts){
	
	//ques:  - Обязательный
    //answLocation (default="inColumns") inRows / inColumns
	//inputsCheck (default="some") some / every
	//continueIf - доступен для переопределения 

	checkArguments(arguments, opts);
	var ques = opts.ques;
	
	var quesDirection = opts.answLocation === undefined ? "inColumns" : opts.answLocation;
	if (quesDirection != "inRows" && quesDirection != "inColumns"){
		throw "answLocation может принимать одно из значений: 'inRows' или 'inColumns'."
	}
	
	var inputsCheck = opts.inputsCheck === undefined ? "some" : opts.inputsCheck;
	if (inputsCheck != "some" && inputsCheck != "every"){
		throw "inputsCheck может принимать одно из значений: 'some' или 'every'."
	}
	
	if (opts.continueIf === undefined){
		opts.continueIf = function(inps, excl, ind){
			var err = "Введите ответ в ";
			if (quesDirection == "inRows"){
				err = err + "строке №" + ind; 
			}else{
				err = err + "столбце №" + ind; 
			}
			
			var needAnsw = inputsCheck == "some" ? 1 : inps.length;
			
			var answInp = inps.filter(function(i, e){return $(e).val() != "";}).length,
				answExc = excl.filter(function(i, e){return $(e).prop("checked") == true;}).length;
			
			if (answInp < needAnsw && answExc == 0){
				inps.filter(function(i, e){return $(e).val() == "";}).get(0).focus();
				return err;
			}else{
				return true;
			}
		}
	}
	
	var inputs = $("#"+ques+"_div").find("[type='text'], [type='tel'], textarea").not("[id$='_other']");
	var excl = $("#"+ques+"_div").find("[type='checkbox']")
	
	var arr = {};
	if (quesDirection == "inRows"){
		var temp=[];
		inputs.each(function(){
			var x = this.id.split("_")[1].replace("r", "");
			if (!~temp.indexOf(x)) temp.push(x)
		})
		$.each(temp, function(i, e){
			var reg = new RegExp(ques + '_r' + e + '_c\\d+');
			arr[i+1]={
				inps: inputs.filter(function(){return reg.test(this.id)}),
				chb: excl.filter(function(){return reg.test(this.id)})
			}
		})
	}else{
		var temp=[];
		inputs.each(function(){
			var x = this.id.split("_")[2].replace("c", "");
			if (!~temp.indexOf(x)) temp.push(x)
		})
		$.each(temp, function(i, e){
			var reg = new RegExp(ques + '_r\\d+_c'+e);
			arr[i+1]={
				inps: inputs.filter(function(){return reg.test(this.id)}),
				chb: excl.filter(function(){return reg.test(this.id)})
			}
		})
	}
	
	var err = '';
	$.each(arr, function(i, obj){
		if (opts.continueIf(obj.inps, obj.chb, i) != true){
			err = opts.continueIf(obj.inps, obj.chb, i);
			return false;
		}
	})
	
	return err;
}

function otherByColumnsInTable(opts){

	checkArguments(arguments, opts);
	var ques = opts.ques;

	if (opts.other === undefined || opts.other === ""){
		throw "Номер строки-уточнения не задан или является пустой строкой!"
	}
	switch (Object.prototype.toString.call(opts.other)){
		case "[object Number]":
			var other = opts.other.toString();
			break;
		case "[object String]":	
		default:
			throw "Номер строки-уточнения `other` должен быть числом!"
	}
	var nameOther = opts.nameOther === undefined ? ques+"other" : opts.nameOther;
	var otherLocation = opts.otherLocation === undefined ? "inColumns" : opts.otherLocation;
	if (otherLocation != "inRows" && otherLocation != "inColumns"){
		throw "Параметр otherLocation д.б. равен либо 'inRows', либо 'inColumns'(по умолчанию)!"
	}
	if (nameOther.toString() !== nameOther || nameOther === ""){
		throw "Переменная nameOther должна быть строкой и \nсодержать в себе общую часть имени вопросов-уточнения!";
	}

	if (otherLocation == "inRows"){
		$("div[id^='" + nameOther + "']").find("input[type='text'], textarea").each(function() {
			$(this).parents("tr:first").hide();
			if ($(this).val() == ""){
				$(this).val("none");
			}
		});

		$("#" + ques + "_div").find("input[type='checkbox'], input[type='radio']").each(function(i, answ) {
			showOrHideOther1(answ);
		});

		SSI_CustomGraphicalCheckbox = function(graphicalObj, inputObj, bln){
				inputChanged(graphicalObj, inputObj, bln)
			};
		SSI_CustomGraphicalRadiobox = function(graphicalObj, inputObj, bln){
				inputChanged(graphicalObj, inputObj, bln)
			};
		function inputChanged(graphicalObj, inputObj, bln) {
			var reg = new RegExp(ques + "_.+");
			if (reg.test(inputObj.id)){
				showOrHideOther1(inputObj);
			}
		}

		function showOrHideOther1(answ){
			var id, r, c, rad, chb, elOther;
			id = $(answ).attr('id');
			if ($(answ).attr('type') == "checkbox"){
				r = id.split('_')[1].replace("r", "");
				c = id.split('_')[2].replace("c", "");
				chb = "#" + ques + "_r" + other + "_c" + c;
				elOther = $(chb);
			}else{
				r = id.split('_')[2];
				c = id.split('_')[1].replace("c", "");
				rad = "#" + ques + "_c" + c + "_" + other;
				elOther = $(rad);
			}
			if (elOther.prop("checked")){
				if (r == other){
					$("#" + nameOther + "_div").show();
					$("#" + nameOther + "_r" + c + "_c1").parents("tr:first").show();
					if ($("#" + nameOther + "_r" + c + "_c1").val() == "none"){
						$("#" + nameOther + "_r" + c + "_c1").val("");
					}
				}
			}else{
				$("#" + nameOther + "_r" + c + "_c1").parents("tr:first").hide();
				$("#" + nameOther + "_r" + c + "_c1").val("none");
			}
			if ($("#" + nameOther + "_div").find("input[type='text'], textarea").not(":hidden").length == 0){
				$("#" + nameOther + "_div").hide();
			}
		}
	}else{
		$("div[id^='" + nameOther + "']").find("input[type='text'], textarea").each(function() {
			$(this).hide();
			if ($(this).val() == ""){
				$(this).val("none");
			}
		});

		$("#" + ques + "_div").find("input[type='checkbox'], input[type='radio']").each(function(i, answ) {
			showOrHideOther2(answ);
		});
		
		SSI_CustomGraphicalCheckbox = function(graphicalObj, inputObj, bln){
				inputChanged(graphicalObj, inputObj, bln)
			};
		SSI_CustomGraphicalRadiobox = function(graphicalObj, inputObj, bln){
				inputChanged(graphicalObj, inputObj, bln)
			};
		function inputChanged (graphicalObj, inputObj, bln) {
			console.log(inputObj.id, bln)
			var reg = new RegExp(ques + "_.+");
			if (reg.test(inputObj.id)){
				showOrHideOther2(inputObj);
			}
		}

		function showOrHideOther2(answ){
			var id, r, c, rad, chb, elOther;
			id = $(answ).attr('id');
			if ($(answ).attr('type') == "checkbox"){
				r = id.split('_')[1].replace("r", "");
				c = id.split('_')[2].replace("c", "");
				chb = "#" + ques + "_r" + other + "_c" + c;
				elOther = $(chb);
			}else{
				r = id.split('_')[2];
				c = id.split('_')[1].replace("c", "");
				rad = "#" + ques + "_c" + c + "_" + other;
				elOther = $(rad);
			}
			if (elOther.prop("checked")){
				if (r == other){
					$("#" + nameOther + "_div").show();
					$("#" + nameOther + "_r1_c" + c).show();
					if ($("#" + nameOther + "_r1_c" + c).val() == "none"){
						$("#" + nameOther + "_r1_c" + c).val("");
					}
				}
			}else{
				$("#" + nameOther + "_r1_c" + c).hide();
				$("#" + nameOther + "_r1_c" + c).val("none");
			}
			if ($("#" + nameOther + "_div").find("input[type='text'], textarea").not(":hidden").length == 0){
				$("#" + nameOther + "_div").hide();
			}
		}
	}
}

function otherByRowsInTable(opts){

    checkArguments(arguments, opts);
    var ques = opts.ques;
    
	if (opts.other === undefined || opts.other === ""){
		throw "Номер столбца-уточнения не задан или является пустой строкой!"
	}
	switch (Object.prototype.toString.call(opts.other)){
		case "[object Number]":
            var other = opts.other.toString();
			break;
		case "[object String]":
		default:
			throw "Номер столбца-уточнения `other` должен быть числом!"
	}
	var nameOther = opts.nameOther === undefined ? ques+"other" : opts.nameOther;
	if (nameOther.toString() !== nameOther || nameOther === ""){
		throw "Переменная nameOther должна быть строкой и \nсодержать в себе общую часть имени вопросов-уточнения!";
	}

	$("div[id^='" + nameOther + "']").find("input[type='text'], textarea").each(function() {
		$(this).parents("tr:first").hide();
		if ($(this).val() == ""){
			$(this).val("none");
		}
	});

	$("#" + ques + "_div").find("input[type='checkbox'], input[type='radio']").each(function(i, answ) {
		showOrHideOther(answ);
    });
    
	SSI_CustomGraphicalCheckbox = function(graphicalObj, inputObj, bln){
			inputChanged(graphicalObj, inputObj, bln)
		};
	SSI_CustomGraphicalRadiobox = function(graphicalObj, inputObj, bln){
			inputChanged(graphicalObj, inputObj, bln)
		};
	function inputChanged (graphicalObj, inputObj, bln) {
        var reg = new RegExp(ques + "_.+");
        if (reg.test(inputObj.id)){
            showOrHideOther(inputObj);
        }
    }

	function showOrHideOther(answ){
		var id, r, c, rad, chb, elOther;
		id = $(answ).attr('id');
		r = id.split('_')[1].replace("r", "");
		c = id.split('_')[2].replace("c", "");
		chb = "#" + ques + "_r" + r + "_c" + other;
		rad = "#" + ques + "_r" + r + "_" + other;
		elOther = $(chb).add(rad);
		if (elOther.prop("checked")){
			if (c == other){
				$("#" + nameOther + "_div").show();
				$("#" + nameOther + "_r" + r + "_c1").parents("tr:first").show();
				if ($("#" + nameOther + "_r" + r + "_c1").val() == "none"){
					$("#" + nameOther + "_r" + r + "_c1").val("");
				}
			}
		}else{
			$("#" + nameOther + "_r" + r + "_c1").parents("tr:first").hide();
			$("#" + nameOther + "_r" + r + "_c1").val("none");
		}
		if ($("#" + nameOther + "_div").find("input[type='text'], textarea").not(":hidden").length == 0){
			$("#" + nameOther + "_div").hide();
		}
	}
}

function listFilter(opts){
	checkArguments(arguments, opts);
	var ques = opts.ques + "_div";

	if (!$("#" + ques).find("[type='radio']").length){
		throw "Вопрос " + ques + " должен быть типа Select Radio."
	}
	if (opts.alwaysShow === undefined){
		var alwaysShow = +$("#" + ques).find("[type='radio']:last").attr("id").split("_")[1];
	}else{
		alwaysShow = opts.alwaysShow;
	}
	if (alwaysShow === null) alwaysShow=0;
	
	if (Object.prototype.toString.call(alwaysShow) == "[object Number]"){
		alwaysShow = [alwaysShow];
	}
	if (Object.prototype.toString.call(alwaysShow) != "[object Array]"){
		throw "Свойство alwaysShow должно быть числом или массивом!"
	}
	
	var maxRows = opts.maxRows === undefined ? 10 : opts.maxRows;
	if (Object.prototype.toString.call(maxRows) != "[object Number]"){
		throw "Свойство maxRows должно быть числом!"
	}

	$("#" + ques).find(".question_body").prepend("<div class='listFilter-bl-input'></div>");
	$("#" + ques).find(".listFilter-bl-input").prepend("<input type='text' id='filter_input_" + ques + "'>");
	var $inp = $("#filter_input_" + ques);
	$("#" + ques).find(".inner_table>tbody>tr>td>table").addClass("listFilter-table");
	
	var $tbl = $("#" + ques).find(".listFilter-table");
	
	$("#" + ques).find("[id$=_other]").each(function(){
		var dbl = $(this).clone();
		var id = $(this).attr("id").replace("_other", "");
		$("label[for='" + id + "']").append(dbl);
		$(this).remove();
	});
	
	
	$(window).on("resize", function(){
		$(".listFilter-bl-input").css("width", $(".clickable:visible").outerWidth()+15+"px")
	})
	
	$(window).on("load", function(){
		$("body").css({"cursor": "default", "visibility": "visible"});
		$tbl.css("max-height", $tbl.find("tr:first").height()*maxRows);

		$(".header1, .header2, .inner_table, .question")
			.css("visibility", "visible");
		$(window).resize();
	});
	
	$inp.on('keyup', function(){
		var val = $(this).val();
		
		$("#" + ques + " label").each(function(){
			var reg = new RegExp('\.*' + val + '.*', 'i');
			var id = $(this).attr("for");
			var r = +id.split("_")[1];
			
			if (reg.test($(this).text()) || $("#" + id).prop("checked") || alwaysShow.indexOf(r) != -1){
				$(this).parents("tr:eq(0)").show()
			}else{
				$(this).parents("tr:eq(0)").hide()
			}
			
			reg = new RegExp('\^' + val + '$', 'i');
			if (reg.test($(this).text().trim())) {
				SSI_SetSelect(id, true)
			}
		});
	});
	
	SSI_CustomGraphicalRadiobox = function(GraphicalCheckboxObj, inputObj, bln){
		var q = inputObj.id.split("_")[0]
		if (q == ques.replace("_div", "")){
			if($("#"+inputObj.id+"_other").length == 0){
				$inp.val($("#" + ques + " label[for='" + inputObj.id + "']").text());
			}
		}
	}
	$("#" + ques + " [id$='_other']").on("keyup", function(){
		$inp.val($(this).val())
	});
}

function createRank(ques){
	
	if ($("#"+ques+"_div").length == 0){
		throw "Вопрос " + opts.ques + " не найден на странице."
	}
	
	$("#"+ques + "_div .inner_table").removeAttr("border")
	$("#"+ques + "_div .inner_table").prepend("<div class='create_rank_main'></div>")
	$("#"+ques + "_div .create_rank_main").append("<div id='"+ques+"_rankList_left' class='create_rank left'></div>");
	var blLeft = $("#" + ques + "_rankList_left");
	$("#"+ques + "_div .create_rank_main").append("<div id='"+ques+"_rankList_right' class='create_rank right'></div>");
	var blRight = $("#" + ques + "_rankList_right");
	
	if ('onpageshow' in window) {
		window.addEventListener('pageshow', on_load, false);
	} else {
		window.addEventListener('load', on_load, false);
	}
	$("#"+ques + "_div .inner_table .column_header_row").hide()
	
	function on_load(){
		$("#"+ques+"_div").find(".options, .row_label_cell .grid_options").sort(function(a, b){
			var inp1 = $(a).parents("tr:first").find("[type='tel']"),
				inp2 = $(b).parents("tr:first").find("[type='tel']");
			if (+inp1.val() > +inp2.val()) return 1; // если первое значение больше второго
			if (+inp1.val() == +inp2.val()) return 0; // если равны
			if (+inp1.val() < +inp2.val()) return -1; // если первое значение меньше второго
		}).each(function(){
			var row = $(this).clone();
			var inp = $(this).parents("tr:first").find("[type='tel']");
			var id = inp.attr("id");
			
			if (inp.val() != ""){
				blRight.append(row);
			}else{
				blLeft.append(row);
			}
			
			row.attr("data-id", id);
			
			var oth = row.find("[id$='_other']");
			if (oth.length){
				var id = oth.attr("id");
				oth.attr("data-id", id).removeAttr("id").removeAttr("name");
				row.find("[type='hidden']").remove();
				
				oth.keyup(function(){
					var id = $(this).data("id");
					$("#"+id).val($(this).val())
				})
			}
			
			$(this).parents("tr:first").hide()
		})
	}
	
	
	var options = {
		group: 'shared',
		animation: 250,
		onEnd: function () {
			$("#"+ques+"_div [type='tel']").filter("[id]").not("[id$='_other']").val("");
			blRight.find(".options, .grid_options").each(function(i, e){
				var id = $(this).data("id");
				$("#"+ques+"_div").find("[id='"+id+"']").val(++i);
				
				if ($(this).find(".num").length) {
					$(this).find(".num").text("("+i+")")
				}else{
					$(this).prepend("<span class='num'>("+i+")</span>");
				}
				
				var oth = $(this).find("[data-id$='_other']");
				if (oth.length){
					id = oth.data("id");
					$("#"+ques+"_div").find("[id='"+id+"']").val(oth.val());
					if (oth.val() == ""){
						alert("Впишите ответ в вариант Другое")
						oth.focus()
					}
				}
			})
			blLeft.find(".options, .grid_options").each(function(i, e){
				$(this).find(".num").remove()
			})
		}
	};
	
	
	Sortable.create(blLeft[0], options);
	Sortable.create(blRight[0], options);
	
	var h = Math.max($("#"+ques+"_div .create_rank.left").height(), $("#"+ques+"_div .create_rank.right").height());
	$("#"+ques+"_div .create_rank").css("min-height", (h+20)+"px");
	$(window).resize(function(){
		$("#"+ques+"_div .create_rank").removeAttr("style");
		var h = Math.max($("#"+ques+"_div .create_rank.left").height(), $("#"+ques+"_div .create_rank.right").height());
		$("#"+ques+"_div .create_rank").css("min-height", (h+20)+"px");
	})
}

function tdOnClick() {
	var grid = $(".grid").filter(function(){return $(this).is(".tdOnClick_off") ==false});
	if (grid.length){
		var radio = grid.find("[type='radio']");
		if (radio.length){
			SSI_CustomGraphicalRadiobox = function(graphicalObj, inputObj){
				var q = inputObj.id.split("_")[0] + "_div"
				if ($("#" + q).is(":not(.tdOnClick_off)")){
					$("#" + q).find("td.input_cell.clickable").removeClass("tdOnClick_selected")
					$("#" + q).find("td.input_cell.clickable").each(function(){
						if ($(this).find("[type=radio]:checked").length && $(this).find(".graphical_select:visible").length){
							$(this).addClass("tdOnClick_selected")
						}
					})
				}
			};
		}
		var chb = grid.find("[type='checkbox']");
		if (chb.length){
			SSI_CustomGraphicalCheckbox = function(graphicalObj, inputObj, bln){
				var q = inputObj.id.split("_")[0] + "_div"
				if ($("#" + q).is(":not(.tdOnClick_off)")){
					$("#" + q).find("td.input_cell.clickable").removeClass("tdOnClick_selected")
					$("#" + q).find("td.input_cell.clickable").each(function(){
						if ($(this).find("[type=checkbox]:checked").length && $(this).find(".graphical_select:visible").length){
							$(this).addClass("tdOnClick_selected")
						}
					})
				}
			};
		}
	}
}

function changeConstantSumOrExclusive (opts){
	checkArguments(arguments, opts);
	var ques = opts.ques;

	var quesDirection = opts.answLocation === undefined ? "inColumns" : opts.answLocation;
	if (quesDirection != "inRows" && quesDirection != "inColumns"){
		throw "answLocation может принимать одно из значений: 'inRows' или 'inColumns'."
	}
	
	var excl, inps, chb;
	
	if (opts.exclusive !== undefined){
		excl = opts.exclusive;
	}else{
		var max = 0;
		if (quesDirection == "inColumns"){
			$("#" + ques + "_div [type='tel']").each(function(i, e){
				var ind = +e.id.split("_")[1].replace("r", "");
				if (ind > max) max = ind;
			});
		}else{
			$("#" + ques + "_div [type='tel']").each(function(i, e){
			  var ind = +e.id.split("_")[2].replace("c", "");
			  if (ind > max) max = ind;
			});
		}
		excl = max;
	}
	if (Object.prototype.toString.call(excl) != "[object Number]"){
		throw "Свойство exclusive должно быть числом!";
	}
	
	var inputs = opts.inputs === undefined ? [1, excl-1].fillRange() : opts.inputs;
	
	if (Object.prototype.toString.call(inputs) == "[object Number]"){
		inputs = [inputs];
	}
	
	var exclText = opts.exclusiveText === undefined ? "&nbsp;<i>Затрудняюсь ответить</i>" : opts.exclusiveText;
	var total = opts.totalValue === undefined ? [100] : opts.totalValue;
	
	if (Object.prototype.toString.call(total) != "[object Number]" && Object.prototype.toString.call(total) != "[object Array]"){
		throw "Свойство totalValue должно быть числом или массивом!";
	}
	
	if (Object.prototype.toString.call(total) == "[object Number]"){
		total = [total];
	}
			
	if (quesDirection == "inRows"){

		$("[type='tel'][id^='" + ques + "_r'][id$='_c" + excl + "']").each(function(){
			$(this).parents("td:eq(1)").addClass("clickable")
		})	
		$("[type='tel'][id^='" + ques + "_r'][id$='_c" + excl + "']").each(function(){
			$(this).before("<input type=checkbox id=" + this.id + "_excl" + " class='HideElement'/>" +
				"<div id=" + this.id + "_excl_graphical" + " class='graphical_select checkbox'></div>");
			
			$(this).parent().next().find(".grid_cell_text").html(exclText)
		})

		$("[type='tel'][id^='" + ques + "_r'][id$='_c" + excl + "']").hide().attr("type", "hidden");
		chb = $("#" + ques + "_div [type='checkbox'][id$='_c" + excl + "_excl']");
		
		if (total.length == 1){
			chb.each(function(){
				var r = +this.id.split("_")[1].replace("r", "");
				total[r - 1] = total[0];
			})
		}
		if (total.length < chb.length){
			throw "Размерность массива totalValue должна совпадать с кол-ом строк в вопросе!";
		}

		inps = $();
		$.each(inputs, function(i, e){
			inps = inps.add("#" + ques + "_div [type='tel'][id$='_c" + e + "']");
		});
		
		$(window).on("load", function(){
			chb.each(function(){
				var r = this.id.split("_")[1].replace("r", "");
				if ($("#" + ques + "_r" + r + "_c" + excl).val() == total[r-1]) SSI_SetSelect(this.id, true);
			})
		})

		SSI_CustomGraphicalCheckbox = function(GraphicalCheckboxObj, inputObj, bln){
			if(bln){
				var r = inputObj.id.split("_")[1].replace("r", "");
				
				inps.filter(function(i, e){
					return e.id.split("_")[1].replace("r", "")	== r;
				}).val("");
				chb.filter(function(i, e){
					return e.id.split("_")[1].replace("r", "")	== r;
				}).not(inputObj).get().forEach(function(chb){
					SSI_SetSelect(chb.id, 0)
				})

				$("#"+inputObj.id.replace("_excl", "")).val(total[r-1]);
				$("#"+ques+"_r" + r + "_c_total").val("")
			}else{
				$("#"+inputObj.id.replace("_excl", "")).val("");
			}
		}

		inps.on("keyup", function(){
			if($(this).val() != ""){
				var r = this.id.split("_")[1].replace("r", "");
				chb.filter(function(i, e){
					return e.id.split("_")[1].replace("r", "")	== r;
				}).get().forEach(function(chb){
					SSI_SetSelect(chb.id, 0)
					$("#"+chb.id.replace("_excl", "")).val(0);
				})
			}
		});
	}else{
		$("[type='tel'][id^='" + ques + "_r" + excl + "_c']").each(function(){
			$(this).parents("td:eq(1)").addClass("clickable")
		})	
		$("[type='tel'][id^='" + ques + "_r" + excl + "_c']").each(function(){
			$(this).before("<input type=checkbox id=" + this.id + "_excl" + " class='HideElement'/>" +
				"<div id=" + this.id + "_excl_graphical" + " class='graphical_select checkbox'></div>");
			
			$(this).parent().next().find(".grid_cell_text").html(exclText)
		})	
		$("[type='tel'][id^='" + ques + "_r" + excl + "_c']").hide().attr("type", "hidden");
		chb = $("[type='checkbox'][id^='" + ques + "_r" + excl + "_c']");

		if (total.length == 1){
			chb.each(function(){
				var c = this.id.split("_")[2].replace("c", "");
				total[c - 1] = total[0];
			})
		}
		if (total.length < chb.length){
			throw "Размерность массива totalValue должна совпадать с кол-ом столбцов в вопросе!";
		}
	
		inps = $();
		$.each(inputs, function(i, e){
			inps = inps.add("[type='tel'][id^='" + ques + "_r" + e + "_c']");
		});
		if ($("[id^='" + ques + "_r'][id$='_other']").length>0){
			if (total.length == 1) var other = $("[id^='" + ques + "_r'][id$='_other']");
		}
		
		$(window).on("load", function(){
			chb.each(function(){
				var c = this.id.split("_")[2].replace("c", "");
				if ($("#" + ques + "_r" + excl + "_c" + c).val() == total[c-1]) SSI_SetSelect(this.id, true);
			})
		})
		
		SSI_CustomGraphicalCheckbox = function(GraphicalCheckboxObj, inputObj, bln){
			if(bln){
				c = inputObj.id.split("_")[2].replace("c", "");
				
				inps.filter(function(i, e){
					return e.id.split("_")[2].replace("c", "")	== c;
				}).val("");
				chb.filter(function(i, e){
					return e.id.split("_")[2].replace("c", "")	== c;
				}).not(inputObj).get().forEach(function(chb){
					SSI_SetSelect(chb.id, 0)
				})
				
				if(other) other.val("");
				$("#"+inputObj.id.replace("_excl", "")).val(total[c-1]);
				$("#"+ques+"_r_total_c"+c).val("")
			}else{
				$("#"+inputObj.id.replace("_excl", "")).val("");
			}
		}

		inps.on("keyup", function(){
			if($(this).val() != ""){
				var c = this.id.split("_")[2].replace("c", "");
				chb.filter(function(i, e){
					return e.id.split("_")[2].replace("c", "")	== c;
				}).get().forEach(function(chb){
					SSI_SetSelect(chb.id, 0)
					$("#"+chb.id.replace("_excl", "")).val(0);
				})
			}
		});

		if(other) {
			other.on("keyup", function(){
				if($(this).val() != ""){
					chb.get().forEach(function(chb){
						SSI_SetSelect(chb.id, 0)
						$("#"+chb.id.replace("_excl", "")).val(0);
					})
				}
			});
		}
	}
}

//Полифиллы, расширения
Array.prototype.fillRange = function(){
	try{
		if (this.length < 2) {
		  throw new TypeError('Array.fillRange: Длина массива не может быть меньше 2!');
		}
		var min = +this[0], max = +this[1];
		var k=0, res=[];
		for (var i = min; i <= max; i++){
			res[k] = i;
			k++
		}
		if (this.length > 2){
			for (i = 2; i < this.length; i++){
				res.push(+this[i]);
			}
		}
		return res;
	}catch(err){
		if(window.console){
			console.error(err.message)
		}else{
			alert(err.message);
		}
	}
};