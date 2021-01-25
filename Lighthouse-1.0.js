function changeInputTextOrExclusive(opts){

    //ques:  - Обязательный
    //answLocation: default="inColumns"
	
	if (arguments.length == 0 || opts === undefined){throw "Функция должна принимать один аргумент в виде объекта."}
	if (arguments.length > 1){throw "Ошибка:\nСлишком много арументов для данной функции! \nФункция должна принимать только один аргумент в виде объекта."}
	var ques = opts.ques;
	if (ques === undefined){throw "Не задано имя вопроса `ques`!"}
	if ($("#"+ques+"_div").length == 0){throw "Вопрос " + ques + " не найден на странице."}

	var quesDirection = opts.answLocation === undefined ? "inColumns" : opts.answLocation;
	if (quesDirection != "inRows" && quesDirection != "inColumns"){
		throw "answLocation может принимать одно из значений: 'inRows' или 'inColumns'."
	}
	
	var inputs = $("#"+ques+"_div").find("[type='text'], textarea").not("[id$='_other']");
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
	
	$(document).on('lighthouseCheckboxChanged', function(event, graphicalObj, inputObj, bln) {
		if(bln){
			if (quesDirection == "inRows"){
				x = inputObj.id.split("_")[1].replace("r", "");
			}else{
				x = inputObj.id.split("_")[2].replace("c", "");
			}
			
			arr[x].inps.val("")
			arr[x].chb.not(inputObj).prop("checked", false);
			
			if(quesDirection == "inColumns" && other.length) other.val("");
		}
	})
	
	inputs.on("keyup", function(){
		if($(this).val() != ""){
			if (quesDirection == "inRows"){
				x = this.id.split("_")[1].replace("r", "");
			}else{
				x = this.id.split("_")[2].replace("c", "");
			}
			
			arr[x].chb.prop("checked", false);
			
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

	if (arguments.length == 0 || opts === undefined){throw "Функция должна принимать один аргумент в виде объекта."}
	if (arguments.length > 1){throw "Ошибка:\nСлишком много арументов для данной функции! \nФункция должна принимать только один аргумент в виде объекта."}
	var ques = opts.ques;
	if (ques === undefined){throw "Не задано имя вопроса `ques`!"}
	if ($("#"+ques+"_div").length == 0){throw "Вопрос " + ques + " не найден на странице."}
	
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
	
	var inputs = $("#"+ques+"_div").find("[type='text'], textarea").not("[id$='_other']");
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
	
	var err = '';
	$.each(arr, function(i, obj){
		if (opts.continueIf(obj.inps, obj.chb, i) != true){
			err = opts.continueIf(obj.inps, obj.chb, i);
			return false;
		}
	})
	
	return err;
}
