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

/*********************************************************************
 ****************************PARTIE 2**********************************
 *********************************************************************/

let couchCart = [];
let couchName;
let couchQuantity;
let couchColor;
let couchCartStringed;
let couchCartParsed;
let couchAdd;

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
    IncrementArr();
  }
};

const IncrementArr = function () {
  if (localStorage.getItem("couchCart") !== null) {
    couchCartParsed = JSON.parse(localStorage.getItem("couchCart"));
    isPresent = false;
    couchCartParsed.map(function (e) {
      if (
        e.couchName === couchAdd.couchName &&
        e.couchColor === couchAdd.couchColor
      ) {
        e.couchQuantity += couchQuantity;
        couchCartStringed = JSON.stringify(couchCartParsed);
        localStorage.setItem("couchCart", couchCartStringed);
        isPresent = true;
      } else {
        isPresent = false;
      }
    });
    if (!isPresent) {
      couchCartParsed.push(couchAdd);
      couchCartStringed = JSON.stringify(couchCartParsed);
      localStorage.setItem("couchCart", couchCartStringed);
    }
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
