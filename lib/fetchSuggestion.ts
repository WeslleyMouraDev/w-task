import formatTasksForAi from "./formatTasksForAi";

const fetchSuggestion = async (board: Board) => {
  const tasks = formatTasksForAi(board);
    console.log('FORMATED TASKS to send >> ', tasks);
    
  const res = await fetch("/api/generateSummary/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tasks }),
  });

  const GPTdata = await res.json();
  const { content } = GPTdata;

  return content;
};

export default fetchSuggestion;
