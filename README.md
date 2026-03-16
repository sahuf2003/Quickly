
# 🚀 QUICKLY

## ✨ Project Overview

A **Full-Stack + DevOps** real-time order and delivery platform, self-hosted on **Google Cloud Platform (GCP)**, designed to:

- Let **customers** place orders and track them live.
- Let **delivery partners** accept and update orders in real-time with an order lock mechanism.
- Let **admins** monitor all system activities.
- Fully **Dockerized** deployment with **Nginx reverse proxy**.
- **Frontend** served on the main domain.
- **Backend + Socket.io** served on `api.yourdomain.com` (same port, via reverse proxy).
- **Database** (MongoDB) running in Docker.

---
## Architecture 

<img width="1052" height="642" alt="image" src="https://github.com/user-attachments/assets/b965e4aa-5d08-4b2a-bd01-313d033fbe3b" />

## 💡 Tech Stack

**Frontend:** Next.js , TailwindCSS, TypeScript, Socket.io-client
**Backend:** Node.js, Express.js, Socket.io  
**Database:** MongoDB (Dockerized)  
**Authentication:** JWT with Role-Based Access Control  
**Hosting:** Google Cloud VM  
**Reverse Proxy:** Nginx  
**Containerization:** Docker & Docker Compose  

---

## 📂 Folder Structure

```
Quickly/
│
├── docker-compose.yml
│
├── backend/
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   │
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.config.js
│   │   │   └── dev.config.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── adminControllers.js
│   │   │   ├── authController.js
│   │   │   └── customerController.js
│   │   │
│   │   ├── helper/
│   │   │   └── validate.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── adminAuth.js
│   │   │   ├── customerAuth.js
│   │   │   └── partnerAuth.js
│   │   │
│   │   ├── model/
│   │   │   ├── orderModel.js
│   │   │   └── userModel.js
│   │   │
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   └── customerRoutes.js
│   │   │
│   │   ├── services/
│   │   │   ├── adminServices.js
│   │   │   ├── authService.js
│   │   │   └── customerServices.js
│   │   │
│   │   ├── socket/
│   │   │   └── socketHandler.js
│   │   │
│   │   └── validators/
│   │       ├── authValidation.js
│   │       └── orderValidation.js
│
└──frontend/
└── quick-commerce/
    ├── app/
    │   ├── admin/
    │   │   ├── login/page.tsx
    │   │   ├── orders/page.tsx
    │   │   ├── panel/page.tsx
    │   │   └── partners/page.tsx
    │   │
    │   ├── customers/
    │   │   ├── auth/page.tsx
    │   │   ├── order-status/page.tsx
    │   │   ├── place/page.tsx
    │   │   └── products/page.tsx
    │   │
    │   ├── partners/
    │   │   ├── auth/page.tsx
    │   │   └── order/page.tsx
    │   │
    │   └── page.tsx
    │
    ├── components/
    │   └── common/
    │       └── AuthCard.tsx
    │
    ├── config/
    │   └── api.ts
    │
    ├── lib/
    │   └── socket.ts
    │
    ├── public/
    │
    ├── Dockerfile
    └── package.json


````
---



---

## ⚙️ Setup Instructions (GCP Deployment)

### 1️⃣ SSH into your GCP VM

```bash
gcloud compute ssh your-vm-name --zone your-zone
```

### 2️⃣ Update packages & install required software

```bash
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install docker.io -y

# Install Docker Compose
sudo apt install docker-compose -y

# Install Nginx
sudo apt install nginx -y

# Install Nano editor (optional)
sudo apt install nano -y
```

### 3️⃣ Clone the repository

```bash
git clone https://github.com/sahuf2003/Quickly.git
cd Quickly
```


###  Configure Nginx Reverse Proxy

Create/edit Nginx site configs (two files — one for frontend, one for backend + WebSocket).

**Frontend (`/etc/nginx/sites-available/quickcommerce`):**

**Backend (`/etc/nginx/sites-available/quick-commerce-api`):**

Enable and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/quickcommerce /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/quickcommerce-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4️⃣ Start services with Docker Compose

```bash
docker-compose up -d --build
```

### 5️⃣ Access the application

* **Frontend:** [http://sahuf.com](http://sahuf.com/)

* **Backend API:** [https://api.sahuf.com](https://api.sahuf.com)
* **WebSocket:** `wss://api.sahuf.com`

---



## 🌐 Hosting & Deployment

* **Cloud Provider:** Google Cloud Platform (GCP)
* **Frontend:** Served via Nginx reverse proxy at `sahuf.com`.
* **Backend + Socket.io:** Served via Nginx reverse proxy at `api.sahuf.com` (same port for API and WebSocket).
* **Database:** MongoDB running inside Docker, networked with backend.
* **Docker:** Used for containerizing frontend, backend, and database.
* **Nginx:** Reverse proxy setup for both frontend and backend + WebSocket traffic.


## 🔌 WebSocket Flow

The backend’s WebSocket implementation handles **Customers**, **Delivery Partners**, and **Admins** with authentication via JWT.

**Core Events:**

* `joinPartnersRoom` → Authenticates partner, joins `partners` room, sends their locked orders and unassigned orders.
* `joinAdminsRoom` → Authenticates admin, joins `admins` room, sends all orders.
* `joinOrderRoom` → Joins specific order room for live updates.
* `orderPlaced` → Broadcasts new order to partners and admins.
* `lockOrder` → Locks order to first accepting partner, notifies admins & other partners.
* `updateOrderStatus` → Updates status (Picked Up, On the Way, Delivered) and broadcasts to customer & admins.

**Room Structure:**

* `partners` → All delivery partners.
* `admins` → All admins.
* `order_<id>` → Specific order tracking.

---

## 📈 Scaling Plan

* **Socket Scaling:**
  Use the `socket.io-redis` adapter for pub/sub communication between multiple backend instances to synchronize events.

* **Horizontal Scaling:**
  Deploy multiple backend containers behind an Nginx load balancer (or GCP Load Balancer).

* **Database Scaling:**
  For high traffic, use MongoDB replication and sharding.

---

## 🚀 Future Improvements

* Add **payment gateway** for online transactions.
* Implement **location-based filtering** for delivery partners to only receive nearby orders.
* Add push notifications for mobile devices.
* Implement GPS tracking for live delivery location.
* Deploy with Kubernetes for advanced scaling and orchestration.

---

## 🎥 Demo Video
Watch the full walkthrough here: [Click to watch](https://www.youtube.com/watch?v=hSogFRB6d24)


Admin email : admin@gmail.com
Admin password : admin123


