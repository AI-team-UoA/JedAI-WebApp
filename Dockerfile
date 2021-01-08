FROM maven:3.5.2-jdk-8 AS MAVEN_BUILD
RUN apt-get update && apt-get install nodejs -y
COPY pom.xml /build/
COPY package.json /build/
COPY package-lock.json /build/
COPY webpack.config.js /build/
COPY src /build/src/
COPY images /build/images/
WORKDIR /build/
RUN mvn package

FROM openjdk:8-jdk-alpine
VOLUME /tmp
ARG RUN_FILE
COPY --from=MAVEN_BUILD /build/target/JedAI-WebApp-*.jar /app.jar
COPY testConfigurations testConfigurations
COPY ${RUN_FILE} /usr/local/bin/dockerrun.sh  
RUN chmod +x /usr/local/bin/dockerrun.sh 
CMD /usr/local/bin/dockerrun.sh; java $JAVA_OPTIONS -jar /app.jar
