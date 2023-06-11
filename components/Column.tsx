import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { Draggable, Droppable } from "react-beautiful-dnd";

type Props = {
  id: TypedColumn;
  tasks: Task[];
  index: number;
};

const idToColumnText: {
  [key in TypedColumn]: string;
} = {
  task: "A Fazer",
  inprogress: "Em Progresso",
  done: "Concluído",
};

function Column({ id, tasks, index }: Props) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Droppable droppableId={index.toString()} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`pb-2 rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver ? "bg-green-200" : "bg-white/50"
                }`}
              >
                <h2 className="flex justify-between font-bold text-xl p-2">
                  {idToColumnText[id]}
                  <span className="text-gray-500 bg-gray-200 rounded-full px-2 py-1 text-sm">
                    {tasks.length}
                  </span>
                </h2>

                <div className="space-y-2">
                    {tasks.map((task, index) =>  (
                        <Draggable
                        key={task.$id}
                        draggableId={task.$id}
                        index={index}
                        >
                            {(provided) => (
                                <TaskCard 
                                task={task}
                                index={index}
                                id={id}
                                innerRef={provided.innerRef}
                                draggableProps={provided.draggableProps}
                                dragHandleProps={provided.dragHandleProps}
                                />

                            )}

                        </Draggable>
                    ))}

                    {provided.placeholder}

                    <div className="flex items-end justify-end p-2">
                        <button className="text-green-500 hover:text-green-600">
                        <PlusCircleIcon 
                        className="h-10 w-10"
                        />
                        </button></div>

                </div>

              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default Column;
