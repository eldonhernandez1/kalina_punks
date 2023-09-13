import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Countdown from 'react-countdown'
import { ethers } from 'ethers'

// Components
import Navigation from './Navigation';
import Data from './Data';
import Mint from './Mint';
import Loading from './Loading';

// Hero image
import Hero from '../hero.png'

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
    setRevealTime((allowMintingOn.toNumber() + 120) * 1000);

    console.log('Countdown not loading', revealTime)
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
      <Row>
      <img src={Hero} style={{ borderRadius: '50px' }} alt="Kalina Marketspace Hero"/>
      </Row>
      
      <h1 className='my-5 text-center text-white'>Mint NFTs on the<br />Kalina Marketspace</h1>
      <h2 className='py-2 mx-3 text-white'>Top Collection this week</h2>
      {isLoading ? (
        <Loading />
      ) : (
        <>
      <Row>
        <Col>
          {balance > 0 ? (
            <div className='text-center'>
              <img 
              src={`https://gateway.pinata.cloud/ipfs/QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/${balance.toString()}.png`} 
              alt="Open Punk"
              width="400px"
              height="400px"
              style={{ borderRadius: '30px' }} 
              />
            </div>
          ) : (
          <div className='text-center'><img src={preview} alt="Minted Punks" style={{ borderRadius: '30px' }}/></div>
          
          )}
        </Col>
        <Col>
        <div className='my-5 text-center text-white'>
          <Countdown date={parseInt(revealTime)} className='h2' /><br />
         <Data 
          maxSupply={maxSupply}
          totalSupply={totalSupply}
          cost={cost}
          balance={balance}
        />

        <Mint 
          provider={provider}
          nft={nft}
          cost={cost}
          setIsLoading={setIsLoading}
        />
         
        </div> 
        </Col>
      </Row>
      <Row>
      <Col>
      <div className='my-4 text-left text-white'>
      <h2 className='py-2 text-white'>Who we are</h2>
        <p>Digital marketspace for non-fungible tokens (NFTs) and crypto collectibles. Purchase, sell, and find unique digital goods.</p>
      </div> 
      </Col>
      <Col>
      <div className='my-4 text-left text-white'>
      <h2 className='py-2 text-white'>Create a drop</h2>
        <p>Make a drop. Make waves. Reach audiences interested in your project. You can do all of that here.</p>
      </div>             
      </Col>
      </Row>  
        </>
      )}
    </Container>
  )
}

export default App;
