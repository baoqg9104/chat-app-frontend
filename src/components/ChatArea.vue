<template>
  <main
    v-if="store.selectedUser"
    class="w-[45%] min-h-screen flex flex-col h-full bg-[#202329] p-4"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between border-b border-gray-700 pb-3"
    >
      <div class="flex items-center gap-2">
        <img
          src="../assets/avatar-default.jpg"
          alt="Avatar"
          class="w-10 h-10 rounded-full object-cover"
        />
        <span class="text-white font-semibold">{{
          store.selectedUser.username
        }}</span>
      </div>
      <button class="text-gray-400 hover:text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <!-- Messages Area -->
    <div ref="messageArea" class="flex-1 overflow-y-auto py-4 space-y-4">
      <div
        v-for="msg in store.messages"
        :key="msg.id"
        :class="[
          msg.senderId === store.currentUserId
            ? 'flex justify-end'
            : 'flex items-start gap-2',
        ]"
      >
        <template v-if="msg.senderId !== store.currentUserId">
          <img
            src="../assets/avatar-default.jpg"
            alt="Avatar"
            class="w-8 h-8 rounded-full object-cover"
          />
          <div class="bg-gray-700 text-white px-4 py-2 rounded-2xl max-w-xs">
            {{ msg.content }}
          </div>
        </template>
        <template v-else>
          <div
            class="bg-blue-500 text-white px-4 py-2 rounded-2xl max-w-xs relative"
          >
            {{ msg.content }}
            <span v-if="msg.status === 'sending'" class="text-xs text-gray-300"
              >Đang gửi...</span
            >
            <span v-if="msg.status === 'error'" class="text-xs text-red-500"
              >Lỗi</span
            >
          </div>
        </template>
      </div>
    </div>

    <!-- Input Area -->
    <form @submit.prevent="sendMessage" class="mt-4 flex items-center gap-2">
      <input
        v-model="messageText"
        type="text"
        placeholder="Type a message..."
        class="flex-1 bg-gray-800 text-white rounded-2xl px-4 py-2 focus:outline-none"
      />
      <button
        type="submit"
        :disabled="isSending || !messageText.trim()"
        class="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </button>
    </form>
  </main>

  <main
    v-else
    class="w-[45%] min-h-screen flex items-center justify-center bg-[#202329]"
  >
    <div class="text-gray-500 text-lg">Select a user to start chatting!</div>
  </main>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, nextTick } from "vue";
import { useChatStore } from "../store/chatStore";
import { joinChatChannel } from "../socket";

const store = useChatStore();
const messageText = ref("");
const isSending = ref(false);
const messageArea = ref<HTMLElement | null>(null);

let channel: ReturnType<typeof joinChatChannel> | null = null;

const chatRoomId = (id1: string, id2: string) => [id1, id2].sort().join("_");

const scrollToBottom = async () => {
  await nextTick();
  if (messageArea.value) {
    messageArea.value.scrollTop = messageArea.value.scrollHeight;
  }
};

watch(
  () => store.selectedUser,
  (newUser) => {
    if (channel) channel.leave();

    if (newUser && store.currentUserId) {
      const roomId = chatRoomId(store.currentUserId, newUser.id);

      store.fetchMessages(newUser.id);

      channel = joinChatChannel(roomId, (msg) => {
        if (
          msg &&
          typeof msg.id === "string" &&
          typeof msg.content === "string" &&
          typeof msg.senderId === "string"
        ) {
          // Kiểm tra nếu tin nhắn là của mình (dựa trên tempId)
          const index = store.messages.findIndex((m) => m.id === msg.tempId);
          if (index !== -1) {
            store.messages[index] = {
              id: msg.id,
              timestamp: new Date(msg.timestamp || Date.now()),
              status: "sent",
              content: msg.content,
              senderId: msg.senderId,
              receiverId: msg.receiverId,
            };
          } else {
            store.messages.push(msg);
          }
          scrollToBottom();
        } else {
          console.error("Invalid message format:", msg);
        }
      });
    }
  },
  { immediate: true }
);

const sendMessage = async () => {
  if (
    !messageText.value.trim() ||
    !channel ||
    !store.selectedUser ||
    !store.currentUserId
  )
    return;

  isSending.value = true;
  const tempId = crypto.randomUUID();
  const newMsg = {
    content: messageText.value.trim(),
    sender_id: store.currentUserId,
    receiver_id: store.selectedUser.id,
  };

  store.messages.push({
    id: tempId,
    timestamp: new Date(),
    status: "sending",
    content: newMsg.content,
    senderId: newMsg.sender_id,
    receiverId: newMsg.receiver_id,
  });

  scrollToBottom();

  try {
    await channel.sendMessage({ ...newMsg, tempId }); // Giả định sendMessage trả về Promise
  } catch (error) {
    const msgIndex = store.messages.findIndex((m) => m.id === tempId);
    if (msgIndex !== -1) {
      store.messages[msgIndex].status = "error";
    }
  } finally {
    isSending.value = false;
    messageText.value = "";
  }
};

onUnmounted(() => {
  if (channel) channel.leave();
});
</script>
