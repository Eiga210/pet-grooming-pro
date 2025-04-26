package com.topics.appointment.model.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
	public class AppointmentDto {
		private int appointmentId;
		private int ownerMemberId;
		private int petId;
		private String appointmentDate;
		private String appointmentTimeslot;
		private int appointmentTotal;
		private int appointmentStatus;
		private int paymentStatus;
		private List<String> serviceNames;  
		private List<String> additionalPackages; 
	public AppointmentDto(int appointmentId, int ownerMemberId, int petId, String appointmentDate,
			String appointmentTimeslot, int appointmentTotal, int appointmentStatus, int paymentStatus,
			 List<String> serviceNames, List<String> additionalPackages) {
		this.appointmentId = appointmentId;
		this.ownerMemberId = ownerMemberId;
		this.petId = petId;
		this.appointmentDate = appointmentDate;
		this.appointmentTimeslot = appointmentTimeslot;
		this.appointmentTotal = appointmentTotal;
		this.appointmentStatus = appointmentStatus;
		this.paymentStatus = paymentStatus;
		this.serviceNames = serviceNames;
		this.additionalPackages = additionalPackages;
	}

	public AppointmentDto() {
	}
}
