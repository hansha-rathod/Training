$(document).ready(function () {

    /* ---------- CITY TYPEAHEAD (INDIA) ---------- */
    const cities = [
        "Mumbai","Delhi","Bangalore","Hyderabad","Ahmedabad",
        "Chennai","Kolkata","Pune","Jaipur","Surat",
        "Lucknow","Kanpur","Nagpur","Indore","Bhopal",
        "Patna","Vadodara","Ghaziabad","Ludhiana","Agra",
        "Nashik","Faridabad","Meerut","Rajkot","Amritsar",
        "Noida","Gurgaon","Chandigarh","Coimbatore","Madurai",
        "Trichy","Salem","Erode","Tiruppur","Vellore",
        "Thanjavur","Dindigul","Karur","Hosur","Tirunelveli"
    ];

    const cityEngine = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: cities
    });

    
    cityEngine.initialize();

    $("#city").typeahead(
        {
            hint: true,
            highlight: true,
            minLength: 1
        },
        {
            name: "cities",
            source: cityEngine.ttAdapter()
        }
    );


    /* ---------- ABOUT HOVER (jQuery) ---------- */
    $("#aboutMenu").hover(
        function () { $(this).find(".dropdown-menu").stop(true,true).slideDown(200); },
        function () { $(this).find(".dropdown-menu").stop(true,true).slideUp(200); }
    );

    /* ---------- SERVICES HOVER ---------- */
    $("#servicesMenu").hover(
        function () { $(this).next(".dropdown-menu").stop(true,true).fadeIn(200); },
        function () { $(this).next(".dropdown-menu").stop(true,true).fadeOut(200); }
    );

    /* ---------- FORM VALIDATION (100% jQuery) ---------- */
    $("#nursingForm").submit(function (e) {
        e.preventDefault();

        const name = $("#patientName").val().trim();
        const mobile = $("#mobile").val().trim();
        const disease = $("#disease").val();
        const city = $("#city").val().trim();
        const date = $("#serviceDate").val();
        const staff = $("#staffCount").val().trim();
        const address = $("#address").val().trim();

        if (name.length < 3) {
            Swal.fire("Error","Patient Name must be at least 3 characters","error"); return;
        }

        if (!/^[6-9]\d{9}$/.test(mobile)) {
            Swal.fire("Error","Enter valid 10-digit Mobile Number","error"); return;
        }

        if (!disease || disease.length === 0) {
            Swal.fire("Error","Select at least one Disease","error"); return;
        }

        if (!cities.includes(city)) {
            Swal.fire("Error","City must be selected from suggestions","error"); return;
        }

        if (!date) {
            Swal.fire("Error","Service Date is required","error"); return;
        }

        if (!/^\d+$/.test(staff) || staff <= 0) {
            Swal.fire("Error","Enter valid number of Staff","error"); return;
        }

        if (address.length < 10) {
            Swal.fire("Error","Address must be minimum 10 characters","error"); return;
        }

        /* ---------- SWEETALERT RESULT ---------- */
        Swal.fire({
            title: "Booking Details",
            icon: "success",
            html: `
                <b>Patient Name:</b> ${name}<br>
                <b>Service Date:</b> ${date}<br>
                <b>Mobile Number:</b> ${mobile}
            `,
            confirmButtonText: "Confirm"
        });

        this.reset();
    });
});