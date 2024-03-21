# Step 1: Use the base Ubuntu image
FROM ubuntu:18.04
# Step 2: Switch to the root user temporarily
USER root
# Step 3: Copy the application code into the container
COPY . /opt/commons
# Step 4: Create a new user named 'dk1' with a shell
RUN useradd -ms /bin/sh dk1
# Step 5: Set the working directory to /opt/commons and change ownership
WORKDIR /opt/commons
RUN chown -R dk1:dk1 .
# Step 6: Change permissions for specific directories
RUN chmod a+rx /opt/commons /opt/commons/DevOps /opt/commons/jmeter
# Step 7: Define some build arguments
ARG JMETER_VERSION="5.3"
ARG CMDRUNNER_JAR_VERSION="2.2"
ARG JMETER_PLUGINS_MANAGER_VERSION="1.7"
# Step 8: Set environment variables
ENV JMETER_HOME /opt/apache-jmeter-${JMETER_VERSION}
ENV JMETER_LIB_FOLDER ${JMETER_HOME}/lib/
ENV JMETER_PLUGINS_FOLDER ${JMETER_LIB_FOLDER}ext/
# Step 9: Install necessary packages
WORKDIR ${JMETER_HOME}
RUN apt-get -y update && apt-get install -y wget gnupg curl unzip git openjdk-8-jre-headless
# Step 10: Download and install Command Runner
WORKDIR ${JMETER_LIB_FOLDER}
RUN wget https://repo1.maven.org/maven2/kg/apc/cmdrunner/${CMDRUNNER_JAR_VERSION}/cmdrunner-${CMDRUNNER_JAR_VERSION}.jar
# Step 11: Download and install JMeter Plugins Manager
WORKDIR ${JMETER_PLUGINS_FOLDER}
RUN wget https://repo1.maven.org/maven2/kg/apc/jmeter-plugins-manager/${JMETER_PLUGINS_MANAGER_VERSION}/jmeter-plugins-manager-${JMETER_PLUGINS_MANAGER_VERSION}.jar
RUN java -cp /opt/apache-jmeter-${JMETER_VERSION}/lib/ext/jmeter-plugins-manager-1.7.jar org.jmeterplugins.repository.PluginManagerCMDInstaller
# Step 12: Set Java environment variables
ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
ENV PATH="$JAVA_HOME/bin:${PATH}"
# Step 13: Update CA certificates
RUN update-ca-certificates
# Step 14: Clean up unnecessary files and folders
WORKDIR /opt/commons
ENV FOLD1=/opt/commons/result-getoption
RUN if [ -d "$FOLD1" ]; then rm -rf $FOLD1/*; fi
ENV FOLD2=/opt/commons/result-getprice
RUN if [ -d "$FOLD2" ]; then rm -rf $FOLD2/*; fi
# Step 15: Run JMeter tests
WORKDIR ${JMETER_HOME}
RUN ../apache-jmeter-${JMETER_VERSION}/bin/jmeter -n -t /opt/commons/jmeter/getOptionsOffersScript_Original.jmx -l /opt/commons/jmeter/results.csv -e -o /opt/commons/result-getoption
RUN ../apache-jmeter-${JMETER_VERSION}/bin/jmeter -n -t /opt/commons/jmeter/getPricePlanScriptOriginal.jmx -l /opt/commons/jmeter/reports.csv -e -o /opt/commons/result-getprice
# Step 16: Clean up and remove the unnecessary Docker container
RUN rm -rf /opt/commons/result/*