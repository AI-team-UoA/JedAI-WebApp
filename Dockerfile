FROM openjdk:8-jdk-alpine
VOLUME /tmp
ARG JAR_FILE
COPY ${JAR_FILE} app.jar
COPY data data
#ENTRYPOINT ["java",$JAVA_OPTIONS, "-jar","/app.jar"]
CMD echo $JAVA_OPTIONS
CMD java $JAVA_OPTIONS -jar /app.jar
