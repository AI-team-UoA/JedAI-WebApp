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
* Automatic configuration of the algorithms' parameters. User can specify the value of the parameters or he can leave them to the system to detect which parameters produce the best results. The detection of the ideal parameters is performed by Grid Search or by Random Search.
* Detailed Results and display of the logs
* Exportation of the results.

## How to Run
In order to run JedAI-WebApp it needs Java 8, maven 3.6 and NPM 6.9.0.
Furthermore, it requires the jedai-core to have been installed as a maven dependancy. Download and Install JedAI from its [repository]([https://github.com/scify/JedAIToolkit](https://github.com/scify/JedAIToolkit)) and then create the maven dependency as following: 

	mvn install:install-file \
	   -Dfile=<path-to-jedai-core-1.3.jar> \
	   -DgroupId=gr.scify \
	   -DartifactId=jedai \
	   -Dversion=1.3 \
	   -Dpackaging=jar \
	   -DgeneratePom=true

Then start the application by executing 

	./mvnw spring-boot:run 
and visit 	localhos:8080

## Preview

<p  align="center">
<img  src="https://github.com/GiorgosMandi/JedAI-WebApp/blob/master/images/jedai.gif">
</p>