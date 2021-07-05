import axios from "axios";

class EthGasFeeService {
  constructor() {}
  /**
   * Use the Upvest.co ethereum fees api.
   *
   * @see https://doc.upvest.co/reference#ethereum-fees
   * @returns fees object with slow, medium, fast & fastest gas fees.
   */
  async fetchGasFees() {
    let response = await axios.get("https://fees.upvest.co/estimate_eth_fees");
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.data;
  }
}

export default EthGasFeeService;
