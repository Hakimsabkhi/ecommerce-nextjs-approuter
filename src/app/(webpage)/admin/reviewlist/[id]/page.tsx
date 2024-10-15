"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

import { FaStar } from "react-icons/fa6";

import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import FormReply from "@/components/ReviewComp/Formreplay";
import DeletePopup from "@/components/Popup/DeletePopup";
import Reviewsbyproduct from "@/components/ReviewComp/Reviewsbyproduct";



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
const ListReview: React.FC = () => {
  const { id: productId } = useParams<{ id?: string }>();
  const [addedReviews, setAddedReviews] = useState<ReviewData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const[ids,setIds]=useState("");
  const[name,setName]=useState("");
  const [isOpen, setIsOpen]=useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpenRepaly, setIsPopupOpenRepaly] = useState(false);
  function heildId(id:string){
     setIds(id);
     setIsOpen(true);
  }
  function close(){
   
    setIsOpen(false);
 }
  const getReviews = useCallback(async () => {
    if (!productId) return;

    try {
      const response = await fetch(
        `/api/review/getAllReviewByProduct?id=${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          next: { revalidate: 0 },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setAddedReviews(data);
    } catch (err: any) {
      setError(`[Reviews_GET] ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [productId]);
  const handleDeleteClick = (id:string,name:string) => {
    setIds(id);
    setName(name);
    setIsPopupOpen(true);
  };

  const handleClosePopupRepaly = () => {
    setIsPopupOpenRepaly(false);
  };
  const handleDeleteClickRepaly = (id:string,name:string) => {
    setIds(id);
    setName(name);
    setIsPopupOpenRepaly(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };
  const handleDeleteReply = async (id: string) => {
    try {
      const formData = new FormData();
     
      formData.append("reply", "");
      const response = await fetch(`/api/review/updateReviwerById/${id}`, { // Adjust the endpoint as needed
        method: "PUT",
          body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Error deleting review reply");
      }
      setIsPopupOpenRepaly(false);
      getReviews(); // Call your function to refresh the review list
  
    } catch (error) {
      console.error("Error deleting review reply:", error);
    }
  };
  

const handleDeleteConfirm = async (id: string) => {
    try {
      const response = await fetch(`/api/review/deleteReviwerById/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }
      toast.success("Review deleted successfully!");
      handleClosePopup();
      setIsPopupOpen
      getReviews();
    } catch (err: any) {
      setError(`[Reviews_DELETE] ${err.message}`);
    }
  };

  useEffect(() => {
    getReviews();
  }, [getReviews]);

  if (loading) {
    return (
      /* loading start */
      <LoadingSpinner />
      /*  loading end  */
    );
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="py-2  relative">
      <div className="w-[93%] px-4 md:px-8 lg-6 mx-auto">
        <h2 className="font-manrope font-bold text-4xl text-black text-center mb-11 uppercase">
          ReViews
        </h2>

       <Reviewsbyproduct addedReviews={addedReviews} heildId={heildId } handleDeleteClick={handleDeleteClick }
        handleDeleteClickRepaly={handleDeleteClickRepaly}/>
        
        {isOpen && <FormReply id={ids}  close={close}   getReviews={getReviews}/>} 
        {isPopupOpenRepaly && (
                    <DeletePopup
                      handleClosePopup={handleClosePopupRepaly}
                      Delete={handleDeleteReply}
                      id={ids}
                      name={name}
                    />
                  )}
                  {isPopupOpen && (
                    <DeletePopup
                      handleClosePopup={handleClosePopup}
                      Delete={handleDeleteConfirm}
                      id={ids}
                      name={name}
                    />
                  )}
      </div>
    </div>
  );
};

export default ListReview;
function getReviews() {
  throw new Error("Function not implemented.");
}
