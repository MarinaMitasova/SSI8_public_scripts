# Библиотека js-функций и вопросов для SSI v8

# Подключение 
`<script src="https://marsurvey.ru/public_scripts/custom_scripts_ssi8-1.0.js"></script>`

# Содержание
[Функции в custom_scripts_ssi8.js](#custom_scripts_ssi8_js)  
* [changeInputTextOrExclusive](#changeInputTextOrExclusive)
* [checkInputTextOrExclusive](#checkInputTextOrExclusive)
* [otherByColumnsInTable](#otherByColumnsInTable)  
* [otherByRowsInTable](#otherByRowsInTable) 

[Шаблоны вопросов Libraries_ques](#Libraries_ques) 
* [City](#City)

## Функции в custom_scripts_ssi8.js (последняя версия custom_scripts_ssi8-1.0.js)<a name="custom_scripts_ssi8_js"></a>

### changeInputTextOrExclusive(opts)<a name="changeInputTextOrExclusive"></a>

Очищает ответы по строке/столбцу для вопросов, содержащих числовые/текстовые поля и/или галочки exclusive (з/о)

**Особенности работы функции:**

* Аргументы задаются в виде объекта
* В качестве числовых/текстовых ответов могут выступать поля numeric или open-end (включая многострочные textarea)

**Свойства объекта-аргумента**

*ques* (обязательный) – имя вопроса  
*answLocation* (default:="inColumns") – расположение ответов в таблице. inRows – требуется дать ответ по строкам, inColumns – требуется дать ответ по столбцам

**Примеры:**
```html
<script>
$(function(){
	changeInputTextOrExclusive({ques: "[%QUESTIONNAME()%]"});
});
</script>
```

```html
<script>
$(function(){
	changeInputTextOrExclusive({ques: "[%QUESTIONNAME()%]", answLocation: "inRows"});
});
</script>
```

### checkInputTextOrExclusive(opts)<a name="checkInputTextOrExclusive"></a>

Проверка наличия ответа в строке/столбце для вопросов, содержащих числовые/текстовые поля и/или галочки exclusive (з/о)

**Особенности работы функции:**

* Аргументы задаются в виде объекта
* В качестве числовых/текстовых ответов могут выступать поля numeric или open-end (включая многострочные textarea)

**Свойства объекта-аргумента**

*ques* (обязательный) – имя вопроса  
*answLocation* (default:="inColumns") – расположение ответов в таблице. inRows – требуется дать ответ по строкам, inColumns – требуется дать ответ по столбцам  
*inputsCheck* (default:= "some") – Параметр, указывающий на режим проверки ответа в инпутах по строке/столбцу. some - ответ должен быть хотя бы в одном инпуте, every - ответ должен быть во всех инпутах.

Метод *continueIf* - доступен для переопределения (без описания, вряд ли понадобится)

**Примеры:**
```js
//вкладка Custom JavaScript Verification

strErrorMessage = checkInputTextOrExclusive({ques: "[%QUESTIONNAME()%]"});
strErrorMessage = checkInputTextOrExclusive({ques: "[%QUESTIONNAME()%]", answLocation: "inRows", inputsCheck: "every"});
```

### otherByColumnsInTable(opts)<a name="otherByColumnsInTable"></a>

Всплывающее уточнение для Другого по столбцам (Уточнения для Другого в таблице)

**Особенности работы функции:**

* Аргументы задаются в виде объекта
* Работает на вопросах типа grid (checkbox, radio)

**Свойства объекта-аргумента**

*ques* (обязательный) – имя вопроса  
*other* (обязательный) – номер строки “Другое”  
*nameOther* (default:=ques+"other") – общая часть имени вопросов для уточнения  
*otherLocation*(default:="inColumns") – расположение полей для уточнения. inRows - уточнения расположены в строках, inColumns - уточнения расположены в столбцах

**Примеры:**
```html
<script>
$(function(){
	var q = {
		ques: "[%QUESTIONNAME()%]",
		other: 5
	};
	otherByColumnsInTable(q);
})
</script>
```

```html
<script>
$(function(){
	var q = {
		ques: "[%QUESTIONNAME()%]",
		other: 5,
		nameOther: "[%QUESTIONNAME()%]Comm",
		otherLocation: "inRows"
	};
	otherByColumnsInTable(q);
})
</script>
```

### otherByRowsInTable(opts)<a name="otherByRowsInTable"></a>

Всплывающее уточнение для Другого по строкам (Уточнения для Другого в таблице)

**Особенности работы функции:**

* Аргументы задаются в виде объекта
* Работает на вопросах типа grid (checkbox, radio)

**Свойства объекта-аргумента**

*ques* (обязательный) – имя вопроса  
*other* (обязательный) – номер строки “Другое”  
*nameOther* (default:=ques+"other") – общая часть имени вопросов для уточнения  

**Примеры:**
```html
<script>
$(function(){
	var q = {
		ques: "[%QUESTIONNAME()%]",
		other: 5
	};
	otherByRowsInTable(q);
})
</script>
```

```html
<script>
$(function(){
	var q = {
		ques: "[%QUESTIONNAME()%]",
		other: 5,
		nameOther: "[%QUESTIONNAME()%]Comm"
	};
	otherByRowsInTable(q);
})
</script>
```

## Шаблоны вопросов Libraries_ques<a name="Libraries_ques"></a>

### City<a name="City"></a>

Выпадающий список с фильтрацией при вводе текста.
В строке ```	var other = [85];``` указать актуальные номера вариантов для уточнения.
