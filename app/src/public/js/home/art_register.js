// 프런트 단의 기능을 구현
"use strict"
const formBtn = document.getElementById("art_register_form");

formBtn.addEventListener("submit",art_register);

function art_register(e) {
        
        e.preventDefault();

        const files = document.getElementById('files');
        const artName = document.getElementById('artName');
        const artCategory = document.getElementById('artCategory');
        const artDescription = document.getElementById('artDescription');

        //폼 데이터 처리
        const formData = new FormData();

        
        formData.append("artName",artName.value);
        formData.append("artCategory",artCategory.value);
        formData.append("artDescription",artDescription.value);
        formData.append("files", files.files[0]);
        formData.append("userId",window.sessionStorage.getItem('userId'));
        
        //프론트 -> 서버(form 형식)
        fetch("/artRegister", {
                method: 'POST',
                body: formData,
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.success) {
                alert('작품 업로드 성공');
                location.href='/mypage';
            } else {
                alert(res.msg);
            }
        })
        .catch((err) => {
            console.error("작품 업로드 중 에러가 발생하였습니다.");
        });
};
  