//Fonction permettant de parser le json contenant la liste des produits.
const getProductList = async function () {
  await fetch(`http://localhost:3000/api/products`)
    .then((res) => res.json())
    .then((fetched) => (products = fetched))
    .catch(() => console.log("There was an error"));
};

//Fonction permettant d'ajouter des éléments HTML à notre page d'accueil.
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

//Fonction permettant de remplir nos éléments HTML créés précédemment
//avec les informations contenus dans l'API.
const fillProductCardInfo = function () {
  link.href = `./product.html?id=${products[i]._id}`;
  productImage.src = products[i].imageUrl;
  productImage.alt = products[i].altTxt;
  productName.textContent = products[i].name;
  productName.classList.add("productName");
  productDescription.textContent = products[i].description;
  productDescription.classList.add("productDescription");
};

//Fonction appelant toutes les fonctions créées jusqu'alors...
const createProductList = async function () {
  await getProductList();
  for (i = 0; i < products.length; i += 1) {
    createProductCard();
    fillProductCardInfo();
  }
};

//...et qui s'éxécute au lancement de la page.
createProductList();
