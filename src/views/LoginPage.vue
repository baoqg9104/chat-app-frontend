<template>
  <div class="flex items-center justify-center min-h-screen bg-[#131313] px-4">
    <div class="bg-[#202329] p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold text-white mb-6 text-center">
        Login to Chat
      </h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm text-gray-300 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-300 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition cursor-pointer"
        >
          Login
        </button>
      </form>

      <p class="text-gray-400 text-sm mt-4 text-center">
        Don't have an account?
        <router-link to="/register" class="text-blue-400 hover:underline"
          >Register</router-link
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { toast } from "vue3-toastify";

const email = ref("");
const password = ref("");
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await api.post("/users/authenticate", {
      email: email.value,
      password: password.value,
    });
    const token = response.data.token;
    localStorage.setItem("token", token);
    // toast.success("Login successful!");
    router.push("/");
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      toast.error("Invalid email or password.");
    } else {
      toast.error("An error occurred. Please try again later.");
    }
  }
};
</script>
