var here = "";

function ConvertCSV() {
	var file = document.getElementById('infile').files[0];
    if (!file) {
        console.log('No file selected.');
        return;
    }
	
	var fr = new FileReader();
	
	fr.onload = function(){
		downloadContent("test.csv", (fr.result).split(/[ ,]/).toString() );
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
