<template>
  <div class="w-[23%] bg-[#202329] pt-7 px-6 flex flex-col min-h-screen">
    <!-- Search Bar -->
    <div class="mb-4">
      <div class="flex items-center bg-[#2a2d32] rounded-lg px-3 py-3">
        <font-awesome-icon
          icon="magnifying-glass"
          class="mr-3 text-[18px] text-[#d5d5d5]"
        />
        <input
          type="text"
          placeholder="Search..."
          v-model="searchQuery"
          class="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
        />
      </div>
    </div>

    <!-- User Message List -->
    <div class="flex-1 overflow-y-auto space-y-1">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="flex items-center p-2 rounded-lg hover:bg-[#32363d] cursor-pointer transition"
        :class="{ 'bg-[#32363d]': isSelected(user) }"
        @click="selectUser(user)"
      >
        <div class="relative">
          <img
            src="../assets/avatar-default.jpg"
            alt="User Avatar"
            class="w-12 h-12 rounded-full"
          />
          <!-- Unread Badge -->
          <span
            v-if="1 > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-[10px] text-white rounded-full px-1.5"
          >
            {{ 1 }}
          </span>
        </div>

        <div class="ml-3 flex-1">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-medium text-white">{{ user.username }}</h3>
            <span class="text-[10px] text-gray-400">{{ "10:00" }}</span>
          </div>
          <p class="text-xs text-gray-400 truncate">{{ "last message" }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import api from "../services/api";
import { useChatStore } from "../store/chatStore";
import type { User } from '../types';

const users = ref<User[]>([]);
const searchQuery = ref("");
const store = useChatStore()

const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    users.value = response.data.data;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchUsers();
});

const filteredUsers = computed(() => {
  return users.value.filter(user =>
    user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const selectUser = (user: User) => {
  store.selectedUser = user;
};

const isSelected = (user: User) => {
  return store.selectedUser?.id === user.id;
};

</script>
