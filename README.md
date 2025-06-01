## 🛠️ Project Environment Setup

This project requires the following tools and technologies:

* **Node.js**
* **TypeScript**
* **ESLint** (for clean and consistent code)
* **Tailwind CSS**
* **Next.js App Router**
* **Turbopack** (faster build system)
* **NextAuth.js** with **Prisma Adapter**
* **Passwordless Login** via **Google Provider**

---

### 🌱 Required Environment Variables

Make sure your `.env` file includes the following:

```env
# PostgreSQL Database
DATABASE_URL=

# NextAuth secret (for signing tokens/cookies)
NEXTAUTH_SECRET=

# Google OAuth credentials (for passwordless login)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

### ⚙️ Initial Setup

1. **Initialize Prisma**
   Run the following in your terminal:

   ```bash
   npx prisma init
   ```

2. **Define Your Prisma Schema**
   Modify `prisma/schema.prisma` based on your database structure and auth needs.

3. **Apply Your Migration**

   ```bash
   npx prisma migrate dev --name init
   ```

---

### 🔐 Generate a Secure Secret

To generate your `NEXTAUTH_SECRET`, use:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

You can use other secure methods too — just make sure it's at least 32 bytes (64 characters hex).

---

### 🌐 Set Up Google OAuth

Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a new OAuth 2.0 credential.

Set these URIs:

* **Authorized JavaScript origins**

  ```
  http://localhost:3000
  https://your-production-url.com
  ```

* **Authorized redirect URIs**

  ```
  http://localhost:3000/api/auth/callback/google
  https://your-production-url.com/api/auth/callback/google
  ```

Once created, copy your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` into your `.env`.

