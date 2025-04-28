// Select elements
let btndelete = document.getElementById('deleteAll');
let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');
let search = document.getElementById('search');

let mood = 'create';
let temp;

// Get local storage
let datapro = localStorage.getItem('product') ? JSON.parse(localStorage.getItem('product')) : [];

// Calculate total
function getTotal() {
  if (price.value !== '') {
    let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
    total.innerHTML = `Total: ${result}`;
    total.style.background = '#040';
  } else {
    total.innerHTML = 'Total: 0';
    total.style.background = '#f00';
  }
}

// Create or update product
submit.onclick = function () {
  let newpro = {
    title: title.value,
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value,
  };

  let countValue = parseInt(newpro.count);
  if(title.value!='' &&price.value !='' &&newpro.count<100)
  {
    if (mood === 'create') {
        if (countValue > 1) {
          for (let i = 0; i < countValue; i++) {
            datapro.push({ ...newpro });
          }
        } else {
          datapro.push(newpro);
        }
      } else {
        datapro[temp] = newpro;
        mood = 'create';
        submit.innerHTML = 'Create';
        count.style.display = 'block';
      }
      clearData();
  }


  localStorage.setItem('product', JSON.stringify(datapro));
  clearData();
  showData();
};

// Clear inputs
function clearData() {
  title.value = '';
  price.value = '';
  taxes.value = '';
  ads.value = '';
  discount.value = '';
  count.value = '';
  category.value = '';
  total.innerHTML = 'Total: 0';
}

// Show data
function showData() {
  getTotal();
  let table = '';
  datapro.forEach((product, i) => {
    table += `
      <tr>
        <td>${i + 1}</td>
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>${product.taxes}</td>
        <td>${product.ads}</td>
        <td>${product.discount}</td>
        <td>${product.total}</td>
        <td>${product.category}</td>
        <td><button onclick="updateProduct(${i})">Update</button></td>
        <td><button onclick="deleteData(${i})">Delete</button></td>
      </tr>
    `;
  });
  document.getElementById('tbody').innerHTML = table;

  if (datapro.length > 0) {
    btndelete.innerHTML = `<button onclick="deleteAll()">Delete All (${datapro.length})</button>`;
  } else {
    btndelete.innerHTML = '';
  }
}

// Delete one
function deleteData(i) {
  datapro.splice(i, 1);
  localStorage.setItem('product', JSON.stringify(datapro));
  showData();
}

// Delete all
function deleteAll() {
  localStorage.clear();
  datapro = [];
  showData();
}

// Update product
function updateProduct(i) {
  title.value = datapro[i].title;
  price.value = datapro[i].price;
  taxes.value = datapro[i].taxes;
  ads.value = datapro[i].ads;
  discount.value = datapro[i].discount;
  category.value = datapro[i].category;
  getTotal();
  count.style.display = 'none';
  submit.innerHTML = 'Update';
  mood = 'update';
  temp = i;
  scroll({ top: 0, behavior: 'smooth' });
}

// Search mode toggle
let searchMood = 'title';

function getSearchMood(id) {
  if (id === 'searchTitle') {
    searchMood = 'title';
    search.placeholder = 'Search by Title';
  } else {
    searchMood = 'category';
    search.placeholder = 'Search by Category';
  }
  search.focus();
  search.value = '';
  showData();
}

// Search data
function searchData(value) {
  let table = '';
  for (let i = 0; i < datapro.length; i++) {
    if (
      (searchMood === 'title' && datapro[i].title.toLowerCase().includes(value.toLowerCase())) ||
      (searchMood === 'category' && datapro[i].category.toLowerCase().includes(value.toLowerCase()))
    ) {
      table += `
        <tr>
          <td>${i + 1}</td>
          <td>${datapro[i].title}</td>
          <td>${datapro[i].price}</td>
          <td>${datapro[i].taxes}</td>
          <td>${datapro[i].ads}</td>
          <td>${datapro[i].discount}</td>
          <td>${datapro[i].total}</td>
          <td>${datapro[i].category}</td>
          <td><button onclick="updateProduct(${i})">Update</button></td>
          <td><button onclick="deleteData(${i})">Delete</button></td>
        </tr>
      `;
    }
  }
  document.getElementById('tbody').innerHTML = table;
}

// Show initial data
showData();
