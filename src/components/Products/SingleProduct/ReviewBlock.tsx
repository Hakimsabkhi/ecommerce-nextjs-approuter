import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { AiOutlineLike} from 'react-icons/ai';
import { IoStorefrontOutline } from 'react-icons/io5';
import { useSession } from 'next-auth/react';

interface Review {
  _id: string;
  name: string;
  email: string;
  text: string;
  reply: string;
  rating: number;
 user: {
    _id: string;
    username: string;
  };
  likes:User[]; 
  
  createdAt: string;
  updatedAt: string;
}
interface  User{
  _id:string;
  username:string;
  email:string;
}

interface Product {
  _id: string;
  name: string;
 
}

interface ReviewBlockProps {
  productId: string;
  product: Product | null;
  refresh?: boolean; 
}

const fetchReviews = async (productId: string) => {
  if (!productId) {
    throw new Error('Product ID is required');
  }

  const response = await fetch(`/api/review/getAllReviewByProduct?id=${productId}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data; // Ensure you return the fetched data
};

const ReviewBlock: React.FC<ReviewBlockProps> = ({ productId, product,refresh }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession() ;
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchReviews(productId);
        setReviews(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [productId, refresh]);
    const handleVote = async (action: 'like' | 'dislike' ,id:string) => {
      if (!session) {
        console.log("User is not logged in");
        return; // Exit the function if the user is not logged in
      } 
      try {
      const formData = new FormData();
      formData.append("action", action);
      const response = await fetch(`/api/review/vote/${id}`, {
        method: 'POST',
       
        body: formData,
      });
 
      if (!response.ok) {
        throw new Error('Failed to vote');
      }
      const updatedReviews = await fetchReviews(productId);
      setReviews(updatedReviews);

      
   
    } catch (error) {
      console.error('Failed to vote', error);
    }
  };
  
  const getlikeColor = (review:Review) => {
    return review.likes.some(user => user.email === session?.user?.email) ? 'blue' : '#9CA3AF';
  };

 
 

  const numberOfReviews = reviews.length;
  



  return (
    <div className="flex flex-col gap-4 ">
      <div className="px-4 flex items-center justify-between">
        <label htmlFor="review" className="text-lg uppercase">
          {numberOfReviews} reviews for {product?.name}
        </label>
        
      </div>
      {/* bottom */}
      <div className="grid grid-cols-1 max-md:grid-cols-1">
        {reviews.length === 0 ? (
         
           <hr className="h-px w-[200%] bg-gray-200 hidden border-0 dark:bg-gray-700"/>
        
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="w-full max-lg:w-full flex flex-col p-4 gap-2">
              <div className="flex flex-col rounded-3xl mr-4 drop-shadow-md p-4 bg-white">
                <div className="flex flex-col gap-3 ">
                <div className="flex justify-between ">
                       <div className="flex gap-4 items-center"> 
                        <p className="text-lg max-md:text-xs font-medium">{review.name}</p>
                        
                        </div>
                        <div className="flex gap-2" >
                          <div className="text-primary max-md:text-xs flex gap-1 justify-center items-center">
                            
                            <FaStar className="text-yellow-500 size-3 max-md:size-2.5"/>{review.rating} of 5
                          </div>
                        </div>
                    </div>
                        <hr></hr>
                <p className="text-[#525566]">{review.text}</p>
                
                </div>
              </div>
              <div className="flex gap-8 pl-4">
                        <p className="text-[#525566] max-md:text-xs max-md:hidden">
                          {new Date(review.createdAt).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </p> 
                            <div className="flex gap-1 items-center">
                              <button  onClick={() => handleVote('like',review._id)}>
                             
                              <AiOutlineLike  className="" size={17}  color={getlikeColor(review)} />
                              </button>
                              <p className=" text-md  max-md:text-xs text-[#525566]">{review.likes ? review.likes.length : 0}</p>
                            </div>
                    </div>

             {review.user && <div className="flex flex-col gap-3 ml-4 bg-white rounded-3xl drop-shadow-md p-4">
                <p className="text-[#525566]">
                   {review?.reply}
                  </p>
              <hr></hr>
                    <div className="flex justify-between">
                          <p className="text-lg max-md:text-xs font-medium">{review.user?.username}</p>
                          
                    </div>
                    
              </div> }
              <p className="text-[#525566] max-md:text-xs"> {new Date(review.updatedAt).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewBlock;
