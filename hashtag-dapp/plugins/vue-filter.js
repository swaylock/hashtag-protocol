import Vue from "vue";
import { ethers } from "ethers";

Vue.config.productionTip = false;

Vue.filter("toDp", function (value) {
  if (!value) return value;
  return parseFloat(value).toFixed(4);
});

Vue.filter("shortEth", function (value) {
  if (!value) return value;

  return `
  ${value.substr(0, 6)}...${value.substr(value.length - 4, value.length)}
  `;
});

Vue.filter("toEth", function (value, decimals = null) {
  if (!value) return value;
  if (decimals) {
    let ether = Number(ethers.utils.formatEther(ethers.BigNumber.from(value)));
    return ether.toFixed(decimals);
  }
  return ethers.utils.formatEther(ethers.BigNumber.from(value));
});
