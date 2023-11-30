import { test } from "../../../src/fixtures/custom.fixture.js";
import { expect } from "@playwright/test";
import { PORSCHE_CAR } from "./fixtures/cars.js";
import axios from "axios";
import { config } from "../../../config/config.js";
import { USERS } from "../../../src/data/dict/users.js";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

test.describe("API via axios", () => {
  let client;

  test.beforeAll(async () => {
    const jar = new CookieJar();
    client = wrapper(
      axios.create({
        baseURL: config.apiURL,
        jar,
        validateStatus: (status) => {
          return status < 501;
        },
      }),
    );

    await client.post("/auth/signin", {
      email: USERS.YULIIA_AQA.email,
      password: USERS.YULIIA_AQA.password,
      remember: false,
    });
  });

  test("should create new car", async () => {
    const requestBody = {
      carBrandId: PORSCHE_CAR.carBrandId,
      carModelId: PORSCHE_CAR.carModelId,
      mileage: PORSCHE_CAR.mileage,
    };

    const response = await client.post("/cars", requestBody);
    const body = response.data;

    expect(
      body.data,
      "Response body should contain the data from request body",
    ).toMatchObject(requestBody);

    expect(response.status, "Response status code should be 201").toEqual(201);
  });

  test("empty body is not allowed", async () => {
    const response = await client.post("/cars", {});

    const body = await response.data;
    await expect(response.status, "Response status code should be 400").toEqual(
      400,
    );

    await expect(body.status, "Error status").toBe("error");
    await expect(body.message, "Message: Car brand id is required").toBe(
      "Car brand id is required",
    );
  });

  test("user should be logged in", async () => {
    const requestBody = {
      carBrandId: PORSCHE_CAR.carBrandId,
      carModelId: PORSCHE_CAR.carModelId,
      mileage: PORSCHE_CAR.mileage,
    };

    client = axios.create({
      baseURL: config.apiURL,
      validateStatus: (status) => {
        return status < 501;
      },
    });

    const response = await client.post("/cars", requestBody);

    const body = await response.data;

    await expect(response.status, "Response status code should be 401").toEqual(
      401,
    );

    await expect(body.status, "Error status").toBe("error");
    await expect(body.message, "Message: Not authenticated").toBe(
      "Not authenticated",
    );
  });
});
