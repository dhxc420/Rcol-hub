// El bundle ESM de @holdstation/worldchain-sdk importa { BigNumber } como export
// nombrado, pero bignumber.js solo expone default. Este shim re-exporta ambos.
import BigNumber from "https://cdn.jsdelivr.net/npm/bignumber.js@9.3.1/bignumber.mjs";

export default BigNumber;
export { BigNumber };
