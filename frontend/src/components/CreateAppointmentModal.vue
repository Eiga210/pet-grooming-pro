<template>
    <div class="modal fade" tabindex="-1" ref="modalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="submitAppointment">
            <div class="modal-header">
              <h5 class="modal-title">新增預約</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label>會員 ID</label>
                <input type="number" v-model="form.memberId" class="form-control" required />
              </div>
  
              <div class="mb-3">
                <label>寵物</label>
                <select v-model="form.petId" class="form-select" :disabled="pets.length === 0" required>
                  <option value="" disabled>請選擇寵物</option>
                  <option v-for="pet in pets" :key="pet.petId" :value="pet.petId">{{ pet.petName }}</option>
                </select>
              </div>
  
              <div class="mb-3">
                <label for="appointmentDate">預約日期</label>
                <input type="date" v-model="form.date" id="appointmentDate" class="form-control" @change="onDateChange" required />
              </div>
  
              <div class="mb-3">
                <label for="appointmentTimeslot">預約時段</label>
                <select v-model="form.timeslot" id="appointmentTimeslot" class="form-select" :disabled="!availableTimeslots.length" required>
                  <option value="" disabled selected>請選擇時段</option>
                  <option v-for="(timeslot, index) in availableTimeslots" :key="index" :value="timeslot.slot" :disabled="timeslot.disabled">
                    {{ timeslot.slot }}
                  </option>
                </select>
              </div>
  
              <div class="mb-3">
                <label>選擇服務</label>
                <select v-model="form.service" class="form-select" required>
                  <option value="" disabled>請選擇服務</option>
                  <option v-for="service in services" :value="service.id" :key="service.id">
                    {{ service.name }} +{{ service.price }}元
                  </option>
                </select>
              </div>
  
              <div class="mb-3">
                <label>額外加購</label>
                <div v-for="pkg in extraPackages" :key="pkg.id" class="form-check">
                  <input class="form-check-input" type="checkbox" :value="pkg.id" v-model="form.extraPackages" :id="'extra' + pkg.id">
                  <label class="form-check-label" :for="'extra' + pkg.id">{{ pkg.name }} +{{ pkg.price }}元</label>
                </div>
              </div>
  
              <div class="mb-3">
                <strong>總價: {{ totalPrice }}元</strong>
              </div>
  
              <div class="modal-footer">
                <button type="submit" class="btn btn-primary">新增</button>
                <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { Modal } from 'bootstrap'
  import $ from 'jquery'
  import 'datatables.net'
  import api from "@/utils/api"
  
  const emit = defineEmits(['close', 'created'])
  const props = defineProps({
    pets: Array,
    services: Array,
    extraPackages: Array,
    availableTimeslots: Array,
  })
  
  const form = ref({
    memberId: '',
    petId: '',
    date: '',
    timeslot: '',
    service: '',
    extraPackages: []
  })
  
  const totalPrice = computed(() => {
    const service = props.services.find(s => s.id === form.value.service)
    const servicePrice = service ? service.price : 0
    const extras = props.extraPackages.filter(pkg => form.value.extraPackages.includes(pkg.id))
    const extraPrice = extras.reduce((sum, pkg) => sum + pkg.price, 0)
    return servicePrice + extraPrice
  })
  
  const onDateChange = () => {
    // 可選：觸發父層載入時段邏輯
    emit('date-changed', form.value.date)
  }
  
  const closeModal = () => {
    emit('close')
  }
  
  const submitAppointment = async () => {
    try {
      const payload = { ...form.value, totalPrice: totalPrice.value }
      await api.createAppointment(payload)
      emit('created')
      closeModal()
    } catch (error) {
      console.error('新增失敗:', error)
    }
  }
  </script>
  
  <style scoped>
  .modal.fade.show {
    display: block;
  }
  </style>
  