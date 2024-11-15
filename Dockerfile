FROM node:18-alpine

# Çalışma dizinini ayarlayın
WORKDIR /app

# mina ve ui klasörlerini kopyalayın
COPY ./mina /app/mina
COPY ./ui /app/ui

WORKDIR /app/mina
RUN npm install

RUN npm run build

# ui klasörüne geçin ve bağımlılıkları yükleyin
WORKDIR /app/ui

RUN npm install


# Uygulamayı build edin
RUN npm run build

# Port 3000'i expose edin
EXPOSE 3000

# Uygulamayı başlatın
CMD ["npm" , "start"]