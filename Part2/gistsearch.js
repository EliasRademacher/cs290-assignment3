var gistList = [];
var http_request = false;

/* The basic structure of this function was taken from 
https://developer.mozilla.org/en-US/docs/Traversing_an_HTML_table_with_JavaScript_and_DOM_Interfaces */

function getGists() {
	/* Do the XMLHttpRequest here and keep the result in the originalGistList.
	When you got the data, you need to iterate over them and call the 
	function from the next step inside it per gist to generate the 
	html content (generateGistHtml) */
	
	
	http_request = false;
	var url = "https://api.github.com/gists/public";
	
	/* since: A string containing a timestamp in ISO 8601 format: 
		YYYY-MM-DDTHH:MM:SSZ. Only gists updated at or after this time 
		are returned. */
	var since = "2015-04-26T01:37:17Z"	

	if (window.XMLHttpRequest) { // Mozilla, Safari,...
		http_request = new XMLHttpRequest();
		if (http_request.overrideMimeType) {
			http_request.overrideMimeType('text/xml');
		}
	} else if (window.ActiveXObject) { // IE
		try {
			http_request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
			http_request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
	}

	if (!http_request) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}
	http_request.onreadystatechange = createGistList;
	http_request.open('GET', url, true);
	http_request.send(null);
}

function createGistList() {
	if (http_request.readyState == 4) {
		if (http_request.status == 200) {
			var responseObj = JSON.parse(this.responseText);
			GenerateListHTML(document.getElementById("gists"), responseObj);
		}
		
		else {
			alert('There was a problem with the request.');
		}
	}
}

var GenerateListHTML = function (dl, responseObj) {
	var listHeight = 0;
	dl.style.height = String(listHeight) + "px";
	
	for (var i = dl.childNodes.length - 1; i >= 0; i--) {
		dl.removeChild(dl.childNodes[i]);
	}
	
	var counter = 0;
	for (var i in responseObj) {
		
		var btn = document.createElement("BUTTON");		
		btn.style.height = "25px";
		btn.style.width = "25px";
		btn.style.alignSelf = "center";
		btn.style.backgroundColor = "#6666FF";
		btn.style.color = "white";
		btn.style.borderRadius = "5px";
		var plusSign = document.createTextNode("+");
		btn.className = "gist" + String(counter);
		btn.onclick = addToFavorites;
		btn.appendChild(plusSign); 		
		dl.appendChild(btn);
		
		var dt = document.createElement('dt');
		dt.style.display = "inline";
		dt.style.marginLeft = "10px";
		dt.className = "gist" + String(counter);
		var textnode = document.createTextNode(responseObj[i].description);
		if (textnode.data == "")
			textnode.data = "no description";
		dt.appendChild(textnode);
		dl.appendChild(dt)
		
		var dd = document.createElement('dd');
		textnode = document.createTextNode(responseObj[i].url);
		dd.style.fontSize = "smaller";
		dd.style.color = "#6666FF";
		dd.className = "gist" + String(counter);
		dd.appendChild(textnode);
		dl.appendChild(dd);

		dd.style.paddingBottom = "20px";
		listHeight += 70;
		dl.style.height = String(listHeight) + "px";
		
		counter++;
	}
}

var addToFavorites = function() {
	var gist = document.querySelectorAll("." + this.className);
	var dl = document.getElementById("favored-gists");
	dl.appendChild(gist[0]);
	dl.appendChild(gist[1]);
	dl.appendChild(gist[2]);
	
	gistObj = {
		"description": "empty",
		"url": "empty"	
	};
		
	gistObj.description = gist[1].childNodes[0].data;
	gistObj.url = gist[2].childNodes[0].data;
	
	JSON.stringify(gistObj);
	gistList = localStorage.getItem('gistList');
	var originalGistObj = JSON.parse(gistList);
	for (var k = 0; k < gistList.length; k++) {
		if (originalGistObj.gistList[k] == null)
			originalGistObj.gistList[k] = gistObj;
	}
	
	localStorage.setItem('gistList', JSON.stringify(originalGistObj));
}

window.onload = function() {
	var gistString = localStorage.getItem('gistList');
	if (gistString === null) {
		var gistObj = {'gistList': []};
		localStorage.setItem('gistList', JSON.stringify(gistObj))
	}
	
	else {
		gistObj = JSON.parse(gistString);
		var dl = document.getElementById("favored-gists");
		localStorage.getItem('gistList');
		// for (var i in gistObj) {
			// dl.appendChild(gistObj[i][0]);
			// dl.appendChild(gistObj[i][1]);
			// dl.appendChild(gistObj[i][2]);
		// }
	}
	
	
	
	getGists();
}