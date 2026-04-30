import axios from "../index";

// Update user plan and credits
export const updateUserPlanAndCredits = (data: {
  plan?: string;
  credits?: number;
}) => axios.patch("/api/users/plan", data);
