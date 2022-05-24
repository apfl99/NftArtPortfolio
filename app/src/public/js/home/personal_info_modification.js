// 프런트 단의 기능을 구현
"use strict"
const form1 = document.getElementById("personal_info_modification");

form1.addEventListener("submit",personal_info);

function personal_info(e) {

        e.preventDefault();

        const filed = document.getElementById('filed');
        const birth = document.getElementById('birth');
        const major = document.getElementById('major');
        const personalDescription = document.getElementById('personalDescription');
        console.log(filed.value);

        //폼 데이터 처리
        const formData = new FormData();

        formData.append("filed", filed.files[0]);
        formData.append("birth",birth.value);
        formData.append("major",major.value);
        formData.append("personalDescription",personalDescription.value);
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
                location.href='/author_portfolio_nft?user='+res.data.username;
            } else {
                alert(res.msg);
            }
        })
        .catch((err) => {
            console.error("정보 수정 중 에러가 발생하였습니다.");
        });
};
  