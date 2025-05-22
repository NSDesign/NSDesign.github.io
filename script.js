document.addEventListener('DOMContentLoaded', () => {
    // Configuration for repositories
    const repos = {
        repo1: {
            owner: 'NSDeisgn',
            name: 'Drawing_App',
            branch: 'main',
            path: 'index.html'
        },
        repo2: {
            owner: 'NSDeisgn',
            name: 'InteractiveGradientGenerator',
            branch: 'main',
            path: 'index.html'
        },
        repo3: {
            owner: 'NSDeisgn',
            name: 'Interactive-Point-Blur-Image-Filter',
            branch: 'main',
            path: 'index.html'
        }
    };

    // Load default repository content
    loadRepoContent('repo1');

    // Add event listeners to menu buttons
    const buttons = document.querySelectorAll('#repo-menu button');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Clear active class from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            e.target.classList.add('active');
            
            // Load selected repository content
            const repoId = e.target.getAttribute('data-repo');
            loadRepoContent(repoId);
        });
    });

    // Function to load repository content
    function loadRepoContent(repoId) {
        const contentContainer = document.getElementById('content-container');
        contentContainer.innerHTML = '<div class="loading">Loading...</div>';
        
        const repo = repos[repoId];
        
        // Two ways to fetch content:

        // 1. Fetch from raw.githubusercontent.com
        const rawUrl = `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${repo.branch}/${repo.path}`;
        
        // 2. Fetch from GitHub Pages if the repo has it enabled
        // const pagesUrl = `https://${repo.owner}.github.io/${repo.name}`;
        
        fetch(rawUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html => {
                // Option 1: Sanitize HTML and insert (simplest but may break styling/scripts)
                contentContainer.innerHTML = sanitizeHTML(html);
                
                // Option 2: Use iframe (keeps styling but limited interaction)
                // contentContainer.innerHTML = `<iframe src="${pagesUrl}" width="100%" height="800px"></iframe>`;
            })
            .catch(error => {
                contentContainer.innerHTML = `<div class="error">Error loading content: ${error.message}</div>`;
            });
    }

    // Basic HTML sanitizer function
    function sanitizeHTML(html) {
        // Extract body content only to avoid head conflicts
        const bodyContent = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        return bodyContent ? bodyContent[1] : html;
    }
});
