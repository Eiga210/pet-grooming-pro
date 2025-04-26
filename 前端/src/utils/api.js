import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
        // 可加入 token 或 log
        return config;
    },
    (error) => {
        console.error('[Request Error]', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log('[Response]', response);
        return response;
    },
    (error) => {
        console.error('[Response Error]', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

const getAllAppointments = () => {
    return api.get('/appointments')
}

const selectAppointmentByPhoneNum = (phone_number) => {
    return api.get('/appointment_query', {
        params: { phone_number }
    })
}
const addAppointment = (appointmentData) => {
    return api.post("/add", appointmentData)
}

const handleQueryPetById = (memberId) => {
    return api.get("/querypet", {
        params: { memberId }
    })
}

const handleQueryBookingTime = (appointmentDate) => {
    return api.get("/queryBookingTime", {
        params: { appointmentDate }
    })
}
const deleteAppointmentById = (appointmentId) => {
    return api.delete(`/delete/${appointmentId}`);
};
const showUpdatePage = (appointmentId) => {
    return api.get(`/update/${appointmentId}`);
};

const updateAppointmentById = (appointmentId, formData) => {
    return api.put(`/update/${appointmentId}`, formData)
}

const checkIn = (id) => {
    return api.put(`/appointments/checkin/${id}`)
}

const getAppointmentsByStatus = (memberId, status) => {
    return api.get(`/all/${memberId}/${status}`);
};

const AppointmentCancel = (id) =>
    api.put(`/appointment/cancel/${id}`);
api.getAllAppointments = getAllAppointments
api.selectAppointmentByPhoneNum = selectAppointmentByPhoneNum
api.addAppointment = addAppointment
api.handleQueryPetById = handleQueryPetById
api.handleQueryBookingTime = handleQueryBookingTime
api.deleteAppointmentById = deleteAppointmentById
api.showUpdatePage = showUpdatePage
api.updateAppointmentById = updateAppointmentById
api.checkIn = checkIn
api.getAppointmentsByStatus = getAppointmentsByStatus
api.AppointmentCancel = AppointmentCancel

export default api;