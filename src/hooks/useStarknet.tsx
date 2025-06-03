import React, {
    ReactNode
} from 'react'

interface StarknetProviderProps {
  children: ReactNode
}

export const StarknetProvider: React.FC<StarknetProviderProps> = ({
  children
}) => {
  return <div>{children}</div>
}

export const useStarknet = () => {
  return {
    isConnected: false,
    account: null,
    connect: async () => {},
    disconnect: async () => {}
  }
} 