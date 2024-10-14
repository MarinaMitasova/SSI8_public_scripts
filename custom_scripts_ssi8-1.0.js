function checkArguments(arg, opts) {
    if (arg.length == 0 || opts === undefined) { throw "Функция должна принимать один аргумент в виде объекта." }
    if (arg.length > 1) { throw "Слишком много арументов для данной функции! \nФункция должна принимать только один аргумент в виде объекта." }
    if (opts.ques === undefined) { throw "Не задано имя вопроса `ques`!" }
    if ($("#" + opts.ques + "_div").length == 0) { throw "Вопрос " + opts.ques + " не найден на странице." }
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
function changeInputTextOrExclusive(opts) {

    //ques:  - Обязательный
    //answLocation: default="inColumns"

    checkArguments(arguments, opts);
    var ques = opts.ques;

    var quesDirection = opts.answLocation === undefined ? "inColumns" : opts.answLocation;
    if (quesDirection != "inRows" && quesDirection != "inColumns") {
        throw "answLocation может принимать одно из значений: 'inRows' или 'inColumns'."
    }

    var inputs = $("#" + ques + "_div").find("[type='text'], [type='tel'], textarea").not("[id$='_other']");
    var excl = $("#" + ques + "_div").find("[type='checkbox']")

    var arr = {};
    if (quesDirection == "inRows") {
        var temp = [];
        inputs.each(function () {
            var x = this.id.split("_")[1].replace("r", "");
            if (!~temp.indexOf(x)) temp.push(x)
        })
        $.each(temp, function (i, e) {
            var reg = new RegExp(ques + '_r' + e + '_c\\d+');
            arr[e] = {
                inps: inputs.filter(function () { return reg.test(this.id) }),
                chb: excl.filter(function () { return reg.test(this.id) })
            }
        })
    } else {
        var temp = [];
        inputs.each(function () {
            var x = this.id.split("_")[2].replace("c", "");
            if (!~temp.indexOf(x)) temp.push(x)
        })
        $.each(temp, function (i, e) {
            var reg = new RegExp(ques + '_r\\d+_c' + e);
            arr[e] = {
                inps: inputs.filter(function () { return reg.test(this.id) }),
                chb: excl.filter(function () { return reg.test(this.id) })
            }
        })
    }
    var other = $("[id^='" + ques + "_r'][id$='_other']");

    SSI_CustomGraphicalCheckbox = function (GraphicalCheckboxObj, inputObj, bln) {
        var q = inputObj.id.split("_")[0];
        if (q == ques) {
            if (bln) {
                if (quesDirection == "inRows") {
                    x = inputObj.id.split("_")[1].replace("r", "");
                } else {
                    x = inputObj.id.split("_")[2].replace("c", "");
                }

                arr[x].inps.val("")
                arr[x].chb.not(inputObj).get().forEach(function (chb) {
                    SSI_SetSelect(chb.id, 0)
                })

                if (quesDirection == "inColumns" && other.length) other.val("");
            }
        }
    }

    inputs.on("keyup", function () {
        if ($(this).val() != "") {
            if (quesDirection == "inRows") {
                x = this.id.split("_")[1].replace("r", "");
            } else {
                x = this.id.split("_")[2].replace("c", "");
            }

            arr[x].chb.get().forEach(function (chb) {
                SSI_SetSelect(chb.id, 0)
            })
        }
    });
    if (quesDirection == "inColumns" && other.length) {
        other.on("keyup", function () {
            if ($(this).val() != "") { excl.prop("checked", false); }
        });
    }
}

function checkInputTextOrExclusive(opts) {

    //ques:  - Обязательный
    //answLocation (default="inColumns") inRows / inColumns
    //inputsCheck (default="some") some / every
    //continueIf - доступен для переопределения 

    checkArguments(arguments, opts);
    var ques = opts.ques;

    var quesDirection = opts.answLocation === undefined ? "inColumns" : opts.answLocation;
    if (quesDirection != "inRows" && quesDirection != "inColumns") {
        throw "answLocation может принимать одно из значений: 'inRows' или 'inColumns'."
    }

    var inputsCheck = opts.inputsCheck === undefined ? "some" : opts.inputsCheck;
    if (inputsCheck != "some" && inputsCheck != "every") {
        throw "inputsCheck может принимать одно из значений: 'some' или 'every'."
    }

    if (opts.continueIf === undefined) {
        opts.continueIf = function (inps, excl, ind) {
            var err = "Введите ответ в ";
            if (quesDirection == "inRows") {
                err = err + "строке №" + ind;
            } else {
                err = err + "столбце №" + ind;
            }

            var needAnsw = inputsCheck == "some" ? 1 : inps.length;

            var answInp = inps.filter(function (i, e) { return $(e).val() != ""; }).length,
                answExc = excl.filter(function (i, e) { return $(e).prop("checked") == true; }).length;

            if (answInp < needAnsw && answExc == 0) {
                inps.filter(function (i, e) { return $(e).val() == ""; }).get(0).focus();
                return err;
            } else {
                return true;
            }
        }
    }

    var inputs = $("#" + ques + "_div").find("[type='text'], [type='tel'], textarea").not("[id$='_other']");
    var excl = $("#" + ques + "_div").find("[type='checkbox']")

    var arr = {};
    if (quesDirection == "inRows") {
        var temp = [];
        inputs.each(function () {
            var x = this.id.split("_")[1].replace("r", "");
            if (!~temp.indexOf(x)) temp.push(x)
        })
        $.each(temp, function (i, e) {
            var reg = new RegExp(ques + '_r' + e + '_c\\d+');
            arr[i + 1] = {
                inps: inputs.filter(function () { return reg.test(this.id) }),
                chb: excl.filter(function () { return reg.test(this.id) })
            }
        })
    } else {
        var temp = [];
        inputs.each(function () {
            var x = this.id.split("_")[2].replace("c", "");
            if (!~temp.indexOf(x)) temp.push(x)
        })
        $.each(temp, function (i, e) {
            var reg = new RegExp(ques + '_r\\d+_c' + e);
            arr[i + 1] = {
                inps: inputs.filter(function () { return reg.test(this.id) }),
                chb: excl.filter(function () { return reg.test(this.id) })
            }
        })
    }

    var err = '';
    $.each(arr, function (i, obj) {
        if (opts.continueIf(obj.inps, obj.chb, i) != true) {
            err = opts.continueIf(obj.inps, obj.chb, i);
            return false;
        }
    })

    return err;
}

function otherByColumnsInTable(opts) {

    checkArguments(arguments, opts);
    var ques = opts.ques;

    if (opts.other === undefined || opts.other === "") {
        throw "Номер строки-уточнения не задан или является пустой строкой!"
    }
    switch (Object.prototype.toString.call(opts.other)) {
        case "[object Number]":
            var other = opts.other.toString();
            break;
        case "[object String]":
        default:
            throw "Номер строки-уточнения `other` должен быть числом!"
    }
    var nameOther = opts.nameOther === undefined ? ques + "other" : opts.nameOther;
    var otherLocation = opts.otherLocation === undefined ? "inColumns" : opts.otherLocation;
    if (otherLocation != "inRows" && otherLocation != "inColumns") {
        throw "Параметр otherLocation д.б. равен либо 'inRows', либо 'inColumns'(по умолчанию)!"
    }
    if (nameOther.toString() !== nameOther || nameOther === "") {
        throw "Переменная nameOther должна быть строкой и \nсодержать в себе общую часть имени вопросов-уточнения!";
    }

    if (otherLocation == "inRows") {
        $("div[id^='" + nameOther + "']").find("input[type='text'], textarea").each(function () {
            $(this).parents("tr:first").hide();
            if ($(this).val() == "") {
                $(this).val("none");
            }
        });

        $("#" + ques + "_div").find("input[type='checkbox'], input[type='radio']").each(function (i, answ) {
            showOrHideOther1(answ);
        });

        SSI_CustomGraphicalCheckbox = function (graphicalObj, inputObj, bln) {
            var q = inputObj.id.split("_")[0];
            if (q == ques) { inputChanged(graphicalObj, inputObj, bln) }
        };
        SSI_CustomGraphicalRadiobox = function (graphicalObj, inputObj, bln) {
            var q = inputObj.id.split("_")[0];
            if (q == ques) { inputChanged(graphicalObj, inputObj, bln) }
        };
        function inputChanged(graphicalObj, inputObj, bln) {
            var reg = new RegExp(ques + "_.+");
            if (reg.test(inputObj.id)) {
                showOrHideOther1(inputObj);
            }
        }

        function showOrHideOther1(answ) {
            var id, r, c, rad, chb, elOther;
            id = $(answ).attr('id');
            if ($(answ).attr('type') == "checkbox") {
                r = id.split('_')[1].replace("r", "");
                c = id.split('_')[2].replace("c", "");
                chb = "#" + ques + "_r" + other + "_c" + c;
                elOther = $(chb);
            } else {
                r = id.split('_')[2];
                c = id.split('_')[1].replace("c", "");
                rad = "#" + ques + "_c" + c + "_" + other;
                elOther = $(rad);
            }
            if (elOther.prop("checked")) {
                if (r == other) {
                    $("#" + nameOther + "_div").show();
                    $("#" + nameOther + "_r" + c + "_c1").parents("tr:first").show();
                    if ($("#" + nameOther + "_r" + c + "_c1").val() == "none") {
                        $("#" + nameOther + "_r" + c + "_c1").val("");
                    }
                }
            } else {
                $("#" + nameOther + "_r" + c + "_c1").parents("tr:first").hide();
                $("#" + nameOther + "_r" + c + "_c1").val("none");
            }
            if ($("#" + nameOther + "_div").find("input[type='text'], textarea").not(":hidden").length == 0) {
                $("#" + nameOther + "_div").hide();
            }
        }
    } else {
        $("div[id^='" + nameOther + "']").find("input[type='text'], textarea").each(function () {
            $(this).hide();
            if ($(this).val() == "") {
                $(this).val("none");
            }
        });

        $("#" + ques + "_div").find("input[type='checkbox'], input[type='radio']").each(function (i, answ) {
            showOrHideOther2(answ);
        });

        SSI_CustomGraphicalCheckbox = function (graphicalObj, inputObj, bln) {
            var q = inputObj.id.split("_")[0];
            if (q == ques) { inputChanged(graphicalObj, inputObj, bln) }
        };
        SSI_CustomGraphicalRadiobox = function (graphicalObj, inputObj, bln) {
            var q = inputObj.id.split("_")[0];
            if (q == ques) { inputChanged(graphicalObj, inputObj, bln) }
        };
        function inputChanged(graphicalObj, inputObj, bln) {
            console.log(inputObj.id, bln)
            var reg = new RegExp(ques + "_.+");
            if (reg.test(inputObj.id)) {
                showOrHideOther2(inputObj);
            }
        }

        function showOrHideOther2(answ) {
            var id, r, c, rad, chb, elOther;
            id = $(answ).attr('id');
            if ($(answ).attr('type') == "checkbox") {
                r = id.split('_')[1].replace("r", "");
                c = id.split('_')[2].replace("c", "");
                chb = "#" + ques + "_r" + other + "_c" + c;
                elOther = $(chb);
            } else {
                r = id.split('_')[2];
                c = id.split('_')[1].replace("c", "");
                rad = "#" + ques + "_c" + c + "_" + other;
                elOther = $(rad);
            }
            if (elOther.prop("checked")) {
                if (r == other) {

                    $("#" + nameOther + "_div").show();

                    $("[id^=" + nameOther + "][id$=_c" + c + "]").each(function () {
                        $(this).show();
                        if ($(this).val() == "none") {
                            $(this).val("");
                        }
                    })

                }
            } else {
                $("[id^=" + nameOther + "][id$=_c" + c + "]").each(function () {
                    $(this).hide();
                    $(this).val("none");
                })
            }
            if ($("#" + nameOther + "_div").find("input[type='text'], textarea").not(":hidden").length == 0) {
                $("#" + nameOther + "_div").hide();
            }
        }
    }
}

function otherByRowsInTable(opts) {

    checkArguments(arguments, opts);
    var ques = opts.ques;

    if (opts.other === undefined || opts.other === "") {
        throw "Номер столбца-уточнения не задан или является пустой строкой!"
    }
    switch (Object.prototype.toString.call(opts.other)) {
        case "[object Number]":
            var other = opts.other.toString();
            break;
        case "[object String]":
        default:
            throw "Номер столбца-уточнения `other` должен быть числом!"
    }
    var nameOther = opts.nameOther === undefined ? ques + "other" : opts.nameOther;
    if (nameOther.toString() !== nameOther || nameOther === "") {
        throw "Переменная nameOther должна быть строкой и \nсодержать в себе общую часть имени вопросов-уточнения!";
    }

    $("div[id^='" + nameOther + "']").find("input[type='text'], textarea").each(function () {
        $(this).parents("tr:first").hide();
        if ($(this).val() == "") {
            $(this).val("none");
        }
    });

    $("#" + ques + "_div").find("input[type='checkbox'], input[type='radio']").each(function (i, answ) {
        showOrHideOther(answ);
    });

    SSI_CustomGraphicalCheckbox = function (graphicalObj, inputObj, bln) {
        var q = inputObj.id.split("_")[0];
        if (q == ques) { inputChanged(graphicalObj, inputObj, bln) }
    };
    SSI_CustomGraphicalRadiobox = function (graphicalObj, inputObj, bln) {
        var q = inputObj.id.split("_")[0];
        if (q == ques) { inputChanged(graphicalObj, inputObj, bln) }
    };
    function inputChanged(graphicalObj, inputObj, bln) {
        var reg = new RegExp(ques + "_.+");
        if (reg.test(inputObj.id)) {
            showOrHideOther(inputObj);
        }
    }

    function showOrHideOther(answ) {
        var id, r, c, rad, chb, elOther;
        id = $(answ).attr('id');
        r = id.split('_')[1].replace("r", "");
        c = id.split('_')[2].replace("c", "");
        chb = "#" + ques + "_r" + r + "_c" + other;
        rad = "#" + ques + "_r" + r + "_" + other;
        elOther = $(chb).add(rad);
        if (elOther.prop("checked")) {
            if (c == other) {
                $("#" + nameOther + "_div").show();
                $("#" + nameOther + "_r" + r + "_c1").parents("tr:first").show();
                if ($("#" + nameOther + "_r" + r + "_c1").val() == "none") {
                    $("#" + nameOther + "_r" + r + "_c1").val("");
                }
            }
        } else {
            $("#" + nameOther + "_r" + r + "_c1").parents("tr:first").hide();
            $("#" + nameOther + "_r" + r + "_c1").val("none");
        }
        if ($("#" + nameOther + "_div").find("input[type='text'], textarea").not(":hidden").length == 0) {
            $("#" + nameOther + "_div").hide();
        }
    }
}

function listFilter(opts) {
    checkArguments(arguments, opts);
    var ques = opts.ques + "_div";

    if (!$("#" + ques).find("[type='radio']").length) {
        throw "Вопрос " + ques + " должен быть типа Select Radio."
    }
    if (opts.alwaysShow === undefined) {
        var alwaysShow = +$("#" + ques).find("[type='radio']:last").attr("id").split("_")[1];
    } else {
        alwaysShow = opts.alwaysShow;
    }
    if (alwaysShow === null) alwaysShow = 0;

    if (Object.prototype.toString.call(alwaysShow) == "[object Number]") {
        alwaysShow = [alwaysShow];
    }
    if (Object.prototype.toString.call(alwaysShow) != "[object Array]") {
        throw "Свойство alwaysShow должно быть числом или массивом!"
    }

    var maxRows = opts.maxRows === undefined ? 10 : opts.maxRows;
    if (Object.prototype.toString.call(maxRows) != "[object Number]") {
        throw "Свойство maxRows должно быть числом!"
    }

    $("#" + ques).find(".question_body").prepend("<div class='listFilter-bl-input'></div>");
    $("#" + ques).find(".listFilter-bl-input").prepend("<input type='text' id='filter_input_" + ques + "'>");
    var $inp = $("#filter_input_" + ques);
    $("#" + ques).find(".inner_table>tbody>tr>td>table").addClass("listFilter-table");

    var $tbl = $("#" + ques).find(".listFilter-table");

    $("#" + ques).find("[id$=_other]").each(function () {
        var dbl = $(this).clone();
        var id = $(this).attr("id").replace("_other", "");
        $("label[for='" + id + "']").append(dbl);
        $(this).remove();
    });


    $(window).on("resize", function () {
        $(".listFilter-bl-input").css("width", $(".clickable:visible").outerWidth() + 15 + "px")
    })

    $(window).on("load", function () {
        $("body").css({ "cursor": "default", "visibility": "visible" });
        $tbl.css("max-height", $tbl.find("tr:first").height() * maxRows);

        $(".header1, .header2, .inner_table, .question")
            .css("visibility", "visible");
        $(window).resize();
    });

    $inp.on('keyup', function () {
        var val = $(this).val();

        $("#" + ques + " label").each(function () {
            var reg = new RegExp('\.*' + val + '.*', 'i');
            var id = $(this).attr("for");
            var r = +id.split("_")[1];

            if (reg.test($(this).text()) || $("#" + id).prop("checked") || alwaysShow.indexOf(r) != -1) {
                $(this).parents("tr:eq(0)").show()
            } else {
                $(this).parents("tr:eq(0)").hide()
            }

            reg = new RegExp('\^' + val + '$', 'i');
            if (reg.test($(this).text().trim())) {
                SSI_SetSelect(id, true)
            }
        });
    });

    SSI_CustomGraphicalRadiobox = function (GraphicalCheckboxObj, inputObj, bln) {
        var q = inputObj.id.split("_")[0]
        if (q == ques.replace("_div", "")) {
            if ($("#" + inputObj.id + "_other").length == 0) {
                $inp.val($("#" + ques + " label[for='" + inputObj.id + "']").text());
            }
        }
    }
    $("#" + ques + " [id$='_other']").on("keyup", function () {
        $inp.val($(this).val())
    });
}

function createRank(ques) {

    if ($("#" + ques + "_div").length == 0) {
        throw "Вопрос " + ques + " не найден на странице."
    }

    $("#" + ques + "_div .inner_table").removeAttr("border")
    $("#" + ques + "_div .inner_table").prepend("<div class='create_rank_main'></div>")
    $("#" + ques + "_div .create_rank_main").append("<div id='" + ques + "_rankList_left' class='create_rank left'></div>");
    var blLeft = $("#" + ques + "_rankList_left");
    $("#" + ques + "_div .create_rank_main").append("<div id='" + ques + "_rankList_right' class='create_rank right'></div>");
    var blRight = $("#" + ques + "_rankList_right");

    if ('onpageshow' in window) {
        window.addEventListener('pageshow', on_load, false);
    } else {
        window.addEventListener('load', on_load, false);
    }
    $("#" + ques + "_div .inner_table .column_header_row").hide()

    function on_load() {
        $("#" + ques + "_div").find(".options, .row_label_cell .grid_options").sort(function (a, b) {
            var inp1 = $(a).parents("tr:first").find("[type='tel']"),
                inp2 = $(b).parents("tr:first").find("[type='tel']");
            if (+inp1.val() > +inp2.val()) return 1; // если первое значение больше второго
            if (+inp1.val() == +inp2.val()) return 0; // если равны
            if (+inp1.val() < +inp2.val()) return -1; // если первое значение меньше второго
        }).each(function () {
            var row = $(this).clone();
            var inp = $(this).parents("tr:first").find("[type='tel']");
            var id = inp.attr("id");

            if (inp.val() != "") {
                blRight.append(row);
            } else {
                blLeft.append(row);
            }

            row.attr("data-id", id);

            var oth = row.find("[id$='_other']");
            if (oth.length) {
                var id = oth.attr("id");
                oth.attr("data-id", id).removeAttr("id").removeAttr("name");
                row.find("[type='hidden']").remove();

                oth.keyup(function () {
                    var id = $(this).data("id");
                    $("#" + id).val($(this).val())
                })
            }

            $(this).parents("tr:first").hide()
        })
    }


    var options = {
        group: 'shared',
        animation: 250,
        onEnd: function () {
            $("#" + ques + "_div [type='tel']").filter("[id]").not("[id$='_other']").val("");
            blRight.find(".options, .grid_options").each(function (i, e) {
                var id = $(this).data("id");
                $("#" + ques + "_div").find("[id='" + id + "']").val(++i);

                if ($(this).find(".num").length) {
                    $(this).find(".num").text("(" + i + ")")
                } else {
                    $(this).prepend("<span class='num'>(" + i + ")</span>");
                }

                var oth = $(this).find("[data-id$='_other']");
                if (oth.length) {
                    id = oth.data("id");
                    $("#" + ques + "_div").find("[id='" + id + "']").val(oth.val());
                    if (oth.val() == "") {
                        var oth_val = prompt("Впишите ответ в вариант Другое")
                        oth.val(oth_val)
                        var id = oth.data("id");
                        $("#" + id).val(oth.val())
                    }
                }
            })
            blLeft.find(".options, .grid_options").each(function (i, e) {
                $(this).find(".num").remove()
            })
        }
    };


    Sortable.create(blLeft[0], options);
    Sortable.create(blRight[0], options);

    var h = Math.max($("#" + ques + "_div .create_rank.left").height(), $("#" + ques + "_div .create_rank.right").height());
    $("#" + ques + "_div .create_rank").css("min-height", (h + 20) + "px");
    $(window).resize(function () {
        $("#" + ques + "_div .create_rank").removeAttr("style");
        var h = Math.max($("#" + ques + "_div .create_rank.left").height(), $("#" + ques + "_div .create_rank.right").height());
        $("#" + ques + "_div .create_rank").css("min-height", (h + 20) + "px");
    })
}

function tdOnClick() {
    var grid = $(".grid").filter(function () { return $(this).is(".tdOnClick_off") == false });
    if (grid.length) {
        var radio = grid.find("[type='radio']");
        if (radio.length) {
            SSI_CustomGraphicalRadiobox = function (graphicalObj, inputObj) {
                var q = inputObj.id.split("_")[0] + "_div"
                if ($("#" + q).is(":not(.tdOnClick_off)")) {
                    $("#" + q).find("td.input_cell.clickable").removeClass("tdOnClick_selected")
                    $("#" + q).find("td.input_cell.clickable").each(function () {
                        if ($(this).find("[type=radio]:checked").length && $(this).find(".graphical_select:visible").length) {
                            $(this).addClass("tdOnClick_selected")
                        }
                    })
                }
            };
        }
        var chb = grid.find("[type='checkbox']");
        if (chb.length) {
            SSI_CustomGraphicalCheckbox = function (graphicalObj, inputObj, bln) {
                var q = inputObj.id.split("_")[0] + "_div"
                if ($("#" + q).is(":not(.tdOnClick_off)")) {
                    $("#" + q).find("td.input_cell.clickable").removeClass("tdOnClick_selected")
                    $("#" + q).find("td.input_cell.clickable").each(function () {
                        if ($(this).find("[type=checkbox]:checked").length && $(this).find(".graphical_select:visible").length) {
                            $(this).addClass("tdOnClick_selected")
                        }
                    })
                }
            };
        }
    }
}

function changeConstantSumOrExclusive(opts) {
    checkArguments(arguments, opts);
    var ques = opts.ques;

    var quesDirection = opts.answLocation === undefined ? "inColumns" : opts.answLocation;
    if (quesDirection != "inRows" && quesDirection != "inColumns") {
        throw "answLocation может принимать одно из значений: 'inRows' или 'inColumns'."
    }

    var excl, inps, chb;

    if (opts.exclusive !== undefined) {
        excl = opts.exclusive;
    } else {
        var max = 0;
        if (quesDirection == "inColumns") {
            $("#" + ques + "_div [type='tel']").each(function (i, e) {
                var ind = +e.id.split("_")[1].replace("r", "");
                if (ind > max) max = ind;
            });
        } else {
            $("#" + ques + "_div [type='tel']").each(function (i, e) {
                var ind = +e.id.split("_")[2].replace("c", "");
                if (ind > max) max = ind;
            });
        }
        excl = max;
    }
    if (Object.prototype.toString.call(excl) != "[object Number]") {
        throw "Свойство exclusive должно быть числом!";
    }

    var inputs = opts.inputs === undefined ? [1, excl - 1].fillRange() : opts.inputs;

    if (Object.prototype.toString.call(inputs) == "[object Number]") {
        inputs = [inputs];
    }

    var exclText = opts.exclusiveText === undefined ? "&nbsp;<i>Затрудняюсь ответить</i>" : opts.exclusiveText;
    var total = opts.totalValue === undefined ? [100] : opts.totalValue;

    if (Object.prototype.toString.call(total) != "[object Number]" && Object.prototype.toString.call(total) != "[object Array]") {
        throw "Свойство totalValue должно быть числом или массивом!";
    }

    if (Object.prototype.toString.call(total) == "[object Number]") {
        total = [total];
    }

    if (quesDirection == "inRows") {

        $("[type='tel'][id^='" + ques + "_r'][id$='_c" + excl + "']").each(function () {
            $(this).parents("td:eq(1)").addClass("clickable")
        })
        $("[type='tel'][id^='" + ques + "_r'][id$='_c" + excl + "']").each(function () {
            $(this).before("<input type=checkbox id=" + this.id + "_excl" + " class='HideElement'/>" +
                "<div id=" + this.id + "_excl_graphical" + " class='graphical_select checkbox'></div>");

            $(this).parent().next().find(".grid_cell_text").html(exclText)
        })

        $("[type='tel'][id^='" + ques + "_r'][id$='_c" + excl + "']").hide()
        $("[type='tel'][id^='" + ques + "_r'][id$='_c" + excl + "']").each(function () {
            this.setAttribute("type", "hidden");
        })
        chb = $("#" + ques + "_div [type='checkbox'][id$='_c" + excl + "_excl']");

        if (total.length == 1) {
            chb.each(function () {
                var r = +this.id.split("_")[1].replace("r", "");
                total[r - 1] = total[0];
            })
        }
        if (total.length < chb.length) {
            throw "Размерность массива totalValue должна совпадать с кол-ом строк в вопросе!";
        }

        inps = $();
        $.each(inputs, function (i, e) {
            inps = inps.add("#" + ques + "_div [type='tel'][id$='_c" + e + "']");
        });

        $(window).on("load", function () {
            chb.each(function () {
                var r = this.id.split("_")[1].replace("r", "");
                if ($("#" + ques + "_r" + r + "_c" + excl).val() == total[r - 1]) SSI_SetSelect(this.id, true);
            })
        })

        SSI_CustomGraphicalCheckbox = function (GraphicalCheckboxObj, inputObj, bln) {
            var q = inputObj.id.split("_")[0];
            if (q == ques) {
                if (bln) {
                    var r = inputObj.id.split("_")[1].replace("r", "");

                    inps.filter(function (i, e) {
                        return e.id.split("_")[1].replace("r", "") == r;
                    }).val("");
                    chb.filter(function (i, e) {
                        return e.id.split("_")[1].replace("r", "") == r;
                    }).not(inputObj).get().forEach(function (chb) {
                        SSI_SetSelect(chb.id, 0)
                    })

                    $("#" + inputObj.id.replace("_excl", "")).val(total[r - 1]);
                    $("#" + ques + "_r" + r + "_c_total").val("")
                } else {
                    $("#" + inputObj.id.replace("_excl", "")).val("");
                }
            }
        }

        inps.on("keyup", function () {
            if ($(this).val() != "") {
                var r = this.id.split("_")[1].replace("r", "");
                chb.filter(function (i, e) {
                    return e.id.split("_")[1].replace("r", "") == r;
                }).get().forEach(function (chb) {
                    SSI_SetSelect(chb.id, 0)
                    $("#" + chb.id.replace("_excl", "")).val(0);
                })
            }
        });
    } else {
        $("[type='tel'][id^='" + ques + "_r" + excl + "_c']").each(function () {
            $(this).parents("td:eq(1)").addClass("clickable")
        })
        $("[type='tel'][id^='" + ques + "_r" + excl + "_c']").each(function () {
            $(this).before("<input type=checkbox id=" + this.id + "_excl" + " class='HideElement'/>" +
                "<div id=" + this.id + "_excl_graphical" + " class='graphical_select checkbox'></div>");

            $(this).parent().next().find(".grid_cell_text").html(exclText)
        })
        $("[type='tel'][id^='" + ques + "_r" + excl + "_c']").hide()
        $("[type='tel'][id^='" + ques + "_r" + excl + "_c']").each(function () {
            this.setAttribute("type", "hidden");
        })
        chb = $("[type='checkbox'][id^='" + ques + "_r" + excl + "_c']");

        if (total.length == 1) {
            chb.each(function () {
                var c = this.id.split("_")[2].replace("c", "");
                total[c - 1] = total[0];
            })
        }
        if (total.length < chb.length) {
            throw "Размерность массива totalValue должна совпадать с кол-ом столбцов в вопросе!";
        }

        inps = $();
        $.each(inputs, function (i, e) {
            inps = inps.add("[type='tel'][id^='" + ques + "_r" + e + "_c']");
        });
        if ($("[id^='" + ques + "_r'][id$='_other']").length > 0) {
            if (total.length == 1) var other = $("[id^='" + ques + "_r'][id$='_other']");
        }

        $(window).on("load", function () {
            chb.each(function () {
                var c = this.id.split("_")[2].replace("c", "");
                if ($("#" + ques + "_r" + excl + "_c" + c).val() == total[c - 1]) SSI_SetSelect(this.id, true);
            })
        })

        SSI_CustomGraphicalCheckbox = function (GraphicalCheckboxObj, inputObj, bln) {
            var q = inputObj.id.split("_")[0];
            if (q == ques) {
                if (bln) {
                    c = inputObj.id.split("_")[2].replace("c", "");

                    inps.filter(function (i, e) {
                        return e.id.split("_")[2].replace("c", "") == c;
                    }).val("");
                    chb.filter(function (i, e) {
                        return e.id.split("_")[2].replace("c", "") == c;
                    }).not(inputObj).get().forEach(function (chb) {
                        SSI_SetSelect(chb.id, 0)
                    })

                    if (other) other.val("");
                    $("#" + inputObj.id.replace("_excl", "")).val(total[c - 1]);
                    $("#" + ques + "_r_total_c" + c).val("")
                } else {
                    $("#" + inputObj.id.replace("_excl", "")).val("");
                }
            }
        }

        inps.on("keyup", function () {
            if ($(this).val() != "") {
                var c = this.id.split("_")[2].replace("c", "");
                chb.filter(function (i, e) {
                    return e.id.split("_")[2].replace("c", "") == c;
                }).get().forEach(function (chb) {
                    SSI_SetSelect(chb.id, 0)
                    $("#" + chb.id.replace("_excl", "")).val(0);
                })
            }
        });

        if (other) {
            other.on("keyup", function () {
                if ($(this).val() != "") {
                    chb.get().forEach(function (chb) {
                        SSI_SetSelect(chb.id, 0)
                        $("#" + chb.id.replace("_excl", "")).val(0);
                    })
                }
            });
        }
    }
}

function existAnswerForOtherSpecify(ques) {
    if (ques === undefined) { throw "Не задано имя вопроса `ques`!"; }
    if ($("#" + ques + "_div").length == 0) { throw "Вопрос " + ques + " не найден на странице."; }
    var other = $("input[id^='" + ques + "_'][id$='_other']");
    if (!other.length) { throw "Строк Другое не найдено на странице."; }

    var err = "";
    other.each(function (i, oth) {
        if (oth.value !== "") {
            var row = oth.id.match(/_r\d+_/g)[0].replace(/[r_]/g, "");
            var selector1 = "input[id^='" + ques + "_r" + row + "']:not([id$=_other]):not([id$=_total])",
                selector2 = "input[id^='" + ques + "_'][id$='_" + row + "']",
                selector3 = "select[id^='" + ques + "_r" + row + "']";
            var answ = $(selector1)
            if (!answ.length) answ = answ.add(selector2)
            answ = answ.add(selector3)

            var isAnswered = 0;
            answ.each(function (i, item) {
                var isChecked = ($(item).attr('type') === "radio" || $(item).attr('type') === "checkbox") && item.checked,
                    isFilled = (($(item).attr('type') === "text" || $(item).attr('type') === "tel") && item.value !== ""),
                    isSelected = (item.tagName == "SELECT" && item.value !== "");
                isAnswered += (isChecked || isFilled || isSelected);
            });
            if (!isAnswered) {
                err = "Укажите ответ для пункта Другое";
                return false;
            }
        }
    });
    return err;
}

function prescriptFunnel(ques) {

    if (ques === undefined) { throw "Не задано имя вопроса `ques`!"; }
    if ($("#" + ques + "_div").length == 0) { throw "Вопрос " + ques + " не найден на странице."; }

    SSI_CustomGraphicalCheckbox = function (graphicalObj, inputObj, bln) {
        var q = inputObj.id.split("_")[0];

        if (q == ques) {
            var r = inputObj.id.split("_")[1].replace("r", "");
            var id1 = ques + "_r" + r + "_c1";
            var id2 = ques + "_r" + r + "_c2";
            var id3 = ques + "_c3_" + r;
            var id4 = ques + "_r" + r + "_c4";

            if (inputObj.id.split("_")[2] == "c1") {
                if (bln) {
                    if ($("[id^='" + ques + "'][id$='_c4']").length) {
                        SSI_SetSelect(id4, false);
                    }
                } else {
                    SSI_SetSelect(id2, false);
                    SSI_SetSelect(id3, false);
                }
            } else if (inputObj.id.split("_")[2] == "c2") {
                if (bln) {
                    SSI_SetSelect(id1, true);

                    if ($("[id^='" + ques + "'][id$='_c4']").length) {
                        SSI_SetSelect(id4, false);
                    }
                } else {
                    SSI_SetSelect(id3, false);
                }
            } else if (inputObj.id.split("_")[2] == "c4") {
                if (bln) {
                    SSI_SetSelect(id1, false);
                    SSI_SetSelect(id2, false);
                    SSI_SetSelect(id3, false);
                }
            }
        }
    }

    SSI_CustomGraphicalRadiobox = function (graphicalObj, inputObj) {
        var q = inputObj.id.split("_")[0];

        if (q == ques) {
            var r = inputObj.id.split("_")[2];
            var id1 = ques + "_r" + r + "_c1";
            var id2 = ques + "_r" + r + "_c2";
            var id4 = ques + "_r" + r + "_c4";
            if (inputObj.id.split("_")[1] == "c3") {
                SSI_SetSelect(id1, true);
                SSI_SetSelect(id2, true);

                if ($("[id^='" + ques + "'][id$='_c4']").length) {
                    SSI_SetSelect(id4, false);
                }
            }
        }
    }
}

function prescriptFunnelNoPrescribing(ques) {
    if (ques === undefined) { throw "Не задано имя вопроса `ques`!"; }
    if ($("#" + ques + "_div").length == 0) { throw "Вопрос " + ques + " не найден на странице."; }

    var err = "";

    if ($("[id^='" + ques + "'][id$='_c4']").length) {
        var rowCount = $("[id^='" + ques + "_r'][id$=_c1]").length;
        var rows = $("[id^='" + ques + "_r'][id$='_row']");

        var lastNumberRow = 0;
        for (var i = 0; i < rowCount; i++) {
            var numberRow = $(rows[i]).prop('id').split("_")[1].split("").slice(1).join("");
            if (+numberRow > lastNumberRow) lastNumberRow = numberRow;
        }
        for (var i = 1; i <= lastNumberRow; i++) {
            if ($("[id^='" + ques + "_r" + i + "_row']").length && $("[id^='" + ques + "_r" + i + "_c']:checked").length < 1) {
                err = "Пожалуйста, укажите ответ в каждой строке";
                return err;
            }
        }
        if ($("[id^='" + ques + "_r'][id$='_c4']:checked").length < rowCount && $("[id^='" + ques + "_c3_']:checked").length < 1) {
            err = "Пожалуйста, укажите ответ в 3-м столбце";
            return err;
        }
    }
    return err;
}

function starRating(ques, excl, excl_text) {

    excl_text = excl_text === undefined ? "Затрудняюсь ответить" : excl_text;

    $("#" + ques + "_div").addClass("starRating");

    if (excl) {
        var answ = $("#" + ques + "_div label:not('[for=" + ques + "_" + excl + "]')");
        $("#" + ques + "_" + excl).parents(".clickable").hide()
        $("#" + ques + "_div .footer").append('<div class="starRating_none">' + excl_text + '</div>')
    } else {
        var answ = $("#" + ques + "_div label");
    }
    answ.each(function () {
        id = "star" + $(this).attr("for");
        $(this).html('<a href="#" id="' + id + '" class="contain-icon icon-hook"><svg class="star-icon star-icon-2" version="1.1" width="110%" height="110%" viewBox="0 0 105.602 102.931"><radialGradient id="grad" r="80%"> <stop offset="10%" stop-color="yellow" /><stop offset="95%" stop-color="#ffc107" /></radialGradient><path class="main-star-2" fill="none" stroke="gold" stroke-width="3" stroke-miterlimit="10" d="M52.35,3.11c0.475-0.963,1.253-0.963,1.728,0 l12.211,24.742c0.475,0.963,1.734,1.877,2.796,2.032l27.305,3.968c1.063,0.154,1.303,0.894,0.534,1.644L77.167,54.754	c-0.769,0.75-1.25,2.229-1.068,3.287l4.664,27.194c0.182,1.058-0.448,1.516-1.398,1.016L54.942,73.413	c-0.951-0.5-2.506-0.5-3.456,0L27.064,86.252c-0.951,0.5-1.58,0.043-1.398-1.016l4.664-27.194c0.182-1.058-0.299-2.538-1.068-3.287	L9.504,35.495c-0.769-0.75-0.529-1.489,0.534-1.644l27.305-3.968c1.063-0.154,2.321-1.069,2.796-2.032L52.35,3.11z"/>	<path class="star-dashes-2" fill="#FFFFFF" stroke="gold" stroke-width="5" stroke-linecap="round" stroke-miterlimit="10" d="M20.881,6.26	l6.333,7.333 M103.214,63.961l-9.173-3.122 M78.519,13.835l5.724-7.818 M52.777,100.544l0.048-9.69 M11.823,61.737l-9.436,2.204"/>	M42.681,47.839l6.817,6.817 M63.747,39.016l-14.249,15.64"/></svg></a>')
    })

    $("#" + ques + "_div .inner_table td:not(.select_column_spacing, .input_cell, .option_cell)").css("width", 100 / answ.length + "%")

    var icons = $("#" + ques + "_div .icon-hook");

    icons.click(function (event) {
        event.preventDefault();
        var tmp = this.id.split("_");
        var i = +tmp[tmp.length - 1];

        icons.removeClass("active")

        icons.filter(function () {
            var tmp = this.id.split("_")
            return tmp[tmp.length - 1] <= i;
        }).addClass("active")

        $(".starRating_none").removeClass("selected");
    })

    $(window).on("load", function () {
        var val_old = $("#" + ques + "_div [type=radio]:checked");
        if (val_old.length) {
            $("#star" + val_old.attr("id")).click()
        }

        $(".starRating_none").click(function () {
            $(".starRating_none").addClass("selected");
            icons.removeClass("active")
            SSI_SetSelect(ques + "_" + excl, true)
        })
        if (SSI_GetValue(ques) == excl) {
            $(".starRating_none").click()
        }
    })

}

function checkAnswerInTable(opts) {
    checkArguments(arguments, opts);

    var head = document.querySelector('head');
    var style = document.createElement("style");
    style.appendChild(document.createTextNode(".checkAnswerInTable_err{border: 1px solid red !important;}"));
    head.appendChild(style);

    var ques = opts.ques;

    var quesDirection = opts.answLocation === undefined ? "inColumns" : opts.answLocation;
    if (quesDirection != "inRows" && quesDirection != "inColumns" && quesDirection != "inTable") {
        throw "answLocation может принимать одно из значений: 'inRows', 'inColumns' или 'inTable'."
    }

    var err = "";

    var rows = $("[id^='" + ques + "_r'][id$='_row']");
    var rowCount = $(rows).length;
    rows.removeClass("checkAnswerInTable_err")

    // проверка на случай, если Question Direction - Columns и есть строка Totals
    $(rows).each(function () {
        if (!($(this).find("[id*='" + ques + "_r'][id*='_c'][type='tel']").length)) {
            rowCount--;
        }
    });

    var columns = $(rows[0]).find("[id*='" + ques + "_r'][id*='_c'][type='tel']");
    var columnCount = $(columns).length;
    $("#" + ques + "_div td").removeClass("checkAnswerInTable_err")

    var lastNumberRow = 0;
    // lastNumberRow - это номер последнего элемента в списке (необходим в случае, если это Constructed List, и в нём присутствуют не все элементы родительского листа)
    for (var i = 0; i < rowCount; i++) {
        var numberRow = $(rows[i]).prop("id").split("_")[1].split("").slice(1).join("");
        if (+numberRow > lastNumberRow) lastNumberRow = numberRow;
    }

    var lastNumberColumn = 0;
    // lastNumberColumn - это номер последнего элемента в списке (необходим в случае, если это Constructed List, и в нём присутствуют не все элементы родительского листа)
    for (var i = 0; i < columnCount; i++) {
        var numberColumn = $(columns[i]).prop("id").split("_")[2].split("").slice(1).join("");
        if (+numberColumn > lastNumberColumn) lastNumberColumn = numberColumn;
    }

    // Ищем строки, где нужно вписать "Другое"
    var otherRows = $(rows).find("[id*='other']");

    // Ищем столбцы, где нужно вписать "Другое"
    var otherColumns = $("[id^='" + ques + "_c'][id$='_other']");

    if (quesDirection == "inRows") {
        var checkRows = 0;

        for (var i = 1; i <= lastNumberRow; i++) {
            var countCheckInRow = 0;

            for (var j = 1; j <= lastNumberColumn; j++) {
                if ($("#" + ques + "_r" + i + "_c" + j + "").length && $("#" + ques + "_r" + i + "_c" + j + "").val() != '') {
                    countCheckInRow++;
                }
                if ($(otherRows).length && $("#" + ques + "_r" + i + "_other").val() == '') {
                    countCheckInRow++;
                }
            }
            if (countCheckInRow > 0) {
                checkRows++;
            } else {
                $("#" + ques + "_r" + i + "_row").addClass("checkAnswerInTable_err");
            }
        }
        if (checkRows < rowCount) {
            err = "В строке должна быть заполнена хотя бы одна ячейка";
            return err;
        }
    }

    if (quesDirection == "inColumns") {
        var checkColumns = 0;

        for (var i = 1; i <= lastNumberColumn; i++) {
            var countCheckInColumns = 0;

            for (var j = 1; j <= lastNumberRow; j++) {
                if ($("#" + ques + "_r" + j + "_c" + i + "").length && $("#" + ques + "_r" + j + "_c" + i + "").val() != '') {
                    countCheckInColumns++;
                }
                if ($(otherColumns).length && $("#" + ques + "_c" + i + "_other").val() == '') {
                    countCheckInColumns++;
                }
            }
            if (countCheckInColumns > 0) {
                checkColumns++;
            } else {
                $("#" + ques + "_div .grid_c" + i).filter(function () { return $(this).find("[type=tel]").length > 0 }).addClass("checkAnswerInTable_err");
            }
        }
        if (checkColumns < columnCount) {
            err = "В столбце должна быть заполнена хотя бы одна ячейка";
            return err;
        }
    }

    if (quesDirection == "inTable") {
        var checkCells = 0;

        for (var i = 1; i <= lastNumberRow; i++) {

            for (var j = 1; j <= lastNumberColumn; j++) {
                if ($("#" + ques + "_r" + i + "_c" + j + "").length && $("#" + ques + "_r" + i + "_c" + j + "").val() != '') {
                    checkCells++;
                }
            }
        }
        if (checkCells < 1) {
            err = "В таблице должна быть заполнена хотя бы одна ячейка";
            return err;
        }
    }
    return err;
}

function createSlider(opts) {
    checkArguments(arguments, opts);

    var ques = opts.ques + "_div";

    var quesName = opts.ques;

    var sliderOpts = opts.sliderOpts === undefined ? {} : opts.sliderOpts;

    $("#" + ques).find("[type='radio']").each(function () {
        $(this).parents("tr:first").hide();
    });

    $("#" + ques).find(".question_body").prepend("<table width='100%' id='tbl_slider_" + ques + "' cellspacing='0' cellpadding='5' class='ui-tbl-slider'></table>");
    var $tbl = $("#tbl_slider_" + ques);
    $tbl.append("<tr><td></td><td></td><td></td></tr>");
    $tbl.find("td").addClass("row_label");

    if (opts.labelBefore === undefined) {
        var labelBefore = '<b><font color="#C80000">1 балл</font></b>'
    } else {
        labelBefore = opts.labelBefore
    }
    if (opts.labelAfter === undefined) {
        var labelAfter = '<b><font color="#008000">5 баллов</font></b>'
    } else {
        labelAfter = opts.labelAfter
    }
    if (opts.handleVisible === undefined) {
        var handleVisible = true;
    } else {
        handleVisible = opts.handleVisible;
    }
    if (opts.colorAnswered === undefined) {
        var colorAnswered = "#FFCC00";
    } else {
        colorAnswered = opts.colorAnswered;
    }

    var notAnswered = opts.colorNotAnswered === undefined ? "#f39999" : opts.colorNotAnswered;
    if (!$("style[id='createSlider_style']").length) {
        var head = document.querySelector('head');
        var style = document.createElement("style");
        style.id = "createSlider_style";
        style.appendChild(document.createTextNode(".createSlider_style_notAnswered{background-color: " + notAnswered + " !important;}"));
        head.appendChild(style);
    }

    $tbl.find("tr:first td:first").html(labelBefore);
    $tbl.find("tr:first td:last").html(labelAfter);
    $tbl.find("tr:first td:eq(1)").html("<div id='slider_" + ques + "'><div class='ui-slider-handle'></div></div>");


    if (sliderOpts.min === undefined) sliderOpts.min = 1;
    if (sliderOpts.max === undefined) sliderOpts.max = 5;
    if (sliderOpts.value === undefined) {
        sliderOpts.value = Math.round((sliderOpts.max + sliderOpts.min) / 2);
    }
    if (sliderOpts.animate === undefined) sliderOpts.animate = true;
    var handle = $("#slider_" + ques).find(".ui-slider-handle");
    if (sliderOpts.create === undefined) {
        sliderOpts.create = function (event, ui) {
            if ($("#" + ques + " [type='radio']:checked").length) {
                var x = +$("#" + ques + " [type='radio']:checked").attr("id").split("_")[1];
                if (x != opts.exclusive) {
                    $(this).slider("value", x);
                    if (handleVisible) handle.text(x);
                    handle.css("background-color", colorAnswered);
                }
            }
        }
    }
    if (sliderOpts.slide === undefined) {
        sliderOpts.slide = function (event, ui) {
            $("#" + quesName + "_" + ui.value).prop("checked", true);
            $("#" + quesName + "_" + opts.exclusive + "_graphical").removeClass("radioboxselected").addClass("radiobox");
            if (handleVisible) handle.text(ui.value);
            handle.css("background-color", colorAnswered);
            $("#slider_" + ques).removeClass("createSlider_style_notAnswered");
        }
    }

    if ('onpageshow' in window) { window.addEventListener('pageshow', createSlider_on_load, false); } else { window.addEventListener('load', createSlider_on_load, false); }
    function createSlider_on_load() { $("#slider_" + ques).slider(sliderOpts); }

    if (opts.handleOnClick === undefined) {
        var handleOnClick = function () {
            var val = $("#slider_" + ques).slider("option", "value");
            $("#" + quesName + "_" + val).prop("checked", true);
            $("#" + quesName + "_" + opts.exclusive + "_graphical").removeClass("radioboxselected").addClass("radiobox");
            if (handleVisible) handle.text(val);
            handle.css("background-color", colorAnswered);
            $("#slider_" + ques).removeClass("createSlider_style_notAnswered");
        }
    } else {
        handleOnClick = opts.handleOnClick;
    }

    handle.on("click", handleOnClick);

    if (opts.exclusive) {
        //OnError
        if (Object.prototype.toString.call(opts.exclusive) != "[object Number]") {
            alert("Ошибка:\nСвойство exclusive должно быть числом!");
            return false;
        }
        //EndOnError

        var $excl = $("#" + quesName + "_" + opts.exclusive);

        $excl.parents("tr:first").show();

        $excl.parents("tr:first").on("click", function () {
            handle.text("");
            handle.css("background-color", "rgb(251, 251, 232)");
            $("#slider_" + ques).removeClass("createSlider_style_notAnswered");
        })
    }

    $("#next_button").on("focus", function () {
        if ($("#" + ques).find("[type='radio']").length) {
            if ($("#" + ques).find("[type='radio']:checked").length == 0) {
                $("#slider_" + ques).addClass("createSlider_style_notAnswered");
            }
        }

        if ($("#" + ques).find("[type='tel']").length) {
            if ($("#" + quesName + "_r1_c1").val() == "" && $("#" + quesName + "_r2_c1").val() == "") {
                $("#slider_" + ques).addClass("createSlider_style_notAnswered");
            }
        }
    })
}

function checkPSM(questions, currQues) {

    if (!Array.isArray(questions)) { throw "Имена вопросов должны передаваться в виде массива."; }
    $.each(questions, function (i, id) {
        if ($("#" + id).length == 0) { throw "Вопрос " + $(this) + " не найден на странице."; }
    })

    var indexes = [];
    $.each(questions, function (i, id) {
        var qDiv = $("#" + id).parents(".question")
        indexes.push($(".question").filter(":not(.text):visible").index(qDiv) + 1)
    })

    var indexCurr = questions.indexOf(currQues)

    if (questions[indexCurr - 1] && SSI_GetValue(questions[indexCurr - 1]) >= SSI_GetValue(questions[indexCurr])) {
        return "Ответ на вопрос должен быть больше ответа на вопрос №" + indexes[indexCurr - 1] + "."
    }
    if (questions[indexCurr + 1] && SSI_GetValue(questions[indexCurr]) >= SSI_GetValue(questions[indexCurr + 1])) {
        return "Ответ на вопрос должен быть меньше ответа на вопрос №" + indexes[indexCurr + 1] + "."
    }

    return "";
}

function checkHowManyOfThem(opts) {

    //opts.answLocation = "inColumns". По строкам пока не делала 
    //opts.colsOrRowsInDescendingOrder = массив из номеров столбцов вопроса на странице по порядку (наприм. [1,2,3])


    checkArguments(arguments, opts);
    var ques = opts.ques;

    var quesDirection = opts.answLocation === undefined ? "inColumns" : opts.answLocation;
    if (quesDirection != "inRows" && quesDirection != "inColumns") {
        throw "answLocation может принимать одно из значений: 'inRows' или 'inColumns'."
    }

    var defaultCols = []
    if (quesDirection == "inColumns") {

        $(`#${ques}_div .inner_table tr:not(.column_header_row):first`)
            .find("[type=tel]")
            .each(function (i, input) {
                defaultCols.push(input.id.split("_")[2].replace("c", ""))
            })

    } else {

        var firstCell = $(`#${ques}_div .inner_table tr:not(.column_header_row):first td.input_cell:first`).find("[type=tel]")
        var colFirstCell = firstCell.attr("id").split("_")[1].replace("r", "")

        $(`[type=tel][id$=_c${colFirstCell}]`)
            .each(function (i, input) {
                defaultCols.push(input.id.split("_")[1].replace("r", ""))
            })

    }

    var colsOrRowsInDescendingOrder = opts.colsOrRowsInDescendingOrder === undefined ? defaultCols : opts.colsOrRowsInDescendingOrder;

    if (!Array.isArray(colsOrRowsInDescendingOrder)) {
        throw "Номера столбцов / строк для проверки должны передаваться в виде массива в порядке убывания максимально возможного значения.";
    }

    err = ""

    if (quesDirection == "inColumns") {

        for (let j = 1; j < colsOrRowsInDescendingOrder.length; j++) {
            let col1 = colsOrRowsInDescendingOrder[j - 1], col2 = colsOrRowsInDescendingOrder[j];

            $(`[id^='${ques}][id$='_c${col2}'][type='tel']`).each(function (i, e) {
                var r = this.id.split("_")[1].replace("r", "");
                let inp1 = $(`#${ques}_r${r}_c${col1}`),
                    inp2 = $(`#${ques}_r${r}_c${col2}`);

                if (+inp2.val() > +inp1.val()) {
                    inp2.focus();
                    err = `Число в столбце №${j + 1} строке №${i + 1} НЕ может превышать число в столбце №${j}.`;
                    return false;
                }

                if (+inp1.val() > 0 && inp2.val() === "" && inp2.is(":visible")) {
                    inp2.focus();
                    err = `Введите число пациентов в столбце №${j + 1} строке №${i + 1}.`;
                    return false;
                }
            })

            if (err) break;
        }

    } else {
        for (let j = 1; j < colsOrRowsInDescendingOrder.length; j++) {
            let row1 = colsOrRowsInDescendingOrder[j - 1], row2 = colsOrRowsInDescendingOrder[j];

            $(`[id^='${ques}][id*='_r${row2}_'][type='tel']`).each(function (i, e) {
                var col = this.id.split("_")[2].replace("c", "");
                let inp1 = $(`#${ques}_r${row1}_c${col}`),
                    inp2 = $(`#${ques}_r${row2}_c${col}`);

                if (+inp2.val() > +inp1.val()) {
                    inp2.focus();
                    err = `Число в строке №${j + 1} столбце №${i + 1} НЕ может превышать число в строке №${j}.`;
                    return false;
                }

                if (+inp1.val() > 0 && inp2.val() === "" && inp2.is(":visible")) {
                    inp2.focus();
                    err = `Введите число пациентов в строке №${j + 1} столбце №${i + 1}.`;
                    return false;
                }
            })

            if (err) break;
        }
    }
    return err;
}

function changeHowManyOfThem(opts) {

    //opts.answLocation = "inColumns".
    //opts.colsOrRowsInDescendingOrder = массив из номеров столбцов вопроса на странице по порядку (наприм. [1,2,3])
    //opts.hiddenValue = ""


    checkArguments(arguments, opts);
    var ques = opts.ques;

    var quesDirection = opts.answLocation === undefined ? "inColumns" : opts.answLocation;
    if (quesDirection != "inRows" && quesDirection != "inColumns") {
        throw "answLocation может принимать одно из значений: 'inRows' или 'inColumns'."
    }

    var hiddenValue = opts.hiddenValue === undefined ? "" : opts.hiddenValue;

    var defaultCols = []
    if (quesDirection == "inColumns") {

        $(`#${ques}_div .inner_table tr:not(.column_header_row):first`)
            .find("[type=tel]")
            .each(function (i, input) {
                defaultCols.push(input.id.split("_")[2].replace("c", ""))
            })

    } else {

        var firstCell = $(`#${ques}_div .inner_table tr:not(.column_header_row):first td.input_cell:first`).find("[type=tel]")
        var colFirstCell = firstCell.attr("id").split("_")[1].replace("r", "")

        $(`[type=tel][id$=_c${colFirstCell}]`)
            .each(function (i, input) {
                defaultCols.push(input.id.split("_")[1].replace("r", ""))
            })

    }

    var colsOrRowsInDescendingOrder = opts.colsOrRowsInDescendingOrder === undefined ? defaultCols : opts.colsOrRowsInDescendingOrder;

    if (!Array.isArray(colsOrRowsInDescendingOrder)) {
        throw "Номера столбцов / строк для проверки должны передаваться в виде массива в порядке убывания максимально возможного значения.";
    }
    for (let j = 0; j < colsOrRowsInDescendingOrder.length; j++) {
        colsOrRowsInDescendingOrder[j] = (colsOrRowsInDescendingOrder[j]).toString()
    }

    if (quesDirection == "inColumns") {

        $(`[id^='${ques}'][type=tel]`).on("keyup", function () { onKeyupByColumns(this, 0) })
        $(`[id^='${ques}'][type=tel]`).each(function () { onKeyupByColumns(this, 1) })

    } else {

        $(`[id^='${ques}'][type=tel]`).on("keyup", function () { onKeyupByRows(this, 0) })
        $(`[id^='${ques}'][type=tel]`).each(function () { onKeyupByRows(this, 1) })

    }

    function onKeyupByColumns(elem, flag) {

        let col = elem.id.split("_")[2].replace("c", "");
        let nCol = colsOrRowsInDescendingOrder.indexOf(col);

        if (nCol < colsOrRowsInDescendingOrder.length - 1) {

            let r = elem.id.split("_")[1].replace("r", "");
            if ($(elem).val() > 0) {
                if ($(`#${ques}_r${r}_c${colsOrRowsInDescendingOrder[nCol + 1]}`).is(":hidden")) {
                    $(`#${ques}_r${r}_c${colsOrRowsInDescendingOrder[nCol + 1]}`).show()
                    if (!flag) {
                        $(`#${ques}_r${r}_c${colsOrRowsInDescendingOrder[nCol + 1]}`).val("")
                    }
                }
            } else {
                for (let j = nCol + 1; j < colsOrRowsInDescendingOrder.length; j++) {
                    $(`#${ques}_r${r}_c${colsOrRowsInDescendingOrder[j]}`).hide().val(hiddenValue)
                }
            }

        }

    }

    function onKeyupByRows(elem, flag) {

        let row = elem.id.split("_")[1].replace("r", "");
        let nRow = colsOrRowsInDescendingOrder.indexOf(row);

        if (nRow < colsOrRowsInDescendingOrder.length - 1) {

            let col = elem.id.split("_")[2].replace("c", "");
            if ($(elem).val() > 0) {
                if ($(`#${ques}_r${colsOrRowsInDescendingOrder[nRow + 1]}_c${col}`).is(":hidden")) {
                    $(`#${ques}_r${colsOrRowsInDescendingOrder[nRow + 1]}_c${col}`).show()
                    if (!flag) {
                        $(`#${ques}_r${colsOrRowsInDescendingOrder[nRow + 1]}_c${col}`).val("")
                    }
                }
            } else {
                for (let j = nRow + 1; j < colsOrRowsInDescendingOrder.length; j++) {
                    $(`#${ques}_r${colsOrRowsInDescendingOrder[j]}_c${col}`).hide().val(hiddenValue)
                }
            }

        }

    }

}

//Полифиллы, расширения
Array.prototype.fillRange = function () {
    try {
        if (this.length < 2) {
            throw new TypeError('Array.fillRange: Длина массива не может быть меньше 2!');
        }
        var min = +this[0], max = +this[1];
        var k = 0, res = [];
        for (var i = min; i <= max; i++) {
            res[k] = i;
            k++
        }
        if (this.length > 2) {
            for (i = 2; i < this.length; i++) {
                res.push(+this[i]);
            }
        }
        return res;
    } catch (err) {
        if (window.console) {
            console.error(err.message)
        } else {
            alert(err.message);
        }
    }
};

function remove() { this.parentNode && this.parentNode.removeChild(this); }
if (!Element.prototype.remove) Element.prototype.remove = remove;
if (Text && !Text.prototype.remove) Text.prototype.remove = remove;