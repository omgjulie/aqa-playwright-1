import AuthController from "../controllers/AuthController.js";
import CarsController from "../controllers/CarsController.js";
import { CookieJar } from "tough-cookie";
import { config } from "../../config/config.js";

export default class APIClient {
  constructor(options) {
    this.auth = new AuthController(options);
    this.cars = new CarsController(options);
  }

  static async authenticate(userData, options = { baseUrl: config.apiURL }) {
    const jar = new CookieJar();
    const params = { ...options, cookies: jar };
    const authController = new AuthController(params);
    await authController.signIn(userData);
    return new APIClient(params);
  }
}
