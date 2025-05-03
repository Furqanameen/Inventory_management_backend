# 🧪 inventory

`inventory` is a backend service to manage inventory

---

## 🚀 Project Setup

### ⚙️ System Requirements

Make sure your development environment includes:

- **Node.js**: ≥ 18.12.1
- **NPM**: ≥ 9.6.6
- **MongoDB**: ≥ 8.x
- **OpenSSL**: ≥ 1.1.1 (required for key generation)

---

### 📦 Installation

```bash
git clone https://github.com/your-org/inventory.git
cd inventory
npm install
```

### Generate RS256 Private Key

```bash
openssl genpkey -algorithm RSA -out keys/inventory-private.pem -pkeyopt rsa_keygen_bits:2048
```

# Extract Public Key

```bash
openssl rsa -pubout -in keys/inventory-private.pem -out keys/inventory-public.pem
```
