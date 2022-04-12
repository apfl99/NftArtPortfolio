// 프런트 단의 기능을 구현
"use strict"
const formBtn = document.getElementById("personal_info_modification");

formBtn.addEventListener("submit",personal_info);

function personal_info(e) {

        e.preventDefault();

        const profile = document.getElementById('profile');
        const DesignerName = document.getElementById('DesignerName');
        const birthday = document.getElementById('birthday');
        const major = document.getElementById('major');

        //폼 데이터 처리
        const formData = new FormData();

        formData.append("DesignerName",DesignerName.value);
        formData.append("birthday",birthday.value);
        formData.append("personalDescription",personalDescription.value);
        formData.append("profile", profile.profile[0]);
        formData.append("userId",window.sessionStorage.getItem('userId'));

        //프론트 -> 서버(form 형식)
        fetch("/personalinfoModification", {
                method: 'POST',
                body: formData,
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.success) {
                alert('개인 정보 수정 완료');
                location.href='/mypage';
            } else {
                alert(res.msg);
            }
        })
        .catch((err) => {
            console.error("정보 수정 중 에러가 발생하였습니다.");
        });
};
  