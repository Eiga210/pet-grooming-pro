<template>
<div class="container py-5">
  <h2 class="mb-4 text-success text-center">🐾 預約美容服務</h2>

  <form @submit.prevent="submitForm" class="border rounded p-4 shadow-sm bg-light-subtle">
    <!-- 選擇寵物 -->
    <div class="mb-3">
      <label class="form-label">寵物</label>
      <select v-model="form.petId" class="form-select" :disabled="pets.length === 0" required>
        <option value="" disabled>請選擇寵物</option>
        <option v-for="pet in pets" :key="pet.petId" :value="pet.petId">{{ pet.petName }}</option>
      </select>
    </div>

    <!-- 預約日期 -->
    <div class="mb-3">
      <label class="form-label" for="appointmentDate">預約日期</label>
      <input type="date" v-model="form.date" id="appointmentDate" class="form-control"
        @change="onDateChange" required />
    </div>

    <!-- 預約時段 -->
    <div class="mb-3">
      <label class="form-label" for="appointmentTimeslot">預約時段</label>
      <select v-model="form.timeslot" id="appointmentTimeslot"
        class="form-select" :disabled="!availableTimeslots.length" required>
        <option value="" disabled selected>請選擇時段</option>
        <option v-for="(timeslot, index) in availableTimeslots" :key="index"
          :value="timeslot.slot" :disabled="timeslot.disabled">
          {{ timeslot.slot }}
        </option>
      </select>
    </div>

    <!-- 選擇服務 -->
    <div class="mb-3">
      <label class="form-label">選擇服務</label>
      <select v-model="form.service" class="form-select" required>
        <option value="" disabled>請選擇服務</option>
        <option v-for="service in services" :value="service.id" :key="service.id">
          {{ service.name }} +{{ service.price }}元
        </option>
      </select>
    </div>

    <!-- 額外加購 -->
    <div class="mb-3">
      <label class="form-label">額外加購</label>
      <div v-for="pkg in extraPackages" :key="pkg.id" class="form-check">
        <input class="form-check-input" type="checkbox" :value="pkg.id"
          v-model="form.extraPackages" :id="'extra' + pkg.id">
        <label class="form-check-label" :for="'extra' + pkg.id">
          {{ pkg.name }} +{{ pkg.price }}元
        </label>
      </div>
    </div>

    <!-- 總價 -->
    <div class="mb-3">
      <strong class="text-success">總價: {{ totalPrice }} 元</strong>
    </div>

    <!-- 送出按鈕 -->
    <div class="text-end">
      <button type="submit" class="btn btn-green" >🐶 送出預約</button>
    </div>
  </form>
</div>

</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref, computed, watch,onMounted } from 'vue';
import api from "@/utils/api"

const router = useRouter(); 
const route = useRoute();   
const selectedServiceFromQuery = computed(() => route.query.service || '');
const pets = ref([])
const availableTimeslots = ref([])
const services = ref([
  { id: 1, name: '基礎洗澡', price: 1000 },
  { id: 2, name: '基礎洗護含美容修剪', price: 2000 },
  { id: 3, name: '專業洗護', price: 1900 },
  { id: 4, name: '專業洗護含美容修剪', price: 2800 }
])

const extraPackages = ref([
  { id: 1, name: '7公斤以上', price: 100 },
  { id: 2, name: '防蚤洗劑', price: 300 },
  { id: 3, name: '貓咪草本洗毛精', price: 350 },
  { id: 4, name: '狗狗草本洗毛精', price: 350 }
])

const totalPrice = computed(() => {
  let total = 0
  const selectedService = services.value.find(s => s.id === form.value.service)
  if (selectedService) total += selectedService.price
  for (const id of form.value.extraPackages) {
    const pack = extraPackages.value.find(p => p.id === id)
    if (pack) total += pack.price
  }
  return total
})

const form = ref({
  memberId: 2,
  petId: '',
  date: '',
  timeslot: '',
  service: '',
  extraPackages: []
})

// 查詢會員的寵物
const fetchPetsByMember = async () => {
  const memberId = form.value.memberId

  if (!memberId) {
    pets.value = []
    return
  }

  try {
    const res = await api.handleQueryPetById(memberId)
    pets.value = res.data
    console.log("✅ 成功載入寵物資料:", pets.value)
  } catch (err) {
    console.error("❌ 載入寵物資料失敗", err)
  }
}
watch(() => form.value.memberId, (newId) => {
  if (newId) {
    fetchPetsByMember(newId)
  } else {
    pets.value = []
  }
})

//查到預約時段
const onDateChange = async () => {
	const selectedDate = form.value.date
  if (!selectedDate) {
    alert("請選擇一個日期")
    return
  }

  try {
    const res = await api.handleQueryBookingTime(selectedDate)

    const bookedTimeslots = res.data.bookedTimeslots || []
    const allTimeslots = ["10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00"]
    
    availableTimeslots.value = allTimeslots.map(slot => ({
      slot,
      disabled: bookedTimeslots.includes(slot)
    }))
  } catch (error) {
    console.error("無法獲取預約資料: ", error)
  }
}
//送出表單
const submitForm = async () => {
  console.log('表單資料:', form.value)
 
  const appointmentData = {
	memberId: parseInt(form.value.memberId, 10),
	petId: parseInt(form.value.petId, 10),
    appointmentDate: form.value.date, 
    appointmentTimeslot: form.value.timeslot, 
    services: form.value.service,
    extraPackages: form.value.extraPackages
  }
  console.log('送出資料:', JSON.stringify(appointmentData))
  try {
    const res = await api.addAppointment(appointmentData)
    console.log("預約成功", res.data)
    const selectedPetName = pets.value.find(p => p.petId === parseInt(form.value.petId))?.petName || ''
const selectedServiceName = services.value.find(s => s.id === form.value.service)?.name || ''
const selectedExtras = extraPackages.value
  .filter(p => form.value.extraPackages.includes(p.id))
  .map(p =>  p.name)
    router.push({
      path: '/toappointments/hendlereserve',
      query: {
        id: res.data.appointmentId,
    pet: selectedPetName,
    date: form.value.date,
    timeslot: form.value.timeslot,
    service: selectedServiceName,
    extras: selectedExtras.join(','),
    total: totalPrice.value
      }
    })
  } catch (error) {
    console.error("預約失敗", error)
  }
}
onMounted(() => {
  fetchPetsByMember()
})
</script>

<style scoped>
.btn-green {
  background-color: #81c784;
  color: white;
  font-weight: bold;
  border-radius: 25px;
  padding: 0.5rem 1.5rem;
  transition: all 0.3s ease;
}

.btn-green:hover {
  background-color: #66bb6a;
}
</style>