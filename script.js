import { interiors } from "./data.js";

document.addEventListener("DOMContentLoaded", function () {
    const cursor = document.querySelector(".cursor");
    const gallery = document.querySelector(".gallery");
    const numberOfItems = interiors.length; // interiors 배열의 길이로 설정
    const radius = 1100;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const angleIncrement = (2 * Math.PI) / numberOfItems;

    for (let i = 0; i < numberOfItems; i++) {
        const item = document.createElement("div");
        item.className = "item";
        const p = document.createElement("p");
        const count = document.createElement("span");

        p.textContent = interiors[i].name;
        count.textContent = `(${Math.floor(Math.random() * 50) + 1})`;
        item.appendChild(p);
        p.appendChild(count);
        gallery.appendChild(item);

        const angle = i * angleIncrement;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const rotation = (angle * 180) / Math.PI;

        // 기본 스타일 설정 (글씨 크기 작게)
        gsap.set(item, {
            x: x + "px",
            y: y + "px",
            rotation: rotation,
            opacity: 0.5, // 기본 투명도
        });

        // 항목의 글씨 크기 작게 설정
        p.style.fontSize = "40px"; // 기본 글씨 크기

        item.addEventListener("mouseover", function () {
            // 모든 항목의 스타일을 초기화
            document.querySelectorAll(".item").forEach((el) => {
                gsap.to(el, {
                    color: "#ccc", // 회색으로 변경
                    opacity: 0.5,  // 투명도 조정
                    duration: 0.3,
                    onComplete: () => {
                        el.querySelector('p').style.fontSize = "40px"; // 기본 크기로 설정
                    }
                });
            });

            // 현재 항목에 대한 스타일 적용
            gsap.to(item, {
                color: "#fff",  // 원래 색상으로 복원
                opacity: 1,     // 완전 불투명
                duration: 0.3,
            });

            // 글씨 크기 자연스럽게 증가
            gsap.to(item.querySelector('p'), {
                fontSize: "58px", // 원래 크기로 복원
                duration: 0.3,
                ease: "power2.out" // 부드러운 애니메이션 효과
            });

            // 이미지와 텍스트를 감싸는 div 생성
            const imgContainer = document.createElement("div");
            imgContainer.style.display = "flex"; // flexbox 사용
            imgContainer.style.alignItems = "flex-end"; // 수직 아래 정렬
            imgContainer.style.pointerEvents = "none"; // 마우스 이벤트 차단
            imgContainer.style.marginLeft = "10px"; // 이미지와 텍스트 간의 간격 조정

            const imgSrc = `./assets/img${i + 1}.jpg`;
            const img = document.createElement("img");
            img.src = imgSrc;
            img.style.width = "300px"; // 이미지 너비 조정
            img.style.height = "auto"; // 비율 유지
            img.style.clipPath = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";

            // 새로운 텍스트 추가
            const newText = document.createElement("p");
            newText.textContent = `${interiors[i].name} | 이름`; // 원하는 텍스트 설정
            newText.style.color = "#fff"; // 텍스트 색상
            newText.style.marginLeft = "1100px"; // 이미지와 텍스트 간의 간격 조정
            newText.style.alignSelf = "flex-end"; // 텍스트 수직 아래 정렬

            // 컨테이너에 이미지와 텍스트 추가
            imgContainer.appendChild(img);
            imgContainer.appendChild(newText);
            cursor.innerHTML = ''; // 기존 내용을 비우고
            cursor.appendChild(imgContainer); // cursor에 이미지와 텍스트 추가

            gsap.to(img, {
                clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
                duration: 1,
                ease: "power3.out",
            });
        });

        item.addEventListener("mouseout", function() {
            const imgs = cursor.getElementsByTagName("img");
            if (imgs.length) {
                const lastImg = imgs[imgs.length - 1];
                Array.from(imgs).forEach((img, index) => {
                    if (img !== lastImg) {
                        gsap.to(img, {
                            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                            duration: 1,
                            ease: "power3.out",
                            onComplete: () => {
                                setTimeout(() => {
                                    img.remove();
                                }, 1000);
                            },
                        });
                    }
                });

                gsap.to(lastImg, {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                    duration: 1,
                    ease: "power3.out",
                    delay: 0.25,
                });
            }

            // 마우스 아웃 시 글씨 크기 원래대로 복원
            gsap.to(item.querySelector('p'), {
                fontSize: "40px", // 기본 크기로 복원
                duration: 0.3,
                ease: "power2.out" // 부드러운 애니메이션 효과
            });
        });
    }

    function updatePosition() {
        const scrollAmount = window.scrollY * 0.0001;
        document.querySelectorAll(".item").forEach(function (item, index) {
            const angle = index * angleIncrement + scrollAmount;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const rotation = (angle * 180) / Math.PI;

            gsap.to(item, {
                duration: 0.05,
                x: x + "px",
                y: y + "px",
                rotation: rotation,
                ease: "elastic.out(1, 0.3)",
            });
        });
    }

    updatePosition();
    document.addEventListener("scroll", updatePosition);

    document.addEventListener("mousemove", function(e) {
        gsap.to(cursor, {
            x: e.clientX - 150,
            y: e.clientY - 200,
            duration: 1,
            ease: "power3.out",
        });
    });
});
