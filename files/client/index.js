function openTab(evt, activeTabContent) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  activeTabContent.style.display = "block";
  evt.currentTarget.className += " active";
};

function showsTabContent() {
  tabcontent = document.getElementsByClassName("tab");
  tabcontent[0].style.display = "block";
};

function createScopeTab(tab, type) {
  tab[0].innerHTML +=
    '<button class="tablinks" onClick="openTab(event,' + type + ')">' + type + '</button> \
    ';
}

function createTabs(scopes) {
  console.log(scopes);

  tabcontent = document.getElementsByClassName("tab");
  tabcontent[0].innerHTML = '';
  if (scopes.read)
    createScopeTab(tabcontent, "Read");
  if (scopes.write)
    createScopeTab(tabcontent, "Write");
  if (scopes.delete)
    createScopeTab(tabcontent, "Delete");

  showsTabContent();
}


const getScopes = () => {
  const token = document.querySelector(".access_token").innerText;

  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:9002/scopes", true);
  xhttp.setRequestHeader("Authorization", "Bearer " + token);

  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == XMLHttpRequest.DONE) {
      console.log(xhttp);

      const res = JSON.parse(xhttp.responseText);
      console.log(res.scope);
      createTabs(res.scope);
    }
  };

  xhttp.send();
}

const getProtectedResource = () => {
  const token = document.querySelector(".access_token").innerText;
  const word = document.getElementById('form-read').value;


  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:9002/read", true);
  xhttp.setRequestHeader("Authorization", "Bearer " + token);
  xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");


  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == XMLHttpRequest.DONE) {
      console.log(xhttp);

      const res = xhttp.responseText;
      console.log(res);
      document.getElementById("form-res").value = res;
    }
  };

  xhttp.send(`word=${word}`);
  return false;
};

const addProtectedResource = (event) => {
  console.log(event);
  const word = document.getElementById('form-word').value;
  const meaning = document.getElementById('form-meaning').value;

  const token = document.querySelector(".access_token").innerText;

  const params = { "word": word, "meaning": meaning };
  const s = JSON.stringify(params);

  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:9002/add", true);
  xhttp.setRequestHeader("Authorization", "Bearer " + token);
  xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == XMLHttpRequest.DONE) {
      console.log(xhttp);

      console.log(xhttp.responseText);
    }
  };

  xhttp.send(`word=${word}&meaning=${meaning}`);
  return false;
};

const deleteProtectedResource = () => {
  const token = document.querySelector(".access_token").innerText;

  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:9002/resource/resource.json", true);
  xhttp.setRequestHeader("Authorization", "Bearer " + token);

  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == XMLHttpRequest.DONE) {
      console.log(xhttp);

      const res = JSON.parse(xhttp.responseText);
      console.log(res.scope);
      document.querySelector(".protectedResource").innerHTML = res.content;
    }
  };

  xhttp.send();
};
