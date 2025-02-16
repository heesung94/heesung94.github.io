document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");
    const libraryBtn = document.getElementById("library-btn");
    const usernameDisplay = document.getElementById("username-display");
    const userMenu = document.getElementById("user-menu");
    const settingsBtn = document.getElementById("settings-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const dropdownLibraryBtn = document.getElementById("dropdown-library-btn"); // 드롭다운 버튼

    // ✅ 로그인 버튼 클릭 시 로그인 페이지로 이동
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }

    // ✅ 회원가입 버튼 클릭 시 회원가입 페이지로 이동
    if (signupBtn) {
        signupBtn.addEventListener("click", () => {
            window.location.href = "signup.html";
        });
    }

    // 세팅 버튼
    if (settingsBtn) {
        settingsBtn.addEventListener("click", () => {
            window.location.href = "settings.html"; // 설정 페이지
        });
    }

    // 드롭다운 라이브러리 버튼
    if (dropdownLibraryBtn) {
        dropdownLibraryBtn.addEventListener("click", () => {
            window.location.href = "library.html";
        });
    }

    // ✅ 라이브러리 버튼 클릭 시 로그인 여부 확인 후 이동
    if (libraryBtn) {
        libraryBtn.addEventListener("click", () => {
            const user = sessionStorage.getItem("user");
            if (user) {
                window.location.href = "library.html";
            } else {
                alert("Please log in first!");
                window.location.href = "login.html";
            }
        });
    }

    // ✅ 로그인 상태 확인 후 UI 업데이트
    const user = sessionStorage.getItem("user");
    if (user) {
        if (usernameDisplay) {
            usernameDisplay.textContent = user;
            usernameDisplay.style.display = "inline-block";
            usernameDisplay.style.cursor = "pointer";

            // ✅ 사용자 이름 클릭 시 메뉴 표시/숨김
            usernameDisplay.addEventListener("click", () => {
                userMenu.classList.toggle("show");
            });
        }

        // 로그인 & 회원가입 버튼 숨기기
        if (loginBtn) loginBtn.style.display = "none";
        if (signupBtn) signupBtn.style.display = "none";
    }

    // ✅ 로그아웃 버튼 클릭 시 로그아웃 처리 후 메인 화면 이동
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem("user");
            window.location.href = "index.html";
        });
    }

    // ✅ 로그인 기능 처리
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const loginId = document.getElementById("login-id").value;
            const loginPw = document.getElementById("login-pw").value;
            const storedUser = JSON.parse(localStorage.getItem(loginId));

            if (storedUser && storedUser.pw === loginPw) {
                sessionStorage.setItem("user", loginId);
                window.location.href = "index.html";
            } else {
                document.getElementById("error-message").textContent = "Invalid ID or password.";
            }
        });
    }

    // ✅ 회원가입 기능 처리
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const signupId = document.getElementById("signup-id").value;
            const signupPw = document.getElementById("signup-pw").value;

            if (localStorage.getItem(signupId)) {
                document.getElementById("signup-error").textContent = "ID already exists.";
            } else {
                localStorage.setItem(signupId, JSON.stringify({ pw: signupPw }));
                alert("Sign up successful! Please log in.");
                window.location.href = "login.html";
            }
        });
    }


});
