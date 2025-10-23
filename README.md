# Warung Madura Monolith Backend

## Overview

This project is the backend system for a "Warung Madura" application, built as a monolithic application using Node.js and Express. It provides core functionalities like authentication, product management, order processing, and a shopping cart.

---

## Technology Stack

-   **Framework:** Node.js, Express.js
-   **Database:** PostgreSQL
-   **ORM/Query Builder:** Knex.js, Objection.js
-   **Authentication:** JWT (Access Tokens + Refresh Tokens stored in DB)
-   **Cart:** Redis
-   **Validation:** express-validator
-   **Containerization:** Docker, Docker Compose (for development)
-   **Versioning:** standard-version (Conventional Commits)

---

## Features

-   **Authentication:** Register, Login (username/email), Refresh Token, Logout.
-   **Categories:** CRUD operations for product categories (with soft deletes).
-   **Products:** CRUD operations for products (with soft deletes), includes category relationship, paginated listing (cursor-based).
-   **Shopping Cart (Redis):** Add/update item, view cart, remove item, clear cart.
-   **Orders:** Place order (transactionally updates stock), view order details, view user's order history (paginated).
-   **Database:** PostgreSQL with soft delete (`deleted_at`) pattern via `BaseModel`.
-   **API:** Standardized responses, global error handling, JWT middleware, Swagger docs.
-   **Development:** Dockerized environment, `nodemon` for auto-reload, `standard-version` for releases.

---

## Prerequisites

-   Node.js (v22 LTS recommended)
-   npm (or pnpm)
-   Docker & Docker Compose

---

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd warung-madura-monolith
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or if using pnpm:
    # pnpm install
    ```

3.  **Configure Environment Variables:**
    Copy the `.env.example` file to `.env`:
    ```bash
    cp .env.example .env
    ```
    Edit the `.env` file and fill in your specific database credentials (`DB_USER`, `DB_PASSWORD`, `DB_DATABASE`), ensure `DB_HOST` is `db` (the Docker service name), ensure `REDIS_URL` is `redis://redis:6379`, and set a strong `APP_KEY`. Adjust ports if necessary.

---

## Running the Application (Development)

1.  **Start Docker Containers:**
    From the root directory, run:

    ```bash
    docker-compose up --build -d
    ```

    _(Use `-d` to run in detached mode)._

2.  **Run Database Migrations:**
    Once the containers are running, execute the migrations inside the application container:

    ```bash
    docker-compose exec app npm run migrate
    ```

3.  **(Optional) Run Database Seeds:**
    To populate the database with initial sample data:

    ```bash
    docker-compose exec app npm run seed
    ```

4.  **Accessing the Application:**
    -   The API should be available at `http://localhost:<APP_PORT>` (e.g., `http://localhost:8080` by default). API routes are prefixed with `/api`.
    -   The Swagger API documentation is available at `http://localhost:<APP_PORT>/docs` (e.g., `http://localhost:8080/docs`).

---

## How to Use (API Flow)

1.  **Register a User:**

    -   Send a `POST` request to `/api/register` with `username`, `email`, and `password` in the JSON body.

2.  **Login:**

    -   Send a `POST` request to `/api/login` with `loginIdentifier` (username or email) and `password`.
    -   **Save the `accessToken` and `refreshToken`** from the response data. You'll need these for subsequent requests. (Tools like Bruno or Postman can automate saving these to environment variables).

3.  **Access Protected Routes:**

    -   For endpoints requiring authentication (Categories, Products, Cart, Orders), include the `Authorization` header with the value `Bearer YOUR_ACCESS_TOKEN`.
    -   Example: `GET /api/categories` with the header `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

4.  **Manage Cart (Example):**

    -   Add an item: `POST /api/cart` with `{"product_id": "...", "quantity": 2}` and the `Authorization` header.
    -   View cart: `GET /api/cart` with the `Authorization` header.
    -   Remove item: `DELETE /api/cart/items/:productId` with the `Authorization` header.

5.  **Place an Order:**

    -   Ensure your cart has items (or construct the `items` array manually).
    -   Send a `POST` request to `/api/orders` with `{"items": [{"product_id": "...", "quantity": 1}, ...]}` and the `Authorization` header.
    -   On success, the cart in Redis is _not_ automatically cleared by this endpoint (you might want to add a `DELETE /api/cart` call client-side after a successful order).

6.  **Refresh Token:**

    -   If your `accessToken` expires (you get a 401 Unauthorized, possibly with a specific message like "Token has expired"), send a `POST` request to `/api/refresh` with your `refreshToken` in the body: `{"refreshToken": "YOUR_REFRESH_TOKEN"}`.
    -   Save the new `accessToken` returned in the response and retry the original request.

7.  **Logout:**
    -   To invalidate a `refreshToken` (e.g., when the user explicitly logs out), send a `POST` request to `/api/logout` with the `refreshToken`: `{"refreshToken": "YOUR_REFRESH_TOKEN"}`.
    -   Clear both `accessToken` and `refreshToken` stored on the client-side.

---

## Stopping the Application

-   If running in the foreground, press `Ctrl+C`.
-   If running in detached mode (`-d`), run: `docker-compose down`
-   To stop containers _and remove database/Redis volumes_ (**data will be lost**): `docker-compose down -v`

---

## Versioning and Releases

This project uses `standard-version`.

1.  Commit changes following [Conventional Commits](https://www.conventionalcommits.org/).
2.  Run `npm run release` to bump the version, update `CHANGELOG.md`, commit, and tag.
3.  Push: `git push --follow-tags origin main` (or your branch).
