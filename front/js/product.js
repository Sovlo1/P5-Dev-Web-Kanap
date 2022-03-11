let params = new URLSearchParams(document.location.search);
let id = params.get("id");

let imageContainer = document.querySelector(".item__img");
let productName = document.getElementById("title");
let productPrice = document.getElementById("price");
let productDescription = document.getElementById("description");
let colorsContainer = document.getElementById("colors");
let addToCart = document.getElementById("addToCart");
let quantity = document.getElementById("quantity");
let colors = document.getElementById("colors");

const product = async function () {
  await fetch(`http://localhost:3000/api/products/${id}`)
    .then((res) => res.json())
    .then((fetched) => (fetchedProduct = fetched));
};

const addProductImage = function () {
  productImage = document.createElement("img");
  imageContainer.appendChild(productImage);
  productImage.src = fetchedProduct.imageUrl;
  productImage.alt = fetchedProduct.altTxt;
};

const productColors = function () {
  for (i = 0; i < fetchedProduct.colors.length; i += 1) {
    let productColors = document.createElement("option");
    colorsContainer.append(productColors);
    productColors.setAttribute("value", fetchedProduct.colors[i]);
    productColors.textContent = fetchedProduct.colors[i];
  }
};

const productText = function () {
  productName.textContent = fetchedProduct.name;
  productPrice.textContent = (fetchedProduct.price / 10).toFixed(2);
  productDescription.textContent = fetchedProduct.description;
};

const productInfo = async function () {
  await product();
  addProductImage();
  productColors();
  productText();
};

productInfo();

let couchCart = [];

//Fonction qui ajoute les données du canapé choisi au localstorage
const populateStorage = function () {
  localStorage.setItem("product", id);
  localStorage.setItem("quantity", quantity.value);
  localStorage.setItem("color", colors.value);
  couchName = localStorage.getItem("product");
  couchQuantity = +localStorage.getItem("quantity");
  couchColor = localStorage.getItem("color");
};

//Fonction qui ajoute les données du localstorage à l'objet couchAdd
const couchObj = function () {
  couchAdd = {
    couchName: couchName,
    couchQuantity: couchQuantity,
    couchColor: couchColor,
  };
};

//Fonction qui vérifie que les données de couchAdd sont valides et pousse l'objet dans couchCart
const checkCouchValid = function () {
  if (couchAdd.couchQuantity > 0 && couchAdd.couchColor !== "") {
    addCouchTotal();
  }
};

const addCouchTotal = function () {
  if (localStorage.getItem("couchCart")) {
    const couchCartParsed = JSON.parse(localStorage.getItem("couchCart"));
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
    if (existingItem) {
      existingItem.couchQuantity += couchQuantity;
    } else {
      couchCartParsed.push(couchAdd);
    }
    couchCartStringed = JSON.stringify(couchCartParsed);
    localStorage.setItem("couchCart", couchCartStringed);
  } else {
    couchCart.push(couchAdd);
    couchCartStringed = JSON.stringify(couchCart);
    localStorage.setItem("couchCart", couchCartStringed);
  }
};

addToCart.addEventListener("click", function () {
  populateStorage();
  couchObj();
  checkCouchValid();
});
