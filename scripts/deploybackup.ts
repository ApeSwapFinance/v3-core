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
  const TickMath = await ethers.getContractFactory('TickMath')
  let actualTickMath = await TickMath.deploy()
  if (tickMath == '' || tickMath == '0x') {
    actualTickMath = await TickMath.deploy()
  } else {
    actualTickMath = await TickMath.attach(tickMath + '')
  }
  console.log(actualTickMath.address)

  const Factory = await ethers.getContractFactory('ApeSwapV3Factory', {
    libraries: { TickMath: actualTickMath.address },
  })
  const factory = await Factory.deploy()
  console.log('Factory deployed at: ', factory.address)
}

function linkLibrary(
  bytecode: string,
  libraries: {
    [name: string]: string
  } = {}
): string {
  let linkedBytecode = bytecode
  for (const [name, address] of Object.entries(libraries)) {
    const placeholder = `__\$${utils.solidityKeccak256(['string'], [name]).slice(2, 36)}\$__`
    const formattedAddress = utils.getAddress(address).toLowerCase().replace('0x', '')
    if (linkedBytecode.indexOf(placeholder) === -1) {
      throw new Error(`Unable to find placeholder for library ${name}`)
    }
    while (linkedBytecode.indexOf(placeholder) !== -1) {
      linkedBytecode = linkedBytecode.replace(placeholder, formattedAddress)
    }
  }
  return linkedBytecode
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
