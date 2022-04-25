# Stage 1: Compile and Build angular codebase
# STEP-1 BUILD
FROM node:14.19-alpine as node-builder

# Creating virtual directory inside docker image
WORKDIR /app_kpis

RUN npm cache clean --force
# Add the source code to app
COPY . . 

# Installing deps for project
RUN npm install

RUN npm cache clean --force 

# Installing angular/cli
RUN npm install -g @angular/cli@13.0.4

# Generate the build of the application
RUN ng build --aot=true  --buildOptimizer=true


# Stage 2: Serve app with nginx server
# STEP-2 RUN
# Defining nginx img 
FROM nginx:latest as web-server

# Copying compiled code from dist to nginx folder for serving
COPY --from=node-builder /app_kpis/dist/kpis-agile-client /usr/share/nginx/html

# Copying nginx config from local to image
COPY nginx.conf /etc/nginx/nginx.conf

# Exposing internal port
EXPOSE 4200:80

CMD ["nginx", "-g", "daemon off;"]
