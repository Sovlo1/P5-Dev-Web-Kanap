//Variables indiquant les éléments à sélectionner pour l'ajout de futurs éléments dans le DOM
let cartFull = document.getElementById("cart__items");
let totalQuantity = document.getElementById("totalQuantity");
let totalPrice = document.getElementById("totalPrice");
let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
let addressErrorMsg = document.getElementById("addressErrorMsg");
let cityErrorMsg = document.getElementById("cityErrorMsg");
let emailErrorMsg = document.getElementById("emailErrorMsg");

//Variable contenant les données du panier qui sont stockées dans le localStorage
let storedCart = [];

//Fonction permettant de vérifier si un panier est stocké dans le localStorage
const checkStoredCart = function () {
  if (localStorage.getItem("couchCart")) {
    storedCart = JSON.parse(localStorage.getItem("couchCart"));
  }
};

//Variable qui contiendra les données récupérées après le fetch de chaque élément du panier
let fetchList = [];

//Fonction qui sera appelée plus tard et permettant de récupérer les données d'un ou plusieurs produits dans un tableau
const getProduct = async function () {
  await fetch(`http://localhost:3000/api/products/${storedCart[i].couchName}`)
    .then((res) => res.json())
    .then((fetched) => (fetchedProduct = fetched))
    .then(() => fetchList.push(fetchedProduct))
    .catch(() => console.log("There was an error"));
};

//Fonction qui créé un article correspondant à un produit présent dans le panier
const createItem = function (storedItem) {
  cartItem = document.createElement("article");
  cartFull.append(cartItem);
  cartItem.classList.add("cart__item");
  cartItem.setAttribute("data-id", storedItem.couchName);
  cartItem.setAttribute("data-color", storedItem.couchColor);
};

//Fonction qui ajoute à l'article créé une image correspondant au produit
const createItemImage = function () {
  cartItemImageContainer = document.createElement("div");
  cartItemImage = document.createElement("img");
  cartItem.append(cartItemImageContainer);
  cartItemImageContainer.classList.add("cart__item__img");
  cartItemImageContainer.append(cartItemImage);
  cartItemImage.src = fetchedProduct.imageUrl;
  cartItemImage.alt = fetchedProduct.altTxt;
};

//Fonction qui ajoute à l'article créé une description correspondante au produit
const createItemDescription = function (storedItem) {
  cartItemContent = document.createElement("div");
  cartItemContentDescription = document.createElement("div");
  cartItemName = document.createElement("h2");
  cartItemColor = document.createElement("p");
  cartItemPrice = document.createElement("p");
  cartItem.append(cartItemContent);
  cartItemContent.classList.add("cart__item__content");
  cartItemContent.append(cartItemContentDescription);
  cartItemContentDescription.classList.add("cart__item__content__description");
  cartItemContentDescription.append(cartItemName, cartItemColor, cartItemPrice);
  cartItemName.textContent = fetchedProduct.name;
  cartItemColor.textContent = storedItem.couchColor;
  cartItemPrice.textContent = (fetchedProduct.price / 10).toFixed(2);
};

//Fonction qui ajoute une division qui contiendra des éléments pour modifier la quantité du produit dans notre panier
const createItemSettings = function () {
  cartItemContentSettings = document.createElement("div");
  cartItemContent.append(cartItemContentSettings);
  cartItemContentSettings.classList.add("cart__item__content__settings");
};

const createItemSettingsQuantity = function () {
  cartItemQuantity = document.createElement("p");
  cartItemQuantityInput = document.createElement("input");
  cartItemContentSettingsQuantity = document.createElement("div");
  cartItemContentSettings.append(cartItemContentSettingsQuantity);
  cartItemContentSettingsQuantity.classList.add(
    "cart__item__content__settings__quantity"
  );
  cartItemContentSettingsQuantity.append(
    cartItemQuantity,
    cartItemQuantityInput
  );
};

//Fonction qui ajoute un input à la division créée juste avant permettant de modifier la quantité du produit
const fillItemSettingsQuantity = function (storedItem) {
  cartItemQuantity.textContent = "Qté : ";
  cartItemQuantityInput.classList.add("itemQuantity");
  cartItemQuantityInput.setAttribute("type", "number");
  cartItemQuantityInput.setAttribute("name", "itemQuantity");
  cartItemQuantityInput.setAttribute("min", "1");
  cartItemQuantityInput.setAttribute("max", "100");
  cartItemQuantityInput.setAttribute("value", storedItem.couchQuantity);
  cartItemQuantityInput.addEventListener("change", function () {
    storedItem.couchQuantity = parseInt(this.value, 10);
    storedCartStringed = JSON.stringify(storedCart);
    localStorage.setItem("couchCart", storedCartStringed);
    updateTotalQuantity();
    updateTotalPrice();
  });
};

//Fonction qui ajoute une division qui contiendra des éléments pour supprimer un produit de notre panier
const createDeleteItemSettings = function () {
  cartItemContentSettingsDelete = document.createElement("div");
  cartItemContentSettings.append(cartItemContentSettingsDelete);
  cartItemContentSettingsDelete.classList.add(
    "cart__item__content__settings__delete"
  );
};

//Fonction ajoutant un bouton permettant la suppression du produit
const fillDeleteItemSettings = function (storedItem) {
  cartItemDelete = document.createElement("p");
  cartItemContentSettingsDelete.append(cartItemDelete);
  cartItemDelete.classList.add("deleteItem");
  cartItemDelete.textContent = "Supprimer";
  cartItemDelete.addEventListener("click", function () {
    itemToRemove = document.querySelector(
      `[data-id="${storedItem.couchName}"][data-color="${storedItem.couchColor}"]`
    );
    itemToRemove.remove();
    cartItemToRemove = storedCart.findIndex(
      (item) =>
        item.couchName == storedItem.couchName &&
        item.couchColor == storedItem.couchColor
    );
    storedCart.splice(cartItemToRemove, 1);
    fetchList.splice(cartItemToRemove, 1);
    storedCartStringed = JSON.stringify(storedCart);
    localStorage.setItem("couchCart", storedCartStringed);
    updateTotalQuantity();
    updateTotalPrice();
  });
};

//Fonction appelant toutes les fonction créées jusqu'alors et permettant la création d'un article dans le DOM contenant
//toutes les informations du ou des produits présent(s) dans notre panier
const fillCart = async function () {
  checkStoredCart();
  for (i = 0; i < storedCart.length; i += 1) {
    await getProduct();
    createItem(storedCart[i]);
    createItemImage();
    createItemDescription(storedCart[i]);
    createItemSettings();
    createItemSettingsQuantity();
    fillItemSettingsQuantity(storedCart[i]);
    createDeleteItemSettings();
    fillDeleteItemSettings(storedCart[i]);
  }
};

//Fonction permettant de connaitre le nombre total d'article dans notre panier
const updateTotalQuantity = function () {
  if (storedCart === null || storedCart.length === 0) {
    totalQuantity.textContent = 0;
  } else {
    totalQuantity.textContent = storedCart.reduce(
      (sum, current) => sum + current.couchQuantity,
      0
    );
  }
};

//Fonction permettant de connaitre le prix total de notre panier
const updateTotalPrice = async function () {
  let priceFull = 0;
  if (storedCart === null || storedCart.length == 0) {
    totalPrice.textContent = 0;
  } else {
    for (i = 0; i < storedCart.length; i += 1) {
      price = storedCart[i].couchQuantity * fetchList[i].price;
      priceFull += price;
      totalPrice.textContent = (parseFloat(priceFull, 10) / 10).toFixed(2);
    }
  }
};

//Fonction contenant fillCart() qui contient déja toutes les fonction permettant de remplir le DOM et...
const loadPage = async function () {
  await fillCart();
  //...on met à jour le prix total et la quantité totale...
  updateTotalQuantity();
  updateTotalPrice();
};

//...et on éxécute la fonction au chargement de la page.
loadPage();

//////////////////////////////////////////////////////////////
////////////////////////FORMULAIRE////////////////////////////
//////////////////////////////////////////////////////////////

//Variables contenant les regex qui serviront à s'assurer que les données entrées dans le formulaire sont correctes
let emailRegex = /^[\.\-_0-9a-z]+@([a-z])+\.[a-z]+$/i;
let firstNameRegex = /^([a-zçéèêëàâîïôùû]{2,})+([-][a-zçéèêëàâîïôùû]+)?$/i;
let lastNameRegex = /^([a-zçéèêëàâîïôùû]{2,})+([ ][a-zçéèêëàâîïôùû]+)?$/i;
let cityRegex = /^([a-zçéèêëàâîïôùû]{2,})+([\- ][a-zçéèêëàâîïôùû]+)*$/i;
let addressRegex = /^([0-9a-zçéèêëàâîïôùû]{2,})+([ ][a-zçéèêëàâîïôùû]+)+$/i;

//Variable indiquant l'emplacement d'un bouton sur lequel on ajoutera un event listener
let order = document.getElementById("order");

//Fonction servant à supprimer les messages d'erreur du formulaire
const clearForm = function () {
  let formInputs = document.querySelectorAll(".cart__order__form__question p");
  for (i = 0; i < formInputs.length; i += 1) {
    formInputs[i].textContent = "";
  }
};

//Fonction pour vérifier la validité du prénom saisi
const checkFirstName = function () {
  firstName = document.getElementById("firstName");
  firstNameValue = firstName.value;
  error = document.getElementById("firstNameErrorMsg");
  isValid = firstNameRegex.test(firstNameValue);
  if (!isValid) {
    error.textContent = "Veuillez saisir un prénom valide.";
  } else {
    error.textContent = "";
  }
  return isValid;
};

//Fonction pour vérifier la validité du nom saisi
const checkLastName = function () {
  lastName = document.getElementById("lastName");
  lastNameValue = lastName.value;
  error = document.getElementById("lastNameErrorMsg");
  isValid = lastNameRegex.test(lastNameValue);
  if (!isValid) {
    error.textContent = "Veuillez saisir un nom valide.";
  } else {
    error.textContent = "";
  }
  return isValid;
};

//Fonction pour vérifier la validité de l'adresse saisie
const checkAddress = function () {
  address = document.getElementById("address");
  addressValue = address.value;
  error = document.getElementById("addressErrorMsg");
  isValid = addressRegex.test(addressValue);
  if (!isValid) {
    error.textContent = "Veuillez saisir une adresse valide.";
  } else {
    error.textContent = "";
  }
  return isValid;
};

//Fonction pour vérifier la validité de la ville saisie
const checkCity = function () {
  city = document.getElementById("city");
  cityValue = city.value;
  error = document.getElementById("cityErrorMsg");
  isValid = cityRegex.test(cityValue);
  if (!isValid) {
    error.textContent = "Veuillez saisir une ville valide.";
  } else {
    error.textContent = "";
  }
  return isValid;
};

//Fonction pour vérifier la validité de l'email saisi
const checkEmail = function () {
  email = document.getElementById("email");
  emailValue = email.value;
  error = document.getElementById("emailErrorMsg");
  isValid = emailRegex.test(emailValue);
  if (!isValid) {
    error.textContent = "Veuillez saisir une adresse email valide.";
  } else {
    error.textContent = "";
  }
  return isValid;
};

//Tableau dans lequel seront ajoutés les produits à acheter au moment de l'envoi du formulaire
let productList = [];

//Fonction servant à pousser les produits à acheter dans le tableau déclaré juste avant
const fillProductList = function () {
  for (i = 0; i < storedCart.length; i += 1) {
    productList.push(storedCart[i].couchName);
  }
};

//Fonction qui va compléter les données de l'objet clientCart et contenant
//les infos utilisateur ainsi que la liste des produits à acheter
const fillClientCart = function () {
  clientCart = {
    contact: {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    },
    products: productList,
  };
};

//Fonction pour compléter les données de l'objet orderValidation avec la version stringify de l'objet clientCart ainsi
//que les instructions pour faire la méthode POST à l'API
let fillOrderValidation = function () {
  orderValidation = {
    method: "POST",
    body: JSON.stringify(clientCart),
    headers: {
      "Content-type": "application/json",
    },
  };
};

//Fonction servant à faire la méthode POST à l'API en utilisant les données de la fonc
const completeOrder = async function () {
  await fetch("http://localhost:3000/api/products/order", orderValidation)
    .then((res) => res.json())
    //Nous permet de stocker la réponse de l'api dans une variable storedId
    .then((storeId) => (storedId = storeId));
};

//Event listener du bouton "commander" qui réutilise toutes les fonctions créées dans la partie formulaire
order.addEventListener("click", async function (e) {
  clearForm();
  e.preventDefault();
  //Nous permet de vérifier la validité de l'intégralité des données utilisateurs, si un élément n'est pas valide
  //il ne sera pas possible de procéder à la suite de la fonction
  isValid =
    checkFirstName() &&
    checkLastName() &&
    checkAddress() &&
    checkCity() &&
    checkEmail();
  if (isValid) {
    fillProductList();
    //Nous permet de nous assurer que personne ne puisse valider un formulaire avec un panier vide
    if (productList.length > 0) {
      fillClientCart();
      fillOrderValidation();
      await completeOrder();
      //Nous permet d'accéder à la page de confirmation qui contiendra dans son url l'id obtenu avec l'API
      document.location.href = `./confirmation.html?id=${storedId.orderId}`;
      localStorage.clear();
    }
  }
});
