export function getUsd(eth: string, ethUsdPrice: string): string {
  return (+eth * +ethUsdPrice).toFixed(2);
}