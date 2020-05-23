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

function createDeleteTab(tab){
  tabcontent[0].innerHTML += 
      '<button class="tablinks" onClick="openTab(event,' + 'Delete' + ')">' + "Delete" + '</button> \
      ';
}

function createAddTab(tab){
  tabcontent[0].innerHTML += 
      '<button class="tablinks" onClick="openTab(event,' + 'Write' + ')">' + "Write" + '</button> \
      ';
}

function createReadTab(tab){
  tabcontent[0].innerHTML += 
      '<button class="tablinks" onClick="openTab(event,' + 'Read' + ')">' + "Read" + '</button> \
      ';
}

function createTabs(scopes) {
  console.log(scopes);

  tabcontent = document.getElementsByClassName("tab");
  tabcontent[0].innerHTML = '';
  if(scopes.read)
    createReadTab(tabcontent);
  if(scopes.write)
    createAddTab(tabcontent);
  if(scopes.delete)
    createDeleteTab(tabcontent);

  showsTabContent();
}


const getScopes = () =>{
  const token = document.querySelector(".access_token").innerText;

  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:9002/scopes", true);
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

  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:9002/resource/resource.json", true);
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

const addProtectedResource = () => {
  const token = document.querySelector(".access_token").innerText;

  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:9002/resource/resource.json", true);
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

const deleteProtectedResource = () => {
  const token = document.querySelector(".access_token").innerText;

  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:9002/resource/resource.json", true);
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
