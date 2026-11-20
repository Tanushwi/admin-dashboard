const DEFAULT_MENU = [
  {id:1, name:"Paneer Tikka", cat:"Starters", price:329, veg:true, available:true},
  {id:2, name:"Peri Peri Chicken Wings", cat:"Starters", price:389, veg:false, available:true},
  {id:3, name:"Butter Chicken", cat:"Main Course", price:449, veg:false, available:true},
  {id:4, name:"Dal Makhani", cat:"Main Course", price:329, veg:true, available:true},
  {id:5, name:"Margherita Pizza", cat:"Pizza", price:349, veg:true, available:true},
  {id:6, name:"Classic Cheeseburger", cat:"Burgers", price:299, veg:false, available:false}
];

const DEFAULT_ORDERS = [
  {orderId: 'SAV1001', customer: {name: 'Rahul Sharma', phone: '9876543210', address: 'Connaught Place, Delhi'}, amount: 1250, status: 'Delivered', date: '2024-05-20T10:30:00Z', items: '2x Butter Chicken, 1x Naan'},
  {orderId: 'SAV1002', customer: {name: 'Priya Patel', phone: '9876543211', address: 'Vasant Kunj, Delhi'}, amount: 890, status: 'Preparing', date: '2024-05-20T12:15:00Z', items: '1x Margherita Pizza, 1x Coke'},
  {orderId: 'SAV1003', customer: {name: 'Amit Kumar', phone: '9876543212', address: 'Hauz Khas, Delhi'}, amount: 2100, status: 'Delivered', date: '2024-05-19T19:00:00Z', items: '3x Paneer Tikka, 2x Dal Makhani'},
  {orderId: 'SAV1004', customer: {name: 'Sneha Gupta', phone: '9876543213', address: 'Saket, Delhi'}, amount: 450, status: 'Cancelled', date: '2024-05-19T20:45:00Z', items: '1x Veg Burger'}
];

let menuData = JSON.parse(localStorage.getItem('sav_menu')) || DEFAULT_MENU;
let ordersData = JSON.parse(localStorage.getItem('sav_orders')) || DEFAULT_ORDERS;

if(!localStorage.getItem('sav_menu')) localStorage.setItem('sav_menu', JSON.stringify(DEFAULT_MENU));
if(!localStorage.getItem('sav_orders')) localStorage.setItem('sav_orders', JSON.stringify(DEFAULT_ORDERS));

const loginScreen = document.getElementById('loginScreen');
const appContainer = document.getElementById('appContainer');

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('adminEmail').value;
  const pass = document.getElementById('adminPass').value;
  
  if(email === 'admin@savoria.com' && pass === 'admin123') {
    loginScreen.classList.add('hidden');
    appContainer.classList.remove('hidden');
    initDashboard();
  } else {
    alert("Invalid Credentials! Use admin@savoria.com / admin123");
  }
}

function logout() {
  appContainer.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  document.getElementById('adminEmail').value = 'admin@savoria.com';
  document.getElementById('adminPass').value = 'admin123';
}

function switchTab(tab, el) {
  document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
  el.classList.add('active');

  document.querySelectorAll('.content-pad > div').forEach(div => div.classList.add('hidden'));

  const titles = {
    dashboard: "Dashboard Overview",
    orders: "Orders Management",
    menu: "Menu Items",
    customers: "Customer Database"
  };
  document.getElementById('pageTitle').textContent = titles[tab];

  if(tab === 'dashboard') {
    document.getElementById('dashboardTab').classList.remove('hidden');
  } else if(tab === 'orders') {
    document.getElementById('ordersTab').classList.remove('hidden');
    renderOrders();
  } else if(tab === 'menu') {
    document.getElementById('menuTab').classList.remove('hidden');
    renderMenuTable();
  } else if(tab === 'customers') {
    document.getElementById('customersTab').classList.remove('hidden');
    renderCustomers();
  }
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if(e.target === modal) modal.classList.remove('open');
  });
});

let lineChart, doughnutChart;
Chart.defaults.color = '#9a9aac';
Chart.defaults.font.family = "'Outfit', sans-serif";
Chart.defaults.borderColor = 'rgba(255,255,255,0.05)';

function initCharts() {
  const ctxLine = document.getElementById('lineChart').getContext('2d');
  let gradient = ctxLine.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(233, 185, 73, 0.4)');
  gradient.addColorStop(1, 'rgba(233, 185, 73, 0)');

  lineChart = new Chart(ctxLine, {
    type: 'line',
    data: getChartData(7), // Default 7 days
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
    }
  });

  const ctxDoughnut = document.getElementById('doughnutChart').getContext('2d');
  doughnutChart = new Chart(ctxDoughnut, {
    type: 'doughnut',
    data: {
      labels: ['Main Course', 'Pizza', 'Burgers', 'Desserts', 'Starters'],
      datasets: [{
        data: [45, 25, 15, 10, 5],
        backgroundColor: ['#e9b949', '#ff4d2d', '#38d39f', '#8b5cf6', '#3b82f6'],
        borderWidth: 0, hoverOffset: 10
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } } } }
  });
}

function getChartData(days) {
  let labels, data;
  if(days === 7) {
    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    data = [12000, 19000, 15000, 22000, 28000, 42000, 38000];
  } else {
    labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    data = [85000, 110000, 95000, 140000];
  }
  return {
    labels: labels,
    datasets: [{
      label: 'Revenue (₹)', data: data, borderColor: '#e9b949',
      backgroundColor: 'rgba(233, 185, 73, 0.2)', borderWidth: 3, tension: 0.4, fill: true,
      pointBackgroundColor: '#0a0a0f', pointBorderColor: '#e9b949', pointBorderWidth: 2, pointRadius: 4
    }]
  };
}

function updateChartData() {
  const days = parseInt(document.getElementById('chartFilter').value);
  lineChart.data = getChartData(days);
  lineChart.update();
}

function renderOrders() {
  const tbody = document.getElementById('ordersTableBody');
  tbody.innerHTML = '';

  if(ordersData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--muted)">No orders found.</td></tr>';
    return;
  }

  const sorted = [...ordersData].sort((a,b) => new Date(b.date) - new Date(a.date));

  sorted.forEach(order => {
    const dateStr = new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const badgeClass = order.status.toLowerCase();
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><b style="color:var(--gold-2)">#${order.orderId}</b></td>
      <td>${order.customer.name}</td>
      <td>${dateStr}</td>
      <td>₹${order.amount.toLocaleString('en-IN')}</td>
      <td>
        <select class="status-select" onchange="updateOrderStatus('${order.orderId}', this.value)">
          <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
          <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td>
        <button class="action-btn" onclick="viewOrderDetails('${order.orderId}')">View</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateKPIs();
}

function updateOrderStatus(orderId, newStatus) {
  const orderIndex = ordersData.findIndex(o => o.orderId === orderId);
  if(orderIndex > -1) {
    ordersData[orderIndex].status = newStatus;
    localStorage.setItem('sav_orders', JSON.stringify(ordersData));
    updateKPIs(); 
  }
}

function viewOrderDetails(orderId) {
  const order = ordersData.find(o => o.orderId === orderId);
  if(!order) return;

  document.getElementById('modalOrderId').textContent = `#${order.orderId}`;
  
  const dateStr = new Date(order.date).toLocaleString('en-IN');
  const content = `
    <div style="display:flex;flex-direction:column;gap:15px;font-size:.9rem">
      <div style="background:rgba(255,255,255,.03);padding:15px;border-radius:10px">
        <b style="color:var(--gold-2);display:block;margin-bottom:5px">Customer Info</b>
        Name: ${order.customer.name}<br>
        Phone: ${order.customer.phone || 'N/A'}<br>
        Address: ${order.customer.address || 'N/A'}
      </div>
      <div style="background:rgba(255,255,255,.03);padding:15px;border-radius:10px">
        <b style="color:var(--gold-2);display:block;margin-bottom:5px">Order Info</b>
        Date: ${dateStr}<br>
        Items: ${order.items || 'Standard Order'}<br>
        Amount: <b>₹${order.amount.toLocaleString('en-IN')}</b>
      </div>
      <div style="background:rgba(255,255,255,.03);padding:15px;border-radius:10px">
        <b style="color:var(--gold-2);display:block;margin-bottom:5px">Status</b>
        <span class="status ${order.status.toLowerCase()}">${order.status.toUpperCase()}</span>
      </div>
    </div>
  `;
  document.getElementById('orderModalContent').innerHTML = content;
  openModal('orderModal');
}

function renderMenuTable() {
  const tbody = document.getElementById('menuTableBody');
  tbody.innerHTML = '';

  menuData.forEach(dish => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><b>${dish.name}</b></td>
      <td>${dish.cat}</td>
      <td>₹${dish.price}</td>
      <td>
        <span class="${dish.veg ? 'veg-dot' : 'nonveg-dot'}"></span>
        ${dish.veg ? 'Veg' : 'Non-Veg'}
      </td>
      <td>
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <input type="checkbox" ${dish.available ? 'checked' : ''} onchange="toggleAvailability(${dish.id}, this.checked)" style="width:16px;height:16px;accent-color:var(--gold)">
          <span style="font-size:.85rem;color:${dish.available ? 'var(--green)' : 'var(--accent)'}">
            ${dish.available ? 'In Stock' : 'Out of Stock'}
          </span>
        </label>
      </td>
      <td>
        <button class="action-btn delete" onclick="deleteDish(${dish.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function toggleAvailability(id, isChecked) {
  const dish = menuData.find(d => d.id === id);
  if(dish) {
    dish.available = isChecked;
    localStorage.setItem('sav_menu', JSON.stringify(menuData));
    renderMenuTable(); 
  }
}

function deleteDish(id) {
  if(confirm("Are you sure you want to delete this dish?")) {
    menuData = menuData.filter(d => d.id !== id);
    localStorage.setItem('sav_menu', JSON.stringify(menuData));
    renderMenuTable();
  }
}

function handleAddDish(e) {
  e.preventDefault();
  const name = document.getElementById('newDishName').value;
  const price = parseInt(document.getElementById('newDishPrice').value);
  const cat = document.getElementById('newDishCat').value;
  const veg = document.getElementById('newDishType').value === 'true';

  const newDish = {
    id: Date.now(), 
    name: name,
    cat: cat,
    price: price,
    veg: veg,
    available: true
  };

  menuData.push(newDish);
  localStorage.setItem('sav_menu', JSON.stringify(menuData));
  
  closeModal('addDishModal');
  renderMenuTable();
  e.target.reset();
}

function renderCustomers() {
  const tbody = document.getElementById('customersTableBody');
  tbody.innerHTML = '';

  const customersMap = {};

  ordersData.forEach(order => {
    if(order.status === 'Cancelled') return; 

    const key = order.customer.phone || order.customer.name;
    if(!customersMap[key]) {
      customersMap[key] = {
        name: order.customer.name,
        contact: order.customer.phone || 'No phone',
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: new Date(0)
      };
    }
    
    customersMap[key].totalOrders += 1;
    customersMap[key].totalSpent += order.amount;
    
    const orderDate = new Date(order.date);
    if(orderDate > customersMap[key].lastOrderDate) {
      customersMap[key].lastOrderDate = orderDate;
    }
  });

  const customersList = Object.values(customersMap).sort((a,b) => b.totalSpent - a.totalSpent);

  if(customersList.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--muted)">No customers yet.</td></tr>';
    return;
  }

  customersList.forEach(c => {
    const lastDateStr = c.lastOrderDate.getTime() === 0 ? 'N/A' : c.lastOrderDate.toLocaleDateString('en-IN');
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><b>${c.name}</b></td>
      <td>${c.contact}</td>
      <td><span class="badge">${c.totalOrders} orders</span></td>
      <td><b style="color:var(--green)">₹${c.totalSpent.toLocaleString('en-IN')}</b></td>
      <td>${lastDateStr}</td>
    `;
    tbody.appendChild(tr);
  });
}

function updateKPIs() {
  let validOrders = ordersData.filter(o => o.status !== 'Cancelled');
  let revenue = validOrders.reduce((sum, o) => sum + o.amount, 0);
  let avg = validOrders.length ? Math.round(revenue / validOrders.length) : 0;
  
  let uniqueCustomers = new Set(validOrders.map(o => o.customer.phone || o.customer.name)).size;

  document.getElementById('totalRevenue').textContent = '₹' + revenue.toLocaleString('en-IN');
  document.getElementById('totalOrders').textContent = ordersData.length;
  document.getElementById('avgOrderValue').textContent = '₹' + avg.toLocaleString('en-IN');
  document.getElementById('totalCustomers').textContent = uniqueCustomers;
}

function initDashboard() {
  if(!lineChart) initCharts(); 
  renderOrders();
  updateKPIs();
}