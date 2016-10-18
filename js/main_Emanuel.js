// 2140825- Emanuel Lopes
// 2140816- Ruben Domingues
// 2141387- Ruben Pereira
// Implementation:
'use strict';
(function() {

	const MAX_NUMBER = 9;
	const MIN_NUMBER = 1;

	var timer;
	var board = $(".dad-board input");

	function init(){
		$('#authors-section .photo-zone:last-child').hide();
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


    /* function getLinha(nrLine, number) {
         var line = $('.dad-row:nth-child(' + nrLine + ')', '.dad-board');
         $.each($('.dad-cell', line), function(index, value) {
             console.log(index + " Valor: " + $('input', value).val());
         });
         //console.log("");
     }

     function getColune(nrColumn, number) {
         var column = $('.dad-row', '.dad-board');
         $.each($('.dad-cell:nth-child(' + nrColumn + ')', column), function(index, value) {
             console.log(index + " Valor: " + $('input', value).val());
         });
     }*/

     function renderView(object) {
        //clean old data
        board.val('').removeClass('initial').removeAttr('disabled');

        $.each(object,function(index, el) {
        	$('.dad-cell input[data-line='+el.line+'][data-column='+el.column + ']').val(el.value).addClass('initial').attr('disabled', '');
        });
    }

    function newGame(level) {
    	var loading = $('#loading');
    	var url = 'http://198.211.118.123:8080/board/';
    	url += level;
    	loading.removeClass('invisible');
    	$.get(url, function(results) {
    		console.dir(results);
    		if (results !== undefined) {
    			renderView(results);
    		}
    		//$('#message').append(results.toString());
    	}).fail(function() {
    		alert("API not working, try later.");

    	}).always(function() {
    		loading.addClass('invisible');
    	});

    }

    function messageAlert(text) {
    	var message = $('#dialog');
    	$('#message', message).text(text);

    }

    function checkValueInBoard(value) {
    	$.each(board, function(key, element) {
    		if (element.value == value) {
    			$(board[key]).addClass('highlight');
    		}
    	});
    	start();
    }


    function check(){
    	var jsonArray= [];

    	for(var column = 0; column <= 8; column++){
    		for(var line=0; line<=8; line++){
    			var inputObj = $('.dad-cell input[data-line='+line+'][data-column='+column+']');
    			if(inputObj.val()!==""){
    				var obj ={};
    				obj.line = line;
    				obj.column= column;
    				obj.value = inputObj.val();
    				obj.fixed=(inputObj.hasClass('initial')?true:false);
    				jsonArray.push(obj);
    			}
    		}
    	}
    	console.dir(jsonArray);
    	console.log(JSON.stringify(jsonArray));
    	//$('#message').html(jsonArray.toString());
    	$.post("http://198.211.118.123:8080/board/check",
    		jsonArray, function(data){
    			console.dir(data);
    		})
    	.done(function(data) {
    		console.log( "second success" +data);
    	})
    	.fail(function(data) {
    		console.dir(data);
    	})
    	.always(function() {
    		//alert( "finished" );
    	});
    }

    function start() {
    	timer = setInterval(stopHighLight, 5000);
    }

    function stopHighLight() {
    	clearInterval(timer);
    	clearBoard();
    }

    function clearBoard() {
    	$(board).removeClass('highlight');
    }


    $(function() {

    	init();

    	board.change(function() {
    		if ($(this).val() === "") {
    			$(this).removeClass('with-value',{duration:500});
    			return;
    		}
    		$(this).addClass('with-value',{duration:500});
    		if ($(this).val() > MAX_NUMBER) {
    			$(this).val(MAX_NUMBER);
    		}
    		if ($(this).val() < MIN_NUMBER) {
    			$(this).val(MIN_NUMBER);
    		}

    	});

    	$('#btn-new').click(function() {
    		var level = $('#select-mode option:selected');
    		newGame(level.val());
    	});
    	$('#highlightButtons button').click(function() {
    		stopHighLight();
    		checkValueInBoard(this.value);
    	});

    	$("#btn-check").click(function(){
    		check();
    	});
    });
})();