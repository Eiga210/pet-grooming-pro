<template>
    <div class="checkin-container">
        <div class="card">
            <h2>報到中...</h2>
            <p :class="messageClass">{{ message }}</p>
            <!-- QR Code Display -->
            <QrCodeDisplay :appointment-id="appointmentId" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/utils/api'
import QrCodeDisplay from '@/components/QrCodeDisplay.vue'

const route = useRoute()
const appointmentId = route.query.appointmentId
const message = ref('處理中...')
const messageClass = ref('')

const checkIn = (appointmentId) => {
    return api.put(`/appointments/checkin/${appointmentId}`)
        .then(res => {
            message.value = res.data
            messageClass.value = 'success'
        })
        .catch(err => {
            const errorMsg = err.response?.data && typeof err.response.data === 'string'
                ? err.response.data
                : err.message || JSON.stringify(err.response?.data || {})
            message.value = '報到失敗：' + errorMsg
            messageClass.value = 'error'
        })
}

onMounted(() => {
    if (!appointmentId) {
        message.value = '無效的報到連結'
        messageClass.value = 'error'
        return
    }
    checkIn(appointmentId)
})
</script>

<style scoped>
.checkin-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f2f2f2;
}

.card {
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.success {
    color: green;
    font-size: 1.2rem;
}

.error {
    color: red;
    font-size: 1.2rem;
}
</style>