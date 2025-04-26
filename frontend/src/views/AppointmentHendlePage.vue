<template>
  <div class="container py-5 text-center">
    <h2 class="text-success mb-4">🎉 預約成功！</h2>

    <div class="card shadow-sm p-4 mx-auto" style="max-width: 500px;">
      <h5 class="mb-3">預約編號：<span class="text-primary">{{ appointmentId }}</span></h5>

      <ul class="list-group text-start mb-3">
        <li class="list-group-item"><strong>寵物：</strong>{{ petName }}</li>
        <li class="list-group-item"><strong>日期：</strong>{{ date }}</li>
        <li class="list-group-item"><strong>時段：</strong>{{ timeslot }}</li>
        <li class="list-group-item"><strong>服務：</strong>{{ serviceName }}</li>
        <li class="list-group-item"><strong>加購項目：</strong>
          <ul>
            <li v-for="item in extraPackageNames" :key="item">🐾 {{ item }}</li>
          </ul>
        </li>
        <li class="list-group-item text-end text-success">
          <strong>總價：</strong>{{ totalPrice }} 元
        </li>
      </ul>

      <QrCodeDisplay :appointment-id="appointmentId" /> 

      <router-link to="/toappointments/queryreserve" class="btn btn-success mt-3">前往訂單區</router-link>
    </div>
  </div>
</template>

<script setup>
import { watch, ref } from 'vue'
import QrCodeDisplay from '@/components/QrCodeDisplay.vue'
import { useRoute } from 'vue-router'
const router = useRoute()

// 設置初始值
const appointmentId = ref(router.query.id || '未提供')
const petName = ref(router.query.pet || '未提供')
const date = ref(router.query.date || '')
const timeslot = ref(router.query.timeslot || '')
const serviceName = ref(router.query.service || '')
const extraPackageNames = ref(router.query.extras ? router.query.extras.split(',') : [])
const totalPrice = ref(router.query.total || 0)

// 監聽路由變化以確保查詢參數更新
watch(() => router.query, (newQuery) => {
  appointmentId.value = newQuery.id || '未提供'
  petName.value = newQuery.pet || '未提供'
  date.value = newQuery.date || ''
  timeslot.value = newQuery.timeslot || ''
  serviceName.value = newQuery.service || ''
  extraPackageNames.value = newQuery.extras ? newQuery.extras.split(',') : []
  totalPrice.value = newQuery.total || 0
})
</script>

<style scoped>
.card {
  background-color: #f8f9fa;
  border-radius: 15px;
}

.map-container iframe {
  border-radius: 10px;
}
</style>
