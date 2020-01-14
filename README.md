
<p  align="center">
<img  src="https://github.com/scify/JedAIToolkit/blob/mavenizedVersion/documentation/JedAI_logo_small.png">
</p>


# Java gEneric DAta Integration (JedAI) Toolkit

JedAI constitutes an open source, high scalability toolkit that offers out-of-the-box solutions for any data integration task, e.g., Record Linkage, Entity Resolution and Link Discovery. At its core lies a set of *domain-independent*, *state-of-the-art* techniques that apply to both RDF and relational data. These techniques rely on an approximate, *schema-agnostic* functionality based on *(meta-)blocking* for high scalability.
You can read more about JedAI [here]([https://jedai.scify.org/](https://jedai.scify.org/)) and you can find the source code in this [repository]([https://github.com/scify/JedAIToolkit](https://github.com/scify/JedAIToolkit))
  

# JedAI-WebApp

JedAI-WebApp is a GUI developed with Spring (boot+ MVC) and ReactJS that facilitates the execution of JedAI. It enables the user to construct its desired workflow by sequentially selecting the algorithm(s) of each step. Furthermore, JedAI-WebApp provides the following capabilities
* Multiple data input interfaces
* Data (entities) Exclusion
* Data Exploration
* Automatic configuration of the algorithms' parameters. User can specify the values of the parameters or he can leave them to the system to detect which parameters produce the best results. The detection of the ideal parameters is performed by Grid Search or by Random Search.
* Detailed Results and display of the logs
* Exploration of the data and results.

 Furthermore, it facilitates the benchmarking of different workflows or configurations over a particular dataset through the workbench window, which summarizes the outcome of all runs and maintains details about the performance and the configuration of every step.
 
## How to Run
### Installing JedAI-Core Maven repository
In order to run JedAI-WebApp needs Java 8, maven 3.6 and NPM 6.9.0.
Furthermore, it requires the jedai-core to have been installed as a maven dependency. Download and Install JedAI from its [repository]([https://github.com/scify/JedAIToolkit](https://github.com/scify/JedAIToolkit)) and then create the maven dependency as following: 

	mvn install:install-file \
	   -Dfile=<path-to-jedai-core-1.3.jar> \
	   -DgroupId=gr.scify \
	   -DartifactId=jedai \
	   -Dversion=1.3 \
	   -Dpackaging=jar \
	   -DgeneratePom=true
### Configuring H2-Database
In the src/main/resources/applications.properties file, set the fields
  
		spring.datasource.username = <username\>
		spring.datasource.password=<password\>
These will be the credential which will use to login in  the [h2-console](http://localhost:8080/h2-console). Furthermore, by default, Spring Boot configures the application to **connect to an in-memory** store, which means  that database is volatile and data will be lost when we restart the application. In order to change this behavior, you can  use file-based storage by setting the property

		spring.datasource.url=jdbc:h2:file:<absolute_path_to_file>
### Execute
Then start JedAI-WebApp by executing  

	./mvnw spring-boot:run 
and visit 	[http://localhost:8080/](http://localhost:8080/)

## Preview
### Configuring and executing workflow

<p  align="center">
<img  src="https://github.com/GiorgosMandi/JedAI-WebApp/blob/master/images/jedai.gif">
</p>

### Workbench

<p  align="center">
<img  src="https://github.com/GiorgosMandi/JedAI-WebApp/blob/master/images/workbench.gif">
</p>