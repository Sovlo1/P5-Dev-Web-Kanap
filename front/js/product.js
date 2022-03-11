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
let couchCart = [];

//Fonction qui ajoute les données du canapé choisi au localstorage
const populateStorage = function () {
  quantity = document.getElementById("quantity");
  colors = document.getElementById("colors");
  localStorage.setItem("product", id);
  localStorage.setItem("quantity", quantity.value);
  localStorage.setItem("color", colors.value);
  couchName = localStorage.getItem("product");
  couchQuantity = +localStorage.getItem("quantity");
  couchColor = localStorage.getItem("color");
};

//Fonction qui ajoute les données du localstorage à l'objet couchAdd
const fillCouchObject = function () {
  couchAdd = {
    couchName: couchName,
    couchQuantity: couchQuantity,
    couchColor: couchColor,
  };
};

//Fonction permettant d'ajouter l'objet couchAdd 
const addCouchTotal = function () {
  //Si un panier est déja présent dans le localStorage
  if (localStorage.getItem("couchCart")) {
    //On parse les données du panier
    const couchCartParsed = JSON.parse(localStorage.getItem("couchCart"));
    //Puis on cherche si le produit qu'on essaye d'ajouter est présent ou
    //non dans le panier
    const existingItem = couchCartParsed.find(function (cartItem) {
      if (
        cartItem.couchName === couchAdd.couchName &&
        cartItem.couchColor === couchAdd.couchColor
      ) {
        return true;
      } else {
        return false;
      }
    });
    //Si il est déja présent, on incrémente la quantité de ce même produit
    if (existingItem) {
      existingItem.couchQuantity += couchQuantity;
    //Sinon on l'ajoute au panier
    } else {
      couchCartParsed.push(couchAdd);
    }
    //Puis on stringify le panier...
    couchCartStringed = JSON.stringify(couchCartParsed);
    //...avant de le remettre dans notre localStorage
    localStorage.setItem("couchCart", couchCartStringed);
  //Sinon on ajoute un panier contenant le produit qu'on veut ajouter
  } else {
    couchCart.push(couchAdd);
    couchCartStringed = JSON.stringify(couchCart);
    localStorage.setItem("couchCart", couchCartStringed);
  }
};

//Fonction qui vérifie que les données de couchAdd sont valides et pousse l'objet dans couchCart
const checkCouchValidity = function () {
  //On vérifie que l'utilisateur n'essaye pas d'ajouter un nombre inférieur à 1 d'un produit
  //et possédant une couleur
  if (couchAdd.couchQuantity > 0 && couchAdd.couchColor !== "") {
    addCouchTotal();
  }
};

//Event listener sur le bouton "ajouter au panier" qui utilise les 3 dernières fonctions
//que nous avons créé
addToCart.addEventListener("click", function () {
  populateStorage();
  fillCouchObject();
  checkCouchValidity();
});
