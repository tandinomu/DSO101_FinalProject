**DSO101 Final Project - BMI Calculator Application**

**Project Overview**

A comprehensive BMI Calculator application with full-stack implementation, automated testing, and CI/CD pipeline integration. The project demonstrates modern software development practices including containerization, automated testing, and continuous integration.

**STAGE 1 COMPLETION: BMI Calculator & Testing**

** Successfully Implemented:**

#### **1. BMI Calculation Service**
- **Formula:** `BMI = weight(kg) / (height(m))²`
- **Categories:** Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), Obese (≥30)
- **Validation:** Input type checking, range validation, edge case handling
- **Performance:** Sub-100ms calculation for 1000+ operations

![bmi](./assets/curl.png)
![result](./assets/curlresult.png)

#### **2. Comprehensive Test Suite**
```bash
BMI Calculator Tests - Stage 1: 13/13 PASSED
BMI Calculator Service: 15/15 PASSED  
Total Core Tests: 30/30 PASSED
```

#### **3. Docker Integration**
- **Volume Configuration:** `docker_test-reports`, `docker_test-coverage`
- **Cross-platform Compatibility:** Node 16 Alpine
- **Automated Test Execution:** Docker Compose test environment

---

**Test Results Summary**

### **Local Test Execution:**
![test](./assets/tests.png)

### **Docker Test Execution:**
```bash
docker-compose -f docker-compose-simple-test.yml up --abort-on-container-exit
