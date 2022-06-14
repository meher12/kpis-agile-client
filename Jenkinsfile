pipeline {

    agent any
    options {
        buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '5', numToKeepStr: '5')
    }
    stages {
        stage('Start checkout Frontend') {
            steps {
                //define scm connection for polling
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], extensions: [], userRemoteConfigs: [[credentialsId: 'gitserver', url: 'https://github.com/meher12/kpis-agile-client.git']]])
            }
        }

        stage('Checkout Frontend Done') {
            steps {
              
                sh ''' 
                echo ' Checkout Frontend Done ' 
                '''
            }
        }
    }
}
