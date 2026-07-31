import React from 'react'
import HomeVehicle from '../../Components/HomeVehicle/HomeVehicle'
import HomeMostVechicle from '../../Components/HomeMostVechicle/HomeMostVechicle'
import HeroBestCarRentalSystem from '../../Components/HeroBestCarRentalSystem/HeroBestCarRentalSystem'
import HomeBrowseByType from '../../Components/HomeBrowseByType/HomeBrowseByType'
import HomeCalculate from '../../Components/HomeCalculate/HomeCalculate'
import HomeFeatureList from '../../Components/HomeFeatureList/HomeFeatureList'
import HomeTrusted from '../../Components/HomeTrusted/HomeTrusted'
import HomePriceChart from '../../Components/HomePriceChart/HomePriceChart'

const Home = () => {
  return (
    <div>
      <HomeVehicle/>
      <HomeMostVechicle/>
      <HeroBestCarRentalSystem/>
      <HomeBrowseByType/>
      <HomeCalculate/>
      <HomePriceChart/>
      <HomeFeatureList/>
      <HomeTrusted/>
      
    </div>
  )
}

export default Home