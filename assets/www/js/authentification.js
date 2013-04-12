//a changer pour la mise en production
//Mettre l'adresse du serveur
var serviceURL = "http://10.0.2.2:8080/TestRest/rest/";


$(document).ready( function () { 
	$("#connexionForm").submit( function() { 
		var $inputs = $("#connexionForm").find("input, select, button, textarea");
		// serialize the data in the form
		var serializedData = $("#connexionForm").serialize();
		// à la soumission du formulaire						 
		$.ajax({ // fonction permettant de faire de l'ajax
			type: "POST", // methode de transmission des données au fichier php
			url: serviceURL+"authentification",// url du fichier du WS
			data: serializedData, // données à transmettre
			datatype:"string",
			success: function(msg){ // si l'appel a bien fonctionné
				if(msg=="error") 
					alert('Veuillez entrer un identifiant et un mot de passe valide');
				else{
					alert('Authentification réussie ! identifiant : '+msg);
					window.localStorage.setItem("identifiant", msg);
					document.location.href="home.html?id="+msg+"";
				}
			}
		});
		
		return false; // permet de rester sur la même page à la soumission du formulaire
	});
});



