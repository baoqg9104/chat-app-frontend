<template>
  <div class="flex text-white">
    <Sidebar />
    <UserList />
    <ChatArea />
    <ChatDetails />
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
import UserList from "../components/UserList.vue";
import ChatArea from "../components/ChatArea.vue";
import ChatDetails from "../components/ChatDetails.vue";
</script>
