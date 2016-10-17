// 2140825- Emanuel Lopes
// 2140816- Ruben Domingues
// 2140002- Ruben Pereira

// Implementation:
'use strict';
(function(){
		var timer;
		var board = $(".dad-board input");

		function checkValueInBoard(value){
			var exist = false;

			$.each(board, function(key, element) {
				if(element.value == value){
 						$(board[key]).addClass('highlight');
 						exist = true;
    				}
			});
			
			if(exist==true){
				start();
			}
		}

		function start(){
			timer = setInterval(stopHighLight, 5000);
		}

		function stopHighLight(){
			clearInterval(timer);
			clearBoard();
		}

		function clearBoard(){
			$(board).removeClass('highlight');
		}

		$(function(){

			var btn1 = $( "#highlightButtons button").click(function(){
			stopHighLight();
			checkValueInBoard(this.value);
		});


	});

})();




