import React, { createContext, useContext, useState, useEffect } from 'react'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import axios from 'axios'

import { useConfig } from './useConfig'
import { NETWORKS } from '../enums'
import { sdkConfig } from '../utils/load'
import { cryptoCompare } from '../utils/api'

type EthFiatRates = {
  [key: string]: number
}
type InfuraOptions = {
  web3: Web3
  contract: Contract
}
export interface IEthereumContext {
  infuraW3instance?: Web3
  infuraContract?: any
  setFiatRates: (fiatRates: EthFiatRates) => void
  fiatRates: EthFiatRates
}

export const EthereumContext = createContext<IEthereumContext>({
  setFiatRates: (fiatRates: EthFiatRates) => {},
  fiatRates: {},
})

export const EthereumProvider = ({ children, sdkPrivateKey }) => {
  const { config } = useConfig()
  const [infuraOptions] = useState<InfuraOptions>(() => {
    const getInfuraUrl = (): string | undefined => {
      if (config.networkType === 'mainnet') {
        return NETWORKS.MAINNET.find(blockchainInfo => blockchainInfo.BLOCKCHAIN === config.blockchain)?.INFURA_URL
      } else {
        return NETWORKS.TESTNET.find(blockchainInfo => blockchainInfo.BLOCKCHAIN === config.blockchain)?.INFURA_URL
      }
    }

    const infuraUrl = getInfuraUrl()
    if (config.apiProvider === true && infuraUrl !== undefined) {
      const infuraWeb3 = new Web3(new Web3.providers.HttpProvider(infuraUrl))

      const infuraGoBlockchainContract = new infuraWeb3.eth.Contract(
        sdkConfig.contractData?.abi,
        sdkConfig.contractData?.contractAddress,
      );
      return {
        web3: infuraWeb3,
        contract: infuraGoBlockchainContract
      }
    } else {
      return {} as InfuraOptions
    }
  })
  const [fiatRates, setFiatRates] = useState<EthFiatRates>({} as EthFiatRates)

  useEffect(() => {
    const getFiatRates = async () => {
      let symbol: string
      if (config.networkType === 'mainnet') {
        symbol = NETWORKS.MAINNET.find(blockchainInfo => blockchainInfo.BLOCKCHAIN === config.blockchain)?.SYMBOL as string
      } else {
        symbol = NETWORKS.TESTNET.find(blockchainInfo => blockchainInfo.BLOCKCHAIN === config.blockchain)?.SYMBOL as string
      }
      
      const { data } = await cryptoCompare(symbol, config.currency);
      setFiatRates(data)
    }
    getFiatRates()
      .catch(error => console.log(error))
  }, [])

  return (
    <EthereumContext.Provider value={{
      infuraW3instance: config.apiProvider === true ? infuraOptions.web3 : undefined,
      infuraContract: config.apiProvider === true ? infuraOptions.contract : undefined,
      setFiatRates,
      fiatRates
    }}>
      {children}
    </EthereumContext.Provider>
  )
}

export const useEthereum = () => {
  const context = useContext(EthereumContext)
  if (context === undefined) {
    throw new Error('useEthereum must be used within a EthereumProvider')
  }
  return context
}
