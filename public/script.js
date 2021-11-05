const usernameList = document.getElementById("usernames");
const usernameForm = document.querySelector("form");

function appendUsername(check) {
  const newListItem = document.createElement("li");
  newListItem.innerText = check;
  usernameList.appendChild(newListItem);
}

usernameForm.addEventListener("submit", event => {
  event.preventDefault();
  let username = usernameForm.elements.username.value;
  fetch(`/check/${username}`)
    .then(response => response.json())
    .then(status => {
      if (status.message)
        return appendUsername(`${username} - ${status.message}`);
      if (status.error) return console.log(status.error);
    });
  usernameForm.reset();
  usernameForm.elements.username.focus();
});
