"use client";

import { useState } from "react";
import { Button, Icon } from "../DemoComponents";

type FeedbackFormProps = {
  onSubmit?: (feedback: Feedback) => void;
  onClose?: () => void;
};

type Feedback = {
  rating: number;
  category: string;
  comment: string;
  email?: string;
  allowContact: boolean;
};

export default function FeedbackForm({
  onSubmit,
  onClose,
}: FeedbackFormProps) {
  const [feedback, setFeedback] = useState<Feedback>({
    rating: 0,
    category: "",
    comment: "",
    email: "",
    allowContact: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "checkbox") {
      setFeedback({
        ...feedback,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFeedback({
        ...feedback,
        [name]: value,
      });
    }
  };

  const handleRatingChange = (rating: number) => {
    setFeedback({
      ...feedback,
      rating,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.rating || !feedback.category || !feedback.comment) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (onSubmit) {
      onSubmit(feedback);
    }
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after submission
    setFeedback({
      rating: 0,
      category: "",
      comment: "",
      email: "",
      allowContact: false,
    });
  };

  return (
    <div className="bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden transition-all animate-fade-in">
      <div className="px-5 py-3 border-b border-[var(--app-card-border)] flex justify-between items-center">
        <h3 className="text-lg font-medium text-[var(--app-foreground)]">
          {isSubmitted ? "Thank You!" : "Share Your Feedback"}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
          >
            ×
          </button>
        )}
      </div>
      
      <div className="p-5">
        {isSubmitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="text-[var(--app-accent)] text-5xl mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h4 className="text-xl font-medium text-[var(--app-foreground)]">
              Feedback Submitted
            </h4>
            <p className="text-[var(--app-foreground-muted)]">
              Thank you for your valuable feedback! We'll use it to improve your experience.
            </p>
            {onClose && (
              <div className="mt-6">
                <Button variant="primary" onClick={onClose}>
                  Close
                </Button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-[var(--app-foreground)] mb-2"
              >
                How would you rate your experience? <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingChange(rating)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      feedback.rating >= rating
                        ? "bg-[var(--app-accent)] text-white"
                        : "bg-[var(--app-background)] text-[var(--app-foreground-muted)]"
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-[var(--app-foreground)] mb-1"
              >
                What are you providing feedback about? <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={feedback.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
                required
              >
                <option value="">Select a category</option>
                <option value="ui">User Interface</option>
                <option value="features">Features</option>
                <option value="performance">Performance</option>
                <option value="ai">AI Assistant</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-[var(--app-foreground)] mb-1"
              >
                Your Feedback <span className="text-red-500">*</span>
              </label>
              <textarea
                id="comment"
                name="comment"
                value={feedback.comment}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
                placeholder="Please share your thoughts..."
                required
              />
            </div>
            
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--app-foreground)] mb-1"
              >
                Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={feedback.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
                placeholder="your@email.com"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowContact"
                name="allowContact"
                checked={feedback.allowContact}
                onChange={handleInputChange}
                className="h-4 w-4 text-[var(--app-accent)] border-[var(--app-card-border)] rounded focus:ring-[var(--app-accent)]"
              />
              <label
                htmlFor="allowContact"
                className="ml-2 text-sm text-[var(--app-foreground)]"
              >
                It's okay to contact me about my feedback
              </label>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              {onClose && (
                <Button variant="ghost" type="button" onClick={onClose}>
                  Cancel
                </Button>
              )}
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting || !feedback.rating || !feedback.category || !feedback.comment}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
