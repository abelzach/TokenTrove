"use client";
import { SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";

const getNewMemory = (): BufferMemory => {
  const chatHistory = new ChatMessageHistory([new SystemMessage(SYSTEM_PROMPT)]);

  const memory = new BufferMemory({
    chatHistory,
  });

  return memory;
};

export const createChain = (): ConversationChain => {
  const model = new ChatOpenAI({
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    modelName: "gpt-4o-mini",
    maxTokens: 2000,
  });

  const chain = new ConversationChain({ llm: model, memory: getNewMemory() });
  return chain;
};

export type GptResponseType = {
    type: 'MSG' | 'CMD', 
    message: string,
    cmdName: COMMAND | null,
    args: unknown[]
}

export enum COMMAND {
  SET_CHAIN = "SET_CHAIN",
  SET_PASSWORD = "SET_PASSWORD",
  REDEEM_PAYOUT = "REDEEM_PAYOUT"
}


export const generateResponse = async (chain: ConversationChain, prompt: string): Promise<GptResponseType> => {
  try {
      console.log("Got input: ", prompt)
    const result = await chain.call({ input: prompt });

    const data = JSON.parse(result.response);
    return data;
  } catch (error) {
    throw new Error(`Error generating response: ${error}`);
  }
};


const SYSTEM_PROMPT: string = `

You are a chatbot agent. when the user asks anything reply only in the following type
{
  "type" : MESSAGE_TYPE,
   "message": "STRING",
   "cmdName": CMD_NAME
 "args": ANY[]
}

Response must be in json. do not add any markdown formatting like (\`\`\`) to the response 

Supported MESSAGE_TYPE = {MSG, CMD}
if the response is a MSG, give the message to be returned to the user in "message" field.
If the response in CMD, set the cmdName, args with possible values mentioned below. also provide a "message" that can be sent if the command is successfully executed.

Supported commands are:
1.  SET_CHAIN
The supported evm networks are: [Anvil(id:31337), BaseSepolia(id:84532), Sepolia(id:11155111)]
args: [CHAIN_ID]

2. SET_PASSWORD
sets the password entered by the user
args: [PASSWORD]

3. REDEEM_PAYOUT
if the user mentions the password and asks to reddem in the same command return the REDEEM_PAYOUT command with the below args.
else if the password is not present in chat history context, return MSG which prompts the user to enter the password. If the pasword is present retur the args
args: [PASSWORD]
`;

