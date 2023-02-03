import { ethers } from 'hardhat'
import { utils } from 'ethers'
import hre from 'hardhat'
import getNetworkConfig from '../deploy-config'

/**
 * // NOTE: This is an example of the default hardhat deployment approach.
 * This project takes deployments one step further by assigning each deployment
 * its own task in ../tasks/ organized by date.
 */
async function main() {
  const { tickMath, WNATIVE } = getNetworkConfig(hre.network.name)
  const Factory = await ethers.getContractFactory('UniswapV3Factory')
  const factory = await Factory.deploy()
  console.log('Factory deployed at: ', factory.address)
  console.log('npx hardhat verify --network', hre.network.name, factory.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
