<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">預約訂單查詢</h2>

    <div class="row align-items-end mb-3">
  <!-- 狀態下拉選單 -->
  <div class="col-md-6">
    <label for="statusSelect" class="form-label">選擇預約狀態：</label>
    <select
      id="statusSelect"
      v-model="selectedStatus"
      @change="fetchAppointments"
      class="form-select"
    >
      <option :value="0">待處理</option>
      <option :value="1">已完成</option>
      <option :value="2">已取消</option>
    </select>
  </div>

  <!-- 回首頁按鈕 -->
  <div class="col-md-6 text-end">
    <router-link to="/toappointments" class="btn btn-success mt-3"
        >回首頁</router-link
      >
  </div>
</div>

    <!-- 預約列表 -->
    <div
      v-if="appointments.length === 0"
      class="alert alert-warning text-center"
    >
      尚未找到任何預約。
    </div>
    <ul v-else>
      <!-- 分頁後顯示的預約 -->
      <li
        v-for="appointment in paginatedAppointments"
        :key="appointment.appointmentId"
        class="mb-4 p-3 border rounded shadow-sm"
      >
        <div class="d-flex justify-content-between align-items-start mb-2">
          <p class="fw-bold">預約編號: {{ appointment.appointmentId }}</p>
          <p class="text-muted">
            {{ getAppointmentStatus(appointment.appointmentStatus) }}
          </p>
        </div>
        <div>
          <p>
            <strong>寵物名稱:</strong>
            {{ appointment.petName || "無提供寵物名稱" }}
          </p>
          <p>
            <strong>預約日期:</strong>
            {{ formatDate(appointment.appointmentDate) }}
          </p>
          <p>
            <strong>時段:</strong>
            {{ appointment.appointmentTimeslot || "無提供時段" }}
          </p>
          <p>
            <strong>基本服務:</strong>
            {{ uniqueServices(appointment.serviceNames) || "無服務項" }}
          </p>
          <p>
            <strong>加購服務:</strong>
            {{ appointment.additionalPackages || "無加購服務" }}
          </p>
          <p>
            <strong>總費用:</strong> ${{
              appointment.appointmentTotal || "未提供費用"
            }}
          </p>
          <p>
            <strong>支付狀態:</strong>
            {{ getPaymentStatus(appointment.paymentStatus) }}
          </p>
        </div>

        <!-- QR Code 顯示按鈕 -->
        <div v-if="appointment.appointmentStatus === 0"
        class="d-flex align-items-center gap-2">
          <button
            class="btn"
            :class="
              showQRCodeForAppointment === appointment.appointmentId
                ? 'btn-danger'
                : 'btn-success'
            "
            @click="toggleQRCode(appointment.appointmentId)"
          >
            {{
              showQRCodeForAppointment === appointment.appointmentId
                ? "關閉 QR Code"
                : "顯示 QR Code"
            }}
          </button>
          <v-btn
            variant="outlined"
            color="error"
            class="custom-cancel-btn"
            @click="openCancelModal(appointment.appointmentId)"
          >
            取消預約
          </v-btn>
        </div>
        <!-- QR Code 顯示區 -->
        <div
          v-if="
            showQRCodeForAppointment === appointment.appointmentId &&
            appointment.appointmentStatus === 0
          "
          class="mt-3"
        >
          <QrCodeDisplay :appointment-id="appointment.appointmentId" />
        </div>

        
      </li>
    </ul>

    <!-- 分頁 -->
    <div class="d-flex justify-content-center mt-4">
      <button
        class="btn btn-secondary"
        @click="previousPage"
        :disabled="currentPage === 1"
      >
        上一頁
      </button>
      <span class="mx-3">第 {{ currentPage }} 頁</span>
      <button
        class="btn btn-secondary"
        @click="nextPage"
        :disabled="currentPage === totalPages"
      >
        下一頁
      </button>
    </div>
    <div class="text-center text-muted mt-5">
      <p>
  店家地址：
  <a
    href="https://www.google.com/maps?q=桃園市中壢區新生路二段421號"
    target="_blank"
    rel="noopener noreferrer"
    class="text-body text-decoration-none "
  >
    桃園市中壢區新生路二段421號
  </a>
</p>
  <p>電話：(03) 453-3013 </p>

</div>
    <!-- 取消確認 Modal -->
    <v-dialog v-model="showCancelModal" max-width="400">
      <v-card>
        <v-card-title class="text-h6">確認取消預約</v-card-title>
        <v-card-text>您確定要取消此預約嗎？</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="showCancelModal = false">返回</v-btn>
          <v-btn color="error" @click="confirmCancel" class="no-hover-green" style="box-shadow: none;">確認取消預約</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="showSnackbar" :timeout="3000" color="success" top>
    {{ snackbarMessage }}
  </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/utils/api"
import QrCodeDisplay from "@/components/QrCodeDisplay.vue";
import { useRoute } from "vue-router";
const router = useRoute();
const toggleQRCode = (appointmentId) => {
  if (showQRCodeForAppointment.value === appointmentId) {
    showQRCodeForAppointment.value = null;
  } else {
    showQRCodeForAppointment.value = appointmentId;
  }
};

const memberId = ref();
const selectedStatus = ref(0);
const appointments = ref([]);
const currentPage = ref(1);
const itemsPerPage = 3;
const showQRCodeForAppointment = ref(null);

const fetchAppointments = async () => {
  try {
    const response = await api.getAppointmentsByStatus(
      memberId.value,
      selectedStatus.value
    );
    appointments.value = response.data;
  } catch (error) {
    console.error("獲取預約資料失敗", error);
    alert(`無法加載預約資料，錯誤訊息: ${error.message}`);
  }
};
const uniqueServices = (serviceNames) => {
  if (!serviceNames) return "無服務項";

  const names = serviceNames
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return [...new Set(names)].join(", ");
};

const props = defineProps({
  appointmentId: Number
})
const showSnackbar = ref(false);
const snackbarMessage = ref('');
const showCancelModal = ref(false)
const currentCancelId = ref(null)
const openCancelModal = (id) => {
  currentCancelId.value = id
  showCancelModal.value = true
}
const confirmCancel = async () => {
  try {
    const res = await api.AppointmentCancel(currentCancelId.value)
    snackbarMessage.value = res.data;
    showCancelModal.value = false
    showSnackbar.value = true;
    emit('appointmentCancelled', currentCancelId.value)
    window.location.reload();
  } catch (err) {
    snackbarMessage.value = '取消預約失敗，請稍後再試';
  }
}
const emit = defineEmits(['appointmentCancelled'])

onMounted(() => {
  const storedId = localStorage.getItem("memberId");
  if (storedId) {
    memberId.value = storedId;
    fetchAppointments();
  } else {
    alert("尚未登入，請先登入會員");
  }
});

const getAppointmentStatus = (status) => {
  const statusMapping = {
    0: "待處理",
    1: "已完成",
    2: "已取消",
  };
  return statusMapping[status] || "未知狀態";
};

const getPaymentStatus = (status) => {
  const paymentMapping = {
    0: "未支付",
    1: "已支付",
  };
  return paymentMapping[status] || "未知支付狀態";
};

const formatDate = (date) => {
  if (!date) return "未提供日期";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("zh-TW", options);
};

const paginatedAppointments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return appointments.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(appointments.value.length / itemsPerPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
}

h2 {
  color: #3e8e41;
  font-weight: 700;
  font-size: 2rem;
}

select.form-select {
  width: 200px;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  background-color: #f1f8f1;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

li:hover {
  background-color: #d4e8d4;
}

p {
  margin-bottom: 10px;
  font-size: 1.1rem;
}

strong {
  color: #3e8e41;
}

.text-muted {
  color: #6c757d;
}

.fw-bold {
  font-weight: 700;
}

button {
  margin-top: 10px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2c6e2c;
}

button:disabled {
  background-color: #c0c0c0;
  cursor: not-allowed;
}
.custom-cancel-btn {
  border: 1px solid #e53935; 
  color: #e53935;
  background-color: transparent;
  font-weight: bold;
  border-radius: 8px;
  transition: 0.2s ease;
}

.custom-cancel-btn:hover {
  background-color: #ffe6e6; 
  color: #b71c1c; 
}
.no-hover-green {
  background-color: #f44336 !important; 
  color: white !important;
  transition: none !important;
}

.no-hover-green:hover {
  background-color: #f44336 !important; 
  color: white !important;
}
</style>
