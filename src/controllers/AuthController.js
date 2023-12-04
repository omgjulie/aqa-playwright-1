import BaseController from "./BaseController.js";

export default class AuthController extends BaseController {
  #SIGN_IN_PATH = "/auth/signin";
  constructor(options) {
    super(options);
  }

  async signIn({ email, password, remember = false }) {
    return this._client.post(this.#SIGN_IN_PATH, {
      email,
      password,
      remember,
    });
  }
}
