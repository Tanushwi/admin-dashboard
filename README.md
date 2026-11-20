# 🛡️ SAVORIA — Admin Dashboard

A premium, fully functional, and beautifully animated Admin Dashboard built for the **SAVORIA** restaurant website. 

### 🔗 [**View Live Admin Dashboard**](https://tanushwi.github.io/admin-dashboard/)

---

## 🔑 Demo Credentials
To access the dashboard, use the following credentials on the live site:
*   **Email:** `admin@savoria.com`
*   **Password:** `admin123`

---

## ✨ Features

*   **🔐 Secure Login Portal:** A sleek, glassmorphism login screen that protects the dashboard from unauthorized access.
*   **📊 Interactive Dashboard:**
    *   Real-time KPI cards (Total Revenue, Orders, Avg. Order Value, Active Customers).
    *   Fully animated **Line Chart** (Revenue Overview) and **Doughnut Chart** (Sales by Category) powered by **Chart.js**.
*   **📦 Orders Management:**
    *   View all incoming orders from customers.
    *   Click "View" to open a detailed modal with the customer's address, phone, and exact items ordered.
    *   Update order statuses instantly (Preparing, Delivered, Cancelled) using a dropdown.
*   **🍔 Menu Management:**
    *   Add new dishes to the menu dynamically.
    *   Toggle the availability of items (In Stock / Out of Stock).
    *   Delete existing items.
    *   *(Note: Changes made here are automatically saved to `localStorage` and reflect on the main restaurant website.)*
*   **👥 Customer Database:**
    *   Automatically aggregates data from orders to show unique customers, their total orders, total amount spent, and last order date.

---

## 🚀 Tech Stack

*   **HTML5** (Semantic structure)
*   **CSS3** (Custom properties, Flexbox, CSS Grid, Glassmorphism, Animations)
*   **Vanilla JavaScript** (DOM manipulation, State management, LocalStorage)
*   **Chart.js** (For interactive data visualization)
*   **Fonts:** Playfair Display & Outfit (via Google Fonts)

---

## 🛠️ How to Run Locally

Since this project is built with pure frontend technologies, you don't need any build tools or servers.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tanushwi/admin-dashboard.git