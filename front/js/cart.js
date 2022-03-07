// article > div > img
//         > div > div > h2 p p
//               > div > div > p input
//                     > div > p

//Variable qui contiendra les données du produit à fetch
let fetchedProduct;

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

const addItem = function (storedItem) {
  cartFull.append(cartItem);
  cartItem.classList.add("cart__item");
  cartItem.setAttribute("data-id", storedItem.couchName);
  cartItem.setAttribute("data-color", storedItem.couchColor);
};
const addItemImage = function () {
  cartItem.append(cartItemImageContainer);
  cartItemImageContainer.classList.add("cart__item__img");
  cartItemImageContainer.append(cartItemImage);
  cartItemImage.src = fetchedProduct.imageUrl;
  cartItemImage.alt = fetchedProduct.altTxt;
};
const addItemDescription = function (storedItem) {
  cartItem.append(cartItemContent);
  cartItemContent.classList.add("cart__item__content");
  cartItemContent.append(cartItemContentDescription);
  cartItemContentDescription.classList.add("cart__item__content__description");
  cartItemContentDescription.append(cartItemName, cartItemColor, cartItemPrice);
  cartItemName.textContent = fetchedProduct.name;
  cartItemColor.textContent = storedItem.couchColor;
  cartItemPrice.textContent = fetchedProduct.price / 10 + "0€";
};
const addItemSettings = function (storedItem) {
  cartItemContent.append(cartItemContentSettings);
  cartItemContentSettings.classList.add("cart__item__content__settings");
  cartItemContentSettings.append(cartItemContentSettingsQuantity);
  cartItemContentSettingsQuantity.classList.add(
    "cart__item__content__settings__quantity"
  );
  cartItemContentSettingsQuantity.append(
    cartItemQuantity,
    cartItemQuantityInput
  );
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
const removeItemSettings = function (storedItem) {
  cartItemContentSettings.append(cartItemContentSettingsDelete);
  cartItemContentSettingsDelete.classList.add(
    "cart__item__content__settings__delete"
  );
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
      price = (storedCart[i].couchQuantity * fetchedProduct.price);
      priceFull += price;
      totalPrice.textContent = (parseFloat(priceFull, 10)/10);
    }
  }
};

const fillCart = async function () {
  for (i = 0; i < storedCart.length; i += 1) {
    await fetch(`http://localhost:3000/api/products/${storedCart[i].couchName}`)
      .then((res) => res.json())
      .then((fetched) => (fetchedProduct = fetched));
    cartItem = document.createElement("article");
    cartItemImageContainer = document.createElement("div");
    cartItemImage = document.createElement("img");
    cartItemContent = document.createElement("div");
    cartItemContentDescription = document.createElement("div");
    cartItemName = document.createElement("h2");
    cartItemColor = document.createElement("p");
    cartItemPrice = document.createElement("p");
    cartItemContentSettings = document.createElement("div");
    cartItemContentSettingsQuantity = document.createElement("div");
    cartItemQuantity = document.createElement("p");
    cartItemQuantityInput = document.createElement("input");
    cartItemContentSettingsDelete = document.createElement("div");
    cartItemDelete = document.createElement("p");
    await addItem(storedCart[i]);
    await addItemImage();
    await addItemDescription(storedCart[i]);
    await addItemSettings(storedCart[i]);
    await removeItemSettings(storedCart[i]);
  }
};

const loadPage = async function () {
await fillCart();
updateTotalQuantity();
updateTotalPrice();
}

loadPage();


