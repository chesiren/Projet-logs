var here = "";

function ConvertCSV() {
	var file = document.getElementById('infile').files[0];
    if (!file) {
        console.log('No file selected.');
        return;
    }
	
	var fr = new FileReader();
	
	fr.onload = function(){
		var storage = "";
		var splitted = (fr.result).replace(/[ ]/g, ",");
		
		var lines = splitted.split('\r\n');
		for(var i = 0; i < lines.length; i++){
			
			var fix = lines[i].split(/[ ,]/);
			if ( fix[13] == 4 || fix[13] == 6) {
				fix.splice(0, 2); // day & month
				fix.splice(1, 2); // host & filterlog
			}
			storage += fix.toString()+"\r\n";
		}
		
		downloadContent("test.csv", storage );
	} 
	  
	fr.readAsText(file);
}

document.getElementById('start').onclick = function() {
    ConvertCSV();
};

function downloadContent(name, content) {
	var atag = document.createElement("a");
	var file = new Blob([content], {type: 'text/csv'});
	atag.href = URL.createObjectURL(file);
	atag.download = name;
	atag.click();
}
