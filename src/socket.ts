import { Socket } from "phoenix";

const socket = new Socket(import.meta.env.VITE_SOCKET_URL, {
  params: { token: localStorage.getItem("token") },
});

socket.connect();

export const joinChatChannel = (
  roomId: string,
  onMessage: (message: any) => void
) => {
  const channel = socket.channel(`chat:${roomId}`, {});

  channel
    .join()
    .receive("ok", () => console.log("Joined chat: " + roomId))
    .receive("error", (resp) => console.error("Unable to join", resp));

  channel.on("new_message", (payload) => {
    onMessage(payload);
    // console.log("New message received:", payload);
  });

  return {
    sendMessage: (message: object) => {
      channel.push("new_message", { message });
    },
    leave: () => {
      channel.leave();
    },
  };
};
