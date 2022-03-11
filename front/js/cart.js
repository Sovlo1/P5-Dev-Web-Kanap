//Variables indiquant les éléments à sélectionner pour l'ajout d'éléments dans le DOM
let cartFull = document.getElementById("cart__items");
let totalQuantity = document.getElementById("totalQuantity");
let totalPrice = document.getElementById("totalPrice");
let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
let addressErrorMsg = document.getElementById("addressErrorMsg");
let cityErrorMsg = document.getElementById("cityErrorMsg");
let emailErrorMsg = document.getElementById("emailErrorMsg");

//Variable contenant les données du panier qui étaient stockées dans le localStorage
let storedCart = JSON.parse(localStorage.getItem("couchCart"));

const createItem = function (storedItem) {
  cartItem = document.createElement("article");
  cartFull.append(cartItem);
  cartItem.classList.add("cart__item");
  cartItem.setAttribute("data-id", storedItem.couchName);
  cartItem.setAttribute("data-color", storedItem.couchColor);
};

const createItemImage = function () {
  cartItemImageContainer = document.createElement("div");
  cartItemImage = document.createElement("img");
  cartItem.append(cartItemImageContainer);
  cartItemImageContainer.classList.add("cart__item__img");
  cartItemImageContainer.append(cartItemImage);
  cartItemImage.src = fetchedProduct.imageUrl;
  cartItemImage.alt = fetchedProduct.altTxt;
};

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

const createDeleteItemSettings = function () {
  cartItemContentSettingsDelete = document.createElement("div");
  cartItemContentSettings.append(cartItemContentSettingsDelete);
  cartItemContentSettingsDelete.classList.add(
    "cart__item__content__settings__delete"
  );
};

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
    updatedStoredCart = storedCart.filter(
      (item) =>
        item.couchName != storedItem.couchName ||
        item.couchColor != storedItem.couchColor
    );
    storedCart = updatedStoredCart;
    storedCartStringed = JSON.stringify(storedCart);
    localStorage.setItem("couchCart", storedCartStringed);
    updateTotalQuantity();
    updateTotalPrice();
  });
};

const fillCart = async function () {
  for (i = 0; i < storedCart.length; i += 1) {
    await fetch(`http://localhost:3000/api/products/${storedCart[i].couchName}`)
      .then((res) => res.json())
      .then((fetched) => (fetchedProduct = fetched));
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

const updateTotalQuantity = function () {
  if (storedCart.length == 0) {
    totalQuantity.textContent = 0;
  } else {
    totalQuantity.textContent = storedCart.reduce(
      (sum, current) => sum + current.couchQuantity,
      0
    );
  }
};

const updateTotalPrice = async function () {
  let priceFull = 0;
  if (storedCart.length == 0) {
    totalPrice.textContent = 0;
  } else {
    for (i = 0; i < storedCart.length; i += 1) {
      await fetch(
        `http://localhost:3000/api/products/${storedCart[i].couchName}`
      )
        .then((res) => res.json())
        .then((fetched) => (fetchedProduct = fetched));
      price = storedCart[i].couchQuantity * fetchedProduct.price;
      priceFull += price;
      totalPrice.textContent = (parseFloat(priceFull, 10) / 10).toFixed(2);
    }
  }
};

const loadPage = async function () {
  if (storedCart) {
    await fillCart();
    updateTotalQuantity();
    updateTotalPrice();
  }
};

loadPage();

////////////////////////FORM////////////////////////////

let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let address = document.getElementById("address");
let city = document.getElementById("city");
let email = document.getElementById("email");
let emailRegex = /^[\.\-_0-9a-zçéèêëàâîïôùû]+@([a-zçéèêëàâîïôùû])+\.[a-z]+$/i;
let firstNameRegex = /^([a-zçéèêëàâîïôùû]{2,})+([-][a-zçéèêëàâîïôùû]+)?$/i;
let lastNameRegex = /^([a-zçéèêëàâîïôùû]{2,})+([ ][a-zçéèêëàâîïôùû]+)?$/i;
let cityRegex = /^([a-zçéèêëàâîïôùû]{2,})+([\- ][a-zçéèêëàâîïôùû]+)*$/i;
let addressRegex = /^([0-9a-zçéèêëàâîïôùû]{2,})+([ ][a-zçéèêëàâîïôùû]+)+$/i;

let order = document.getElementById("order");

let productList = [];
let clientCart;
let orderValidation;

const checkFirstName = function () {
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

const checkLastName = function () {
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

const checkAddress = function () {
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

const checkCity = function () {
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

const checkEmail = function () {
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

let fillProductList = function () {
  for (i = 0; i < storedCart.length; i += 1) {
    productList.push(storedCart[i].couchName);
  }
};

let fillClientCart = function () {
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

let fillOrderValidation = function () {
  orderValidation = {
    method: "POST",
    body: JSON.stringify(clientCart),
    headers: {
      "Content-type": "application/json",
    },
  };
};

const orderOver = async function () {
  await fetch("http://localhost:3000/api/products/order", orderValidation)
    .then((res) => res.json())
    .then((storeId) => (storedId = storeId));
};

order.addEventListener("click", async function (e) {
  e.preventDefault();
  isValid =
    checkFirstName() &&
    checkLastName() &&
    checkAddress() &&
    checkCity() &&
    checkEmail();
  if (isValid) {
    fillClientCart();
    fillProductList();
    fillOrderValidation();
    await orderOver();
    document.location.href = `./confirmation.html?id=${storedId.orderId}`;
    localStorage.clear();
  }
});
