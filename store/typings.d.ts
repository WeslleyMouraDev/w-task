interface Board {
  columns: Map<TypedColumn, Column>;
}

type TypedColumn = "task" | "inprogress" | "done";

interface Column {
  id: TypedColumn;
  tasks: Task[];
}

interface Task {
  $id: string;
  $createdAt: string;
  title: string;
  status: TypedColumn;
  image?: Image;
}

interface Image {
  bucketId: string;
  fileId: string;
}
