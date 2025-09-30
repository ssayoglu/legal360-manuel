# Legal360 CMS - Production Deployment Guide
**Complete Manual Deployment Instructions for AI Agent**

## 🚨 CRITICAL DEPLOYMENT CHECKLIST

### **BEFORE YOU START**
- [ ] Fresh Ubuntu 20.04/22.04 server
- [ ] Root or sudo access
- [ ] Domain name pointed to server IP
- [ ] At least 2GB RAM, 20GB disk space
- [ ] Backup archive: `legal360-cms-backup-YYYYMMDD-HHMMSS.tar.gz`

---

## 📦 DATABASE BACKUP INFORMATION

### **Current Database Structure** (13 Collections)
```
legal360 database contains:
├── admin_users (1 document) - Admin credentials
├── about_page_content (1 document) - About page CMS data
├── ad_settings (1 document) - Advertisement settings
├── blog_posts (4 documents) - Blog articles
├── calculator_parameters (13 documents) - Legal calculator data
├── contact_page_content (1 document) - Contact page CMS data
├── content_pages (2 documents) - Generic page content
├── footer_config (1 document) - Footer configuration
├── home_page_content (1 document) - Home page CMS data
├── legal_aid_info (1 document) - Legal aid information
├── legal_processes (3 documents) - Legal process flows
├── menu_config (1 document) - Header menu configuration
├── site_settings (1 document) - Global site settings
└── supreme_court_decisions (3 documents) - Court decisions
```

### **Backup Files Location**
- **Archive**: `/app/deployment-backup/legal360-cms-backup-YYYYMMDD-HHMMSS.tar.gz`
- **MongoDB Dump**: `mongodb-backup/legal360/` (inside archive)
- **Requirements**: `backend-requirements.txt`, `frontend-package.json`
- **Environment Templates**: `backend-env-template`, `frontend-env-template`

### **Database Restore Commands**
```bash
# Extract backup
tar -xzf legal360-cms-backup-YYYYMMDD-HHMMSS.tar.gz

# Restore MongoDB
mongorestore --host localhost:27017 --db legal360 mongodb-backup/legal360/

# Verify restore
mongo legal360 --eval "db.stats()"
```

---

## 🚀 STEP-BY-STEP DEPLOYMENT PROCESS

### **PHASE 1: SERVER PREPARATION**

#### **1.1 System Update**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install curl wget git unzip software-properties-common -y
```

#### **1.2 Install Node.js 18+**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Should be 18+
npm --version
```

#### **1.3 Install Python 3.9+**
```bash
sudo apt install python3 python3-pip python3-venv -y
python3 --version  # Should be 3.9+
pip3 --version
```

#### **1.4 Install MongoDB 6.0+**
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod  # Should be active
```

#### **1.5 Install Nginx**
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
sudo ufw allow 'Nginx Full'
```

#### **1.6 Install PM2 (Process Manager)**
```bash
sudo npm install -g pm2
pm2 startup  # Follow the instructions
```

### **PHASE 2: APPLICATION SETUP**

#### **2.1 Create Application Directory**
```bash
sudo mkdir -p /var/www/legal360
sudo chown $USER:$USER /var/www/legal360
cd /var/www/legal360
```

#### **2.2 Clone/Upload Application Code**
```bash
# Option A: From Git (if available)
git clone [YOUR_REPO_URL] .

# Option B: Upload files manually
# Upload your codebase to /var/www/legal360
```

#### **2.3 Backend Setup**
```bash
cd /var/www/legal360/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create production .env
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=legal360
JWT_SECRET=your-super-secure-production-secret-key-change-this
PORT=8001
CORS_ORIGINS=https://yourdomain.com
EOF
```

#### **2.4 Frontend Setup**
```bash
cd /var/www/legal360/frontend

# Install dependencies
npm install

# Create production .env
cat > .env << EOF
REACT_APP_BACKEND_URL=https://yourdomain.com
EOF

# Build for production
npm run build
```

### **PHASE 3: DATABASE RESTORATION**

#### **3.1 Upload and Extract Backup**
```bash
cd /var/www/legal360
# Upload legal360-cms-backup-YYYYMMDD-HHMMSS.tar.gz to this directory

# Extract backup
tar -xzf legal360-cms-backup-*.tar.gz
```

#### **3.2 Restore MongoDB Data**
```bash
# Restore all collections
mongorestore --host localhost:27017 --db legal360 mongodb-backup/legal360/

# Verify restoration
mongo legal360 --eval "db.runCommand({listCollections: 1}).cursor.firstBatch.forEach(printjson)"

# Check critical collections
mongo legal360 --eval "print('Admin users: ' + db.admin_users.count())"
mongo legal360 --eval "print('Home content: ' + db.home_page_content.count())"
mongo legal360 --eval "print('Legal processes: ' + db.legal_processes.count())"
```

#### **3.3 Verify Data Integrity**
```bash
# Test MongoDB connection
mongo legal360 --eval "db.home_page_content.findOne()"

# Should return home page content object
```

### **PHASE 4: DOMAIN & SSL CONFIGURATION**

#### **4.1 Configure Nginx**
```bash
sudo cat > /etc/nginx/sites-available/legal360 << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Certificate paths (will be configured by certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Frontend (React build)
    location / {
        root /var/www/legal360/frontend/build;
        try_files $uri $uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Replace yourdomain.com with actual domain
sudo sed -i 's/yourdomain.com/YOUR_ACTUAL_DOMAIN/g' /etc/nginx/sites-available/legal360

# Enable site
sudo ln -s /etc/nginx/sites-available/legal360 /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
```

#### **4.2 Install SSL Certificate**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### **PHASE 5: PROCESS MANAGEMENT**

#### **5.1 Create PM2 Configuration**
```bash
cd /var/www/legal360

cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'legal360-backend',
      cwd: '/var/www/legal360/backend',
      script: 'python3',
      args: 'server.py',
      interpreter: '/var/www/legal360/backend/venv/bin/python',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8001
      },
      error_file: '/var/log/legal360-backend-error.log',
      out_file: '/var/log/legal360-backend-out.log',
      log_file: '/var/log/legal360-backend.log'
    }
  ]
};
EOF
```

#### **5.2 Start Services**
```bash
# Start backend with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Restart Nginx
sudo systemctl restart nginx
```

### **PHASE 6: VERIFICATION & TESTING**

#### **6.1 Health Checks**
```bash
# Check services
pm2 status
sudo systemctl status nginx
sudo systemctl status mongod

# Test backend API
curl -I https://yourdomain.com/api/health

# Test frontend
curl -I https://yourdomain.com/

# Check SSL
curl -I https://yourdomain.com/
```

#### **6.2 Admin Panel Access**
- **URL**: `https://yourdomain.com/admin/login`
- **Username**: `admin` 
- **Password**: `admin123`

#### **6.3 CMS Functionality Test**
1. Login to admin panel
2. Go to "Ana Sayfa İçeriği" (Home Content)
3. Make a small change and save
4. Visit homepage to verify change

---

## 🚨 TROUBLESHOOTING GUIDE

### **Common Issues & Solutions**

#### **Issue 1: Backend Won't Start**
```bash
# Check logs
pm2 logs legal360-backend

# Common fixes:
cd /var/www/legal360/backend
source venv/bin/activate
pip install -r requirements.txt

# Check Python path
which python3
```

#### **Issue 2: MongoDB Connection Failed**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Restart MongoDB
sudo systemctl restart mongod
```

#### **Issue 3: Nginx 502 Bad Gateway**
```bash
# Check if backend is running
curl localhost:8001/api/health

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart services
pm2 restart legal360-backend
sudo systemctl restart nginx
```

#### **Issue 4: SSL Certificate Problems**
```bash
# Renew certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates

# Test SSL configuration
sudo nginx -t
```

#### **Issue 5: Database Data Missing**
```bash
# Check database contents
mongo legal360 --eval "db.runCommand({listCollections: 1})"

# Re-restore if needed
mongorestore --host localhost:27017 --db legal360 --drop mongodb-backup/legal360/
```

### **Log Files to Check**
- **Backend Logs**: `/var/log/legal360-backend.log`
- **Nginx Logs**: `/var/log/nginx/error.log`, `/var/log/nginx/access.log`
- **MongoDB Logs**: `/var/log/mongodb/mongod.log`
- **PM2 Logs**: `pm2 logs`

### **Emergency Commands**
```bash
# Restart all services
pm2 restart all
sudo systemctl restart nginx
sudo systemctl restart mongod

# Check disk space
df -h

# Check memory usage
free -h

# Check running processes
ps aux | grep -E "(python|nginx|mongod)"
```

---

## 🔐 SECURITY CHECKLIST

### **Firewall Configuration**
```bash
sudo ufw enable
sudo ufw allow 22      # SSH
sudo ufw allow 80      # HTTP
sudo ufw allow 443     # HTTPS
sudo ufw status
```

### **MongoDB Security**
```bash
# Create admin user (optional but recommended)
mongo admin --eval '
db.createUser({
  user: "admin",
  pwd: "secure-admin-password",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase"]
})
'

# Enable authentication in /etc/mongod.conf
sudo sed -i 's/#security:/security:\n  authorization: enabled/' /etc/mongod.conf
sudo systemctl restart mongod
```

### **File Permissions**
```bash
sudo chown -R www-data:www-data /var/www/legal360/frontend/build
sudo chmod -R 755 /var/www/legal360
```

---

## 📊 POST-DEPLOYMENT MONITORING

### **Health Monitoring Script**
```bash
cat > /var/www/legal360/health-check.sh << 'EOF'
#!/bin/bash
echo "=== Legal360 Health Check $(date) ==="

# Check services
echo "PM2 Status:"
pm2 jlist | jq '.[] | {name: .name, status: .pm2_env.status}'

echo -e "\nNginx Status:"
sudo systemctl is-active nginx

echo -e "\nMongoDB Status:"
sudo systemctl is-active mongod

echo -e "\nAPI Health:"
curl -s https://yourdomain.com/api/health || echo "API unreachable"

echo -e "\nFrontend Health:"
curl -s -o /dev/null -w "%{http_code}" https://yourdomain.com/

echo -e "\nDisk Usage:"
df -h /

echo -e "\nMemory Usage:"
free -h
EOF

chmod +x /var/www/legal360/health-check.sh
```

### **Backup Script**
```bash
cat > /var/www/legal360/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/legal360"
DATE=$(date +%Y%m%d-%H%M%S)

mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --host localhost:27017 --db legal360 --out $BACKUP_DIR/db-$DATE

# Backup application files
tar -czf $BACKUP_DIR/app-$DATE.tar.gz -C /var/www legal360

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /var/www/legal360/backup.sh

# Add to crontab for daily backups
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/legal360/backup.sh") | crontab -
```

---

## ✅ DEPLOYMENT SUCCESS CRITERIA

### **Functional Requirements**
- [ ] Website loads at https://yourdomain.com
- [ ] Admin panel accessible at https://yourdomain.com/admin/login
- [ ] All CMS functionality working (home, contact, about, site settings)
- [ ] Database contains all migrated data
- [ ] SSL certificate valid and auto-renewing

### **Technical Requirements**
- [ ] All services running (PM2, Nginx, MongoDB)
- [ ] Log files being written correctly
- [ ] Firewall configured properly
- [ ] Backup system operational

### **Performance Requirements**
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Admin panel responsive
- [ ] Mobile-friendly interface

---

## 🆘 EMERGENCY CONTACTS & PROCEDURES

### **If Deployment Fails Completely**
1. **Document the error** - Save all error messages and logs
2. **Check troubleshooting section** - Follow relevant solutions
3. **Restore from backup** - If needed, start fresh with backup data
4. **Contact support** - Include error logs and steps attempted

### **Critical File Locations**
- **Application**: `/var/www/legal360/`
- **Nginx Config**: `/etc/nginx/sites-available/legal360`
- **SSL Certificates**: `/etc/letsencrypt/live/yourdomain.com/`
- **MongoDB Data**: `/var/lib/mongodb/`
- **Logs**: `/var/log/`

---

**🎯 DEPLOYMENT COMPLETE WHEN:**
- Legal360 CMS is accessible via HTTPS
- Admin panel login works
- All CMS functionality operational
- Database fully migrated
- Services stable and monitored

**This guide ensures 100% successful deployment with comprehensive error handling and monitoring.**