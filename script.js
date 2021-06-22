var here = document.getElementById('here');
var here2 = document.getElementById('here2');
var pbar = document.getElementById("myBar");

var host = document.getElementById('host');
var nombre1 = document.getElementById('nombre1');
var inconnu1 = document.getElementById('inconnu1');
var inconnu2 = document.getElementById('inconnu2');
var nombre2 = document.getElementById('nombre2');
var interface = document.getElementById('interface');
var match = document.getElementById('match');
var interaction = document.getElementById('interaction');
var entrant = document.getElementById('entrant');
var ipv = document.getElementById('ipv');
var code = document.getElementById('code');
var inconnu3 = document.getElementById('inconnu3');
var nombre4 = document.getElementById('nombre4');
var nombre5 = document.getElementById('nombre5');
var nombre6 = document.getElementById('nombre6');
var statut = document.getElementById('statut');
var nombre7 = document.getElementById('nombre7');
var protocole = document.getElementById('protocole');
var nombre8 = document.getElementById('nombre8');
var ipsource = document.getElementById('ipsource');
var ipdestination = document.getElementById('ipdestination');
var portsource = document.getElementById('portsource');
var portdestination = document.getElementById('portdestination');
var nombre11 = document.getElementById('nombre11');	

var slider = document.getElementById("sliderrange");

var hours = Math.floor(slider.value / 60);
var minutes = slider.value % 60;
var seconds = slider.value % 60;

var hourOutput = $("#hours")[0];
var minuteOutput = $("#minutes")[0];
var secondsOutput = $("#seconds")[0];

var hours = Math.floor(slider.value / 60);
var minutes = slider.value % 60;
var seconds = (slider.value * 2) % 60;

hourOutput.value = hours;
minuteOutput.value = minutes
secondsOutput.value = seconds

$('.slider').on('input', function(){
	hours = Math.floor(slider.value / 60);
	minutes = slider.value % 60;
	seconds = (slider.value * 2) % 60;
	hourOutput.value = hours;
	minuteOutput.value = minutes;
	secondsOutput.value = seconds;
});

var grab;
var curoffset = 0;
function DisplayLog(addoffset) {
	var file = document.getElementById('infile').files[0];
    if (!file) {
        console.log('No file selected.');
        return;
    }
    var maxlines = parseInt(document.getElementById('maxlines').value, 10);
	curoffset += addoffset;
	var offset = 50000 * curoffset;
    var lineno = 1;
    // readSomeLines is defined below.
	grab = "";
    readSomeLines(file, maxlines, offset, function(line) {
        //console.log("Line" + lineno + ": " + line);
        grab += "Line" + (lineno++) + ": " + line;
    }, function onComplete() {
        console.log('Read all lines');
		convertjson( grab );
    });
}

document.getElementById('start').onclick = function() {
	curoffset = 0;
    DisplayLog(0);
};

document.getElementById('search').onclick = function() {
	curoffset = 0;
    DisplayLog(0);
};

document.getElementById('timeapply').onclick = function() {
	curoffset = 0;
    DisplayLog(0);
};

/**
 * Read up to and including |maxlines| lines from |file|.
 *
 * @param {Blob} file - The file to be read.
 * @param {integer} maxlines - The maximum number of lines to read.
 * @param {function(string)} forEachLine - Called for each line.
 * @param {function(error)} onComplete - Called when the end of the file
 *     is reached or when |maxlines| lines have been read.
 */
function readSomeLines(file, maxlines, offset, forEachLine, onComplete) {
    var CHUNK_SIZE = 50000; // 50kb, arbitrarily chosen.
    var decoder = new TextDecoder();
    //var offset = 0;
    var linecount = 0;
    var linenumber = 0;
    var results = '';
    var fr = new FileReader();
    fr.onload = function() {
        // Use stream:true in case we cut the file
        // in the middle of a multi-byte character
        results += decoder.decode(fr.result, {stream: true});
        var lines = results.split('\n');
        results = lines.pop(); // In case the line did not end yet.
        linecount += lines.length;
    
        if (linecount > maxlines) {
            // Read too many lines? Truncate the results.
            lines.length -= linecount - maxlines;
            linecount = maxlines;
        }
    
        for (var i = 0; i < lines.length; ++i) {
            forEachLine(lines[i] + '\n');
        }
        offset += CHUNK_SIZE;
        seek();
    };
    fr.onerror = function() {
        onComplete(fr.error);
    };
    seek();
    
    function seek() {
        if (linecount === maxlines) {
            // We found enough lines.
            onComplete(); // Done.
            return;
        }
        if (offset !== 0 && offset >= file.size) {
            // We did not find all lines, but there are no more lines.
            forEachLine(results); // This is from lines.pop(), before.
            onComplete(); // Done
            return;
        }
        var slice = file.slice(offset, offset + CHUNK_SIZE);
        fr.readAsArrayBuffer(slice);
    }
}
/*
var txt ='abc123, 234 pqr,xyz "type"\nbc123, 234 pqr,xyz "type"\nc123, 234pqr,xyz "type"\nn23, 234 pqr,xyz "type"\naj23, 234 pqr,xyz "type"'
function table_maker(){
var rows=txt.split('\n'), r, cells, c, j, i=0;
var table='<table>';
while(r=rows[i++]){
table+='<tr>';
cells=r.split(',');
j=0;
while(c=cells[j++]){
table+=('<td>'+c+'</td>');
}
table+='</tr>';
}
table+='</table>';
//return table;
document.getElementById("T1").innerHTML=table;
}
*/

var log1;
var storage;
function convertjson(content) {
	//var str = "Line Month Day Time IP Filterlog Values\n" + content;
	var str = "Line Month Day Time Host Filterlog Nombre1,Inconnu1,Inconnu2,Nombre2,Interface,Match,Interaction,Entrant,IPV,Code,Inconnu3,Nombre4,Nombre5,Nombre6,Status,Nombre7,Protocole,Nombre8,IPsource,IPdestination,Portsource,Portdestination,Nombre11\n" + content;
	//var cells = str.split('\n').map(function (el) { return el.split(/\s+/); });
	var cells = str.split('\n').map(function (el) { return el.split(/[ ,]/); });
	//console.log( "CELLS: ", cells );
	var headings = cells.shift();
	//console.log( "HEADINGS: ", headings );
	var out = cells.map(function (el) {
	  let obj = {};
	  for (var i = 0, l = el.length; i < l; i++) {
		obj[headings[i]] = isNaN(Number(el[i])) ? el[i] : +el[i];
	  }
	  return obj;
	});
	
	log1 = JSON.stringify(out, null, 2);
	
	console.log( "PROCESSED: ", out);
	
	here.innerHTML = "";
	
	var addmore = 0;
	var counting = 0;
	storage = "";
	// current/max = (current x (100/max))/(max x (100/max)) = 16/100
	pbar.style.width = "0%";
	var pbarsize = 0;
	var offsetlines = false;
	for(var i = 0; i < out.length; i++) {
		//pbar.style.width = (i*(100/out.length)) + "%";
		pbarsize = (i*(100/out.length));
		//console.log(pbarsize);
		move( pbarsize );
		var obj = out[i];
		
		//console.log( obj );	
		if ( typeof obj.Month !== 'undefined' ) {
			if ( obj.Line != 'Line1:' ) {
				var time = (obj.Time).split(':');
				if (Number(time[0]) < hours) {
					offsetlines = true;
					continue;
				}
				if (Number(time[1]) < minutes) {
					offsetlines = true;
					continue;
				}
				if (Number(time[2]) < seconds) {
					offsetlines = true;
					continue;
				}
			} else {
				continue;
			}
			
			//console.log(typeof statut.value);
			//console.log(statut.value);
			//console.log(obj.Status);
			if ( host.value != '' && host.value != obj.Host) { addmore++; continue; }
			if ( inconnu1.value != '' && inconnu1.value != obj.Inconnu1) { addmore++; continue; }
			if ( inconnu2.value != '' && inconnu2.value != obj.Inconnu2) { addmore++; continue; }
			if ( nombre2.value != '' && nombre2.value != obj.Nombre2) { addmore++; continue; }
			if ( interface.value != '' && interface.value != obj.Interface) { addmore++; continue; }
			if ( match.value != '' && match.value != obj.Match) { addmore++; continue; }
			if ( interaction.value != '' && interaction.value != obj.Interaction) { addmore++; continue; }
			if ( entrant.value != '' && entrant.value != obj.Entrant) { addmore++; continue; }
			if ( ipv.value != '' && ipv.value != obj.IPV) { addmore++; continue; }
			if ( code.value != '' && code.value != obj.Code) { addmore++; continue; }
			if ( inconnu3.value != '' && inconnu3.value != obj.Iconnu3) { addmore++; continue; }
			if ( nombre4.value != '' && nombre4.value != obj.Nombre4) { addmore++; continue; }
			if ( nombre5.value != '' && nombre5.value != obj.Nombre5) { addmore++; continue; }
			if ( nombre6.value != '' && nombre6.value != obj.Nombre6) { addmore++; continue; }
			if ( statut.value != '' && statut.value != obj.Status) { addmore++; continue; }
			if ( nombre7.value != '' && nombre7.value != obj.Nombre7) { addmore++; continue; }
			if ( protocole.value != '' && protocole.value != obj.Protocole) { addmore++; continue; }
			if ( nombre8.value != '' && nombre8.value != obj.Nombre8) { addmore++; continue; }
			if ( ipsource.value != '' && ipsource.value != obj.IPsource) { addmore++; continue; }
			if ( ipdestination.value != '' && ipdestination.value != obj.IPdestination) { addmore++; continue; }
			if ( portsource.value != '' && portsource.value != obj.Portsource) { addmore++; continue; }
			if ( portdestination.value != '' && portdestination.value != obj.Portdestination) { addmore++; continue; }
			if ( nombre11.value != '' && nombre11.value != obj.Nombre11) { addmore++; continue; }
			
			SendLine(obj);
			counting++;
		}
	}
	if (counting == 0) {
		if (offsetlines) {
			DisplayLog(1);
			here.innerHTML = "searching...";
		} else {
			here.innerHTML = "no line found";
		}
	} else {
		here.innerHTML = storage;
	}
	
	//console.log(counting);
	//console.log(addmore);
	//here2.value = log1;
}

function SendLine(obj) {
	console.log("hello");
	storage += "<div class='time'>" + obj.Time + " |</div>&nbsp;<span style='color:fuchsia'>" + obj.Host + "</span>&nbsp;";
	storage += "<span>" + obj.Nombre1 + "</span>&nbsp;";
	storage += "<span>" + obj.Inconnu1 + "</span>&nbsp;";
	storage += "<span>" + obj.Inconnu2 + "</span>&nbsp;";
	storage += "<span>" + obj.Nombre2 + "</span>&nbsp;";
	storage += "<span style='color:deepskyblue'>" + obj.Interface + "</span>&nbsp;";
	storage += "<span style='color:deepskyblue'>" + obj.Match + "</span>&nbsp;";
	storage += "<span style='color:deepskyblue'>" + obj.Interaction + "</span>&nbsp;";
	storage += "<span style='color:deepskyblue'>" + obj.Entrant + "</span>&nbsp;";
	storage += "<span style='color:orange'>" + obj.IPV + "</span>&nbsp;";
	storage += "<span>" + obj.Code + "</span>&nbsp;";
	storage += "<span>" + obj.Inconnu3 + "</span>&nbsp;";
	storage += "<span>" + obj.Nombre4 + "</span>&nbsp;";
	storage += "<span>" + obj.Nombre5 + "</span>&nbsp;";
	storage += "<span>" + obj.Nombre6 + "</span>&nbsp;";
	storage += "<span style='color:yellowgreen'>" + obj.Status + "</span>&nbsp;";
	storage += "<span>" + obj.Nombre7 + "</span>&nbsp;";
	storage += "<span style='color:green'>" + obj.Protocole + "</span>&nbsp;";
	storage += "<span>" + obj.Nombre8 + "</span>&nbsp;";
	storage += "<span style='color:red'>" + obj.IPsource + "</span>&nbsp;";
	storage += "<span style='color:green'>" + obj.IPdestination + "</span>&nbsp;";
	storage += "<span style='color:orangered'>" + obj.Portsource + "</span>&nbsp;";
	storage += "<span style='color:green'>" + obj.Portdestination + "</span>&nbsp;<br>";
}

var i = 0;
function move(by) {
  if (i == 0) {
    i = 1;
	
    var width = 1;
    var id = setInterval(frame, 1);
    function frame() {
      if (width >= by) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        //width = by;
        pbar.style.width = width + "%";
      }
    }
  }
}

function downloadContent(name, content) {
  var atag = document.createElement("a");
  var file = new Blob([content], {type: 'text/csv'});
  atag.href = URL.createObjectURL(file);
  atag.download = name;
  atag.click();
}

//downloadContent("t1.csv","hello world");