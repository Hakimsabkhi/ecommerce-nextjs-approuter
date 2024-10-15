import React, { useRef } from 'react';

interface FormReplyProps {
  id: string;
  close:() => void;
  getReviews:() => void;
}

const FormReply: React.FC<FormReplyProps> = ({ id,close, getReviews}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleReplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const reply = formData.get("reply")?.toString();

    if (reply) {
      try {
        const response = await fetch(`/api/review/updateReviwerById/${id}`, {
          method: "PUT",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Error updating review reply");
        }
        close(); 
        getReviews();
        // Clear the input field
        if (inputRef.current) {
          inputRef.current.value = "";
        }
 
       // fetchReviewData();
      } catch (error) {
        console.error("Error updating review reply:", error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.currentTarget.form;
      form?.requestSubmit();
      close();

    }
  };

  return (
    <div className="bg-gray-300 p-1">
      <form onSubmit={handleReplySubmit} className="bg-gray-300 p-1">
        <input
          ref={inputRef}
          className="items-center h-10 w-full rounded px-3 text-sm"
          name="reply"
          type="text"
          placeholder="Type your reply"
          onKeyDown={handleKeyDown}
        />
      </form>
    </div>
  );
}

export default FormReply;
