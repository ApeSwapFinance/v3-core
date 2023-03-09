import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'
import { MockTimeApeSwapV3Pool } from '../../typechain/MockTimeApeSwapV3Pool'
import { TestERC20 } from '../../typechain/TestERC20'
import { ApeSwapV3Factory } from '../../typechain/ApeSwapV3Factory'
import { TestApeSwapV3Callee } from '../../typechain/TestApeSwapV3Callee'
import { TestApeSwapV3Router } from '../../typechain/TestApeSwapV3Router'
import { MockTimeApeSwapV3PoolDeployer } from '../../typechain/MockTimeApeSwapV3PoolDeployer'

import { Fixture } from 'ethereum-waffle'

interface FactoryFixture {
  factory: ApeSwapV3Factory
}

async function factoryFixture(): Promise<FactoryFixture> {
  const factoryFactory = await ethers.getContractFactory('ApeSwapV3Factory')
  const factory = (await factoryFactory.deploy()) as ApeSwapV3Factory
  return { factory }
}

interface TokensFixture {
  token0: TestERC20
  token1: TestERC20
  token2: TestERC20
}

async function tokensFixture(): Promise<TokensFixture> {
  const tokenFactory = await ethers.getContractFactory('TestERC20')
  const tokenA = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenB = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenC = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20

  const [token0, token1, token2] = [tokenA, tokenB, tokenC].sort((tokenA, tokenB) =>
    tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? -1 : 1
  )

  return { token0, token1, token2 }
}

type TokensAndFactoryFixture = FactoryFixture & TokensFixture

interface PoolFixture extends TokensAndFactoryFixture {
  swapTargetCallee: TestApeSwapV3Callee
  swapTargetRouter: TestApeSwapV3Router
  createPool(
    fee: number,
    tickSpacing: number,
    firstToken?: TestERC20,
    secondToken?: TestERC20
  ): Promise<MockTimeApeSwapV3Pool>
}

// Monday, October 5, 2020 9:00:00 AM GMT-05:00
export const TEST_POOL_START_TIME = 1601906400

export const poolFixture: Fixture<PoolFixture> = async function (): Promise<PoolFixture> {
  const { factory } = await factoryFixture()
  const { token0, token1, token2 } = await tokensFixture()

  const MockTimeApeSwapV3PoolDeployerFactory = await ethers.getContractFactory('MockTimeApeSwapV3PoolDeployer')
  const MockTimeApeSwapV3PoolFactory = await ethers.getContractFactory('MockTimeApeSwapV3Pool')

  const calleeContractFactory = await ethers.getContractFactory('TestApeSwapV3Callee')
  const routerContractFactory = await ethers.getContractFactory('TestApeSwapV3Router')

  const swapTargetCallee = (await calleeContractFactory.deploy()) as TestApeSwapV3Callee
  const swapTargetRouter = (await routerContractFactory.deploy()) as TestApeSwapV3Router

  return {
    token0,
    token1,
    token2,
    factory,
    swapTargetCallee,
    swapTargetRouter,
    createPool: async (fee, tickSpacing, firstToken = token0, secondToken = token1) => {
      const mockTimePoolDeployer =
        (await MockTimeApeSwapV3PoolDeployerFactory.deploy()) as MockTimeApeSwapV3PoolDeployer
      const tx = await mockTimePoolDeployer.deploy(
        factory.address,
        firstToken.address,
        secondToken.address,
        fee,
        tickSpacing
      )

      const receipt = await tx.wait()
      const poolAddress = receipt.events?.[0].args?.pool as string
      return MockTimeApeSwapV3PoolFactory.attach(poolAddress) as MockTimeApeSwapV3Pool
    },
  }
}
