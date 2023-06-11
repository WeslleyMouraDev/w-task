"use client";
import { useBoardStore } from "@/store/BoardStore";
import { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";
import { start } from "repl";
import { doesNotMatch } from "assert";

function Board() {
  const [board, getBoard, setBoardState, updateTaskInDB] = useBoardStore(
    (state) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTaskInDB,
    ]
  );

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    // Verifica se o usuário soltou o card fora das colunas
    if (!destination) return;

    // Lida com arrastar as colunas
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);
      setBoardState({
        ...board,
        columns: rearrangedColumns,
      });
    }

    // Lida com arrastar os cards
    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    const startCol: Column = {
      id: startColIndex[0],
      tasks: startColIndex[1].tasks,
    };
    const finishCol: Column = {
      id: finishColIndex[0],
      tasks: finishColIndex[1].tasks,
    };

    if (!startCol || !finishCol) return;

    if (source.index === destination.index && startCol === finishCol) return;

    const newTasks = startCol.tasks;
    const [taskMoved] = newTasks.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      // Lida com arrastar e soltar na mesma coluna
      newTasks.splice(destination.index, 0, taskMoved);
      const newCol = {
        id: startCol.id,
        tasks: newTasks,
      };
      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);

      setBoardState({ ...board, columns: newColumns });
    } else {
      // Lida com arrastar e soltar em colunas diferentes
      const finishTasks = Array.from(finishCol.tasks);
      finishTasks.splice(destination.index, 0, taskMoved);
      const newCol = {
        id: startCol.id,
        tasks: newTasks,
      };

      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        tasks: finishTasks,
      });

      // Atualiza no banco de dados
      updateTaskInDB(taskMoved, finishCol.id);

      setBoardState({ ...board, columns: newColumns });
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} tasks={column.tasks} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
