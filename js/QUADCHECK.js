 var startLine=0,endLine=0,startColumn=0,endColumn=0;
    var lineNr = parseInt(target.attr("data-line"));
    var columnNr= parseInt(target.attr("data-column"));

    switch(lineNr) {
        case 0: case 1: case 2: startLine=0; endLine=2; break;
        case 3: case 4: case 5: startLine=3; endLine=5; break;
        case 6: case 7: case 8: startLine=6; endLine=8; break;
    }

    switch(columnNr) {
        case 0: case 1: case 2: startColumn=0; endColumn=2; break;
        case 3: case 4: case 5: startColumn=3; endColumn=5; break;
        case 6: case 7: case 8: startColumn=6; endColumn=8; break;
    }
    var countQuad=0,l=0,c=0;
    for(l=startLine;l<=endLine;l++){
        for(c=startColumn;c<=endColumn;c++){
            var valueCell = $('.dad-cell input[data-column='+c+']'+'[data-line='+l+']').val();
            if(valueCell !== "" ){
                countQuad++;
            }
        }
    }
    console.log(countQuad);
    if(countQuad == 9){

            // animation Quad
    }