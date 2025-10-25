import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UserIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import BlurCircle from '../../components/BlurCircle';
import { dateformat } from '../../lib/dateformat';
import { useAppContext } from '../../../context/AppContext';

const Dashboard = () => {

   const {axios, getToken, user,image_base_url} = useAppContext()
  const currency = import.meta.env.VITE_CURRENCY

  const [dashboarddata , setDashboarddata] = useState({
    totalBooking: 0,
    totalRevenue: 0,
    activeShows:[],
    totalUser: 0
  })
  const [loading, setloading] = useState(true);
   const dashboardCards = [
    { title: 'Total Bookings', value: dashboarddata.totalBooking || "0", icon:
      ChartLineIcon
    },
    { title: 'Total Revenue', value: currency + dashboarddata.totalRevenue || "0", icon:
      CircleDollarSignIcon
    },
    { title: 'Active Shows', value: dashboarddata.activeShows.length || "0", icon:
      PlayCircleIcon
    },
    { title: 'Total Users', value: dashboarddata.totalUser || "0", icon:
      UserIcon
    }
   ]

   const fectchDashboardData = async () => {
     /* setDashboarddata(dummyDashboardData);
     setloading(false); */

     try {
      const {data} = await axios.get('/api/admin/dashboard', {
         headers: { Authorization: `Bearer ${await getToken()}`} 
      })
      if(data.success){
        setDashboarddata(data.dashboardData);
        setloading(false);
      }
      else{
        toast.error(data.message);
      }
     } catch (error) {
       console.error(error);
      
     }
   }

   useEffect(() => {
    if(user){
      fectchDashboardData();
    }
   }, [user])
   
  return !loading ? (
    <>
      <Title text1="Admin" text2= "Dashboard"/>
      <div className='flex flex-wrap gap-4 mt-6'>
          <BlurCircle top='-100px' left='0'/>
          <div className='flex flex-wrap gap-4 w-full'>
            {
              dashboardCards.map((card, index)=>(
                <div key={index} className='flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-50 w-full'>
                  <div>
                    <h1 className='text-xl font-medium mt-1'>{card.title}</h1>
                    <p className='text-xl font-medium mt-1'>{card.value}</p>
                  </div>
                  <card.icon className='w-6 h-6'/>
                </div>
              ))
            }
          </div>
      </div>
      <p className='mt-10 text-lg font-medium'>Active Shows</p>
      <div className='relative flex flex-wrap gap-6 mt-4 max-w-5xl'>
            <BlurCircle top='100px' left='-10%'/>
            {dashboarddata.activeShows.map((show)=>(
              <div key={show._id} className='w-55 rounded-lg overflow-hidden h-full pb-3 bg-primary/10 border border-primary/20 hover:-translate-y-1 transition duration-300'>
                <img src={image_base_url + show.movie.poster_path} alt="poster_path" className='h-60 w-full object-cover'/>
                <p>{show.movie.title}</p>
                <div className='flex items-center justify-between px-2'>
                  <p className='text-lg font-medium'>{currency} {show.showPrice}</p>
                  <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
                    <StarIcon className='w-4 h-4 text-primary fill-primary'/>
                    {show.movie.vote_average.toFixed(1)}
                  </p>
                </div>
                <p>{dateformat(show.showDateTime)}</p>
              </div>
            ))}
      </div>
    </>
  ) : <Loading/>
}

export default Dashboard
