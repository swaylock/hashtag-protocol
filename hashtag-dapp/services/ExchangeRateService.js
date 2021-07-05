import axios from "axios";

class ExchangeRateService {
  constructor() {}
  /**
   * Use the https://coincap.io/ api.
   *
   * @see https://docs.coincap.io/#0a8102a5-c338-4661-aa99-f1c57661b5b1
   * @returns rates json object.
   */
  async fetchEthUsd() {
    let response = await axios.get("https://api.coincap.io/v2/rates/ethereum");
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.data;
  }
}

export default ExchangeRateService;
