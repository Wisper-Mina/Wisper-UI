import { decryptChatID } from "@/utils/chatIdHandler";

export async function POST(req: Request) {
  const { chat_id, myPublicKey } = await req.json();

  let res;

  try {
    const { isJoinable, senderPublicKey } = decryptChatID(chat_id, myPublicKey);
    res = {
      data: {
        senderPublicKey,
        isJoinable,
      },
      status: 200,
    };
  } catch (error) {
    res = {
      data: {
        error: error,
      },
      status: 500,
    };
  }

  return Response.json(res);
}
