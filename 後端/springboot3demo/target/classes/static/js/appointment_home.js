$(document).ready(function () {
	let table = $('#appointmentTable').DataTable(); // 初始化 DataTable

	    // 發送 AJAX 請求
	    $.ajax({
	        url: '/appointments',
	        type: 'GET',
	        dataType: 'json',
	        success: function(data) {
	            let tbody = $("#appointmentTable tbody");
	            tbody.empty(); // 清空現有的資料

	            // 遍歷資料並插入表格
				data.forEach(function (a) {
				    let serviceNames = a.serviceNames || '無服務資料';
				    let additionalPackages = a.additionalPackages || '無加購資料';

				    let row = `
				        <tr>
				            <td>${a.appointmentId}</td>
				            <td>${a.appointmentDate}</td>
				            <td>${a.appointmentTimeslot}</td>
				            <td>${serviceNames}</td>
				            <td>${additionalPackages}</td>
				            <td>${a.appointmentTotal}</td>
				            <td>${a.appointmentStatus === 1 ? '已完成' : '未完成'}</td>
				            <td>${a.paymentStatus === 1 ? '已付款' : '未付款'}</td>
				        </tr>`;
				    tbody.append(row);
	            });

	            table.draw(); // 更新 DataTable
	        },
	        error: function(err) {
	            console.error("抓資料失敗", err);
	        }
	    });
    $('#openModalBtn').click(function () {
        $('#orderModal').modal('show');
    });

    let today = new Date().toISOString().split("T")[0];
    $('#appointmentDate').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayHighlight: true,
        startDate: today
    });
	$("#appointmentQueryForm").on("submit", function (e) {
	    e.preventDefault(); 
		let phone = $("#phone_number").val();
		    if (!phone) {
		        alert("請輸入電話號碼");
		        return;
		    }
			window.location.href = `/api/appointment/appointment_query?phone_number=${encodeURIComponent(phone)}`;
			});
    $("#phone_number").on("input", function () {
        let phoneInput = this.value;
        let errorMsg = $("#nameError");
        let submitBtn = $("#submitBtn");
        let validPhonePattern = /^09\d{8}$/;

        if (!validPhonePattern.test(phoneInput)) {
            errorMsg.text("請輸入有效電話號碼");
            $(this).css("borderColor", "red");
            submitBtn.prop("disabled", true);
        } else {
            errorMsg.text("");
            $(this).css("borderColor", "");
            submitBtn.prop("disabled", false);
        }
    });

    $('#memberId, #appointmentpetId').on('input', function () {
        if ($(this).val() < 1) {
            $(this).val(1);
        }
    });

    function calculateTotalPrice() {
        let total = 0;
        let servicePrice = parseInt($("#serviceSelect option:selected").data("price")) || 0;
        total += servicePrice;
        $("input[type='checkbox']:checked").each(function () {
            total += parseInt($(this).data("price")) || 0;
        });
        $("#totalPrice").text("總價: " + total + "元");
    }

    $("input[type='checkbox'], #serviceSelect").change(calculateTotalPrice);
    calculateTotalPrice();

    $("#appointmentDate").on("change", function () {
        var selectedDate = $(this).val();
        console.log("選擇的日期是: " + selectedDate);
        if (!selectedDate) {
            alert("請選擇一個日期");
            return;
        }
        $.ajax({
            url: "/api/appointment/queryBookingTime",
            type: "GET",
            data: { appointmentDate: selectedDate },
            dataType: "json",
            success: function (response) {
                console.log(response);
                var bookedTimeslots = response.bookedTimeslots || [];
                var allTimeslots = ["10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00"];
                var timeslotSelect = $("#appointmentTimeslot");
                timeslotSelect.empty();
                allTimeslots.forEach(function (slot) {
                    var option = $("<option></option>").val(slot).text(slot);
                    if (bookedTimeslots.includes(slot)) {
                        option.prop("disabled", true);
                    }
                    timeslotSelect.append(option);
                });
            },
            error: function (xhr, status, error) {
                console.error("無法獲取預約資料: " + error);
            }
        });
    });

    $("#memberId").on("change", function () {
        let memberId = $(this).val();
        let petSelect = $("#appointmentpetId");
        console.log("🔍 petSelect HTML:", petSelect.prop("outerHTML"));
        petSelect.empty().append('<option value="" disabled selected>請選擇寵物</option>');
        if (memberId) {
            $.ajax({
                url: "/api/appointment/querypet",
                method: "GET",
                data: { memberId: memberId },
                dataType: "json",
                success: function (data) {
                    console.log("✅ AJAX 成功獲取寵物資料:", JSON.stringify(data, null, 2));
                    if (data.length > 0) {
                        $.each(data, function (index, pet) {
                            console.log("🔍 取得的寵物資料:", pet);
                            let petId = pet.petId ? parseInt(pet.petId, 10) : NaN;
                            let petName = pet.petName || "";
                            console.log("🔍 petId:", petId, "petName:", petName);
                            if (!isNaN(petId) && petName) {
                                petSelect.append('<option value="' + petId + '">' + petName + '</option>');
                                if (index === 0) {
                                    $('#appointmentpetId').val(petId);
                                }
                                console.log("🟢 生成的選項: <option value='" + petId + "'>" + petName + "</option>");
                            } else {
                                console.error("❌ petId 或 petName 無效:", pet);
                            }
                        });
                        if (petSelect.val() === "") {
                            petSelect.val("");
                        }
                        petSelect.trigger("change");
                    } else {
                        console.warn("⚠️ 未找到寵物資料！");
                    }
                    console.log("選擇的寵物ID: " + petSelect.val());
                },
                error: function () {
                    alert("無法載入寵物資料");
                }
            });
        }
    });

    $("#appointmentpetId").on("change", function () {
        let selectedPetId = $(this).val();
        console.log("當前選擇的寵物ID:", selectedPetId);
        if (!selectedPetId) {
            event.preventDefault();
            alert("請選擇寵物！");
        }
    });
	$("#addAppointmentForm").on("submit", function (e) {
		e.preventDefault(); 

		const formData = $(this).serialize();

		$.ajax({
			type: "POST",
			url: "/api/appointment/add", 
			data: formData,
			success: function (response) {
				console.log("新增成功", response);
				window.location.href = "/api/appointment/result";
			},
			error: function (xhr) {
				console.log("新增失敗", xhr.responseText);
			}
		});
	});

	$('#example').on('click', '.deleteBtn', function() {
	    var appointmentId = $(this).data('appointment-id');
	    $('#appointmentIdToDelete').val(appointmentId);
		$('#rowToDelete').val(table.row($(this).closest('tr')).index());
	});
    $('#confirmDelete').click(function () {
        var appointmentId = $('#appointmentIdToDelete').val();
        if (!appointmentId) {
            alert('無效的預約 ID');
            return;
        }
        $('#confirmDelete').prop('disabled', true).text('刪除中...');
        $.ajax({
            url: '/api/appointment/delete/' + appointmentId,
            type: 'DELETE',
            success: function (data) {
                if (data.success) {
                    showMessage(data.message, 'success');
                    $('#deleteModal').modal('hide');
                    location.reload();
                } else {
                    showMessage(data.message);
                    $('#deleteModal').modal('hide');
                }
            },
            error: function (error) {
                console.error('錯誤:', error);
                showMessage('刪除失敗，請稍後再試');
                $('#deleteModal').modal('hide');
            },
            complete: function () {
                $('#confirmDelete').prop('disabled', false).text('確認刪除');
            }
        });
    });
	$('#example').on('draw.dt', function() {
		    $('#example').on('click', '.deleteBtn', function() {
		        var appointmentId = $(this).data('appointment-id');
		        $('#appointmentIdToDelete').val(appointmentId);
		    });
			$('#confirmDelete').click(function () {
			       var appointmentId = $('#appointmentIdToDelete').val();
			       if (!appointmentId) {
			           alert('無效的預約 ID');
			           return;
			       }
			       $('#confirmDelete').prop('disabled', true).text('刪除中...');
			       $.ajax({
			           url: '/api/appointment/delete/' + appointmentId,
			           type: 'DELETE',
			           success: function (data) {
			               if (data.success) {
			                   showMessage(data.message, 'success');
			                   $('#deleteModal').modal('hide');
			                   location.reload();
			               } else {
			                   showMessage(data.message);
			                   $('#deleteModal').modal('hide');
			               }
			           },
			           error: function (error) {
			               console.error('錯誤:', error);
			               showMessage('刪除失敗，請稍後再試');
			               $('#deleteModal').modal('hide');
			           },
			           complete: function () {
			               $('#confirmDelete').prop('disabled', false).text('確認刪除');
			           }
			       });
			   });
			   $(".updateBtn").click(function () {
			          let appointmentId = $(this).attr("data-appointmentid");
			          $("#appointmentIdToUpdate").val(appointmentId);
			      });
			      $("#confirmUpdate").click(function () {
			          let appointmentId = $("#appointmentIdToUpdate").val();
			          if (appointmentId) {
			              window.location.href = "/api/appointment/update/" + appointmentId;
			          }
			      });
		});
    $(".updateBtn").click(function () {
        let appointmentId = $(this).attr("data-appointmentid");
        $("#appointmentIdToUpdate").val(appointmentId);
    });
    $("#confirmUpdate").click(function () {
        let appointmentId = $("#appointmentIdToUpdate").val();
        if (appointmentId) {
            window.location.href = "/api/appointment/update/" + appointmentId;
        }
    });

    function showMessage(message, type) {
        var messageBox = $('<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert">' +
            message +
            '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
            '</div>');
        $('#messageContainer').append(messageBox);
        setTimeout(function () {
            messageBox.alert('close');
        }, 5000);
    }

});