const input = document.getElementById("post-id");
const searchButton = document.getElementById("search-button");
const postContainer = document.getElementById("post-container");
const postTitle = document.getElementById("post-title");
const postBody = document.getElementById("post-body");
const commentsButton = document.getElementById("comments-button");
const commentsContainer = document.getElementById("comments-container");

input.addEventListener("input", validateInput);

function validateInput() {
  const { value } = input;
  const regex = /^[1-9]\d?$|^100$/;

  if (!regex.test(value)) {
    input.style.borderColor = "red";
  } else {
    input.style.borderColor = "";
  }
}

searchButton.addEventListener("click", searchPost);

function searchPost() {
  const postId = input.value.trim();

  if (postId === "") {
    alert("Будь ласка, введіть ID поста.");
    return;
  }

  const postUrl = `https://jsonplaceholder.typicode.com/posts/${postId}`;
  const commentsUrl = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;

  // Виконання запиту за допомогою Promise
  fetch(postUrl)
    .then(response => response.json())
    .then(post => {
      if (post.id) {
        postTitle.textContent = post.title;
        postBody.textContent = post.body;
        postContainer.style.display = "block";
        commentsContainer.innerHTML = "";
        commentsButton.addEventListener("click", () => {
          fetch(commentsUrl)
            .then(response => response.json())
            .then(comments => {
              comments.forEach(comment => {
                const commentElement = document.createElement("div");
                commentElement.classList.add("comment");
                commentElement.innerHTML = `
                  <h3>${comment.name}</h3>
                  <p>${comment.body}</p>
                `;
                commentsContainer.appendChild(commentElement);
              });
            })
            .catch(error => {
              console.error("Сталася помилка при отриманні коментарів:", error);
            });
        });
      } else {
        postContainer.style.display = "none";
        postTitle.textContent = "";
        postBody.textContent = "Пост не знайдено.";
      }
    })
    .catch(error => {
      console.error("Сталася помилка при виконанні запиту:", error);
    });
}
