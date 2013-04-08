//Permet de recuperer la liste des adresses correspondant au client

var serviceURL = "http://10.0.2.2:8080/TestRest/rest/";
var listePDF;
var signatureBase64;
var identifiant;
var identidiant2;

$(document).ready( function () { 
	$("#signature").jSignature();
	// recuperer l'id dans l'url et la serialiser
	var $inputs = $("#connexionForm").find("input, select, button, textarea");

	var temp =location.search.split("=");
	identifiant = unescape(temp[1]);

	// serialize the data in the form
	var serializedData = identifiant
	// à la soumission du formulaire						 
	$.ajax({ // fonction permettant de faire de l'ajax
		type: "POST", // methode de transmission des données au fichier php
		url: serviceURL+"importation",// url du fichier du WS
		data: serializedData, // données à transmettre
		datatype:"jsonp",
		success: function(msg){ // si l'appel a bien fonctionné
			var text = '';
			var len = msg.length;
			var pdfs  = $.parseJSON(msg)
			listePDF = pdfs.pdf;

			for(i=0;i<listePDF.length;i++)
			{
				var urlpdf = encodeURI("http://docs.google.com/viewer?url=" +listePDF[i].url );
				$("#listePDF").append("<li><a href=\""+urlpdf+"\">"+listePDF[i].name+"</li>")
			}		
		}
	});

});

function showSignature() {

	var toDele = document.getElementById("printPicture");
	var parent = toDele.parentNode;
	parent.removeChild(toDele);

	$("#displayarea").append("<div id=\"printPicture\"></div>");
	var $sigdiv = $("#signature");
	//	var datapair = $sigdiv.jSignature("getData", "svgbase64") ;
	var datapair = $sigdiv.jSignature("getData", "image");
	alert('data pair 0 : '+datapair[0]);
	alert('data pair 1 : '+datapair[1]);
	signatureBase64 = datapair[1];
	$("#printPicture")
	.append(
			"<div><img src=\"data:" + datapair[0] + "," + datapair[1]+"\"/>" +
			"<br/><form name=\"sendSign\" id=\"sendSign\">" +
			"<input type=\"hidden\" id=\"idClient\" name=\"idClient\" value="+identifiant+" />"+
			"<input type=\"hidden\" id=\"imgSignature\" name=\"imgSignature\" value="+signatureBase64+" />"+
			"</form><button id=\"button_send\" onclick=\"sendSignature()\" class=\"btn btn-info\">Enregistrer</button>" +
	"</div>");

}

function sendSignature(){

	document.getElementById("button_send").style.display="none";
	var $inputs = $("#sendSign").find("input, select, button, textarea");
	// serialize the data in the form
	var serializedData = $("#sendSign").serialize();
	// à la soumission du formulaire						 
	$.ajax({ 
		type: "POST", 
		url: serviceURL+"signature",
		data: serializedData, 
		datatype:"string",
		success: function(msg){ // si l'appel a bien fonctionné
			if(msg=="error") {
				alert('La signature n a pas été enregistrée');
				return false;
			}
			else{
				alert( 'Sauvegarde réussie ! ');
				return false;
			}
		}
	});
}


