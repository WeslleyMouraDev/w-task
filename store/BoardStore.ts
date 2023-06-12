import { databases, storage } from "@/appwrite";
import { getTasksGroupedByColumn } from "@/lib/getTasksGroupedByColumn";
import { data } from "autoprefixer";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTaskInDB: (task: Task, columnId: TypedColumn) => void;

  searchString: string;
  setSearchString: (searchString: string) => void;

  deleteTask: (taskIndex: number, taskId: Task, id: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  searchString: "",
  setSearchString: (searchString) => set({ searchString }),

  getBoard: async () => {
    const board = await getTasksGroupedByColumn();
    set({ board });
  },

  setBoardState: (board) => set({ board }),

  deleteTask: async (taskIndex: number, task: Task, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);

    // Deleta taskId da newColumns
    newColumns.get(id)?.tasks.splice(taskIndex, 1);

    set({ board: { columns: newColumns } })

    if (task.image) {
      await storage.deleteFile(task.image.bucketId, task.image.fileId);
    }

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TASKS_COLLECTION_ID!,
      task.$id
    )
  },

  updateTaskInDB: async (task, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TASKS_COLLECTION_ID!,
      task.$id,
      {
        title: task.title,
        status: columnId,
      }
    );
  },
}));
