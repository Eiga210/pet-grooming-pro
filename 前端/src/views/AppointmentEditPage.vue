<template>
    <div class="centered-form">
      <div class="form-container">
        <form @submit.prevent="submitUpdate">
          <input type="hidden" v-model="appointment.appointmentId" />
  
          <!-- 預約日期 -->
          <div class="mb-3">
            <label for="appointmentDate" class="form-label">預約日期:</label>
            <input
              type="date"
              id="appointmentDate"
              class="form-control"
              v-model="appointment.appointmentDate"
              required
            />
          </div>
  
          <!-- 預約時段 -->
          <div class="mb-3">
            <label for="appointmentTimeslot" class="form-label">預約時段:</label>
            <select
              id="appointmentTimeslot"
              class="form-select"
              v-model="appointment.appointmentTimeslot"
              required
            >
              <option value="10:00-12:00">10:00-12:00</option>
              <option value="12:00-14:00">12:00-14:00</option>
              <option value="14:00-16:00">14:00-16:00</option>
              <option value="16:00-18:00">16:00-18:00</option>
              <option value="18:00-20:00">18:00-20:00</option>
            </select>
          </div>
  
          <!-- 總價 -->
          <div class="mb-3">
            <label for="totalPrice" class="form-label">總價格:</label>
            <input
              type="number"
              class="form-control"
              id="totalPrice"
              :value="totalPrice"
              readonly
            />
          </div>
  
          <!-- 預約狀態 -->
          <div class="mb-3">
            <label class="form-label">預約狀態:</label>
            <select
              class="form-select"
              v-model="appointment.appointmentStatus"
              required
            >
              <option value="0">未完成</option>
              <option value="1">已完成</option>
              <option value="2">已取消</option>
            </select>
          </div>
  
          <!-- 付款狀態 -->
          <div class="mb-3">
            <label class="form-label">付款狀態:</label>
            <select
              class="form-select"
              v-model="appointment.paymentStatus"
              required
            >
              <option value="0">未付款</option>
              <option value="1">已付款</option>
            </select>
          </div>
  
          <!-- 選擇服務 -->
          <div class="mb-3">
            <label class="form-label">選擇服務:</label>
            <select
              class="form-select"
              v-model="selectedService"
              @change="updateTotal"
              required
            >
              <option disabled value="">請選擇服務</option>
              <option
                v-for="item in services"
                :key="item.id"
                :value="item.id"
                :data-price="item.price"
              >
                {{ item.name }} +{{ item.price }}元
              </option>
            </select>
          </div>
  
          <!-- 額外加購 -->
          <div class="mb-3">
            <label class="form-label">額外加購:</label>
            <div
              v-for="item in extraPackageOptions"
              :key="item.id"
              class="form-check"
            >
              <input
                class="form-check-input"
                type="checkbox"
                :value="item.id"
                v-model="selectedPackages"
                @change="updateTotal"
                :id="'package-' + item.id"
              />
              <label class="form-check-label" :for="'package-' + item.id">
                {{ item.name }} +{{ item.price }}元
              </label>
            </div>
          </div>
  
          <!-- 顯示總價 -->
          <div class="mb-3">
            <div id="totalPrice2">總價: {{ totalPrice }} 元</div>
          </div>
  
          <!-- 更新按鈕 -->
          <button type="submit" class="btn btn-primary">更新預約</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import api from '@/utils/api' 
  
  const route = useRoute()
  const router = useRouter()
  
  const appointment = ref({
    appointmentId: '',
    appointmentDate: '',
    appointmentTimeslot: '',
    appointmentTotal: 0,
    appointmentStatus: 0,
    paymentStatus: 0
  })
  
  const selectedService = ref('')
  const selectedPackages = ref([])
  
  const services = [
    { id: 1, name: '基礎洗澡', price: 1000 },
    { id: 2, name: '基礎洗護含美容修剪', price: 2000 },
    { id: 3, name: '專業洗護', price: 1900 },
    { id: 4, name: '專業洗護含美容修剪', price: 2800 }
  ]
  
  const extraPackageOptions = [
    { id: 1, name: '7公斤以上', price: 100 },
    { id: 2, name: '防蚤洗劑', price: 300 },
    { id: 3, name: '貓咪草本洗毛精', price: 350 },
    { id: 4, name: '狗狗草本洗毛精', price: 350 }
  ]
  
  const totalPrice = computed(() => {
    const servicePrice =
      services.find((s) => s.id === parseInt(selectedService.value))?.price || 0
    const packagePrice = selectedPackages.value.reduce((sum, id) => {
      const pkg = extraPackageOptions.find((p) => p.id === id)
      return sum + (pkg ? pkg.price : 0)
    }, 0)
    return servicePrice + packagePrice
  })
  
  function updateTotal() {
    appointment.value.appointmentTotal = totalPrice.value
  }
  
  async function fetchAppointment() {
    const id = route.params.id; 
  const res = await api.showUpdatePage(id); 
    const data = res.data
    console.log('更新資料:',data)
    appointment.value = {
      ...data,
      appointmentId: data.appointmentId,
      appointmentDate: data.appointmentDate,
      appointmentTimeslot: data.appointmentTimeslot,
      appointmentStatus: data.appointmentStatus,
      paymentStatus: data.paymentStatus,
      appointmentTotal: data.appointmentTotal
    }
    selectedService.value = data.itemId
    selectedPackages.value = data.extraPackageIds || []
  }
  
  async function submitUpdate() {
    const formData = new FormData();
  formData.append('appointmentStatus', appointment.value.appointmentStatus);
  formData.append('paymentStatus', appointment.value.paymentStatus);
  formData.append('appointmentDate', appointment.value.appointmentDate);
  formData.append('appointmentTimeslot', appointment.value.appointmentTimeslot);

  // 加入多個 service
  if (selectedService.value) {
  formData.append('services', selectedService.value);
}


  // 加入多個 extraPackages
  if (selectedPackages.value && selectedPackages.value.length > 0) {
    selectedPackages.value.forEach(pkg => {
      formData.append('extraPackages', pkg);
    });
  }

    try {
        await api.updateAppointmentById(appointment.value.appointmentId, formData);
  alert('預約更新成功');
  router.push('/');
} catch (error) {
  alert('更新失敗，請稍後再試');
  console.error(error);
}

  }
  
  onMounted(fetchAppointment)
  </script>
  
  <style scoped>
  .centered-form {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 50px;
  }
  .form-container {
    width: 80%;
    max-width: 600px;
  }
  </style>
  