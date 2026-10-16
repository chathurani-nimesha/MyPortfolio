const nav = document.getElementById('mainNav');
const progress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const cursorGlow = document.getElementById('cursorGlow');


window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 20);
  backToTop.classList.toggle('show', y > 500);

  const height = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${height ? (y / height) * 100 : 0}%`;

  document.querySelectorAll('section[id]').forEach(section => {
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
    if (link) link.classList.toggle('active', y >= top && y < bottom);
  });
});

backToTop.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const menu = document.getElementById('navbarNav');
    if (menu.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.addEventListener('mousemove', e => {
  if (cursorGlow) {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  }
});

document.getElementById('year').textContent = new Date().getFullYear();



async function loadGitHubProjects() {
  const container = document.getElementById("githubProjects");

  if (!container) {
    console.error("GitHub projects container not found.");
    return;
  }

  try {
    const response = await fetch(githubAPI);

    if (!response.ok) {
      throw new Error(`GitHub API returned status ${response.status}`);
    }

    const repositories = await response.json();

    // Exclude forks and sort projects by latest update.
    const projects = repositories
      .filter(repo => !repo.fork)
      .sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      )
      .slice(0, 6);

    container.replaceChildren();

    if (projects.length === 0) {
      container.innerHTML =
        '<div class="col-12"><p class="text-secondary">No public projects found.</p></div>';
      return;
    }

    projects.forEach((repo, index) => {
      // Bootstrap column
      const column = document.createElement("div");
      column.className = "col-md-6 col-lg-4 reveal";

      // Project card: reuse your existing CSS classes
      const card = document.createElement("article");
      card.className = "project-card h-100";

      // Top row and project number
      const top = document.createElement("div");
      top.className = "project-top";

      const number = document.createElement("span");
      number.className = "project-index";
      number.textContent = String(index + 1).padStart(2, "0");

      const links = document.createElement("div");
      links.className = "project-links";

      const githubLink = document.createElement("a");
      githubLink.href = repo.html_url;
      githubLink.target = "_blank";
      githubLink.rel = "noopener noreferrer";
      githubLink.setAttribute("aria-label", `View ${repo.name} on GitHub`);

      const githubIcon = document.createElement("i");
      githubIcon.className = "bi bi-github";
      githubLink.appendChild(githubIcon);
      links.appendChild(githubLink);

      top.append(number, links);

      // Visual: reuse the existing browser illustration
      const visual = document.createElement("div");
      visual.className = "project-visual browser-visual";

      const browser = document.createElement("div");
      browser.className = "browser-card";

      for (let i = 0; i < 3; i++) {
        browser.appendChild(document.createElement("span"));
      }

      const browserLines = document.createElement("div");
      browserLines.className = "browser-lines";
      browser.appendChild(browserLines);
      visual.appendChild(browser);

      // Project details
      const content = document.createElement("div");
      content.className = "project-content";

      const type = document.createElement("p");
      type.className = "project-type";
      type.textContent = "GITHUB REPOSITORY";

      const title = document.createElement("h3");
      title.textContent = repo.name;

      const description = document.createElement("p");
      description.textContent =
        repo.description || "A coding project from my GitHub profile.";

      const details = document.createElement("p");
      details.textContent =
        `${repo.language || "Language not specified"} · ` +
        `${repo.stargazers_count} stars · ${repo.forks_count} forks`;

      // Technology tags
      const tags = document.createElement("div");
      tags.className = "tag-row";

      const languageTag = document.createElement("span");
      languageTag.textContent = repo.language || "GitHub";
      tags.appendChild(languageTag);

      if (repo.topics && repo.topics.length > 0) {
        repo.topics.slice(0, 4).forEach(topic => {
          const tag = document.createElement("span");
          tag.textContent = topic;
          tags.appendChild(tag);
        });
      }

      // Repository button
      const button = document.createElement("a");
      button.className = "btn btn-outline-light btn-sm mt-3";
      button.href = repo.html_url;
      button.target = "_blank";
      button.rel = "noopener noreferrer";
      button.textContent = "View Repository ";

      const arrow = document.createElement("i");
      arrow.className = "bi bi-arrow-up-right ms-1";
      button.appendChild(arrow);

      content.append(type, title, description, details, tags, button);
      card.append(top, visual, content);
      column.appendChild(card);
      container.appendChild(column);

      // Register dynamically created cards with your reveal animation.
      if (typeof observer !== "undefined") {
        observer.observe(column);
      }
    });

  } catch (error) {
    console.error("Error loading GitHub projects:", error);

    container.replaceChildren();

    const message = document.createElement("div");
    message.className = "col-12 text-secondary";
    message.textContent =
      "Unable to load GitHub projects. Please try again later.";

    container.appendChild(message);
  }
}

loadGitHubProjects();


const githubUsername = "chathurani-nimesha";

const chosenProjects = [
    "Appointment-Booking-System",
    "Number-Guessing-Game",
    "iHungry-Burger-Shop---Swing-Application",
    "EmpowerHer",
    "Ali-Mithuru",
    "Contact-Organizer",
    "Static-Web-Project"

];

const githubAPI =
    `https://api.github.com/users/${githubUsername}/repos?per_page=100`;

async function loadChosenProjects() {
    const container = document.getElementById("featuredProjects");

    if (!container) return;

    container.replaceChildren();

    const loading = document.createElement("p");
    loading.className = "text-secondary";
    loading.textContent = "Loading selected projects...";
    container.appendChild(loading);

    try {
        const response = await fetch(githubAPI);

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const repositories = await response.json();

        // Match selected repository names with API results.
        const selected = chosenProjects
            .map(name =>
                repositories.find(repo =>
                    repo.name.toLowerCase() === name.toLowerCase()
                )
            )
            .filter(repo => repo && !repo.fork);

        container.replaceChildren();

        if (selected.length === 0) {
            const message = document.createElement("p");
            message.className = "text-secondary";
            message.textContent =
                "No selected repositories found. Check the repository names.";
            container.appendChild(message);
            return;
        }

        selected.forEach((repo, index) => {
            const column = document.createElement("div");
            column.className = "col-md-6 col-lg-4";

            const card = document.createElement("article");
            card.className = "project-card h-100";

            const top = document.createElement("div");
            top.className = "project-top";

            const number = document.createElement("span");
            number.className = "project-index";
            number.textContent = String(index + 1).padStart(2, "0");

            const links = document.createElement("div");
            links.className = "project-links";

            const iconLink = document.createElement("a");
            iconLink.href = repo.html_url;
            iconLink.target = "_blank";
            iconLink.rel = "noopener noreferrer";
            iconLink.setAttribute("aria-label", `View ${repo.name} on GitHub`);

            const icon = document.createElement("i");
            icon.className = "bi bi-github";
            iconLink.appendChild(icon);
            links.appendChild(iconLink);

            top.append(number, links);

            const visual = document.createElement("div");
            visual.className = "project-visual browser-visual";

            const browser = document.createElement("div");
            browser.className = "browser-card";

            for (let i = 0; i < 3; i++) {
                browser.appendChild(document.createElement("span"));
            }

            const lines = document.createElement("div");
            lines.className = "browser-lines";
            browser.appendChild(lines);
            visual.appendChild(browser);

            const content = document.createElement("div");
            content.className = "project-content";

            const type = document.createElement("p");
            type.className = "project-type";
            type.textContent = "FEATURED PROJECT";

            const title = document.createElement("h3");
            title.textContent = repo.name;

            const description = document.createElement("p");
            description.textContent =
                repo.description || "A project from my GitHub profile.";

            const details = document.createElement("p");
            details.textContent =
                `${repo.language || "Language not specified"} · ` +
                `${repo.stargazers_count} stars · ${repo.forks_count} forks`;

            const tags = document.createElement("div");
            tags.className = "tag-row";

            const language = document.createElement("span");
            language.textContent = repo.language || "GitHub";
            tags.appendChild(language);

            const button = document.createElement("a");
            button.className = "btn btn-outline-light btn-sm mt-3";
            button.href = repo.html_url;
            button.target = "_blank";
            button.rel = "noopener noreferrer";
            button.textContent = "View Repository ";

            const arrow = document.createElement("i");
            arrow.className = "bi bi-arrow-up-right ms-1";
            button.appendChild(arrow);

            content.append(type, title, description, details, tags, button);
            card.append(top, visual, content);
            column.appendChild(card);
            container.appendChild(column);
        });

    } catch (error) {
        console.error("Unable to load selected GitHub projects:", error);

        container.replaceChildren();

        const message = document.createElement("p");
        message.className = "text-secondary";
        message.textContent =
            "Unable to load projects. Please try again later.";
        container.appendChild(message);
    }
}

loadChosenProjects();
