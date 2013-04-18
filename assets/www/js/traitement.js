var serviceURL = "http://10.0.2.2:8080/TestRest/rest/";
var identifiant;
var url;
var temp;
var idDoc;


function extractUrlParams(){	
	var t = location.search.substring(1).split('&');
	var f = [];
	for (var i=0; i<t.length; i++){
		var x = t[ i ].split('=');
		f[x[0]]=x[1];
	}
	return f;
}

window.onload= function () { 
	var tab = extractUrlParams();
	
	idDoc = tab['idDoc'];
	url =  tab['url'];
	
	identifiant=window.localStorage.getItem("identifiant");
	
//	$("#zoneTraitement").append("<a href=\"#\" class=\"btn btn-primary\" " +
//			"onclick=\"window.plugins.childBrowser.showWebPage('http://10.0.2.2:8080/TestRest/CertifierDocument?identifiant="+identifiant+"&url="+url+"');\">Signer le document</a>");
//	
	$("#zoneTraitement").append("<a href=\"#\" class=\"btn btn-primary\" " +
			"onclick=\"beginCertification()\">Signer le document</a>");
	
	loadPage();
};

function loadPage(){
	//http://docs.google.com/viewer?url=
    document.getElementById("content1").setAttribute("src","http://docs.google.com/viewer?url="+url);
}

//Mettre ici un processus d'ecoute du serveur


function beginCertification(){
	callRestToTemporisation();
	window.plugins.childBrowser.showWebPage("http://10.0.2.2:8080/TestRest/CertifierDocument?identifiant="+identifiant+"&id="+idDoc);
	
}
function callRestToTemporisation(){
	
	$.ajax({ 
		type: "POST", 
		url: serviceURL+"temporisation",
		data: idDoc, 
		//async:true,
		datatype:"string",
		success: function(msg){
			if(msg=="ok"){
				window.plugins.childBrowser.close();
				document.location.href="home.html?id="+identifiant+"";
		}
			else{
				callRestToTemporisation();
			}
			//document.location.href="home.html?id="+identifiant+"";
		}
	});
	return false;
}