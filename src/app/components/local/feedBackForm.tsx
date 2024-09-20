"use client";
import { useState } from "react";
import {
  Star,
  MessageCircle,
  UserCircle2,
  Send,
  HeadsetIcon,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { ICall } from "@/models/call";

import action_updateCallDetails from "@/actions/updateCallDetails";
interface IResult extends ICall {}

export default function FeedbackForm({
  _id,
  userQuery,
  agentAnswer,
}: Partial<IResult>) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      `${_id}`,
      "Submitted rating:",
      rating,
      "and feedback:",
      feedback
    );
    const res = await action_updateCallDetails(`${_id}` as string, {
      userFeedback: feedback,
      userRating: rating,
      emailConfirmed: true,
    });
    if (res) {
      alert("Thanks for the feedback");
      location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Mic className="h-8 w-8 text-primary" aria-hidden="true" />
            P:101 CXP Feedback
          </h1>
          <p className="text-gray-600 text-sm">
            Your opinion helps us improve our service
          </p>
        </header>

        <div className="space-y-6 bg-white p-6 rounded-xl shadow-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-start gap-3"
          >
            <UserCircle2 className="h-12 w-12 text-primary " />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Your Query
              </h3>
              <p className="text-gray-600 mt-1 text-sm">{userQuery}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-start gap-3"
          >
            <HeadsetIcon className="h-12 w-20 text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Agent response
              </h3>
              <p className="text-gray-600 mt-1 text-sm space-y-1">
                {agentAnswer}
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-md space-y-4"
        >
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Rate your experience
            </h3>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.div
                  key={star}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Star
                    className={`w-8 h-8 cursor-pointer transition-all duration-150 ${
                      star <= (hoveredStar || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Additional Feedback
            </h3>
            <Textarea
              placeholder="Please share any additional thoughts about your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px] resize-none border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg shadow-md text-sm flex items-center justify-center"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Feedback
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
