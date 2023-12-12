FROM mcr.microsoft.com/playwright:v1.39.0-jammy

COPY . /aqa-playwright-1
WORKDIR /aqa-playwright-1

#Install dependencies
RUN npm ci

#Run tests by command
CMD ["npm", "test"]