# Village Community Website - Fixed Version

## What was fixed

1. Fixed the localhost 5173 404 issue by adding a root `vite.config.js` with `root: 'frontend'`.
2. Fixed frontend entry path in `frontend/index.html` and `frontend/src/main.jsx`.
3. Fixed broken imports like `./src/context/AuthContext.jsx` and `./src/services/config.js`.
4. Added missing `AuthContext.jsx` and API config file.
5. Added missing MongoDB models: User, Product, Category, Media.
6. Replaced TODO auth/admin/product/category/media routes with working MongoDB routes.
7. Added JWT login/register flow with localStorage token support.
8. Fixed build output to root `dist` and backend static hosting path.
9. Fixed resume upload path so resumes can be opened from admin.
10. Verified frontend build successfully.

## MongoDB status

MongoDB is present in this project. Backend uses Mongoose and reads connection from:

```env
MONGODB_URI=mongodb://localhost:27017/villagecommunity
```

For Atlas, replace it with your MongoDB Atlas connection string in `.env`.

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

In another terminal run backend:

```bash
npm run server
```

Backend:

```text
http://localhost:5000/api/health
```

## Full run together

```bash
npm run dev:full
```

## Important

The first registered user automatically becomes `admin`. All later users become normal `user`.
