import React, {useEffect, useState} from 'react'
import { dummyBookingData } from '../assets/assets'
import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import calculateMIN from '../lib/calculateMin'
import { dateformat } from '../lib/dateformat'
import { useAppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY
   const {
      axios,
      user,
      getToken,
      image_base_url,
    } = useAppContext();

  const [bookings, setbookings] = useState([])
  const [loading, setLoading] = useState(true)
  const getMyBookings = async ()=>{
  /*   setbookings(dummyBookingData)
    setLoading(false) */
    try {
      const {data} = await axios.get('/api/user/bookings',{
        headers: { Authorization: `Bearer ${await getToken()}` },
      })
      if(data.success){
        setbookings(data.bookings);
        
      }
    } catch (error) {
      console.log(error);
      
    }
    setLoading(false);
  }
  useEffect(() => {
    if(user){
      getMyBookings()
    }
    
  }, [user])
  
  return !loading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCircle top='100px' left='100px'/>
      <div>
        <BlurCircle bottom='100px' left='600px'/>
      </div>
      <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>
      {
        bookings.map((item,index)=>(
          <div key={index} className='flex flex-col md:flex-row justify-between
          bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl'>
            <div className='flex flex-col md:flex-row'>
              <img src={image_base_url + item.show.movie.poster_path} className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded' alt="poster" />
              <div className='flex flex-col p-4'>
                  <p className='text-lg font-semibold'>{item.show.movie.title}</p>
                  <p className='text-sm text-gray-400'>{calculateMIN(item.show.movie.runtime)}</p>
                  <p className='text-sm text-gray-400 mt-auto'>{dateformat(item.show.showDateTime)}</p>

              </div>
            </div>
            <div className='flex flex-col md:items-end md:text-right justify-between p-4'>
              <div className='flex items-center gap-4'>
                <p className='text-2xl font-semibold mb-3'>
                  {currency}{item.amount}
                </p>
                {!item.isPaid && <Link to={item.paymentLink} className='bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer'>Pay Now</Link>}
              </div>
              <div className='text-sm'>
                <p><span className='text-gray-400'>Total Tickets:</span>{item.bookedSeats.length}</p>
                <p><span className='text-gray-400'>Total Tickets:</span>{item.bookedSeats.join(', ')}</p>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  ) : (
    <Loading/>
  )
}

export default MyBookings
