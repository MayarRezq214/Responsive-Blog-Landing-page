const url = "https://jsonplaceholder.typicode.com/photos";
let xhr = new XMLHttpRequest();
xhr.open("GET", url);
xhr.send();

xhr.onload = function () {
  if (xhr.status === 200) {
    console.log("ok");
  } else {
    console.log("error");
    console.log(xhr.status);
  }

  let x = JSON.parse(xhr.responseText)
  if (window.location.pathname.endsWith("index.html")) {
    for(i=0 ; i<100 ; i++){
      checkEditing(i+1 , x[i])
      let deletes = JSON.parse(sessionStorage.getItem(`Delete${x[i].id}`))

      if(deletes === null){
        document.getElementsByClassName("innerJs")[0].innerHTML+= 
        `<div class="col">
          <div class="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg"  style="background-image: url('${x[i].url}');">
            <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
              <h3 class="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">${x[i].title}</h3>
              <ul class="d-flex list-unstyled mt-auto">
                <li class="me-auto">
                  <img src="https://github.com/twbs.png" alt="Bootstrap" width="32" height="32" class="rounded-circle border border-white">
                </li>
                <li class="d-flex align-items-center me-3">
                  <svg class="bi me-2" width="1em" height="1em"><use xlink:href="#geo-fill"></use></svg>
                  <small><button type="button" onclick="Edit(${x[i].id} )" class="btn">Edit</button></small>
                </li>
                <li class="d-flex align-items-center">
                  <svg class="bi me-2" width="1em" height="1em"><use xlink:href="#calendar3"></use></svg>
                  <small><button type="button" onclick="Delete(${x[i].id})" class="btn">Delete</button></small>
                </li>
              </ul>
            </div>
          </div>
        </div>`
      }
    }
  }else{
    let ID = sessionStorage.getItem("ID")
    checkEditing(ID , x[ID-1])
    
    document.getElementById("form").innerHTML =
  `<div class="mb-3 row">
    <label for="staticEmail" class="col-sm-2 col-form-label">ID</label>
    <div class="col-sm-10">
      <input type="text" readonly class="form-control-plaintext" id="staticEmail" value="${ID}">
    </div>
  </div>
  <div class="mb-3 row">
    <label class="col-sm-2 col-form-label">Title</label>
    <div class="col-sm-10">
      <input class="form-control" id="title" type="text" placeholder="${x[ID-1].title}" aria-label="default input example">
    </div>
  </div>
  <div class="mb-3 row">
  <label class="col-sm-2 col-form-label">Album ID</label>
  <div class="col-sm-10">
    <input class="form-control" id="albumID" type="text" placeholder="${x[ID-1].albumId}" aria-label="default input example">
  </div>
  </div>
  <button onclick="save(${ID})" class="btn btn-outline-secondary type="submit"">Save</button>
  <button type="button" onclick="cancel()" class="btn btn-outline-danger">cancel</button>`
  }
}

function checkEditing(id , obj){
  let updates = JSON.parse(sessionStorage.getItem(id))
  if (updates !== null){
    obj.title = updates.title;
    obj.albumId = updates.albumId
  }
}

function Edit(id){
  sessionStorage.setItem("ID" , id)
  if (window.location.pathname.endsWith("index.html")){
    window.location.href = "blog.html";
  }
}

function Delete(id){
  let conf = confirm("Are you sure you want to delete the card?")
  if (conf === true){
    const deletedUrl = `${url}/${id}`;;  // URL for the resource you want to delete

    let xhrDelete = new XMLHttpRequest();
    xhrDelete.open("DELETE", deletedUrl);
    xhrDelete.send();

    xhrDelete.onload = function () {
      if (xhrDelete.status === 200) {
        console.log("Delete successful");
      } else {
        console.log("Delete error");
        console.log(xhrDelete.status);
      }
    }
    sessionStorage.setItem(`Delete${id}` , id)
    window.location.href = "index.html"
  }
}

function save(ID){
  let newTitle = document.getElementById("title").value;
  let newAlbumID = document.getElementById("albumID").value;

  let obj = {
    "title": newTitle ,
    "albumId" : newAlbumID ,
  };

  const newURL = `${url}/${ID}`;
  let xhr = new XMLHttpRequest();
  xhr.open("PUT", newURL);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify(obj));

  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("Update successful");
    } else {
      console.log("Update error");
      console.log(xhr.status);
    }
  };

  //to save data in session storage to appear to the user because it's a (fake server)
  //don't save nulls
  let updates = JSON.parse(sessionStorage.getItem(ID))
  if (obj.title === "" && obj.albumId === ""){
    alert("you don't edit anything, if you want to cancel please press cancel")
  }else if(obj.title == "" && updates !== null){
    updates.albumId = obj.albumId
    sessionStorage.setItem(ID , JSON.stringify(updates))
    window.location.href = "index.html"
  }else if(obj.albumId == "" && updates !== null){
    updates.title = obj.title
    sessionStorage.setItem(ID , JSON.stringify(updates))
    window.location.href = "index.html"
  }else{
    sessionStorage.setItem(ID , JSON.stringify(obj))
    window.location.href = "index.html"
  }
}

function cancel(){
  let conf = confirm("If you want to cancel editiong press ok!")
  if (conf === true){
    window.location.href = "index.html"
  }
}