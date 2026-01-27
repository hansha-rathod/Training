$(document).ready(function () {

    $("#httpMethod").on("change", function () {
        const method = $(this).val();
        if (method === "GET" || method === "DELETE") {
          $("#bodySection").hide();
          $("#headerSection").hide();
        } else {
          $("#bodySection").show();
          $("#headerSection").show();
        }
      });
    
      // Force logic to run once on page load
    $("#httpMethod").trigger("change");

  
    $("#sendRequest").on("click", function () {
  
      const url = $("#apiUrl").val().trim();
      const method = $("#httpMethod").val();
      let headers = {};
      let body = null;

      if (!$("#apiUrl")[0].checkValidity()) {
        $("#apiUrl")[0].reportValidity();
        return;
      }
  
      // Parse headers JSON
      try {
        headers = $("#headers").val()
          ? JSON.parse($("#headers").val())
          : {};
      } catch (e) {
        alert("Invalid Headers JSON");
        return;
      }
  
      // Parse body JSON
      if (method !== "GET" && method !== "DELETE") {
        try {
          body = JSON.stringify(JSON.parse($("#bodyData").val()));
        } catch (e) {
          alert("Invalid Body JSON");
          return;
        }
      }

      $.ajax({
        url: url,
        method: method,
        headers: headers,
        data: body,
        contentType: body ? "application/json" : false,
        processData: false,
  
        success: function (data, textStatus, jqXHR) {
          $("#statusCode").text(jqXHR.status);
  
          try {
            data = JSON.stringify(data, null, 2);
          } catch {}
  
          $("#responseOutput").text(data);
        },
  
        error: function (jqXHR, textStatus, errorThrown) {
          $("#statusCode").text(jqXHR.status || "Error");
  
          let errorText = jqXHR.responseText || errorThrown;
          try {
            errorText = JSON.stringify(JSON.parse(errorText), null, 2);
          } catch {}
  
          $("#responseOutput").text(errorText);
        }
      });
  
    });
  
  });
  