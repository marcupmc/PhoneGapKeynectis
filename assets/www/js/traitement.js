
//----------------------------------------VARIABLES---------------------------------------------------------------------------------------------------------------------

//A changer par l'adresse du vrai serveur
var serviceURL = "http://10.0.2.2:8080/TestRest/rest/";
var urlServlet = "http://10.0.2.2:8080/TestRest/"
var identifiant;
var url;
var temp;
var idDoc;

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Fonction d'extraction des paramètres de l'url
function extractUrlParams(){	
	var t = location.search.substring(1).split('&');
	var f = [];
	for (var i=0; i<t.length; i++){
		var x = t[ i ].split('=');
		f[x[0]]=x[1];
	}
	return f;
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

//fonction appelé au chargement de la page
window.onload= function () { 
	var tab = extractUrlParams();
	idDoc = tab['idDoc'];
	url =  tab['url'];
	identifiant=window.localStorage.getItem("identifiant");
	$("#zoneTraitement").append("<a href=\"#\" class=\"btn btn-primary\" " +
			"onclick=\"beginCertification()\">Signer le document</a>");
	loadPage();
};

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

function loadPage(){
    document.getElementById("content1").setAttribute("src","http://docs.google.com/viewer?url="+url);
}


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Démarre la certification des documents
function beginCertification(){
	callRestToTemporisation();
	window.plugins.childBrowser.showWebPage(urlServlet+"CertifierDocument?identifiant="+identifiant+"&id="+idDoc);
	
}

// Appel la fonction qui verifie si le document est certifié sur le serveur
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
		}
	});
	return false;
}