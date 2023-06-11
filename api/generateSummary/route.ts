import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Tarefas no corpo da requisição POST
  const { tasks } = await request.json();
  console.log(tasks);

  // Comunicação com a OpenAI GPT
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content: `Ao responder, dê as boas-vindas ao usuário sempre como exemplo 'Sr. Wesley' e diga 'bem-vindo ao App W.Task!
        Limite a resposta a 200 caracteres`,
      },
      {
        role: "user",
        content: `Olá, forneça um resumo das tarefas a seguir. Conte quantas tarefas há em cada categoria
        como A Fazer, Em Andamento e Concluídas, informe a melhor manera de completar todas e diga ao usuário para ter um dia produtivo! Aqui estão os dados:
        ${JSON.stringify(tasks)}`,
      },
    ],
  });

  const { data } = response;

  console.log("DATA IS: ", data);
  console.log(data.choices[0].message);

  return NextResponse.json(data.choices[0].message);
}
