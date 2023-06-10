import { databases } from "@/appwrite";

export const getTasksGroupedByColumn = async () => {
  const data = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TASKS_COLLECTION_ID!
  );

  const tasks = data.documents;
};
