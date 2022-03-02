let params = new URLSearchParams(document.location.search);
let id = params.get("id");
let fetchedProduct;

let imageContainer = document.querySelector(".item__img");
let productName = document.getElementById("title");
let productPrice = document.getElementById("price");
let productDescription = document.getElementById("description");
let colorsContainer = document.getElementById("colors");
let addToCart = document.getElementById("addToCart");

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

function populateStorage() {
  localStorage.setItem("product", id);
  localStorage.setItem("quantity", document.getElementById("quantity").value);
  localStorage.setItem("color", document.getElementById("colors").value);
}

addToCart.addEventListener("click", function() {
  populateStorage()
})