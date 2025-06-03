export {BaseWalletConnector} from './connectors/base'
export {ArgentXConnector} from './connectors/argentx'
export {BraavosConnector} from './connectors/braavos'

import { ArgentXConnector } from './connectors/argentx'
import { BraavosConnector } from './connectors/braavos'
import { WalletConnector } from '@/types'

export const getDefaultConnectors = (): WalletConnector[] => {
  return [
    new ArgentXConnector(),
    new BraavosConnector()
  ]
}

export const getConnectorById = (id: string): WalletConnector | undefined => {
  const connectors = getDefaultConnectors()
  return connectors.find(connector => connector.id === id)
}

export const getAvailableConnectors = (): WalletConnector[] => {
  return getDefaultConnectors().filter(connector => connector.available)
} 