FROM openjdk:8-jdk-alpine
VOLUME /tmp
ARG JAR_FILE
ARG RUN_FILE
COPY ${JAR_FILE} app.jar
COPY testConfigurations testConfigurations
COPY ${RUN_FILE} /usr/local/bin/dockerrun.sh  
RUN chmod +x /usr/local/bin/dockerrun.sh 
CMD /usr/local/bin/dockerrun.sh; java $JAVA_OPTIONS -jar /app.jar
