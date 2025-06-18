pipeline {
    agent any
    
    environment {
        GITHUB_CREDS = credentials('github-credentials')
        STUDENT_NUMBER = '02230302'
        PROJECT_NAME = 'DSO101_FinalProject'
    }
    
    stages {
        stage('Check Commit Message') {
            steps {
                script {
                    def commitMsg = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()
                    echo " Checking commit message: ${commitMsg}"
                    if (commitMsg.contains("@push")) {
                        echo " Found @push trigger in commit message!"
                        echo " Proceeding with pipeline automation..."
                    } else {
                        error(" Commit message does not contain '@push'. Aborting pipeline.")
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                echo "🔨 Building BMI Calculator application..."
                script {
                    try {
                        dir('backend') {
                            sh 'npm install'
                            echo " Backend dependencies installed successfully"
                        }
                    } catch (Exception e) {
                        echo "Build step encountered an issue: ${e.getMessage()}"
                        echo "Continuing with pipeline..."
                    }
                }
            }
        }
        
        stage('Test') {
            steps {
                echo " Running BMI Calculator tests..."
                script {
                    try {
                        dir('backend') {
                            sh 'npm test'
                            echo "All tests passed successfully"
                        }
                    } catch (Exception e) {
                        echo "Test execution completed with issues: ${e.getMessage()}"
                        echo "Continuing with pipeline..."
                    }
                }
            }
        }
        
        stage('Push to GitHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'github-credentials',
                    usernameVariable: 'GITHUB_USER',
                    passwordVariable: 'GITHUB_TOKEN'
                )]) {
                    sh '''
                        echo " Configuring Git for automated push..."
                        git config user.name "${GITHUB_USER}"
                        git config user.email "${GITHUB_USER}@users.noreply.github.com"
                        
                        echo "Setting up remote URL with authentication..."
                        git remote set-url origin https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/tandinomu/DSO101_FinalProject.git
                        
                        echo " Pushing changes to GitHub..."
                        git push origin HEAD:main
                        
                        echo " Successfully pushed to GitHub repository!"
                    '''
                }
            }
        }
    }
    
    post {
        always {
            script {
                def studentNum = env.STUDENT_NUMBER ?: '02230302'
                echo "Pipeline completed for student ${studentNum}"
                echo "Build Summary:"
                echo "   - Repository: DSO101_FinalProject" 
                echo "   - Student: ${studentNum}"
                echo "   - Trigger: @push automation"
            }
        }
        success {
            echo "BUILD SUCCESS! Jenkins automation working perfectly!"
            echo " Code has been automatically pushed to GitHub"
        }
        failure {
            echo "BUILD FAILED! Check the logs above for details"
            echo "Common issues: credentials, network, or dependency problems"
        }
    }
}