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
* [existAnswerForOtherSpecify](#existAnswerForOtherSpecify)  
* [prescriptFunnel, prescriptFunnelNoPrescribing](#prescriptFunnel)  
* [starRating](#starRating)  
* [checkAnswerInTable](#checkAnswerInTable)  
* [createSlider](#createSlider)  

[Расширения в custom_scripts_ssi8.js](#custom_scripts_ssi8_Extensions) 
* [fillRange](#fillRange)

## Функции в custom_scripts_ssi8.js (последняя версия custom_scripts_ssi8-1.0.js)<a name="custom_scripts_ssi8_js"></a>

### changeInputTextOrExclusive(opts)<a name="changeInputTextOrExclusive"></a>

Очищает ответы по строке/столбцу для вопросов, содержащих числовые/текстовые поля и/или галочки exclusive (з/о)

**Особенности работы функции:**

* Аргументы задаются в виде объекта
* В качестве числовых/текстовых ответов могут выступать поля numeric или open-end (включая многострочные textarea)
* ___Не работает, если на странице несколько обработчиков SSI_CustomGraphicalCheckbox (запускается последний)___

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
* ___Не работает, если на странице несколько обработчиков SSI_CustomGraphicalCheckbox / SSI_CustomGraphicalRadiobox (запускаются последние)___

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
* ___Не работает, если на странице несколько обработчиков SSI_CustomGraphicalCheckbox / SSI_CustomGraphicalRadiobox (запускаются последние)___

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
* ___Не работает, если на странице несколько обработчиков SSI_CustomGraphicalCheckbox (запускается последний)___

**Свойства объекта-аргумента**

*ques* (обязательный) – имя вопроса  
*answLocation* (default:="inColumns") – расположение ответов в таблице. inRows – требуется дать ответ по строкам, inColumns – требуется дать ответ по столбцам  
*exclusive* (default:=номер последней строки/столбца таблицы) – номер строки/столбца для ответа "Затрудняюсь ответить"  
*inputs* (default:=номера с 1-го до exclusive-1) – номера строк/столбцов с инпутами  
*totalValue* (default:=100) – сумма всех ответов на вопрос (строку/столбец). totalValue может быть числом (в таком случае, сумма ответов по все строкам / столбцам должна быть равна этому числу) или массивом чисел, если строки/столбцы таблицы должны сводиться в разные значения.  
*exclusiveText* (default:=`"&nbsp;<i>Затрудняюсь ответить</i>"`) – подпись для чекбокса с З/о

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

### existAnswerForOtherSpecify(ques)<a name="existAnswerForOtherSpecify"></a>

Проверяет наличие ответа для строк с уточнениями.

**Особенности работы функции:**

* Работает на вопросах типа grid (checkbox, radio, numeric/text, combobox)

**Аргументы**

*ques* (обязательный) – имя вопроса  

**Примеры:**
```js
//вкладка Custom JavaScript Verification

strErrorMessage = existAnswerForOtherSpecify("[%QUESTIONNAME()%]");
```

### prescriptFunnel(ques)<a name="prescriptFunnel"></a>

Для вопросов по воронке назначений. При выборе ответа в столбцах "Назначаю регулярно" / "Назначаю чаще всего", ставит автоматом ответ в "Есть опыт назначения" / "Назначаю регулярно".  
Снимает ответы, "Назначаю регулярно" / "Назначаю чаще всего" при снятии галочки с "Есть опыт назначения" / "Назначаю регулярно".  

**Особенности работы функции:**

* Столбец "Нет опыта назначения" можно не добавлять, вызов функции от этого не зависит.

**Аргументы**

*ques* (обязательный) – имя вопроса  

### prescriptFunnelNoPrescribing(ques)

Для вопросов по воронке назначений __со столбцом "Нет опыта назначения"__. Проверка наличия ответа в строке/столбце.

**Аргументы**

*ques* (обязательный) – имя вопроса  

**Примеры:**
```html
<script>
$(function(){
	prescriptFunnel("[%QUESTIONNAME()%]");
})
</script>
```
```js
/*-------------------------------------
Проверка НЕ нужна, если нет столбца "Нет опыта назначения" 
(нужно ставить обязательность ответа в каждом столбце)
вкладка Custom JavaScript Verification
-------------------------------------*/

return prescriptFunnelNoPrescribing("[%QUESTIONNAME()%]");
```

### starRating(ques)<a name="starRating"></a>

Вопрос-оценка (шкала) в виде звездного рейтинга

**Особенности работы функции:**

* Работает на вопросах типа **Select Radio**
* Количество колонок (Number of Columns) установить равным количеству оценок (5 для 5-балльной шкалы, 7 для 7-былльной и т.д.)  
* Необходимо подключить CSS-файл starRating.css

**Аргументы**

*ques* (обязательный) – имя вопроса  

**Примеры:**
```html
<link rel="stylesheet" type="text/css" href="https://www.marsurvey.ru/public_scripts/starRating.css">
<script>
starRating("[%QUESTIONNAME()%]");
</script>
```

### checkAnswerInTable(opts)<a name="checkAnswerInTable"></a>

Проверка наличия ответа в таблице/строке/столбце для вопросов типа grid-numeric

**Особенности работы функции:**

* Аргументы задаются в виде объекта  
* Строки / столбцы Другое (с уточнение) не проверяются, т.е. не являются обязательными к заполнению  

**Свойства объекта-аргумента**

*ques* (обязательный) – имя вопроса  
*answLocation* (default:="inColumns") – расположение ответов в таблице. inRows – требуется дать ответ по строкам, inColumns – требуется дать ответ по столбцам, inTable - требуется заполнить хотя бы одну ячейку таблицы.  

**Примеры:**
```js
//вкладка Custom JavaScript Verification

strErrorMessage = checkAnswerInTable({ques: "[%QUESTIONNAME()%]"});
strErrorMessage = checkAnswerInTable({ques: "[%QUESTIONNAME()%]", answLocation: "inRows"});
strErrorMessage = checkAnswerInTable({ques: "[%QUESTIONNAME()%]", answLocation: "inTable"});
```

### createSlider(opts)<a name="createSlider"></a>

Создает слайдер для вопроса типа select-radio (вопросы с оценками)

**Особенности работы функции:**

* Аргументы задаются в виде объекта
* Слайдер расположен в созданной скриптом таблице. Таблица вставляется в начало блока ".question_body" (перед ".inner_table")  
* Новой таблице назначается класс "ui-tbl-slider" и уникальный id= tbl_slider_<имя вопроса ques>  
* Для работы скрипта необходимо подключить файл-CSS (в файле <a href="https://marsurvey.ru/public_scripts/slider-ui.css" target="_blank">slider-ui.css</a> оставлены только необходимы стили для слайдера. Там же прописаны стили для созданной скриптом таблицы)

**Свойства объекта-аргумента**

*ques* (обязательный) – имя вопроса  
*labelBefore* (default:="&lt;b&gt;&lt;font color='#C80000'&gt;1 балл&lt;/font&gt;&lt;/b&gt;") – текст метки перед слайдером (подпись левого конца слайдера)  
*labelAfter* (default:="&lt;b&gt;&lt;font color='#008000'&gt;5 баллов&lt;/font&gt;&lt;/b&gt;") – текст метки после слайдера (подпись правого конца слайдера)  
*exclusive* (default:=undefined) - номер строки для ответа "Затрудняюсь ответить"  
*handleVisible* (default:=true) - видимость выбранного балла на ползунке (true - баллы отображаются, false - баллы НЕ отображаются)  
*colorAnswered* (default:="#FFCC00") - цвет заливки ползунка, если есть ответ  
*colorNotAnswered* (default:="#f39999") - цвет заливки слайдера, если нет ответа. Стиль для слайдеров без ответа подключается единожды (1 стиль для всех слайдеров на странице) во время подключения первого слайдера  

*sliderOpts* - параметры для построения слайдера (в виде объекта)

**Информация о настройке и использовании sliderOpts**  
Полный список параметров и инструкцию по их использованию можно посмотреть здесь: <a href="http://api.jqueryui.com/" target="_blank">http://api.jqueryui.com/slider/</a>  
Дефолтные значения некоторых параметров изменены.  

Cписок измененных параметров:
```js
sliderOpts = {
	min: 1,
	max: 5,
	value: (max + min) / 2,
	animate = true
};
```

**Примеры:**  
Основной (все параметры по умолчанию)
```html
<link rel="stylesheet" type="text/css" href="https://marsurvey.ru/public_scripts/slider-ui.css">
<script>
$(function(){
	createSlider({"[% QuestionName() %]"});
})
</script>
```

от 1 до 10 баллов + 11. З/о
```html
<link rel="stylesheet" type="text/css" href="https://marsurvey.ru/public_scripts/slider-ui.css">
<!--В примере используется доп. стиль для сдвига варианта "Затрудняюсь ответить"-->
<style>
#[% QuestionName() %]_div .inner_table {
    margin-left: 12%;
}
</style>
<script>
$(function(){
	var q = {
		ques: [%QUESTIONNAME()%].id,
		labelAfter: '<b><font color="#008000">10 баллов</font></b>',
		exclusive: 11,
		sliderOpts: {max: 10}
	};
	
	createSlider(q);
})
</script>
```

олный набор параметров
```html
<link rel="stylesheet" type="text/css" href="https://marsurvey.ru/public_scripts/slider-ui.css">
<script>
$(function(){
	var q = {
		ques: "[% QuestionName() %]",
		labelBefore: "1 балл",
		labelAfter: "10 баллов",
		exclusive: 11,
		handleVisible: true,
		colorAnswered: "#008080",
		colorNotAnswered: "#ff8040",
		sliderOpts: {
			min: 1,
			max: 10,
			value: 1
		}
	};
	
	createSlider(q);
})
</script>

## Расширения в custom_scripts_ssi8.js<a name="custom_scripts_ssi8_Extensions"></a>

### fillRange()<a name="fillRange"></a>
Заполнение диапазона [n,m] числами от n до m включительно.  
После границ диапазона можно указать дополнительные элементы. Они будут вставлены в конец массива.
Возвращает **новый** массив.

**Примеры:**
```js
var x = [1, 5].fillRange();		//результат: x = Array [ 1, 2, 3, 4, 5 ]
var x = [5, 15].fillRange();		//результат: x = Array [ 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
var x = [0, 5, 99].fillRange();		//результат: x = Array [ 0, 1, 2, 3, 4, 5, 99 ]
var x = [2, 7, 1, 2, 9].fillRange();	//результат: x = Array [ 2, 3, 4, 5, 6, 7, 1, 2, 9 ]
//Ошибки
var x = [2].fillRange();      	//Ошибка: Array.fillRange: Длина массива не может быть меньше 2!
var x = ["a", 2].fillRange(); 	//Ошибка: x = Array []
var x = [5, "a"].fillRange(); 	//Ошибка: x = Array []
  ```