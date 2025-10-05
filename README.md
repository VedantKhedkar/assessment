# Secure Password Vault (MVP)

A full-stack web application designed to securely generate, store, and manage user passwords with a modern, theme-aware interface.

[**Live Demo**](https://assessment-nine-beta.vercel.app/)

---
![Secure Vault Screenshot](/src/assets/image.png)

## Key Features

- **Secure User Authentication:** Users can register and log in with passwords hashed using **bcryptjs**. Sessions are managed with **JSON Web Tokens (JWT)**.
- **Single Page Application (SPA) Flow:** A seamless user experience where the landing, authentication, and dashboard views are all handled automatically on a single page.
- **Encrypted CRUD Vault:** Full Create, Read, Update, and Delete functionality for password entries.
- **Client-Side Encryption:** All vault passwords are encrypted in the browser with **AES encryption** (`crypto-js`) before being sent to the server, ensuring the database never stores plaintext secrets.
- **Password Generator:** A utility to create strong, customizable passwords based on length and character types.
- **Dark Mode:** A toggleable light/dark theme for improved user experience, built with CSS variables.

---

## Tech Stack

This project was built using a modern, full-stack JavaScript architecture:

- **Framework:** **Next.js** (utilizing the App Router for both frontend React components and backend API routes).
- **Database:** **MongoDB**, with **Mongoose** as the Object Data Modeling (ODM) library for elegant data interaction.
- **Styling:** **Tailwind CSS**, with a class-based Dark Mode implementation using CSS variables.
- **Authentication:** **bcryptjs** for password hashing and **jsonwebtoken** for managing user sessions.
- **Client-Side Security:** **crypto-js** for AES encryption of vault items.

---

## How to Run Locally

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the project root and add your environment variables:
    ```
    MONGODB_URI="your_mongodb_connection_string"
    JWT_SECRET="your_jwt_secret_key"
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```

---

## Note on Cryptography

<<<<<<< HEAD
For client-side security, this project uses the `crypto-js` library. This was chosen to provide a straightforward and well-vetted implementation of the AES encryption standard, allowing for robust encryption of user passwords directly in the browser before they are ever sent to the server.
=======
For client-side security, this project uses the `crypto-js` library. This was chosen to provide a straightforward and well-vetted implementation of the AES encryption standard, allowing for robust encryption of user passwords directly in the browser before they are ever sent to the server.
>>>>>>> d7ccd46df4f73c0f92c8edd8fb66d62862fe5ace
