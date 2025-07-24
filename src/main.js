// Отримання постів
async function getPosts() {
  try {
    const response = await fetch("http://localhost:3000/blog");
    return await response.json();
  } catch (error) {
    console.error("Помилка отримання постів:", error);
    return [];
  }
}

// Рендер постів
function createPostsHTML(posts) {
  return posts
    .map(
      (post) => `
    <div class="post">
      <h2>${post.title}</h2>
      <p><strong>Автор:</strong> ${post.blogname}</p>
      <img src="${post.image}" alt="${post.title}" style="max-width:300px;">
      <div class="meta">
        <p class="views">Перегляди: ${post.views}</p>
        <p class="favorites">Улюблене: ${post.favorites}</p>
        <p class="comments">Коментарі: ${post.comments}</p>
        <p class="downloads">Завантаження: ${post.downloads}</p>
      </div>
      <div class="user">
        <img src="${post.userImageURL}" alt="Аватар" style="width:50px; height:50px; border-radius:50%;">
        <p>User ID: ${post.user_id}</p>
      </div>
      <button class="editPostButton" data-id="${post.id}">Редагувати</button>
      <button class="deletePostButton" data-id="${post.id}">Видалити</button>
    </div>
  `
    )
    .join("");
}

function renderPosts(posts) {
  const container = document.getElementById("postsContainer");
  container.innerHTML = createPostsHTML(posts);
}

// Створення поста
async function createBlogApi(newBlog) {
  const option = {
    method: "POST",
    body: JSON.stringify(newBlog),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };
  return await fetch("http://localhost:3000/blog", option);
}

// Оновлення поста
async function updatePost(id, updatedPost) {
  try {
    const option = {
      method: "PUT",
      body: JSON.stringify(updatedPost),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    };
    await fetch(`http://localhost:3000/blog/${id}`, option);
  } catch (error) {
    console.error("Помилка оновлення поста:", error);
  }
}

// Видалення поста
async function deletePost(id) {
  try {
    const response = await fetch(`http://localhost:3000/blog/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(
        `Помилка видалення поста з id ${id}. Статус: ${response.status}`
      );
    }

    console.log(`Пост з id ${id} успішно видалено`);
    return true;
  } catch (error) {
    console.error("Помилка видалення поста:", error);
    return false;
  }
}

// Старт застосунку
async function startApp() {
  const posts = await getPosts();
  renderPosts(posts);
}

startApp();

// Обробка форми створення
const form = document.getElementById("createPostForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newBlog = {
    title: document.getElementById("titleInput").value.trim(),
    blogname: document.getElementById("blognameInput").value.trim(),
    image: document.getElementById("imageInput").value.trim(),
    userImageURL: document.getElementById("avatarInput").value.trim(),
    views: Number(document.getElementById("viewsInput").value),
    favorites: Number(document.getElementById("favoritesInput").value),
    downloads: Number(document.getElementById("downloadsInput").value),
    comments: Number(document.getElementById("commentsInput").value),
    user_id: Number(document.getElementById("userIdInput").value),
  };

  await createBlogApi(newBlog);
  form.reset();
  startApp();
});

// Обробка кнопок (редагування / видалення)
document.addEventListener("click", async (e) => {
  const target = e.target;

  // Редагування
  if (target.classList.contains("editPostButton")) {
    const id = target.dataset.id;
    const postDiv = target.parentElement;

    const updatedPost = {
      title: prompt(
        "Новий заголовок:",
        postDiv.querySelector("h2").textContent
      ),
      blogname: prompt(
        "Ім’я автора:",
        postDiv.querySelector("p").textContent.split(":")[1].trim()
      ),
      image: prompt("URL зображення:", postDiv.querySelector("img").src),
      userImageURL: prompt(
        "URL аватарки:",
        postDiv.querySelector(".user img").src
      ),
      views: Number(
        prompt(
          "Перегляди:",
          postDiv.querySelector(".views").textContent.replace(/\D/g, "")
        )
      ),
      favorites: Number(
        prompt(
          "Улюблене:",
          postDiv.querySelector(".favorites").textContent.replace(/\D/g, "")
        )
      ),
      comments: Number(
        prompt(
          "Коментарі:",
          postDiv.querySelector(".comments").textContent.replace(/\D/g, "")
        )
      ),
      downloads: Number(
        prompt(
          "Завантаження:",
          postDiv.querySelector(".downloads").textContent.replace(/\D/g, "")
        )
      ),
      user_id: Number(
        prompt(
          "ID користувача:",
          postDiv.querySelector(".user p").textContent.replace(/\D/g, "")
        )
      ),
    };

    if (updatedPost.title) {
      await updatePost(id, updatedPost);
      startApp();
    }
  }

  // Видалення
  if (target.classList.contains("deletePostButton")) {
    const id = target.dataset.id;
    await deletePost(id);
    startApp();
  }
});
