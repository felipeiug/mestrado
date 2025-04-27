import { generateRandomHash, HidroCryper } from "../../core";

interface ClaritySessionResponse {
    id: string;
    session?: string;
    page?: string;
    userHint: string;
}

export const setClaritySesion = async (emailOrId?: string): Promise<ClaritySessionResponse | undefined> => {
  let userId = emailOrId;

  if (!userId) {
    const clarityId = localStorage.getItem("clarityId");
    if (clarityId) {
      userId = HidroCryper.decrypt(clarityId);

    } else {
      userId = generateRandomHash(10);
      const encriptedId = HidroCryper.encrypt(userId);
      localStorage.setItem("clarityId", encriptedId);
    }
  }
  
  const clarityData = await window.clarity("identify", userId);
  return clarityData;
};
