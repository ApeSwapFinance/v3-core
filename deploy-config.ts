function getNetworkConfig(network: any) {
  if (['bsc', 'bsc-fork'].includes(network)) {
    console.log(`Deploying with BSC MAINNET config.`)
    return {
      tickMath: '',
      WNATIVE: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    }
  } else if (['bscTestnet', 'bsc-testnet-fork'].includes(network)) {
    console.log(`Deploying with BSC testnet config.`)
    return {
      tickMath: '',
      WNATIVE: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    }
  } else if (['polygon'].includes(network)) {
    console.log(`Deploying with polygon config.`)
    return {
      tickMath: '',
      WNATIVE: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    }
  } else if (['development'].includes(network)) {
    console.log(`Deploying with development config.`)
    return {}
  } else {
    throw new Error(`No config found for network ${network}.`)
  }
}

export default getNetworkConfig
