//Déclarer un tableau pour l'instant vide qui contiendra la liste des produits
let products = [];
//Sélectionner l'élément sur lequel viendront s'implémenter d'autres éléments
let mainContainer = document.getElementById("items");
//Déclarer les variables qui contiendront les éléments du DOM à intégrer
let link;
let flexContainer;
let productImage;
let productName;
let productDescription;

//Fonction permettant de parser le json contenant la liste des produits
const fetchProductList = async function () {
  await fetch(`http://localhost:3000/api/products`)
    .then((res) => res.json())
    .then((fetched) => products = fetched);
};

//Fonction permettant de donner des attributs aux variables créées ligne 6 à 10
const productCard = function () {
  link = document.createElement("a");
  flexContainer = document.createElement("article");
  productImage = document.createElement("img");
  productName = document.createElement("h3");
  productDescription = document.createElement("p");
  mainContainer.appendChild(link);
  link.appendChild(flexContainer);
  flexContainer.appendChild(productImage);
  flexContainer.appendChild(productName);
  flexContainer.appendChild(productDescription);
};

//Fonction permettant de remplir notre page d'accueil grace aux donnéees de l'API et réutilisant 
//toutes les fonctions créées jusqu'alors
const productList = async function () {
  await fetchProductList();
  for (i = 0; i < products.length; i += 1) {
    productCard();
    link.href = `./product.html?id=${products[i]._id}`;
    productImage.src = products[i].imageUrl;
    productImage.alt = products[i].altTxt;
    productName.textContent = products[i].name;
    productName.classList.add("productName");
    productDescription.textContent = products[i].description;
    productDescription.classList.add("productDescription");
  }
};

productList();