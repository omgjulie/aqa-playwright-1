import { wrapper } from "axios-cookiejar-support";
import axios from "axios";
import { CookieJar } from "tough-cookie";
import { config } from "../../config/config.js";

export default class BaseController {
  constructor({ baseUrl, cookies } = { baseUrl: config.apiURL }) {
    this._baseUrl = baseUrl;
    const jar = cookies ?? new CookieJar();
    this._client = wrapper(
      axios.create({
        baseURL: this._baseUrl,
        jar,
        validateStatus: (status) => {
          return status < 501;
        },
      }),
    );
  }
}
