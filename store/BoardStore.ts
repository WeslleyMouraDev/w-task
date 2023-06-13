import { ID, databases, storage } from '@/appwrite';
import { getTasksGroupedByColumn } from '@/lib/getTasksGroupedByColumn';
import uploadImage from '@/lib/uploadImage';
import { NewspaperIcon } from '@heroicons/react/24/solid';
import { data } from 'autoprefixer';
import { Type } from 'typescript';
import { create } from 'zustand';

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTaskInDB: (task: Task, columnId: TypedColumn) => void;
  newTaskInput: string;
  newTaskType: TypedColumn;
  image: File | null;

  searchString: string;
  setSearchString: (searchString: string) => void;
  setNewTaskInput: (input: string) => void;
  setNewTaskType: (columnId: TypedColumn) => void;
  setImage: (image: File | null) => void;

  addTask: (task: string, columnId: TypedColumn, image?: File | null) => void;
  deleteTask: (taskIndex: number, taskId: Task, id: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  searchString: '',
  newTaskInput: '',
  newTaskType: 'task',
  image: null,

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

    set({ board: { columns: newColumns } });

    if (task.image) {
      await storage.deleteFile(task.image.bucketId, task.image.fileId);
    }

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TASKS_COLLECTION_ID!,
      task.$id
    );
  },

  setNewTaskInput: (input: string) => set({ newTaskInput: input }),
  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),
  setImage: (image: File | null) => set({ image }),

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

  addTask: async (task: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;

    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TASKS_COLLECTION_ID!,
      ID.unique(),
      {
        title: task,
        status: columnId,
        // Inlui a imagem caso isso exista
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    set({ newTaskInput: '' });

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTask: Task = {
        $id,
        $createdAt: new Date().toISOString(),
        title: task,
        status: columnId,
        // Inclui a imagem caso exista
        ...(file && { image: file }),
      };

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          tasks: [newTask],
        });
      } else {
        newColumns.get(columnId)?.tasks.push(newTask);
      }

      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },
}));
