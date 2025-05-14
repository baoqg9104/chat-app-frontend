import { defineStore } from "pinia";
import { ref } from "vue";
import type { User, Message } from "../types";
import api from "../services/api";

export const useChatStore = defineStore("chat", () => {
  const selectedUser = ref<User | null>(null);
  const messages = ref<Message[]>([]);

  const token = localStorage.getItem("token");

  const currentUserId = ref<string>('');
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    currentUserId.value = payload.sub;
  }

  const fetchMessages = async (userId: string) => {
    try {
      const res = await api.get(`/messages/user/${userId}`);
      messages.value = res.data.data.map((msg: any) => ({
        id: msg.id,
        senderId: msg.sender_id,
        receiverId: msg.receive_id,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        status: msg.status,
      }));
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  return {
    selectedUser,
    messages,
    currentUserId,
    fetchMessages,
  };
});
