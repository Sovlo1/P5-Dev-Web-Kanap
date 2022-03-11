//Nous permet de récupérer l'id de commande qui a été stockée dans l'url
let params = new URLSearchParams(document.location.search);
//Puis on stocke cette id dans une variable
let id = params.get("id");

//On pointe l'élément html dans lequel on affichera notre id de commande
let orderId = document.getElementById("orderId")
//On met en texte l'id de commande dans cet élément html
orderId.textContent = id