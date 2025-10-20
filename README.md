# Warung Madura Monolith Backend

## Overview

This project is the backend system for a "Warung Madura" application, built as a monolithic application using Node.js and Express. It provides core functionalities like authentication, product management, and order processing.

***

## Technology Stack

* **Framework:** Node.js, Express.js
* **Database:** PostgreSQL
* **ORM/Query Builder:** Knex.js, Objection.js
* **Authentication:** JWT (Access Tokens + Refresh Tokens stored in DB)
* **Validation:** express-validator
* **Containerization:** Docker, Docker Compose (for development)
* **Versioning:** standard-version (Conventional Commits)

***

## Features

* **Authentication:**
    * User Registration (`/api/register`)
    * Login with username or email (`/api/login`) - Provides JWT Access Token and Refresh Token.
    * Access Token Refresh (`/api/refresh`) - Uses Refresh Token to get a new Access Token.
    * Logout (`/api/logout`) - Invalidates the provided Refresh Token.
* **Database:**
    * Uses PostgreSQL.
    * Includes a `BaseModel` implementing **Soft Deletes** (`deleted_at` column) automatically applied to extending models (like `User`).
* **API:**
    * Standardized JSON responses (`successResponse`, `errorResponse`, `cursorPaginatedResponse`).
    * Global error handling middleware.
    * JWT Authentication middleware (`auth.middleware.js`).
    * API Documentation via Swagger (`/docs`).
* **Development:**
    * Dockerized development environment using `docker-compose`.
    * Automatic server restarts on code changes via `nodemon`.
    * Automatic versioning and changelog generation using `standard-version` and Conventional Commits.

***

## Prerequisites

* Node.js (v22 LTS recommended)
* npm (or pnpm)
* Docker & Docker Compose

***

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
    Edit the `.env` file and fill in your specific database credentials (`DB_USER`, `DB_PASSWORD`, `DB_DATABASE`), ensure `DB_HOST` is set correctly for Docker (usually the service name, e.g., `db`), and set a strong `APP_KEY` for JWT signing. Adjust ports if necessary.

***

## Running the Application (Development)

1.  **Start Docker Containers:**
    From the root directory, run:
    ```bash
    docker-compose up --build
    ```
    *Use the `-d` flag to run in detached mode.*

2.  **Run Database Migrations:**
    Once the containers are running (especially the database), open a **new terminal window** or tab and execute the migrations inside the application container:
    ```bash
    docker-compose exec app npm run migrate
    ```
    *You only need to run migrations the first time or when new migration files are added.*

3.  **Accessing the Application:**
    * The API should be available at `http://localhost:<APP_PORT>` (e.g., `http://localhost:8080` by default). API routes are prefixed with `/api`.
    * The Swagger API documentation is available at `http://localhost:<APP_PORT>/docs` (e.g., `http://localhost:8080/docs`).

***

## Stopping the Application

* If running in the foreground, press `Ctrl+C` in the terminal where `docker-compose up` is running.
* If running in detached mode (`-d`), run:
    ```bash
    docker-compose down
    ```
* To stop containers *and remove database volumes* (useful for a completely fresh start, **data will be lost**):
    ```bash
    docker-compose down -v
    ```

***

## Versioning and Releases

This project uses `standard-version` for automated versioning and changelog generation based on Conventional Commits.

1.  **Commit Changes:** Make sure your commit messages follow the Conventional Commits specification (e.g., `feat: add product search`, `fix(auth): resolve token expiry issue`).
2.  **Run Release:** When ready to release a new version:
    ```bash
    npm run release
    ```
    This will bump the version in `package.json`, update `CHANGELOG.md`, commit these changes, and create a Git tag.
3.  **Push Changes:** Push the commit and tags to your remote repository:
    ```bash
    git push --follow-tags origin main # Or your default branch
    ```