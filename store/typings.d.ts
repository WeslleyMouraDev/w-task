interface Board {
  columns: Map<TypedColumn, Column>;
}

type TypedColumn = "task" | "inprogress" | "done";

interface Column {
  id: TypedColumn;
  tasks: Task[];
}

interface Todo {
  $id: string;
  $createdAt: string;
  title: string;
  status: string;
  image?: string;
}

interface Image {
  bucketId: string;
  fileId: string;
}
