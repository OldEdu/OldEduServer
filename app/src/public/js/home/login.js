// 로그인 페이지 프론트에서 작동하는 js파일
"use strict";

const id = document.querySelector("#id"),
      psword = document.querySelector("#psword"),
      loginBtn = document.querySelector("#login");

loginBtn.addEventListener("click", login);

function login() {
    const req = {
        id: id.value,
        psword: psword.value,
    };
    // 데이터를 서버로 전송
    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.success) {
                // success = true 인 경우
                location.href = "/";
            } else {
                alert(res.msg);
            }
        })
        .catch((err) => {
            console.error("로그인 중 에러발생");
        });
};