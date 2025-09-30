# AI Agent Deployment Instructions
**Comprehensive Guide for AI Agent to Deploy Legal360 CMS**

## 🤖 AI AGENT DEPLOYMENT PROTOCOL

### **PRE-DEPLOYMENT CHECKLIST**
Before starting deployment, AI agent must verify:
- [ ] Fresh Ubuntu 20.04/22.04 server with root/sudo access
- [ ] Server has minimum requirements: 2GB RAM, 20GB disk, internet connection
- [ ] Domain name configured and pointing to server IP
- [ ] Backup archive available: `legal360-cms-backup-YYYYMMDD-HHMMSS.tar.gz`

### **CRITICAL EXECUTION ORDER**
AI Agent must follow this exact sequence - DO NOT skip steps or change order:

1. **System Preparation** → Install all dependencies first
2. **Database Setup** → MongoDB installation and data restoration
3. **Application Deployment** → Code setup and configuration
4. **Domain Configuration** → Nginx and SSL setup
5. **Service Management** → PM2 and process monitoring
6. **Verification** → Complete functionality testing

---

## 🔧 TECHNICAL EXECUTION GUIDELINES

### **Command Execution Best Practices**
```bash
# Always check command success
command_to_run && echo "✅ Success" || echo "❌ Failed"

# Use proper error handling
if ! command_to_run; then
    echo "Command failed, checking logs..."
    tail -n 20 /var/log/relevant-log.log
    exit 1
fi

# Verify service status after installation
sudo systemctl status service_name
```

### **Environment Variable Handling**
```bash
# CRITICAL: Replace placeholders with actual values
# WRONG: REACT_APP_BACKEND_URL=https://yourdomain.com  
# RIGHT: REACT_APP_BACKEND_URL=https://legal360.example.com

# Template replacement pattern:
sed -i 's/yourdomain.com/actual-domain.com/g' config-file

# Always verify environment files after creation
echo "Verifying .env file:"
cat /path/to/.env
```

### **Database Restoration Protocol**
```bash
# CRITICAL SEQUENCE:
# 1. Install MongoDB first
# 2. Start MongoDB service
# 3. Extract backup archive
# 4. Restore data
# 5. Verify data integrity

# MongoDB restore verification:
mongo legal360 --eval "
print('Collections:');
db.runCommand({listCollections: 1}).cursor.firstBatch.forEach(c => print(c.name));
print('Total documents:');
print('Admin users: ' + db.admin_users.count());
print('Home content: ' + db.home_page_content.count());
print('Legal processes: ' + db.legal_processes.count());
"
```

### **Service Management Requirements**
```bash
# PM2 Process Management - Critical Configuration
# 1. Create ecosystem.config.js with correct paths
# 2. Start services with PM2
# 3. Save PM2 configuration
# 4. Enable PM2 startup

# Verification commands after each service:
pm2 status                    # Should show running processes
sudo systemctl status nginx  # Should be active (running)
sudo systemctl status mongod # Should be active (running)
```

---

## 🚨 ERROR HANDLING PROTOCOL

### **Mandatory Error Checks**
AI Agent must perform these checks after each major step:

#### **After System Preparation**
```bash
# Verify installations
node --version    # Should be 18+
python3 --version # Should be 3.9+
mongod --version  # Should be 6.0+
nginx -v          # Should show version
pm2 --version     # Should show version
```

#### **After Database Setup**
```bash
# Test MongoDB connection
sudo systemctl status mongod | grep "active (running)" || {
    echo "❌ MongoDB not running"
    sudo journalctl -u mongod.service --no-pager -l
    exit 1
}

# Test data restoration
mongo legal360 --eval "db.admin_users.count()" | grep -q "1" || {
    echo "❌ Database restore failed"
    exit 1
}
```

#### **After Application Setup**
```bash
# Test backend dependencies
cd /var/www/legal360/backend
source venv/bin/activate
python3 -c "import fastapi, pymongo, pydantic" || {
    echo "❌ Backend dependencies missing"
    pip list
    exit 1
}

# Test frontend build
ls /var/www/legal360/frontend/build/index.html || {
    echo "❌ Frontend build failed"
    npm run build
    exit 1
}
```

#### **After SSL Configuration**
```bash
# Verify SSL certificate
sudo certbot certificates | grep -q "VALID" || {
    echo "❌ SSL certificate installation failed"
    sudo certbot certificates
    exit 1
}

# Test HTTPS connection
curl -I https://actual-domain.com | grep -q "200 OK" || {
    echo "❌ HTTPS connection failed"
    curl -v https://actual-domain.com
    exit 1
}
```

### **Failure Recovery Procedures**

#### **If MongoDB Installation Fails**
```bash
# Clean installation
sudo apt remove --purge mongodb-org* -y
sudo rm -rf /var/log/mongodb /var/lib/mongodb
sudo apt autoremove -y

# Retry with manual repository setup
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
```

#### **If SSL Certificate Fails**
```bash
# Debug DNS resolution
nslookup actual-domain.com
dig actual-domain.com

# Try alternative method
sudo certbot certonly --standalone -d actual-domain.com -d www.actual-domain.com

# Manual Nginx SSL configuration if needed
```

#### **If Services Won't Start**
```bash
# Comprehensive service debugging
echo "=== Checking all services ==="
sudo systemctl status mongod nginx
pm2 status

echo "=== Checking logs ==="
sudo tail -n 50 /var/log/mongodb/mongod.log
sudo tail -n 50 /var/log/nginx/error.log
pm2 logs --lines 50

echo "=== Checking ports ==="
sudo netstat -tulpn | grep -E ":80|:443|:8001|:27017"
```

---

## 📝 MANDATORY LOGGING & DOCUMENTATION

### **Progress Logging Requirements**
AI Agent must log progress at each step:

```bash
# Example logging format
echo "$(date '+%Y-%m-%d %H:%M:%S') - [INFO] Starting MongoDB installation" | tee -a /var/log/deployment.log
echo "$(date '+%Y-%m-%d %H:%M:%S') - [SUCCESS] MongoDB installation completed" | tee -a /var/log/deployment.log
echo "$(date '+%Y-%m-%d %H:%M:%S') - [ERROR] SSL certificate installation failed" | tee -a /var/log/deployment.log
```

### **Final Deployment Report**
AI Agent must generate this report upon completion:

```bash
cat > /var/www/legal360/DEPLOYMENT_REPORT.md << 'EOF'
# Legal360 CMS Deployment Report
**Date**: $(date)
**Domain**: [ACTUAL_DOMAIN]
**Server**: [SERVER_IP]

## ✅ Successful Components
- [ ] MongoDB installed and data restored
- [ ] Backend service running on PM2
- [ ] Frontend built and served by Nginx
- [ ] SSL certificate installed and valid
- [ ] All health checks passing

## 🔗 Access Information
- **Website**: https://[ACTUAL_DOMAIN]
- **Admin Panel**: https://[ACTUAL_DOMAIN]/admin/login
- **Credentials**: admin / admin123

## 📊 Service Status
```
pm2 status
sudo systemctl status nginx mongod
```

## 🗄️ Database Information
```
mongo legal360 --eval "
print('Database: legal360');
print('Collections: ' + db.runCommand({listCollections: 1}).cursor.firstBatch.length);
print('Admin users: ' + db.admin_users.count());
print('CMS pages: ' + (db.home_page_content.count() + db.contact_page_content.count() + db.about_page_content.count()));
"
```

## 🔐 Security Configuration
- Firewall: Enabled (ports 22, 80, 443)
- SSL: Let's Encrypt certificate installed
- MongoDB: Running with default security
- File permissions: Properly configured

## 📋 Maintenance Information
- **Health Check**: `/var/www/legal360/health-check.sh`
- **Backup Script**: `/var/www/legal360/backup.sh`
- **Log Files**: `/var/log/legal360-*`
- **Configuration**: `/etc/nginx/sites-available/legal360`

## 🚨 Known Issues
[Document any issues encountered and resolved]

---
**Deployment Status**: ✅ SUCCESSFUL
**Next Steps**: Monitor services and perform regular maintenance
EOF
```

---

## 🎯 SUCCESS VALIDATION PROTOCOL

### **Mandatory Final Tests**
AI Agent must perform these tests before declaring success:

#### **1. Web Application Test**
```bash
# Test homepage loading
curl -s -o /dev/null -w "%{http_code}" https://actual-domain.com/ | grep -q "200" || {
    echo "❌ Homepage not loading"
    exit 1
}

# Test API endpoints
curl -s https://actual-domain.com/api/health | grep -q "ok" || {
    echo "❌ API not responding"
    exit 1
}
```

#### **2. Admin Panel Test**
```bash
# Test admin login page
curl -s https://actual-domain.com/admin/login | grep -q "login" || {
    echo "❌ Admin panel not accessible"
    exit 1
}
```

#### **3. CMS Functionality Test**
```bash
# Test CMS API endpoints
curl -s https://actual-domain.com/api/home-page-content | jq '.hero_title' || {
    echo "❌ CMS data not accessible"
    exit 1
}
```

#### **4. SSL Security Test**
```bash
# Test SSL configuration
echo | openssl s_client -servername actual-domain.com -connect actual-domain.com:443 2>/dev/null | openssl x509 -noout -dates || {
    echo "❌ SSL certificate issue"
    exit 1
}
```

### **Performance Verification**
```bash
# Load time test
time curl -s -o /dev/null https://actual-domain.com/
# Should complete in < 5 seconds

# Memory usage check
free -h | grep Mem
# Should have available memory

# Disk space check
df -h /
# Should have > 10% available space
```

---

## 🚨 CRITICAL FAILURE SCENARIOS

### **When to ABORT Deployment**
AI Agent must stop deployment and report failure if:

1. **MongoDB fails to install after 2 attempts**
2. **Domain DNS resolution fails completely**
3. **SSL certificate cannot be obtained after multiple methods**
4. **Backend service fails to start after configuration fixes**
5. **Critical data is lost during database restoration**

### **Failure Reporting Template**
```bash
cat > /var/log/DEPLOYMENT_FAILURE_REPORT.md << 'EOF'
# DEPLOYMENT FAILURE REPORT
**Date**: $(date)
**Server**: [SERVER_INFO]
**Domain**: [DOMAIN_NAME]

## ❌ Failure Point
[Specific step where deployment failed]

## 🔍 Error Details
```
[Exact error messages and logs]
```

## 🛠️ Attempted Solutions
1. [What was tried]
2. [Results of each attempt]
3. [Final state]

## 📊 System State
```
# Service status
sudo systemctl status mongod nginx
pm2 status 2>/dev/null || echo "PM2 not configured"

# Disk/Memory
df -h
free -h

# Network
curl -I http://localhost
```

## 🔄 Recovery Recommendations
[Steps needed to recover or retry deployment]

---
**Status**: ❌ DEPLOYMENT FAILED
**Requires**: Manual intervention or fresh server
EOF
```

---

## 📚 REFERENCE COMMANDS FOR AI AGENT

### **Quick Status Checks**
```bash
# One-liner system health
echo "Services: $(sudo systemctl is-active nginx mongod) | PM2: $(pm2 jlist 2>/dev/null | jq length) | SSL: $(curl -s -I https://domain.com | head -n1)"

# Quick log review
tail -n 20 /var/log/nginx/error.log /var/log/mongodb/mongod.log

# Process verification
ps aux | grep -E "(nginx|mongod|python.*server.py)" | grep -v grep
```

### **Emergency Restart Sequence**
```bash
# Complete service restart
sudo systemctl restart mongod
sleep 5
pm2 restart all
sleep 3
sudo systemctl restart nginx

# Verification
sudo systemctl status mongod nginx
pm2 status
```

### **Backup and Recovery**
```bash
# Quick backup before changes
mongodump --host localhost:27017 --db legal360 --out /tmp/emergency-backup-$(date +%Y%m%d-%H%M%S)

# Quick restore if needed
mongorestore --host localhost:27017 --db legal360 --drop /path/to/backup/legal360/
```

---

**🎯 AI AGENT SUCCESS CRITERIA:**
- All services running and stable
- Website accessible via HTTPS
- Admin panel functional
- Database fully restored
- SSL certificate valid
- Performance within acceptable limits
- Comprehensive logs and documentation

**This guide ensures AI Agent can successfully deploy Legal360 CMS with minimal human intervention while maintaining high reliability and security standards.**