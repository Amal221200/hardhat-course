import { ethers, run, network } from 'hardhat'


async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory('SimpleStorage');
    console.log('Deploying Contract');
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.getDeployedCode()

    if (network.config.chainId === 31_337 || !!process.env.ETHERSCAN_API_KEY) {
        return
    }
    await simpleStorage.deploymentTransaction()?.wait(6)
    await verify(await simpleStorage.getAddress(), [])
}

async function verify(contractAddress: string, args: any) {
    console.log('Verifying contract');
    try {
        await run('verify', {
            address: contractAddress,
            constructorArguments: args
        })
    } catch (error: any) {
        if (error.message.toLowerCase().includes('already verified')) {
            console.log('Already verified');
        } else {
            console.log(error);
        }
    }
}

main()