/** Implementation for RPC 0.7 */
import * as RPCSPEC07 from '../../provider/types/spec.type';
import { ResourceBoundsOverheadRPC07 } from '../../provider/types/spec.type';
import { addPercent, toHex } from '../num';

export function estimateFeeToBounds(
  estimate: RPCSPEC07.FeeEstimate,
  overhead: ResourceBoundsOverheadRPC07
): RPCSPEC07.ResourceBounds {
  const maxUnits =
    estimate.data_gas_consumed !== undefined && estimate.data_gas_price !== undefined
      ? toHex(
          addPercent(
            BigInt(estimate.overall_fee) / BigInt(estimate.gas_price ?? '0'),
            overhead.l1_gas.max_amount
          )
        )
      : toHex(addPercent(BigInt(estimate.gas_consumed ?? '0'), overhead.l1_gas.max_amount));
  const maxUnitPrice = toHex(addPercent(BigInt(estimate.gas_price ?? '0'), overhead.l1_gas.max_price_per_unit));

  return {
    l2_gas: { max_amount: '0x0', max_price_per_unit: '0x0' },
    l1_gas: { max_amount: maxUnits, max_price_per_unit: maxUnitPrice },
  };
}
