// 2140825- Emanuel Lopes
// 2140816- Ruben Domingues
// 2141387- Ruben Pereira
// Implementation:
'use strict';
(function() {
	const MAX_NUMBER = 9;
	const MIN_NUMBER = 1;
	const URL_API = 'http://198.211.118.123:8080';
	var timerGame;
	var timerHighLight;

	var board = $('.dad-board input');

	function init() {
		$('.photo-zone:last-child','#authors-section').hide();
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
        $.each(object, function(index, el) {
        	$('.dad-cell input[data-line=' + el.line + '][data-column=' + el.column + ']').val(el.value).addClass('initial').attr('disabled', '');
        });
    }

    function newGame(level) {
    	var loading = $('#loading');
    	var url = URL_API + '/board/';
    	url += level;
    	loading.removeClass('invisible');
    	$('#btn-new').prop('disabled', true);
    	$.get(url)
    	.done(function(results){
    		if (results !== undefined) {
    			renderView(results);
    		}
    	})
    	.fail(function() {
    		alert('API not working, try later.');
    	}).always(function() {
    		loading.addClass('invisible');
    		$('#btn-new').prop('disabled', false);
    	});
    	timerGame = moment();
        console.log(timerGame.format('HH:mm:ss'));
    }

    function messageAlert(text) {
    	$('#time').text('Time: ' + moment(moment().diff(timerGame)).format('HH:mm:ss'));
    	$('#message').text(text);

    	$('#dialog').dialog({
    		modal: true,
    		buttons: {
    			Ok: function() {
    				$(this).dialog('close');
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
        board.filter(function(){
           return ($(this).val()===value);
        }).addClass('highlight');
        start();
        messageAlert("ola");
    }

    function check() {
    	var loading = $('#loading');
    	loading.removeClass('invisible');
    	var jsonArray = [];
    	board.removeClass('individual-conflict');

    	$.each(board, function(){
    		if($(this).val()!==''){
    			var obj = {};
    			obj.line = $(this).data('line');
    			obj.column = $(this).data('column');
    			obj.value = $(this).val();
    			obj.fixed = ($(this).hasClass('initial') ? true : false);
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
    		if(msg.conflicts.length === 0 && msg.finished === false){
    			$('.with-value').addClass('finished');
    			messageAlert('Game Won, congratulations!!');
    		}
    	})
    	.fail(function() {
    		alert('API not working, try later.');
    	})
    	.always(function() {
    		loading.addClass('invisible');
    	});

    }

    function start() {
    	timerHighLight = setInterval(stopHighLight, 5000);
    }

    function stopHighLight() {
    	clearInterval(timerHighLight);
    	clearBoard();
    }

    function clearBoard() {
    	$(board).removeClass('highlight');
    }

    $(function() {
    	init();
    	board.change(function() {
    		board.removeClass('individual-conflict');
    		if ($(this).val() === '') {
    			$(this).removeClass('with-value individual-highlight individual-conflict', {
    				duration: 500
    			});
    			return;
    		}
    		$(this).addClass('with-value', {
    			duration: 500
    		});
    		if ($(this).val() > MAX_NUMBER) {
    			$(this).val(MAX_NUMBER);
    		}
    		if ($(this).val() < MIN_NUMBER) {
    			$(this).val(MIN_NUMBER);
    		}
    	});

    	board.dblclick(function() {
    		if ($(this).val() === '') return;
    		$(this).toggleClass('individual-highlight');
    	});

    	$('#btn-new').click(function() {
    		newGame($('#select-mode option:selected').val());
    		//$('btn-new').removeAttr('disable');
    		//messageAlert('Game Won, congratulations!!');
    	});
    	$('#btn-check').click(function() {
    		check();
    	});
    	$('#highlightButtons button').click(function() {
    		stopHighLight();
    		checkValueInBoard($(this).val());
    	});
    });
})();
