// 프런트 단의 기능을 구현
"use strict"
const form_r = document.getElementById("author_record_form");

form_r.addEventListener("submit",record_register);

function record_register(e) {
        e.preventDefault();

        const host = document.getElementById('host');
        const subject = document.getElementById('subject');
        const date_p = document.getElementById('date_p');
        const result = document.getElementById('result');

        // 폼 데이터 처리
        const formData = new FormData();

        formData.append("host",host.value);
        formData.append("subject",subject.value);
        formData.append("date_p",date_p.value);
        formData.append("result", result.value);
        formData.append("userId",window.sessionStorage.getItem('userId'));

        //Form -> JSON
        const plainFormData = Object.fromEntries(formData.entries());
	    const formDataJsonString = JSON.stringify(plainFormData);
        
        //프론트 -> 서버(form 형식)
        fetch("/recordRegister", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },  
                body: formDataJsonString,
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.success) {
                alert('작가 이력 등록 완료');
                location.href='/mypage';
            } else {
                alert(res.msg);
            }
        })
        .catch((err) => {
            console.error("작가 이력 등록 중 에러가 발생하였습니다.");
        });
};
  