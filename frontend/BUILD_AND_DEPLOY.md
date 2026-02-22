# Build & Deploy

**Your VPS is 2GB RAM** (`ubuntu-s-2vcpu-2gb`). The frontend build needs more memory and will be **Killed** on the VPS. Build on your PC and copy the result.

---

## 1. On your PC (Windows/Mac/Linux with enough RAM)

From the project folder:

```bash
cd frontend
npm install
npm run build
```

Check that `dist/index.html` and `dist/assets/js/` exist.

---

## 2. Copy dist to the VPS

Replace `YOUR_VPS_IP` with your server IP (or use the hostname if SSH works with it).

**Using rsync** (from your PC, inside the project):

```bash
rsync -avz --delete frontend/dist/ root@YOUR_VPS_IP:/var/www/zurt/
```

**Using SCP** (from your PC):

```bash
scp -r frontend/dist/* root@YOUR_VPS_IP:/var/www/zurt/
```

---

## 3. On the VPS: fix permissions and reload nginx

SSH into the VPS, then:

```bash
sudo chown -R www-data:www-data /var/www/zurt
sudo chmod -R u=rX,g=rX,o=rX /var/www/zurt
sudo nginx -t && sudo systemctl reload nginx
```

Open **https://zurt.com.br** and hard refresh (Ctrl+Shift+R).
