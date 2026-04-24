# MongoDB Atlas Connection Setup Guide

## Current Status
❌ **Authentication Failed** - The credentials in `.env` are either invalid or incorrectly formatted.

## Steps to Fix:

### 1. Get Your Connection String from MongoDB Atlas

1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Go to your **Cluster** → Click **Connect**
3. Choose **Drivers** → Select **Node.js**
4. Copy the connection string

### 2. Format Your Connection String

Your connection string should look like:
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

**Important:** 
- Replace `<username>` with your database user
- Replace `<password>` with your password (URL-encode special characters!)
- Replace `<cluster>` with your cluster name
- Replace `<database>` with your database name (usually `admin`)

### 3. URL Encode Special Characters in Password

If your password contains special characters, encode them:
- `!` → `%21`
- `"` → `%22`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `'` → `%27`
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`

**Online URL Encoder:** https://www.urlencoder.org/

### 4. Update Your `.env` File

```bash
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database?retryWrites=true&w=majority
NODE_ENV=production
JWT_SECRET=your-secret-key-change-this-in-production
```

### 5. Test the Connection

Run the diagnostic tool:
```bash
npm run test-mongo
```

## Connection Pool Configuration

The current setup uses:

**Development:**
- Min Pool Size: 2
- Max Pool Size: 10
- Max Idle Time: 60s

**Production:**
- Min Pool Size: 10
- Max Pool Size: 50
- Max Idle Time: 10 minutes

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| `authentication failed` | Wrong credentials | Verify username and password in Atlas |
| `URI malformed` | Special chars not encoded | URL-encode password special characters |
| `ENOTFOUND` | Cannot reach MongoDB | Check network/firewall rules |
| `ETIMEDOUT` | Connection timeout | Whitelist your IP in Atlas security settings |
| `User does not have permissions` | User lacks access | Add user in Database Access with read/write permissions |

## Useful Links

- [MongoDB Atlas Security](https://docs.atlas.mongodb.com/security-checklist/)
- [Connection String Format](https://docs.mongodb.com/manual/reference/connection-string/)
- [Network Access](https://docs.atlas.mongodb.com/security-whitelist/)

## MongoDB Connection Health Check

Available endpoints:
- `GET /api/db-health` - Check database connection status
- `GET /api/connection-stats` - View connection pool statistics
