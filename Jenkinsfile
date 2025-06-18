pipeline {
    agent any
    
    environment {
        GITHUB_CREDS = credentials('github-credentials')
        STUDENT_NUMBER = '02230302'
    }
    
    stages {
        stage('Check Commit Message') {
            steps {
                script {
                    def commitMsg = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()
                    echo " Commit message: ${commitMsg}"
                    if (commitMsg.contains("@push")) {
                        echo "Found @push trigger!"
                    } else {
                        error(" No @push found. Aborting.")
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                echo "Building application..."
                dir('backend') {
                    sh 'npm install'
                }
            }
        }
        
        stage('Test') {
            steps {
                echo "Running tests..."
                dir('backend') {
                    sh 'npm test'
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
                        echo " Pushing to GitHub..."
                        git config user.name "${GITHUB_USER}"
                        git config user.email "${GITHUB_USER}@users.noreply.github.com"
                        git remote set-url origin https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/tandinomu/DSO101_FinalProject.git
                        git push origin HEAD:main
                        echo "Push complete!"
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo "Pipeline for student ${STUDENT_NUMBER} complete"
        }
    }
}
