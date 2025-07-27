## Installation on a Clean MacOS

### Dependencies:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 
- [VSCode](https://code.visualstudio.com/)
- [Homebrew](https://brew.sh/)

### Next Steps
```bash
brew install php
```
```bash
brew install composer
```
```bash
brew install npm
```

Add this to ```~/.zshrc```:
```bash
alias sail='[ -f sail ] && bash sail || bash vendor/bin/sail'
```
Reload the terminal window.

### In the ```back``` Folder
```bash
composer update
```

## Running on Development
Run a project:
```
sail up -d
```

Completely re-build the database:
```
sail php artisan migrate:fresh --seed
```

Run the queue worker (for jobs, notifications, etc.):
```
sail php artisan queue:work
```

### Other Useful Commands
Run unit tests:
```
php artisan test
```


### Test Emails with MailHog
MailHog is included in the Docker setup for local email testing. After running the project with `sail up -d`, you can view test emails sent by the application by opening your browser and navigating to [http://localhost:8025](http://localhost:8025). All outgoing emails will appear in the MailHog web interface.
