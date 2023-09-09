import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Countdown from 'react-countdown'
import { ethers } from 'ethers'

// Components
import Navigation from './Navigation';
import Data from './Data';
import Loading from './Loading';

// Hero image
import Hero from './Hero';

// Preview image
import preview from '../preview.png'

// ABIs: Import your contract ABIs here
import NFT_ABI from '../abis/NFT.json'

// Config: Import your network config here
import config from '../config.json';

function App() {
  const [provider, setProvider] = useState(null)
  const [nft, setNFT] = useState(null)

  const [account, setAccount] = useState(null)

  const [revealTime, setRevealTime] = useState(0)
  const [maxSupply, setMaxSupply] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [cost, setCost] = useState(0)
  const [balance, setBalance] = useState(0)

  const [isLoading, setIsLoading] = useState(true)

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    // Initiate contract
    const nft = new ethers.Contract(config[31337].nft.address, NFT_ABI, provider)
    setNFT(nft)

    // Fetch accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)

    // Fetch countdown
    const allowMintingOn = await nft.allowMintingOn()
    setRevealTime(allowMintingOn.toString() + '000')

    // Fetch maxSupply
    setMaxSupply(await nft.maxSupply())

    // Fetch totalSupply
    setTotalSupply(await nft.totalSupply())

    // Fetch cost
    setCost(await nft.cost())

    // Fetch account balance
    setBalance(await nft.balanceOf(account))

    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading]);

  return(
    <Container>
      <Navigation account={account} />
      <Row> console.log(Hero image not showing.)
        <Hero />
      </Row>
      
      <h1 className='my-4 text-center text-white'>Explore NFTs on the<br />Kalina Marketspace</h1>
      <Row>
        <Col>
          <img src={preview} alt="Punks"/>
        </Col>
        <Col>
        <div className='my-4 text-center text-red'>
          console.log(countdown not showing);
          <Countdown date={parseInt(revealTime)} className='h2' />
        </div> 
        <Data 
          maxSupply={maxSupply}
          totalSupply={totalSupply}
          cost={cost}
          balance={balance} />
        </Col>
      </Row>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <p className='text-center'>Edit App.js to add your code here.</p>
        </>
      )}
    </Container>
  )
}

export default App;
