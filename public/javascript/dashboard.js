const handleDashboard = async () => {
  const dashboardContent = document.querySelector(".DashboardContent");
  const response = await fetch("http://localhost:3000/get/orders");
  const orders = await response.json();

  let total = 0;
  let numOrders = 0;
  let sno = 1;
  let tableRows = "";

  orders.forEach((order) => {
    total += order.total || 0;
    numOrders++;
    if (order.cart && order.cart.length) {
      // Build cart items HTML for Name/Quantity and Price columns
      let nameQtyHtml = '<div class="flex flex-col justify-between">';
      let priceHtml = '<div class="flex flex-col items-center">';
      order.cart.forEach((item) => {
        const name = item.product?.name || item.name || "";
        const quantity = item.quantity || 1;
        const priceValue = item.product?.price || item.price || 0;
        nameQtyHtml += `
          <div class="flex justify-between">
            <h5 class="w-fit">${name}</h5>
            <h5 class="w-fit">${quantity}</h5>
          </div>
        `;
        priceHtml += `
          <div class="flex justify-between">
            ₹${priceValue ? priceValue.toFixed(2) : "0.00"}
          </div>
        `;
      });
      nameQtyHtml += "</div>";
      priceHtml += "</div>";

      tableRows += `
        <tr>
          <td class="border px-4 py-2">${sno}</td>
          <td class="border px-4 py-2">${order.tableNumber}</td>
          <td class="border px-4 py-2 w-40">${nameQtyHtml}</td>
          <td class="border px-4 py-2">${priceHtml}</td>
          <td class="border px-4 py-2">₹${
            order.total ? order.total.toFixed(2) : "0.00"
          }</td>
        </tr>
      `;
      sno++;
    }
  });

  dashboardContent.innerHTML = `
    <div class="DashboardContent w-full overflow-x-auto">
      <h1 class="text-5xl text-white mb-7">Welcome to Admin Dashboard</h1>
      <div class="flex flex-col text-white">
        <h3 class="text-2xl">Total Revenue: <span class="text-[#ff6b00]"> ₹${total.toFixed(
          2
        )} </span></h3>
        <h3 class="mt-5 text-lg">Total Orders: <span class="text-[#ff6b00]"> ${numOrders} </span></h3>
        <div class="mt-5">
          <h3 class="text-xl mb-4">Recent Orders</h3>
          <table>
            <thead>
              <tr>
                <th class="border px-4 py-2">S.no.</th>
                <th class="border px-4 py-2">Table Number</th>
                <th class="border px-4 py-2">Name</th>
                <th class="border px-4 py-2">Price</th>
                <th class="border px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
        <!-- Total sale: <strong>₹${total.toFixed(2)}</strong> -->
      </div>
    </div>
  `;
};

const handelOrder = async () => {
  const dashboardContent = document.querySelector(".DashboardContent");
  const response = await fetch("http://localhost:3000/get/orders");
  const orders = await response.json();

  let tableRows = "";
  orders.forEach((order) => {
    console.log(order.cart);
    // Render items in the cart
    let items = order.cart.map((item) => item.product.name).join(", ");
    tableRows += `
      <tr>
        <td class="border px-4 py-2">${order.tableNumber}</td>
        <td class="border px-4 py-2">
        <div class="flex flex-col">


           <h6>${items}</h6>




        </div>
        </td>
        <td class="border px-4 py-2">${order.instructions}</td>

        <td class="border px-4 py-2">₹${
          order.total ? order.total.toFixed(2) : "0.00"
        }</td>

        <td class="border px-4 py-2">Completed</td>
      </tr>
    `;
  });

  dashboardContent.innerHTML = `
    <h1 class="text-3xl text-white p-5">Orders</h1>
    <table>
      <thead>
        <tr>
          <th class="border px-4 py-2">Table Number</th>
          <th class="border px-4 py-2 w-1/2">Items</th>
          <th class="border px-4 py-2 w-1/2">Instructions</th>

          <th class="border px-4 py-2">Total Price</th>
          <th class="border px-4 py-2">Status</th>
        </tr>
      </thead>
      <tbody id="orderTableBody">
        ${tableRows}
      </tbody>
    </table>
  `;
};

const handelItems = async () => {
  const dashboardContent = document.querySelector(".DashboardContent");
  const response = await fetch("http://localhost:3000/get/products");
  const products = await response.json();

  let tableRows = "";
  products.forEach((product) => {
    tableRows += `
      <tr>
        <td class="border px-4 py-2">${product.name}</td>
        <td class="border px-4 py-2">₹${
          product.price ? product.price.toFixed(2) : "0.00"
        }</td>
        <td class="border px-4 py-2">${product.category || ""}</td>
        <td class="border px-4 py-2">${
          product.availability ? "available" : "not available"
        }</td>
        <td class="border px-4 py-2">
          <button onclick="updateAvailability('${
            product._id
          }', true)" class="my-2 flex items-center justify-center px-5 py-2 bg-green-400 rounded-full w-40 cursor-pointer">Available</button>
          <button onclick="updateAvailability('${
            product._id
          }', false)" class="my-2 flex items-center justify-center px-5 py-2 bg-red-400 rounded-full w-40 cursor-pointer">Not Available</button>
        </td>
      </tr>
    `;
  });

  dashboardContent.innerHTML = `
    <h1 class="text-3xl text-white p-5">Menu Items</h1>
    <table>
      <thead>
        <tr>
          <th class="border px-4 py-2">Name</th>
          <th class="border px-4 py-2">Price</th>
          <th class="border px-4 py-2">Category</th>
          <th class="border px-4 py-2">Availability</th>
          <th class="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;
};

// Add this function to handle availability updates
window.updateAvailability = async (id, available) => {
  await fetch(`http://localhost:3000/admin/update-product/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ availability: available }),
  });
  handelItems(); // Refresh the table after update
};

const AddItems = async () => {
  const dashboardContent = document.querySelector(".DashboardContent");

  dashboardContent.innerHTML = `
    <h1 class="text-2xl font-bold mb-5">ADD PRODUCTS </h1>
    <form id="addProductForm">
      <div class="flex flex-col items-center justify-center sm:px-0 md:px-10 lg:px-40">
        <input type="text" class="outline-none px-3 py-2 text-sm border-[1px] border-[#ff6b00] w-full rounded text-white " placeholder="Name" name="name" required> 


    
<div class="mt-5 self-start">
<label for="category">Choose a category:</label>
<select name="category" id="category" class="text-black">
  <option value="coffee">Coffee</option>
  <option value="tea">Tea</option>
  <option value="cold drinks">Cold Drinks</option>
  <option value="breakfast">Breakfast</option>
  <option value="lunch">Lunch</option>
  <option value="desserts">Desserts</option>
  <option value="snacks">Snacks</option>
</select>
</div>





        <input type="number" class="outline-none px-3 py-2 text-sm border-[1px] border-[#ff6b00] w-full rounded text-white mt-5" placeholder="Price" name="price" required> 
        <input type="text" class="outline-none px-3 py-2 text-sm border-[1px] border-[#ff6b00] w-full rounded text-white mt-5" placeholder="Description" name="description"> 
        <input type="text" class="outline-none px-3 py-2 text-sm border-[1px] border-[#ff6b00] w-full rounded text-white mt-5" placeholder="Image" name="image"> 
        <input type="text" class="outline-none px-3 py-2 text-sm border-[1px] border-[#ff6b00] w-full rounded text-white mt-5" placeholder="Ingredients" name="ingredients"> 
        <input type="submit" class="px-5 py-3 bg-blue-500 w-fit rounded-full mt-5 " value="Submit"> 
      </div>
    </form>
  `;

  // Add event listener after rendering
  document.getElementById("addProductForm").onsubmit = async function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch("/admin/add-products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success) {
      alert("Product added successfully!");
    } else {
      alert(result.message || "Failed to add product.");
    }
  };
};

// <input type="text" class="outline-none px-3 py-2 text-sm border-[1px] border-[#ff6b00] w-full rounded text-white mt-5" placeholder="Category" name="category" required>
