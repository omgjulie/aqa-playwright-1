FROM mcr.microsoft.com/playwright:v1.39.0-jammy

ENV HTTP_CREDENTIALS_USERNAME=$HTTP_CREDENTIALS_USERNAME
ENV HTTP_CREDENTIALS_PASSWORD=$HTTP_CREDENTIALS_PASSWORD

COPY . /aqa-playwright-1
WORKDIR /aqa-playwright-1
RUN npm ci

#ENTRYPOINT ["./docker-entrypoint.sh"]

CMD ["npm", "run", "test:docker"]