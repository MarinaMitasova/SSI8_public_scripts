# Библиотека js-функций и вопросов для SSI v8

# Подключение 
`<script src="https://marsurvey.ru/public_scripts/custom_scripts_ssi8-1.0.js"></script>`

# Содержание
[Функции в custom_scripts_ssi8.js](#custom_scripts_ssi8_js)  
* [changeInputTextOrExclusive](#changeInputTextOrExclusive)
* [checkInputTextOrExclusive](#checkInputTextOrExclusive)
* [otherByColumnsInTable](#otherByColumnsInTable)  
* [otherByRowsInTable](#otherByRowsInTable) 
* [listFilter](#listFilter) 
* [createRank](#createRank) 
* [tdOnClick](#tdOnClick)
* [changeConstantSumOrExclusive](#changeConstantSumOrExclusive)

## Функции в custom_scripts_ssi8.js (последняя версия custom_scripts_ssi8-1.0.js)<a name="custom_scripts_ssi8_js"></a>

### changeInputTextOrExclusive(opts)<a name="changeInputTextOrExclusive"></a>

Очищает ответы по строке/столбцу для вопросов, содержащих числовые/текстовые поля и/или галочки exclusive (з/о)

**Особенности работы функции:**

* Аргументы задаются в виде объекта
* В качестве числовых/текстовых ответов могут выступать поля numeric или open-end (включая многострочные textarea)
* ___Не работает для нескольких таких вопросов на странице___

**Свойства объекта-аргумента**

*ques* (обязательный) – имя вопроса  
*answLocation* (default:="inColumns") – расположение ответов в таблице. inRows – требуется дать ответ по строкам, inColumns – требуется дать ответ по столбцам

**Примеры:**
```html
<script>
$(function(){
	changeInputTextOrExclusive({ques: "[%QUESTIONNAME()%]"});
})
</script>
```

```html
<script>
$(function(){
	changeInputTextOrExclusive({ques: "[%QUESTIONNAME()%]", answLocation: "inRows"});
})
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

### listFilter(opts)<a name="listFilter"></a>

Фильтрация закрытого списка по совпадению с введенной подстрокой.

**Особенности работы функции:**

* Аргументы задаются в виде объекта
* Работает на вопросе типа **Select Radio**
* Для корректного отображения таблицы с ответами и текстового поля необходимо подключить CSS-файл listFilter.css

**Свойства объекта-аргумента**

*ques* (обязательный) – имя вопроса  
*alwaysShow* (default:=номер последней строки в вопросе) – номер/массив номеров строк, которые нужно показывать всегда (напр. вариант Другое или З/о). Если обязательных для показа вариантов ответа нет, установите параметр `alwaysShow: null`  
*maxRows* (default:=10) – высота блока с ответами в строках. Т.е., если в вопросе больше 10 вариантов ответа, будут показаны первые 10 подходящих под фильтр

**Примеры:**
```html
<link rel="stylesheet" type="text/css" href="https://www.marsurvey.ru/public_scripts/listFilter.css">
<script>
listFilter({ques: "[%QUESTIONNAME()%]"});
</script>
```

```html
<link rel="stylesheet" type="text/css" href="https://www.marsurvey.ru/public_scripts/listFilter.css">
<script>
var q = {
	ques: "[%QUESTIONNAME()%]",
	maxRows: 15,
	alwaysShow: [15, 27, 84]
};

listFilter(q);
</script>
```

### createRank(ques)<a name="createRank"></a>

Создает вопрос типа Ranking в виде перетаскиваемых вариантов ответа.

**Особенности работы функции:**

* Работает на вопросах типа Ranking и типа Grid, где столбец имеет тип Ranking или строки типа numeric
* Для вопроса типа Grid необходимо расположить метки строк справа от инпутов (Position Row labels on the Right)
* Функция не содержит никаких проверок, поэтому, тип вопроса следует выбирать, основываясь на требуемый анкетой функционал (напр. необязательные варианты Другое)
* Следует вручную изменить текст ошибки на вкладке Error Mesage (Напр. "Перенесите в соседнее окошко [%ErrTotal()%] варианта(ов).")
* Для работы скрипта необходимо подключить библиотеку Sortable.js и файл-CSS createRank.css

**Свойства объекта-аргумента**

*ques* (обязательный) – имя вопроса  

**Примеры:**
```html
<!--подключение скрипта Sortable и css-->
<link rel="stylesheet" type="text/css" href="https://marsurvey.ru/public_scripts/createRank.css">
<script src="https://marsurvey.ru/public_scripts/Sortable.js"></script>
<script>
createRank("[%QUESTIONNAME()%]");
</script>
```

### tdOnClick()<a name="tdOnClick"></a>

Подсвечивает ячейку таблицы при выборе ответа.

**Особенности работы функции:**

* Работает на вопросах типа Grid с ответами типа checkBox, radio
* Работает для всех вопросов типа .grid на странице. Если для какого-то вопроса нужно отключить эту функцию, необходимо на блок вопроса (id = "[%QUESTIONNAME()%]_div") повесить класс "tdOnClick_off".
* За цвет заливки ячеек отвечает класс tdOnClick_selected
* Рекомендуется подключить функцию глобально (вкладка Headers and footers в настройках анкеты)

**Примеры:**
```js
tdOnClick()
```

### changeConstantSumOrExclusive(opts)<a name="changeConstantSumOrExclusive"></a>

Замена текстового поля "Затрудняюсь ответить" на чекбокс в вопросах типа Сonstant Sum (__Grid__, где строки/столбцы типа Сonstant Sum)

**Особенности работы функции:**

* Аргументы задаются в виде объекта
* ___Не работает для нескольких таких вопросов на странице___

**Свойства объекта-аргумента**

*ques* (обязательный) – имя вопроса  
*answLocation* (default:="inColumns") – расположение ответов в таблице. inRows – требуется дать ответ по строкам, inColumns – требуется дать ответ по столбцам
*exclusive* (default:=номер последней строки/столбца таблицы) – номер строки/столбца для ответа "Затрудняюсь ответить"
*inputs* (default:=номера с 1-го до exclusive-1) – номера строк/столбцов с инпутами
*totalValue* (default:=100) – сумма всех ответов на вопрос (строку/столбец). totalValue может быть числом (в таком случае, сумма ответов по все строкам / столбцам должна быть равна этому числу) или массивом чисел, если строки/столбцы таблицы должны сводиться в разные значения.
*exclusiveText* (default:="&nbsp;<i>Затрудняюсь ответить</i>") – подпись для чекбокса с З/о

**Примеры:**
```html
<script>
$(function(){
	changeConstantSumOrExclusive({ques: "[%QUESTIONNAME()%]"});
});
</script>
```

```html
<script>
$(function(){
	var q2 = {
		ques: "[%QUESTIONNAME()%]",
		answLocation: "inRows",
		exclusive: 1,
		inputs: [2, 3, 4],
		totalValue: [25, 50, 112],
		exclusiveText: "<b>Не наблюдаю таких пациентов</b>"
	}	

	changeConstantSumOrExclusive(q2);
})
</script>
```