//Fonction permettant de parser le json contenant la liste des produits
const fetchProductList = async function () {
  await fetch(`http://localhost:3000/api/products`)
    .then((res) => res.json())
    .then((fetched) => (products = fetched));
};

//Fonction permettant de donner des attributs aux variables créées ligne 6 à 10
const createProductCard = function () {
  mainContainer = document.getElementById("items");
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

const productCardInfo = function () {
  link.href = `./product.html?id=${products[i]._id}`;
  productImage.src = products[i].imageUrl;
  productImage.alt = products[i].altTxt;
  productName.textContent = products[i].name;
  productName.classList.add("productName");
  productDescription.textContent = products[i].description;
  productDescription.classList.add("productDescription");
};

//Fonction permettant de remplir notre page d'accueil grace aux donnéees de l'API et réutilisant
//toutes les fonctions créées jusqu'alors
const productList = async function () {
  await fetchProductList();
  for (i = 0; i < products.length; i += 1) {
    createProductCard();
    productCardInfo();
  }
};

productList();
