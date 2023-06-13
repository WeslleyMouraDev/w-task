import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: "org-U6TlVTCXU6ATsDoPRJQEKrVW",
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default openai;
