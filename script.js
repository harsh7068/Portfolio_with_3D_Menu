const username = 'harsh7068';
const maxPages = 1;
const hideForks = true;
const repoList = document.querySelector('.repo-list');
const reposSection = document.querySelector('.repos');
const filterInput = document.querySelector('.filter-repos');

// get information from github profile
const getProfile = async () => {
    const res = await fetch(
        `https://api.github.com/users/${username}`
    );
    const profile = await res.json();
    console.log(profile);
    displayProfile(profile);
};
getProfile();

// display infomation from github profile
const displayProfile = (profile) => {
    const userInfo = document.querySelector('.user-info');
    userInfo.innerHTML = `
        <figure>
            <img alt="user avatar" src=${profile.avatar_url} />
        </figure>
        <div>
            <h2><a href=${profile.blog}><strong>${profile.name}</strong></a></h2>
            <p>${profile.bio}</p>
            <p>
                <strong>Location:</strong> ${profile.location}
            </p>
            <p>
                <strong>@${profile.login} </strong>
                Repos: ${profile.public_repos}
                Gists: ${profile.public_gists}
            </p>
        </div>
    `;
};

// get list of user's public repos
const getRepos = async () => {
    let repos = [];
    let res;
    for (let i = 1; i <= maxPages; i++) {
        res = await fetch(
            `https://api.github.com/users/${username}/repos?&sort=pushed&per_page=100&page=${i}`
            
        );
        let data = await res.json();
        repos = repos.concat(data);
        
    }
    console.log(repos);
    // repos.sort((a, b) => b.forks_count - a.forks_count);
    // repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    displayRepos(repos);
    
};
getRepos();

// display list of all user's public repos
const displayRepos = (repos) => {
    const userHome = `https://github.com/${username}`
    filterInput.classList.remove('hide');
    for (const repo of repos) {
        if (repo.fork && hideForks) {
            continue;
        }

        const langUrl = `${userHome}?tab=repositories&q=&language=${repo.language}`
        const starsUrl = `${userHome}/${repo.name}/stargazers`
        const forksUrl = `${userHome}/${repo.name}/network/members`

        let listItem = document.createElement('li');
        listItem.classList.add('repo');
        listItem.innerHTML = `
            <h3>${repo.name}</h3>
            <span>${repo.description}</span> <br/><br/>`

        if (repo.stargazers_count > 0) {
            listItem.innerHTML += `<a href="${starsUrl}">
            <span>⭐ ${repo.stargazers_count}</span></a>`
        }

        if (repo.language) {
            listItem.innerHTML += `<a href="${langUrl}">
            <span>${devicons[repo.language]}</span></a>`
        }

        if (repo.forks_count > 0) {
            listItem.innerHTML += `<a href="${starsUrl}">
            <span>${devicons["Git"]} ${repo.forks_count}</span></a>`
        }

        if (repo.homepage && repo.homepage !== "") {
            listItem.innerHTML += `<br /> <br />
            <a class="link-btn" href=${repo.html_url}>Code ${devicons["Github"]}</a>
            <a class="link-btn" href=${repo.homepage}>Live ${devicons["Chrome"]}</a> <br />`;
        } else {
            listItem.innerHTML += `<br /> <br />
            <a class="link-btn" href=${repo.html_url}>View Project ${devicons["Github"]}</a><br />`;
        }

        repoList.append(listItem);
    }
};


// expense=50
// income=100
// const result = ((expense /   income) * 100)+ "%"
// console.log(result);

