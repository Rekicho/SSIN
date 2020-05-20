const getProtectedResource = () => {
  const token = document.querySelector(".access_token").innerText;

  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:9002/resource/resource1.json", true);
  xhttp.setRequestHeader("Authorization", "Bearer " + token);

  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == XMLHttpRequest.DONE) {
      document.querySelector(".protectedResource").innerHTML =
        xhttp.responseText;
    }
  };

  xhttp.send();
};
