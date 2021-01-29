# Библиотека js-функций и вопросов для Lighthouse Studio

Для работы необходимо подключить библиотеку `BetterLighthouseLibrary`

## Функции в Lighthouse.js (последняя версия Lighthouse-1.0.js)

### changeInputTextOrExclusive(opts)

Очищает ответы по строке/столбцу для вопросов, содержащих числовые/текстовые поля и/или галочки exclusive (з/о)

**Особенности работы функции:**
•Аргументы задаются в виде объекта
•В качестве числовых/текстовых ответов могут выступать поля numeric или open-end (включая многострочные textarea)

**Свойства объекта-аргумента**

ques (обязательный) – имя вопроса
answLocation(default:="inColumns") – расположение ответов в таблице. inRows – требуется дать ответ по строкам, inColumns – требуется дать ответ по столбцам

**Пример:**
```html
<script>
$(function(){
  changeInputTextOrExclusive({ques: "[%QUESTIONNAME()%]"});
});
</script>```
```html
<script>
$(function(){
  changeInputTextOrExclusive({ques: "[%QUESTIONNAME()%]", answLocation: "inRows"});
});
</script>```