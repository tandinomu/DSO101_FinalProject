**DSO101 Final Project - BMI Calculator Application**

**Project Overview**

A comprehensive BMI Calculator application with full-stack implementation, automated testing, and CI/CD pipeline integration. The project demonstrates modern software development practices including containerization, automated testing, and continuous integration.

### Tech Stack
- **Frontend:** React
- **Backend:** Node.js/Express
- **Database:** PostgreSQL
- **CI/CD:** Jenkins
- **Containerization:** Docker & Docker Compose
- **Version Control:** GitHub
- **Testing:** Jest

### BMI Calculator Implementation

### Features Added
- **Input Fields:** Height (cm), Weight (kg), Age
- **BMI Calculation:** Accurate BMI computation with category classification
- **Data Persistence:** Recent BMI records saved to PostgreSQL database
- **API Endpoints:** RESTful endpoints for BMI calculations
- **Validation:** Input validation and error handling


### API Endpoints
- `POST /api/bmi/calculate` - Calculate and store BMI
- `GET /api/bmi/calculate` - Retrieve BMI calculations
- `GET /api/health` - Health check endpoint

### Manual Testing
![API Response](./assets/curlresult.png)
![cURL API Test](./assets/curl.png)

## Stage 1: Docker Configuration

### Docker Volumes Configuration
Configured persistent storage for BMI data using Docker volumes in `docker-compose.yml`:

```yaml
volumes:
  postgres_data:
    driver: local
  
services:
  postgres:
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

### Testing with Docker Compose
Successfully implemented and ran tests using Docker Compose:

```bash
docker-compose -f docker-compose-simple-test.yml up --build --abort-on-container-exit
```

![Docker Build Success](./assets/dockerbuild.png)
![dockerbuild](./assets/tests.png)

## Stage 2: Jenkins Pipeline Setup

### Pipeline Configuration
Created Jenkins pipeline: `02230302_app_pipeline`

![pipeline](./assets/pipeline.png)
![pipelineconfiguration](./assets/pipelineconfiguration.png)

### GitHub Integration
- **Personal Access Token:** Configured with repository permissions
- **Credentials Management:** Secure storage in Jenkins credential store
- **Automated Push:** Triggered by @push in commit messages

### Jenkins Credentials Setup
![GitHub Credentials](./assets/creategithubcredentials.png)
![Credentials Management](./assets/githubcredentials.png)

#### Successful Pipeline Execution:
![Pipeline Success](./assets/buildsuccess.png)

## Testing and Validation

### Test Suite Coverage
- **BMI Calculation Logic:** Validates correct BMI computation
- **Category Classification:** Tests underweight, normal, overweight, obese categories
- **Edge Cases:** Handles boundary values and invalid inputs
- **Data Validation:** Ensures proper input sanitization
- **Performance:** Validates response times

### Test Results
![Test Results in Jenkins](./assets/testpassedinjenkins.png)
![reportfilegrnerated](./assets/%20reportfilegenerated.png)


## Stage 3: GitHub Actions Pipeline for Docker Builds

#### Steps 1:
Store Docker Hub Credentials in GitHub Secrets:

Go to your GitHub repo → Settings → Secrets and Variables → Repository secrets

![credentials](./assets/stage2.2step1.png)

#### Step 2: Created .github/workflows/docker-build.yml:

![workflow](./assets/Screenshot%202025-06-18%20at%2010.53.41 PM.png)

###  Verification
- **GitHub Actions:**  All builds successful
- **CI/CD Pipeline:** Automated deployment working

![success](./assets/successfulaction.png)

## Challenges and Solutions

### 1. npm Command Not Found Error
**Issue:** Jenkins couldn't find npm during build process
**Solution:** Added Node.js tool installation in pipeline configuration

![builderror](./assets/builderror2.png)

### 2. GitHub Push Permission Denied
**Issue:** Initial GitHub push failures due to authentication
**Solution:** 
- Created fine-grained Personal Access Token
- Configured proper repository permissions
- Updated Jenkins credentials with PAT

![githubcredentials](./assets/buildfailure1.png)
![ng](./assets/newgithubcredentials.png)

### 3. Database Connection Issues

**Problem**: Application unable to establish database connection.

**Error Log**:
```
Database connection error
AggregateError [ECONNREFUSED]:
Error: connect ECONNREFUSED ::1:5432
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Analysis**:
- Application configured to connect to `localhost:5432`
- PostgreSQL not installed on development machine
- No local database server running
- Missing environment configuration for alternative database solution

## 4. React Build Failures in GitHub Actions

**Issue Description:**
```
ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 2
```

**Environment Context:**
-  **Local Development:** Builds work perfectly in VSCode and local Docker
-  **GitHub Actions:** Consistent build failures with exit code 2
-  **CI/CD Pipeline:** Unable to complete Stage 2 requirements

**Technical Details:**
```dockerfile
# This command fails in CI but works locally:
RUN npm run build
```

![error](./assets/errror3.png)

**Attempted Solutions:**

#### Solution 1: Memory Optimization
```dockerfile
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV CI=true
ENV GENERATE_SOURCEMAP=false
```
**Result:** Partial improvement but issue persisted

#### Solution 2: Dependency Management
```dockerfile
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps
```
**Result:** Dependencies installed successfully, build still failed

#### Solution 3: Environment Variable Tuning
```dockerfile
ENV DISABLE_ESLINT_PLUGIN=true
ENV NODE_ENV=production
```
**Result:** No significant improvement

#### Solution 4: Multi-Strategy Build Approach
```dockerfile
RUN (npm run build) || \
    (npx react-scripts build) || \
    (npx webpack --mode=production) || \
    (echo "All build methods failed" && exit 1)
```
**Result:** All build strategies failed in CI environment


### 5. nginx Configuration Challenges

![nginx](./assets/error2.png)

**Issue Description:**
```
[emerg] host not found in upstream "backend" in /etc/nginx/conf.d/default.conf:12
nginx: configuration file /etc/nginx.conf test failed
```

**Root Cause:** nginx testing configuration during Docker build when backend service doesn't exist

**Solution Applied:**
- Removed `nginx -t` from Docker build stage
- Used variables in nginx config: `set $backend_upstream http://backend:3000;`
- Added graceful error handling for unavailable backend

**Result:** Successfully resolved

## Conclusion

Successfully implemented a complete DevSecOps pipeline featuring:
- BMI Calculator service integration
- Docker containerization with persistent volumes
- Jenkins CI/CD pipeline with GitHub automation
- Comprehensive testing suite
- Automated deployment triggers
- Secure credential management

The project demonstrates practical application of modern DevOps practices including infrastructure as code, automated testing, and continuous deployment strategies.







### Stage 3: Deploy to Render
 
**Goal:** Deploy my BMI Calculator to the cloud using Render

#### Step 1:  Deploy Database 

Create PostgreSQL Service
![database](./assets/renderdatabase.png)


 **STEP 3: Deploy Backend from Docker Hub**

### Created Backend Web Service

### 3.2 Configure Backend Service

**Environment Variables:** 
![ev](./assets/evforbackend.png)


### 3.3 Deploy Backend
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Check logs for any errors



## 🎨 **STEP 4: Deploy Frontend from Docker Hub**

### 4.1 Create Frontend Web Service
1. **Render Dashboard** → **"New +"** → **"Web Service"**
2. **Choose:** **"Deploy an existing image from a registry"**
3. **Image URL:** `yourdockerhub/dso101-frontend:latest`
   - Replace `yourdockerhub` with your actual Docker Hub username

### 4.2 Configure Frontend Service
**Basic Settings:**
- **Name:** `dso101-frontend`
- **Region:** Same as backend/database
- **Plan:** **Free**

**Environment Variables:**
```
REACT_APP_API_URL = https://dso101-backend.onrender.com
PORT = 10000
NODE_ENV = production
```
*Use YOUR actual backend URL from Step 3*

### 4.3 Deploy Frontend
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Check deployment logs

**✅ Checkpoint:** Frontend service shows **"Live"** status and you can access `https://dso101-frontend.onrender.com`

---

## 🧪 **STEP 5: Test Everything Works**

### 5.1 Test Individual Services
1. **Database:** Should show **"Available"** in Render dashboard
2. **Backend:** Visit `https://dso101-backend.onrender.com` - should show API response
3. **Frontend:** Visit `https://dso101-frontend.onrender.com` - should load BMI calculator

### 5.2 Test End-to-End Functionality
1. **Open your frontend URL** in browser
2. **Enter BMI data** (height, weight)
3. **Click Calculate**
4. **Verify result appears** (means frontend → backend → database → backend → frontend works)

**✅ Checkpoint:** You can calculate BMI successfully on your deployed app

---

## 📸 **STEP 6: Take Screenshots for Documentation**

### 6.1 Create Screenshots Folder
```bash
cd /Users/macbookairm4chip/Desktop/Sem4/DSO/DSO101_FinalProject
mkdir screenshots
```

### 6.2 Required Screenshots
Take screenshots of:
1. **Render Dashboard** showing all 3 services with "Live"/"Available" status
2. **Database service** configuration page
3. **Backend service** configuration and environment variables
4. **Frontend service** configuration and environment variables  
5. **Working BMI Calculator** on your deployed frontend URL
6. **GitHub Actions** showing successful deployment workflow

### 6.3 Save Screenshots
Save them as:
- `screenshots/render-dashboard.png`
- `screenshots/database-config.png`
- `screenshots/backend-config.png`
- `screenshots/frontend-config.png`
- `screenshots/working-app.png`
- `screenshots/github-actions.png`

---

## 📝 **STEP 7: Create GitHub Actions Deployment Workflow**

### 7.1 Create Workflow File
```bash
# Navigate to your project
cd /Users/macbookairm4chip/Desktop/Sem4/DSO/DSO101_FinalProject

# Create workflow directory
mkdir -p .github/workflows

# Create deploy.yml file
touch .github/workflows/deploy.yml
```

### 7.2 Add Workflow Content
Copy this into `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Render

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Generate package-lock.json files
        run: |
          cd frontend && npm install --package-lock-only --legacy-peer-deps && cd ..
          cd backend && npm install --package-lock-only && cd ..
      
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      
      - name: Build and Push Images
        run: |
          echo "🚀 Building and pushing updated images..."
          
          # Frontend
          docker build -f frontend/Dockerfile.prod -t ${{ secrets.DOCKERHUB_USERNAME }}/dso101-frontend:latest ./frontend
          docker push ${{ secrets.DOCKERHUB_USERNAME }}/dso101-frontend:latest
          
          # Backend  
          docker build -f backend/Dockerfile.prod -t ${{ secrets.DOCKERHUB_USERNAME }}/dso101-backend:latest ./backend
          docker push ${{ secrets.DOCKERHUB_USERNAME }}/dso101-backend:latest
          
          echo "✅ Images pushed to Docker Hub"
      
      - name: Deployment Instructions
        run: |
          echo "🚀 DEPLOYMENT READY"
          echo "Go to Render Dashboard and manually deploy:"
          echo "1. Backend: https://dashboard.render.com"
          echo "2. Frontend: https://dashboard.render.com"
          echo "Images updated on Docker Hub - ready for Render!"
```

---

## 📚 **STEP 8: Update README with Documentation**

### 8.1 Add Stage 3 Section to README
Add this to your `README.md`:

```markdown
## 🚀 Stage 3: Render Deployment ✅

**Status:** Successfully Completed

### 🌐 Live Application
- **Frontend:** https://dso101-frontend.onrender.com
- **Backend API:** https://dso101-backend.onrender.com  
- **Database:** PostgreSQL (Managed by Render)

### 📦 Deployed Services
- ✅ **Database:** PostgreSQL 12 (bmi_calculator)
- ✅ **Backend:** Node.js API from Docker Hub
- ✅ **Frontend:** React App from Docker Hub

### 🔧 Environment Variables Configured
- **Database:** POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
- **Backend:** DATABASE_URL, NODE_ENV, PORT
- **Frontend:** REACT_APP_API_URL, NODE_ENV, PORT

### 📸 Screenshots
- [Render Dashboard](screenshots/render-dashboard.png)
- [Database Configuration](screenshots/database-config.png)
- [Backend Configuration](screenshots/backend-config.png) 
- [Frontend Configuration](screenshots/frontend-config.png)
- [Working Application](screenshots/working-app.png)

### ✅ Verification
All services deployed successfully with end-to-end BMI calculation functionality working.
```

---

## 🎯 **STEP 9: Final Commit and Push**

```bash
# Add all files
git add .

# Commit everything
git commit -m "🚀 Complete Stage 3: Render deployment with documentation - Student 02230302"

# Push to trigger GitHub Actions
git push origin main
```

---

## 🎉 **Success Checklist**

Mark each as complete:
- [ ] ✅ Render account created and repository connected
- [ ] ✅ PostgreSQL database deployed and "Available"
- [ ] ✅ Backend service deployed and "Live" 
- [ ] ✅ Frontend service deployed and "Live"
- [ ] ✅ Environment variables configured correctly
- [ ] ✅ BMI calculator works end-to-end on deployed app
- [ ] ✅ All screenshots taken and saved
- [ ] ✅ GitHub Actions workflow created and running
- [ ] ✅ README documentation updated
- [ ] ✅ Everything committed and pushed to GitHub

---

## 🚨 **Common Issues & Quick Fixes**

### Issue 1: Backend can't connect to database
**Fix:** Check DATABASE_URL format - use the exact "Internal Database URL" from Render

### Issue 2: Frontend can't reach backend
**Fix:** Update REACT_APP_API_URL to your actual backend URL (https://dso101-backend.onrender.com)

### Issue 3: Services showing "Build failed"
**Fix:** Check build logs in Render dashboard, usually environment variable issues

### Issue 4: App loads but BMI calculation doesn't work
**Fix:** Check browser developer tools for API errors, verify CORS settings

---

## 🎯 **You're Done When:**
- Your BMI calculator works at `https://dso101-frontend.onrender.com`
- All screenshots are saved in `/screenshots` folder
- README is updated with Stage 3 documentation
- GitHub Actions shows successful deployment workflow

**Ready to deploy? Let's go! 🚀**