# Use the official MySQL 5.7 image as the base image
FROM mysql:8.4.0

# Copy custom configuration file to the container (optional)
# COPY ./my-custom.cnf /etc/mysql/conf.d/
COPY tables.sql /docker-entrypoint-initdb.d

# Expose the default MySQL port
EXPOSE 3306

# Command to run the MySQL server
CMD ["mysqld"]
