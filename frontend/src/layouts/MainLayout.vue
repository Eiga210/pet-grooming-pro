<template>
  <v-layout>
    <!-- 側邊欄 -->
    <v-navigation-drawer v-model="drawer">
      <v-list density="compact" item-props nav>
        <v-list-item
          v-for="item in items"
          :key="item.path"
          @click="$router.push(item.path)"
        >
          <v-icon :icon="item.prependIcon" class="me-2" />
          {{ item.title }}
        </v-list-item>
      </v-list>

      <!-- 附加功能：設定、前後台切換 -->
      <template #append>
        <v-divider class="my-2" />
        <v-list-item
          class="ma-2"
          link
          nav
          prepend-icon="mdi-cog-outline"
          title="Settings"
        />
        <v-list-item
          class="ma-2"
          link
          nav
          prepend-icon="mdi-sync"
          title="切換前台 / 後台"
          @click="toggleMode"
        />
      </template>
    </v-navigation-drawer>

    <!-- 上方 app bar -->
    <v-app-bar border="b" class="ps-4" flat>
      <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" @click="drawer = !drawer" />
      <v-app-bar-title>Application</v-app-bar-title>

      <template #append>
        <v-btn class="text-none me-2" height="48" icon slim>
          <v-avatar
            color="surface-light"
            image="https://cdn.vuetifyjs.com/images/john.png"
            size="32"
          />
          <v-menu activator="parent">
            <v-list density="compact" nav>
              <v-list-item append-icon="mdi-cog-outline" link title="Settings" />
              <v-list-item append-icon="mdi-logout" link title="Logout" />
            </v-list>
          </v-menu>
        </v-btn>
      </template>
    </v-app-bar>

    <!-- 主要內容區域 -->
    <v-main>
      <div class="pa-4">
        <router-view></router-view>
      </div>
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const drawer = ref(true)
const isBackend = ref(false) 
const router = useRouter()


const toggleMode = () => {
  isBackend.value = !isBackend.value
  if (isBackend.value) {
    router.push('/appointments') 
  } else {
    router.push('/toappointments') 
  }
}


const items = ref([

  {
    title: '預約管理',
    prependIcon: 'mdi-scissors-cutting',
    link: true,
    path: '/appointments'
  }
])
</script>
