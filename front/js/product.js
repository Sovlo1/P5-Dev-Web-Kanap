//Nous permet de récupérer l'id du produit qui a été stockée dans l'url
let params = new URLSearchParams(document.location.search);
//Puis on stocke cette id dans une variable
let id = params.get("id");

//Pointe le bouton "ajouter au panier" sur lequel nous viendrons mettre un event listener
let addToCart = document.getElementById("addToCart");

//Fonction nous permettant de récupérer dans l'API les données du produit correspondant à l'id stockée
const getProduct = async function () {
  await fetch(`http://localhost:3000/api/products/${id}`)
    .then((res) => res.json())
    .then((fetched) => (fetchedProduct = fetched));
};

//Fonction nous permettant d'ajouter l'image du produit à notre document html
const addProductImage = function () {
  imageContainer = document.querySelector(".item__img");
  productImage = document.createElement("img");
  imageContainer.appendChild(productImage);
  productImage.src = fetchedProduct.imageUrl;
  productImage.alt = fetchedProduct.altTxt;
};

//Fonction nous permettant d'ajouter la ou les couleurs disponibles à l'achat du produit dans notre document html
const addProductColors = function () {
  for (i = 0; i < fetchedProduct.colors.length; i += 1) {
    colorsContainer = document.getElementById("colors");
    let productColors = document.createElement("option");
    colorsContainer.append(productColors);
    productColors.setAttribute("value", fetchedProduct.colors[i]);
    productColors.textContent = fetchedProduct.colors[i];
  }
};

//Fonction nous permettant d'ajouter le nom, la description et le prix du produit dans notre document html
const fillProductText = function () {
  productName = document.getElementById("title");
  productPrice = document.getElementById("price");
  productDescription = document.getElementById("description");
  productName.textContent = fetchedProduct.name;
  productPrice.textContent = (fetchedProduct.price / 10).toFixed(2);
  productDescription.textContent = fetchedProduct.description;
};

//Fonction réutilisant toutes les fonctions créées jusqu'alors...
const createProductInfo = async function () {
  await getProduct();
  addProductImage();
  addProductColors();
  fillProductText();
};

//...et qui se lance au chargement de la page
createProductInfo();

//Tableau qui contiendra le ou les produits qui sont déja présents dans le panier ou qui seront ajoutés
// let couchCart;

//Fonction permettant d'attribuer aux variables qui constitueront l'objet couchAdd des valeurs
const fillCouchInfos = function () {
  couchName = id;
  couchQuantity = parseInt(quantity.value, 10);
  couchColor = colors.value;
};

//Fonction qui ajoute les données du localstorage à l'objet couchAdd
const createCouchObject = function () {
  couchItem = {
    couchName: couchName,
    couchQuantity: couchQuantity,
    couchColor: couchColor,
  };
};

//Fonction qui vérifie que les données de couchAdd sont valides et pousse l'objet dans couchCart
const checkCouchValidity = function () {
  //On vérifie que l'utilisateur n'essaye pas d'ajouter un nombre inférieur à 1 d'un produit
  //et possédant une couleur
  if (couchItem.couchQuantity > 0 && couchItem.couchColor !== "") {
    addCouchTotal();
  }
};

//Fonction permettant d'ajouter l'objet couchAdd
const addCouchTotal = function () {
  //On déclare un panier vide
  let couchCartParsed = [];
  //Si un panier n'est pas présent dans le localSotrage
  if (!localStorage.getItem("couchCart")) {
    //On ajoute à notre panier vide notre produit
    couchCartParsed.push(couchItem);
    //Sinon on parse notre panier et on vérifie si notre produit est présent ou
    //non dans le panier
  } else {
    couchCartParsed = JSON.parse(localStorage.getItem("couchCart"));
    const existingItem = couchCartParsed.find(function (cartItem) {
      if (
        cartItem.couchName === couchItem.couchName &&
        cartItem.couchColor === couchItem.couchColor
      ) {
        return true;
      } else {
        return false;
      }
    });
    //Si il est présent on incrémente sa quantité
    if (existingItem) {
      existingItem.couchQuantity += couchQuantity;
      //Sinon on l'ajoute au panier
    } else {
      couchCartParsed.push(couchItem);
    }
  }
  //Puis on stringify notre panier et on le remet dans notre localStorage
  couchCartStringed = JSON.stringify(couchCartParsed);
  localStorage.setItem("couchCart", couchCartStringed);
};

//Event listener sur le bouton "ajouter au panier" qui utilise les 3 dernières fonctions
//que nous avons créé
addToCart.addEventListener("click", function () {
  fillCouchInfos();
  createCouchObject();
  checkCouchValidity();
});