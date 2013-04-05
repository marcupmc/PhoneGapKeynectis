//Permet de recuperer la liste des adresses correspondant au client

var serviceURL = "http://10.0.2.2:8080/TestRest/rest/";
var listePDF;

$(document).ready( function () { 

	// recuperer l'id dans l'url et la serialiser
	var $inputs = $("#connexionForm").find("input, select, button, textarea");

	var temp =location.search.split("=");
	var identifiant = unescape(temp[1]);

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