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
  const Factory = await ethers.getContractFactory('ApeSwapV3Factory')
  const factory = await Factory.deploy()
  console.log('Factory deployed at: ', factory.address)
  console.log('npx hardhat verify --network', hre.network.name, factory.address)

  const poolHash = await ethers.getContractFactory('poolHash')
  const hash = await poolHash.deploy()
  console.log('hash check deployed at: ', hash.address)
  const h = await hash.INIT_CODE_PAIR_HASH()
  console.log('The pool hash is', h)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
