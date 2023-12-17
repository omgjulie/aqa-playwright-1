FROM mcr.microsoft.com/playwright:v1.39.0-jammy

COPY . /aqa-playwright-1
WORKDIR /aqa-playwright-1
RUN npm ci

#ENTRYPOINT ["./docker-entrypoint.sh"]

CMD ["npm", "run", "test:docker"]