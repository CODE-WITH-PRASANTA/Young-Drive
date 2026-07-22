import React from 'react'
import HomeVehicle from '../../Components/HomeVehicle/HomeVehicle'
import HomeMostVechicle from '../../Components/HomeMostVechicle/HomeMostVechicle'
import HeroBestCarRentalSystem from '../../Components/HeroBestCarRentalSystem/HeroBestCarRentalSystem'
import HomeBrowseByType from '../../Components/HomeBrowseByType/HomeBrowseByType'
import HomeCalculate from '../../Components/HomeCalculate/HomeCalculate'

const Home = () => {
  return (
    <div>
      <HomeVehicle/>
      <HomeMostVechicle/>
      <HeroBestCarRentalSystem/>
      <HomeBrowseByType/>
      <HomeCalculate/>
    </div>
  )
}

export default Home