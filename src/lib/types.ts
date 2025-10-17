import type { Timestamp } from "firebase/firestore";

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
