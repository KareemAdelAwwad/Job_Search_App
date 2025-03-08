const baseURL = "https://job-search.kareemadel.com";
// const baseURL = "http://localhost:3000";

$("#login").click(() => {
    const email = $("#email").val();
    const password = $("#password").val();
    const data = {
        email,
        password
    };

    // Add loading state to button
    const loginButton = $("#login");
    loginButton.html("<svg class=\"animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\"><circle class=\"opacity-25\" cx=\"12\" cy=\"12\" r=\"10\" stroke=\"currentColor\" stroke-width=\"4\"></circle><path class=\"opacity-75\" fill=\"currentColor\" d=\"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z\"></path></svg> Signing in...");
    loginButton.prop("disabled", true);

    axios({
        method: "post",
        url: `${baseURL}/auth/login`,
        data: data,
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    }).then(function (response) {
        if (response.status === 200) {
            localStorage.setItem("token", response.data.accessToken);
            loginButton.html("Success! Redirecting...");
            window.location.href = "index.html";
        } else {
            showError("Invalid email or password");
            resetButton();
        }
    }).catch(function (error) {
        console.log(error);
        showError("Invalid email or password");
        resetButton();
    });

    function resetButton() {
        loginButton.html("Sign In");
        loginButton.prop("disabled", false);
    }

    function showError(message) {
        // Create error message if it doesn't exist
        if ($("#error-message").length === 0) {
            $("<div id=\"error-message\" class=\"mt-4 p-3 bg-red-500 text-white rounded-md text-center\"></div>").insertAfter(loginButton);
        }
        $("#error-message").text(message);
    }
});