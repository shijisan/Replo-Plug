"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";

export default function ContactPage() {
   const [formData, setFormData] = useState({
      senderEmail: "",
      senderSubject: "",
      senderMessage: "",
   });

   const [loading, setLoading] = useState(false);

   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({
         ...formData,
         [e.target.id]: e.target.value,
      });
   };

   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
         const response = await fetch("/api/send-email", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
         });

         const data = await response.json();
         if (!response.ok) throw new Error(data.error);

         toast.success("Email sent successfully!");
         setFormData({
            senderEmail: "",
            senderSubject: "",
            senderMessage: "",
         });
      } catch (err) {
         console.error(err);
         toast.error("Failed to send email. Please try again.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <main className="pt-[8vh] flex min-h-screen w-full justify-center items-center">
         <form className="bg-secondary p-8 rounded-lg max-w-lg w-full" onSubmit={handleSubmit}>
            <h1 className="text-3xl font-medium mb-6">Send me an Email</h1>

            <div className="space-y-4">
               <div>
                  <label htmlFor="senderEmail">Your Email</label>
                  <input
                     type="email"
                     id="senderEmail"
                     value={formData.senderEmail}
                     onChange={handleChange}
                     required
                  />
               </div>

               <div>
                  <label htmlFor="senderSubject">Email Subject</label>
                  <input
                     type="text"
                     id="senderSubject"
                     value={formData.senderSubject}
                     onChange={handleChange}
                     required
                  />
               </div>

               <div>
                  <label htmlFor="senderMessage">Your Message</label>
                  <textarea
                     id="senderMessage"
                     value={formData.senderMessage}
                     onChange={handleChange}
                     rows={4}
                     required
                  ></textarea>
               </div>

               <div>
                  <button className="btn bg-primary" type="submit" disabled={loading}>
                     {loading ? "Sending Email..." : "Send Email"}
                  </button>
               </div>
            </div>
         </form>
      </main>
   );
}