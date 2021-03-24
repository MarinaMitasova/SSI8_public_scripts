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
		$(".listFilter-bl-input").css("width", $(".clickable").outerWidth()+15+"px")
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