const heart = document.querySelector(".heart_btn"); // heart 요소 부분 선택
const header = document.querySelector("#header");
const sidebox = document.querySelector(".side_box");
const variableWidth = document.querySelectorAll(".content_box .contents");
const deligation = document.querySelector(".contents_box");
// heart에 클릭이벤트 달아줌
// heart.addEventListener("click", function () {
//   console.log("hit");
//   heart.classList.toggle("on");
// });

// 모든 컨텐츠에 이벤트
function deligationFunc(e) {
  let elem = e.target; // 클릭된 요소
  //잘못 클릭된경우
  while (!elem.getAttribute("data-name")) {
    // elem의 부모 찾음
    elem = elem.parentNode;
    if (elem.nodeName === "BODY") {
      // BODY까지 이벤트가 없는 경우
      elem = null;
      return;
    } // data-name을 가진 속성을 찾을때까지 부모에게 접근을 반복
  }

  if (elem.matches('[data-name="heartbeat"]')) {
    let pk = elem.getAttribute("name"); // pk값을 받음
    $.ajax({
      Method: "POST",
      url: "data/like.json",
      data: { pk }, // 임시로 원래 [pk]로 받음
      dataType: "json",
      success: function (response) {
        // 통신에 성공한 데이터가 response로 들어옴
        // 임시로 원래 ('#like-count-')+pk로 받음
        let likeCount = document.querySelector("#like-count-37");
        likeCount.innerHTML = "좋아요" + response.like_count + "개";
      },
      error: function (request, status, error) {
        alert("로그인이 필요합니다");
        window.location.replace("https://www.naver.com"); // 임시 에러 웹페이지
      },
    });
  } else if (elem.matches('[data-name="bookmark"]')) {
    let pk = elem.getAttribute("name");
    $.ajax({
      Method: "POST",
      url: "data/bookmark.json",
      data: { pk },
      dataType: "json",
      success: function (response) {
        let bookmarkCount = document.querySelector("#bookmark-count-37");
        bookmarkCount.innerHTML = "북마크" + response.bookmark_count + "개";
      },
      error: function (request, status, error) {
        alert("로그인이 필요합니다.");
        window.location.replace("https://www.naver.com"); // 임시 에러 웹페이지
      },
    });
  } else if (elem.matches('[data-name="comment"]')) {
    let content = document.querySelector(
      "#add-comment-post-37 > input[type=text]"
    ).value;

    if (content.length > 140) {
      alert(
        "댓글은 최대 140자 입력 가능합니다. 현재 글자 수 : " + content.length
      );
      return;
    }

    $.ajax({
      Method: "POST",
      url: "./comment.html",
      data: {
        pk: 37,
        content: content,
      },
      dataType: "html",
      success: function (data) {
        document
          .querySelector("#comment-list-ajax-post-37")
          .insertAdjacentHTML("afterbegin", data); // 대크 자체를 추가함(위치, 데이터)
      },
      error: function (request, status, error) {
        alert("문제가 발생했습니다.");
      },
    });
    document.querySelector("#add-comment-post-37>input[type=text]").value = "";
  } else if (elem.matches('[data-name="comment_delete"]')) {
    $.ajax({
      Method: "POST",
      url: "data/delete.json",
      data: {
        pk: 37,
      },
      dataType: "json",
      success: function (response) {
        if (response.status) {
          let comt = document.querySelector(".comment-detail");
          console.log(comt);
          comt.remove();
        }
      },
      error: function (request, status, error) {
        alert("문제가 발생하였습니다..");
        window.location.replace("https://www.naver.com"); // 임시 에러 웹페이지
      },
    });
  } else if (elem.matches('[data-name="follow"]')) {
    $.ajax({
      Method: "POST",
      url: "data/follow.json",
      data: {
        pk: 37,
      },
      dataType: "json",
      success: function (response) {
        if (response.status) {
          document.querySelector("input.follow").value = "팔로잉";
        } else {
          document.querySelector("input.follow").value = "팔로워";
        }
      },
      error: function (request, status, error) {
        alert("문제가 발생하였습니다..");
        window.location.replace("https://www.naver.com"); // 임시 에러 웹페이지
      },
    });
  } else if (elem.matches('[data-name="share"]')) {
    // share
  }

  if (elem.matches('[data-name="more"]')) {
    console.log("더보기");
  }
  elem.classList.toggle("on");
}

function scrollFunc() {
  // 무한 스크롤 구현
  let scrollHeight = pageYOffset + window.innerHeight; // 화면을 얼마나 내렸는지 + 화면의 세로 값
  let documentHeight = document.body.scrollHeight; // 전체 화면 길이

  if (pageYOffset >= 10) {
    header.classList.add("on");
    if (sidebox) {
      sidebox.classList.add("on");
    }
    resizeFunc();
  } else {
    header.classList.remove("on");
    if (sidebox) {
      sidebox.classList.remove("on");
      sidebox.removeAttribute("style");
    }
  }

  if (scrollHeight >= documentHeight) {
    let page = document.querySelector("#page").value;
    document.querySelector("#page").value = parseInt(page) + 1;
    callMorePostAjax(page);
    if (page > 5) {
      return;
    }
  }
}

function callMorePostAjax(page) {
  if (page > 5) {
    return;
  }

  $.ajax({
    Method: "POST",
    url: "./post.html",
    data: {
      page: page,
    },
    dataType: "html",
    success: addMorePostAjax,
    error: function (request, status, error) {
      alert("문제가 발생하였습니다..");
      window.location.replace("https://www.naver.com"); // 임시 에러 웹페이지
    },
  });
}

function addMorePostAjax(data) {
  deligation.insertAdjacentHTML("beforeEnd", data);
}

function resizeFunc() {
  if (pageYOffset >= 10) {
    let calcWidth = window.innerWidth * 0.5 + 167; // 웹페이지 기반으로 위치 재조정
    sidebox.style.left = calcWidth + "px";
  }

  if (matchMedia("screen and (max-width : 800px)").matches) {
    // 여러개의 컨텐츠 박스가 있으므로 배열사용
    for (let i = 0; i < variableWidth.length; i++) {
      variableWidth[i].style.width = window.innerWidth - 20 + "px";
    }
  } else {
    for (let i = 0; i < variableWidth.length; i++) {
      if (window.innerWidth > 600)
        // 디폴트가 614이므로 614이상 커지지 않게 하기 위함
        variableWidth[i].removeAttribute("style");
    }
  }
}

setTimeout(function () {
  scrollTo(0, 0);
}, 100); // 새로고침시 맨위로

if (deligation) {
  deligation.addEventListener("click", deligationFunc);
}

window.addEventListener("resize", resizeFunc);
window.addEventListener("scroll", scrollFunc);
