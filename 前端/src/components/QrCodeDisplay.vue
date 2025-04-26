<template>
    <div class="qrcode-container">
        <div ref="qrcode"></div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({
    appointmentId: {
        type: [String, Number],
        required: true
    }
})

const qrcode = ref(null)

// 监听 appointmentId 的变化，确保动态更新时生成二维码
watch(() => props.appointmentId, (newValue) => {
    if (newValue && String(newValue).trim() !== '') {
        generateQRCode(newValue)
    } else {
        console.error('提供的 appointmentId無效，無法生成QRcode。')
    }
})

// 组件挂载时，检查并生成二维码
onMounted(() => {
    if (props.appointmentId && String(props.appointmentId).trim() !== '') {
        generateQRCode(props.appointmentId)
    } else {
        console.error('提供的 appointmentId無效，無法生成QRcode。')
    }
})

// 生成二维码的函数
const generateQRCode = (appointmentId) => {
  console.log("生成 QR code，appointmentId:", appointmentId); // 調試輸出 appointmentId
  const idStr = String(appointmentId).trim();
  const url = `https://yourdomain.com/checkin?appointmentId=${idStr}`;

  if (!idStr) {
    console.error('appointmentId 為空，無法生成 QR code');
    return;
  }

  const canvas = document.createElement('canvas');
  QRCode.toCanvas(canvas, url, (error) => {
    if (error) {
      console.error('QR code 生成失敗:', error);
    } else {
      qrcode.value.appendChild(canvas);
    }
  });
};


</script>

<style scoped>
.qrcode-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}
</style>
