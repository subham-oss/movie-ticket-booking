
import Booking from "../models/booking.js"
import Show from "../models/show.js"
import User from "../models/user.js"

export const isAdmin = async(req,res)=>{
    res.json({
        success:true,
        isAdmin:true
    })

}

export const getDashboardData = async(req,res)=>{
    try {
        const bookings = await Booking.find({ispaid: true})
        const activeShows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie');

        const totalUser = await User.countDocuments()

        const getDashboardData = {
            totalBooking: bookings.length,
            totalRevenue: bookings.reduce((acc,booking)=> acc + booking.amount,0),
            activeShows,
            totalUser
        }
        res.json({
            success:true,
            getDashboardData
        })
    } catch (error) {
        console.error(error);
        res.json({
            success:false,
            message:error.message
        })
    }
}

export const getAllShows = async(req,res)=>{
    try {
        const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({showDateTime:1})
        res.json({
            success:true,
            shows
        })
    } catch (error) {
         console.error(error);
        res.json({
            success:false,
            message:error.message
        })
    }
}

export const getAllBookings = async(req,res)=>{
    try {
        const bookings = await Booking.find({}).populate('user').populate({
            path:'show',
            populate:{
                path:'movie'
            }
        }).sort({createdAt:-1})
        res.json({
            success:true,
            bookings
        })
    } catch (error) {
         console.error(error);
        res.json({
            success:false,
            message:error.message
        })
    }
}