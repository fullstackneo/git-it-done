// var getUserRepos = function () {
//   fetch("https://api.github.com/users/octocat/repos").then(function (response) {
//     response.json().then(function (data) {
//       console.log(data);
//     });
//   });
// };

// getUserRepos();
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var getUserRepos = function (userName) {
  // format the github api url
  var apiUrl = "https://api.github.com/users/" + userName + "/repos";

  // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      if (!response.ok) {
        alert("Error: GitHub User Not Found");
        return;
      }
      return response.json();
    })
    .then(function (data) {
      displayRepos(data, userName);
      console.log(data);
    });
};

// .catch(function (error) {
//   // Notice this `.catch()` getting chained onto the end of the `.then()` method
//   alert("Unable to connect to GitHub");
// });

// form event listener
var userformEl = document.querySelector("#user-form");

function formSubmitHandler(event) {
  event.preventDefault();
  var userName = userformEl.querySelector("#username").value.trim();
  if (userName) {
    getUserRepos(userName);
    userformEl.querySelector("#username").value = "";
  } else {
    alert("please enter a valid name");
  }
}

userformEl.addEventListener("submit", formSubmitHandler);

var displayRepos = function (repos, searchTerm) {
  // clear old content
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;

  // loop over repos
  for (var i = 0; i < repos.length; i++) {
    // format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;

    // create a container for each repo
    var repoEl = document.createElement("div");
    repoEl.className = "list-item flex-row justify-space-between align-center";

    // create a span element to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    // append to container
    repoEl.appendChild(titleEl);

    // create a status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    // check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // append to container
    repoEl.appendChild(statusEl);

    // append container to the dom
    repoContainerEl.appendChild(repoEl);
  }

  // check if api returned any repos
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
    return;
  }
};
