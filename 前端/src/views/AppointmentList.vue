<template>
	<div class="container mt-3">
	  <div id="messageContainer"></div>
  
	  <!-- 查詢表單 -->
	  <form @submit.prevent="selectAppointmentByPhoneNum">
		<div class="row g-3 align-items-center">
		  <div class="col-auto">
			<label class="col-form-label">預約電話:</label>
		  </div>
		  <div class="col-auto">
			<input type="text" v-model="phoneNumber" class="form-control" />
		  </div>
		  <div class="col-auto">
			<button type="submit" class="btn btn-success" :disabled="!phoneNumber">查詢</button>
		  </div>
		</div>
	  </form>
  
	  <br />
  
	  <!-- 新增按鈕 -->
	  <button class="btn btn-outline-success mb-3" @click="openCreateModal = true">新增預約</button>
  
	  <!-- 新增預約 Modal -->
	  <div class="modal fade" tabindex="-1" ref="modalRef">
		<div class="modal-dialog">
		  <div class="modal-content">
			<form @submit.prevent="submitAppointment">
			  <div class="modal-header">
          <h5 class="modal-title">新增預約</h5>
				<button type="button" class="btn-close" @click="openCreateModal = false"></button>
			  </div>
			  <div class="modal-body">
  
				<div class="mb-3">
				  <label>會員 ID</label>
				  <input type="number"  v-model="form.memberId" class="form-control" required />
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
				  <input type="date"   v-model="form.date"  id="appointmentDate" class="form-control"  
				  @change="onDateChange" required />
				</div>
  
				<div class="mb-3">
				  <label  for="appointmentTimeslot">預約時段</label>
				  <select  v-model="form.timeslot" id="appointmentTimeslot" 
				  class="form-select" :disabled="!availableTimeslots.length" required>
					<option value="" disabled selected>請選擇時段</option>
					<option v-for="(timeslot, index) in availableTimeslots" :key="index" :value="timeslot.slot" :disabled="timeslot.disabled">
						{{ timeslot.slot }}</option>
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
				  <button type="button" class="btn btn-secondary" @click="openCreateModal = false">取消</button>
				</div>
  
			  </div>
			</form>
		  </div>
		</div>
	  </div>
  
	  <!-- 資料表 -->
	  <table id="appointmentTable" class="display" style="width:100%">
		<thead>
		  <tr>
			<th>預約編號</th>
			<th>預約日期</th>
			<th>時間</th>
			<th>預約服務</th>
			<th>加購服務</th>
			<th>總價格</th>
			<th>預約狀態</th>
			<th>付款狀態</th>
			<th>刪除</th>
			<th>修改</th>
		  </tr>
		</thead>
	  </table>
<!-- 隱藏欄位用來存 appointmentId -->
<input type="hidden" id="appointmentIdToDelete">
<input type="hidden" id="appointmentIdToUpdate">

    <!-- 刪除確認 Modal -->
<div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true" ref="deleteModalRef">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="deleteModalLabel">確認刪除</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"  @click="showDelete = false"></button>
      </div>
      <div class="modal-body">
        <p>您確定要刪除此項目嗎？</p>
        <input type="hidden" id="appointmentIdToDelete"> 
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
        <button type="button" class="btn btn-danger" id="confirmDelete"  @click="confirmDelete">確認刪除</button>
      </div>
    </div>
  </div>
</div>
 <!-- 確認修改 Modal -->
<div class="modal fade" id="confirmEditModal" tabindex="-1" aria-labelledby="confirmEditModalLabel" aria-hidden="true" ref="confirmEditModalRef">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="confirmEditModalLabel">確認修改</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="showUpdate = false"></button>
      </div>
      <div class="modal-body">
        <p>您確定要修改此項目嗎？</p>
        <input type="hidden" id="appointmentIdToEdit" v-model="appointmentIdToUpdate"> 
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
        <button type="button" class="btn btn-primary" @click="goToEditPage">確認修改</button>
      </div>
    </div>
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
  import { useRouter } from 'vue-router'
  import 'bootstrap/dist/js/bootstrap.bundle.min.js';

  const router = useRouter()



  const appointments = ref([])
  const phoneNumber = ref('')
  const openCreateModal = ref(false)
  const modalRef = ref(null)
  let modalInstance = null
  const modalTitle = ref('新增預約');

  watch(openCreateModal, (newVal) => {
  if (newVal && modalRef.value) {
    modalInstance = new Modal(modalRef.value)
    modalInstance.show()
  } else if (!newVal && modalInstance) {
    modalInstance.hide()
  }
})

const hideModal = () => {
  openCreateModal.value = false
}


const form = ref({
  memberId: '',
  petId: '',
  date: '',
  timeslot: '',
  service: '',
  extraPackages: []
})


const pets = ref([])
const appointmentDate = ref('')
const appointmentTimeslot = ref('')
const availableTimeslots = ref([])
const showDelete = ref(false)

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

//電話查詢
const selectAppointmentByPhoneNum = async () => {
  if (!phoneNumber.value) return

  try {
    const res = await api.selectAppointmentByPhoneNum(phoneNumber.value)
    const appointments = res.data

    if ($.fn.dataTable.isDataTable('#appointmentTable')) {
      $('#appointmentTable').DataTable().clear().destroy()
    }

    initializeAppointmentTable(appointments);
    
    $('#appointmentTable').on('click', '.delete-btn', function () {
      const id = $(this).data('id')
      deleteAppointment(id)
    })

    $('#appointmentTable').on('click', '.edit-btn', function () {
      const id = $(this).data('id')
      editAppointment(id)
    })

    table.clear().rows.add(appointments).draw()

  } catch (error) {
    console.error('查詢失敗:', error)
  }
}

//初始化table
const initializeAppointmentTable = (appointments) => {
  return $('#appointmentTable').DataTable({
    data: appointments,
    columns: [
      { data: 'appointmentId' },
      { data: 'appointmentDate' },
      { data: 'appointmentTimeslot' },
      {
    data: 'serviceNames',
    render: function (data) {
      if (!data) return '';
      const names = data.split(/[,|\t]/).map(s => s.trim());
      const unique = [...new Set(names)];
      return unique.join(', ');
    }
  },
      { data: 'additionalPackages' },
      { data: 'appointmentTotal' },
      {
        data: 'appointmentStatus',
        render: function (data) {
          if (data == 0) return '未完成';
          if (data == 1) return '已完成';
          return '已取消';
        }
      },
      {
        data: 'paymentStatus',
        render: function (data) {
          return data == 1 ? '已付款' : '未付款';
        }
      },
      {
  data: null,
  render: function (data, type, row) {

    return `<button type="button" class="btn btn-danger deleteBtn" data-bs-toggle="modal" data-bs-target="#deleteModal" data-id="${row.appointmentId}">
              刪除
            </button>`;
  },
  createdCell: function (cell, cellData, rowData, rowIndex, colIndex) {
    const button = cell.querySelector('.deleteBtn');
    button.addEventListener('click', () => {
      showDeleteModal(rowData.appointmentId); 
    });
  }
}
, {
  data: null,
  render: function (data, type, row) {
    return `<button type="button" class="btn btn-warning editBtn" data-bs-toggle="modal" data-bs-target="#confirmEditModal" @click="showUpdateModal(appointmentId)">
  修改
</button>
`;
  },
  createdCell: function (cell, cellData, rowData, rowIndex, colIndex) {
    const button = cell.querySelector('.editBtn');
    button.addEventListener('click', () => {
      showUpdateModal(rowData.appointmentId); 
    });
  }
}

    ]
  });
};

//送出表單
  const submitAppointment = async () => {
  console.log('表單資料:', form.value)
  openCreateModal.value = false
 
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
    window.location.reload();
  } catch (error) {
    console.error("預約失敗", error)
  }
}

//刪除預約
const deleteModalRef = ref(null)
let deleteModalInstance = null
onMounted(() => {
  if (deleteModalRef.value) {
    deleteModalInstance = new Modal(deleteModalRef.value)
  }
})
const appointmentIdToDelete = ref(null)
const showDeleteModal = (appointmentId) => {
  console.log('設置刪除預約 ID:', appointmentId)
  appointmentIdToDelete.value = appointmentId
  showDelete.value = true
}

const confirmDelete = async () => {
  console.log('confirmDelete 被觸發');
  if (!appointmentIdToDelete.value) return;
  console.log('正在刪除預約 ID:', appointmentIdToDelete.value);

  try {
    const response = await api.deleteAppointmentById(appointmentIdToDelete.value);
    console.log('API 返回:', response);

    const result = response.data;
    console.log('Response data:', result);
    console.log('typeof success:', typeof result.success);

    if (result.success) {
      
      appointments.value = appointments.value.filter(
        a => a.appointmentId !== appointmentIdToDelete.value
      );

      
     
  if (deleteModalInstance) {
    deleteModalInstance.hide(); 
  }
      showDelete.value = false;

      console.log('刪除成功');
      
      window.location.reload();
    } else {
      console.error('刪除預約失敗: success = false', result.message);
    }

  } catch (error) {
    console.error('刪除預約時發生錯誤:', error);
  }
};

//修改預約
const showUpdate = ref(false)
const appointmentIdToUpdate = ref(null)

const showUpdateModal = (appointmentId) => {
  console.log('設置修改預約 ID:', appointmentId)
  appointmentIdToUpdate.value = appointmentId
  showUpdate.value = true 
}

const goToEditPage = () => {
  if (!appointmentIdToUpdate.value) return
  router.push(`/appointments/edit/${appointmentIdToUpdate.value}`).then(() => {

  window.location.reload();
});
}

//顯示資料
onMounted(async () => {
  try {
    const res = await api.getAllAppointments()
    const appointments = res.data

    if ($.fn.dataTable.isDataTable('#appointmentTable')) {
      $('#appointmentTable').DataTable().clear().destroy()
    }

    initializeAppointmentTable(appointments)
  } catch (error) {
    console.error('獲取預約資料失敗:', error)
  }
})

</script>

  