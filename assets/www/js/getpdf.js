//Permet de recuperer la liste des adresses correspondant au client

var serviceURL = "http://10.0.2.2:8080/TestRest/rest/";
var listePDF;
var signatureBase64;
var identifiant; 
var identidiant2; 

//Variables keynectis
var blob;


$(document).ready( function () { 
	if(window.localStorage.getItem("identifiant")==-1){
		alert('Veuillez vous authentifier');
		document.location.href="index.html";
	}else{
		$("#signature").jSignature();


		// recuperer l'id dans l'url et la serialiser
		var $inputs = $("#connexionForm").find("input, select, button, textarea");

		var temp =location.search.split("=");
		identifiant = unescape(temp[1]);

		// serialize the data in the form
		var serializedData = identifiant
		// à la soumission du formulaire						 
		$.ajax({ 
			type: "POST", 
			url: serviceURL+"importation",
			data: serializedData,
			datatype:"jsonp",
			success: function(msg){ 
				var text = '';
				var len = msg.length;
				var pdfs  = $.parseJSON(msg)
				listePDF = pdfs.pdf;
				var firstnameUser  =pdfs.firstName;
				var lastnameUser =  pdfs.lastName;
				$("#title").append("Bonjour "+firstnameUser +" "+lastnameUser );
				$("#certificationForm").append("<input type=\"hidden\" id=\"nbDoc\" name=\"nbDoc\" value=\""+listePDF.length+"\" />");
				for(i=0;i<listePDF.length;i++)
				{
					var namePdf = listePDF[i].name;
					var isCertified = listePDF[i].isCertified;

					var certifiedFR;
					var lastColumn;
					var urlTemp =encodeURI(listePDF[i].url);
					
					if(!isCertified){
						certifiedFR= "non";
						lastColumn = "<td><input type=\"checkbox\" id=\"check"+i+"\" name=\""+urlTemp+"\" value=\""+listePDF[i].id+"\"/></td>";
					}
					else{
						certifiedFR= "oui";
						lastColumn = "<td><input disabled=\"disabled\" type=\"checkbox\" id=\"check"+i+"\" name=\""+urlTemp+"\" value=\""+listePDF[i].id+"\"/></td>";
					}
					var urlpdf = encodeURI("http://docs.google.com/viewer?url=" +listePDF[i].url );
					$("#listePDF").append("<tr><td><a href=\""+urlpdf+"\">"+namePdf+"</a></td><td>"+certifiedFR+"</td>"+lastColumn+"</tr>")
				}
				if(pdfs.signature=="null"){	
					document.getElementById("certifier").style.display="none";
					$("#displayarea").append("<div id=\"message\" class=\"alert alert-info\"><p>Aucune signature enregistrée. " +
					"Pour saisir votre signature, cliquez sur \"Editer votre signature\"</p></div>");
				}else{
					$("#displayarea").append("<div id=\"message\"></div>");
					$("#printPicture").append("<img src=\"data:image/png;base64,"+pdfs.signature+"\"/>");
				}

			}
		});
	}
}); 

function showSignature() {

	$('#myModal').modal('hide');

	var toDele = document.getElementById("printPicture");
	var parent = toDele.parentNode;
	parent.removeChild(toDele);

	var toDele2 =document.getElementById("message");
	var parent2 = toDele2.parentNode;
	parent2.removeChild(toDele2);

	$("#displayarea").append("<div id=\"message\"></div><div id=\"printPicture\"></div>");
	var $sigdiv = $("#signature");
	var datapair = $sigdiv.jSignature("getData", "image");
	signatureBase64 = datapair[1];

	$("#printPicture")
	.append(
			"<div><img src=\"data:" + datapair[0] + "," + datapair[1]+"\"/>" +
			"<br/><form name=\"sendSign\" id=\"sendSign\">" +
			"<input type=\"hidden\" id=\"idClient\" name=\"idClient\" value="+identifiant+" />"+
			"<input type=\"hidden\" id=\"imgSignature\" name=\"imgSignature\" value="+signatureBase64+" />"+
			"</form><button id=\"button_send\" onclick=\"sendSignature()\" class=\"btn btn-info\">Enregistrer</button>" +
	"</div>");
	document.getElementById("certifier").style.display="inline";

}

//Fonction appelée lorsque l'on clique sur le bouton "Effacer"
function resetSignature(){
	$("#signature").jSignature("reset");
}

//------------------------------------------------------------------------

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

function certification(){
	$("#certificationForm").submit( function() { 
//		document.location.href="http://10.0.2.2:8080/TestRest/CertifierDocument";
//		return false;
		var nbDoc = $('#nbDoc').val();
//		var toSend="{\"identifiant\" :\""+identifiant+"\",\"pdfs\" :[";
//		var nbChecked=0
//
		var idTosend;
		var urlToSend;
		for(i=0;i<nbDoc;i++)
		{
			var chk = document.getElementById("check"+i);
			if(chk.checked){
//				if(nbChecked>0)
//				{
//					toSend+=",";
//				} 
//				nbChecked++;
				//toSend += "{\"url\" : \""+$("#check"+i).val()+"\"}";
				idTosend = $("#check"+i).val();
			//	urlToSend  = $("#check"+i).attr('name');
				urlToSend = document.getElementById("check"+i).getAttribute("name");
			}
		}
		//Ajout
		document.location.href="traitement.html?idDoc="+idTosend+"&url="+urlToSend;
		
		return false;
	});
}  
 
function  deconnexion(){
	window.localStorage.setItem("identifiant",-1);
	alert('Deconnexion réussie !');
	document.location.href="index.html";
}

function sendToKeynectis(){
		//Avant
//	var elem = $("#blob");
//	elem.val(blob);
	//document.getElementById("myForm").submit();

	//Apres
	//document.location.href="traitement.html?blob="+blob+"";
	document.location.href="traitement.html";
}

function callRestToTemporisation(){
//	$.ajax({ 
//	type: "GET", 
//	url:"http://10.0.2.2:8080/TestRest/CertifierDocument",
//	data:"",
//	datatype:"json",
//	async: true,
//	success: function(msg){
//	});
	console.log("TEST");
	alert('GO');
	$.ajax({ 
		type: "POST", 
		url: serviceURL+"temporisation",
		data: "toto", 
//		async:true,
		datatype:"string",
		success: function(msg){
			console.log('hello??');
			window.plugins.childBrowser.close();
			document.location.href="home.html?id="+identifiant+"";
		}
	});
	return false;
}

function submitMethode1(){
	$("#formMethode1").submit();
}


