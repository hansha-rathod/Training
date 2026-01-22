$(document).ready(function () {

  let selectedSlot;
  let modal = new bootstrap.Modal(
    document.getElementById("appointmentModal")
  );

  let calendar = new FullCalendar.Calendar(
    document.getElementById("calendar"),
    {
      height: "100%",
      expandRows: true,         
      initialView: "timeGridWeek",

      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay"
      },

      selectable: true,
      nowIndicator: true,

      slotMinTime: "08:00:00",  
      slotMaxTime: "20:00:00",   
      slotDuration: "00:30:00",
      scrollTime: "08:00:00",

      select: function (info) {
        selectedSlot = info;
        $("#patientName").val("");
        $("#mobileNumber").val("");
        modal.show();
      }
    }
  );

  calendar.render();

  $("#confirmBooking").click(function () {
    let name = $("#patientName").val();
    let mobile = $("#mobileNumber").val();

    if (!name || !mobile) {
      alert("Please fill all fields");
      return;
    }

    calendar.addEvent({
      title: name + " (" + mobile + ")",
      start: selectedSlot.start,
      end: selectedSlot.end
    });

    modal.hide();
  });

});