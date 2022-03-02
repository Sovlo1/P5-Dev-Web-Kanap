let params = new URLSearchParams(document.location.search);
let id = params.get("id");
let fetchedProduct;

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

const productInDepth = function () {
  productImage = document.createElement("img");
  imageContainer.appendChild(productImage);
  for (i = 0; i < fetchedProduct.colors.length; i += 1) {
    let productColors = document.createElement("option");
    colorsContainer.append(productColors);
    productColors.setAttribute("value", fetchedProduct.colors[i]);
    productColors.textContent = fetchedProduct.colors[i];
  }
};

const productInfo = async function () {
  await product();
  await productInDepth();
  productImage.src = fetchedProduct.imageUrl;
  productImage.alt = fetchedProduct.altTxt;
  productName.textContent = fetchedProduct.name;
  productPrice.textContent = fetchedProduct.price / 10 + "0";
  productDescription.textContent = fetchedProduct.description;
};

productInfo();

let couchAdd;
let couchCart = [];
let couchName;
let couchQuantity;
let couchColor;

const populateStorage = function () {
  localStorage.setItem("product", id);
  localStorage.setItem("quantity", quantity.value);
  localStorage.setItem("color", colors.value);
  couchName = localStorage.getItem("product");
  couchQuantity = +localStorage.getItem("quantity");
  couchColor = localStorage.getItem("color");
};

const couchObj = function () {
  couchAdd = {
    couchName: couchName,
    couchQuantity: couchQuantity,
    couchColor: couchColor,
  };
};

addToCart.addEventListener("click", function () {
  populateStorage();
  test();
  // couchCart.push(couchAdd);
  // localStorage.setItem("couchCart", couchCart);
});

// const test = function () {
//   if (!localStorage.getItem("couchCart")) {
//     couchCart.push(couchAdd);
//     localStorage.setItem("couchCart", couchCart);
//   } else if (
//     couchAdd.couchName !== id ||
//     couchAdd.couchColor !== colors.value
//   ) {
//     couchCart.push(couchAdd);
//     localStorage.setItem("couchCart", couchCart);
//   } else if (
//     couchAdd.couchName === id ||
//     couchAdd.couchColor === colors.value
//   ) {
//     couchAdd.couchQuantity += parseInt(quantity.value, 10);
//     couchCart.push(couchAdd);
//   }
// };
