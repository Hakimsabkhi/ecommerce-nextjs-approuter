import Image from 'next/image'
import React from 'react'
import { FaStar } from 'react-icons/fa'
interface ReviewsbyproductProps{
    addedReviews:ReviewData[];
    heildId: (id: string) => void; // Added type for id parameter
  handleDeleteClick: (id: string, text: string) => void; // Added parameters
  handleDeleteClickRepaly: (id: string, reply: string) => void; // Added parameters
}

interface ReviewData {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    rating: number;
    text: string;
    user: user;
    reply: string;
  }
  interface user {
    _id: string;
    username: string;
  }
const Reviewsbyproduct: React.FC <ReviewsbyproductProps> = ({addedReviews,heildId,handleDeleteClick,handleDeleteClickRepaly}) => {
  return (
    <div>  {addedReviews.map((review) => (
        <div key={review._id} className="p-2 flex items-center justify-evenly">
          <div className="">
            <div className="px-6  whitespace-nowrap text-sm  font-bold sm:flex gap-6 items-center">
              {" "}
              <Image
                src="https://res.cloudinary.com/dx499gc6x/image/upload/v1721829622/samples/animals/cat.jpg"
                alt="Portrait of Robert"
                className="w-10 h-10 rounded-full"
                width={300}
                height={300}
              />
              <label className="bg-gray-300 p-2 rounded-r-full rounded-bl-full">
                {" "}
                {review.text}
              </label>
            </div>
            <div className="px-6  gap-2 whitespace-nowrap text-sm  font-bold sm:flex  items-center">
              <label className="text-xs p-2 text-gray-500 leading-none">
                {review.name}
              </label>

              <div className="text-orange-400 flex items-center gap-1">
                {[...Array(review.rating)].map((_, index) => (
                  <FaStar key={index} />
                ))}
                {[...Array(5 - review.rating)].map((_, index) => (
                  <FaStar
                    key={index + review.rating}
                    className="text-gray-300"
                  />
                ))}
              </div>

              <div className=" text-xs p-2 text-gray-500 leading-none ">
                {" "}
                {new Date(review.createdAt).toLocaleDateString()}
              </div>

              <div className="flex items-center justify-center gap-2 text-white">
                
                  <button
                  onClick={()=>heildId(review._id)}
                  className="text-gray-800 hover:text-gray-600">
                    Reply
                  </button>
               
                <button
                  onClick={() => handleDeleteClick(review._id,review.text)}
                  className="text-gray-800 hover:text-gray-600   "
                >
                  Delete
                </button>
                
            
              </div>
            </div>
           
          </div>
       {review.reply &&  <div className="">
            <div className="px-6  whitespace-nowrap text-sm  font-bold sm:flex gap-6 items-center flex justify-center">
              {" "}
              <label className="bg-gray-300 p-2 rounded-l-full rounded-br-full">
                {" "}
                {review.reply}
              </label>
              <Image
                src="https://res.cloudinary.com/dx499gc6x/image/upload/v1721829622/samples/animals/cat.jpg"
                alt="Portrait of Robert"
                className="w-10 h-10 rounded-full"
                width={300}
                height={300}
              />
            </div>
            <div className="px-6  gap-2 whitespace-nowrap text-sm  font-bold sm:flex  items-center">
            <div className="flex items-center justify-center gap-2 text-white">
            <button
                  onClick={() => handleDeleteClickRepaly(review._id,review.reply)}
                  className="text-gray-800  hover:text-gray-600 w-10  "
                >
                  Delete
                </button>
                </div> 
              
            <div className=" text-xs p-2 text-gray-500 leading-none ">
          
                {" "}
                {new Date(review.updatedAt).toLocaleDateString()}
              </div>
              <label className="text-xs p-2 text-gray-500 leading-none">
                {review?.user?.username}
              </label>

              
            </div>
          </div>}
        </div>
      ))}</div>
  )
}

export default Reviewsbyproduct