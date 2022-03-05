// article > div > img
//         > div > div > h2 p p
//               > div > div > p input
//                     > div > p

let fetchedProduct;

let cartFull = document.getElementById("cart__items");
let totalQuantity = document.getElementById("totalQuantity");
let totalPrice = document.getElementById("totalPrice");
let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
let addressErrorMsg = document.getElementById("addressErrorMsg");
let cityErrorMsg = document.getElementById("cityErrorMsg");
let emailErrorMsg = document.getElementById("emailErrorMsg");

let storedCart = JSON.parse(localStorage.getItem("couchCart"));

const fillCart = async function () {
  for (i = 0; i < storedCart.length; i += 1) {
    await fetch(`http://localhost:3000/api/products/${storedCart[i].couchName}`)
      .then((res) => res.json())
      .then((fetched) => (fetchedProduct = fetched));
    let cartItem = document.createElement("article");
    cartFull.append(cartItem);
    cartItem.classList.add("cart__item");
    cartItem.setAttribute("data-id", storedCart[i].couchName);
    cartItem.setAttribute("data-color", storedCart[i].couchColor);
    let cartItemImageContainer = document.createElement("div");
    cartItem.append(cartItemImageContainer);
    cartItemImageContainer.classList.add("cart__item__img");
    let cartItemImage = document.createElement("img");
    cartItemImageContainer.append(cartItemImage);
    cartItemImage.src = fetchedProduct.imageUrl;
    cartItemImage.alt = fetchedProduct.altTxt;
    let cartItemContent = document.createElement("div");
    cartItem.append(cartItemContent)
    cartItemContent.classList.add("cart__item__content");
    let cartItemContentDescription = document.createElement("div")
    cartItemContent.append(cartItemContentDescription);
    cartItemContentDescription.classList.add("cart__item__content__description");
    let cartItemName = document.createElement("h2")
    let cartItemColor = document.createElement("p")
    let cartItemPrice = document.createElement("p")
    cartItemContentDescription.append(cartItemName, cartItemColor, cartItemPrice)
    cartItemName.textContent = fetchedProduct.name
    cartItemColor.textContent = storedCart[i].couchColor
    cartItemPrice.textContent = fetchedProduct.price / 10 + "0€"
    let cartItemContentSettings = document.createElement("div")
    cartItemContent.append(cartItemContentSettings);
    cartItemContentSettings.classList.add("cart__item__content__settings")
    let cartItemContentSettingsQuantity = document.createElement("div")
    cartItemContentSettings.append(cartItemContentSettingsQuantity)
    cartItemContentSettingsQuantity.classList.add("cart__item__content__settings__quantity")
    let cartItemQuantity = document.createElement("p")
    let cartItemQuantityInput = document.createElement("input")
    cartItemContentSettingsQuantity.append(cartItemQuantity, cartItemQuantityInput)
    cartItemQuantity.textContent = "Qté : "
    cartItemQuantityInput.setAttribute("type", "number")
    cartItemQuantityInput.setAttribute("name", "itemQuantity")
    cartItemQuantityInput.setAttribute("min", "1")
    cartItemQuantityInput.setAttribute("max", "100")
    cartItemQuantityInput.setAttribute("value", storedCart[i].couchQuantity)
    let cartItemContentSettingsDelete = document.createElement("div")
    cartItemContentSettings.append(cartItemContentSettingsDelete);
    cartItemContentSettingsDelete.classList.add("cart__item__content__settings__delete")
    let cartItemDelete = document.createElement("p")
    cartItemContentSettingsDelete.append(cartItemDelete)
    cartItemDelete.classList.add("deleteItem")
    cartItemDelete.textContent = "Supprimer"
  }
};

fillCart();
