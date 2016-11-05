// 2140825- Emanuel Lopes
// 2140816- Ruben Domingues
// 2141387- Ruben Pereira
// Implementation:
//so para ter novo update
'use strict';
(function() {
    const MAX_NUMBER = 9;
    const MIN_NUMBER = 1;
    const URL_API = 'http://198.211.118.123:8080';
    var timerGame;
    var timerHighLight;
    var board = $('.dad-board input');
    var gameRun = false;

    function init() {
        $('.photo-zone:last-child', '#authors-section').hide();
        // User 1
        $('.photo-zone:nth-child(2) h3', '#authors-section ').text('2140825');
        $('.photo-zone:nth-child(2) p', '#authors-section ').text('Emanuel Lopes');
        // User 2
        $('.photo-zone:nth-child(3) h3', '#authors-section ').text('2140816');
        $('.photo-zone:nth-child(3) p', '#authors-section ').text('Ruben Domingues');
        // User 3
        $('.photo-zone:nth-child(4) h3', '#authors-section ').text('2141387');
        $('.photo-zone:nth-child(4) p', '#authors-section ').text('Ruben Pereira');
    }

    function renderView(object) {
        //clean old data
        board.val('').removeClass('initial individual-conflict with-value finished individual-highlight').removeAttr('disabled');
        $.each(object, function(index, element) {
            $('.dad-cell input[data-line=' + element.line + '][data-column=' + element.column + ']').val(element.value).addClass('initial').attr('disabled', '');
        });
    }

    function newGame(level) {
        var loading = $('#loading');
        var url = URL_API + '/board/';
        url += level;
        loading.removeClass('invisible');
        $('#btn-new').prop('disabled', true);
        $.get(url).done(function(results) {
            if (results !== undefined) {
                renderView(results);
            }
        }).fail(function() {
            alert('API not working, try later.');
        }).always(function() {
            loading.addClass('invisible');
            $('#btn-new').prop('disabled', false);
        });
        timerGame = moment();
        gameRun = true;
    }

    function messageAlert(text) {
        $('#time').text('Time: ' + moment(moment().diff(timerGame)).format('HH:mm:ss'));
        $('#message').text(text);
        var dialog = $('#dialog').dialog({
            modal: true,
            buttons: {
                Ok: function() {
                    dialog.dialog('close');
                }
            },
            show: {
                effect: 'bounce',
                duration: 1000
            },
            hide: {
                effect: 'clip',
                duration: 500
            }
        });
    }

    function checkValueInBoard(value) {
        if (gameRun === false) return;
        board.filter(function(index, element) {
            return ($(element).val() === value);
        }).addClass('highlight');
        start();
    }

    function check() {
        if (gameRun === false) return;
        var loading = $('#loading');
        loading.removeClass('invisible');
        var jsonArray = [];
        board.removeClass('individual-conflict');
        $.each(board, function(index, element) {
            if ($(element).val() !== '') {
                var obj = {};
                obj.line = $(element).data('line');
                obj.column = $(element).data('column');
                obj.value = $(element).val();
                obj.fixed = ($(element).hasClass('initial') ? true : false);
                jsonArray.push(obj);
            }
        });
        $.ajax({
            type: 'POST',
            url: URL_API + '/board/check',
            data: JSON.stringify(jsonArray),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        }).done(function(msg) {
            msg.conflicts.forEach(function(element) {
                $('.dad-cell input[data-line=' + element.line + '][data-column=' + element.column + ']').addClass('individual-conflict');
            });
            if (msg.conflicts.length === 0 && msg.finished === true) {
                $('.with-value').addClass('finished');
                messageAlert('Game Won, congratulations!!');
                gameRun = false;
            }
        }).fail(function() {
            alert('API not working, try later.');
        }).always(function() {
            loading.addClass('invisible');
        });
        start();
    }

    function start() {
        timerHighLight = setInterval(stopHighLight, 5000);
    }

    function stopHighLight() {
        clearInterval(timerHighLight);
        clearBoard();
    }

    function clearBoard() {
        $(board).removeClass('highlight individual-conflict');
    }

    function animation(target, start, end) {
        $.each(target, function(index) {
            var targetElement = $(target[index]);
            if (start !== 'undefined' && end !== 'undefined') {
                if (targetElement.attr('data-line') < start || targetElement.attr('data-line') > end) {
                    return;
                }
            }
            //check limits of line
            targetElement.parent().stop().animate({
                backgroundColor: 'rgba(234,162,89,1)'
            }, (index + 1) * 100, 'linear', function() {
                targetElement.parent().stop().animate({
                    backgroundColor: ''
                }, (index + Math.round(100 / 60)) * 300);
            });
        });
    }

    function checkIfRepeated(target) {
        var array = [];
        target.each(function(index) {
            var targetElement = $(target[index]);
            array.push(targetElement.val());
        });
        array = $.unique(array);
        if (array.length == 9) {
            return true;
        }
        return false;
    }

    function checkAnimation(target) {
        //check line
        var countNrLine = 0,
            countNrColumn = 0;
        var lineNr = parseInt(target.attr('data-line'));
        var columnNr = parseInt(target.attr('data-column'));
        var line = $('.dad-cell input[data-line=' + lineNr + ']');
        var column = $('.dad-cell input[data-column=' + columnNr + ']');
        countNrLine = $(line).filter(function(index, element) {
            return $(element).val();
        }).length;
        if (countNrLine == 9) {
            if (checkIfRepeated(line)) {
                animation(line);
            }
        }
        countNrColumn = $(column).filter(function(index, element) {
            return $(element).val();
        }).length;
        if (countNrColumn == 9) {
            if (checkIfRepeated(column)) {
                animation(column);
            }
        }
        var quadColumn = quad(columnNr);
        var quadLine = quad(lineNr);
        var countQuad = 0;
        var array = [];
        for (line = quadLine.start; line <= quadLine.end; line++) {
            for (column = quadColumn.start; column <= quadColumn.end; column++) {
                var valueCell = $('.dad-cell input[data-column=' + column + ']' + '[data-line=' + line + ']').val();
                if (valueCell !== '') {
                    countQuad++;
                }
                array.push($('.dad-cell input[data-column=' + column + ']' + '[data-line=' + line + ']').val());
            }
        }
        if (countQuad == 9) {
            //check if has repeated numbers
            array = $.unique(array);
            if (array.length == 9) {
                for (column = quadColumn.start; column <= quadColumn.end; column++) {
                    var obj = $('.dad-cell input[data-column=' + column + ']');
                    animation(obj, quadLine.start, quadLine.end);
                }
            }
        }
    }
    var quad = function(target) {
        var start, end;
        switch (target) {
            case 0:
            case 1:
            case 2:
                start = 0;
                end = 2;
                break;
            case 3:
            case 4:
            case 5:
                start = 3;
                end = 5;
                break;
            case 6:
            case 7:
            case 8:
                start = 6;
                end = 8;
                break;
        }
        return {
            start: start,
            end: end
        };
    };
    $(function() {
        init();
        board.change(function(event) {
            if (gameRun === false) return;
            board.removeClass('individual-conflict');
            if ($(event.target).val() === '') {
                $(event.target).removeClass('with-value individual-highlight individual-conflict', {
                    duration: 500
                });
                return;
            }

            if ($(event.target).val() > MAX_NUMBER) {
                $(event.target).val('');
                return;
            }
            if ($(event.target).val() < MIN_NUMBER) {
                $(event.target).val('');
                return;
            }
            $(event.target).addClass('with-value', {
                duration: 500
            });
            checkAnimation($(event.target));
        });
        board.dblclick(function(event) {
            if ($(event.target).val() === '') return;
            $(event.target).toggleClass('individual-highlight');
        });
        $('#btn-new').click(function() {
            newGame($('#select-mode option:selected').val());
        });
        $('#btn-check').click(function() {
            stopHighLight();
            check();
        });
        $('#highlightButtons button').click(function(event) {
            stopHighLight();
            checkValueInBoard($(event.target).val());
        });
    });
})();