<template>
  <aside class="w-[7%] bg-[#131313] pt-5 flex flex-col items-center">
    <div class="flex flex-col items-center mb-16">
        <img src="../assets/logo.png" alt="" class="w-11 mt-2"/>
    </div>

    <nav class="flex flex-col items-center space-y-6">
      <div v-for="item in navItems" :key="item.label" class="flex flex-col items-center space-y-2 relative">
        
        <div class="relative">
          <font-awesome-icon :icon="item.icon" style="color: #ffffff;" class="text-[20px]" />
          
          <span 
            v-if="item.unreadCount > 0" 
            class="absolute -top-2 -right-2 bg-red-500 text-white text-[12px] font-bold px-1.5 rounded-full">
            {{ item.unreadCount }}
          </span>
        </div>

        <span class="text-white text-sm">{{ item.label }}</span>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { faComments } from '@fortawesome/free-solid-svg-icons';

interface NavItem {
  label: string;
  icon: any;
  unreadCount: number;
}

const navItems = ref<NavItem[]>([
  { label: 'All chats', icon: faComments, unreadCount: 3 },
]);
</script>
